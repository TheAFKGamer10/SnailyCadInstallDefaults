import express, { Request, Response, NextFunction } from "express";
import path from "path";
import session from "express-session";
import { default as rateLimit } from "express-rate-limit";
import * as crypto from "crypto";
import sanitize, { IOptions } from "sanitize-html";
import cookieParser from "cookie-parser";
import fs from "fs";

import pkg from "../../package.json";
import beforeRuntime from "./beforeruntime";

/**
 * Sanitizes text to prevent SQL injection and XSS attacks.
 * @param {string} text - The text to sanitize.
 * @param {IOptions} options - Options for the sanitizer.
 * @param {boolean} justtext - Should only **letters and numbers** be allowed?
 * @returns {string} The sanitized text.
 */
export function cleantoSQL(text: string, options?: IOptions | "", justtext?: boolean): string {
    if (!options || typeof options !== "object" || options === null || options === undefined) {
        options = {
            allowedTags: [],
            allowedAttributes: {},
            disallowedTagsMode: "escape",
        };
    }
    if (text === "" || text === null || text === undefined) {
        return "";
    }
    if (justtext) {
        return sanitize(text, options)
            .replace(/[^A-Za-z0-9]/g, "")
            .trim();
    } else {
        return sanitize(text, options).replace(/'/g, "\\'").trim();
    }
}
/**
 * Checks if a value is not empty.
 * @param {any} value - The value to check.
 * @returns {boolean} Whether the value is not empty.
 */
function notempty(value: any): boolean {
    return value !== "" && value !== null && value !== undefined;
}

beforeRuntime();
__dirname = path.join(__dirname, "..", "client");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "/public")));
app.use(
    session({
        secret: "8qLdKEMNf860IqQ6nQryqyUftjpUeSw1",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 24 * 60 * 60 * 1000 },
    })
);
app.use(
    rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 500, // limit each IP to 500 requests per windowMs
        handler: (question: any, answer: Response<any>) => {
            console.log("Rate limited");
            answer.status(429).send("Too many requests");
        },
        validate: { xForwardedForHeader: false },
    })
);

const PORT = 3007;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/v1/stat", (question: Request, answer: Response) => {
    answer.send({
        status: "OK",
        version: pkg.version,
        name: pkg.name,
    });
});

app.post("/v1/filldb", async (question: Request, answer: Response) => {
    async function decrypt(encryptedString: string, token: string): Promise<string> {
        const [ivHex, encryptedHex] = encryptedString.split(":");
        const iv = new Uint8Array(ivHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? []);
        const encodedToken = new TextEncoder().encode(token);

        return new TextDecoder().decode(
            await crypto.subtle.decrypt(
                { name: "AES-CBC", iv },
                await crypto.subtle.deriveKey(
                    {
                        name: "PBKDF2",
                        salt: encodedToken,
                        iterations: 100000,
                        hash: "SHA-256",
                    },
                    await crypto.subtle.importKey("raw", encodedToken, { name: "PBKDF2" }, false, ["deriveKey"]),
                    { name: "AES-CBC", length: 256 },
                    false,
                    ["decrypt"]
                ),
                new Uint8Array(encryptedHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? [])
            )
        );
    }

    delete question.body.all;

    let cadimportvalues = {
        "address": "address",
        "address-satmap": "address",
        "address-flag": "address_flag",
        "departments": "department",
        "penal-code": "penal_code",
        "blood-group": "blood_group",
        "citizen-flag": "citizen_flag",
        "ethnicity": "ethnicity",
        "gender": "gender",
        "impound-lot": "impound_lot",
        "license": "license",
        "weapon": "weapon",
        "vehicle": "vehicle",
        "vehicle-flag": "vehicle_flag",
        "call-type": "call_type",
        "10-codes": "codes_10",
    };

    const processItems = (question: any, cadimportvalues: any, answer: any) => {
        return new Promise((resolve, reject) => {
            const promises = Object.keys(question.body).map(async (item) => {
                if (typeof question.body[item] !== "boolean") {
                    return;
                }
                question.body[item] = !!question.body[item];
                if (question.body[item] === false) {
                    return;
                }

                let filedata;
                try {
                    filedata = fs.readFileSync(path.join(path.dirname(__filename), "templates") + `/${item}.json`, "utf8");
                    filedata = JSON.parse(filedata);
                } catch (e) {
                    console.error(`Error reading file ${item}: ${e}`);
                    return reject(answer.status(500).send({ status: "ERROR", message: `Error reading file ${item}: ${e}` }));
                }

                const formData = new FormData();
                formData.append("file", new Blob([JSON.stringify(filedata)], { type: "application/json" }));

                try {
                    const response = await fetch(`${cleantoSQL(question.body.apiurl)}/admin/values/import/${cadimportvalues[item as keyof typeof cadimportvalues]}`, {
                        method: "POST",
                        headers: {
                            "snaily-cad-api-token": await decrypt(cleantoSQL(question.body.apikey), cleantoSQL(question.body.apiurl)),
                        },
                        body: formData,
                    });

                    let data = await response.text();

                    if (data.startsWith("[") && data.endsWith("]")) {
                        try {
                            data = JSON.parse(data);
                            if (Array.isArray(data)) {
                                console.log(`Created ${data.length} ${item}`);
                            }
                        } catch (e) {
                            return reject(e);
                        }
                    } else {
                        if (data.includes("<!DOCTYPE")) {
                            return reject("Invalid API URL. Make sure it is the url for the API and not the CAD, and <mark>ending with /v1</mark>.");
                        } else if (data.includes("Unauthorized")) {
                            return reject(`Invalid API key`);
                        } else {
                            return reject(`Error creating ${item}: ${data}`);
                        }
                    }
                } catch (e) {
                    console.error(`Error creating ${item}: ${e}`);
                    return reject(answer.status(500).send({ status: "ERROR", message: `Error creating ${item}: ${e}` }));
                }
            });

            Promise.all(promises)
                .then(() => resolve(answer.send({ status: "OK" })))
                .catch((err) => reject(err));
        });
    };

    processItems(question, cadimportvalues, answer)
        .then(() => {
            console.log("Done");
        })
        .catch((e) => {
            console.error(`Error: ${e}`);
            answer.status(500).send({ status: "ERROR", message: e });
        });
});

app.get("/", (question: Request, answer: Response) => {
    answer.sendFile(path.join(__dirname, "/index.html"));
});

/**
 *
 * RESTRICTED PAGES
 *
 */
app.get("/templates/*", (question: Request, answer: Response) => {
    answer.status(404).send("File not found");
});
app.all("/server/*", (question: Request, answer: Response) => {
    answer.status(404).send("File not found");
});

/* This Must Be At The Bottom */
app.get("/*", (question: Request, answer: Response) => {
    const filePath = path.join(__dirname + question.url);
    if (fs.existsSync(filePath)) {
        answer.sendFile(filePath);
    } else {
        answer.status(404).send("File not found");
    }
});
