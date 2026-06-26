(function () {
    function initChips() {
        var wrap = document.querySelector('[data-guide-chips]');
        if (!wrap) return;

        wrap.addEventListener('click', function (event) {
            var chip = event.target.closest('[data-guide-chip]');
            if (!chip) return;

            Array.prototype.forEach.call(wrap.querySelectorAll('[data-guide-chip]'), function (item) {
                item.classList.remove('is-active');
            });
            chip.classList.add('is-active');
        });
    }

    function initPromoSlider($) {
        var $section = $('.guide-promo');
        var $track = $section.find('.owl-guide-promo');
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
            dots: false,
            nav: false,
            mouseDrag: true,
            touchDrag: true,
            smartSpeed: 600,
            responsive: {
                0: { items: 1, margin: 12 },
                576: { items: 2, margin: 12 },
                992: { items: 3, margin: 16 },
                1200: { items: 4, margin: 16 }
            }
        });

        $section.find('[data-guide-promo-prev]').on('click', function (e) {
            e.preventDefault();
            $track.trigger('prev.owl.carousel');
        });

        $section.find('[data-guide-promo-next]').on('click', function (e) {
            e.preventDefault();
            $track.trigger('next.owl.carousel');
        });
    }

    function initToc($) {
        var $toc = $('#toctoc');
        if (!$toc.length || !$.toctoc) return;

        var target = '[data-post-toc-source]';
        if (!document.querySelector(target)) {
            target = '[data-guide-toc-source]';
        }
        if (!document.querySelector(target)) return;

        $.toctoc({
            target: target,
            headText: 'Mục lục',
            headLinkText: ['', ''],
            opened: true,
            smooth: true,
            headBackgroundColor: 'transparent',
            headTextColor: '#020d12',
            headLinkColor: 'transparent',
            bodyBackgroundColor: 'transparent',
            bodyLinkColor: '#6f767c',
            borderStyle: 'none',
            borderColor: 'transparent',
            borderWidth: '0'
        });

        initTocScrollSpy();
    }

    function initPostRelatedSlider($) {
        var $section = $('.post-related');
        var $track = $section.find('.owl-post-related');
        var $dots = $section.find('.post-related__dots');

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
    }

    function initCommentLikes() {
        document.addEventListener('click', function (event) {
            var btn = event.target.closest('[data-comment-like]');
            if (!btn) return;

            btn.classList.toggle('is-active');
            var icon = btn.querySelector('i');
            if (!icon) return;

            if (btn.classList.contains('is-active')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        });
    }

    function initTocScrollSpy() {
        var links = Array.prototype.slice.call(
            document.querySelectorAll('#toctoc-body a')
        );
        if (!links.length) return;

        var targets = links
            .map(function (link) {
                var id = (link.getAttribute('href') || '').slice(1);
                var section = id ? document.getElementById(id) : null;
                return section ? { link: link, section: section } : null;
            })
            .filter(Boolean);
        if (!targets.length) return;

        function setActive(activeLink) {
            links.forEach(function (link) {
                link.classList.toggle('is-active', link === activeLink);
            });
        }

        function onScroll() {
            var offset = 140;
            var current = targets[0];
            for (var i = 0; i < targets.length; i++) {
                if (targets[i].section.getBoundingClientRect().top - offset <= 0) {
                    current = targets[i];
                } else {
                    break;
                }
            }
            setActive(current.link);
        }

        links.forEach(function (link) {
            link.addEventListener('click', function () {
                setActive(link);
            });
        });

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    initChips();
    initCommentLikes();

    if (window.jQuery) {
        window.jQuery(function () {
            initPromoSlider(window.jQuery);
            initToc(window.jQuery);
            initPostRelatedSlider(window.jQuery);
        });
    }
})();
