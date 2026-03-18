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
    // 주변소개
    const around = {
        wrap: root.querySelector(".home-arround .cont"),
        list: [
            "127801", // 석모도
            "128818", // 민머루 해수욕장
            "125533", // 보문사
            "2490906", // 자연휴양림
            "2490886", // 석모도 미네랄온천
            "2758257", // 외포항
            "3340348", // 강화함상공원
        ],
        data: [],
        async init() {
            try {
                this.data = (await window.fetchManager.get(`https://qoalstjdapis.vercel.app/api/getTour?contentids=${this.list.join(",")}`)) || [];
            } catch (e) {
                console.error("관광정보목록 조회 실패", e);
                this.data = [];
            }
            this.render();
        },
        infoFilter(value) {
            return value || "-";
        },
        render() {
            this.data.slice(0, 4).forEach((item, i) => {
                const el = document.createElement("div");
                if (i === 0) {
                    el.classList.add("box", "pc66", "pd-0");
                    el.innerHTML = `
                        <img src="${item.info.thumbnail || item.images[0]}" alt="${item.title}">
                        <div class="pd-24 bg-700 txt-100 mt-auto" style="position:relative;">
                            <h3 class="mb-8">${item.title}</h3>
                            <p class="ell-3 fs-14">${item.summary}</p>
                        </div>
                    `;
                } else {
                    if (i === 1) {
                        el.classList.add("box", "pc33");
                    } else {
                        el.classList.add("box", "pc25");
                    }
                    el.innerHTML = `
                        <img src="${item.info.thumbnail || item.images[0]}" alt="${item.title}">
                        <div class="box" style="height:100%;">
                            <h3 class="mt-0 mb-8">${item.title}</h3>
                            <p class="ell-3 mb-12 fs-14">${item.summary}</p>
                            <ul class="txt-list dot mt-auto fs-14 txt-700">
                                <li>주소 : ${this.infoFilter(item.info.address)}</li>
                                <li>전화번호 : ${this.infoFilter(item.info.infocenter)}</li>
                                <li>휴일 : ${this.infoFilter(item.info.restdate)}</li>
                                <li>이용시간 : ${this.infoFilter(item.info.usetime)}</li>
                                <li>주차 : ${this.infoFilter(item.info.parking)}</li>
                            </ul>
                        </div>
                    `;
                }
                this.wrap.append(el);
            });
            this.wrap.insertAdjacentHTML(
                "beforeend",
                `<div class="box pc50">
                    <img src="${this.data[0].images[0] || "/images/home/hero_main_01.jpg"}" alt="" />
                    <div class="box jc-e ai-e">
                        <div class="tit-wrap dep-3 ta-r ai-e">
                            <h3 class="ta-r">주변 관광 안내</h3>
                            <p>스테이안단테펜션에서 만나는 여행 이야기</p>
                        </div>
                        <div class="btn-wrap jc-e mt-0">
                            <a href="/index.html?linkcd=m0503" class="btn md line">
                                주변 여행 더 알아보기
                                <svg class="wh-20">
                                    <use href="#dir-chevron-right"></use>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>`
            );
        },
    };
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

    around.init();
    // news.init();
};
