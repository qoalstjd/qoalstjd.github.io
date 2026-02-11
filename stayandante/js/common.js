let lnbScrollCtrl;
let gnbCtrl;
const common = {
    init(root = document) {
        this.gnb();
        this.lnb();
    },
    gnb() {
        gnbCtrl?.abort();
        gnbCtrl = new AbortController();
        const gnb = document.querySelector(".gnb");
        if (!gnb) return;
        const btnMenu = document.querySelector(".menu-toggle");

        // PC hover 오픈/클로즈 애니메이션
        let isAnimating = false;
        let isMouseOnHeader = true;
        let prevLi = null;
        document.addEventListener(
            "mousemove",
            (e) => {
                const r = gnb.getBoundingClientRect();
                isMouseOnHeader = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
            },
            { once: true }
        );
        function dimToggle(show = true) {
            if (show) {
                let dimEl = document.createElement("div");
                dimEl.className = "dim ty-gnb";
                dimEl.style.zIndex = 998;
                document.documentElement.append(dimEl);
                dimEl.addEventListener("click", function () {
                    btnMenu.classList.remove("is-active");
                    dimEl.remove();
                });
            }
            if (!show && document.querySelector(".dim.ty-gnb")) {
                document.querySelector(".dim.ty-gnb").remove();
            }
        }
        document.addEventListener(
            "click",
            (e) => {
                const toggle = e.target.closest(".menu-toggle");
                if (!toggle) return;

                const hasDim = document.querySelector(".dim.ty-gnb");
                dimToggle(!hasDim);
            },
            { signal: gnbCtrl.signal }
        );
        document.addEventListener(
            "spa:change",
            (e) => {
                if (btnMenu.classList.contains("is-active")) {
                    btnMenu.classList.remove("is-active");
                }
                dimToggle(false);
            },
            { signal: gnbCtrl.signal }
        );
        const openHeader = () => {
            if (isAnimating || gnb.classList.contains("is-opened")) return;
            gnb.classList.add("is-opened");
            isAnimating = true;
            const done = (e) => {
                if (e.animationName !== "expand") return;
                isAnimating = false;
                gnb.removeEventListener("animationend", done);
            };
            gnb.addEventListener("animationend", done);
        };
        const closeHeader = () => {
            if (!gnb.classList.contains("is-opened")) return;
            if (isAnimating) {
                gnb.classList.remove("is-opened");
                isAnimating = false;
                return;
            }
            gnb.classList.remove("is-opened");
            gnb.classList.add("is-closing");
            isAnimating = true;
            const done = (e) => {
                if (e.animationName !== "shrink") return;
                gnb.classList.remove("is-closing");
                isAnimating = false;
                gnb.removeEventListener("animationend", done);
            };
            gnb.addEventListener("animationend", done);
        };
        // 화면 폭 기준으로 PC 동작 결정 (theme와 분리)
        gnb.addEventListener("mouseenter", () => {
            if (window.innerWidth < 1024) return;
            if (isMouseOnHeader) return;
            isMouseOnHeader = true;
            openHeader();
        });
        gnb.addEventListener("mouseleave", () => {
            if (window.innerWidth < 1024) return;
            isMouseOnHeader = false;
            prevLi = null;
            closeHeader();
        });
        gnb.addEventListener("mouseover", (e) => {
            if (window.innerWidth < 1024) return;
            if (!isMouseOnHeader || isAnimating) return;
            const li = e.target.closest("li, h1");
            if (!li || !gnb.contains(li)) return;
            if (prevLi !== null && li !== prevLi) openHeader();
            prevLi = li;
        });
    },
    lnb() {
        const gnbEl = document.querySelector(".gnb");
        const lnbEl = document.querySelector(".lnb");
        if (!lnbEl) return;

        lnbScrollCtrl?.abort();
        lnbScrollCtrl = new AbortController();

        let titRectHeight = document.querySelector(".tit-wrap.dep-1").getBoundingClientRect().height;
        let titPaddingTop = parseFloat(getComputedStyle(document.querySelector(".tit-wrap.dep-1")).paddingTop);
        window.addEventListener(
            "resize",
            () => {
                titRectHeight = document.querySelector(".tit-wrap.dep-1").getBoundingClientRect().height;
                titPaddingTop = parseFloat(getComputedStyle(document.querySelector(".tit-wrap.dep-1")).paddingTop);
            },
            { signal: lnbScrollCtrl.signal }
        );
        window.addEventListener(
            "scroll",
            () => {
                if (window.scrollY >= titRectHeight - titPaddingTop) {
                    lnbEl?.classList.add("is-fixed");
                } else {
                    lnbEl?.classList.remove("is-fixed");
                }
            },
            { signal: lnbScrollCtrl.signal }
        );
    },
};

window.common = common;
