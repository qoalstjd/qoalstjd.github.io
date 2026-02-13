window.initModule = ({ root, params }) => {
    // 새소식
    const news = {
        wrap: root.querySelector(".meta-list"),
        data: [],
        async init() {
            this.data = (await window.fetchManager.get("https://stayandante.com/api/news_list.php")) || [];
            this.wrap.innerHTML = "";
            this.render();
        },
        increaseView: async (id) => {
            try {
                await fetch(`https://stayandante.com/api/news_view_up.php?id=${id}`);
            } catch (e) {
                console.error(e);
            }
        },
        render() {
            this.data.forEach((item) => {
                const el = document.createElement("li");
                el.innerHTML = `
                    <span class="id">${item.id.padStart(2, "0")}</span>
                    <span class="category">
                        <svg class="wh-20">
                            <use href="#ui-${item.tag === "새소식" ? "bell" : "document"}"></use>
                        </svg>
                        ${item.tag || "새소식"}
                    </span>
                    <span class="title">${item.title}</span>
                    <span class="date">${item.created_at.split(" ")[0].split("-").join(".")}</span>
                    <span class="view">${item.view_cnt}</span>`;
                el.addEventListener("click", async () => {
                    window.dialog.open({
                        url: "/pages/00_common/P_STAY_00_news.html",
                        data: item,
                    });
                    this.increaseView(item.id);
                });
                this.wrap.append(el);
            });
        },
    };
    news.init();
};
