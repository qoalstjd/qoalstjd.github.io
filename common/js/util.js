// =========================
// URL 파라미터 관리
// =========================
const paramManager = {
    /**
     * URL 파라미터 추가/수정
     * @@ add({ linkcd: 'string' })
     */
    add(obj) {
        const url = new URL(location.href);
        const p = url.searchParams;
        Object.entries(obj).forEach(([k, v]) => p.set(k, v));
        history.replaceState({}, "", url);
    },
    /**
     * 특정 파라미터 제거
     * @@ remove("page")
     */
    remove(key) {
        const url = new URL(location.href);
        url.searchParams.delete(key);
        history.replaceState({}, "", url);
    },
    /**
     * 모든 파라미터 객체로 반환
     * @@ getAll() → { page: "2", sort: "new" }
     */
    getAll() {
        const p = new URL(location.href).searchParams;
        const obj = {};
        p.forEach((v, k) => (obj[k] = v));
        return obj;
    },
    /**
     * 단일 파라미터 조회
     * @@ get("page") → "2"
     */
    get(key) {
        return new URL(location.href).searchParams.get(key);
    },
};
// =========================
// localStorage 캐시 관리
// =========================
const cacheManager = {
    prefix: "cache_",
    defaultTTL: 3600 * 1000, // 1시간
    _getKey(key) {
        return this.prefix + key;
    },
    /**
     * 캐시 저장
     * @@ set("list", data)
     * @@ set("theme", "dark", { persist: true })
     * @@ set("api", data, { ttl: 5000 })
     */
    set(key, data, { persist = false, ttl } = {}) {
        try {
            localStorage.setItem(
                this._getKey(key),
                JSON.stringify({
                    data,
                    persist,
                    ttl: persist ? null : ttl ?? this.defaultTTL,
                    timestamp: persist ? null : Date.now(),
                })
            );
        } catch (e) {
            console.error("Cache set 에러:", e);
        }
    },
    /**
     * 캐시 조회
     * @@ get("list")
     */
    get(key) {
        try {
            const cached = localStorage.getItem(this._getKey(key));
            if (!cached) return null;
            const { data, persist, ttl, timestamp } = JSON.parse(cached);
            if (!persist && ttl && timestamp && Date.now() - timestamp > ttl) {
                this.remove(key);
                return null;
            }
            return data;
        } catch (e) {
            console.error("Cache get 에러:", e);
            return null;
        }
    },
    /**
     * 캐시 제거
     * @@ remove("list")
     */
    remove(key) {
        localStorage.removeItem(this._getKey(key));
    },
    /** prefix 기준 전체 캐시 제거 */
    clear() {
        Object.keys(localStorage)
            .filter((k) => k.startsWith(this.prefix))
            .forEach((k) => localStorage.removeItem(k));
    },
};
// =========================
// fetch + cache 래퍼
// =========================
const fetchManager = {
    /**
     * GET 요청 (자동 캐싱)
     * @@ get(url)
     * @@ get(url, { parse: "text" })
     */
    async get(url, options = {}) {
        const parse = options.parse || "json";

        try {
            const cached = cacheManager.get(url);
            if (cached) return cached;

            const res = await fetch(url, options);
            if (!res.ok) throw new Error(res.status);

            let data;
            switch (parse) {
                case "text":
                    data = await res.text();
                    break;
                case "blob":
                    data = await res.blob();
                    break;
                case "arrayBuffer":
                    data = await res.arrayBuffer();
                    break;
                default:
                    data = await res.json();
            }

            cacheManager.set(url, data);
            return data;
        } catch (err) {
            console.error("fetchManager 에러:", err);
            return null;
        }
    },

    /**
     * fetch 캐시 제거
     * @@ clear(url)
     * @@ clear() // 전체
     */
    clear(url) {
        if (url) cacheManager.remove(url);
        else cacheManager.clear();
    },
};
// =========================
// 데이터 바인딩
// =========================
const bindData = (root, data) => {
    const tpl = (str, data) => str.replace(/{{(.*?)}}/g, (_, k) => data[k.trim()] ?? "");
    /**
     * 사용 예:
     * @@ <h2 data-bind-txt="{{title}}"></h2>
     * @@ <img data-bind-src="/img/{{category}}.png">
     * @@ <a data-bind-href="/list?id={{id}}">보기</a>
     */
    root.querySelectorAll("[data-bind-txt]").forEach((el) => {
        el.textContent = tpl(el.dataset.bindTxt, data);
    });
    root.querySelectorAll("[data-bind-src]").forEach((el) => {
        el.src = tpl(el.dataset.bindSrc, data);
        if (el.dataset.bindOnerror) {
            el.onerror = () => {
            el.onerror = null; // 무한루프 방지
            el.src = tpl(el.dataset.bindOnerror, data);
            };
        }
    });
    root.querySelectorAll("[data-bind-href]").forEach((el) => {
        el.href = tpl(el.dataset.bindHref, data);
    });
    root.querySelectorAll("[data-bind-html]").forEach((el) => {
        el.innerHTML = tpl(el.dataset.bindHtml, data);
    });
};

window.paramManager = paramManager;
window.cacheManager = cacheManager;
window.fetchManager = fetchManager;
window.bindData = bindData;

cacheManager.clear();
