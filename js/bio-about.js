(function () {
    function initPartnersLogosMarquee($) {
        var $track = $('.about-partners__logos-track');
        var $group = $track.children('.about-partners__logos-group').first();

        if (!$group.length || $track.children('.about-partners__logos-group').length > 1) return;

        $group.clone(false).attr('aria-hidden', 'true').appendTo($track);
    }

    function initPartnersSlider($) {
        var $slider = $('.about-partners__slider');
        var $track = $slider.find('.owl-about-cases');
        var $dots = $slider.find('.about-partners__dots');

        if (!$track.length || !$.fn.owlCarousel) return;

        if ($track.hasClass('owl-loaded')) {
            $track.trigger('destroy.owl.carousel');
            $track.removeClass('owl-loaded owl-dragging');
        }

        $track.owlCarousel({
            items: 3,
            margin: 30,
            slideBy: 1,
            loop: false,
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
                992: { items: 3, margin: 30 }
            }
        });
    }

    window.jQuery(function ($) {
        initPartnersLogosMarquee($);
        initPartnersSlider($);
    });
})();
