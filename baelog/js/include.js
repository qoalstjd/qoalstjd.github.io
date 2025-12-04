const main = document.querySelector("main");
let routes = {};

fetch("/baelog/js/menu.json")
    .then((res) => res.json())
    .then((data) => (routes = data))
    .then(() => initSPA());
function getLinkcd() {
    const params = new URLSearchParams(window.location.search);
    return params.get("linkcd") || "m000001";
}
function loadPage(linkcd) {
    const route = routes[linkcd] || routes["m010001"];
    fetch(route.path)
        .then((res) => res.text())
        .then((html) => (main.innerHTML = html))
        .catch(() => (main.innerHTML = "<p>Page not found</p>"));
}
function initSPA() {
    document.addEventListener("click", e => {
        const a = e.target.closest("a");
        if (!a) return;
        if (!a.getAttribute("href")?.startsWith("/baelog")) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        const url = new URL(a.href, location.origin);
        const linkcd = url.searchParams.get("linkcd") || "m010001";
        loadPage(linkcd);
        history.pushState({ linkcd }, "", "/baelog");
    });
    // 뒤로가기
    window.addEventListener("popstate", (e) => {
        const linkcd = e.state?.linkcd || getLinkcd();
        loadPage(linkcd);
    });
    // 초기 진입
    const initialLinkcd = getLinkcd();
    loadPage(initialLinkcd);
    history.replaceState({ linkcd: initialLinkcd }, "", "/baelog");
}
