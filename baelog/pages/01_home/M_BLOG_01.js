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
            <svg class="wh-80 pd-8 txt-point"><use href="#${pty !== "none" ? "ui-" + pty : "ui-" + sky}"></use></svg>
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
                <svg class="wh-48 pd-4"><use href="#${pty !== "none" ? "ui-" + pty : "ui-" + sky}"></use></svg>
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
                        <img src="${d.img || ""}" onerror="this.onerror=null;this.src='${window.BASE}/images/common/fallback_1x1.png'" loading="lazy" class="wh-48 r-4">
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
                this.list.scrollTo({ top: 0, behavior: "auto" });
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
    player: null,
    data: [
        { id: "jfKfPfyJRdk", title: "Lofi Girl" },
        { id: "5yx6BWlEVcY", title: "Chillhop Radio" },
        { id: "Dx5qFachd3A", title: "Jazz Cafe Radio" },
    ],
    init(root) {
        this.wrap = root.querySelector("[data-bind='music']");
        this.playerEl = this.wrap.querySelector(".player");
        this.playlistEl = this.wrap.querySelector(".playlist");
        this.form = this.wrap.querySelector(".inp");
        this.input = this.wrap.querySelector("input");

        this.loadCache();
        this.loadYT();
        this.renderPlaylist();
        this.load(0);
        this.bind();
    },

    /* ---------------- YT ---------------- */

    loadYT() {
        if (window.YT) return this.createPlayer();

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => this.createPlayer();
    },

    createPlayer() {
        this.player = new YT.Player(this.playerEl, {
            height: "0",
            width: "0",
            videoId: this.data[0]?.id,
            playerVars: { autoplay: 1, controls: 0 },
        });
    },
    load(i) {
        const prev = this.playlistEl.children[this.curIdx];
        prev?.classList.remove("is-active");
        this.curIdx = i;
        const next = this.playlistEl.children[i];
        next?.classList.add("is-active");
        this.player?.loadVideoById(this.data[i].id);
    },
    bind() {
        this.form.onsubmit = (e) => {
            e.preventDefault();
            const url = this.input.value.trim();
            if (!url) return;
            const id = this.parseId(url);
            if (!id)
                return window.dialog.open({
                    type: "alert",
                    size: "sm",
                    html: "올바른 YouTube URL을 입력해 주세요",
                });

            this.add(id);
            this.input.value = "";
        };
    },
    async getTitle(id) {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
        const data = await res.json();
        return data.title;
    },
    parseId(url) {
        return url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];
    },
    async add(id) {
        if (this.data.some((d) => d.id === id)) return;
        this.data.push({
            id,
            title: (await this.getTitle(id)) || "Unknown",
        });
        this.saveCache();
        this.renderPlaylist();
    },
    remove(i) {
        this.data.splice(i, 1);
        if (this.curIdx >= this.data.length) {
            this.curIdx = 0;
        }
        this.saveCache();
        this.renderPlaylist();
        this.load(this.curIdx);
    },
    renderPlaylist() {
        this.playlistEl.innerHTML = "";
        this.data.forEach((d, i) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="https://img.youtube.com/vi/${d.id}/hqdefault.jpg">
                <p class="ell-1">${d.title}</p>
                <button class="ico-wrap pd-4" data-act="delete" data-id="1">
                    <svg class="wh-16"><use href="#act-delete"></use></svg>
                </button>
            `;
            li.onclick = () => this.load(i);
            li.querySelector("[data-act='delete']").onclick = (e) => {
                e.stopPropagation();
                this.remove(i);
            };
            this.playlistEl.appendChild(li);
        });
    },
    saveCache() {
        cacheManager.set("youtubePlayList", this.data, { persist: true });
    },
    loadCache() {
        const cached = cacheManager.get("youtubePlayList");
        if (cached?.length) this.data = cached;
    },
};
// 달력
const calendar = {
    state: {
        view: new Date(), // 보고있는 달
        selected: window.formatDate(new Date(), "YYYY-MM-DD"),
        data: [],
        map: {},
    },
    async init(root) {
        this.wrap = root.querySelector("[data-bind='calendar']");
        this.titleEl = this.wrap.querySelector(".title");
        this.datesEl = this.wrap.querySelector(".dates");
        this.scheduleWrap = root.querySelector("[data-bind='schedule']");
        this.scheduleDateEl = this.scheduleWrap.querySelector(".date");
        this.scheduleListEl = this.scheduleWrap.querySelector(".list");
        const res = await fetch("https://qoalstjdapis.vercel.app/api/getCalendar?id=msvmflaldja@gmail.com");
        this.state.data = await res.json();
        this.render(this.state.view);
        this.renderSchedule(this.state.selected);
        this.bindEvents();
    },
    renderSchedule(date) {
        const data = this.state.data[date];
        this.scheduleDateEl.innerHTML = window.formatDate(date, "YYYY년 MM월 DD일");
        if (data) {
            window.ui.empty(this.scheduleListEl, false);
            this.scheduleListEl.innerHTML = "";
            data.forEach((d) => {
                this.scheduleListEl.innerHTML += `
                    <li>
                        <i style="background-color:${d.color};"></i>
                        <p class="ell-1">${d.title}</p>
                    </li>
                `;
            });
        } else {
            window.ui.empty(this.scheduleListEl, true, "calendar", "해당 일자에 일정이 없어요");
        }
    },
    bindEvents() {
        this.wrap.addEventListener("click", (e) => {
            const act = e.target.closest("[data-act]")?.dataset.act;
            if (act) {
                if (act === "prev") return this.render(this.getPrevMonth());
                if (act === "next") return this.render(this.getNextMonth());
                if (act === "today") return this.render(new Date());
            }
            const cell = e.target.closest("[data-date]");
            if (cell) {
                this.datesEl.querySelector(".is-active")?.classList.remove("is-active");
                cell.classList.add("is-active");
                this.renderSchedule(cell.dataset.date);
            }
        });
    },
    /* ---------- 날짜 ---------- */
    getPrevMonth() {
        const { view } = this.state;
        return new Date(view.getFullYear(), view.getMonth() - 1);
    },
    getNextMonth() {
        const { view } = this.state;
        return new Date(view.getFullYear(), view.getMonth() + 1);
    },
    getMonthInfo(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        return {
            year,
            month,
            firstDay: new Date(year, month, 1).getDay(),
            totalDays: new Date(year, month + 1, 0).getDate(),
        };
    },
    /* ---------- 렌더 ---------- */
    render(date) {
        this.state.view = date;
        const { year, month, firstDay, totalDays } = this.getMonthInfo(date);
        this.renderTitle(date);
        this.renderDates(year, month, firstDay, totalDays);
    },
    renderTitle(date) {
        this.titleEl.textContent = window.formatDate(date, "YYYY년 MM월");
    },
    renderDates(year, month, firstDay, totalDays) {
        const frag = document.createDocumentFragment();
        frag.append(...this.renderPrevDays(year, month, firstDay));
        frag.append(...this.renderCurrentDays(year, month, totalDays));
        frag.append(...this.renderNextDays(firstDay, totalDays));
        this.datesEl.innerHTML = "";
        this.datesEl.append(frag);
    },
    /* ---------- days ---------- */
    renderPrevDays(year, month, firstDay) {
        const list = [];
        for (let i = firstDay - 1; i >= 0; i--) {
            list.push(this.createDay({ text: new Date(year, month, -i).getDate(), muted: true }));
        }
        return list;
    },
    renderCurrentDays(year, month, totalDays) {
        const list = [];
        const today = window.formatDate(new Date(), "YYYY-MM-DD");
        for (let i = 1; i <= totalDays; i++) {
            const d = new Date(year, month, i);
            const ymd = window.formatDate(d, "YYYY-MM-DD");
            list.push(
                this.createDay({
                    ymd,
                    text: i,
                    today: ymd === today,
                    sunday: d.getDay() === 0,
                    saturday: d.getDay() === 6,
                    active: ymd === this.state.selected,
                    events: this.state.data[ymd] || [],
                })
            );
        }
        return list;
    },
    renderNextDays(firstDay, totalDays) {
        const list = [];
        const remain = 42 - (firstDay + totalDays);
        for (let i = 1; i <= remain; i++) {
            list.push(this.createDay({ text: i, muted: true }));
        }
        return list;
    },
    /* ---------- day ---------- */
    createDay({ ymd, text, today, sunday, saturday, muted, active, events = [] }) {
        const el = document.createElement("div");
        if (ymd) el.dataset.date = ymd;
        el.className = [muted && "txt-500", today && "today", sunday && "txt-red", saturday && "txt-blue", active && "is-active"].filter(Boolean).join(" ");
        el.innerHTML = `
            <span class="date">${text}</span>
            <div class="events">
                ${events.map((e) => `<i style="background:${e.color};" title="${e.title}"></i>`).join("")}
            </div>
        `;
        return el;
    },
};

window.initModule = ({ root, params }) => {
    clock.init(root);
    weather.init(root);
    news.init(root);
    calendar.init(root);
    music.init(root);

    const scheduleRefresh = (fn) => {
        const now = new Date();
        const delay = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000;
        setTimeout(() => {
            fn();
            setInterval(fn, 60 * 60 * 1000);
        }, delay);
    };
    scheduleRefresh(() => {
        weather.init(root);
        news.init(root);
        calendar.init(root);
    });
};
