const URLParam = {
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
        p.forEach((v, k) => obj[k] = v);
        return obj;
    },
    get(key) {
        return new URL(location.href).searchParams.get(key);
    }
};

window.URLParam = URLParam;