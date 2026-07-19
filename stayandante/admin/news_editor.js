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
        const matchEl = el.matches("[contenteditable]") ? el : el.querySelector("[contenteditable]:last-child");
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
            return el;
        },
        h2: (el) => {
            el.contentEditable = true;
            el.textContent = "제목을 입력하세요";
            return el;
        },
        ul: (ul) => {
            const li = document.createElement("li");
            li.contentEditable = true;
            li.textContent = "리스트 항목";
            if (focusEl.tagName === "UL") {
                focusEl.append(li);
            } else {
                ul.append(li);
            }
            return ul;
        },
        ol: (ol) => {
            const li = document.createElement("li");
            li.contentEditable = true;
            li.textContent = "리스트 항목";
            if (focusEl.tagName === "OL") {
                focusEl.append(li);
            } else {
                ol.append(li);
            }
            return ol;
        },
        img: (img) => {
            const p = document.createElement("p");
            img.src = "https://cdn.jsdelivr.net/gh/qoalstjd/common@v1.0.513/images/fallback_16x9.png";
            img.contentEditable = false;
            p.appendChild(img);
            const srcInput = document.createElement("span");
            srcInput.dataset.act = "src";
            srcInput.contentEditable = true;
            srcInput.textContent = "이미지 업로드 > url 복사 > 붙여넣기";
            p.appendChild(srcInput);
            return p;
        },
    };
    const addEl = (elName) => {
        const el = elementHandlers[elName](document.createElement(elName));
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
            if (!confirm("해당 항목을 삭제하시겠습니까?")) return;
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
        el.closest("p").contentEditable = false;
        const srcInput = document.createElement("span");
        srcInput.dataset.act = "src";
        srcInput.contentEditable = true;
        const url = el.src.replace(/^https?:\/\/stayandante\.com/, "");
        srcInput.textContent = url;
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
        if (e.target.closest("p, h2") && e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const br = document.createElement("br");
            const sel = window.getSelection();
            const range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(br);
            range.setStartAfter(br);
            range.setEndAfter(br);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    });
    contentEl.addEventListener("input", (e) => {
        if (e.target.closest("[data-act='src']")) {
            const srcInput = e.target.closest("[data-act='src']");
            const img = srcInput.previousElementSibling;
            img.src = srcInput.textContent.trim();
        }
    });
    contentEl.addEventListener("input", (e) => {
        const target = e.target.closest("[data-act='src']");
        if (!target) return;
        const img = target.previousElementSibling;
        if (img?.tagName === "IMG") img.src = target.textContent.trim();
    });
    contentEl.addEventListener("paste", (e) => {
        const target = e.target.closest("[data-act='src']");
        if (!target) return;
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text");
        target.textContent = text;
        const img = target.previousElementSibling;
        if (img?.tagName === "IMG") img.src = text.trim();
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
        contentEl.querySelectorAll("[data-act='src']").forEach((el) => el.remove());
        const md = turndownService.turndown(contentEl.innerHTML);
        const dlg = window.dialog.stack.at(-1);
        dlg?.apply?.({
            tag: root.querySelector('[data-field="tag"]').value,
            title: root.querySelector('[data-field="title"]').textContent.trim(),
            content: md,
        });
    };
};
