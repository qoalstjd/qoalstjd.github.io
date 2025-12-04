window.ui = window.ui || {};

window.ui = {
    debouncer: function (fn, delay = 200) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
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
                            b.setAttribute(
                                "aria-selected",
                                i === j ? "true" : "false"
                            );
                        });
                        label.textContent = buttons[i].textContent;
                        if (
                            label.textContent == "The last month" ||
                            label.textContent == "The last three month" ||
                            label.textContent == "The last six month"
                        ) {
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
            root.querySelectorAll(".dropdown").forEach((el) =>
                this.setupDropdown(el, options)
            );
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
                const targetPanel = document.getElementById(
                    tab.getAttribute("aria-controls")
                );
                tab.addEventListener("click", () => {
                    container
                        .querySelectorAll('[role="tabpanel"]')
                        .forEach((panel) => (panel.hidden = true));
                    if (targetPanel) targetPanel.hidden = false;

                    if (!tab.getAttribute("href")?.startsWith("#")) {
                        tabs.forEach((t) =>
                            t.setAttribute("aria-selected", false)
                        );
                        tab.setAttribute("aria-selected", true);
                    } else {
                        e.preventDefault();
                        const tabAreaBottom =
                            document
                                .querySelector("#header")
                                .getBoundingClientRect().bottom +
                            document.querySelector(".tab-area a").offsetHeight;
                        const tabHeight = document.querySelector(
                            tab.getAttribute("href")
                        ).offsetTop;
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
            const tabAreaBottom =
                document.querySelector("#header").getBoundingClientRect()
                    .bottom +
                document.querySelector(".tab-area a").offsetHeight;
            document.querySelectorAll("section").forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionBottom = sectionTop + sectionHeight;
                if (
                    scrollY + tabAreaBottom >= sectionTop - 4 &&
                    scrollY + tabAreaBottom < sectionBottom
                ) {
                    document
                        .querySelectorAll(".tab-area .tab-wrap a")
                        .forEach((tab) => {
                            const href = tab.getAttribute("href");
                            tab.setAttribute(
                                "aria-selected",
                                href === `#${section.id}`
                            );
                        });
                }
            });
        },
        init() {
            document.querySelectorAll('[role="tablist"]').forEach((tabWrap) => {
                this.setupTabs(tabWrap);
            });
            if (
                document
                    .querySelector(".tab-area .tab-wrap a")
                    ?.getAttribute("href")
                    .startsWith("#")
            ) {
                window.addEventListener("scroll", () => this.setupScrollTab());
            }
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (location.hash) {
                        document
                            .querySelector(location.hash)
                            ?.scrollIntoView({ behavior: "instant" });
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
                const firstCol = table.querySelector(
                    "tr th:first-child, tr td:first-child"
                );
                const leftBtn = Object.assign(
                    document.createElement("button"),
                    {
                        className: "left",
                        textContent: "scroll to left",
                    }
                );
                const rightBtn = Object.assign(
                    document.createElement("button"),
                    {
                        className: "right",
                        textContent: "scroll to right",
                    }
                );

                const wrapper = document.createElement("div");
                wrapper.className = "arrow-btns";
                wrapper.append(leftBtn, rightBtn);
                container.prepend(wrapper);
                const update = () => {
                    const { offsetWidth: cW, scrollLeft } = container;
                    const tW = table.offsetWidth;
                    leftBtn.style.display =
                        scrollLeft > 0 ? "inline-block" : "none";
                    rightBtn.style.display =
                        scrollLeft + cW < tW ? "inline-block" : "none";
                    const thHeight = thead?.offsetHeight || 42;
                    const firstW = firstCol?.offsetWidth || 0;
                    wrapper.style.top = `${thHeight / 2 - 8}px`;
                    leftBtn.style.left = `${firstW + 8}px`;
                };
                leftBtn.addEventListener("click", () =>
                    container.scrollBy({
                        left: -Math.max(
                            this.minDistance,
                            container.scrollWidth * this.scrollRatio
                        ),
                        behavior: "smooth",
                    })
                );
                rightBtn.addEventListener("click", () =>
                    container.scrollBy({
                        left: Math.max(
                            this.minDistance,
                            container.scrollWidth * this.scrollRatio
                        ),
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
                document
                    .querySelectorAll(".table-wrap")
                    .forEach((el) => this.setup(el));
            },
        },
    },
    setScrollLock: (lock = true) => {
        document.body.style.overflow = lock ? "hidden" : "";
    },
    setDimmed : (active = true, zIndex = "") => {
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
    }
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

// DOMContentLoaded 초기실행
document.addEventListener("DOMContentLoaded", () => {
    window.ui.dropdown.init();
    window.ui.tab.init();
    window.ui.scrollTable.init();
});