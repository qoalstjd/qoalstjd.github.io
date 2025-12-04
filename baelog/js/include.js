const SPA = {
    main: document.querySelector("main"),
    routes: {},
    getLinkcd() {
        const params = new URLSearchParams(location.search);
        return params.get("linkcd") || "HO01001";
    },
    showErrorFallback: ({ code = "default" } = {}) => {
        const msg = {
            401: ["로그인이 필요합니다.", "로그인 후 다시 이용해주세요."],
            403: ["접근할 수 없습니다", "권한을 확인해주세요."],
            404: ["페이지를 찾을 수 없습니다.", "주소를 확인해주세요."],
            500: ["서버에 오류가 있습니다.", "잠시 후 다시 시도해주세요."],
            503: ["서비스 점검중입니다.", "조금만 기다려주세요."],
            default: ["요청을 처리할 수 없습니다.", "다시 시도해주세요."],
        }[code] || { default: ["요청을 처리할 수 없습니다.", "다시 시도해주세요."] };
        SPA.main.innerHTML = `
            <h2>${msg[0]}</h2>
            <p>${msg[1]}</p>
            <a href="/baelog">홈으로</a>
        `
    },
    loadPage(linkcd) {
        const route = this.routes[linkcd];
        if (!route) return this.showErrorFallback({ code: 404 });
        const runScripts = () => {
            document.querySelectorAll("script[data-spa]").forEach(s => s.remove());
            this.main.querySelectorAll("script").forEach(old => {
                const s = document.createElement("script");
                if (old.src) s.src = old.src;
                else s.textContent = old.textContent;
                s.dataset.spa = "1";
                document.body.appendChild(s);
                old.remove();
            });
        };
        fetch(route.path)
            .then(res => {
                if (!res.ok) throw res.status;
                return res.text();
            })
            .then(html => {
                this.main.innerHTML = html;
                runScripts();
            })
            .catch(code => {
                this.showErrorFallback({ code });
            });
    },
    _bindEvent() {
        document.addEventListener("click", (e) => {
            const a = e.target.closest("a");
            if (!a) return;
            if (!a.getAttribute("href")?.startsWith("/baelog")) return;
            if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            const url = new URL(a.href, location.origin);
            const linkcd = url.searchParams.get("linkcd") || "HO01001";
            this.loadPage(linkcd);
            history.pushState({ linkcd }, "", "/baelog");
        });
        window.addEventListener("popstate", (e) => {
            const linkcd = e.state?.linkcd || this.getLinkcd();
            this.loadPage(linkcd);
        });
    },
    init() {
        fetch("/baelog/js/menu.json")
            .then((res) => res.json())
            .then((data) => {
                this.routes = data;
                const linkcd = this.getLinkcd();
                this.loadPage(linkcd);
                history.replaceState({ linkcd }, "", "/baelog");
                this._bindEvent();
            });
    },
};

SPA.init();
