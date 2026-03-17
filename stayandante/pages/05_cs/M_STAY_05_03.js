window.initModule = ({ root, params }) => {
    // 주변 소개
    const around = {
        wrap: root.querySelector(".cont-wrap"),
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
            this.wrap.querySelector('.loading').remove();
            this.render();
        },
        infoFilter(value) {
            return value || "-";
        },
        render() {
            this.data.forEach((item) => {
                const sectionEl = document.createElement("section");
                sectionEl.className = "arround-detail";
                sectionEl.innerHTML = `
                    <div class="tit-wrap dep-2">
                        <h2>${item.type}</h2>
                        <p>${item.title}</p>
                    </div>
                    <div class="cont ty-row">
                        <div class="flx col ai-s">
                            <p class="mb-12">${item.summary}</p>
                            <div class="tb-wrap mt-auto">
                                <table>
                                    <caption>
                                        관광정보 상세
                                    </caption>
                                    <colgroup>
                                        <col style="width: 10rem" />
                                        <col style="width: auto" />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th>주소</th>
                                            <td>${this.infoFilter(item.info.address)}</td>
                                        </tr>
                                        <tr>
                                            <th>전화번호</th>
                                            <td>${this.infoFilter(item.info.infocenter)}</td>
                                        </tr>
                                        <tr>
                                            <th>휴일</th>
                                            <td>${this.infoFilter(item.info.restdate)}</td>
                                        </tr>
                                        <tr>
                                            <th>이용시간</th>
                                            <td>${this.infoFilter(item.info.usetime)}</td>
                                        </tr>
                                        <tr>
                                            <th>주차</th>
                                            <td>${this.infoFilter(item.info.parking)}</td>
                                        </tr>
                                        <tr>
                                            <th>홈페이지</th>
                                            <td>${item.info.homepage ? `<a href="${item.info.homepage}" target="_blank" class="link w-fc">${item.info.homepage}</a>` : "-"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="visual">
                            <img src="${item.info.thumbnail}" alt="${item.title} 이미지" />
                            <div class="img-wrap flx col-fit gap-8">
                                <img src="${item.info.thumbnail}" class="is-active" />
                                ${item.images.map((img) => `<img src="${img}" alt="${item.title} 이미지" />`).join("")}
                            </div>
                        </div>
                    </div>
                `;
                this.wrap.append(sectionEl);
                this._bindEvents();
            });
        },
        _bindEvents() {
            const imgEls = this.wrap.querySelectorAll(".img-wrap img");
            imgEls.forEach((img) => {
                const mainImgEl = img.closest(".visual").querySelector(":scope > img");
                const siblings = img.closest(".img-wrap").querySelectorAll("img");
                img.addEventListener("click", () => {
                    siblings.forEach((el) => el.classList.remove("is-active"));
                    img.classList.add("is-active");
                    mainImgEl.src = img.src;
                });
            });
        }
    };
    around.init();
};
