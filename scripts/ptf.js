// ===== PTF =====
const ptfLink = "https://technomastery.github.io/PotoFluxAppData/ptfVersion/main.json";

async function buildVersionList() {
    const res = await fetch(ptfLink);
    const data = await res.json();

    const mainDiv = document.getElementById("ptfVersions");
    mainDiv.classList.add("version-panel");
    mainDiv.innerHTML = "";

    // fill main
    mainDiv.appendChild(document.createTextNode("All download for potoflux."));
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createTextNode("Changelog for each versions is available on the corresponding github release page, you can access it by clicking the first link of the row."));

    // mk lastest info
    const lastestInfo = document.createElement("i");
    lastestInfo.classList.add("lastest-info");
    lastestInfo.textContent = "The Lastest version is the most stable one, featuring all confirmed functionalities. This might be what you need if you're looking to download Potoflux for the first time, or updating from a very old version.";
    mainDiv.appendChild(lastestInfo);

    // mk pre-release disclaimer
    const preReleaseDisclaimer = document.createElement("i");
    preReleaseDisclaimer.className = "pre-release-disclaimer";
    preReleaseDisclaimer.appendChild(document.createTextNode("Pre-Releases are "));
    const preReleaseUnstable = document.createElement("strong");
    preReleaseUnstable.textContent = "unstable";
    preReleaseDisclaimer.appendChild(preReleaseUnstable);
    preReleaseDisclaimer.appendChild(document.createTextNode(" and might not even boot."));

    mainDiv.appendChild(preReleaseDisclaimer);

    // mk beta disclaimer
    const betaDisclaimer = document.createElement("i");
    betaDisclaimer.className = "beta-disclaimer";
    betaDisclaimer.appendChild(document.createTextNode("Beta versions are "));
    const betaUnstable = document.createElement("strong");
    betaUnstable.textContent = "highly unstable";
    betaDisclaimer.appendChild(betaUnstable);
    betaDisclaimer.appendChild(document.createTextNode(" and may contain breaking changes or critical bugs."));

    mainDiv.appendChild(betaDisclaimer);

    // ===

    // mk list
    const ul = document.createElement("ul");
    ul.className = "version-list";

    for (const [version, vData] of Object.entries(data.versions)) {
        const li = document.createElement("li");
        li.className = "version-card";
        if (version === data.lastestVersion) {
            li.classList.add("latest-version");
        }

        const rlType = vData.type == null ? "Release" : vData.type;
        if (vData.type === "Pre-Release") {
            li.classList.add("pre-release");
        }
        if (vData.type === "Beta") {
            li.classList.add("beta");
        }

        // title
        const titleLink = document.createElement("a");
        titleLink.className = "version-title";
        titleLink.href = data.releasePage + "tag/" + version;
        let titleContent = rlType + " " + version;
        if (vData.title != null) {
            titleContent += ": " + vData.title;
        }
        if (version === data.lastestVersion) {
            titleContent += " - Lastest";
        }
        titleLink.textContent = titleContent;

        // source
        const hasSource = vData.hasSources == null ? true : vData.hasSources;
        const sourceDl = document.createElement(hasSource ? "a" : "i");
        sourceDl.className = hasSource ? "version-action" : "version-note";
        if (hasSource) {
            sourceDl.textContent = "Download source code";
            sourceDl.href = data.releasePage + "downloads/" + version + "/PotoFlux-" + version + "-sources.jar";
        } else {
            sourceDl.textContent = "There are no source jar for this version.";
        }

        const title = document.createElement("span");
        title.className = "version-card-title";
        title.appendChild(titleLink);
        title.appendChild(sourceDl);

        li.appendChild(title);

        const doc = buildPtfDocButtons(data, version, vData);
        li.appendChild(doc);

        ul.appendChild(li);
    }

    mainDiv.appendChild(ul);

}
function buildPtfDocButtons(data, version, vData) {
    const doc = document.createElement("span");
    doc.className = "version-meta";

    const hasOnlineDoc = vData.hasOnlineDoc == null ? true : vData.hasOnlineDoc;
    const hasDocJar = vData.hasDocJar == null ? true : vData.hasDocJar;

    if (hasOnlineDoc || hasDocJar) {
        const docTitle = document.createElement("strong");
        docTitle.textContent = "Javadoc actions";

        const docLink = document.createElement(hasOnlineDoc ? "a" : "i");
        docLink.className = hasOnlineDoc ? "version-action" : "version-note";
        docLink.textContent = hasOnlineDoc ? "Consult" : "There are no consultable Javadoc published for this version.";
        if (hasOnlineDoc) {
            docLink.href = `https://technomastery.github.io/PotoFluxAppData/javadoc/${version}/index.html`;
            docLink.target = "_blank";
        }

        const docDl = document.createElement(hasDocJar ? "a" : "i");
        docDl.className = hasDocJar ? "version-action" : "version-note";
        docDl.textContent = hasDocJar ? "Download" : "There are no Javadoc jar for this version.";
        if (hasDocJar) {
            docDl.href = data.releasePage + "downloads/" + version + "/PotoFlux-" + version + "-javadoc.jar";
        }

        doc.appendChild(docTitle);
        doc.appendChild(docLink);
        doc.appendChild(docDl);
    } else {
        const fallback = document.createElement("i");
        fallback.className = "version-note";
        fallback.textContent = "There are no Javadoc available for this version.";
        doc.appendChild(fallback);
    }

    return doc;
}

// ===== MODS =====
async function buildList(metaData) {
    const res = await fetch(metaData.jsonLink);
    const data = await res.json();

    const div = document.getElementById("mod-" + metaData.id + "-content");
    div.classList.add("mod-version-panel");
    div.innerHTML = "";

    // ===== MAIN INFOS =====

    const githubLinkI = document.createElement("i");
    const githubLinkA = document.createElement("a");
    githubLinkA.textContent = "Github project page";
    githubLinkA.href = data.link;
    githubLinkA.target = "_blank";
    githubLinkI.appendChild(githubLinkA);
    div.appendChild(githubLinkI);

    div.appendChild(document.createElement("br"));

    const creator = document.createElement("span");
    const creatorTitle = document.createElement("strong");
    creatorTitle.textContent = "Creator: ";
    creator.appendChild(creatorTitle);
    creator.appendChild(document.createTextNode(data.owner));

    div.appendChild(creator);

    div.appendChild(document.createElement("br"));

    // ===== VERSION SYSTEM =====

    const versionsTitle = document.createElement("span");
    versionsTitle.textContent = "Versions of this mod :";

    div.appendChild(versionsTitle);

    const versions = data.tempVersions;
    const lastestForPtf = data.lastestForPtf;
    const rootUl = document.createElement("ul");
    rootUl.className = "version-list";

    for (const [modVersion, versionData] of Object.entries(versions)) {
        const li = document.createElement("li");
        li.id = "mod-" + metaData.id + "-v" + modVersion;
        li.className = "version-card";

        // === type ===
        const type = versionData.type == null ? "Release" : versionData.type;
        if (versionData.type === "Pre-Release")
            li.classList.add("pre-release");
        if (versionData.type === "Beta")
            li.classList.add("beta");

        // === main title ===
        const title = document.createElement("span");
        title.className = "version-card-title";

        // link to release
        const name = document.createElement("a");
        name.className = "version-title";
        name.textContent = type + " " + modVersion;
        name.href = data.link + "releases/tag/" + modVersion + "/";
        name.target = "_blank";

        // source dl if present
        const hasSources = versionData.hasSources == null ? true : versionData.hasSources;
        const sourceDl = hasSources ?
            document.createElement("a") :
            document.createElement("i");
        sourceDl.className = hasSources ? "version-action" : "version-note";
        sourceDl.textContent = hasSources ?
            "Download source code" :
            "There are no source jar for this version.";
        if (hasSources) {
            sourceDl.href = data.link + "releases/download/" + modVersion +
            "/" + data.jarName + modVersion + "-sources.jar";
        }

        title.appendChild(name);
        title.appendChild(sourceDl);

        li.appendChild(title);

        // ======

        // === javadoc ===
        const doc = document.createElement("span");
        doc.className = "version-meta";
        const hasOnlineDoc = versionData.hasOnlineDoc == null ? true : versionData.hasOnlineDoc;
        const hasDocJar = versionData.hasDocJar == null ? true : versionData.hasDocJar;

        if (hasOnlineDoc || hasDocJar) {
            // title
            const docTitle = document.createElement("strong");
            docTitle.textContent = "Javadoc actions";

            // link to doc
            const docLink = hasOnlineDoc ?
                document.createElement("a") :
                document.createElement("i");
            docLink.className = hasOnlineDoc ? "version-action" : "version-note";
            docLink.textContent = hasOnlineDoc ?
                "Consult" : "There are no consultable Javadoc published for this version."
            if (hasOnlineDoc) {
                docLink.href = data.docLink + modVersion;
                docLink.target = "_blank";
            }

            // dl doc
            const docDl = hasDocJar ?
                document.createElement("a") :
                document.createElement("i");
            docDl.className = hasDocJar ? "version-action" : "version-note";
            docDl.textContent = hasDocJar ?
                "Download" : "There are no Javadoc jar for this version."
            if (hasDocJar) {
                docDl.href = data.link + "releases/download/" + modVersion +
                "/" + data.jarName + modVersion + "-javadoc.jar";
            }

            doc.appendChild(docTitle);
            doc.appendChild(docLink);
            doc.appendChild(docDl);

        } else {
            const fallback = document.createElement("i");
            fallback.className = "version-note";
            fallback.textContent = "There are no Javadoc available for this version.";
            doc.appendChild(fallback);
        }

        li.appendChild(doc);

        // ======

        // === sub ul - compatible ptf version ===
        const compatSection = document.createElement("div");
        compatSection.className = "version-meta compat-meta";

        if (versionData.compatList != null) {

            const subUl = document.createElement("ul");
            subUl.className = "compat-list";
            
            const compatTitle = document.createElement("strong");
            compatTitle.className = "compat-title";
            compatTitle.textContent = "Compatible with Potoflux";

            let lastestForAny = false;

            for (const compatVersion of versionData.compatList) {
                const subLi = document.createElement("li");
                subLi.textContent = compatVersion;

                for (const [ptfV, lastest] of Object.entries(lastestForPtf))
                    if (ptfV === compatVersion && lastest === modVersion) {
                        subLi.classList.add("lastest-for");
                        lastestForAny = true;
                    }

                subUl.appendChild(subLi);
            }
            compatSection.appendChild(compatTitle);
            compatSection.appendChild(subUl);

            if (lastestForAny) {
                const strongGreen = document.createElement("strong");
                strongGreen.textContent = "green";

                const lastestInfo = document.createElement("i");
                lastestInfo.classList.add("lastest-info");
                lastestInfo.appendChild(document.createTextNode("This version is the lastest for the ones in "));
                lastestInfo.appendChild(strongGreen);

                compatSection.appendChild(lastestInfo);
            }

        } else {
            
            const noCompat = document.createElement("i")
            const noCompatTitle = document.createElement("strong");
            noCompatTitle.textContent = "There are no compatible version specified.";

            noCompat.appendChild(noCompatTitle);
            noCompat.appendChild(document.createElement("br"));
            noCompat.appendChild(document.createTextNode("Maybe this mod uses the local compatible version system, or it is only compatible with versions of Potoflux that doesn't feature online version yet."))

            compatSection.appendChild(noCompat);

        }

        li.appendChild(compatSection);

        rootUl.appendChild(li);
    }

    div.appendChild(rootUl);
}

// ===== call ptf inits =====
buildVersionList();

// ===== build for all mods =====

// card learning
const cardLearningMeta = {
    jsonLink: "https://technomastery.github.io/PotoFluxAppData/modVersions/cardLearning.json",
    id: "cardLearning"
}
buildList(cardLearningMeta);

// todomod
const todomodMeta = {
    jsonLink: "https://technomastery.github.io/PotoFluxAppData/modVersions/todomod.json",
    id: "todoMod"
}
buildList(todomodMeta);

// encrypmod
const encrypModMeta = {
    jsonLink: "https://technomastery.github.io/PotoFluxAppData/modVersions/encrypMod.json",
    id: "encrypMod"
}
buildList(encrypModMeta);

// bad life coach
const badlifecoachMeta = {
    jsonLink: "https://technomastery.github.io/PotoFluxAppData/modVersions/badLifeCoach.json",
    id: "badlifecoach"
}
buildList(badlifecoachMeta);

// potoModCool
const potoModCoolMeta = {
    jsonLink: "https://nomutiliser.github.io/nomutiliser/potoModCool/versions.json",
    id: "potoModCool"
}
// buildList(potoModCoolMeta);

// impossible tic-tac-toe
const impossibleTicTacToeMeta = {
    jsonLink: "https://technomastery.github.io/PotoFluxAppData/modVersions/impossibleTicTacToe.json",
    id: "impossibleTicTacToe"
}
buildList(impossibleTicTacToeMeta);