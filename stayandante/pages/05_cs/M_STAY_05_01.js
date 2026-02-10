window.initModule = ({ root, params }) => {
    // 새소식
    const news = {
        wrap: root.querySelector(".meta-list"),
        data: [],
        async init() {
            const res = (await window.fetchManager.get("/api/news_list.php")) || [];
            this.data = res.slice(0, 4);
            this.wrap.innerHTML = "";
            this.render();
        },
        render() {
            this.data.forEach((item) => {
                const el = document.createElement("li");
                el.innerHTML = `
                    <span class="id">${item.id}</span>
                    <span class="tag">item.tag</span>
                    <span class="title">${item.title}</span>
                    <span class="date">${item.created_at}</span>`;
                el.addEventListener("click", async () => {
                    window.dialog.open({
                        url: "/pages/00_common/P_STAY_00_news.html",
                        data: await fetch(`/api/news_view.php?id=${item.id}`).then((res) => res.json()),
                    });
                });
                this.wrap.append(el);
            });
        },
    };
    news.init();
};
