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
    var labelTo = container.getAttribute('data-label-to');
    var labelEmailSubject = container.getAttribute('data-label-email-subject');
    var labelEmailBody = container.getAttribute('data-label-email-body');

    function formatDate(dateStr) {
        var parts = dateStr.split('-');
        return parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    function formatDateShort(dateStr) {
        var parts = dateStr.split('-');
        return parts[2] + '-' + parts[1] + '-' + parts[0].slice(2);
    }

    function formatPrice(price) {
        var formatted = price.toFixed(0);
        formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return formatted + '\u00a0\u20ac';
    }

    function buildBookMsg(start, end) {
        return labelBookMsg.replace('{start}', formatDate(start)).replace('{end}', formatDate(end));
    }

    function render(data) {
        var html = '';
        data.seasons.forEach(function (season, idx) {
            if (idx > 0) html += '<div class="tarifs-season-divider" data-season-index="' + idx + '"></div>';
            var seasonName = season.name[lang] || season.name.fr;
            html += '<div class="tarifs-table-wrapper" data-season-index="' + idx + '">';
            html += '<table class="tarifs-table">';
            html += '<thead>';
            html += '<tr class="tarif-thead-desktop"><th colspan="5">' + seasonName + '</th><th>' + labelNote + ' *</th><th></th></tr>';
            html += '<tr class="tarif-thead-mobile"><th>' + seasonName + '</th><th>' + labelNote + ' *</th><th></th></tr>';
            html += '</thead>';
            html += '<tbody>';
            season.weeks.forEach(function (week) {
                var start = week[0];
                var end = week[1];
                var price = week[2];
                var promo = week.length > 3 ? week[3] : null;
                var comment = week.length > 4 ? week[4] : null;
                var cls = price === null ? 'tarif-reserved' : (comment ? 'tarif-option' : 'tarif-available');
                var priceText;
                if (price === null) {
                    priceText = '<span class="tarif-reserved-text">' + labelReserved + ' <i class="bi bi-lock-fill"></i></span><span class="tarif-reserved-icon" aria-label="' + labelReserved + '"><i class="bi bi-lock-fill"></i></span>';
                } else if (comment) {
                    var commentLabel = container.getAttribute('data-label-comment-' + comment) || comment;
                    priceText = formatPrice(price)
                        + '<span class="tarif-comment">' + commentLabel + '</span>';
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
                        + '<a href="#" class="obfuscated-email" data-eu="Y2hhbGV0Lmpvc3RlZGFsZW4=" data-ed="Z21haWwuY29t" data-es="' + encodeURIComponent(labelEmailSubject.replace('{start}', formatDate(start)).replace('{end}', formatDate(end))) + '" data-eb="' + encodeURIComponent(labelEmailBody.replace('{start}', formatDate(start)).replace('{end}', formatDate(end))) + '" aria-label="Email"><i class="bi bi-envelope"></i></a>'
                        + '</td>';
                } else {
                    bookCell = '<td></td>';
                }
                html += '<tr class="' + cls + '">';
                html += '<td class="tarif-col-label">' + labelFrom + '</td>';
                html += '<td class="tarif-col-label">' + labelDay + '</td>';
                html += '<td><span class="tarif-date-full">' + formatDate(start) + '</span><span class="tarif-date-short">' + formatDateShort(start) + ' / ' + formatDateShort(end) + '</span></td>';
                html += '<td class="tarif-col-label"><span class="tarif-day-desktop">' + labelTo + ' ' + labelDay + '</span></td>';
                html += '<td class="tarif-col-label">' + formatDate(end) + '</td>';
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
                    container.querySelectorAll('.tarifs-season-divider').forEach(function (div) {
                        div.style.display = (season === 'all') ? '' : 'none';
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
