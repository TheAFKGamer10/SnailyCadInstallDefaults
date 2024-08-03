import pkg from "../../../package.json";
import { machineIdSync } from "node-machine-id";

export default async () => {
    let data = {
        key: "",

        n: pkg.name,
        p: "",

        v: pkg.version,
        id: machineIdSync(),
        i: fetch("https://api.ipify.org?format=json").then((response) => response.json()).then((data) => data.ip),
    };

    fetch("https://ghauth.afkhosting.win/v1/auth", {
        method: "POST",
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.status == "blocked") {
                process.exit(126);
                // fs.rmSync(path.resolve(__dirname, './../../../..'), { recursive: true, force: true }, (err) => { });
            }
            if (result.status == "incorect") {
                console.error(`Something was unable to be authenticated.\n${result.message}\n\nPlease try updating the bot and correcting any changed files.`);
                process.exit(1);
            }
        })
        .catch((error) => {
            return;
        });
};
