window.initModule = ({ root, params }) => {
    // 자주하는 질문
    const faq = {
        wrap: root.querySelector(".acc-wrap"),
        data: [],
        async init() {
            try {
                const res = await fetch("/api/faq.php?action=list");
                if (!res.ok) throw new Error("FAQ 로드 실패");
                this.data = await res.json(); // JSON으로 변환
            } catch (e) {
                console.error(e);
                this.data = [];
            }
            this.wrap.innerHTML = "";
            this.render();
        },
        render() {
            this.data.forEach((item) => {
                const el = document.createElement("li");
                el.classList.add('acc-item');
                console.log(item.answer);
                el.innerHTML = `
                    <button class="acc-btn">${item.question}</button>
                    <ul class="acc-panel txt-list dot">
                        ${JSON.parse(item.answer).map((a) => `<li>${a}</li>`).join("")}
                    </ul>`;
                this.wrap.append(el);
            });
        },
    };
    faq.init();
};
