/* =========================================================
   数字园丁日志 —— 交互逻辑
   - 动态注入共享导航栏与页脚
   - 当前页面高亮
   - 今日新叶（首页最近 3 条）
   - 知识苗圃分类筛选
   - 树下拾遗时间轴渲染
   - 我的工具箱「功能开发中」提示
   ========================================================= */

(function () {
  "use strict";

  function currentFile() {
    const p = window.location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 导航配置 ---------- */
  const NAV = [
    { label: "今日新叶",   href: "index.html",    key: "index.html" },
    { label: "知识苗圃",   href: "knowledge.html", key: "knowledge.html" },
    { label: "树下拾遗",   href: "thoughts.html",  key: "thoughts.html" },
    { label: "我的工具箱", href: "toolbox.html",   key: "toolbox.html" },
    { label: "关于园丁",   href: "about.html",     key: "about.html" }
  ];

  const cur = currentFile();

  const LEAF_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>' +
    '<path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>';

  /* ---------- 注入导航栏 ---------- */
  function injectNav() {
    const el = document.getElementById("site-nav");
    if (!el) return;
    let links = NAV.map(function (n) {
      const active = n.key === cur ? ' class="active"' : "";
      return '<a href="' + n.href + '"' + active + '>' + esc(n.label) + "</a>";
    }).join("");
    el.innerHTML =
      '<div class="nav-inner">' +
        '<span class="nav-brand">' + LEAF_SVG + "<span>" + esc(SITE.siteName) + "</span></span>" +
        '<nav class="nav-links">' + links + "</nav>" +
      "</div>";
  }

  /* ---------- 注入页脚 ---------- */
  function injectFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML =
      "© " + SITE.year + " " + esc(SITE.authorName) +
      ' | 用 <span class="heart">♥</span> 与 <span class="heart">🌱</span> 慢慢培育' +
      ' &nbsp;·&nbsp; <a href="about.html">关于园丁</a>';
  }

  /* ---------- Toast 提示框 ---------- */
  let toastTimer = null;
  function showToast(title, body) {
    let t = document.getElementById("toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      document.body.appendChild(t);
    }
    t.innerHTML =
      '<div class="t-title">' + esc(title) + "</div>" +
      '<div class="t-body">' + esc(body) + "</div>" +
      '<div class="t-ok">[ 点击任意处关闭 ]</div>';
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 2600);
  }
  function hideToast() {
    const t = document.getElementById("toast");
    if (t) t.classList.remove("show");
  }
  document.addEventListener("click", function (e) {
    const t = document.getElementById("toast");
    if (t && t.classList.contains("show") && !e.target.closest("#toast")) hideToast();
  });

  /* ---------- 今日新叶（首页最近 3 条） ---------- */
  function renderHomeUpdates() {
    const list = document.getElementById("recent-updates");
    if (!list) return;
    const items = (recentUpdates || []).slice(0, 3);
    list.innerHTML = items.map(function (u) {
      return '<li>' +
        '<span class="leaf-mark">🌿</span>' +
        '<a class="u-title" href="' + u.link + '">' + esc(u.title) + "</a>" +
        '<span class="u-date">' + esc(u.date) + "</span>" +
      "</li>";
    }).join("");
  }

  /* ---------- 知识苗圃：卡片 + 筛选 ---------- */
  function renderResources() {
    const grid = document.getElementById("resource-grid");
    if (!grid) return;
    const tagSet = [];
    (resources || []).forEach(function (r) { if (tagSet.indexOf(r.tag) < 0) tagSet.push(r.tag); });
    const tags = ["全部"].concat(tagSet);

    const filterBar = document.getElementById("filters");
    if (filterBar) {
      filterBar.innerHTML = tags.map(function (t, i) {
        return '<button class="filter-btn' + (i === 0 ? " active" : "") +
          '" data-tag="' + esc(t) + '">' + esc(t) + "</button>";
      }).join("");
    }

    function draw(tag) {
      const data = (tag === "全部" ? resources : resources.filter(function (r) { return r.tag === tag; }));
      grid.innerHTML = data.map(function (r) {
        return '<article class="card">' +
          '<div class="seed">🌱</div>' +
          "<h3>" + esc(r.title) + "</h3>" +
          '<p class="desc">' + esc(r.desc) + "</p>" +
          '<div class="meta">' +
            '<span class="type-badge">' + esc(r.type) + "</span>" +
            '<span class="date">' + esc(r.date) + "</span>" +
          "</div>" +
        "</article>";
      }).join("") || '<p class="muted">// 这块苗圃还空着，等园丁来播种</p>';
    }
    draw("全部");

    if (filterBar) {
      filterBar.addEventListener("click", function (e) {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        filterBar.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        draw(btn.getAttribute("data-tag"));
      });
    }
  }

  /* ---------- 树下拾遗：时间轴 ---------- */
  function renderThoughts() {
    const wrap = document.getElementById("timeline");
    if (!wrap) return;
    const sorted = (thoughts || []).slice().sort(function (a, b) {
      return a.date < b.date ? 1 : -1;
    });
    wrap.innerHTML = sorted.map(function (t) {
      return '<div class="timeline-item">' +
        '<div class="t-head">' +
          "<h3>" + esc(t.title) + "</h3>" +
          '<span class="t-date">' + esc(t.date) + "</span>" +
          '<span class="t-read">⏱ ' + esc(t.readingTime) + "</span>" +
        "</div>" +
        '<p class="t-summary">' + esc(t.summary) + "</p>" +
      "</div>";
    }).join("");
  }

  /* ---------- 我的工具箱 ---------- */
  function renderTools() {
    const grid = document.getElementById("tool-grid");
    if (!grid) return;
    grid.innerHTML = (tools || []).map(function (t) {
      return '<div class="tool-card" data-id="' + esc(t.id) + '" data-name="' + esc(t.name) + '">' +
        '<div class="tool-icon">' + esc(t.icon) + "</div>" +
        "<h3>" + esc(t.name) + "</h3>" +
        '<p class="t-desc">' + esc(t.desc) + "</p>" +
      "</div>";
    }).join("");

    grid.addEventListener("click", function (e) {
      const card = e.target.closest(".tool-card");
      if (!card) return;
      const name = card.getAttribute("data-name");
      showToast("🌿 还在培育中", "「" + name + "」这件家当正在打磨，敬请期待下一次生长。");
    });
  }

  /* ---------- 关于页：园丁名片 ---------- */
  function renderProfile() {
    const box = document.getElementById("profile");
    if (!box) return;
    box.innerHTML =
      '<div class="avatar">' + LEAF_SVG + "</div>" +
      '<div class="info">' +
        '<div class="row"><span class="key">姓名</span><span class="val">' + esc(SITE.authorName) + "</span></div>" +
        '<div class="row"><span class="key">身份</span><span class="val">信息技术教师</span></div>' +
        '<div class="row"><span class="key">培育科目</span><span class="val">编程启蒙 · 网络与安全 · 人工智能</span></div>' +
        '<div class="row"><span class="key">从教年限</span><span class="val">8 年</span></div>' +
        '<div class="row"><span class="key">园丁信条</span><span class="val">慢慢生长，静待花开</span></div>' +
      "</div>";
  }

  /* ---------- 关于页：署名 / 邮箱 ---------- */
  function renderContact() {
    const name = document.getElementById("about-name");
    if (name) name.textContent = SITE.authorName;
    const mail = document.getElementById("contact-email");
    if (mail) {
      mail.innerHTML = '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "</a>";
    }
  }

  /* ---------- 启动 ---------- */
  function init() {
    injectNav();
    injectFooter();
    renderHomeUpdates();
    renderResources();
    renderThoughts();
    renderTools();
    renderProfile();
    renderContact();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
