window.initModule = ({ root, params }) => {
    // 새소식
    const news = {
        wrap: root.querySelector(".meta-list"),
        data: [],
        async init() {
            try {
                const res = await fetch("/api/news.php?action=list");
                if (!res.ok) throw new Error("News 로드 실패");
                this.data = await res.json(); // JSON으로 변환
            } catch (e) {
                console.error(e);
                this.data = [];
            }
            this.wrap.innerHTML = "";
            this.render();
        },
        increaseView: async (id) => {
            try {
                await fetch(`/api/news.php?action=increase_view&id=${id}`);
            } catch (e) {
                console.error(e);
            }
        },
        render() {
            this.data.forEach((item) => {
                const el = document.createElement("li");
                const newsData = {
                    ...item,
                    content: marked.parse(item.content)
                };
                el.innerHTML = `
                    <span class="id">${newsData.id.padStart(2, "0")}</span>
                    <span class="category">
                        <svg class="wh-20">
                            <use href="#ui-${newsData.tag === "새소식" ? "bell" : "document"}"></use>
                        </svg>
                        ${newsData.tag || "새소식"}
                    </span>
                    <span class="title">${newsData.title}</span>
                    <span class="date">${newsData.created_at.split(" ")[0].split("-").join(".")}</span>
                    <span class="view">${newsData.view_cnt}</span>`;
                el.addEventListener("click", async () => {
                    window.dialog.open({
                        url: "/pages/00_common/P_STAY_00_news.html",
                        data: newsData,
                    });
                    this.increaseView(newsData.id);
                });
                this.wrap.append(el);
            });
        },
    };
    news.init();
};
