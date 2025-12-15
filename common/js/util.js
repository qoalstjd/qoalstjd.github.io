const paramManager = {
    add(obj) {
        const url = new URL(location.href);
        const p = url.searchParams;
        Object.entries(obj).forEach(([k, v]) => p.set(k, v));
        history.replaceState({}, "", url);
    },
    remove(key) {
        const url = new URL(location.href);
        url.searchParams.delete(key);
        history.replaceState({}, "", url);
    },
    getAll() {
        const p = new URL(location.href).searchParams;
        const obj = {};
        p.forEach((v, k) => (obj[k] = v));
        return obj;
    },
    get(key) {
        return new URL(location.href).searchParams.get(key);
    },
};
const cacheManager = {
    prefix: "cache_",
    ttl: 3600 * 1000,
    _getKey(key) {
        return this.prefix + key;
    },
    set(key, data) {
        try {
            localStorage.setItem(this._getKey(key), JSON.stringify({ data, timestamp: Date.now() }));
        } catch (err) {
            console.error("Cache set 에러:", err);
        }
    },
    get(key) {
        try {
            const cached = localStorage.getItem(this._getKey(key));
            if (!cached) return null;
            const { data, timestamp } = JSON.parse(cached);
            if (this.ttl && Date.now() - timestamp > this.ttl) {
                localStorage.removeItem(this._getKey(key));
                return null;
            }
            return data;
        } catch (err) {
            console.error("Cache get 에러:", err);
            return null;
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(this._getKey(key));
        } catch (err) {
            console.error("Cache remove 에러:", err);
        }
    },
    clear() {
        try {
            Object.keys(localStorage)
                .filter((k) => k.startsWith(this.prefix))
                .forEach((k) => localStorage.removeItem(k));
        } catch (err) {
            console.error("Cache clear 에러:", err);
        }
    },
};
const fetchManager = {
    ttl: 3600 * 1000,
    async get(url, options = { }) {
        const parse = options.parse || "json";
        try {
            // 캐시 조회
            const cached = cacheManager.get(url);
            if (cached) return cached;

            // fetch 요청
            const res = await fetch(url, options);
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

            let data;
            switch (parse) {
                case "text": data = await res.text(); break;
                case "blob": data = await res.blob(); break;
                case "arrayBuffer": data = await res.arrayBuffer(); break;
                default: data = await res.json(); break;
            }

            // cacheManager로 저장
            cacheManager.set(url, data);

            return data;
        } catch (err) {
            console.error("fetchManager 에러:", err);
            return null;
        }
    },

    clear(url) {
        try {
            if (url) cacheManager.remove(url);
            else {
                // fetch 관련 캐시만 삭제
                Object.keys(localStorage)
                    .filter(k => k.startsWith(cacheManager.prefix)) // 혹은 fetch 전용 prefix를 따로 쓸 수도 있음
                    .forEach(k => localStorage.removeItem(k));
            }
        } catch (err) {
            console.error("fetchManager clear 에러:", err);
        }
    }
};
// (async () => {
//     const data = await fetchManager.get("https://jsonplaceholder.typicode.com/todos/1");
// })();

window.paramManager = paramManager;
window.cacheManager = cacheManager;
window.fetchManager = fetchManager;

cacheManager.clear();