(function () {
    var images = [];
    var currentIndex = 0;
    var touchStartX = 0;

    var modalEl = document.getElementById('lightboxModal');
    if (!modalEl) return;

    var modal = new bootstrap.Modal(modalEl);
    var modalImg = modalEl.querySelector('.lightbox-img');
    var counter = modalEl.querySelector('.lightbox-counter');

    // Collect gallery images
    document.querySelectorAll('#photo .portfolio-box').forEach(function (box, i) {
        var source = box.querySelector('source');
        var img = box.querySelector('img');
        if (img) {
            images.push(source ? source.getAttribute('srcset') : img.getAttribute('src'));
            box.addEventListener('click', function () {
                currentIndex = i;
                updateImage();
                modal.show();
            });
        }
    });

    if (images.length === 0) return;

    // Controls
    modalEl.querySelector('.lightbox-close').addEventListener('click', function () { modal.hide(); });
    modalEl.querySelector('.lightbox-prev').addEventListener('click', function () { navigate(-1); });
    modalEl.querySelector('.lightbox-next').addEventListener('click', function () { navigate(1); });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!modalEl.classList.contains('show')) return;
        if (e.key === 'ArrowLeft') navigate(-1);
        else if (e.key === 'ArrowRight') navigate(1);
        else if (e.key === 'Escape') modal.hide();
    });

    // Touch swipe
    modalEl.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    modalEl.addEventListener('touchend', function (e) {
        var diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) navigate(diff > 0 ? -1 : 1);
    }, { passive: true });

    function navigate(dir) {
        currentIndex = (currentIndex + dir + images.length) % images.length;
        updateImage();
    }

    function updateImage() {
        modalImg.src = images[currentIndex];
        counter.textContent = (currentIndex + 1) + ' / ' + images.length;
    }
})();
