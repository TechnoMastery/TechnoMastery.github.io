const sep = document.createTextNode(" | ");

async function buildList(metaData) {
    const res = await fetch(metaData.jsonLink);
    const data = await res.json();

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
        name.href = data.releaseLink + "/tag/" + modVersion + "/";
        name.target = "_blank";

        // source dl if present
        const hasSources = versionData.hasSources;
        const sourceDl = hasSources ?
            document.createElement("a") :
            document.createElement("i");
        sourceDl.textContent = hasSources ?
            "Download source code" :
            "There are no source jar for this version.";
        if (hasSources) {
            sourceDl.href = data.releaseLink + "/download/" + modVersion +
            "/" + data.jarName + modVersion + "-sources.jar";
        }

        title.appendChild(name);
        title.appendChild(sep);
        title.appendChild(sourceDl);

        li.appendChild(title);

        // ======

        li.appendChild(document.createElement("br"));

        // === javadoc ===
        const doc = document.createElement("span");
        const hasOnlineDoc = versionData.hasOnlineDoc;
        const hasDocJar = versionData.hasDocJar;

        if (hasOnlineDoc || hasDocJar) {

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
                docDl.href = data.releaseLink + "/download/" + modVersion +
                "/" + data.jarName + modVersion + "-javadoc.jar";
            }

            doc.appendChild(docLink);
            doc.appendChild(sep);
            doc.appendChild(docDl);

        } else {
            const fallback = document.createElement("i");
            fallback.textContent = "There are no Javadoc available for this version.";
            doc.appendChild(fallback);
        }

        // ======

        li.appendChild(document.createElement("br"));
        
        // === sub ul - compatible ptf version ===
        const subUl = document.createElement("ul");
        
        const compatTitle = document.createElement("span");
        compatTitle.textContent = "This version of the mod is compatible with those Potoflux verions:";

        for (const compat of versionData.compatList) {
            const subLi = document.createElement("li");
            subLi.textContent = compat;
            subUl.appendChild(subLi);
        }

        li.appendChild(compatTitle);
        li.appendChild(subUl);
        rootUl.appendChild(li);
    }

    // inject
    const div = document.getElementById("mod-" + metaData.id + "-versions");
    div.innerHTML = "";
    div.appendChild(rootUl);
}

// ===== build for all mods =====

// card learning
const cardLearningMeta = {
    jsonLink: "https://technomastery.github.io/PotoFluxAppData/modVersions/cardLearning.json",
    id: "cardLearning"
}

buildList(cardLearningMeta);