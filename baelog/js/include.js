const SPA = {
    main: document.querySelector(".wrap > main"),
    routes: {},
    // linkcd 가져오기: history.state → sessionStorage → 기본값
    getLinkcd() {
        return history.state?.linkcd || sessionStorage.getItem("linkcd") || "m0100000";
    },
    showErrorFallback({ code = "default" } = {}) {
        const msg = {
            401: ["로그인이 필요합니다.", "로그인 후 이용해주세요."],
            403: ["접근 권한이 없습니다.", "권한을 확인해주세요."],
            404: ["페이지를 찾을 수 없습니다.", "입력한 주소를 확인해주세요."],
            500: ["서버 오류가 발생했습니다.", "잠시 후 다시 시도해주세요."],
            503: ["서비스 점검 중입니다.", "잠시 후 다시 이용해주세요."],
            default: ["요청을 처리할 수 없습니다.", "다시 시도해주세요."],
        }[code] || ["요청을 처리할 수 없습니다.", "다시 시도해주세요."];
        this.main.className = "error";
        this.main.innerHTML = `
            <i class="lottie" data-src="/common/json/error.json"></i>
            <strong class="fs-20">${msg[0]}</strong>
            <p>${msg[1]}</p>
            <div class="btn-wrap">
                <button class="btn h-40 bg-300" onclick="history.back()">뒤로가기</button>
                <a href="/baelog" class="btn h-40 bg-point">홈으로</a>
            </div>
        `;
        window.ui?.lottie?.init?.();
    },
    // LNB 렌더링 (depth 2 기준)
    renderLNB(dep1Key) {
        const wrap = this.main.closest(".wrap");
        let lnb = wrap.querySelector(".lnb");
        lnb?.remove();
        const items = Object.entries(this.routes)
            .filter(([key, r]) => r.dep1 === dep1Key && r.depth === 2)
            .map(([key, r]) => `<li><a href="/baelog/index.html?linkcd=${key}">${r.name}</a></li>`);
        if (items.length) {
            const dep1Name = this.routes[dep1Key].name;
            lnb = document.createElement("div");
            lnb.className = "lnb";
            lnb.innerHTML = `<h1 class="fs-26">${dep1Name}</h1><ul>${items.join("")}</ul>`;
            wrap.prepend(lnb);
        }
    },
    // 페이지 내부 스크립트 실행
    runScripts() {
        document.querySelectorAll("script[data-spa]").forEach((s) => s.remove());
        this.main.querySelectorAll("script").forEach((old) => {
            const s = document.createElement("script");
            if (old.src) s.src = old.src;
            else s.textContent = old.textContent;
            s.dataset.spa = "1";
            document.body.appendChild(s);
            old.remove();
        });
    },
    // GNB/ LNB active 처리
    _setActive(linkcd) {
        const gnb = document.querySelector(".gnb");
        const lnb = document.querySelector(".lnb");
        // GNB
        gnb?.querySelectorAll("li a i").forEach(i => i.classList.remove("bg-point"));
        const dep1Key = this.routes[linkcd]?.dep1 || linkcd;
        gnb?.querySelector(`a[href*="linkcd=${dep1Key}"] i`)?.classList.add("bg-point");
        // LNB
        lnb?.querySelectorAll("li a").forEach(a => a.classList.remove("txt-point"));
        const lnbCur = lnb?.querySelector(`a[href*="linkcd=${linkcd}"]`) || lnb?.querySelector("li:first-child a");
        lnbCur?.classList.add("txt-point");
        // main 클래스
        this.main.className = this.routes[dep1Key].name.toLowerCase();
    },
    _bindEvent() {
        document.addEventListener("click", (e) => {
            const a = e.target.closest("a");
            if (!a) return;
            if (!a.getAttribute("href")?.startsWith("/baelog")) return;
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            const url = new URL(a.href, location.origin);
            const linkcd = url.searchParams.get("linkcd") || "m0100000";
            this.loadPage(linkcd);
        });
        window.addEventListener("popstate", (e) => {
            const linkcd = e.state?.linkcd || this.getLinkcd();
            this.loadPage(linkcd, true);
        });
    },
    loadPage(linkcd, replaceHistory=false) {
        const route = this.routes[linkcd];
        if (!route) return this.showErrorFallback({ code: 404 });
        fetch(route.path)
            .then(res => {
                if (!res.ok) {
                    const code = res.status;
                    throw code;
                }
                return res.text();
            })
            .then(html => {
                const dep1Key = Object.entries(this.routes)
                    .find(([key, r]) => (String(key).slice(1, 3) === linkcd.slice(1, 3)) && r.depth === 1)?.[0] || linkcd;
                this.renderLNB(dep1Key);
                this._setActive(linkcd);
                this.main.className = this.routes[dep1Key].name.toLowerCase();
                this.main.innerHTML = html;
                this.runScripts();
                if (route.tab) {
                    this.main.dataset.tab = route.tab
                }
                sessionStorage.setItem("linkcd", linkcd);
                if (replaceHistory) {
                    history.replaceState({ linkcd }, "", "/baelog");
                } else {
                    history.pushState({ linkcd }, "", "/baelog");
                }
            })
            .catch(code => {
                sessionStorage.removeItem("linkcd");
                this.showErrorFallback({ code });
            });
    },
    init() {
        fetch("/baelog/js/menu.json")
            .then((res) => res.json())
            .then((data) => {
                this.routes = data;
                const url = new URL(window.location.href, window.location.origin);
                const linkcd = url.searchParams.get("linkcd") || this.getLinkcd();
                this.loadPage(linkcd, true);
                this._bindEvent();
            });
    },
};

SPA.init();
