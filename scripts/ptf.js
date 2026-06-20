// ===== PTF =====
const ptfLink = "https://technomastery.github.io/PotoFluxAppData/ptfVersion/main.json";

async function getLastestPtf() {
    const res = await fetch(ptfLink);
    const data = await res.json();

    return data.lastestVersion;
}

function getRcDisclaimer() {
    const preReleaseDisclaimer = document.createElement("i");
    preReleaseDisclaimer.className = "rc-disclaimer";
    preReleaseDisclaimer.appendChild(document.createTextNode("Release Candidates (RCs) are releases that need to be tested. If they are bug-free, they "));
    const preReleaseBold = document.createElement("strong");
    preReleaseBold.textContent = "can become the official Lastest version.";
    preReleaseDisclaimer.appendChild(preReleaseBold);
    return preReleaseDisclaimer;
}
function getAlphaDisclaimer() {
    const alphaDisclaimer = document.createElement("i");
    alphaDisclaimer.className = "alpha-disclaimer";
    alphaDisclaimer.appendChild(document.createTextNode("Alphas version are still in development, with "));
    const alphaBugs = document.createElement("strong");
    alphaBugs.textContent = "huge bugs";
    alphaDisclaimer.appendChild(alphaBugs);
    alphaDisclaimer.appendChild(document.createTextNode(" and "));
    const alphaFunc = document.createElement("strong");
    alphaFunc.textContent = "unfinished functionalities";
    alphaDisclaimer.appendChild(alphaFunc);
    alphaDisclaimer.appendChild(document.createTextNode(". They are mainly there for the users that wants to test in early access the features."));
    return alphaDisclaimer;
}
function getBetaDisclaimer() {
    const betaDisclaimer = document.createElement("i");
    betaDisclaimer.className = "beta-disclaimer";
    betaDisclaimer.appendChild(document.createTextNode("Beta versions are "));
    const betaUnfinished = document.createElement("strong");
    betaUnfinished.textContent = "unfinished";
    betaDisclaimer.appendChild(betaUnfinished);
    betaDisclaimer.appendChild(document.createTextNode(" and are published for bug-hunting purposes. The main functionalities are already done however."));
    return betaDisclaimer;
}

async function buildPtfList() {
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
    mainDiv.appendChild(getRcDisclaimer());
    // mk beta disclaimer
    mainDiv.appendChild(getBetaDisclaimer());
    // mk alpha disclaimer
    mainDiv.appendChild(getAlphaDisclaimer());

    // ===

    // mk list
    const ul = document.createElement("ul");
    ul.className = "version-list";

    for (const [version, vData] of Object.entries(data.versions)) {
        const li = document.createElement("li");
        li.className = "version-card";
        const isLastest = version === data.lastestVersion;
        if (isLastest) li.classList.add("lastest-version");

        const rlType = vData.type == null ? "Release" : vData.type;
        if (!isLastest) {

            if (rlType === "Alpha")
                li.classList.add("alpha");
            else if (rlType === "Beta")
                li.classList.add("beta");

            else {
                const rc = vData.isOldRc;
                if (rc != null) li.classList.add(rc ? "old-rc" : "rc");
            }

        }

        // title
        const titleLink = document.createElement("a");
        titleLink.className = "version-title";
        titleLink.href = data.releasePage + "tag/" + version;
        let titleContent = rlType + " " + version;
        if (vData.title != null) {
            titleContent += ": " + vData.title;
        }
        if (isLastest) titleContent += " - Lastest";

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

        const dl = getDlButtons(data, version, vData);
        li.appendChild(dl);

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
function getDlButtons(data, version, vData) {
    const dl = document.createElement("span");
    dl.className = "version-meta";

    const hasMsi = vData.hasMsi == null ? true : vData.hasMsi;

    if (hasMsi) {
        const title = document.createElement("strong");
        title.textContent = "Available installers :";

        const msiLink = document.createElement(hasMsi ? "a" : "i");
        msiLink.className = hasMsi ? "version-action" : "version-note";
        msiLink.textContent = hasMsi ? "Windows - msi" : "There are no .msi installers for this version.";
        if (hasMsi) msiLink.href = `${data.releasePage}downloads/${version}/PotoFlux-${version}.msi`;

        dl.appendChild(title);
        dl.appendChild(msiLink);
    } else {
        const fallback = document.createElement("i");
        fallback.className = "version-note";
        fallback.textContent = "There are no installer for this version.";
        dl.appendChild(fallback);
    }

    return dl;
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

    const versions = data.versions;
    const lastestForPtf = data.lastestForPtf;
    const lastestPtf = await getLastestPtf();

    const versionsTitle = document.createElement("span");
    versionsTitle.textContent = (!versions || Object.keys(versions).length === 0) ? "No versions published." : "Versions of this mod :";

    div.appendChild(versionsTitle);

    const rootUl = document.createElement("ul");
    rootUl.className = "version-list";

    let hasRC = false;
    let hasBeta = false;
    let hasAlpha = false;
    let hasLastForLast = false;

    for (const [modVersion, versionData] of Object.entries(versions)) {
        const li = document.createElement("li");
        li.id = "mod-" + metaData.id + "-v" + modVersion;
        li.className = "version-card";

        const type = versionData.type == null ? "Release" : versionData.type;

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
        let lastestForLastest = false;

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
                        if (ptfV === lastestPtf) lastestForLastest = true;
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

        // === type - class def ===
        if (lastestForLastest) {
            li.classList.add("lastest-version");
            hasLastForLast = true;
        } else {
            if (versionData.type === "Alpha") {
                li.classList.add("alpha");
                hasAlpha = true;
            }
            else if (versionData.type === "Beta") {
                li.classList.add("beta");
                hasBeta = true;
            }
            else {
                const rc = versionData.isOldRc;
                if (rc != null) {
                    li.classList.add(rc ? "old-rc" : "rc");
                    hasRC = true;
                }
            }
        }

        rootUl.appendChild(li);
    }

    if (hasLastForLast) {
        const last = document.createElement("i");
        last.classList.add("lastest-info");
        last.textContent = "The version labeled 'Lastest' is the lastest version for the lastest Potoflux version.";
        div.appendChild(last);
    }
    if (hasRC) div.appendChild(getRcDisclaimer());
    if (hasBeta) div.appendChild(getBetaDisclaimer());
    if (hasAlpha) div.appendChild(getAlphaDisclaimer());

    div.appendChild(rootUl);
}

// ===== call ptf inits =====
buildPtfList();

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