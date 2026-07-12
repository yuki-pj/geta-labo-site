/* ============================================
   GETA LABO — メインスクリプト
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- ヘッダーのスクロール変化 ---------- */
  var header = document.getElementById("header");

  function updateHeader() {
    var concept = document.getElementById("concept");
    var pastConcept = concept ? concept.getBoundingClientRect().bottom <= 0 : window.scrollY > 60;
    if (pastConcept) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader);
  updateHeader();

  /* ---------- ハンバーガーメニュー ---------- */
  var hamburger = document.getElementById("hamburger");
  var navOverlay = document.getElementById("navOverlay");
  var hamburgerLabel = document.getElementById("hamburgerLabel");
  var navLinks = document.querySelectorAll(".nav-link");

  function toggleMenu() {
    hamburger.classList.toggle("is-active");
    navOverlay.classList.toggle("is-open");

    var isOpen = navOverlay.classList.contains("is-open");
    hamburgerLabel.textContent = isOpen ? "CLOSE" : "MENU";
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function closeMenu() {
    hamburger.classList.remove("is-active");
    navOverlay.classList.remove("is-open");
    hamburgerLabel.textContent = "MENU";
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", toggleMenu);

  // メニューリンクをクリックしたらメニューを閉じる
  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  /* ---------- スクロール連動フェードインアニメーション ---------- */
  var fadeElements = document.querySelectorAll(".fade-in");

  var observerOptions = {
    root: null,
    rootMargin: "0px 0px -80px 0px",
    threshold: 0.1
  };

  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  /* ---------- 商品カード 上品な浮上フェード ---------- */
  var productReveals = document.querySelectorAll('.product-reveal');
  productReveals.forEach(function (el) {
    fadeObserver.observe(el);
  });

  /* ---------- ニュース：CMSのお知らせ一覧から自動読み込み＋フィルタータブ ----------
     同じサーバーの /news（CMSが生成するお知らせ一覧）から最新記事を取り込む。
     読み込みに失敗した場合は、HTMLに書いてある固定リストをそのまま表示する（保険）。 */
  var NEWS_SOURCE = "/news";
  var NEWS_FETCH_MAX = 12;   // 取り込む記事数（タブ切り替え用の在庫）
  var NEWS_VISIBLE_MAX = 4;  // 一度に表示する記事数
  var newsListEl = document.querySelector("#news .news-list");
  var newsTabs = document.querySelectorAll(".news-tab");

  function applyNewsFilter(filter) {
    if (!newsListEl) return;
    var shown = 0;
    newsListEl.querySelectorAll(".news-item").forEach(function (item) {
      var match = filter === "all" || item.getAttribute("data-category") === filter;
      if (match && shown < NEWS_VISIBLE_MAX) {
        item.classList.remove("is-hidden");
        shown++;
      } else {
        item.classList.add("is-hidden");
      }
    });

    var empty = newsListEl.querySelector(".news-empty");
    if (shown === 0) {
      if (!empty) {
        empty = document.createElement("p");
        empty.className = "news-empty";
        empty.style.cssText = "padding: 24px 0; color: #888; font-size: 0.9rem;";
        empty.textContent = "該当するお知らせはまだありません。";
        newsListEl.appendChild(empty);
      }
      empty.style.display = "";
    } else if (empty) {
      empty.style.display = "none";
    }
  }

  newsTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      newsTabs.forEach(function (t) { t.classList.remove("is-active"); });
      this.classList.add("is-active");
      applyNewsFilter(this.getAttribute("data-filter"));
    });
  });

  function buildNewsItem(li) {
    var link = li.querySelector("a[href]");
    var title = li.querySelector(".news-ttl");
    if (!link || !title) return null; // タブ等、記事以外のliは除外

    var a = document.createElement("a");
    a.href = link.getAttribute("href");
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "news-item fade-in is-visible";

    var img = li.querySelector(".img-box img");
    if (img) {
      var thumb = document.createElement("img");
      thumb.className = "news-thumb";
      thumb.src = img.getAttribute("src");
      thumb.alt = img.getAttribute("alt") || "";
      thumb.loading = "lazy";
      a.appendChild(thumb);
    }

    var body = document.createElement("div");
    body.className = "news-body";
    var meta = document.createElement("div");
    meta.className = "news-meta";

    var dateSrc = li.querySelector(".news-date");
    var time = document.createElement("time");
    time.className = "news-date";
    time.textContent = dateSrc ? dateSrc.textContent.trim() : "";
    meta.appendChild(time);

    var tagSrc = li.querySelector(".news-tag");
    var tagText = tagSrc ? tagSrc.textContent.trim() : "";
    if (tagText) {
      var tag = document.createElement("span");
      tag.className = "news-tag";
      tag.textContent = tagText;
      meta.appendChild(tag);
    }
    a.setAttribute("data-category", tagText);

    var titleEl = document.createElement("p");
    titleEl.className = "news-title";
    titleEl.textContent = title.textContent.trim();

    body.appendChild(meta);
    body.appendChild(titleEl);
    a.appendChild(body);
    return a;
  }

  function loadLatestNews() {
    if (!newsListEl || !window.fetch || !window.DOMParser) return;

    fetch(NEWS_SOURCE).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.text();
    }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var built = [];
      doc.querySelectorAll("ul.news-list li.item").forEach(function (li) {
        if (built.length >= NEWS_FETCH_MAX) return;
        var item = buildNewsItem(li);
        if (item) built.push(item);
      });
      if (built.length === 0) throw new Error("no news items found");

      newsListEl.innerHTML = "";
      built.forEach(function (item) { newsListEl.appendChild(item); });

      var activeTab = document.querySelector(".news-tab.is-active");
      applyNewsFilter(activeTab ? activeTab.getAttribute("data-filter") : "all");
    }).catch(function () {
      // 読み込み失敗時は何もしない＝HTMLの固定リストがそのまま表示される
    });
  }

  loadLatestNews();

  /* ---------- スムーススクロール ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;

      var target = document.querySelector(targetId);
      if (target) {
        var headerHeight = header.offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });

});
