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
  var logVideo = document.getElementById("logVideo");
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
      var key = row.getAttribute("data-key");
      var video = row.getAttribute("data-video");
      // Keys stay on the feature so a later language switch re-translates it
      logText.setAttribute("data-i18n", "build.log." + key);
      logText.textContent = window.SSK_t("build.log." + key);
      logCode.textContent = row.getAttribute("data-code");
      if (video) {
        logImg.hidden = true;
        logVideo.hidden = false;
        logVideo.poster = row.getAttribute("data-src");
        logVideo.setAttribute("data-i18n-aria", "build.alt." + key);
        logVideo.setAttribute("aria-label", window.SSK_t("build.alt." + key));
        if (logVideo.getAttribute("src") !== video) logVideo.src = video;
        if (!reduceMotion) logVideo.play().catch(function () {});
      } else {
        logVideo.pause();
        logVideo.hidden = true;
        logImg.hidden = false;
        logImg.src = row.getAttribute("data-src");
        logImg.setAttribute("data-i18n-alt", "build.alt." + key);
        logImg.alt = window.SSK_t("build.alt." + key);
      }
    });
  });

  /* ---------- Lightbox (In the field gallery) ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbItems = Array.prototype.slice.call(
    document.querySelectorAll(".field-open"),
  );
  if (lightbox && lbItems.length) {
    var lbImg = document.getElementById("lbImg");
    var lbWebp = document.getElementById("lbWebp");
    var lbVideo = document.getElementById("lbVideo");
    var lbCode = document.getElementById("lbCode");
    var lbText = document.getElementById("lbText");
    var lbIndex = 0;
    var lbReturnFocus = null;

    function lbShow(i) {
      lbIndex = (i + lbItems.length) % lbItems.length;
      var btn = lbItems[lbIndex];
      var fig = btn.closest(".field-item");
      var src = btn.getAttribute("data-lb-src");
      var thumb = btn.querySelector("img");
      var label = thumb ? thumb.alt : btn.getAttribute("aria-label");
      lbCode.textContent = fig.querySelector("figcaption b").textContent;
      lbText.textContent = fig.querySelector("figcaption span").textContent;
      if (btn.getAttribute("data-lb-type") === "video") {
        lbImg.parentNode.hidden = true;
        lbVideo.hidden = false;
        lbVideo.poster = btn.getAttribute("data-lb-poster");
        lbVideo.setAttribute("aria-label", label);
        lbVideo.src = src;
        if (!reduceMotion) lbVideo.play().catch(function () {});
      } else {
        lbVideo.pause();
        lbVideo.removeAttribute("src");
        lbVideo.hidden = true;
        lbImg.parentNode.hidden = false;
        lbWebp.srcset = src + ".webp";
        lbImg.src = src + ".jpg";
        lbImg.alt = label;
      }
    }

    function lbOpen(i) {
      lbReturnFocus = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lbShow(i);
      lightbox.querySelector(".lb-close").focus();
    }

    function lbClose() {
      lbVideo.pause();
      lbVideo.removeAttribute("src");
      lightbox.hidden = true;
      document.body.style.overflow = "";
      if (lbReturnFocus) lbReturnFocus.focus();
    }

    lbItems.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        lbOpen(i);
      });
    });
    lightbox.querySelector(".lb-close").addEventListener("click", lbClose);
    lightbox.querySelector(".lb-prev").addEventListener("click", function () {
      lbShow(lbIndex - 1);
    });
    lightbox.querySelector(".lb-next").addEventListener("click", function () {
      lbShow(lbIndex + 1);
    });
    // Backdrop click: anything that isn't the media, caption, or a control
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.classList.contains("lb-figure"))
        lbClose();
    });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "Escape") lbClose();
      else if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
      else if (e.key === "ArrowRight") lbShow(lbIndex + 1);
      else if (e.key === "Tab") {
        // Keep focus inside the dialog
        var f = lightbox.querySelectorAll("button, video:not([hidden])");
        var first = f[0];
        var last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ---------- Field video previews: silent loop, only while on screen ---------- */
  var previews = document.querySelectorAll(".field-preview");
  if (previews.length && !reduceMotion && "IntersectionObserver" in window) {
    var previewObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          var btn = v.closest(".field-open");
          if (entry.isIntersecting) {
            v.play().then(
              function () {
                btn.classList.add("is-playing");
              },
              function () {},
            );
          } else {
            v.pause();
            btn.classList.remove("is-playing");
          }
        });
      },
      { threshold: 0.4 },
    );
    previews.forEach(function (v) {
      previewObserver.observe(v);
    });
  }

  /* ---------- Section buttons: highlight the section in view ---------- */
  var sectionNav = document.querySelector(".section-nav-inner");
  if (sectionNav && "IntersectionObserver" in window) {
    var navLinks = {};
    sectionNav.querySelectorAll("a").forEach(function (a) {
      navLinks[a.getAttribute("href").slice(1)] = a;
    });
    var visible = {};
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting;
        });
        // First section (in page order) crossing the band below the header wins
        var current = null;
        Object.keys(navLinks).some(function (id) {
          if (visible[id]) current = id;
          return visible[id];
        });
        Object.keys(navLinks).forEach(function (id) {
          var on = id === current;
          navLinks[id].classList.toggle("active", on);
          if (on) navLinks[id].setAttribute("aria-current", "true");
          else navLinks[id].removeAttribute("aria-current");
        });
        if (current) {
          // Keep the active button visible in the scrollable row (phones)
          var a = navLinks[current];
          var left = a.offsetLeft - (sectionNav.clientWidth - a.offsetWidth) / 2;
          sectionNav.scrollTo({
            left: left,
            behavior: reduceMotion ? "auto" : "smooth",
          });
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    Object.keys(navLinks).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }

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
