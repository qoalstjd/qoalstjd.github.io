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
            const res = (await window.fetchManager.get("/api/news_list.php")) || [];
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
                                <span class="tag">${item.category || "공지"}</span>
                                <h3 class="mt-4 mb-0">${item.title}</h3>
                            </div>
                        </div>
                        <div class="flx col pd-20">
                            <p>${item.content}</p>
                            <p class="fs-14 mt-12">${item.created_at.split(" ")[0].split("-").join(".")}</p>
                        </div>
                    `;
                } else {
                    el.classList.add("box", "pc33", "bg-100");
                    el.innerHTML = `
                        <div>
                            <span class="tag css">소식</span>
                            <h3 class="mt-8">${item.title}</h3>
                        </div>
                        <div class="mt-auto">
                            <p>${item.content}</p>
                            <p class="fs-14 txt-700 mt-12">${item.created_at.split(" ")[0].split("-").join(".")}</p>
                        </div>
                    `;
                }
                el.addEventListener("click", async () => {
                    window.dialog.open({
                        url: "/pages/00_common/P_STAY_00_news.html",
                        data: await fetch(`/api/news_view.php?id=${item.id}`).then((res) => res.json()),
                    });
                });
                this.wrap.append(el);
            });
            this.wrap.insertAdjacentHTML(
                "beforeend",
                `<div class="box line pc33 jc-e ai-e">
                    <div class="tit-wrap dep-3 ta-r ai-e">
                        <h4 class="ta-r">머무는 시간의 이야기를 전해요<br></h4>
                        <p>스테이 안단테의 하루, 소식으로 만나보세요</p>
                    </div>
                    <div class="btn-wrap jc-e mt-auto">
                        <a href="/index.html?linkcd=m0500" class="btn md line mt-auto">
                            안단테 소식 보기
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
