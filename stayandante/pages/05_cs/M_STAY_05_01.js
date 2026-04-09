window.initModule = ({ root, params }) => {
    // 소식
    function format(dateStr) {
        const d = new Date(dateStr);
        const yy = String(d.getFullYear()).slice(2);
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yy}.${mm}.${dd}`;
    }
    const news = {
        wrap: root.querySelector(".meta-list"),
        data: [],
        async init() {
            try {
                this.data = (await window.fetchManager.get(`https://qoalstjdapis.vercel.app/api/getBlog?id=stayandante`)) || [];
            } catch (e) {
                console.error("소식목록 조회 실패", e);
                this.data = [];
            }
            this.wrap.innerHTML = "";
            this.render();
        },
        render() {
            if (!this.data.length) {
                this.wrap.innerHTML = `
                    <li>
                        <span class="id">00</span>
                        <span class="category">
                            <svg class="wh-20">
                                <use href="#ui-document"></use>
                            </svg>
                            오류
                        </span>
                        <span class="title">소식을 불러오는중 오류가 발생했습니다.</span>
                        <span class="date">YY.MM.DD</span>
                    </li>`;
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
};
