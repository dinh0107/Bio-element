(function () {
    function initGallery() {
        var gallery = document.querySelector('[data-product-gallery]');
        if (!gallery) return;

        var mainImage = gallery.querySelector('[data-product-main-image]');
        var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('[data-product-thumb]'));

        thumbs.forEach(function (thumb) {
            thumb.addEventListener('click', function () {
                var src = thumb.getAttribute('data-src');
                var alt = thumb.getAttribute('data-alt') || '';
                if (!src || !mainImage) return;

                thumbs.forEach(function (item) {
                    item.classList.remove('is-active');
                });
                thumb.classList.add('is-active');
                mainImage.src = src;
                mainImage.alt = alt;
            });
        });
    }

    function initQuantity() {
        var wrap = document.querySelector('[data-product-qty]');
        if (!wrap) return;

        var input = wrap.querySelector('[data-product-qty-input]');
        var minusBtn = wrap.querySelector('[data-product-qty-minus]');
        var plusBtn = wrap.querySelector('[data-product-qty-plus]');
        var min = Number(input.getAttribute('min') || 1);
        var max = Number(input.getAttribute('max') || 99);

        function setValue(next) {
            var value = Math.min(max, Math.max(min, next));
            input.value = String(value);
        }

        minusBtn.addEventListener('click', function () {
            setValue(Number(input.value || min) - 1);
        });

        plusBtn.addEventListener('click', function () {
            setValue(Number(input.value || min) + 1);
        });

        input.addEventListener('change', function () {
            setValue(Number(input.value || min));
        });
    }

    function initSizes() {
        var sizes = document.querySelector('[data-product-sizes]');
        if (!sizes) return;

        sizes.addEventListener('click', function (event) {
            var button = event.target.closest('[data-product-size]');
            if (!button) return;

            Array.prototype.forEach.call(sizes.querySelectorAll('[data-product-size]'), function (item) {
                item.classList.remove('is-active');
            });
            button.classList.add('is-active');
        });
    }

    function initTabs() {
        var tabs = document.querySelector('[data-product-tabs]');
        if (!tabs) return;

        var links = Array.prototype.slice.call(tabs.querySelectorAll('[data-product-tab]'));
        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-product-panel]'));

        links.forEach(function (link) {
            link.addEventListener('click', function () {
                var target = link.getAttribute('data-product-tab');
                if (!target) return;

                links.forEach(function (item) {
                    item.classList.toggle('is-active', item === link);
                });

                panels.forEach(function (panel) {
                    panel.hidden = panel.getAttribute('data-product-panel') !== target;
                });
            });
        });
    }

    initGallery();
    initQuantity();
    initSizes();
    initTabs();

    function initRelatedSlider($) {
        var $section = $('.product-related');
        var $track = $section.find('.owl-product-related');
        var $dots = $section.find('.product-related__dots');

        if (!$track.length || !$.fn.owlCarousel) return;

        if ($track.hasClass('owl-loaded')) {
            $track.trigger('destroy.owl.carousel');
            $track.removeClass('owl-loaded owl-dragging');
        }

        $track.owlCarousel({
            items: 4,
            margin: 30,
            loop: true,
            rewind: true,
            dots: !!$dots.length,
            dotsContainer: $dots.length ? $dots : false,
            nav: false,
            mouseDrag: true,
            touchDrag: true,
            smartSpeed: 600,
            responsive: {
                0: { items: 1, margin: 16 },
                576: { items: 2, margin: 16 },
                992: { items: 3, margin: 24 },
                1200: { items: 4, margin: 30 }
            }
        });

        var resizeTimer;
        $(window).off('resize.owlProductRelated').on('resize.owlProductRelated', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                $track.trigger('refresh.owl.carousel');
            }, 200);
        });
    }

    if (window.jQuery) {
        window.jQuery(initRelatedSlider.bind(null, window.jQuery));
    }
})();
