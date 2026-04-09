window.initModule = ({ root, params }) => {
    // FAQ
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
            if (!this.data.length) {
                this.wrap.innerHTML = `
                    <li class="acc-item">
                        <button class="acc-btn" style="pointer-events:none;">자주하는 질문을 불러오는중 오류가 발생했습니다.</button>
                    </li>`;
                return;
            }
            this.data.forEach((item) => {
                const el = document.createElement("li");
                el.classList.add('acc-item');
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
