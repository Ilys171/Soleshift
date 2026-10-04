(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------- Respect reduced motion for the scanner sweep line (SMIL) ---------- */
  if (reduceMotion) {
    document.querySelectorAll(".scan-sweep animate").forEach(function (a) {
      a.remove();
    });
  }

  /* ---------- Nav scroll shadow ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 8) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById("navBurger");
  var mobile = document.getElementById("navMobile");
  burger.addEventListener("click", function () {
    var open = mobile.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobile.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mobile.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Language switcher (display only) ---------- */
  document.querySelectorAll("[data-lang-switch]").forEach(function (sw) {
    var btn = sw.querySelector(".lang-current");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var open = sw.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!sw.contains(e.target)) sw.classList.remove("open");
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- Count-up stats ---------- */
  var statEls = document.querySelectorAll(".stat-num");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion || target === 0) {
      el.textContent = prefix + target + suffix;
      return;
    }
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(step);
  }
  if (statEls.length) {
    if ("IntersectionObserver" in window) {
      var statObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              statObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 },
      );
      statEls.forEach(function (el) {
        statObserver.observe(el);
      });
    } else {
      statEls.forEach(animateCount);
    }
  }

  /* ---------- Dashed connector line draw ---------- */
  var dashLine = document.querySelector(".dash-draw");
  if (dashLine) {
    if ("IntersectionObserver" in window) {
      var dashObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              dashLine.classList.add("drawn");
              dashObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 },
      );
      dashObserver.observe(document.querySelector(".steps-flow"));
    } else {
      dashLine.classList.add("drawn");
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".acc-item").forEach(function (item) {
    var trigger = item.querySelector(".acc-trigger");
    var panel = item.querySelector(".acc-panel");
    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".acc-item.open").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".acc-panel").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        panel.style.maxHeight = null;
      } else {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------- Build log viewer ---------- */
  var logImg = document.getElementById("logImg");
  var logCode = document.getElementById("logCode");
  var logText = document.getElementById("logText");
  var logRows = document.querySelectorAll(".log-row");
  logRows.forEach(function (row) {
    row.addEventListener("click", function () {
      logRows.forEach(function (r) {
        r.classList.remove("active");
        r.setAttribute("aria-pressed", "false");
      });
      row.classList.add("active");
      row.setAttribute("aria-pressed", "true");
      logImg.src = row.getAttribute("data-src");
      logImg.alt = row.getAttribute("data-alt");
      logImg.style.objectPosition = row.getAttribute("data-pos") || "50% 50%";
      logCode.textContent = row.getAttribute("data-code");
      logText.textContent = row.getAttribute("data-cap");
    });
  });

  /* ---------- Hero point cloud (foot made of dots) ---------- */
  var svg = document.getElementById("pointCloud");
  if (svg) {
    var NS = "http://www.w3.org/2000/svg";
    var w = 240,
      h = 320;

    function inEllipse(px, py, cx, cy, rx, ry) {
      var dx = (px - cx) / rx,
        dy = (py - cy) / ry;
      return dx * dx + dy * dy <= 1;
    }

    var shapes = [
      { cx: 120, cy: 235, rx: 46, ry: 62 }, // heel / arch
      { cx: 118, cy: 118, rx: 54, ry: 78 }, // forefoot
    ];
    var toes = [
      { cx: 92, cy: 44, r: 15 },
      { cx: 112, cy: 30, r: 16 },
      { cx: 134, cy: 26, r: 15 },
      { cx: 155, cy: 34, r: 13 },
      { cx: 172, cy: 50, r: 11 },
    ];

    var points = [];
    var target = 190;
    var attempts = 0;
    while (points.length < target && attempts < target * 20) {
      attempts++;
      var x = Math.random() * w;
      var y = Math.random() * h;
      var hit =
        shapes.some(function (s) {
          return inEllipse(x, y, s.cx, s.cy, s.rx, s.ry);
        }) ||
        toes.some(function (t) {
          var dx = x - t.cx,
            dy = y - t.cy;
          return dx * dx + dy * dy <= t.r * t.r;
        });
      if (hit) points.push({ x: x, y: y });
    }

    var frag = document.createDocumentFragment();
    points.forEach(function (p, i) {
      var depth = 1 - (p.y / h) * 0.5;
      var r = 1.3 + Math.random() * 1.6;
      var circle = document.createElementNS(NS, "circle");
      circle.setAttribute("cx", p.x.toFixed(1));
      circle.setAttribute("cy", p.y.toFixed(1));
      circle.setAttribute("r", r.toFixed(2));
      var useBright = Math.random() < 0.35;
      circle.setAttribute("fill", useBright ? "#4CA79F" : "#0C6E77");
      circle.setAttribute("opacity", (0.5 + depth * 0.35).toFixed(2));
      if (!reduceMotion) {
        circle.style.opacity = "0";
        circle.style.transformOrigin =
          p.x.toFixed(1) + "px " + p.y.toFixed(1) + "px";
        circle.style.transform = "scale(0.2)";
        circle.style.transition =
          "opacity .5s ease, transform .5s cubic-bezier(.2,.8,.2,1)";
        circle.style.transitionDelay = Math.random() * 900 + "ms";
      }
      frag.appendChild(circle);
    });
    svg.appendChild(frag);

    if (!reduceMotion) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          svg.querySelectorAll("circle").forEach(function (c) {
            var finalOpacity = c.getAttribute("opacity");
            c.style.opacity = finalOpacity;
            c.style.transform = "scale(1)";
          });
        });
      });
    }
  }
})();
