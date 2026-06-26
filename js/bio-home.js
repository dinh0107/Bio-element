(function () {
    function initMobileNav() {
        var header = document.querySelector('.site-header');
        var panel = document.querySelector('[data-nav-panel]');
        var toggler = document.querySelector('[data-nav-toggle]');
        var overlay = document.querySelector('[data-nav-overlay]');
        if (!header || !panel || !toggler) return;

        var mobileQuery = window.matchMedia('(max-width: 991px)');

        function closeMenu() {
            header.classList.remove('is-menu-open');
            document.body.classList.remove('is-nav-open');
            panel.classList.remove('is-open');
            if (overlay) overlay.hidden = true;
        }

        toggler.addEventListener('click', function (e) {
            if (!mobileQuery.matches) return;
            e.preventDefault();

            var open = !panel.classList.contains('is-open');
            header.classList.toggle('is-menu-open', open);
            document.body.classList.toggle('is-nav-open', open);
            panel.classList.toggle('is-open', open);
            if (overlay) overlay.hidden = !open;
        });

        if (overlay) {
            overlay.addEventListener('click', closeMenu);
        }

        document.addEventListener('keyup', function (e) {
            if (e.key === 'Escape') closeMenu();
        });

        mobileQuery.addEventListener('change', function () {
            if (!mobileQuery.matches) closeMenu();
        });
    }

    function initStickyHeader() {
        var header = document.querySelector('.site-header');
        if (!header) return;

        function onScroll() {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        }

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    function initTherapyTabs() {
        var section = document.querySelector('.home-therapies');
        if (!section) return;

        var tabs = section.querySelectorAll('.home-therapies__tab');
        var img = section.querySelector('.home-therapies__featured-img');
        var title = section.querySelector('.home-therapies__featured-title');
        var text = section.querySelector('.home-therapies__featured-text');
        if (!tabs.length || !img || !title || !text) return;

        function setFeaturedImage(nextSrc) {
            if (!nextSrc || img.getAttribute('src') === nextSrc) return;

            img.classList.add('is-swapping');

            window.setTimeout(function () {
                img.src = nextSrc;
                img.classList.remove('is-swapping');
            }, 180);
        }

        function activateTab(tab) {
            if (tab.classList.contains('is-active')) return;

            tabs.forEach(function (item) {
                item.classList.remove('is-active');
            });
            tab.classList.add('is-active');

            if (tab.dataset.image) setFeaturedImage(tab.dataset.image);
            if (tab.dataset.title) {
                title.textContent = tab.dataset.title;
                img.alt = tab.dataset.title;
            }
            if (tab.dataset.text) text.textContent = tab.dataset.text;
        }

        tabs.forEach(function (tab) {
            tab.addEventListener('mouseenter', function () {
                activateTab(tab);
            });

            tab.addEventListener('click', function (e) {
                e.preventDefault();
                activateTab(tab);
            });
        });
    }

    function initBestsellersSlider($) {
        var $section = $('.home-bestsellers');
        var $track = $section.find('.owl-bestsellers');
        var $dots = $section.find('.home-bestsellers__dots');

        if (!$track.length || !$.fn.owlCarousel) return;

        if ($track.hasClass('owl-loaded')) {
            $track.trigger('destroy.owl.carousel');
            $track.removeClass('owl-loaded owl-dragging');
        }

        $track.owlCarousel({
            items: 4,
            margin: 16,
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
                992: { items: 3, margin: 16 },
                1200: { items: 4, margin: 16 }
            }
        });

        var resizeTimer;
        $(window).off('resize.owlBestsellers').on('resize.owlBestsellers', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                $track.trigger('refresh.owl.carousel');
            }, 200);
        });
    }

    function initEssenceSlider($) {
        var $section = $('.home-essence');
        var $track = $section.find('.owl-essence');
        if (!$track.length || !$.fn.owlCarousel) return;

        if ($track.hasClass('owl-loaded')) {
            $track.trigger('destroy.owl.carousel');
            $track.removeClass('owl-loaded owl-dragging');
        }

        var $slides = $track.children('.home-essence__card');
        $track.find('.home-essence__card').not($slides).remove();

        if ($slides.length === 3) {
            $slides.clone().appendTo($track);
        }

        $track.owlCarousel({
            items: 3,
            margin: 30,
            loop: true,
            rewind: true,
            dots: false,
            nav: false,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: true,
            smartSpeed: 600,
            responsive: {
                0: { items: 1, margin: 16 },
                768: { items: 2, margin: 24 },
                1200: { items: 3, margin: 30 }
            }
        });

        $section.find('.home-essence__nav-btn--prev').off('click.owlEssence').on('click.owlEssence', function (e) {
            e.preventDefault();
            $track.trigger('prev.owl.carousel');
        });

        $section.find('.home-essence__nav-btn--next').off('click.owlEssence').on('click.owlEssence', function (e) {
            e.preventDefault();
            $track.trigger('next.owl.carousel');
        });

        var resizeTimer;
        $(window).off('resize.owlEssence').on('resize.owlEssence', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                $track.trigger('refresh.owl.carousel');
            }, 200);
        });
    }

    function initComboSlider($) {
        var $section = $('.home-combo');
        var $track = $section.find('.owl-combo');
        if (!$track.length || !$.fn.owlCarousel) return;

        if ($track.hasClass('owl-loaded')) {
            $track.trigger('destroy.owl.carousel');
            $track.removeClass('owl-loaded owl-dragging');
        }

        var $visualImg = $section.find('.home-combo__visual-img');
        var $visualLabel = $section.find('.home-combo__visual-label');
        var $productName = $section.find('.home-combo__product-name');
        var $productPrice = $section.find('.home-combo__product-price');
        var $slides = $track.children('.home-combo__slide');

        function getRealIndex(e) {
            if (e && e.relatedTarget) {
                return e.relatedTarget.relative(e.relatedTarget.current());
            }

            var carousel = $track.data('owl.carousel');
            if (!carousel) return 0;
            return carousel.relative(carousel.current());
        }

        function setVisualImage(nextSrc, altText) {
            if (!nextSrc || $visualImg.attr('src') === nextSrc) return;

            $visualImg.addClass('is-swapping');

            window.setTimeout(function () {
                $visualImg.attr('src', nextSrc);
                if (altText) $visualImg.attr('alt', altText);
                $visualImg.removeClass('is-swapping');
            }, 180);
        }

        function updatePanel(index) {
            var $slide = $slides.eq(index);
            if (!$slide.length) return;

            if ($slide.data('visual')) {
                setVisualImage($slide.data('visual'), $slide.data('label') || '');
            }
            if ($slide.data('label')) $visualLabel.text($slide.data('label'));
            if ($slide.data('name')) $productName.text($slide.data('name'));
            if ($slide.data('price')) $productPrice.find('strong').text($slide.data('price'));
            if ($slide.data('price-old')) $productPrice.find('span').text($slide.data('price-old'));
        }

        $track.owlCarousel({
            items: 1,
            loop: true,
            rewind: true,
            dots: false,
            nav: false,
            margin: 0,
            smartSpeed: 600,
            mouseDrag: true,
            touchDrag: true
        });

        $track.on('initialized.owl.carousel changed.owl.carousel', function (e) {
            updatePanel(getRealIndex(e));
        });

        $section.find('.home-combo__nav-btn--prev').off('click.owlCombo').on('click.owlCombo', function (e) {
            e.preventDefault();
            $track.trigger('prev.owl.carousel');
        });

        $section.find('.home-combo__nav-btn--next').off('click.owlCombo').on('click.owlCombo', function (e) {
            e.preventDefault();
            $track.trigger('next.owl.carousel');
        });
    }

    function initBlogSlider($) {
        var $section = $('.home-blog');
        var $track = $section.find('.owl-blog');
        var $dots = $section.find('.home-blog__dots');

        if (!$track.length || !$.fn.owlCarousel) return;

        if ($track.hasClass('owl-loaded')) {
            $track.trigger('destroy.owl.carousel');
            $track.removeClass('owl-loaded owl-dragging');
        }

        $track.owlCarousel({
            items: 3,
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
                768: { items: 2, margin: 24 },
                1200: { items: 3, margin: 30 }
            }
        });

        var resizeTimer;
        $(window).off('resize.owlBlog').on('resize.owlBlog', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                $track.trigger('refresh.owl.carousel');
            }, 200);
        });
    }

    function initResultsSlider($) {
        var $section = $('.home-results');
        var $track = $section.find('.owl-results');
        var $dots = $section.find('.home-results__dots');

        if (!$track.length || !$.fn.owlCarousel) return;

        if ($track.hasClass('owl-loaded')) {
            $track.trigger('destroy.owl.carousel');
            $track.removeClass('owl-loaded owl-dragging');
        }

        var slideCount = $track.children('.ba-card').length;

        $track.owlCarousel({
            items: 3,
            margin: 30,
            loop: slideCount > 1,
            rewind: true,
            dots: !!$dots.length,
            dotsContainer: $dots.length ? $dots : false,
            nav: false,
            mouseDrag: true,
            touchDrag: true,
            smartSpeed: 600,
            responsive: {
                0: { items: 1, margin: 16 },
                768: { items: 2, margin: 24 },
                1200: { items: 3, margin: 30 }
            }
        });

        var resizeTimer;
        $(window).off('resize.owlResults').on('resize.owlResults', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                $track.trigger('refresh.owl.carousel');
            }, 200);
        });
    }

    function initCounters() {
        var counters = Array.prototype.slice.call(
            document.querySelectorAll('[data-counter]')
        );
        if (!counters.length) return;

        function runCounter(el) {
            var target = parseFloat(el.getAttribute('data-counter')) || 0;
            var prefix = el.getAttribute('data-counter-prefix') || '';
            var suffix = el.getAttribute('data-counter-suffix') || '';
            var duration = parseInt(el.getAttribute('data-counter-duration'), 10) || 2000;
            var decimals = (String(target).split('.')[1] || '').length;
            var start = null;

            function format(value) {
                return prefix + value.toFixed(decimals) + suffix;
            }

            function step(timestamp) {
                if (start === null) start = timestamp;
                var progress = Math.min((timestamp - start) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = format(target * eased);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.textContent = format(target);
                }
            }

            el.textContent = format(0);
            window.requestAnimationFrame(step);
        }

        if (!('IntersectionObserver' in window)) {
            counters.forEach(runCounter);
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                runCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.4 });

        counters.forEach(function (el) {
            observer.observe(el);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileNav();
        initStickyHeader();
        initTherapyTabs();
        initCounters();
    });

    window.jQuery(function ($) {
        initEssenceSlider($);
        initBestsellersSlider($);
        initComboSlider($);
        initBlogSlider($);
        initResultsSlider($);
    });
})();
