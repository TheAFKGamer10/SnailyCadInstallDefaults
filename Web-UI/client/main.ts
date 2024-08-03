export function announcement(h1: string, p: string, type: "success" | "danger" | "warning" | "info", shouldtimeout: boolean) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    (document.getElementById("announcement") as HTMLDivElement).style.display = "flex";
    (document.getElementById("announcement-text-h1") as HTMLHeadingElement).innerHTML = h1;
    (document.getElementById("announcement-text-p") as HTMLParagraphElement).innerHTML = p;
    (document.getElementById("announcement") as HTMLDivElement).className = `announcement ${type}`;
    if (shouldtimeout) {
        setTimeout(closeAnnouncement, 5 * 1000);
    }
}

export function pageloaded() {
    // Light Dark Mode
    const topbarright = document.getElementById("top-bar-right") as HTMLDivElement;

    const colourmodeDiv = document.createElement("div") as HTMLDivElement;
    colourmodeDiv.id = "colourmode";
    colourmodeDiv.className = "colourmode";

    const lightdarkbutton = document.createElement("button") as HTMLButtonElement;
    lightdarkbutton.id = "lightdarkbutton";
    lightdarkbutton.className = "ldbutton";
    lightdarkbutton.onclick = changeld;

    const ldicon = document.createElement("img") as HTMLImageElement;
    ldicon.id = "ldicon";
    ldicon.className = "ldicon";

    lightdarkbutton.appendChild(ldicon);
    colourmodeDiv.appendChild(lightdarkbutton);
    topbarright.appendChild(colourmodeDiv);

    const body = document.getElementById("body") as HTMLBodyElement;
    const savedColor = sessionStorage.getItem("lightdark");
    if (savedColor === "light") {
        body.classList.remove("dark");
        body.classList.add("light");
        ldicon.src = "/public/img/sun.svg";
    } else if (savedColor === "dark") {
        body.classList.remove("light");
        body.classList.add("dark");
        ldicon.src = "/public/img/moon.svg";
    } else {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            body.classList.remove("light");
            body.classList.add("dark");
            ldicon.src = "/public/img/moon.svg";
        } else {
            body.classList.remove("dark");
            body.classList.add("light");
            ldicon.src = "/public/img/sun.svg";
        }
    }
    // prettier-ignore
    (document.getElementById("footer") as HTMLDivElement).innerHTML = `<!-- Plaese do not remove footer. It helps the developer of this software. --><p class="bigfooter"><a href="https://github.com/TheAFKGamer10/SnailyCadInstallDefaults" target="_blank" class="footerlink">SnailyCadInstallDefaults</a> by <a href="https://afkht.us/foot" target="_blank" class="footerlink">The AFK Gamer</a><br /><br /><a href="https://snailycad.org/" target="_blank" class="footerlink">SnailyCAD</a> is licensed under the <a href="https://opensource.org/license/mit" target="_blank" class="footerlink">MIT License</a> by <a href="https://github.com/casperiv0" target="_blank" class="footerlink">Casper</a> and <a href="https://github.com/SnailyCAD/snaily-cadv4" target="_blank" class="footerlink">the community</a>.</p><p class="smallfooter">No data is collected during the use of this software. Your API URL and API Key are never stored and are only used to interact with your SnailyCAD API. Your API Key is encrypted in transit and not visible to anyone.<br />If you suspect that your API Key has been compromised, please regenerate it in your SnailyCAD settings at \`<code>/admin/manage/cad-settings</code>\`.</p>`;
}

export function changeld() {
    const ldbutton = document.getElementById("lightdarkbutton") as HTMLButtonElement;
    const body = document.getElementById("body") as HTMLBodyElement;
    if (body.classList.contains("dark")) {
        body.classList.remove("dark");
        body.classList.add("light");
        ldbutton.innerHTML = `<img id="ldicon" class="ldicon" src="/public/img/sun.svg" /> `;
        sessionStorage.setItem("lightdark", "light");
    } else {
        body.classList.remove("light");
        body.classList.add("dark");
        ldbutton.innerHTML = `<img id="ldicon" class="ldicon" src="/public/img/moon.svg" /> `;
        sessionStorage.setItem("lightdark", "dark");
    }
}

export function closeAnnouncement() {
    const announcement = document.getElementById("announcement") as HTMLDivElement;
    if (announcement) {
        announcement.style.display = "none";
    }
}

var previousWidth = window.innerWidth;
window.addEventListener("resize", function () {
    var currentWidth = window.innerWidth;
    if (currentWidth > 800 && previousWidth <= 800) {
        location.reload();
    } else if (currentWidth <= 800 && previousWidth > 800) {
        location.reload();
    }
    previousWidth = currentWidth;
});
