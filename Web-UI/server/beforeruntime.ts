import fs from "fs";
import path from "path";

export default function beforeRuntime() {
    let replaceTemplatesDir = path.join(__dirname, "templates");
    let templatesDir = path.join(path.dirname(__filename), "templates");
    if (!fs.existsSync(templatesDir)) {
        fs.mkdirSync(templatesDir, { recursive: true });
    }
    if (!fs.existsSync(replaceTemplatesDir)) {
        fs.mkdirSync(replaceTemplatesDir, { recursive: true });
    }
    let fetchkeys = ["address", "address-satmap", "address-flag", "departments", "penal-code", "blood-group", "citizen-flag", "ethnicity", "gender", "impound-lot", "license", "weapon", "vehicle", "vehicle-flag", "call-type", "10-codes", "situation-codes"];

    for (let i = 0; i < fetchkeys.length; i++) {
        let key = fetchkeys[i];
        let replaceFilePath = path.join(replaceTemplatesDir, `${key}.json`);
        let templateFilePath = path.join(templatesDir, `${key}.json`);

        if (fs.existsSync(replaceFilePath)) {
            // Replace the contents from replaceTemplatesDir to templatesDir
            let data = fs.readFileSync(replaceFilePath, "utf-8");
            fs.writeFileSync(templateFilePath, data);
        } else {
            // Fetch the file if it doesn't exist in replaceTemplatesDir
            fetch(`https://docs.snailycad.org/templates/${key}.json`, {
                method: "GET",
            })
                .then((response) => response.json())
                .catch((e) => {
                    console.error(`Error fetching department ${key}: ${e}`);
                })
                .then((data) => {
                    fs.writeFileSync(templateFilePath, JSON.stringify(data));
                });
        }
    }
}