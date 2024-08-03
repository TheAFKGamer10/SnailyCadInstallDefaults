import { announcement, pageloaded } from "./main";
import { createform, Data } from "./public/js/form";

async function fillpageloded() {
    let data: Data = {
        "API URL": {
            type: "text",
            description: "The API URL of your CAD.<br /><b>Must include <code>/v1</code> at the end of the URL.</b>",
            descriptionusehtml: true,
            required: true,
            inputmode: "url",
            hint: "https://cad-api.example.com/v1",
        },
        "API Key": {
            type: "text",
            description: "The API Key of your CAD.<br />Can be found at <code>/admin/manage/cad-settings</code>",
            descriptionusehtml: true,
            required: true,
            hint: "sng_...",
        },
        "Values to Import": {
            type: "checkbox",
            description: "The values to import from your CAD.<br/ >The values can be found on the <a href='https://docs.snailycad.org/docs/templates'>SnailyCad Website</a>.",
            descriptionusehtml: true,
            required: false,
            clearall: true,
            options: [
                {
                    value: "selectall",
                    text: "Select All",
                    header: true,
                },
                {
                    value: "all",
                    text: "All",
                    checkwith: ["address", "address-flag", "departments", "penal-code", "blood-group", "citizen-flag", "ethnicity", "gender", "impound-lot", "license", "weapon", "vehicle", "vehicle-flag", "call-type", "10-codes", "situation-codes"],
                },
                {
                    value: "certain",
                    text: "Certain Values",
                    header: true,
                },
                {
                    value: "address",
                    text: "Addresses (1000's). <a style=\"color: inherit;\" href='https://forum.cfx.re/t/release-postal-code-map-minimap-new-improved-v1-3/147458' target='_blank'>Map Used</a>",
                    cannotbecheckedwith: ["address-satmap"],
                },
                {
                    value: "address-satmap",
                    text: "Addresses (100's). <a style=\"color: inherit;\" href='https://forum.cfx.re/t/release-free-high-resolution-satellite-map-with-custom-postals/2503527' target='_blank'>Map Used</a>",
                    cannotbecheckedwith: ["address"],
                },
                {
                    value: "address-flag",
                    text: "Address Flags",
                },
                {
                    value: "departments",
                    text: "Departments",
                },
                {
                    value: "penal-code",
                    text: "Penal Codes",
                },
                {
                    value: "blood-group",
                    text: "Blood groups",
                },
                {
                    value: "citizen-flag",
                    text: "Citizen Flags",
                },
                {
                    value: "ethnicity",
                    text: "Ethnicities",
                },
                {
                    value: "gender",
                    text: "Genders",
                },
                {
                    value: "impound-lot",
                    text: "Impound Lots",
                },
                {
                    value: "license",
                    text: "Licenses",
                },
                {
                    value: "weapon",
                    text: "Weapons",
                },
                {
                    value: "vehicle",
                    text: "Vehicles",
                },
                {
                    value: "vehicle-flag",
                    text: "Vehicle Flags",
                },
                {
                    value: "call-type",
                    text: "Call Types",
                },
                {
                    value: "10-codes",
                    text: "10 Codes",
                },
            ],
        },
    };

    createform(data);
}

async function submit() {
    window.scrollTo({ top: 0, behavior: "smooth" });

    (document.getElementById("sumbitbtn") as HTMLButtonElement).disabled = true;
    announcement("Submitting...", `Submitting the configuration to the server. Please wait...`, "info", false);

    let data = {} as any;
    let inputs = document.getElementsByClassName("input") as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].type === "checkbox") {
            data[inputs[i].id.replace("input_", "").toLowerCase().replace(/\s/g, "")] = inputs[i].checked;
        } else if (inputs[i].type === "radio") {
            if (inputs[i].checked) {
                data[inputs[i].name.replace("input_", "").toLowerCase().replace(/\s/g, "")] = inputs[i].value;
            }
        } else {
            data[inputs[i].id.replace("input_", "").toLowerCase().replace(/\s/g, "")] = inputs[i].value;
        }

        if (inputs[i].required && inputs[i].value == "") {
            announcement("Error!", `Fields marked with stars are required!`, "warning", true);
            (document.getElementById("sumbitbtn") as HTMLButtonElement).disabled = false;
            return;
        }
    }

    if (!/^sng_/.test(data.apikey) || !/^https?:\/\/.*\/v1$/.test(data.apiurl)) {
        if (!/^sng_/.test(data.apikey)) {
            // console.error("Invalid API key.");
            // answer.status(400).send({ status: "ERROR", message: "Invalid API key. Use the global API key starting with <code>sng_</code>" });
            announcement("Error!", `Invalid API key. Use the global API key starting with <code>\`sng_\`</code>`, "danger", true);
        } else if (!/^https?:\/\/.*\/v1$/.test(data.apiurl)) {
            // console.error("Invalid API URL.");
            // answer.status(400).send({ status: "ERROR", message: "Invalid API URL. Make sure it is the url for the API and not the CAD.<br />In the format <code>http(s)://YOUR_API_URL/v1</code>" });
            announcement("Error!", `Invalid API URL. Make sure it is the url for the API and not the CAD.<br />In the format <code>http(s)://YOUR_API_URL/v1</code>`, "danger", true);
        }
        (document.getElementById("sumbitbtn") as HTMLButtonElement).disabled = false;

        return; // Exit early if any condition is not met
    }

    async function encrypt(plainText: string, token: string): Promise<string> {
        const enc = new TextEncoder();
        const encodedToken = enc.encode(token);
        const iv = crypto.getRandomValues(new Uint8Array(16));

        return `${Array.from(iv)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")}:${Array.from(
            new Uint8Array(
                await crypto.subtle.encrypt(
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
                        ["encrypt"]
                    ),
                    enc.encode(plainText)
                )
            )
        )
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")}`;
    }

    data.apikey = await encrypt(data.apikey, data.apiurl);

    fetch(`/v1/filldb`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then(async (data) => {
            (document.getElementById("sumbitbtn") as HTMLButtonElement).disabled = false;
            if (data.status == "OK") {
                announcement(`Database Filled!`, `The database has been filled with the values selected!`, "success", false);

                (document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>).forEach((checkbox) => {
                    checkbox.checked = false;
                });
            } else {
                announcement("Error!", data.message || `An error occurred while submitting the configuration! Please check the console for error details. ${data != undefined ? `<br />Error: ${data}` : ""}`, "danger", false);
            }
        })
        .catch((e) => {
            console.error("Error:", e);
            announcement("Error!", `An error occurred while submitting the configuration! Please check the console for error details. ${e != undefined ? `<br />Error: ${e}` : ""}`, "danger", false);
        });
}

function onPageLoad() {
    pageloaded();
    fillpageloded();
}

window.onload = onPageLoad;
declare global {
    interface Window {
        submit: any;
    }
}

window.submit = submit;
