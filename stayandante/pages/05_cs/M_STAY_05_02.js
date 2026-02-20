window.initModule = ({ root, params }) => {
    // 자주하는 질문
    const faq = {
        wrap: root.querySelector(".acc-wrap"),
        data: [],
        async init() {
            this.data = await fetch("/api/faq.php?action=list") || [];
            this.wrap.innerHTML = "";
            this.render();
        },
        render() {
            this.data.forEach((item) => {
                const el = document.createElement("li");
                console.log(item.answer);
                el.innerHTML = `
                    <li class="acc-item">
                        <button class="acc-btn">${item.question}</button>
                        <ul class="acc-panel txt-list dot">
                            ${JSON.parse(item.answer).map((a) => `<li>${a}</li>`).join("")}
                        </ul>
                    </li>`;
                this.wrap.append(el);
            });
        },
    };
    faq.init();
};
