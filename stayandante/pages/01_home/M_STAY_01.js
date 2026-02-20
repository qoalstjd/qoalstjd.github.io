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
            // try {
            //     const res = await fetch("/api/news.php?action=list");
            //     if (!res.ok) throw new Error("News 로드 실패");
            //     this.data = await res.json(); // JSON으로 변환
            // } catch (e) {
            //     console.error(e);
            //     this.data = [];
            // }
            const res = [{"id":"5","tag":"새소식","title":"머무는 시간에 대하여","content":"체크인 · 체크아웃- **체크인:** 15:00 이후  - **체크아웃:** 11:00 이전  - 조기 입실 및 늦은 퇴실은 **사전 문의** 바랍니다.![ ]( )---## 인원 안내- 객실별 **기준 인원 초과 시 추가 요금** 발생  - 사전 협의되지 않은 인원 추가는 **제한**될 수 있습니다.![ ]( )---## 이용 수칙- 전 객실 **금연** (흡연은 지정된 장소 이용)  - **과도한 소음** 발생 시 이용 제한 가능---## 시설 이용- **수영장 및 바베큐** 이용 시간은 현장 안내 기준  - **기상 상황**에 따라 일부 시설 이용 제한될 수 있음![ ]( )---예약 전 위 사항을 확인하시면, 보다 쾌적하고 안전하게 머무를 수 있습니다.","created_at":"2026-02-10 08:56:06","view_cnt":"53"},{"id":"4","tag":"새소식","title":"운영 방식 안내","content":"보다 조용하고 안정적인 환경을 위해 본 공간은 **예약제**로 운영됩니다.  이로 인해 동선과 이용 시간이 겹치지 않도록 구성하여, 머무는 동안 방해받지 않는 시간을 제공합니다.![ ]( )---## 사전 예약의 장점- 방문 전 일정을 미리 정할 수 있어 **편안하고 정돈된 환경**을 보장  - 이용 시간과 공간이 겹치지 않아 **안정적인 머무름** 가능  - 원하는 날짜와 시간에 맞춰 머무는 **맞춤형 경험** 제공![ ]( )---## 예약 과정 안내사전 예약은 간단한 절차로 이루어지며, 확정된 일정에 맞춰 공간을 준비합니다.  예약 완료 후에는 머무는 시간 자체에 집중하며, 불필요한 방해 없이 여유로운 시간을 즐길 수 있습니다.![ ]( )---예약을 통해 방문하시면, 공간이 가진 본연의 분위기와 편안함을 온전히 느낄 수 있습니다.  조용하고 안정적인 환경 속에서 특별한 시간을 경험하시기 바랍니다.","created_at":"2026-02-09 00:00:00","view_cnt":"56"},{"id":"3","tag":"공지","title":"객실 이용 안내","content":"각 객실은 서로 다른 분위기와 흐름으로 구성되어 있습니다.  조용한 휴식을 위한 공간부터, 여유로운 시간을 나누기 좋은 공간까지, 머무는 목적에 따라 선택하실 수 있습니다.![ ]( )객실마다 느껴지는 분위기와 체감이 다르기 때문에, 원하시는 머무름의 방식에 맞춰 객실을 선택해보시기 바랍니다.  공간의 구조, 채광, 가구 배치 등 세세한 요소 하나하나가 머무는 경험에 큰 영향을 줍니다.---## 객실 선택 팁- 혼자만의 조용한 휴식이 필요할 땐, 작은 규모의 프라이빗 룸 선택  - 가족 또는 친구와 여유로운 시간을 보내고 싶을 땐, 넓은 공간과 공용 공간이 있는 객실  - 특정 테마나 감성을 경험하고 싶다면, 인테리어와 분위기 중심으로 선택![ ]( )---## 객실 경험객실마다 다른 소품, 조명, 색감 등을 통해 머무는 동안 느낄 수 있는 감정과 분위기가 달라집니다.  같은 공간이라도 계절, 시간대, 조명에 따라 체감이 달라지므로, 예약 전 사진과 설명을 참고해보세요.---머무르는 시간 동안 객실이 단순한 잠자리 이상의 경험이 되도록, 각 공간의 특성과 장점을 충분히 고려해 선택하시기 바랍니다.","created_at":"2026-01-22 00:00:00","view_cnt":"30"},{"id":"2","tag":"공지","title":"예약 안내드립니다","content":"모든 일정은 예약을 통해 이용하실 수 있습니다.  방문 전 미리 일정을 정해주시면 보다 안정적이고 여유로운 머무름을 준비할 수 있습니다.![ ]( )예약 과정은 간단하게 설계되어 있어, 복잡한 절차 없이 원하시는 날짜와 시간을 확정하실 수 있습니다.  확정된 일정에 맞춰 머무는 시간 동안에는 온전히 휴식과 경험에 집중할 수 있도록 안내드립니다.---## 예약의 장점- 방문 전 일정 확정으로 공간 준비가 최적화됩니다.  - 다른 예약자와의 충돌 없이 여유로운 환경에서 머무를 수 있습니다.  - 특별한 요청 사항이나 필요 물품이 있는 경우 미리 조율할 수 있습니다.![ ]( )---## 예약 방법1. 예약 페이지 접속 후 원하는 날짜 선택  2. 객실 및 공간 옵션 확인  3. 간단한 정보 입력 후 예약 확정  4. 예약 확정 메일 또는 안내 확인예약이 완료되면, 머무는 동안에는 오로지 편안함과 여유에만 집중하실 수 있습니다.---원하시는 날짜가 있다면, 미리 예약을 권장드립니다.  특히 성수기나 주말 등 방문자가 많은 시기에는 조기 예약을 통해 안정적이고 쾌적한 머무름을 보장받으실 수 있습니다.![ ]( )방문 전 준비와 계획을 통해, 이 공간에서의 모든 순간이 더욱 특별하고 의미 있는 시간이 되기를 바랍니다.","created_at":"2026-01-21 00:00:00","view_cnt":"62"},{"id":"1","tag":"공지","title":"새로운 시작을 알립니다","content":"새로운 이름으로 문을 열며, 여러분께 조심스레 인사를 드립니다.  이 공간은 단순한 숙소가 아니라, 하루의 흐름을 잠시 멈추고 자신만의 속도로 시간을 경험할 수 있는 장소가 되길 바라는 마음으로 마련했습니다.![ ]( )일상의 바쁜 걸음을 잠시 늦추고, 주변의 소소한 풍경과 공간의 감각에 집중할 수 있는 곳.  아침 햇살이 들어오는 순간, 창밖으로 보이는 나뭇잎의 흔들림, 커튼 사이로 스며드는 바람…  그 모든 순간이 머무는 동안 작은 휴식과 여유로 이어지길 바랍니다.---## 머무는 동안의 경험이곳에서는 머무는 자체가 곧 경험입니다.  각 객실과 공용 공간은 과하지 않게 디자인되었으며,  편안함과 실용성, 그리고 작은 디테일 하나하나가 조화롭게 구성되어 있습니다.![ ]( )책을 펼치거나 음악을 듣는 순간, 혹은 창가에 앉아 커피 한 잔을 즐기는 시간조차  하루의 속도를 잠시 늦출 수 있는 소중한 경험으로 만들어 드립니다.  단순히 잠을 자는 공간이 아니라, 몸과 마음을 온전히 쉬게 하는 휴식의 장이 되는 것이 목표입니다.---## 우리의 바람머무는 동안의 시간이 단순한 지나가는 순간이 아니라,  마음속에 편안히 남는 기억으로 이어지기를 바랍니다.  조용한 저녁 시간, 부드러운 조명 아래 책장을 넘기는 소리,  창밖으로 스치는 바람 소리, 친구나 가족과 함께하는 따뜻한 대화…  이 모든 것들이 모여 ‘머무름의 가치’를 만들어 냅니다.![ ]( )앞으로 이 공간에서의 모든 순간이 여러분에게 작은 쉼과 큰 만족으로 남기를,  그리고 다시 일상으로 돌아갔을 때에도 오래도록 기억되는 특별한 시간이 되기를 진심으로 바랍니다.","created_at":"2026-01-20 00:00:00","view_cnt":"34"}];
            this.data = res.slice(0, 4);
            this.wrap.innerHTML = "";
            this.render();
        },
        render() {
            this.data.forEach((item, i) => {
                const el = document.createElement("div");
                const newsData = {
                    ...item,
                    content: marked.parse(item.content)
                };
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
                            <p class="ell-2">${marked.parse(newsData.content)}</p>
                            <p class="fs-14 mt-12">${newsData.created_at.split(" ")[0].split("-").join(".")}</p>
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
                            <p class="ell-2">${marked.parse(newsData.content)}</p>
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
        increaseView: async (id) => {
            try {
                await fetch(`/api/news.php?action=increase_view&id=${id}`);
            } catch (e) {
                console.error(e);
            }
        }
    };
    news.init();
};
