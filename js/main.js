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

  /* ---------- 伝統文化を紡ぐ: ピン留め＋文字リベール ---------- */
  var missionReveal = document.querySelector(".mission-reveal");
  var pinWrap = document.querySelector(".mission-pin-wrap");
  var canPin = window.matchMedia("(min-width: 901px)").matches &&
               !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (missionReveal && pinWrap && canPin) {
    // 右カラムの文字を1文字ずつ <span> で包む（改行・空白はそのまま維持）
    var revealChars = [];
    (function wrapChars(node) {
      var children = Array.prototype.slice.call(node.childNodes);
      children.forEach(function (child) {
        if (child.nodeType === 3) {
          // テキストノード
          var text = child.textContent;
          var frag = document.createDocumentFragment();
          for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            if (ch.trim() === "") {
              frag.appendChild(document.createTextNode(ch));
            } else {
              var span = document.createElement("span");
              span.className = "reveal-char";
              span.textContent = ch;
              frag.appendChild(span);
              revealChars.push(span);
            }
          }
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          wrapChars(child);
        }
      });
    })(missionReveal);

    // ピン演出が有効なことを示す（CSSで金色の縦棒を初期非表示にする）
    missionReveal.classList.add("reveal-active");

    var totalChars = revealChars.length;
    var lastShown = -1;

    function updateMissionReveal() {
      var rect = pinWrap.getBoundingClientRect();
      var distance = pinWrap.offsetHeight - window.innerHeight;
      var progress = distance > 0 ? -rect.top / distance : 0;
      progress = Math.max(0, Math.min(1, progress));

      // ピン留め区間の 5%〜80% を使って全文を出し切る
      var start = 0.05;
      var end = 0.8;
      var p = (progress - start) / (end - start);
      p = Math.max(0, Math.min(1, p));

      // 金色の縦棒: スクロールが始まったら表示
      if (p > 0) {
        missionReveal.classList.add("bar-shown");
      } else {
        missionReveal.classList.remove("bar-shown");
      }

      var target = Math.round(p * totalChars);
      if (target === lastShown) return;

      if (target > lastShown) {
        for (var i = Math.max(lastShown, 0); i < target; i++) {
          revealChars[i].classList.add("is-shown");
        }
      } else {
        for (var j = target; j < lastShown; j++) {
          revealChars[j].classList.remove("is-shown");
        }
      }
      lastShown = target;
    }

    window.addEventListener("scroll", updateMissionReveal, { passive: true });
    window.addEventListener("resize", updateMissionReveal);
    updateMissionReveal();
  }

  /* ---------- ニュースフィルタータブ ---------- */
  var newsTabs = document.querySelectorAll(".news-tab");
  var newsItems = document.querySelectorAll(".news-item");

  newsTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var filter = this.getAttribute("data-filter");

      newsTabs.forEach(function (t) { t.classList.remove("is-active"); });
      this.classList.add("is-active");

      newsItems.forEach(function (item) {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.classList.remove("is-hidden");
        } else {
          item.classList.add("is-hidden");
        }
      });
    });
  });

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
