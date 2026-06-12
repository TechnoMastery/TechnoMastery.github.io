const cardLearningLink = "https://technomastery.github.io/PotoFluxAppData/modVersions/cardLearning.json"
const cardLearningDiv = document.getElementById("modCardLearningVersions")
console.log(cardLearningDiv)

async function buildList(jsonLink, targetDiv) {
    const res = await fetch(jsonLink);
    const data = await res.json();

    const versions = data.versions;
    const rootUl = document.createElement("ul");

    for (const [modVersion, compatList] of Object.entries(versions)) {
        const li = document.createElement("li");

        // main title
        const title = document.createElement("span");
        title.textContent = modVersion;

        li.appendChild(title);
        
        // subtitle compat versions
        const subUl = document.createElement("ul");

        for (const compat of compatList) {
            const subLi = document.createElement("li");
            subLi.textContent = compat;
            subUl.appendChild(subLi);
        }

        li.appendChild(subUl);
        rootUl.appendChild(li);
    }

    // inject
    targetDiv.innerHTML = "";
    targetDiv.appendChild(rootUl);
}

buildList(cardLearningLink, cardLearningDiv);