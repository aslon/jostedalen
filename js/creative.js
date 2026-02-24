/*!
 * Chalet Jostedalen - Custom JavaScript
 * Vanilla JS (no jQuery dependency)
 */

(function () {
    "use strict";

    // Phone number obfuscation (anti-bot scraping)
    var _p = ['33', '651', '311', '169'];
    window._phone = _p.join('');
    function getWaMsg() {
        var el = document.querySelector('[data-phone-link="wa"]');
        return el ? (el.getAttribute('data-wa-msg') || '') : '';
    }
    function getSmsMsg() {
        var el = document.querySelector('[data-phone-link="sms"]');
        return el ? (el.getAttribute('data-sms-msg') || '') : '';
    }

    // Populate all phone links on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function () {
        var ph = window._phone;
        var display = '+' + ph.substring(0,2) + ' ' + ph[2] + ' ' + ph.substring(3,5) + ' ' + ph.substring(5,7) + ' ' + ph.substring(7,9) + ' ' + ph.substring(9,11);
        document.querySelectorAll('[data-phone-link]').forEach(function (el) {
            var type = el.getAttribute('data-phone-link');
            var waMsg = el.getAttribute('data-wa-msg') || '';
            var smsMsg = el.getAttribute('data-sms-msg') || '';
            if (type === 'tel') {
                el.href = 'tel:+' + ph;
            } else if (type === 'wa') {
                el.href = 'https://wa.me/' + ph + (waMsg ? '?text=' + waMsg : '');
            } else if (type === 'sms') {
                el.href = 'sms:+' + ph + (smsMsg ? '&body=' + smsMsg : '');
            }
        });
        document.querySelectorAll('.phone-display').forEach(function (el) {
            el.textContent = display;
        });
    });

    // Smooth scrolling for nav links (replaces jQuery Easing plugin)
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
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
        navCollapse.querySelectorAll(".nav-link:not(.dropdown-toggle)").forEach(function (link) {
            link.addEventListener("click", function () {
                var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                if (bsCollapse) bsCollapse.hide();
            });
        });
        // Close mobile menu when a language is selected
        navCollapse.querySelectorAll("#langSwitcher .dropdown-item").forEach(function (item) {
            item.addEventListener("click", function () {
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

    // Back to top button visibility
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
    }

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

    // Share: copy link to clipboard
    document.querySelectorAll('.share-copy-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var url = this.getAttribute('data-url');
            navigator.clipboard.writeText(url).then(function () {
                var icon = link.querySelector('i');
                icon.className = 'bi bi-check-lg';
                setTimeout(function () { icon.className = 'bi bi-link-45deg'; }, 2000);
            });
        });
    });
})();
