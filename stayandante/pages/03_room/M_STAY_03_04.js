window.initModule = ({ root, params }) => {
    const { linkcd } = params;
    const detailImg = () => {
        const imgEls = root.querySelectorAll(".cont .img-wrap img");
        imgEls.forEach((img) => {
            const mainImgEl = img.closest(".visual").querySelector(":scope > img");
            const siblings = img.closest(".img-wrap").querySelectorAll("img");
            img.addEventListener("click", () => {
                siblings.forEach((el) => el.classList.remove("is-active"));
                img.classList.add("is-active");
                mainImgEl.src = img.src;
            });
        });
    };
    const changeTitle = () => {
        const tabBtnEls = root.querySelectorAll("[data-tab]");
        tabBtnEls.forEach((btn) => {
            btn.addEventListener("click", () => {
                const roomNameEl = root.querySelector(".room-name");
                roomNameEl.textContent = "Largo " + btn.textContent.trim();
            });
        });
    };
    const another = () => {
        root.querySelector(`a[href*="${linkcd}"]`).closest(".box").style.display = "none";
    };
    detailImg();
    changeTitle();
    another();
};
