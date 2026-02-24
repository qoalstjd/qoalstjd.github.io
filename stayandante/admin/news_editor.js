window.initModule = ({ root, params }) => {
    const titleEl = root.querySelector(".dialog-title p");
    const contentEl = root.querySelector('[data-field="content"]');
    let focusEl = null;
    contentEl.addEventListener("focusin", (e) => {
        if (e.target.closest('[data-field="content"] > *')) {
            focusEl = e.target.closest('[data-field="content"] > *');
        }
    });
    const focusEditable = (el) => {
        if (!el) return;
        const matchEl = el.matches("[contenteditable]") ? el : el.querySelector("[contenteditable]");
        matchEl.focus();
        focusEl = el.closest('[data-field="content"] > *');
    };
    // 제목
    titleEl.insertAdjacentHTML(
        "afterbegin",
        `<select data-field="tag">
            ${["새소식", "공지"].map((t) => `<option value="${t}" ${t === params.tag ? "selected" : ""}>${t}</option>`).join("")}
        </select>`
    );
    // 도구 > 요소
    const elementHandlers = {
        p: (el) => {
            el.contentEditable = true;
            el.textContent = "문구를 입력하세요";
        },
        h2: (el) => {
            el.contentEditable = true;
            el.textContent = "제목을 입력하세요";
        },
        ul: (ul) => {
            const li = document.createElement("li");
            li.contentEditable = true;
            li.textContent = "리스트 항목";
            ul.append(li);
        },
        ol: (ol) => {
            const li = document.createElement("li");
            li.contentEditable = true;
            li.textContent = "리스트 항목";
            ol.append(li);
        },
        img: (img) => {
            img.src = "/placeholder.png";
            img.contentEditable = false;
            const srcInput = document.createElement("div");
            srcInput.dataset.act = "src";
            srcInput.contentEditable = true;
            img.after(srcInput);
        },
    };
    const addEl = (elName) => {
        const el = document.createElement(elName);
        elementHandlers[elName]?.(el);
        focusEl ? focusEl.after(el) : contentEl.append(el);
        focusEditable(el);
    };
    root.querySelector(".element").addEventListener("click", (e) => {
        const btn = e.target.closest("[data-act]");
        if (!btn) return;
        addEl(btn.dataset.act);
    });
    // 도구 > 유틸
    root.querySelector(".util").addEventListener("click", (e) => {
        if (!focusEl) return;
        // 위로
        if (e.target.closest('[data-act="up"]')) {
            const prev = focusEl.previousElementSibling;
            if (!prev) return;
            prev.before(focusEl);
            focusEditable(focusEl);
        }
        // 아래로
        if (e.target.closest('[data-act="down"]')) {
            const next = focusEl.nextElementSibling;
            if (!next) return;
            next.after(focusEl);
            focusEditable(focusEl);
        }
        // 삭제
        if (e.target.closest('[data-act="del"]')) {
            const next = focusEl.nextElementSibling || focusEl.previousElementSibling;
            focusEl.remove();
            focusEditable(next);
        }
    });
    // 컨텐츠
    contentEl.querySelectorAll(":scope > *:not(ul):not(ol):not(img)").forEach((el) => (el.contentEditable = true));
    contentEl.querySelectorAll("li").forEach((li) => (li.contentEditable = true));
    contentEl.querySelectorAll("img").forEach((el) => {
        if (el.nextElementSibling?.dataset.act === "src") return;
        const srcInput = document.createElement("div");
        srcInput.dataset.act = "src";
        srcInput.contentEditable = true;
        srcInput.textContent = el.src;
        el.after(srcInput);
    });
    contentEl.addEventListener("keydown", (e) => {
        if (e.target.closest("li") && e.key === "Enter") {
            e.preventDefault();
            const li = e.target.closest("li");
            const newLi = document.createElement("li");
            newLi.contentEditable = true;
            newLi.textContent = "리스트 항목";
            li.after(newLi);
            newLi.focus();
        }
    });
    contentEl.addEventListener("input", (e) => {
        if (e.target.closest("[data-act='src']")) {
            const srcInput = e.target.closest("[data-act='src']");
            const img = srcInput.previousElementSibling;
            img.src = srcInput.textContent.trim();
        }
    });
    contentEl.addEventListener("focusout", (e) => {
        if (e.target.closest("li")) {
            const li = e.target.closest("li");
            const ul = li.closest("ul");
            if (!li.textContent.trim()) {
                if (ul.querySelectorAll("li").length === 1) {
                    ul.remove();
                } else {
                    li.remove();
                }
            }
        }
    });
    // 내보내기
    root.querySelector('[data-act="apply"]').onclick = () => {
        const turndownService = new TurndownService();
        const md = turndownService.turndown(contentEl.innerHTML);
        const dlg = window.dialog.stack.at(-1);
        dlg?.apply?.({
            tag: root.querySelector('[data-field="tag"]').value,
            title: root.querySelector('[data-field="title"]').textContent.trim(),
            content: md,
        });
    };
};
