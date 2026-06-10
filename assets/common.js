// File: assets/common.js

document.addEventListener("DOMContentLoaded", function () {

  /* =========================================================
     1. ハンバーガーメニュー（ドロワー）
     ========================================================= */
  const menuToggle = document.querySelector(".menu-toggle");
  const drawer = document.querySelector(".drawer");
  const overlay = document.querySelector(".drawer-overlay");

  if (menuToggle && drawer && overlay) {
    const openDrawer = function () {
      drawer.classList.add("is-open");
      overlay.classList.add("is-open");
      menuToggle.classList.add("is-open");
      document.body.classList.add("drawer-locked");
      menuToggle.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");
    };

    const closeDrawer = function () {
      drawer.classList.remove("is-open");
      overlay.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      document.body.classList.remove("drawer-locked");
      menuToggle.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
    };

    // トグル開閉
    menuToggle.addEventListener("click", function () {
      if (drawer.classList.contains("is-open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // オーバーレイクリックで閉じる
    overlay.addEventListener("click", closeDrawer);

    // ドロワー内リンク選択で閉じる
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeDrawer);
    });

    // Escキーで閉じる
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });

    // PC幅に戻ったら強制クローズ
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });
  }

  /* =========================================================
     2. 画像プレースホルダーの一括適用
     ========================================================= */
  document.querySelectorAll(".img-ph").forEach(function (el) {
    const src = el.getAttribute("data-img");

    // パス未設定・プレースホルダー文字列なら空状態を維持
    if (!src || src.trim() === "" || src.indexOf("REPLACE_ME") !== -1) {
      el.classList.add("is-empty");
      return;
    }

    // 事前読み込みして、成功したら背景に適用
    const img = new Image();
    img.onload = function () {
      el.style.backgroundImage = "url('" + src + "')";
      el.classList.remove("is-empty");
      el.classList.add("is-loaded");
    };
    img.onerror = function () {
      el.classList.add("is-empty");
    };
    img.src = src;
  });

  /* =========================================================
     3. スクロール連動アニメーション ＋ 数値カウントアップ
     ========================================================= */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");

  // 非対応環境・低モーション設定 → 全要素を即時表示
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.textContent = parseInt(el.getAttribute("data-count"), 10).toLocaleString("ja-JP");
    });
    return;
  }

  // フェードイン・スライドイン
  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.querySelectorAll("[data-count]").forEach(animateCounter);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // 数値カウントアップ
  function animateCounter(el) {
    if (el.dataset.counted === "true") return;
    el.dataset.counted = "true";

    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1400;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = Math.round(target * eased).toLocaleString("ja-JP");
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString("ja-JP");
      }
    }
    requestAnimationFrame(update);
  }

});