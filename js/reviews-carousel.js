(function () {
    var wrapper = document.querySelector('.reviews-carousel-wrapper');
    if (!wrapper) return;

    var track = wrapper.querySelector('.reviews-carousel');
    var cards = track.querySelectorAll('.review-carousel-card');
    if (cards.length === 0) return;

    var dotsContainer = wrapper.querySelector('.carousel-dots');
    var dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
    var currentIndex = 0;
    var intervalId = null;
    var cardWidth = cards[0].offsetWidth + 20; // card width + gap

    function goTo(index) {
        currentIndex = index;
        track.style.transform = 'translateX(-' + (currentIndex * cardWidth) + 'px)';
        for (var i = 0; i < dots.length; i++) {
            dots[i].classList.toggle('active', i === currentIndex);
        }
    }

    function next() {
        goTo((currentIndex + 1) % cards.length);
    }

    function startAutoplay() {
        intervalId = setInterval(next, 5000);
    }

    function stopAutoplay() {
        clearInterval(intervalId);
    }

    // Dot click handlers
    for (var i = 0; i < dots.length; i++) {
        (function (idx) {
            dots[idx].addEventListener('click', function () {
                stopAutoplay();
                goTo(idx);
                startAutoplay();
            });
        })(i);
    }

    // Pause on hover/touch
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
    wrapper.addEventListener('touchstart', stopAutoplay, { passive: true });
    wrapper.addEventListener('touchend', function () {
        setTimeout(startAutoplay, 3000);
    }, { passive: true });

    // Recalculate card width on resize
    window.addEventListener('resize', function () {
        cardWidth = cards[0].offsetWidth + 20;
        goTo(currentIndex);
    });

    // Init
    goTo(0);
    startAutoplay();
})();
