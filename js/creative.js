/*!
 * Chalet Jostedalen - Custom JavaScript
 * Vanilla JS (no jQuery dependency)
 */

(function () {
    "use strict";

    // Smooth scrolling for nav links (replaces jQuery Easing plugin)
    document.querySelectorAll('a.nav-link[href^="#"], a.navbar-brand[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (e) {
            var targetId = this.getAttribute("href");
            if (targetId === "#") return;
            var target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            var offset = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top: offset, behavior: "smooth" });
        });
    });

    // Close mobile menu on link click
    var navCollapse = document.getElementById("navbarNav");
    if (navCollapse) {
        navCollapse.querySelectorAll(".nav-link").forEach(function (link) {
            link.addEventListener("click", function () {
                var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) bsCollapse.hide();
            });
        });
    }

    // Navbar style change on scroll (replaces Bootstrap 3 affix)
    var navbar = document.getElementById("mainNav");
    function updateNavbar() {
        if (window.scrollY > 100) {
            navbar.classList.add("navbar-scrolled");
            navbar.classList.remove("navbar-dark");
            navbar.classList.add("navbar-light");
        } else {
            navbar.classList.remove("navbar-scrolled");
            navbar.classList.add("navbar-dark");
            navbar.classList.remove("navbar-light");
        }
    }
    window.addEventListener("scroll", updateNavbar, { passive: true });
    updateNavbar();

    // Scroll animations (replaces WOW.js + animate.css)
    var animatedElements = document.querySelectorAll(".animate-on-scroll");
    if (animatedElements.length > 0 && "IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animated");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    }
})();
