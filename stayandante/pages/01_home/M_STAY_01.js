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
            if (!this.data.length) {
                this.wrap.closest(".home-arround").style.display = "none";
                return;
            }
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
    // 소식
    function format(dateStr) {
        const d = new Date(dateStr);
        const yy = String(d.getFullYear()).slice(2);
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yy}.${mm}.${dd}`;
    }
    const news = {
        wrap: root.querySelector(".home-news .meta-list"),
        data: [],
        async init() {
            try {
                this.data = (await window.fetchManager.get(`https://qoalstjdapis.vercel.app/api/getBlog?id=stayandante`)).slice(0, 5) || [];
            } catch (e) {
                console.error("소식목록 조회 실패", e);
                this.data = [];
            }
            this.wrap.innerHTML = "";
            this.render();
        },
        render() {
            if (!this.data.length) {
                this.wrap.closest(".home-news").style.display = "none";
                return;
            }
            this.data.forEach((item, i) => {
                const postItem = {
                    ...item,
                    created_at: format(item.created_at),
                };
                const el = document.createElement("li");
                el.innerHTML = `
                    <span class="id">${String(Math.abs(i - this.data.length)).padStart(2, "0")}</span>
                    <span class="category">
                        <svg class="wh-20">
                            <use href="#ui-${postItem.category === "소식" ? "bell" : "document"}"></use>
                        </svg>
                        ${postItem.category || "소식"}
                    </span>
                    <span class="title">${postItem.title}</span>
                    <span class="date">${postItem.created_at}</span>`;
                el.addEventListener("click", async () => {
                    const dialogRef = await window.dialog.open({
                        url: "/pages/00_common/P_STAY_00_news.html",
                        data: { ...postItem, content: "<div style='height:200rem'><p class='loading' style='position: fixed;left: 50%;top: 50%;'></p></div>" },
                    });
                    const dialogBody = dialogRef.pop.querySelector(".md-content"); // 내부 컨테이너 선택
                    if (!dialogBody) return;
                    dialogBody.style.overflow = "hidden";
                    const detailHtml = await window.fetchManager.get(`https://qoalstjdapis.vercel.app/api/getBlogPost?id=stayandante&no=${postItem.logNo}`, { parse: "text", caching: false });
                    if (detailHtml) {
                        dialogBody.removeAttribute("style");
                        dialogBody.innerHTML = detailHtml;
                    }
                });
                this.wrap.append(el);
            });
        },
    };
    news.init();

    around.init();
    // news.init();
};
