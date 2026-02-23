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
        data.seasons.forEach(function (season) {
            var seasonName = season.name[lang] || season.name.fr;
            html += '<div class="tarifs-table-wrapper">';
            html += '<table class="tarifs-table">';
            html += '<thead><tr>';
            html += '<th colspan="5">' + seasonName + '</th>';
            html += '<th>' + labelNote + '</th>';
            html += '<th></th>';
            html += '</tr></thead>';
            html += '<tbody>';
            season.weeks.forEach(function (week) {
                var start = week[0];
                var end = week[1];
                var price = week[2];
                var cls = price === null ? 'tarif-reserved' : 'tarif-available';
                var priceText = price === null ? labelReserved : formatPrice(price);
                var bookCell = '';
                if (price !== null) {
                    var msg = encodeURIComponent(buildBookMsg(start, end));
                    bookCell = '<td class="tarif-book">'
                        + '<a href="https://wa.me/33651311169?text=' + msg + '" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>'
                        + '<a href="sms:+33651311169&body=' + msg + '" aria-label="SMS"><i class="bi bi-chat-dots"></i></a>'
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
            html += '</tbody></table></div>';
        });
        container.innerHTML = html;
    }

    fetch(source)
        .then(function (response) { return response.json(); })
        .then(render)
        .catch(function (err) { console.error('Tarifs loading error:', err); });
})();
