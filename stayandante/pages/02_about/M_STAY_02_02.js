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
    detailImg();
};
