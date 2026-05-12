const common = {
    init(root = document) {
        this.lnb(root);

        if (this._boundSpaChange) return;
        this._boundSpaChange = true;
        document.addEventListener("spa:change", (e) => {
            const dep1Key = SPA.getDep1Key(e.detail.linkcd);
            this.setGuideClass(dep1Key);
        });
    },
    setGuideClass(dep1Key) {
        const main = document.querySelector(".wrap main");
        if (!main) return;
        const CLASS_MAP = {
            m0500: "foundation",
            m0600: "style",
            m0700: "component",
        };
        const pageClass = CLASS_MAP[dep1Key];
        if (!pageClass) return;
        main.className = ["guide", pageClass].filter(Boolean).join(" ");
        this.guideItem.init();
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
                    <img src="${window.BASE}/images/post/thum_${key}.png">
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
            const curViewType = window.cacheManager?.get("postviewtype") || "table";
            this.posts.dataset.postviewtype = curViewType;
            this.viewWrap.querySelector(".is-active")?.classList.remove("is-active");
            this.viewWrap.querySelector(`[data-act='${curViewType}']`).classList.add("is-active");
            this.viewWrap?.addEventListener("click", (e) => {
                const type = e.target.closest("[data-act]") ? e.target.dataset.act : null;
                if (!type) return;
                this.viewWrap.querySelector(".is-active")?.classList.remove("is-active");
                e.target.closest(`[data-act="${type}"]`).classList.add("is-active");
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
            this._onResize = () => {
                this.tops = this.headings.map((h) => ({
                    id: h.id,
                    top: h.getBoundingClientRect().top + window.pageYOffset - 80,
                }));
            };
            this._onScroll = () => {
                const y = window.scrollY + 100;
                let current;

                for (const h of this.headings) {
                    if (y >= h.offsetTop) current = h.id;
                }

                links.forEach((a) => a.classList.toggle("txt-point", a.hash === `#${current}`));
            };
            this._onResize();
            window.addEventListener("resize", this._onResize);
            window.addEventListener("scroll", this._onScroll);
        },
        unbindScroll() {
            if (!this._scrollBound) return;

            window.removeEventListener("resize", this._onResize);
            window.removeEventListener("scroll", this._onScroll);

            this._scrollBound = false;
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
            console.log(meta);
            bindData(wrap, {
                ...meta,
                postLength: related.length,
            });
        },
    },
    guideItem: {
        init() {
            document.querySelectorAll(".guide-preview").forEach((item) => {
                // preview 내부 HTML 가져오기
                const source = item.innerHTML.trim();
                const formatted = this.formatHTML(source);
                // tools
                const tools = document.createElement("div");
                tools.className = "guide-tools";
                tools.innerHTML = this.insertTools();
                // code block
                const code = document.createElement("code");
                code.className = "guide-code";
                code.innerHTML = this.parseHTML(formatted);
                // 펼치기 토글버튼
                const toggle = document.createElement("button");
                toggle.className = "guide-toggle";
                toggle.dataset.act = "toggle";
                toggle.innerHTML = "더보기";
                // preview 아래 삽입
                item.insertAdjacentElement("afterend", toggle);
                item.insertAdjacentElement("afterend", code);
                item.insertAdjacentElement("afterend", tools);
            });
        },
        // 도구 삽입
        insertTools() {
            const html = `
                <button class="ico-wrap pd-4 ml-auto" data-act="copy" data-tip="복사">
                    <svg><use href="#act-copy"></use></svg>
                </button>`;
            return html;
        },
        // HTML 들여쓰기 정리
        formatHTML(html) {
            html = html.replace(/>\s+</g, "><").trim();
            const div = document.createElement("div");
            div.innerHTML = html;
            const formatNode = (node, depth = 0) => {
                const indent = "    ".repeat(depth);
                let output = "";
                node.childNodes.forEach((child) => {
                    // element
                    if (child.nodeType === 1) {
                        const tag = child.tagName.toLowerCase();
                        // 자식이 text 하나만 있으면 inline 유지
                        const isInlineText = child.childNodes.length === 1 && child.firstChild.nodeType === 3;
                        if (isInlineText) {
                            output += `${indent}<${tag}`;
                            [...child.attributes].forEach((attr) => {
                                output += ` ${attr.name}="${attr.value}"`;
                            });
                            output += `>${child.textContent}</${tag}>\n`;
                        } else {
                            output += `${indent}<${tag}`;
                            [...child.attributes].forEach((attr) => {
                                output += ` ${attr.name}="${attr.value}"`;
                            });
                            output += `>\n`;
                            output += formatNode(child, depth + 1);
                            output += `${indent}</${tag}>\n`;
                        }
                    }
                    // text
                    else if (child.nodeType === 3) {
                        const text = child.textContent.trim();
                        if (text) {
                            output += `${indent}${text}\n`;
                        }
                    }
                });
                return output;
            };
            return formatNode(div).trim();
        },
        // HTML Syntax Highlight
        parseHTML(str) {
            str = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            str = str.replace(/(&lt;\/?)([\w-]+)(.*?)(\/?&gt;)/g, (_, start, tagName, attrs, end) => {
                attrs = attrs.replace(/([\w-:]+)=(".*?"|'.*?')/g, (_, attrName, attrValue) => {
                    const quote = attrValue[0];
                    const value = attrValue.slice(1, -1);
                    return `<span class="code-attr">${attrName}</span><span class="code-equals">=</span><span class="code-quote">${quote}</span><span class="code-string">${value}</span><span class="code-quote">${quote}</span>`;
                });
                return `<span class="code-tag">${start}</span><span class="code-tag-name">${tagName}</span>${attrs}<span class="code-tag">${end}</span>`;
            });
            return str;
        },
    },
};

window.common = common;
