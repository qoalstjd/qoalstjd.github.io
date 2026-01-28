window.rootDir = "stayandante";
window.defaultTheme = "light";

const common = {
    init(root = document) {
        this.gnb();
    },
    gnb() {
        const gnb = document.querySelector(".gnb");
        if (!gnb) return;

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
            if (window.innerWidth < 1440) return;
            if (isMouseOnHeader) return;
            isMouseOnHeader = true;
            openHeader();
        });
        gnb.addEventListener("mouseleave", () => {
            if (window.innerWidth < 1440) return;
            isMouseOnHeader = false;
            prevLi = null;
            closeHeader();
        });
        gnb.addEventListener("mouseover", (e) => {
            if (window.innerWidth < 1440) return;
            if (!isMouseOnHeader || isAnimating) return;
            const li = e.target.closest("li, h1");
            if (!li || !gnb.contains(li)) return;
            if (prevLi !== null && li !== prevLi) openHeader();
            prevLi = li;
        });
    },
};

window.common = common;
