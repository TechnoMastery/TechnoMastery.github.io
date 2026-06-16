// ===== PTF =====
const ptfLink = "https://technomastery.github.io/PotoFluxAppData/ptfVersion/main.json";

async function buildVersionList() {
    const res = await fetch(ptfLink);
    const data = await res.json();

    const mainDiv = document.getElementById("ptfVersions");
    mainDiv.innerHTML = "";

    // fill main
    mainDiv.appendChild(document.createTextNode("All download for potoflux"));
    mainDiv.appendChild(document.createElement("br"));
    mainDiv.appendChild(document.createTextNode("Changelog for each versions is available on the corresponding github release page, you can access it by clicking the first link of the row."));

    // mk list
    const ul = document.createElement("ul");

    for (const [version, vData] of Object.entries(data.versions)) {
        const li = document.createElement("li");

        // title
        const titleLink = document.createElement("a");
        titleLink.href = data.releasePage + "tag/" + version;
        titleContent = (vData.type == null ? "Release" : vData.type) + " " + version;
        if (vData.title != null) {
            titleContent += ": " + vData.title;
        }
        if (version == data.lastestVersion) {
            titleContent += " - Lastest";
        }
        titleLink.textContent = titleContent;

        // source
        const hasSource = vData.hasSource == null ? true : vData.hasSource;
        const sourceDl = document.createElement(hasSource ? "a" : "i");
        if (hasSource) {
            sourceDl.textContent = "Download source code";
            sourceDl.href = data.releasePage + "downloads/" + version + "/PotoFlux-" + version + "-sources.jar";
        } else {
            sourceDl.textContent = "There are no source jar for this version.";
        }

        li.appendChild(titleLink);
        li.appendChild(document.createTextNode(" | "));
        li.appendChild(sourceDl);

        ul.appendChild(li);
    }

    mainDiv.appendChild(ul);
    
    // mk pre release disclaimer
    const preReleaseDisclaimer = document.createElement("i");
    
    preReleaseDisclaimer.appendChild(document.createTextNode("Pre-Releases are "));
    const preReleaseUnstable = document.createElement("strong");
    preReleaseUnstable.textContent = "unstable";
    preReleaseDisclaimer.appendChild(preReleaseUnstable);
    preReleaseDisclaimer.appendChild(document.createTextNode(" and might not even boot."));

    mainDiv.appendChild(preReleaseDisclaimer);

}

// ===== MODS =====
async function buildList(metaData) {
    const res = await fetch(metaData.jsonLink);
    const data = await res.json();

    const div = document.getElementById("mod-" + metaData.id + "-content");
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
    versionsTitle.textContent = "Versions of this mod:";

    div.appendChild(versionsTitle);

    const versions = data.tempVersions;
    const rootUl = document.createElement("ul");

    for (const [modVersion, versionData] of Object.entries(versions)) {
        const li = document.createElement("li");
        li.id = "mod-" + metaData.id + "-v" + modVersion;

        // === main title ===
        const title = document.createElement("span");

        // link to release
        const name = document.createElement("a");
        name.textContent = modVersion;
        name.href = data.link + "releases/tag/" + modVersion + "/";
        name.target = "_blank";

        // source dl if present
        const hasSources = versionData.hasSources == null ? true : versionData.hasSources;
        const sourceDl = hasSources ?
            document.createElement("a") :
            document.createElement("i");
        sourceDl.textContent = hasSources ?
            "Download source code" :
            "There are no source jar for this version.";
        if (hasSources) {
            sourceDl.href = data.link + "releases/download/" + modVersion +
            "/" + data.jarName + modVersion + "-sources.jar";
        }

        title.appendChild(name);
        title.appendChild(document.createTextNode(" | "));
        title.appendChild(sourceDl);

        li.appendChild(title);

        // ======

        li.appendChild(document.createElement("br"));

        // === javadoc ===
        const doc = document.createElement("span");
        const hasOnlineDoc = versionData.hasOnlineDoc == null ? true : versionData.hasOnlineDoc;
        const hasDocJar = versionData.hasDocJar == null ? true : versionData.hasDocJar;

        if (hasOnlineDoc || hasDocJar) {
            // title
            const docTitle = document.createElement("strong");
            docTitle.textContent = "Javadoc: ";

            // link to doc
            const docLink = hasOnlineDoc ?
                document.createElement("a") :
                document.createElement("i");
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
            docDl.textContent = hasDocJar ?
                "Download" : "There are no Javadoc jar for this version."
            if (hasDocJar) {
                docDl.href = data.link + "releases/download/" + modVersion +
                "/" + data.jarName + modVersion + "-javadoc.jar";
            }

            doc.appendChild(docTitle);
            doc.appendChild(docLink);
            doc.appendChild(document.createTextNode(" | "));
            doc.appendChild(docDl);

        } else {
            const fallback = document.createElement("i");
            fallback.textContent = "There are no Javadoc available for this version.";
            doc.appendChild(fallback);
        }

        li.appendChild(doc);

        // ======

        li.appendChild(document.createElement("br"));
        
        // === sub ul - compatible ptf version ===

        if (versionData.compatList != null) {

            const subUl = document.createElement("ul");
            
            const compatTitle = document.createElement("span");
            compatTitle.textContent = "This version of the mod is compatible with those Potoflux versions:";

            for (const compat of versionData.compatList) {
                const subLi = document.createElement("li");
                subLi.textContent = compat;
                subUl.appendChild(subLi);
            }
            li.appendChild(compatTitle);
            li.appendChild(subUl);

        } else {
            
            const noCompat = document.createElement("i")
            const noCompatTitle = document.createElement("strong");
            noCompatTitle.textContent = "There are no compatible version specified.";

            noCompat.appendChild(noCompatTitle);
            noCompat.appendChild(document.createElement("br"));
            noCompat.appendChild(document.createTextNode("Maybe this mod uses the local compatible version system, or it is only compatible with versions of Potoflux that doesn't feature online version yet."))

            li.appendChild(noCompat);

        }

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

buildList(potoModCoolMeta);