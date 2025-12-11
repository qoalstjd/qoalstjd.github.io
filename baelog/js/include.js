const SPA = {
    wrap: document.querySelector(".wrap"),
    main: document.querySelector(".wrap > main"),
    routes: {},
    // linkcd 가져오기: history.state → sessionStorage → 기본값
    getLinkcd() {
        return history.state?.linkcd || sessionStorage.getItem("linkcd") || "m0100000";
    },
    // 현재화면의 depth1 메뉴 link 가져오기
    getDep1Key(linkcd) {
        const route = this.routes[linkcd];
        if (!route) return linkcd;
        return route.depth === 1 ? linkcd : route.parent?.[0] || linkcd;
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
        this.main.className = "flx col jc-c ai-c";
        this.main.innerHTML = `
            <i class="lottie" data-src="/common/json/error.json"></i>
            <strong class="fs-20">${msg[0]}</strong>
            <p>${msg[1]}</p>
            <div class="btn-wrap">
                <a href="/baelog" class="btn h-40 bg-point">홈으로</a>
            </div>
        `;
        window.ui?.lottie?.init?.();
        history.replaceState({ linkcd: "error" }, "", "/baelog");
    },
    // LNB 렌더링 (dep1key)
    renderLNB(dep1Key) {
        const lnb = this.wrap.querySelector(".lnb");
        lnb?.remove();
        const items = Object.entries(this.routes)
            .filter(([key, r]) => r.parent?.includes(dep1Key) && r.depth === 2)
            .map(([key, r]) => `<li><a href="/baelog?linkcd=${key}">${r.name}</a></li>`);
        if (items.length) {
            const dep1Name = this.routes[dep1Key]?.name || "";
            const newLnb = document.createElement("div");
            newLnb.className = "lnb";
            newLnb.innerHTML = `<h1 class="fs-26">${dep1Name}</h1><ul>${items.join("")}</ul>`;
            this.wrap.prepend(newLnb);
        }
    },
    // 페이지 내부 스크립트 실행
    runScripts(linkcd) {
        document.querySelectorAll("script[data-linkcd]").forEach((s) => s.remove());
        const scripts = Array.from(this.main.querySelectorAll("script"));
        requestAnimationFrame(() => {
            scripts.forEach((oldScript) => {
                const newScript = document.createElement("script");
                if (oldScript.src) newScript.src = oldScript.src;
                else newScript.textContent = oldScript.textContent;
                newScript.dataset.linkcd = linkcd;
                document.body.appendChild(newScript);
                oldScript.remove();
            });
        });
    },
    // GNB/ LNB active 처리
    setActive(linkcd) {
        const gnb = document.querySelector(".gnb");
        const lnb = document.querySelector(".lnb");
        gnb?.querySelectorAll("li a i").forEach((i) => i.classList.remove("bg-point"));
        const route = this.routes[linkcd];
        const dep1Key = route?.depth === 1 ? linkcd : route?.parent?.[0] || linkcd;
        gnb?.querySelector(`a[href*="linkcd=${dep1Key}"] i`)?.classList.add("bg-point");
        lnb?.querySelectorAll("li a").forEach((a) => a.classList.remove("txt-point"));
        const lnbCur = lnb?.querySelector(`a[href*="linkcd=${linkcd}"]`) || lnb?.querySelector("li:first-child a");
        lnbCur?.classList.add("txt-point");
        this.main.className = this.routes[dep1Key]?.name.toLowerCase() || "";
    },
    bindEvent() {
        document.addEventListener("click", (e) => {
            const a = e.target.closest("a");
            if (!a) return;
            if (!a.href.startsWith(location.origin + "/baelog")) return;
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            const url = new URL(a.href);
            const params = Object.fromEntries(url.searchParams.entries());
            if (!params.linkcd) params.linkcd = "m0100000";
            sessionStorage.setItem("pageParams", JSON.stringify(params));
            this.loadPage(params, false);
        });
        window.addEventListener("popstate", (e) => {
            const state = e.state || {};
            if (!state.linkcd) state.linkcd = "m0100000";
            sessionStorage.setItem("pageParams", JSON.stringify(state));
            this.loadPage(state, true);
        });
    },
    loadPage(params = { "linkcd": "m0100000" }, replaceHistory = false) {
        let route = this.routes[params.linkcd];
        if (!route) return this.showErrorFallback({ code: 404 });

        const dep1Key = this.getDep1Key(params.linkcd);
        if (route.depth === 1) {
            const firstChild = Object.entries(this.routes).find(([k, r]) => r.parent?.includes(params.linkcd) && r.depth === 2);
            if (firstChild) {
                params.linkcd = firstChild[0];
                route = this.routes[params.linkcd];
            }
        }
        fetch(route.path)
            .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
            .then((html) => {
                this.main.innerHTML = html;
                this.renderLNB(dep1Key);
                this.setActive(params.linkcd);
                this.runScripts(params.linkcd);

                if (replaceHistory) {   
                    history.replaceState(params, "", "/baelog");
                }
                else {
                    if (history.state?.linkcd === "error") {
                        history.replaceState(params, "", "/baelog");
                    } else {
                        history.pushState(params, "", "/baelog");
                    }
                }
            })
            .catch((code) => {
                this.showErrorFallback({ code });
            });
    },
    init() {
        fetch("/baelog/js/menu.json")
            .then((res) => res.json())
            .then((data) => {
                this.routes = data;
                const url = new URL(window.location.href, window.location.origin);
                let params = Object.fromEntries(url.searchParams.entries());
                if (Object.keys(params).length === 0) {
                    const saved = sessionStorage.getItem("pageParams");
                    if (saved) params = JSON.parse(saved);
                }
                if (!params.linkcd) params.linkcd = "m0100000";
                this.loadPage(params, true);
                this.bindEvent();
            });
    },
};

SPA.init();
