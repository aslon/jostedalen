(function () {
    var container = document.getElementById('tarifsContainer');
    if (!container) return;

    var source = container.getAttribute('data-source');
    var lang = document.documentElement.lang || 'fr';
    var labelFrom = container.getAttribute('data-label-from');
    var labelDay = container.getAttribute('data-label-day');
    var labelReserved = container.getAttribute('data-label-reserved');
    var labelNote = container.getAttribute('data-label-note');
    var labelBookMsg = container.getAttribute('data-label-book-msg');
    var labelFootnote = container.getAttribute('data-label-footnote');

    function formatDate(dateStr) {
        var parts = dateStr.split('-');
        return parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    function formatPrice(price) {
        var formatted = price.toFixed(2).replace('.', ',');
        var parts = formatted.split(',');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return '\u20ac' + parts.join(',');
    }

    function buildBookMsg(start, end) {
        return labelBookMsg.replace('{start}', formatDate(start)).replace('{end}', formatDate(end));
    }

    function render(data) {
        var html = '';
        data.seasons.forEach(function (season, idx) {
            var seasonName = season.name[lang] || season.name.fr;
            html += '<div class="tarifs-table-wrapper" data-season-index="' + idx + '">';
            html += '<table class="tarifs-table">';
            html += '<thead><tr>';
            html += '<th colspan="5">' + seasonName + '</th>';
            html += '<th>' + labelNote + ' *</th>';
            html += '<th></th>';
            html += '</tr></thead>';
            html += '<tbody>';
            season.weeks.forEach(function (week) {
                var start = week[0];
                var end = week[1];
                var price = week[2];
                var promo = week.length > 3 ? week[3] : null;
                var cls = price === null ? 'tarif-reserved' : 'tarif-available';
                var priceText;
                if (price === null) {
                    priceText = labelReserved;
                } else if (promo !== null) {
                    var pct = Math.ceil((price - promo) / price * 100);
                    priceText = '<span class="tarif-original">' + formatPrice(price) + '</span>'
                        + '<span class="tarif-promo">' + formatPrice(promo) + '</span>'
                        + '<span class="tarif-badge">-' + pct + '%</span>';
                } else {
                    priceText = formatPrice(price);
                }
                var bookCell = '';
                var bookPrice = promo !== null ? promo : price;
                if (price !== null) {
                    var msg = encodeURIComponent(buildBookMsg(start, end));
                    var ph = window._phone || '';
                    bookCell = '<td class="tarif-book">'
                        + '<a href="https://wa.me/' + ph + '?text=' + msg + '" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>'
                        + '<a href="sms:+' + ph + '&body=' + msg + '" aria-label="SMS"><i class="bi bi-chat-dots"></i></a>'
                        + '</td>';
                } else {
                    bookCell = '<td></td>';
                }
                html += '<tr class="' + cls + '">';
                html += '<td>' + labelFrom + '</td>';
                html += '<td>' + labelDay + '</td>';
                html += '<td>' + formatDate(start) + '</td>';
                html += '<td>' + labelDay + '</td>';
                html += '<td>' + formatDate(end) + '</td>';
                html += '<td class="tarif-price">' + priceText + '</td>';
                html += bookCell;
                html += '</tr>';
            });
            html += '</tbody></table>';
            if (labelFootnote) {
                html += '<p class="tarifs-footnote">' + labelFootnote + '</p>';
            }
            html += '</div>';
        });
        container.innerHTML = html;

        // Season filters (if 2+ seasons)
        var labelAll = container.getAttribute('data-label-all');
        if (data.seasons.length >= 2 && labelAll) {
            var filterHtml = '<div class="tarifs-filters">';
            filterHtml += '<button class="btn-tarifs-filter active" data-season="all">' + labelAll + '</button>';
            data.seasons.forEach(function (season, idx) {
                var seasonName = season.name[lang] || season.name.fr;
                filterHtml += '<button class="btn-tarifs-filter" data-season="' + idx + '">' + seasonName + '</button>';
            });
            filterHtml += '</div>';
            container.insertAdjacentHTML('afterbegin', filterHtml);

            container.querySelectorAll('.btn-tarifs-filter').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    container.querySelectorAll('.btn-tarifs-filter').forEach(function (b) { b.classList.remove('active'); });
                    btn.classList.add('active');
                    var season = btn.getAttribute('data-season');
                    container.querySelectorAll('.tarifs-table-wrapper').forEach(function (wrapper) {
                        wrapper.style.display = (season === 'all' || wrapper.getAttribute('data-season-index') === season) ? '' : 'none';
                    });
                });
            });
        }
    }

    fetch(source + '?v=' + Date.now())
        .then(function (response) { return response.json(); })
        .then(render)
        .catch(function (err) { console.error('Tarifs loading error:', err); });
})();
