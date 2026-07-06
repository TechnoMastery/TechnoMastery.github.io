const typeFilterSection = {
    title: "Version types",
    id: "version-type",
    mode: "any",
    parameters: {
        filterLastest: {
            defaultValue: true,
            id: "lastest-releases",
            name: "Lastest and Releases"
        },
        filterRC: {
            defaultValue: true,
            id: "rc",
            name: "Release Candidates (RCs)"
        },
        filterOldRC: {
            defaultValue: false,
            id: "old-rc",
            name: "Old RCs"
        },
        filterAlphaBeta: {
            defaultValue: false,
            id: "alpha-beta",
            name: "Alphas / Betas"
        }
    }
};

function createFilterSection(mainDivId, ...filters) {
    // main div
    const container = document.createElement("div");
    container.classList.add("filter-container");

    // header
    const header = document.createElement("div");
    header.classList.add("filter-header");
    // header's title
    const headerTitle = document.createElement("h3");
    headerTitle.textContent = "Filter versions";
    // reset btn
    const resetButton = document.createElement("button");
    resetButton.className = "buttons button-blue filter-reset-button reset-filter";
    resetButton.textContent = "Reset";
    resetButton.addEventListener('click', () => {
        filters.forEach(({id: filterID, parameters}) => {
            Object.entries(parameters).forEach(([parameterKey, {defaultValue, id: parameterID, name}]) => {
                const input = document.querySelector(`#${mainDivId} .${filterID} .${parameterID}`);
                input.checked = defaultValue;
            });
        });
        applyFilters(mainDivId, ...filters);
    });

    header.appendChild(headerTitle);
    header.appendChild(resetButton);
    container.appendChild(header);

    // filter sections
    const sections = document.createElement("div");
    sections.classList.add("filter-sections");

    for (const filter of filters) {
        // mk section
        const section = document.createElement("div");
        section.classList.add("filter-section");
        section.className = filter.id;
        // title
        const sectionTitle = document.createElement("span");
        sectionTitle.className = "filter-section-title";
        sectionTitle.textContent = filter.title;

        // == OPTIONS ==
        const sectionOptions = document.createElement("div");
        sectionOptions.className = "filter-options";

        for (const [title, {defaultValue, id, name}] of Object.entries(filter.parameters)) {
            const option = document.createElement("label");
            option.className = "filter-checkbox-label";
            // input
            const input = document.createElement("input");
            input.type = "checkbox";
            input.className = id;
            input.checked = defaultValue;
            input.addEventListener('change', () => applyFilters(mainDivId, ...filters));

            const custom = document.createElement("span");
            custom.className = "custom-checkbox";

            option.appendChild(input);
            option.appendChild(custom);
            option.appendChild(document.createTextNode(name));

            sectionOptions.appendChild(option);

        }

        section.appendChild(sectionTitle);
        section.appendChild(sectionOptions);

        sections.appendChild(section)
    }

    container.appendChild(sections);
    return container;
}
function applyFilters(mainDivId, ...filters) {
    const filtersValues = {};
    const filterMods = {};

    filters.forEach(({id: filterID, mode, parameters}) => {
        filtersValues[filterID] = {};
        filterMods[filterID] = mode;
        Object.entries(parameters).forEach(([, {id: parameterID}]) => {
            const input = document.querySelector(`#${mainDivId} .${filterID} .${parameterID}`);
            filtersValues[filterID][parameterID] = input?.checked ?? false;
        });
    });

    const cards = document.querySelectorAll(`#${mainDivId} .version-card`);
    cards.forEach(card => {
        let displayed = true;
        Object.entries(filtersValues).forEach(([filterID, parameters]) => {
            const needAll = filterMods[filterID] === "all";
            let passesFilter = needAll;
            Object.entries(parameters).forEach(([parameterID, checked]) => {
                const hasParameter = card.getAttribute(filterID+"|"+parameterID) === "true";
                if (checked) {
                    if (needAll && !hasParameter) passesFilter = false;
                    if (!needAll && hasParameter) passesFilter = true;
                }
            });
            if (!passesFilter) displayed = false;
        });
        if (displayed) card.classList.remove("hide");
        else card.classList.add("hide");
    });
}

function getVersionType(rlType, isOldRc) {
    if (rlType === ("Alpha" || "Beta")) return "alpha-beta";
    if (isOldRc != null) return isOldRc ? "old-rc" : "rc";
    return "lastest-releases";
}
