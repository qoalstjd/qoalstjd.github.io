const iconList = {
    root: null,
    init(root) {
        this.root = root;
        const groups = this.groupSymbols();
        this.render(groups);
        this.bind();
    },
    groupSymbols() {
        const groups = {};
        this.root
            .closest("body")
            .querySelectorAll("symbol")
            .forEach((s) => {
                const [prefix] = s.id.split("-");
                (groups[prefix] ??= []).push(s);
            });
        return groups;
    },
    render(groups) {
        Object.entries(groups).forEach(([prefix, symbols]) => {
            const section = document.createElement("section");
            section.innerHTML = `
            <h2 class="mt-24 mb-12">${prefix}</h2>
            <ul class="grid min-120 gap-12 ta-c" data-bind="ico"></ul>
        `;
            const ul = section.querySelector("ul");
            symbols.forEach((s) => {
                ul.insertAdjacentHTML(
                    "beforeend",
                    `<li class="box pd-12 flx col ai-c" data-id="${s.id}">
                    <svg width="24" height="24">
                        <use href="#${s.id}"></use>
                    </svg>
                    <p class="fs-12 mt-4">${s.querySelector("title")?.textContent ?? ""}</p>
                    <p class="fs-12 txt-700">${s.querySelector("desc")?.textContent ?? ""}</p>
                </li>`
                );
            });
            this.root.appendChild(section);
        });
    },
    bind() {
        this.root.addEventListener("click", (e) => {
            if (e.target.closest("li[data-id]")) {
                const id = e.target.closest("li").dataset.id;
                navigator.clipboard.writeText(`<svg><use href="#${id}"></use></svg>`);
            }
        });
    },
};

export function init({ root }) {
    iconList.init(root);
}
