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
            try {
                const res = await fetch("/api/news.php?action=list");
                if (!res.ok) throw new Error("News 로드 실패");
                this.data = await res.json();
            } catch (e) {
                console.error(e);
                this.data = [];
            }
            this.wrap.innerHTML = "";
            this.render();
        },
        render() {
            this.data.slice(0, 4).forEach((item, i) => {
                const el = document.createElement("div");
                const newsData = {
                    ...item,
                    content: marked.parse(item.content, { baseUrl: "" }),
                    created_at: item.created_at.split(" ")[0].split("-").join("."),
                };
                const summary = (() => {
                    const d = document.createElement("div");
                    d.innerHTML = marked.parse(newsData.content);
                    return d.textContent.trim();
                })();
                if (i === 0) {
                    el.classList.add("box", "pc66", "pd-0", "bg-point", "txt-white");
                    el.innerHTML = `
                        <div>
                            <img src="${newsData.thumb || "/images/home/hero_main_03.jpg"}" alt="">
                            <div class="title pd-20">
                                <p class="category">
                                    <svg class="wh-20">
                                        <use href="#ui-${newsData.tag === "새소식" ? "bell" : "document"}"></use>
                                    </svg>
                                    ${newsData.tag || "새소식"}
                                </p>
                                <h3 class="mt-4 mb-0 ell-1">${newsData.title}</h3>
                            </div>
                        </div>
                        <div class="flx col pd-20">
                            <div class="ell-2">${summary}</div>
                            <p class="fs-14 mt-12">${newsData.created_at}</p>
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
                                    <use href="#ui-${newsData.tag === "새소식" ? "bell" : "document"}"></use>
                                </svg>
                                ${newsData.tag || "새소식"}
                            </p>
                            <h3 class="mt-8 ell-1">${newsData.title}</h3>
                        </div>
                        <div class="mt-auto">
                            <div class="ell-2">${summary}</div>
                            <p class="fs-14 txt-700 mt-12">${newsData.created_at.split(" ")[0].split("-").join(".")}</p>
                        </div>
                    `;
                }
                el.addEventListener("click", async () => {
                    window.dialog.open({
                        url: "/pages/00_common/P_STAY_00_news.html",
                        data: newsData,
                    });
                    this.increaseView(newsData.id);
                });
                this.wrap.append(el);
            });
            this.wrap.insertAdjacentHTML(
                "beforeend",
                `<div class="box line pc50 jc-e ai-e">
                    <img src="/images/home/hero_main_01.jpg" alt="" />
                    <div class="tit-wrap dep-3 ta-r ai-e">
                        <h3 class="ta-r">머무는 시간의 이야기를 전해요<br></h3>
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
        increaseView: async (id) => {
            try {
                await fetch(`/api/news.php?action=increase_view`, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `id=${id}`,
                });
            } catch (e) {
                console.error(e);
            }
        },
    };
    news.init();
};
