window.initModule = ({ root, params }) => {
    root.querySelector(".dialog-title p").insertAdjacentHTML(
        "afterbegin",
        `<select data-field="tag">
            ${["새소식", "공지"].map((t) => `<option value="${t}" ${t === params.tag ? "selected" : ""}>${t}</option>`).join("")}
        </select>`
    );
    async function editNews(id) {
        const tr = btn.closest("tr");
        const form = new FormData();
        form.append("id", id);
        form.append("tag", tr.querySelector('[data-field="tag"]').value);
        form.append("title", tr.querySelector('[data-field="title"]').textContent.trim());
        form.append("content", tr.querySelector('[data-field="content"]').textContent.trim());
        await fetch("/api/news.php?action=edit", {
            method: "POST",
            body: form,
            credentials: "same-origin",
        });
        loadNews();
    }
    root.querySelector('[data-act="applyNews"]').addEventListener("click", () => {
        editNews(params.id);
        window.ui.dialog.closeTop();
    });
};
