// ===== PTF =====
const ptfLink = "https://technomastery.github.io/PotoFluxAppData/ptfVersion/main.json";

const typeFilters = {
    "filter-name-lastest": true,
    "filter-name-rc": true,
    "filter-name-old-rc": false,
    "filter-name-beta-alpha": false
};
const mainFilters = [
    "filter-name-sources", "filter-name-online-doc", "filter-name-doc-jar"
];
const ptfOnlyFilters = [
    "filter-name-msi"
];
const modOnlyFilters = [
    "filter-name-lastest-for", "filter-name-compatible-with"
];

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

    // mk filter
    mainDiv.appendChild(getFilterSection("PTF"));

    // ===

    // mk list
    const ul = document.createElement("ul");
    ul.className = "version-list";

    for (const [version, vData] of Object.entries(data.versions)) {
        const li = document.createElement("li");
        li.className = "version-card";
        li.id = `ptf-v${version}-card`;
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

        // Set datasets for filtering
        li.dataset.type = getLiType(isLastest, rlType, vData.isOldRc);
        li.dataset.sources = (vData.hasSources == null ? true : vData.hasSources).toString();
        li.dataset.onlineDoc = (vData.hasOnlineDoc == null ? true : vData.hasOnlineDoc).toString();
        li.dataset.docJar = (vData.hasDocJar == null ? true : vData.hasDocJar).toString();
        li.dataset.msi = (vData.hasMsi == null ? true : vData.hasMsi).toString();

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

    mkFiltersEvents(ptfOnlyFilters, "ptfVersions");
    applyFilters(ptfOnlyFilters, "ptfVersions");
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
async function buildModList(metaData) {
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
        let lastestFor = {list: []};
        let compatibleWith = {list: []};

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
                compatibleWith[compatibleWith.list.length] = compatVersion;

                for (const [ptfV, lastest] of Object.entries(lastestForPtf))
                    if (ptfV === compatVersion && lastest === modVersion) {
                        subLi.classList.add("lastest-for");
                        lastestForAny = true;
                        lastestFor.list[lastestFor.list.length] = ptfV;
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
            if (type === "Alpha") {
                li.classList.add("alpha");
                hasAlpha = true;
            }
            else if (type === "Beta") {
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

        // Set datasets for filtering
        li.dataset.type = getLiType(lastestForLastest, type, versionData.isOldRc);
        li.dataset.sources = hasSources.toString();
        li.dataset.onlineDoc = hasOnlineDoc.toString();
        li.dataset.docJar = hasDocJar.toString();
        li.dataset.lastestFor = JSON.stringify(lastestFor);
        li.dataset.compatibleWith = JSON.stringify(compatibleWith);

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
    // applyFilters();
}

function getLiType(isLastest, rlType, isOldRc) {
    if (isLastest) return "lastest";
    else {
        if (rlType === "Alpha") return "alpha";
        else if (rlType === "Beta") return "beta";
        else if (isOldRc != null) return isOldRc ? "old-rc" : "rc";
        else return "release";
    }
}

// ===== Filtering System =====
function applyFilters(optionals, mainDivID) {
    const typeFiltersValues = {};
    const optionalFiltersValues = {};

    Object.entries(typeFilters).forEach(([id, value]) => {
        const checkbox = document.querySelector(`#${mainDivID} .${id}`);
        typeFiltersValues[id] = checkbox ? checkbox.checked : value;
    });

    mainFilters.forEach(filter => {
        const checkbox = document.querySelector(`#${mainDivID} .${filter}`);
        optionalFiltersValues[filter] = checkbox ? checkbox.checked : false;
    });
    optionals.forEach(filter => {
        const checkbox = document.querySelector(`#${mainDivID} .${filter}`);
        optionalFiltersValues[filter] = checkbox ? checkbox.checked : false;
    });

    const cards = document.querySelectorAll(`#${mainDivID} .version-card`);
    cards.forEach(card => {
        const type = card.dataset.type; // latest, release, rc, old-rc, alpha, beta
        const hasSources = card.dataset.sources === 'true';
        const hasOnlineDoc = card.dataset.onlineDoc === 'true';
        const hasDocJar = card.dataset.docJar === 'true';

        // === PTF only ===
        const hasMsi = card.dataset.msi === 'true';

        // === MOD only ===
        // TODO

        // Check type match
        let typeMatch = false;
        Object.entries(typeFiltersValues).forEach(([id, value]) => {
            if (id === "filter-name-lastest" && (type === 'lastest' || type === 'release')) typeMatch = value;
            if (id === "filter-name-rc" && type === 'rc') typeMatch = value;
            if (id === "filter-name-old-rc" && type === 'old-rc') typeMatch = value;
            if (id === "filter-name-beta-alpha" && (type === 'alpha' || type === 'beta')) typeMatch = value;
        });

        // Check feature matches (AND conditions)
        let featuresMatch = true;
        Object.entries(optionalFiltersValues).forEach(([id, value]) => {
            // -- main --
            if (id === "filter-name-sources" && value === true && !hasSources) featuresMatch = false;
            if (id === "filter-name-online-doc" && value === true && !hasOnlineDoc) featuresMatch = false;
            if (id === "filter-name-doc-jar" && value === true && !hasDocJar) featuresMatch = false;

            // -- PTF only --
            if (id === "filter-name-msi" && value === true && !hasMsi) featuresMatch = false;

            // -- mod only --
            // TODO

        })

        if (typeMatch && featuresMatch) card.classList.remove('hide');
        else card.classList.add('hide');
    });
}
function mkFiltersEvents(optionalList, mainDivID) {

    Object.entries(typeFilters).forEach(([id, value]) => {
        const checkbox = document.querySelector(`#${mainDivID} .${id}`);
        if (checkbox) checkbox.addEventListener('change', () => applyFilters(optionalList, mainDivID));
    });
    mainFilters.forEach(filter => {
        const checkbox = document.querySelector(`#${mainDivID} .${filter}`);
        if (checkbox) checkbox.addEventListener('change', () => applyFilters(optionalList, mainDivID));
    })
    optionalList.forEach(filter => {
        const checkbox = document.querySelector(`#${mainDivID} .${filter}`);
        if (checkbox) checkbox.addEventListener('change', () => applyFilters(optionalList, mainDivID));
    })

    const resetBtn = document.querySelector(`#${mainDivID} .reset-filter`);
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {

            Object.entries(typeFilters).forEach(([id, value]) => {
                const checkbox = document.querySelector(`#${mainDivID} .${id}`);
                if (checkbox) checkbox.checked = value;
            });

            mainFilters.forEach(filter => {
                const checkbox = document.querySelector(`#${mainDivID} .${filter}`);
                if (checkbox) checkbox.checked = false;
            })

            optionalList.forEach(filter => {
                const checkbox = document.querySelector(`#${mainDivID} .${filter}`);
                if (checkbox) checkbox.checked = false;
            })

            applyFilters(optionalList, mainDivID);
        });
    }
}

function getFilterSection(optionalListName) {
    // ===== MAIN DIV =====
    const container = document.createElement("div");
    container.className = "filter-container";

    // ==== HEADER ====
    const header = document.createElement("div");
    header.className = "filter-header";
    // --- HEADER title ---
    const headerTitle = document.createElement("h3");
    headerTitle.textContent = "Filter versions";
    // --- reset btn ---
    const resetBtn = document.createElement("button");
    resetBtn.className = "buttons button-blue filter-reset-button reset-filter";
    resetBtn.textContent = "Reset";
    // ---
    header.appendChild(headerTitle);
    header.appendChild(resetBtn);
    // ====
    container.appendChild(header);

    // ==== SECTIONS ====
    const sections = document.createElement("div");
    sections.className = "filter-sections";

    // === SECTION type ===
    const typeSection = document.createElement("div");
    typeSection.className = "filter-section";
    // --- title ---
    const typeSectionTitle = document.createElement("span");
    typeSectionTitle.className = "filter-section-title";
    typeSectionTitle.textContent = "Version types";

    // == OPTIONS ==
    const typeSectionOptions = document.createElement("div");
    typeSectionOptions.className = "filter-options";
    // -- Lastest & releases --
    const typeSectionOptionLastestReleases = document.createElement("label");
    typeSectionOptionLastestReleases.className = "filter-checkbox-label";
    // - input -
    const typeSectionOptionLastestReleasesInput = document.createElement("input");
    typeSectionOptionLastestReleasesInput.type = "checkbox";
    typeSectionOptionLastestReleasesInput.className = "filter-name-lastest";
    typeSectionOptionLastestReleasesInput.checked = typeFilters["filter-name-lastest"];
    // - custom -
    const typeSectionOptionLastestReleasesCustom = document.createElement("span");
    typeSectionOptionLastestReleasesCustom.className = "custom-checkbox";
    // -
    typeSectionOptionLastestReleases.appendChild(typeSectionOptionLastestReleasesInput);
    typeSectionOptionLastestReleases.appendChild(typeSectionOptionLastestReleasesCustom);
    typeSectionOptionLastestReleases.appendChild(document.createTextNode("Lastest and Releases"));
    // -- RCs --
    const typeSectionOptionRCs = document.createElement("label");
    typeSectionOptionRCs.className = "filter-checkbox-label";
    // - input -
    const typeSectionOptionRCsInput = document.createElement("input");
    typeSectionOptionRCsInput.type = "checkbox";
    typeSectionOptionRCsInput.className = "filter-name-rc";
    typeSectionOptionRCsInput.checked = typeFilters["filter-name-rc"];
    // - custom -
    const typeSectionOptionRCsCustom = document.createElement("span");
    typeSectionOptionRCsCustom.className = "custom-checkbox";
    // -
    typeSectionOptionRCs.appendChild(typeSectionOptionRCsInput);
    typeSectionOptionRCs.appendChild(typeSectionOptionRCsCustom);
    typeSectionOptionRCs.appendChild(document.createTextNode("Release Candidates (RC)"));
    // -- old RCs --
    const typeSectionOptionOldRCs = document.createElement("label");
    typeSectionOptionOldRCs.className = "filter-checkbox-label";
    // - input -
    const typeSectionOptionOldRCsInput = document.createElement("input");
    typeSectionOptionOldRCsInput.type = "checkbox";
    typeSectionOptionOldRCsInput.className = "filter-name-old-rc";
    typeSectionOptionOldRCsInput.checked = typeFilters["filter-name-old-rc"];
    // - custom -
    const typeSectionOptionOldRCsCustom = document.createElement("span");
    typeSectionOptionOldRCsCustom.className = "custom-checkbox";
    // -
    typeSectionOptionOldRCs.appendChild(typeSectionOptionOldRCsInput);
    typeSectionOptionOldRCs.appendChild(typeSectionOptionOldRCsCustom);
    typeSectionOptionOldRCs.appendChild(document.createTextNode("Old RCs"));
    // -- Alpha Beta --
    const typeSectionOptionAlphaBeta = document.createElement("label");
    typeSectionOptionAlphaBeta.className = "filter-checkbox-label";
    // - input -
    const typeSectionOptionAlphaBetaInput = document.createElement("input");
    typeSectionOptionAlphaBetaInput.type = "checkbox";
    typeSectionOptionAlphaBetaInput.className = "filter-name-beta-alpha";
    typeSectionOptionAlphaBetaInput.checked = typeFilters["filter-name-beta-alpha"];
    // - custom -
    const typeSectionOptionAlphaBetaCustom = document.createElement("span");
    typeSectionOptionAlphaBetaCustom.className = "custom-checkbox";
    // -
    typeSectionOptionAlphaBeta.appendChild(typeSectionOptionAlphaBetaInput);
    typeSectionOptionAlphaBeta.appendChild(typeSectionOptionAlphaBetaCustom);
    typeSectionOptionAlphaBeta.appendChild(document.createTextNode("Alpha / Beta"));
    // ==
    typeSectionOptions.appendChild(typeSectionOptionLastestReleases);
    typeSectionOptions.appendChild(typeSectionOptionRCs);
    typeSectionOptions.appendChild(typeSectionOptionOldRCs);
    typeSectionOptions.appendChild(typeSectionOptionAlphaBeta);

    // ===
    typeSection.appendChild(typeSectionTitle);
    typeSection.appendChild(typeSectionOptions);

    // === SECTION features ===
    const featuresSection = document.createElement("div");
    featuresSection.className = "filter-section";
    // --- title ---
    const featuresSectionTitle = document.createElement("span");
    featuresSectionTitle.className = "filter-section-title";
    featuresSectionTitle.textContent = "Required features";

    // == OPTIONS ==
    const featuresSectionOptions = document.createElement("div");
    featuresSectionOptions.className = "filter-options";
    // -- Source code --
    const featuresSectionOptionSource = document.createElement("label");
    featuresSectionOptionSource.className = "filter-checkbox-label";
    // - input -
    const featuresSectionOptionSourceInput = document.createElement("input");
    featuresSectionOptionSourceInput.type = "checkbox";
    featuresSectionOptionSourceInput.className = "filter-name-sources";
    // - custom -
    const featuresSectionOptionSourceCustom = document.createElement("span");
    featuresSectionOptionSourceCustom.className = "custom-checkbox";
    // -
    featuresSectionOptionSource.appendChild(featuresSectionOptionSourceInput);
    featuresSectionOptionSource.appendChild(featuresSectionOptionSourceCustom);
    featuresSectionOptionSource.appendChild(document.createTextNode("Has Source Code"));
    // -- Online doc --
    const featuresSectionOptionOnlineDoc = document.createElement("label");
    featuresSectionOptionOnlineDoc.className = "filter-checkbox-label";
    // - input -
    const featuresSectionOptionOnlineDocInput = document.createElement("input");
    featuresSectionOptionOnlineDocInput.type = "checkbox";
    featuresSectionOptionOnlineDocInput.className = "filter-name-online-doc";
    // - custom -
    const featuresSectionOptionOnlineDocCustom = document.createElement("span");
    featuresSectionOptionOnlineDocCustom.className = "custom-checkbox";
    // -
    featuresSectionOptionOnlineDoc.appendChild(featuresSectionOptionOnlineDocInput);
    featuresSectionOptionOnlineDoc.appendChild(featuresSectionOptionOnlineDocCustom);
    featuresSectionOptionOnlineDoc.appendChild(document.createTextNode("Has Online Doc"));
    // -- Doc jar --
    const featuresSectionOptionDocJar = document.createElement("label");
    featuresSectionOptionDocJar.className = "filter-checkbox-label";
    // - input -
    const featuresSectionOptionDocJarInput = document.createElement("input");
    featuresSectionOptionDocJarInput.type = "checkbox";
    featuresSectionOptionDocJarInput.className = "filter-name-doc-jar";
    // - custom -
    const featuresSectionOptionDocJarCustom = document.createElement("span");
    featuresSectionOptionDocJarCustom.className = "custom-checkbox";
    // -
    featuresSectionOptionDocJar.appendChild(featuresSectionOptionDocJarInput);
    featuresSectionOptionDocJar.appendChild(featuresSectionOptionDocJarCustom);
    featuresSectionOptionDocJar.appendChild(document.createTextNode("Has Doc Jar"));
    // ==
    featuresSectionOptions.appendChild(featuresSectionOptionSource);
    featuresSectionOptions.appendChild(featuresSectionOptionOnlineDoc);
    featuresSectionOptions.appendChild(featuresSectionOptionDocJar);

    // ===
    featuresSection.appendChild(featuresSectionTitle);
    featuresSection.appendChild(featuresSectionOptions);

    // ====
    sections.appendChild(typeSection);
    sections.appendChild(featuresSection);

    // ==== MORE FEATURES ====
    if (optionalListName === "PTF") {

        // -- Doc jar --
        const featuresSectionOptionMsi = document.createElement("label");
        featuresSectionOptionMsi.className = "filter-checkbox-label";
        // - input -
        const featuresSectionOptionMsiInput = document.createElement("input");
        featuresSectionOptionMsiInput.type = "checkbox";
        featuresSectionOptionMsiInput.className = "filter-name-msi";
        // - custom -
        const featuresSectionOptionMsiCustom = document.createElement("span");
        featuresSectionOptionMsiCustom.className = "custom-checkbox";
        // -
        featuresSectionOptionMsi.appendChild(featuresSectionOptionMsiInput);
        featuresSectionOptionMsi.appendChild(featuresSectionOptionMsiCustom);
        featuresSectionOptionMsi.appendChild(document.createTextNode("Has Msi Installer"));

        // ==
        featuresSectionOptions.appendChild(featuresSectionOptionMsi);

    }
    if (optionalListName === "MOD") {

        // TODO

    }

    // =====
    container.appendChild(sections);

    return container;

}

// ===== call ptf inits =====
buildPtfList();

// ===== build for all mods =====

// card learning
const cardLearningMeta = {
    jsonLink: "https://technomastery.github.io/PotoFluxAppData/modVersions/cardLearning.json",
    id: "cardLearning"
}
buildModList(cardLearningMeta);

// todomod
const todomodMeta = {
    jsonLink: "https://technomastery.github.io/PotoFluxAppData/modVersions/todomod.json",
    id: "todoMod"
}
buildModList(todomodMeta);

// encrypmod
const encrypModMeta = {
    jsonLink: "https://technomastery.github.io/PotoFluxAppData/modVersions/encrypMod.json",
    id: "encrypMod"
}
buildModList(encrypModMeta);

// bad life coach
const badlifecoachMeta = {
    jsonLink: "https://technomastery.github.io/PotoFluxAppData/modVersions/badLifeCoach.json",
    id: "badlifecoach"
}
buildModList(badlifecoachMeta);

// potoModCool
const potoModCoolMeta = {
    jsonLink: "https://nomutiliser.github.io/nomutiliser/potoModCool/versions.json",
    id: "potoModCool"
}
// buildModList(potoModCoolMeta);

// impossible tic-tac-toe
const impossibleTicTacToeMeta = {
    jsonLink: "https://technomastery.github.io/PotoFluxAppData/modVersions/impossibleTicTacToe.json",
    id: "impossibleTicTacToe"
}
buildModList(impossibleTicTacToeMeta);