// 시계
const clock = {
    now: null,
    init(root) {
        this.wrap = root.querySelector("[data-bind='clock']");
        this.dateEl = this.wrap.querySelector(".date");
        this.dayEls = this.wrap.querySelectorAll(".day span");
        this.timeEl = this.wrap.querySelector(".time");

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
    async init(root) {
        this.wrap = root.querySelector("[data-bind='weather']");
        this.detailEl = this.wrap.querySelector(".detail");
        this.visualEl = this.wrap.querySelector(".visual");
        this.listEl = this.wrap.querySelector(".list");

        window.ui.loading(this.wrap, true);
        try {
            this.data = (await window.fetchManager.get("https://qoalstjdapis.vercel.app/api/getWeather")) || [];
        } catch (e) {
            console.error("날씨 불러오기 실패", e);
            this.data = [];
        }
        this.renderDetail(0);
        this.renderVisual();
        this.renderList();

        window.ui.loading(this.wrap, false);
    },
    renderDetail(index) {
        const d = this.data[index];
        if (!d) return;
        const v = d.values;
        const sky = v.sky.value;
        const pty = v.pty.value;
        this.detailEl.innerHTML = `
            <svg class="wh-80 txt-point"><use href="#${pty !== "none" ? "ui-" + pty : "ui-" + sky}"></use></svg>
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
            const map = {
                tmp: () => {
                    const tmpValues = this.data.map((v) => Math.round((Number(v.values.tmp.value) + 20) * 1.6666));

                    values.style.clipPath = this.chartDraw(tmpValues);
                    yaxis.innerHTML = `<li>40</li><li>30</li><li>20</li><li>10</li><li>0</li><li>-10</li><li>-20</li>`;
                    tab.appendChild(values);
                    tab.appendChild(yaxis);
                },
                pop: () => {
                    const popValues = this.data.map((v) => v.values.pop.value);

                    popValues.forEach((v) => {
                        const d = document.createElement("li");
                        d.style.bottom = v + "%";
                        values.appendChild(d);
                    });
                    yaxis.innerHTML = `<li>100%</li><li>80%</li><li>60%</li><li>40%</li><li>20%</li><li>0%</li>`;
                    tab.appendChild(values);
                    tab.appendChild(yaxis);
                },
                pcp: () => {
                    const pcpValues = this.data.map((v) => Math.round((Number(v.values.pcp.value.slice(0, -2)) / 30) * 100));

                    values.style.clipPath = this.chartDraw(pcpValues);
                    yaxis.innerHTML = `<li>30</li><li>25</li><li>20</li><li>15</li><li>10</li><li>5</li><li>0</li>`;
                    tab.appendChild(values);
                    tab.appendChild(yaxis);
                },
                wsd: () => {
                    const wsdValues = this.data.map((v) => v.values.wsd.value);
                    const vecValues = this.data.map((v) => v.values.vec.value);

                    values.innerHTML = vecValues
                        .map(
                            (deg, i) => `
                            <li>
                                <svg class="wh-24" style="transform:rotate(${deg}deg) scale(${wsdValues[i] / 2})"><use href="#dir-arrow-bottom"></use></svg>
                                <p class="fs-14 txt-500">${wsdValues[i]}m/s</p>
                            </li>
                        `
                        )
                        .join("");
                    tab.appendChild(values);
                },
            };
            map[type]?.();
        });
    },
    renderList() {
        this.listEl.innerHTML = "";
        this.data.forEach((d, i) => {
            const sky = d.values.sky.value;
            const pty = d.values.pty.value;
            const li = document.createElement("li");
            li.innerHTML = `
                <svg class="wh-48"><use href="#${pty !== "none" ? "ui-" + pty : "ui-" + sky}"></use></svg>
                <p class="fs-14 txt-700">${d.time.slice(0, -2) + "시"}</p>`;
            li.addEventListener("click", () => {
                this.renderDetail(i);
                this.listEl.style.setProperty("--cur-index", i);
            });
            this.listEl.appendChild(li);
        });
    },
};
// 뉴스
const news = {
    data: [],
    async init(root) {
        this.wrap = root.querySelector("[data-bind='news']");
        this.list = this.wrap.querySelector(".news-list");
        this.tabs = this.wrap.querySelectorAll("[data-category]");

        window.ui.loading(this.wrap, true);
        try {
            this.data = (await window.fetchManager.get("https://qoalstjdapis.vercel.app/api/getNews")) || [];
        } catch (e) {
            console.error("뉴스 불러오기 실패", e);
            this.data = [];
        }
        this.render("top");
        this.bind();

        window.ui.loading(this.wrap, false);
    },
    render(category) {
        this.list.innerHTML = "";
        const filteredData = this.data.filter((item) => item.category === category);
        filteredData.forEach((d) => {
            const li = document.createElement("li");
            li.innerHTML = `
                        <img src="${d.img || ""}" onerror="this.onerror=null;this.src='/images/common/fallback_1x1.png'" loading="lazy" class="wh-48 r-4">
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
                    url: "/pages/00_common/P_BLOG_00_newsDetail.html",
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
};
// 음악
const music = {
    curIdx: 0,
    async init(root) {
        this.wrap = root.querySelector("[data-bind='music']");

        this.detailEl = this.wrap.querySelector(".detail");
        this.playerEl = this.wrap.querySelector(".player");
        this.playlistEl = this.wrap.querySelector(".playlist");

        this.audio = this.wrap.querySelector("audio");
        this.now = this.wrap.querySelector(".now");
        this.total = this.wrap.querySelector(".total");
        this.pg = this.wrap.querySelector("progress");
        this.seek = this.wrap.querySelector(".seek");
        this.vol = this.wrap.querySelector(".vol");
        this.volPg = this.wrap.querySelector(".volPg");
        this.control = this.wrap.querySelector(".control");

        window.ui.loading(this.wrap, true);
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

        window.ui.loading(this.wrap, false);
    },
    load(i) {
        this.curIdx = i;
        const d = this.data[i];
        this.detailEl.innerHTML = `
            <img src="${d.cover}" onerror="this.onerror=null;this.src='/images/common/fallback_1x1.png'" class="wh-128 r-12">
            <div class="mt-12 ta-c">
                <strong>${d.title}</strong>
                <p>${d.genre} · ${d.mood}</p>
            </div>`;
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
        // this.audio.onplay = () => ();
        // this.audio.onpause = () => ();
        this.audio.onended = () => this.next();
    },
    bindControls() {
        this.wrap.querySelector('.control [data-act="prev"]').onclick = () => this.prev();
        this.wrap.querySelector('.control [data-act="next"]').onclick = () => this.next();
        this.wrap.querySelector('.control [data-act="toggle"]').onclick = () => (this.audio.paused ? this.audio.play() : this.audio.pause());
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
                <img src="${d.cover}" onerror="this.onerror=null;this.src='/images/common/fallback_1x1.png'" class="wh-48 r-4">
                <div class="of-h">
                    <strong class="ell-1">${d.title}</strong>
                    <p class="flx ai-c gap-8 txt-500 flx-nowrap">
                        <span>${d.genre}</span>
                        <i class="vr"></i>
                        <span class="ell-1">${d.mood}</span>
                    </p>
                </div>`;
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
};
// 달력
const calendar = {
    date: new Date(),
    init(root) {
        this.wrap = root.querySelector("[data-bind='calendar']");
        this.titleEl = this.wrap.querySelector(".title");
        this.datesEl = this.wrap.querySelector(".dates");
        this.wrap.addEventListener("click", (e) => {
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

        this.titleEl.textContent = window.formatDate(this.date, "YYYY년 MM월");
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
    data: [
        { id: 1, content: "할 일 1" },
        { id: 2, content: "할 일 2" },
        { id: 3, content: "할 일 3" },
    ],
    init(root) {
        this.wrap = root.querySelector("[data-bind='todo']");
        this.list = this.wrap.querySelector(".list");
        this.form = this.wrap.querySelector(".inp");
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
        this.list.innerHTML = "";
        this.data.forEach((v) => {
            this.list.insertAdjacentHTML(
                "beforeend",
                `
                                <li>
                                    <p class="b2">${v.content}</p>
                                <div>
                                    <button class="ico-wrap pd-4">
                                        <svg class="wh-16"><use href="#act-check"></use></svg>
                                    </button>
                                    <button class="ico-wrap pd-4">
                                        <svg class="wh-16"><use href="#act-edit"></use></svg>
                                    </button>
                                    <button class="ico-wrap pd-4" data-act="delete" data-id="${v.id}">
                                        <svg class="wh-16"><use href="#act-delete"></use></svg>
                                    </button>
                                </div>
                                </li>`
            );
        });
    },
};

window.initModule = ({ root, params }) => {
    clock.init(root);
    weather.init(root);
    news.init(root);
    calendar.init(root);
    todo.init(root);
    music.init(root);
}
