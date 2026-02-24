window.initModule = ({ root, params }) => {
    root.querySelector(".dialog-title p").insertAdjacentHTML(
        "afterbegin",
        `<select data-field="tag">
            ${["새소식", "공지"].map((t) => `<option value="${t}" ${t === params.tag ? "selected" : ""}>${t}</option>`).join("")}
        </select>`
    );
    root.querySelector(".element").addEventListener("click", (e) => {
        if (e.target.closesest('[data-act="h2"]')) {
            console.log("h2");
        }
        if (e.target.closesest('[data-act="p"]')) {
            console.log("p");
        }
        if (e.target.closesest('[data-act="hr"]')) {
            console.log("hr");
        }
        if (e.target.closesest('[data-act="ul"]')) {
            console.log("ul");
        }
        if (e.target.closesest('[data-act="ol"]')) {
            console.log("ol");
        }
        if (e.target.closesest('[data-act="img"]')) {
            console.log("img");
        }
    });
    root.querySelector(".util").addEventListener("click", (e) => {
        if (e.target.closesest('[data-act="up"]')) {
            console.log("up");
        }
        if (e.target.closesest('[data-act="down"]')) {
            console.log("down");
        }
        if (e.target.closesest('[data-act="del"]')) {
            console.log("del");
        }
    });
    root.querySelector('[data-act="apply"]').onclick = () => {
        const turndownService = new TurndownService();
        const md = turndownService.turndown(root.querySelector('[data-field="content"]').innerHTML);
        const dlg = window.dialog.stack.at(-1);
        dlg?.apply?.({
            tag: root.querySelector('[data-field="tag"]').value,
            title: root.querySelector('[data-field="title"]').textContent.trim(),
            content: md,
        });
    };
};
