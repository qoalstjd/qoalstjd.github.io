window.initModule = ({ root, params }) => {
    const titleEl = root.querySelector(".dialog-title p");
    if (!titleEl) return;
    titleEl.insertAdjacentHTML(
        "afterbegin",
        `<svg class="wh-24">
            <use href="#ui-${params.tag === "새소식" ? "bell" : "document"}"></use>
        </svg>`
    );
};
