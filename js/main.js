(function ($) {
    $(function () {
        initChipGroups();
        initFilterSearch();
        initIdDocsTabs();
        initOwlCarousels();
        initSimilarPlatesCarousel();
        initFancyboxVideoCards();
        initMobileNav();
        initInventoryFilters();
        initCatalogFilterBar();
        initHomeHeader();
        initCartCheckboxes();
        initToctoc();
    });

    function initChipGroups() {
        document.querySelectorAll('[data-chip-group]').forEach(function (group) {
            group.addEventListener('click', function (e) {
                var chip = e.target.closest('.chip, .filter-dropdown__option');
                if (!chip) return;
                e.preventDefault();

                if (group.hasAttribute('data-chip-group-multi')) {
                    chip.classList.toggle('is-active');
                    return;
                }

                group.querySelectorAll('.chip, .filter-dropdown__option').forEach(function (item) {
                    item.classList.remove('is-active');
                });
                chip.classList.add('is-active');
            });
        });
    }

    function initFilterSearch() {
        document.querySelectorAll('[data-filter-search]').forEach(function (input) {
            input.addEventListener('input', function () {
                var query = input.value.toLowerCase().trim();
                var panel = input.closest('.filter-dropdown__panel');
                if (!panel) return;

                panel.querySelectorAll('.filter-dropdown__option').forEach(function (option) {
                    var item = option.closest('li');
                    if (!item) return;
                    var match = !query || option.textContent.toLowerCase().includes(query);
                    item.hidden = !match;
                });
            });
        });
    }

    function initIdDocsTabs() {
        document.querySelectorAll('[data-id-docs-tabs]').forEach(function (wrap) {
            var tabs = wrap.querySelectorAll('[data-id-docs-tab]');
            var panels = wrap.querySelectorAll('[data-id-docs-panel]');

            tabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    var target = tab.getAttribute('data-id-docs-tab');

                    tabs.forEach(function (item) {
                        item.classList.toggle('is-active', item === tab);
                    });

                    panels.forEach(function (panel) {
                        panel.classList.toggle('is-active', panel.getAttribute('data-id-docs-panel') === target);
                    });
                });
            });
        });
    }

    function initFancyboxVideoCards() {
        if (typeof Fancybox === 'undefined') return;

        $(document).on('click', '.video-card[data-fancybox]', function (e) {
            if ($('.owl-dragging').length) return;

            e.preventDefault();

            var $el = $(this);
            var video = $el.data('video');
            var src = video || $el.attr('href');
            if (!src || src === '#') return;

            var type = 'image';
            if (video) {
                type = /youtube|youtu\.be|vimeo/i.test(String(video)) ? 'iframe' : 'html5video';
            }

            Fancybox.show([{
                src: src,
                type: type,
                caption: $el.data('caption') || $.trim($el.find('.video-card__title').text())
            }]);
        });
    }

    function bindOwlDots($owl) {
        function scrollActiveDotIntoView() {
            var $dots = $owl.find('.owl-dots');
            var $active = $dots.find('.owl-dot.active');
            if (!$dots.length || !$active.length) return;

            var dotsEl = $dots.get(0);
            var activeEl = $active.get(0);
            var targetLeft = activeEl.offsetLeft - (dotsEl.clientWidth / 2) + (activeEl.offsetWidth / 2);

            dotsEl.scrollTo({
                left: Math.max(0, targetLeft),
                behavior: 'smooth'
            });
        }

        function syncDots(e) {
            var index = 0;

            if (e && e.page && typeof e.page.index === 'number') {
                index = e.page.index;
            } else {
                var carousel = $owl.data('owl.carousel');
                if (!carousel) return;
                index = carousel.relative(carousel.current());
            }

            $owl.find('.owl-dots .owl-dot').removeClass('active').eq(index).addClass('active');
            scrollActiveDotIntoView();
        }

        $owl.off('.owlDotsSync').on(
            'initialized.owl.carousel.owlDotsSync changed.owl.carousel.owlDotsSync refreshed.owl.carousel.owlDotsSync translated.owl.carousel.owlDotsSync',
            syncDots
        );
    }

    function initOwl($owl, config) {
        $owl.owlCarousel(config);
        bindOwlDots($owl);
    }

    function initOwlCarousels() {
        var isHome = $('.site-header--home').length > 0;
        var owlDefaults = {
            nav: false,
            dots: true,
            loop: true,
            autoplay: true,
            autoplayTimeout: isHome ? 6500 : 4500,
            autoplayHoverPause: true,
            smartSpeed: isHome ? 1000 : 700,
            slideBy: 1
        };

        if ($('.owl-reviews').length) {
            initOwl($('.owl-reviews'), $.extend({}, owlDefaults, {
                margin: 24,
                responsive: {
                    0: { items: 1 },
                    768: { items: 2 },
                    992: { items: 3 }
                }
            }));
        }

        if ($('.owl-press').length) {
            $('.owl-press').each(function () {
                var isExpert = $(this).closest('.expert-page').length;
                initOwl($(this), $.extend({}, owlDefaults, {
                    loop: !isExpert,
                    margin: isExpert ? 16 : 12,
                    responsive: isExpert ? {
                        0: { items: 1 },
                        576: { items: 2 },
                        992: { items: 3 }
                    } : {
                        0: { items: 1 },
                        576: { items: 2 },
                        992: { items: 4 }
                    }
                }));
            });
        }

        if ($('.owl-news').length) {
            $('.owl-news').each(function () {
                var isExpert = $(this).closest('.expert-page').length;
                initOwl($(this), $.extend({}, owlDefaults, {
                    loop: !isExpert,
                    margin: isExpert ? 30 : 24,
                    responsive: isExpert ? {
                        0: { items: 1 },
                        768: { items: 2 },
                        992: { items: 2 }
                    } : {
                        0: { items: 1 },
                        768: { items: 2 },
                        992: { items: 3 }
                    }
                }));
            });
        }

        if ($('.owl-related').length) {
            initOwl($('.owl-related'), $.extend({}, owlDefaults, {
                margin: 30,
                responsive: {
                    0: { items: 1 },
                    768: { items: 2 },
                    992: { items: 3 }
                }
            }));
        }

        if ($('.owl-videos').length) {
            $('.owl-videos').each(function () {
                var isExpert = $(this).closest('.expert-page').length;
                initOwl($(this), $.extend({}, owlDefaults, {
                    loop: !isExpert,
                    margin: 30,
                    responsive: isExpert ? {
                        0: { items: 1 },
                        768: { items: 2 },
                        992: { items: 2 }
                    } : {
                        0: { items: 1 },
                        768: { items: 2 },
                        992: { items: 3 }
                    }
                }));
            });
        }
    }

    function initSimilarPlatesCarousel() {
        var carousel = document.querySelector('.owl-similar-plates');
        if (!carousel) return;

        var $carousel = $(carousel);
        var desktopQuery = window.matchMedia('(min-width: 992px)');
        var CLONE_ROUNDS = 3;
        var owlOptions = {
            nav: false,
            dots: true,
            loop: false,
            autoplay: true,
            autoplayTimeout: 4500,
            autoplayHoverPause: true,
            smartSpeed: 700,
            margin: 16,
            slideBy: 1,
            responsive: {
                0: { items: 1, slideBy: 1 },
                576: { items: 2, slideBy: 1 },
                992: { items: 3, slideBy: 1 },
                1200: { items: 4, slideBy: 1 }
            }
        };

        function getOriginalItems() {
            return Array.prototype.slice.call(
                carousel.querySelectorAll('.item:not([data-similar-clone])')
            );
        }

        function addClones() {
            if (carousel.dataset.similarCloned === 'true') return;

            var items = getOriginalItems();
            for (var r = 0; r < CLONE_ROUNDS; r++) {
                items.forEach(function (item) {
                    var clone = item.cloneNode(true);
                    clone.setAttribute('data-similar-clone', 'true');
                    carousel.appendChild(clone);
                });
            }

            carousel.dataset.similarCloned = 'true';
        }

        function removeClones() {
            carousel.querySelectorAll('[data-similar-clone]').forEach(function (node) {
                node.remove();
            });
            carousel.dataset.similarCloned = 'false';
        }

        function destroyCarousel() {
            if (!$carousel.hasClass('owl-loaded')) return;

            $carousel.off('.owlDotsSync');
            $carousel.trigger('destroy.owl.carousel');
            $carousel.removeClass('owl-loaded owl-dragging');
        }

        function syncCarousel() {
            destroyCarousel();

            if (desktopQuery.matches) {
                addClones();
            } else {
                removeClones();
            }

            initOwl($carousel, owlOptions);
        }

        syncCarousel();

        if (desktopQuery.addEventListener) {
            desktopQuery.addEventListener('change', syncCarousel);
        } else {
            desktopQuery.addListener(syncCarousel);
        }
    }

    function initMobileNav() {
        var $header = $('.site-header');
        var $collapse = $('#siteHeaderNav');
        var $toggler = $('[data-nav-toggle]');
        var $overlay = $('[data-nav-overlay]');
        var mobileQuery = window.matchMedia('(max-width: 991px)');

        function isMobileNav() {
            return mobileQuery.matches;
        }

        function openMenu() {
            $header.addClass('is-menu-open');
            $('body').addClass('is-nav-open');
            $collapse.addClass('show');
            $toggler.attr('aria-expanded', 'true');
        }

        function closeMenu() {
            $header.removeClass('is-menu-open');
            $('body').removeClass('is-nav-open');
            $collapse.removeClass('show collapsing');
            $toggler.attr('aria-expanded', 'false');
        }

        $toggler.on('click', function (e) {
            if (!isMobileNav()) return;

            e.preventDefault();
            e.stopPropagation();

            if ($header.hasClass('is-menu-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        $overlay.on('click', closeMenu);

        $(document).on('keyup', function (e) {
            if (e.key === 'Escape') closeMenu();
        });

        mobileQuery.addEventListener('change', function () {
            if (!isMobileNav()) closeMenu();
        });

        $('.nav-menu').on('click', '> li > a', function (e) {
            if (!isMobileNav()) return;

            var $item = $(this).parent('li');
            if (!$item.children('.sub-menu, .mega-menu').length) return;

            e.preventDefault();
            e.stopPropagation();
            $item.toggleClass('is-open')
                .siblings('li').filter(function () {
                    return $(this).children('.sub-menu, .mega-menu').length;
                })
                .removeClass('is-open');
        });
    }

    function initInventoryFilters() {
        var $inventory = $('.inventory');
        var $toggle = $('[data-filters-toggle]');
        var $overlay = $('[data-filters-overlay]');
        var $close = $('[data-filters-close]');
        if (!$inventory.length || !$toggle.length) return;

        var mobileQuery = window.matchMedia('(max-width: 991px)');

        function isMobileFilters() {
            return mobileQuery.matches;
        }

        function openFilters() {
            $inventory.addClass('is-filters-open');
            $('body').addClass('is-filters-open');
            $toggle.attr('aria-expanded', 'true');
        }

        function closeFilters() {
            $inventory.removeClass('is-filters-open');
            $('body').removeClass('is-filters-open');
            $toggle.attr('aria-expanded', 'false');
        }

        $toggle.on('click', function () {
            if (!isMobileFilters()) return;

            if ($inventory.hasClass('is-filters-open')) {
                closeFilters();
            } else {
                openFilters();
            }
        });

        $overlay.on('click', closeFilters);
        $close.on('click', closeFilters);

        $(document).on('keyup', function (e) {
            if (e.key === 'Escape') closeFilters();
        });

        mobileQuery.addEventListener('change', function () {
            if (!isMobileFilters()) closeFilters();
        });
    }

    function initCatalogFilterBar() {
        var $wrap = $('.catalog-filters');
        var $toggle = $('[data-filter-bar-toggle]');
        var $overlay = $('[data-filter-bar-overlay]');
        var $close = $('[data-filter-bar-close]');
        if (!$wrap.length || !$toggle.length) return;

        var mobileQuery = window.matchMedia('(max-width: 991px)');

        function isMobileFilters() {
            return mobileQuery.matches;
        }

        function openFilters() {
            $wrap.addClass('is-filters-open');
            $('body').addClass('is-filters-open');
            $toggle.attr('aria-expanded', 'true');
        }

        function closeFilters() {
            $wrap.removeClass('is-filters-open');
            $('body').removeClass('is-filters-open');
            $toggle.attr('aria-expanded', 'false');
            $wrap.find('.filter-bar__dropdown').removeClass('show');
            $wrap.find('.dropdown-menu').removeClass('show');
            $wrap.find('.dropdown-toggle').attr('aria-expanded', 'false');
        }

        $toggle.on('click', function () {
            if (!isMobileFilters()) return;

            if ($wrap.hasClass('is-filters-open')) {
                closeFilters();
            } else {
                openFilters();
            }
        });

        $overlay.on('click', closeFilters);
        $close.on('click', closeFilters);

        $(document).on('keyup.catalogFilters', function (e) {
            if (e.key === 'Escape') closeFilters();
        });

        mobileQuery.addEventListener('change', function () {
            if (!isMobileFilters()) closeFilters();
        });

        $wrap.find('.filter-bar__dropdown').on('show.bs.dropdown', function () {
            if (!isMobileFilters() || !$wrap.hasClass('is-filters-open')) return;

            var $current = $(this);
            $wrap.find('.filter-bar__dropdown').not($current).each(function () {
                var $dd = $(this);
                $dd.removeClass('show');
                $dd.find('.dropdown-menu').removeClass('show');
                $dd.find('.dropdown-toggle').attr('aria-expanded', 'false');
            });
        });
    }

    function initHomeHeader() {
        if (!$('.site-header--home').length) return;

        var $header = $('.site-header--home');
        var toggleHeader = function () {
            if ($(window).scrollTop() > 80) {
                $header.addClass('active');
            } else {
                $header.removeClass('active');
            }
        };

        toggleHeader();
        $(window).on('scroll', toggleHeader);
    }

    function initCartCheckboxes() {
        var checkAll = document.getElementById('cartCheckAll');
        if (!checkAll) return;

        var itemChecks = document.querySelectorAll('.cart-item .cart-item__check');
        if (!itemChecks.length) return;

        function syncCheckAll() {
            var checkedCount = 0;
            itemChecks.forEach(function (item) {
                if (item.checked) checkedCount++;
            });

            checkAll.checked = checkedCount === itemChecks.length;
            checkAll.indeterminate = checkedCount > 0 && checkedCount < itemChecks.length;
        }

        checkAll.addEventListener('change', function () {
            checkAll.indeterminate = false;
            itemChecks.forEach(function (item) {
                item.checked = checkAll.checked;
            });
        });

        itemChecks.forEach(function (item) {
            item.addEventListener('change', syncCheckAll);
        });

        syncCheckAll();
    }

    function initToctoc() {
        if (!$('#toctoc').length || typeof $.toctoc !== 'function') return;

        var $content = $('.js-toc-content');
        if (!$content.length) return;

        var savedHeadingIds = [];
        $content.find('h2, h3, h4, h5, h6').each(function () {
            savedHeadingIds.push($(this).attr('id') || null);
        });

        $.toctoc({
            headText: 'Mục lục',
            headLinkText: ['', ''],
            opened: true,
            target: '.js-toc-content',
            smooth: true,
            headBackgroundColor: 'transparent',
            headTextColor: '#e4be74',
            headLinkColor: 'transparent',
            bodyBackgroundColor: 'transparent',
            bodyLinkColor: '#ffffff',
            borderStyle: 'none',
            borderWidth: '0',
            borderColor: 'transparent'
        });

        $content.find('h2, h3, h4, h5, h6').each(function (i) {
            var id = savedHeadingIds[i] || ('toctoc-' + (i + 1));
            $(this).attr('id', id);
        });

        var $head = $('#toctoc-head');
        $head.find('a').hide();

        if (!$head.find('.toctoc-head__icon').length) {
            $head.prepend('<span class="toctoc-head__icon" aria-hidden="true">📑</span>');
        }

        restructureToctoc();
        syncToctocLinks($content);

        if ($('.policy-page').length) {
            applyPolicyTocLabels();
        }

        bindToctocLinks();
        initToctocSpy();
    }

    function restructureToctoc() {
        var $body = $('#toctoc-body');
        if (!$body.length) return;

        var $root = $('<ul class="toctoc-list"></ul>');
        var $currentH2 = null;
        var $subList = null;

        $body.children('a').each(function () {
            var $item = $(this);
            var levelClass = ($item.find('p').attr('class') || '').split(' ').pop();
            var level = levelClass ? levelClass.replace('link-', '') : '';
            var $link = $('<a></a>')
                .attr('href', $item.attr('href'))
                .text($item.find('p').text());

            if (level === 'h2') {
                $currentH2 = $('<li class="toctoc-item"></li>').append($link);
                $root.append($currentH2);
                $subList = null;
                return;
            }

            if (level === 'h3' && $currentH2) {
                if (!$subList) {
                    $subList = $('<ul class="toctoc-sublist"></ul>');
                    $currentH2.append($subList);
                }

                $subList.append($('<li></li>').append($link));
            }
        });

        $body.empty().append($root);
    }

    function syncToctocLinks($content) {
        $content.find('h2, h3, h4, h5, h6').each(function () {
            var id = this.id;
            var text = $(this).text().trim();

            $('#toctoc-body a').each(function () {
                if ($(this).text().trim() === text) {
                    $(this).attr('href', '#' + id);
                }
            });
        });
    }

    function applyPolicyTocLabels() {
        var labels = {
            'toctoc-5': '3. Hợp đồng giao dịch',
            'toctoc-6': '3.1. Điều khoản',
            'toctoc-7': '3.2. Điều kiện'
        };

        Object.keys(labels).forEach(function (id) {
            $('#toctoc-body a[href="#' + id + '"]').text(labels[id]);
        });
    }

    function bindToctocLinks() {
        $('#toctoc-body').on('click', 'a[href^="#"]', function (e) {
            var id = $(this).attr('href');
            var $target = $(id);
            if (!$target.length) return;

            e.preventDefault();
            $('html, body').animate({ scrollTop: $target.offset().top - 120 }, 400);
            history.replaceState(null, '', id);
        });
    }

    function initToctocSpy() {
        var $links = $('#toctoc-body a[href^="#"]');
        if (!$links.length) return;

        var sections = $links.map(function () {
            return $($(this).attr('href')).get(0);
        }).get().filter(Boolean);

        if (!sections.length) return;

        function setActive(activeId) {
            $links.removeClass('is-active');

            if (activeId) {
                $links.filter('[href="' + activeId + '"]').addClass('is-active');
            }
        }

        function onScroll() {
            var scrollPos = $(window).scrollTop() + 140;
            var current = null;

            sections.forEach(function (section) {
                if ($(section).offset().top <= scrollPos) {
                    current = '#' + section.id;
                }
            });

            setActive(current);
        }

        $(window).on('scroll', onScroll);
        onScroll();
    }
})(jQuery);

(function () {
    document.querySelectorAll('.catalog-seo__content').forEach(function (content) {
        var text = content.querySelector('.catalog-seo__text');
        var btn = content.querySelector('.catalog-seo__more');

        if (!text || !btn) return;

        var label = btn.querySelector('.catalog-seo__more-text');
        var collapsedHeight = parseInt(text.dataset.collapsedHeight || '154', 10);

        function setExpanded(expanded) {
            if (expanded) {
                text.style.maxHeight = text.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
                if (label) label.textContent = 'Thu gọn';
            } else {
                text.style.maxHeight = collapsedHeight + 'px';
                btn.setAttribute('aria-expanded', 'false');
                if (label) label.textContent = 'Xem thêm';
            }
        }

        function init() {
            text.style.maxHeight = 'none';
            var fullHeight = text.scrollHeight;

            if (fullHeight <= collapsedHeight + 8) {
                btn.classList.add('is-hidden');
                text.style.maxHeight = 'none';
                return;
            }

            text.style.maxHeight = collapsedHeight + 'px';
        }

        btn.addEventListener('click', function () {
            setExpanded(btn.getAttribute('aria-expanded') !== 'true');
        });

        window.addEventListener('resize', function () {
            if (btn.classList.contains('is-hidden')) return;

            if (btn.getAttribute('aria-expanded') === 'true') {
                text.style.maxHeight = text.scrollHeight + 'px';
            } else {
                text.style.maxHeight = collapsedHeight + 'px';
            }
        });

        init();
    });
})();

(function () {
    var counters = document.querySelectorAll('.hero__stats-value[data-count], .expert__stat-value[data-count]');
    if (!counters.length) return;

    function counterDuration(el) {
        var target = parseFloat(el.dataset.count) || 0;
        return Math.max(2200, Math.min(3800, 1600 + target * 0.75));
    }

    function runCounter(el) {
        if (el.dataset.animated === 'true') return;
        el.dataset.animated = 'true';

        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var prefix = el.dataset.prefix || '';
        var startTime = null;
        var duration = counterDuration(el);

        function tick(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = Math.floor(target * eased);

            el.textContent = prefix + value + suffix;

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = prefix + target + suffix;
            }
        }

        requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        counters.forEach(runCounter);
    }
})();
