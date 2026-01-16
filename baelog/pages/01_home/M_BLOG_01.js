// 시계
const clock = {
    root: document.querySelector('[data-bind="clock"]'),
    now: null,
    init() {
        if (!this.root) return;
        this.dateEl = this.root.querySelector(".date");
        this.dayEls = this.root.querySelectorAll(".day span");
        this.timeEl = this.root.querySelector(".time");
        this.update();
        setInterval(() => this.update(), 1000);
    },
    update() {
        this.now = new Date();
        this.updateDate();
        this.updateTime();
    },
    updateDate() {
        this.dateEl.textContent = window.formatDate(this.now, "YYYY/MM/DD");
        const cur = this.now.getDay();
        this.dayEls.forEach((el, i) => el.classList.toggle("is-active", i === cur));
    },
    updateTime() {
        this.timeEl.textContent = window.formatDate(this.now, "HH:mm:ss");
    },
};
// 날씨
const weather = {
    root: document.querySelector('[data-bind="weather"]'),
    async init() {
        this.detailEl = this.root.querySelector(".detail");
        this.visualEl = this.root.querySelector(".visual");
        this.listEl = this.root.querySelector(".list");
        this.loading(true);
        try {
            this.data = (await window.fetchManager.get("https://qoalstjdapis.vercel.app/api/getWeather")) || [];
        } catch (e) {
            console.error("날씨 불러오기 실패", e);
            this.data = [];
        }
        this.loading(false);
        this.renderDetail(0);
        this.renderVisual();
        this.renderList();
    },
    renderDetail(index) {
        const d = this.data[index];
        const v = d.values;
        const sky = v.sky.value;
        const pty = v.pty.value;
        this.detailEl.innerHTML = `
                        <i class="ico wh-80 bg-point" data-ico="${pty !== "none" ? pty : sky}"></i>
                        <p class="fs-36 fw-600 w-100">${v.tmp.value}<sup class="fs-20">${v.tmp.unit}</sup></p>
                        <ul class="ml-12 fs-14 txt-700">
                            <li>강수확률 : ${v.pop.value}${v.pop.unit}</li>
                            <li>습도 : ${v.reh.value}${v.reh.unit}</li>
                            <li>풍속 : ${v.wsd.value}${v.wsd.unit}</li>
                        </ul>
                        <ul class="ml-auto fs-14 ta-r">
                            <li>${window.formatDate(d.date, "YY.MM.DD")}</li>
                            <li>${d.time.slice(0, -2)}시</li>
                            <li>${pty !== "none" ? pty.toUpperCase() : sky.toUpperCase()}</li>
                        </ul>`;
    },
    chartDraw(values) {
        // values 배열의 각 요소를 0이면 1로 치환
        const adjustedValues = values.map((value) => (value === 0 ? 1 : value));
        return `polygon(
                    0% ${adjustedValues[0]}%,
                    ${100 / 8 - 6.25}% ${adjustedValues[0]}%,
                    ${200 / 8 - 6.25}% ${adjustedValues[1]}%,
                    ${300 / 8 - 6.25}% ${adjustedValues[2]}%,
                    ${400 / 8 - 6.25}% ${adjustedValues[3]}%,
                    ${500 / 8 - 6.25}% ${adjustedValues[4]}%,
                    ${600 / 8 - 6.25}% ${adjustedValues[5]}%,
                    ${700 / 8 - 6.25}% ${adjustedValues[6]}%,
                    ${800 / 8 - 6.25}% ${adjustedValues[7]}%,
                    100% ${adjustedValues[7]}%,
                    100% ${adjustedValues[7] - 1}%,
                    ${800 / 8 - 6.25}% ${adjustedValues[7] - 1}%,
                    ${700 / 8 - 6.25}% ${adjustedValues[6] - 1}%,
                    ${600 / 8 - 6.25}% ${adjustedValues[5] - 1}%,
                    ${500 / 8 - 6.25}% ${adjustedValues[4] - 1}%,
                    ${400 / 8 - 6.25}% ${adjustedValues[3] - 1}%,
                    ${300 / 8 - 6.25}% ${adjustedValues[2] - 1}%,
                    ${200 / 8 - 6.25}% ${adjustedValues[1] - 1}%,
                    ${100 / 8 - 6.25}% ${adjustedValues[0] - 1}%,
                    0% ${adjustedValues[0] - 1}%
                )`;
    },
    renderVisual() {
        this.visualEl.querySelectorAll("[data-type]").forEach((tab) => {
            const type = tab.dataset.type;

            const values = document.createElement("div");
            values.className = "values";
            const yaxis = document.createElement("ul");
            yaxis.className = "yaxis";
            if (type === "tmp") {
                const tmpValues = this.data.map((v) => Math.round((Number(v.values.tmp.value) + 20) * 1.6666));

                values.style.clipPath = this.chartDraw(tmpValues);
                yaxis.innerHTML = `<li>40</li><li>30</li><li>20</li><li>10</li><li>0</li><li>-10</li><li>-20</li>`;
                tab.appendChild(values);
                tab.appendChild(yaxis);
            } else if (type === "pop") {
                const popValues = this.data.map((v) => v.values.pop.value);

                popValues.forEach((v) => {
                    const d = document.createElement("li");
                    d.style.bottom = v + "%";
                    values.appendChild(d);
                });
                yaxis.innerHTML = `<li>100%</li><li>80%</li><li>60%</li><li>40%</li><li>20%</li><li>0%</li>`;
                tab.appendChild(values);
                tab.appendChild(yaxis);
            } else if (type === "pcp") {
                const pcpValues = this.data.map((v) => Math.round((Number(v.values.pcp.value.slice(0, -2)) / 30) * 100));

                values.style.clipPath = this.chartDraw(pcpValues);
                yaxis.innerHTML = `<li>30</li><li>25</li><li>20</li><li>15</li><li>10</li><li>5</li><li>0</li>`;
                tab.appendChild(values);
                tab.appendChild(yaxis);
            } else if (type === "wsd") {
                const wsdValues = this.data.map((v) => v.values.wsd.value);
                const vecValues = this.data.map((v) => v.values.vec.value);

                vecValues.forEach((deg, i) => {
                    const item = document.createElement("li");
                    const ico = document.createElement("i");
                    ico.className = "ico wh-48";
                    ico.dataset.ico = "arrow";
                    ico.style.transform = `rotate(${deg}deg) scale(${wsdValues[i] / 2})`;
                    const p = document.createElement("p");
                    p.className = "fs-14 txt-500";
                    p.textContent = wsdValues[i] + "m/s";
                    item.appendChild(ico);
                    item.appendChild(p);
                    values.appendChild(item);
                });
                tab.appendChild(values);
            }
        });
    },
    renderList() {
        this.listEl.innerHTML = "";
        this.data.forEach((d, i) => {
            const sky = d.values.sky.value;
            const pty = d.values.pty.value;
            const li = document.createElement("li");
            li.innerHTML = `
                            <i class="ico wh-48" data-ico="${pty !== "none" ? pty : sky}"></i>
                            <p class="fs-14 txt-700">${d.time.slice(0, -2) + "시"}</p>`;
            li.addEventListener("click", () => {
                this.renderDetail(i);
                this.listEl.style.setProperty("--cur-index", i);
            });
            this.listEl.appendChild(li);
        });
    },
    loading(boolean) {
        this.root.classList.toggle("loading", boolean);
    },
};
// 뉴스
const news = {
    root: document.querySelector("[data-bind='news']"),
    data: [],
    async init() {
        this.list = this.root.querySelector(".news-list");
        this.tabs = this.root.querySelectorAll("[data-category]");
        this.loading(true);
        try {
            this.data = (await window.fetchManager.get("https://qoalstjdapis.vercel.app/api/getNews")) || [];
        } catch (e) {
            console.error("뉴스 불러오기 실패", e);
            this.data = [];
        }
        this.render("top");
        this.bind();
        this.loading(false);
    },
    render(category) {
        this.list.innerHTML = "";
        const filteredData = this.data.filter((item) => item.category === category);
        filteredData.forEach((d) => {
            const li = document.createElement("li");
            li.innerHTML = `
                        <img src="${d.img || ""}" loading="lazy" class="wh-48 r-4">
                        <div class="of-h">
                            <strong class="ell-1">${d.title}</strong>
                            <p class="flx ai-c gap-8 txt-500 flx-nowrap">
                                <span>${window.formatDate(new Date(d.date), "YYYY.MM.DD")}</span>
                                <i class="vr"></i>
                                <span class="ell-1">${d.creator}</span>
                            </p>
                        </div>`;
            li.onclick = () => {
                window.dialog.open({
                    url: "/baelog/pages/00_common/P_BLOG_00_newsDetail.html",
                    data: d,
                });
            };
            this.list.appendChild(li);
        });
    },
    bind() {
        this.tabs.forEach((tab, i) => {
            tab.addEventListener("click", () => {
                this.tabs.forEach((el) => el.classList.remove("is-active"));
                tab.classList.add("is-active");
                this.render(tab.dataset.category);
            });
        });
    },
    loading(boolean) {
        this.list.classList.toggle("loading", boolean);
    },
};
// 음악
const music = {
    root: document.querySelector('[data-bind="music"]'),
    curIdx: 0,
    async init() {
        this.detailEl = this.root.querySelector(".detail");
        this.audio = this.root.querySelector("audio");
        this.playlistEl = this.root.querySelector(".playlist");
        this.now = this.root.querySelector(".now");
        this.total = this.root.querySelector(".total");
        this.pg = this.root.querySelector("progress");
        this.seek = this.root.querySelector(".seek");
        this.vol = this.root.querySelector(".vol");
        this.volPg = this.root.querySelector(".volPg");
        this.loading(true);
        try {
            const res = await fetch("https://qoalstjdapis.vercel.app/api/getMusic");
            this.data = await res.json();
        } catch {
            this.data = [];
        }
        this.renderPlaylist();
        this.load(this.curIdx);
        this.bindControls();
        const v = Math.round(this.audio.volume * 100);
        this.vol.value = v;
        this.volPg.value = v;
        this.loading(false);
    },
    load(i) {
        this.curIdx = i;
        const d = this.data[i];
        this.detailEl.innerHTML = `
                        <img src="${d.cover}" class="wh-128 r-12">
                        <div class="mt-12 ta-c">
                            <strong>${d.title}</strong>
                            <p>${d.genre} · ${d.mood}</p>
                        </div>
                        `;
        this.audio.src = d.streaming;
        this.audio.onloadedmetadata = () => {
            const dur = Math.floor(this.audio.duration || 0);
            this.pg.max = this.seek.max = dur;
            this.total.textContent = this.fm(dur);
            // this.audio.play();
        };
        this.audio.ontimeupdate = () => {
            const cur = Math.floor(this.audio.currentTime || 0);
            this.pg.value = this.seek.value = cur;
            this.now.textContent = this.fm(cur);
        };
        this.audio.onplay = () => (this.root.querySelector("[data-act='toggle'] [data-ico]").dataset.ico = "pause");
        this.audio.onpause = () => (this.root.querySelector("[data-act='toggle'] [data-ico]").dataset.ico = "play");
        this.audio.onended = () => this.next();
    },

    bindControls() {
        this.root.querySelector('[data-act="prev"]').onclick = () => this.prev();
        this.root.querySelector('[data-act="next"]').onclick = () => this.next();
        this.root.querySelector('[data-act="toggle"]').onclick = () => (this.audio.paused ? this.audio.play() : this.audio.pause());
        this.seek.oninput = (e) => (this.audio.currentTime = Number(e.target.value));
        this.vol.oninput = (e) => {
            const v = Number(e.target.value);
            this.audio.volume = v / 100;
            this.volPg.value = v;
        };
        this.audio.onvolumechange = () => {
            const v = Math.round(this.audio.volume * 100);
            this.vol.value = v;
            this.volPg.value = v;
        };
    },
    prev() {
        this.load((this.curIdx - 1 + this.data.length) % this.data.length);
    },
    next() {
        this.load((this.curIdx + 1) % this.data.length);
    },
    renderPlaylist() {
        this.playlistEl.innerHTML = "";

        this.data.forEach((d, i) => {
            const li = document.createElement("li");
            li.innerHTML = `
                            <img src="${d.cover}" class="wh-48 r-4">
                            <div class="of-h">
                                <strong class="ell-1">${d.title}</strong>
                                <p class="flx ai-c gap-8 txt-500 flx-nowrap">
                                    <span>${d.genre}</span>
                                    <i class="vr"></i>
                                    <span class="ell-1">${d.mood}</span>
                                </p>
                            </div>
                        `;
            li.onclick = () => {
                this.playlistEl.querySelectorAll("li").forEach((l) => l.classList.remove("is-active"));
                li.classList.add("is-active");
                this.load(i);
            };
            this.playlistEl.appendChild(li);
        });
        this.playlistEl.children[0]?.classList.add("is-active");
    },
    fm(s) {
        const m = Math.floor(s / 60);
        const ss = String(s % 60).padStart(2, "0");
        return `${m}:${ss}`;
    },
    loading(boolean) {
        this.root.classList.toggle("loading", boolean);
    },
};
// 달력
const calendar = {
    root: document.querySelector('[data-bind="calendar"]'),
    date: new Date(),
    init() {
        this.titleEl = this.root.querySelector(".title");
        this.datesEl = this.root.querySelector(".dates");
        this.root.addEventListener("click", (e) => {
            const btn = e.target.closest("[data-act]");
            if (!btn) return;
            if (btn.dataset.act === "prev") this.prev();
            if (btn.dataset.act === "next") this.next();
            if (btn.dataset.act === "today") this.today();
        });
        this.render();
    },
    render() {
        const y = this.date.getFullYear();
        const m = this.date.getMonth();
        const firstDay = new Date(y, m, 1).getDay();
        const totalDays = new Date(y, m + 1, 0).getDate();
        const today = new Date().toDateString();

        this.titleEl.textContent = window.formatDate(this.now, "YYYY년 MM월");
        this.datesEl.innerHTML = "";
        // prev
        for (let i = firstDay - 1; i >= 0; i--) {
            this.datesEl.append(this.day(new Date(y, m, -i).getDate(), "txt-500"));
        }
        // current
        for (let i = 1; i <= totalDays; i++) {
            const d = new Date(y, m, i);
            let cls = "";
            if (d.toDateString() === today) cls = "today";
            if (d.getDay() === 0) cls += " txt-red";
            if (d.getDay() === 6) cls += " txt-blue";
            this.datesEl.append(this.day(i, cls));
        }
        // next
        const remain = 42 - (firstDay + totalDays);
        for (let i = 1; i <= remain; i++) {
            this.datesEl.append(this.day(i, "txt-500"));
        }
    },
    day(text, cls) {
        const div = document.createElement("div");
        if (cls) div.className = cls;
        div.textContent = text;
        return div;
    },
    prev() {
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1);
        this.render();
    },
    next() {
        this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1);
        this.render();
    },
    today() {
        this.date = new Date();
        this.render();
    },
};
// 할일
const todo = {
    root: document.querySelector('[data-bind="todo"]'),
    data: [
        { id: 1, content: "할 일 1" },
        { id: 2, content: "할 일 2" },
        { id: 3, content: "할 일 3" },
    ],
    init() {
        this.list = this.root.querySelector(".list");
        this.form = this.root.querySelector(".inp");
        this.input = this.form.querySelector("input");
        this.bind();
        this.render();
    },
    bind() {
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!this.input.value.trim()) return;

            this.data.push({
                id: Date.now(),
                content: this.input.value,
            });
            this.input.value = "";
            this.render();
        });
        this.list.addEventListener("click", (e) => {
            const del = e.target.closest('[data-act="delete"]');
            if (!del) return;

            const id = +del.dataset.id;
            if (!confirm("삭제하시겠습니까?")) return;

            this.data = this.data.filter((v) => v.id !== id);
            this.render();
        });
    },
    render() {
        this.data.forEach((v) => {
            this.list.insertAdjacentHTML(
                "beforeend",
                `
                                <li>
                                    <p class="b2">${v.content}</p>
                                <div>
                                    <button class="ico-wrap pd-4">
                                        <i class="ico wh-16" data-ico="check"><span class="hidden">체크</span></i>
                                    </button>
                                    <button class="ico-wrap pd-4">
                                        <i class="ico wh-16" data-ico="pencil"><span class="hidden">수정</span></i>
                                    </button>
                                    <button class="ico-wrap pd-4" data-act="delete" data-id="${v.id}">
                                        <i class="ico wh-16" data-ico="trashcan"><span class="hidden">삭제</span></i>
                                    </button>
                                </div>
                                </li>`
            );
        });
    },
};

export function init() {
    clock.init();
    weather.init();
    news.init();
    calendar.init();
    todo.init();
    music.init();
}
