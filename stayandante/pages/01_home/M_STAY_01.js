window.initModule = ({ root, params }) => {
    // 메인 스와이퍼
    const swiperEl = root.querySelector(".swiper");
    new Swiper(swiperEl, {
        effect: "fade",
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 8000, disableOnInteraction: false },
        pagination: { el: swiperEl.querySelector(".swiper-pagination"), clickable: true },
        speed: 1500,
    });
    // 새소식
    const news = {
        wrap: root.querySelector(".home-news .cont"),
        data: [],
        async init() {
            const res = (await window.fetchManager.get("https://stayandante.com/api/news_list.php")) || [];
            this.data = res.slice(0, 4);
            this.wrap.innerHTML = "";
            this.render();
        },
        render() {
            this.data.forEach((item, i) => {
                const el = document.createElement("div");
                if (i === 0) {
                    el.classList.add("box", "pc66", "pd-0", "bg-point", "txt-white");
                    el.innerHTML = `
                        <div>
                            <img src="${item.thumb || "/images/home/hero_main_03.jpg"}" alt="">
                            <div class="title pd-20">
                                <p class="category">
                                    <svg class="wh-20">
                                        <use href="#ui-${item.tag === "새소식" ? "bell" : "document"}"></use>
                                    </svg>
                                    ${item.tag || "새소식"}
                                </p>
                                <h3 class="mt-4 mb-0 ell-1">${item.title}</h3>
                            </div>
                        </div>
                        <div class="flx col pd-20">
                            <p class="ell-2">${item.content}</p>
                            <p class="fs-14 mt-12">${item.created_at.split(" ")[0].split("-").join(".")}</p>
                        </div>
                    `;
                } else {
                    if (i === 1) {
                        el.classList.add("box", "pc33", "bg-100");
                    } else {
                        el.classList.add("box", "pc25", "bg-100");
                    }
                    el.innerHTML = `
                        <div>
                            <p class="category">
                                <svg class="wh-20">
                                    <use href="#ui-${item.tag === "새소식" ? "bell" : "document"}"></use>
                                </svg>
                                ${item.tag || "새소식"}
                            </p>
                            <h3 class="mt-8 ell-1">${item.title}</h3>
                        </div>
                        <div class="mt-auto">
                            <p class="ell-2">${item.content}</p>
                            <p class="fs-14 txt-700 mt-12">${item.created_at.split(" ")[0].split("-").join(".")}</p>
                        </div>
                    `;
                }
                el.addEventListener("click", async () => {
                    window.dialog.open({
                        url: "/pages/00_common/P_STAY_00_news.html",
                        data: await fetch(`https://stayandante.com/api/news_view.php?id=${item.id}`).then((res) => res.json()),
                    });
                });
                this.wrap.append(el);
            });
            this.wrap.insertAdjacentHTML(
                "beforeend",
                `<div class="box line pc50 jc-e ai-e">
                    <div class="tit-wrap dep-3 ta-r ai-e">
                        <h4 class="ta-r">머무는 시간의 이야기를 전해요<br></h4>
                        <p>스테이안단테펜션의 하루, 소식으로 만나보세요</p>
                    </div>
                    <div class="btn-wrap jc-e mt-0">
                        <a href="/index.html?linkcd=m0501" class="btn md line">
                            안단테 소식
                            <svg class="wh-20">
                                <use href="#dir-chevron-right"></use>
                            </svg>
                        </a>
                        <a href="/index.html?linkcd=m0502" class="btn md line">
                            FAQ
                            <svg class="wh-20">
                                <use href="#dir-chevron-right"></use>
                            </svg>
                        </a>
                    </div>
                </div>`
            );
        },
    };
    news.init();
};
