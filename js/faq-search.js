(function () {
    var input = document.getElementById('faqSearch');
    if (!input) return;

    var faqSection = document.getElementById('faq');
    var items = faqSection.querySelectorAll('.accordion-item');
    var categories = faqSection.querySelectorAll('.faq-category');

    input.addEventListener('input', function () {
        var q = this.value.toLowerCase().trim();

        items.forEach(function (item) {
            var text = item.textContent.toLowerCase();
            item.style.display = (!q || text.indexOf(q) !== -1) ? '' : 'none';
        });

        categories.forEach(function (cat) {
            var accordion = cat.nextElementSibling;
            if (!accordion) return;
            var visible = accordion.querySelectorAll('.accordion-item:not([style*="display: none"])');
            cat.style.display = visible.length ? '' : 'none';
            accordion.style.display = visible.length ? '' : 'none';
        });
    });
})();
