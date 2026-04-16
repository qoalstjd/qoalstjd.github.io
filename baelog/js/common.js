window.rootDir = "baelog";
const common = {
    init(root = document) {
        this.lnb(root);
    },
    lnb(root) {
        const wrap = document.querySelector(".wrap");
        if (!wrap) return;
        const hasLnb = wrap.querySelector(".lnb");
        wrap.classList.toggle("has-lnb", !!hasLnb);
    },
    postList: {
        init() {
            // if (!window.SPA) return;
            this.run();
        },
        run() {
            this.h2 = document.querySelector("[data-bind='title']");
            this.posts = document.querySelector("[data-bind='posts']");
            this.viewWrap = document.querySelector("[data-view]");
            if (!this.posts) return;
            const curLinkcd = SPA.getLinkcd();
            const parentKey = SPA.routes[curLinkcd]?.parent?.[0];
            this.section = SPA.routes[parentKey]?.name?.toLowerCase();
            this.category = SPA.routes[curLinkcd]?.name || "All Posts";
            this.curLinkcd = curLinkcd;
            this.h2.textContent = this.category;
            this.load();
            this.bindView();
            this.bindSort();
        },
        async load() {
            let data = await window.fetchManager?.get(window.BASE + "/js/posts.json");
            data = data.filter((p) => p.section === this.section);
            this.rawList = (this.category === "All Posts" ? data : data.filter((p) => p.category === this.category.toLowerCase())).map((p) => ({
                ...p,
                _ts: +new Date(p.date.replace(/\./g, "-")),
            }));
            if (!this.rawList.length) {
                this.empty();
                return;
            }
            this.render(this.rawList);
        },
        render(list) {
            const frag = document.createDocumentFragment();
            list.forEach((p) => frag.appendChild(this.item(p)));
            this.posts.replaceChildren(frag);
        },
        item(p) {
            const key = p.slug || p.category;
            const li = document.createElement("li");
            li.innerHTML = `
                <a href="${window.BASE}/index.html?linkcd=m0001&parentLinkcd=${this.curLinkcd}&fileName=${key}_${p.id}" class="box pd-0">
                    <img src="${window.BASE}/images/post/thum_${key}.png" class="w-full">
                    <div class="pd-16">
                    <p class="fs-12 txt-500">${p.category}</p>
                    <strong class="ell-1 mt-4">${p.id}. ${p.title}</strong>
                    <p class="fs-14 txt-700 ell-1">${p.summary}</p>
                    <p class="fs-12 txt-500 ta-r">${p.date}</p>
                    </div>
                </a>
            `;
            return li;
        },
        bindSort() {
            document.addEventListener("sortChange", (e) => {
                const { key, order } = e.detail;
                const sorted = [...this.rawList].sort((a, b) => (order === "asc" ? a._ts - b._ts : b._ts - a._ts));
                this.render(sorted);
            });
        },
        bindView() {
            this.posts.dataset.postviewtype = window.cacheManager?.get("postviewtype") || "grid";
            this.viewWrap?.addEventListener("click", (e) => {
                const type = e.target.closest('[data-act="grid"]') ? "grid" : e.target.closest('[data-act="block"]') ? "block" : e.target.closest('[data-act="table"]') ? "table" : null;
                if (!type) return;
                this.posts.dataset.postviewtype = type;
                window.cacheManager?.set("postviewtype", type);
            });
        },
        empty() {
            this.posts.style.display = "block";
            this.posts.style.border = "none";
            window.ui.lottie.msg(["포스트가 없습니다", "다른 카테고리를 확인해보세요"], this.posts);
        },
    },
    postDetail: {
        init({ root }) {
            this.run(root);
        },
        run(root) {
            this.root = root || document;
            const { fileName, parentLinkcd } = history.state || {};
            if (!fileName) return;
            this.post = this.root.querySelector('[data-bind="post"]');
            this.aside = this.root.querySelector('[data-bind="toc"]');
            if (!this.post || !this.aside) return;
            SPA.setActive(parentLinkcd);
            this.load(fileName, parentLinkcd);
        },
        async load(fileName, parentLinkcd) {
            const list = await fetchManager.get(window.BASE + "/js/posts.json");
            const meta = list.find((p) => `${p.slug || p.category}_${p.id}` === fileName);
            if (!meta) return;
            this.bindMeta(meta, parentLinkcd);
            await this.loadContent(fileName);
            this.buildTOC();
            this.bindScroll();
            this.buildRelated(list, meta, fileName, parentLinkcd);
        },
        bindMeta(meta, parentLinkcd) {
            const el = this.root.querySelector(".tit-wrap");
            if (!el) return;
            bindData(el, {
                ...meta,
                parentLinkcd: parentLinkcd || "m0100",
            });
        },
        async loadContent(fileName) {
            const html = await fetchManager.get(`${window.BASE}/uploads/posts/${fileName}.html`, { parse: "text", caching: false });
            this.post.innerHTML = html;
        },
        buildTOC() {
            const ul = this.aside.querySelector("ul");
            if (!ul) return;
            ul.innerHTML = "";
            this.headings = [...this.post.querySelectorAll("h2,h3,h4,h5,h6")];
            this.headings.forEach((h, i) => {
                h.id = `title${String(i + 1).padStart(2, "0")}`;
                const pad = h.tagName === "H3" ? "pl-12" : h.tagName === "H4" ? "pl-24" : "pl-0";
                ul.insertAdjacentHTML("beforeend", `<li class="${pad}"><a href="#${h.id}">${h.innerText}</a></li>`);
            });
        },
        bindScroll() {
            if (this._scrollBound) return;
            this._scrollBound = true;
            const links = [...this.aside.querySelectorAll("a")];

            const calc = () => {
                this.tops = this.headings.map((h) => ({
                    id: h.id,
                    top: h.getBoundingClientRect().top + window.pageYOffset - 80,
                }));
            };
            calc();
            window.addEventListener("resize", calc);
            window.addEventListener("scroll", () => {
                const y = window.scrollY + 100;
                let current;
                for (const h of this.headings) {
                    if (y >= h.offsetTop) current = h.id;
                }
                links.forEach((a) => a.classList.toggle("txt-point", a.hash === `#${current}`));
            });
        },
        buildRelated(list, meta, fileName, parentLinkcd) {
            const tbody = this.root.querySelector("[data-bind='relatedPost']");
            const wrap = this.root.querySelector(".related-wrap");
            if (!tbody || !wrap) return;
            tbody.innerHTML = "";
            const related = list.filter((p) => p.category === meta.category);
            if (!related.length) {
                tbody.innerHTML = "<tr><td>같은 카테고리의 포스트가 없습니다.</td></tr>";
                return;
            }
            related
                .sort((a, b) => a.id - b.id)
                .forEach((p) => {
                    const key = `${p.slug || p.category}_${p.id}`;
                    const tr = document.createElement("tr");
                    tr.tabIndex = 0;
                    tr.role = "button";
                    tr.innerHTML = `
                        <td class="txt-700 ta-c">${p.id}</td>
                        <td class="ell-1">${p.title} <span class="txt-500">- ${p.summary}</span></td>
                        <td class="txt-700 ta-c">${p.date}</td>
                    `;
                    if (key === fileName) {
                        tr.querySelectorAll("td").forEach((td) => td.classList.add("txt-point"));
                        tr.querySelectorAll("span").forEach((s) => s.classList.add("txt-point-sub"));
                    }
                    tr.onclick = () => {
                        const params = {
                            linkcd: "m0001",
                            parentLinkcd,
                            fileName: key,
                        };
                        sessionStorage.setItem("pageParams", JSON.stringify(params));
                        SPA.loadPage(params, false);
                    };
                    tbody.appendChild(tr);
                });
            bindData(wrap, {
                ...meta,
                postLength: related.length,
            });
        },
    },
};

window.common = common;
