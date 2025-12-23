const ui = {
    init(root = document) {
        this.global.init();
        this.page.init(root);
    },
    global: {
        _inited: false,
        init() {
            if (this._inited) return;
            this._inited = true;
            ui.btn.init();
        },
    },
    page: {
        init(root) {
            ui.tag.init(root);
            ui.swiper.init(root);
            ui.tab?.init(root);
        },
    },
    debouncer: function (fn, delay = 200) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    },
    lottie: {
        init() {
            document.querySelectorAll(".lottie").forEach((el) => {
                this.setup(el);
                this.load(el);
            });
        },
        setup(el) {
            const size = el.dataset.size || 96;
            el.style.width = size * 0.1 + "rem";
            el.style.height = size * 0.1 + "rem";
        },
        load(el) {
            const src = el.dataset.src;
            lottie.loadAnimation({
                container: el,
                renderer: "svg",
                loop: false,
                autoplay: true,
                path: src,
                clearCanvas: true,
            });
        },
        msg(msg, target = document.body, src = "/common/json/error.json") {
            const wrap = document.createElement("div");
            wrap.className = "lottie-wrap";
            wrap.innerHTML = `
                <div class="lottie" data-src="${src}"></div>
                <strong class="fs-20">${msg[0]}</strong>
                <p>${msg[1]}</p>
            `;
            target.innerHTML = "";
            target.appendChild(wrap);

            this.setup(wrap.querySelector(".lottie"));
            this.load(wrap.querySelector(".lottie"));

            return wrap;
        },
    },
    swiper: {
        instances: [],
        createInstance(el) {
            const instance = {
                el,
                wrapper: el.querySelector(".swiper-wrapper"),
                slides: el.querySelectorAll(".swiper-slide"),
                prevBtn: el.querySelector(".ico[data-ico='prev']"),
                nextBtn: el.querySelector(".ico[data-ico='next']"),
                pagination: el.querySelector(".swiper-pagination"),
                index: 0,
                total: el.querySelectorAll(".swiper-slide").length,

                loop: el.dataset.loop !== "false", // data-loop="false" 면 루프 끔
                speed: parseInt(el.dataset.speed || 300), // data-speed
                hasPagination: el.dataset.pagination !== "false", // data-pagination="false" 면 생성 안함

                createPagination() {
                    if (!this.pagination || !this.hasPagination) return;
                    this.pagination.innerHTML = "";
                    for (let i = 0; i < this.total; i++) {
                        const dot = document.createElement("span");
                        dot.addEventListener("click", () => {
                            this.index = i;
                            this.update();
                        });
                        this.pagination.appendChild(dot);
                    }
                },

                updatePagination() {
                    if (!this.pagination || !this.hasPagination) return;
                    this.pagination.querySelectorAll("span").forEach((s, i) => s.classList.toggle("active", i === this.index));
                },

                bindEvents() {
                    this.prevBtn?.addEventListener("click", () => {
                        this.index--;
                        this.update();
                    });
                    this.nextBtn?.addEventListener("click", () => {
                        this.index++;
                        this.update();
                    });

                    let startX = 0,
                        currentX = 0,
                        dragging = false;

                    const getWrapperWidth = () => this.wrapper.offsetWidth;

                    const setTransform = (x, instant = false) => {
                        this.wrapper.style.transition = instant ? "none" : `transform ${this.speed}ms`;
                        this.wrapper.style.transform = `translateX(${x}px)`;
                    };

                    const startDrag = (x) => {
                        dragging = true;
                        startX = x;
                        currentX = -this.index * getWrapperWidth();
                        setTransform(currentX, true);
                    };

                    const moveDrag = (x) => {
                        if (!dragging) return;
                        const diff = x - startX;
                        setTransform(currentX + diff, true);
                    };

                    const endDrag = (x) => {
                        if (!dragging) return;
                        dragging = false;
                        const diff = x - startX;
                        const threshold = getWrapperWidth() * 0.2; // 20% 이상 움직이면 슬라이드 이동
                        if (diff > threshold) this.index--;
                        else if (diff < -threshold) this.index++;
                        this.update();
                    };

                    // 터치 이벤트
                    this.wrapper.addEventListener("touchstart", (e) => startDrag(e.touches[0].clientX));
                    this.wrapper.addEventListener("touchmove", (e) => moveDrag(e.touches[0].clientX));
                    this.wrapper.addEventListener("touchend", (e) => endDrag(e.changedTouches[0].clientX));

                    // 마우스 이벤트
                    this.wrapper.addEventListener("mousedown", (e) => {
                        e.preventDefault();
                        startDrag(e.clientX);
                        const moveHandler = (ev) => moveDrag(ev.clientX);
                        const upHandler = (ev) => {
                            endDrag(ev.clientX);
                            document.removeEventListener("mousemove", moveHandler);
                            document.removeEventListener("mouseup", upHandler);
                        };
                        document.addEventListener("mousemove", moveHandler);
                        document.addEventListener("mouseup", upHandler);
                    });
                },

                update() {
                    const wrapperWidth = this.wrapper.offsetWidth;
                    if (this.loop) {
                        if (this.index < 0) this.index = this.total - 1;
                        if (this.index >= this.total) this.index = 0;
                    } else {
                        this.index = Math.max(0, Math.min(this.index, this.total - 1));
                    }
                    const x = -this.index * wrapperWidth;
                    this.wrapper.style.transition = `transform ${this.speed}ms`;
                    this.wrapper.style.transform = `translateX(${x}px)`;
                    this.updatePagination();
                },

                init() {
                    this.createPagination();
                    this.bindEvents();
                    this.update();
                },
            };

            instance.init();
            return instance;
        },
        init(root = document, selector = ".swiper") {
            root.querySelectorAll(selector).forEach((el) => {
                const inst = this.createInstance(el);
                this.instances.push(inst);
            });
        },
    },
    tag: {
        init(root = document) {
            root.querySelectorAll(".tag-wrap").forEach((wrap) => {
                let isDown = false;
                let startX = 0;
                let startScroll = 0;

                wrap.style.cursor = "grab";

                wrap.addEventListener("mousedown", (e) => {
                    isDown = true;
                    startX = e.pageX;
                    startScroll = wrap.scrollLeft;
                    wrap.style.cursor = "grabbing";
                });

                wrap.addEventListener("mousemove", (e) => {
                    if (!isDown) return;
                    e.preventDefault();
                    wrap.scrollLeft = startScroll - (e.pageX - startX);
                });

                window.addEventListener("mouseup", () => {
                    isDown = false;
                    wrap.style.cursor = "grab";
                });
            });
        },
    },
    btn: {
        init() {
            document.addEventListener("click", (e) => {
                const el = e.target.closest("[data-action]");
                if (!el) return;
                const action = el.dataset.action;
                this[action]?.(el);
            });
        },
        theme() {
            const root = document.documentElement;
            const next = root.dataset.theme === "dark" ? "light" : "dark";
            root.dataset.theme = next;
            window.cacheManager.set("theme", next);
        },
        sort(el) {
            const next = el.dataset.sort === "desc" ? "asc" : "desc";
            el.dataset.sort = next;
            const icon = el.querySelector("i[data-ico]");
            if (icon) {
                icon.dataset.ico = next === "asc"
                ? "up-fill"
                : "down-fill";
            }
            el.dispatchEvent(new CustomEvent("sortChange", {
                    bubbles: true,
                    detail: {
                    key: el.dataset.sortKey,
                    order: next
                }
            }));
        },
        toggle(el) {
            el.classList.toggle("is-active");
        },
    },
    dropdown: {
        setupDropdown(dropdown) {
            const label = dropdown.querySelector(".dropdown-label");
            const list = dropdown.querySelector(".dropdown-list");
            const buttons = list.querySelectorAll("button, a");
            let isOpen = false;

            dropdown.setAttribute("aria-expanded", "false");
            list.hidden = true;

            // ?�치?�인
            const rect = list.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            if (spaceBelow < getListHeight(list) && spaceAbove > rect.height) {
                dropdown.classList.add("above");
            } else {
                dropdown.classList.remove("above");
            }
            function getListHeight() {
                let height = 0;
                buttons.forEach((el, i) => {
                    height += el.offsetHeight;
                });
                console.log();
                return height;
            }
            function open() {
                isOpen = true;
                dropdown.setAttribute("aria-expanded", "true");
                list.style.height = getListHeight(list) + "px";
                list.hidden = false;
            }
            function close() {
                isOpen = false;
                dropdown.setAttribute("aria-expanded", "false");
                list.hidden = true;
                list.style.height = 0 + "rem";
            }
            // ?�벤?? 바인??
            label.addEventListener("click", function () {
                isOpen ? close() : open();
            });
            buttons.forEach((btn, i) => {
                btn.addEventListener("click", () => {
                    close();
                    if (btn.tagName.toLowerCase() === "button") {
                        buttons.forEach((b, j) => {
                            b.setAttribute("aria-selected", i === j ? "true" : "false");
                        });
                        label.textContent = buttons[i].textContent;
                        if (label.textContent == "The last month" || label.textContent == "The last three month" || label.textContent == "The last six month") {
                            searchReportList();
                        }
                    }
                });
            });
            window.addEventListener("resize", () => {
                close();
            });
            document.addEventListener("click", (e) => {
                if (!dropdown.contains(e.target)) close();
            });
        },
        init(_selector, options = {}) {
            let root;
            if (!_selector) {
                root = document;
            } else if (typeof _selector === "string") {
                root = document.querySelector(_selector);
            } else if (_selector instanceof Element) {
                root = _selector;
            } else {
                console.warn("Invalid selector or element:", _selector);
                return;
            }
            if (!root) return;
            root.querySelectorAll(".dropdown").forEach((el) => this.setupDropdown(el, options));
        },
    },
    copyClipBoard: function (text) {
        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(text)
                .then(() => alert("Email address copied."))
                .catch(fallback);
        } else {
            fallback();
        }
        function fallback() {
            const t = document.createElement("textarea");
            t.value = text;
            t.style.position = "fixed";
            t.style.opacity = "0";
            document.body.appendChild(t);
            t.focus();
            t.select();
            try {
                const ok = document.execCommand("copy");
                alert(ok ? "Copied!" : "Copy failed.");
            } catch {
                alert("Error copying.");
            }
            document.body.removeChild(t);
        }
    },
    tab: {
        setupTabs(tabWrap) {
            const container = tabWrap.parentElement;
            const tabs = tabWrap.querySelectorAll('[role="tab"]');
            tabs.forEach((tab) => {
                const targetPanel = document.getElementById(tab.getAttribute("aria-controls"));
                tab.addEventListener("click", () => {
                    container.querySelectorAll('[role="tabpanel"]').forEach((panel) => (panel.hidden = true));
                    if (targetPanel) targetPanel.hidden = false;

                    if (!tab.getAttribute("href")?.startsWith("#")) {
                        tabs.forEach((t) => t.setAttribute("aria-selected", false));
                        tab.setAttribute("aria-selected", true);
                    } else {
                        e.preventDefault();
                        const tabAreaBottom = document.querySelector("#header").getBoundingClientRect().bottom + document.querySelector(".tab-area a").offsetHeight;
                        const tabHeight = document.querySelector(tab.getAttribute("href")).offsetTop;
                        const y = tabHeight - tabAreaBottom;
                        requestAnimationFrame(() => {
                            window.scrollTo({ top: y, behavior: "auto" });
                        });
                    }

                    // 2025.07.03 CMH 추�? .  ?? �??�클�? 처리
                    if (typeof tabClickHandler === "function") {
                        tabClickHandler(tab.getAttribute("aria-controls"));
                    }
                });
            });
        },
        setupScrollTab() {
            const scrollY = window.scrollY;
            const tabAreaBottom = document.querySelector("#header").getBoundingClientRect().bottom + document.querySelector(".tab-area a").offsetHeight;
            document.querySelectorAll("section").forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionBottom = sectionTop + sectionHeight;
                if (scrollY + tabAreaBottom >= sectionTop - 4 && scrollY + tabAreaBottom < sectionBottom) {
                    document.querySelectorAll(".tab-area .tab-wrap a").forEach((tab) => {
                        const href = tab.getAttribute("href");
                        tab.setAttribute("aria-selected", href === `#${section.id}`);
                    });
                }
            });
        },
        init() {
            document.querySelectorAll('[role="tablist"]').forEach((tabWrap) => {
                this.setupTabs(tabWrap);
            });
            if (document.querySelector(".tab-area .tab-wrap a")?.getAttribute("href").startsWith("#")) {
                window.addEventListener("scroll", () => this.setupScrollTab());
            }
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (location.hash) {
                        document.querySelector(location.hash)?.scrollIntoView({ behavior: "instant" });
                    }
                });
            });
        },
        scrollTable: {
            scrollRatio: 0.2,
            minDistance: 100,
            setup(container) {
                const table = container.querySelector("table");
                const thead = table.querySelector("thead");
                const firstCol = table.querySelector("tr th:first-child, tr td:first-child");
                const leftBtn = Object.assign(document.createElement("button"), {
                    className: "left",
                    textContent: "scroll to left",
                });
                const rightBtn = Object.assign(document.createElement("button"), {
                    className: "right",
                    textContent: "scroll to right",
                });

                const wrapper = document.createElement("div");
                wrapper.className = "arrow-btns";
                wrapper.append(leftBtn, rightBtn);
                container.prepend(wrapper);
                const update = () => {
                    const { offsetWidth: cW, scrollLeft } = container;
                    const tW = table.offsetWidth;
                    leftBtn.style.display = scrollLeft > 0 ? "inline-block" : "none";
                    rightBtn.style.display = scrollLeft + cW < tW ? "inline-block" : "none";
                    const thHeight = thead?.offsetHeight || 42;
                    const firstW = firstCol?.offsetWidth || 0;
                    wrapper.style.top = `${thHeight / 2 - 8}px`;
                    leftBtn.style.left = `${firstW + 8}px`;
                };
                leftBtn.addEventListener("click", () =>
                    container.scrollBy({
                        left: -Math.max(this.minDistance, container.scrollWidth * this.scrollRatio),
                        behavior: "smooth",
                    })
                );
                rightBtn.addEventListener("click", () =>
                    container.scrollBy({
                        left: Math.max(this.minDistance, container.scrollWidth * this.scrollRatio),
                        behavior: "smooth",
                    })
                );
                container.addEventListener("scroll", update);
                new ResizeObserver(update).observe(thead);
                new ResizeObserver(update).observe(container);
                new ResizeObserver(update).observe(firstCol);
                update();
            },
            init() {
                document.querySelectorAll(".table-wrap").forEach((el) => this.setup(el));
            },
        },
    },
    setScrollLock: (lock = true) => {
        document.body.style.overflow = lock ? "hidden" : "";
    },
    setDimmed: (active = true, zIndex = "") => {
        const dim = document.querySelector(".dim");
        if (!dim) return;
        if (active) {
            dim.classList.add("active");
            dim.style.zIndex = zIndex;
            dim.style.pointerEvents = "auto";
        } else {
            dim.classList.remove("active");
            dim.style.zIndex = "";
            dim.style.pointerEvents = "none";
        }
    },
};

document.querySelectorAll(".inp").forEach((inp) => {
    const input = inp.querySelector("input, textarea");
    const clearBtn = inp.querySelector(".clear-btn");

    if (!input || !clearBtn) return;

    input.addEventListener("input", () => {
        clearBtn.style.display = input.value ? "block" : "none";
    });

    clearBtn.addEventListener("click", () => {
        input.value = "";
        clearBtn.style.display = "none";
        input.focus();
        input.dispatchEvent(new Event("input"));
    });
});

window.ui = ui;
