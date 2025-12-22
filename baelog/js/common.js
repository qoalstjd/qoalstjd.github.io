window.rootDir = "baelog";
window.defaultTheme = "dark";

const common = {
    init(root = document) {
        this.lnb(root);
    },

    lnb(root) {
        const wrap = document.querySelector(".wrap");
        if (!wrap) return;

        const hasLnb = wrap.querySelector(".lnb");
        wrap.classList.toggle("has-lnb", !!hasLnb);
    },
};

window.common = common;