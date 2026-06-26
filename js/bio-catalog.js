(function () {
    function formatNumber(value) {
        return Number(value || 0).toLocaleString('vi-VN');
    }

    function initFilterPanel() {
        var panel = document.querySelector('[data-filter-panel]');
        var overlay = document.querySelector('[data-filter-overlay]');
        var openBtn = document.querySelector('[data-filter-open]');
        var closeBtn = document.querySelector('[data-filter-close]');
        var applyBtn = document.querySelector('[data-filter-apply]');
        var clearAllBtn = document.querySelector('[data-filter-clear-all]');
        var clearSelectedBtn = document.querySelector('[data-filter-clear-group="selected"]');
        var countBadge = document.querySelector('.catalog-toolbar__filter-count');
        var chipsWrap = document.querySelector('[data-filter-chips]');
        var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));
        var minInput = document.querySelector('[data-price-min]');
        var maxInput = document.querySelector('[data-price-max]');
        var minLabel = document.querySelector('[data-price-min-label]');
        var maxLabel = document.querySelector('[data-price-max-label]');
        var progress = document.querySelector('[data-price-progress]');
        var isClosing = false;

        if (!panel || !overlay || !openBtn) return;

        function openPanel() {
            if (panel.classList.contains('is-open')) return;
            isClosing = false;
            panel.hidden = false;
            overlay.hidden = false;
            document.body.classList.add('is-nav-open');
            window.requestAnimationFrame(function () {
                panel.classList.add('is-open');
                overlay.classList.add('is-open');
            });
        }

        function closePanel() {
            if (panel.hidden || isClosing) return;
            isClosing = true;
            panel.classList.remove('is-open');
            overlay.classList.remove('is-open');
            document.body.classList.remove('is-nav-open');

            window.setTimeout(function () {
                panel.hidden = true;
                overlay.hidden = true;
                isClosing = false;
            }, 320);
        }

        function updateCount() {
            if (!countBadge) return;
            var selected = inputs.filter(function (input) {
                return input.checked;
            }).length;
            countBadge.textContent = String(selected);
        }

        function buildChip(group, value) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'catalog-filter-panel__chip';
            button.setAttribute('data-filter-remove', group);
            button.setAttribute('data-filter-value', value);
            button.innerHTML = '<span>' + value + '</span><i class="fa-sharp fa-solid fa-xmark"></i>';
            return button;
        }

        function updateChips() {
            if (!chipsWrap) return;
            chipsWrap.innerHTML = '';

            inputs.forEach(function (input) {
                if (!input.checked) return;
                chipsWrap.appendChild(buildChip(input.dataset.filterGroup, input.value));
            });
        }

        function clearAllFilters() {
            inputs.forEach(function (input) {
                input.checked = false;
            });
            if (minInput) minInput.value = minInput.min || 0;
            if (maxInput) maxInput.value = maxInput.max || 5000000;
            updatePriceUI();
            updateCount();
            updateChips();
        }

        function removeChip(group, value) {
            var matched = inputs.find(function (input) {
                return input.dataset.filterGroup === group && input.value === value;
            });
            if (matched) {
                matched.checked = false;
                updateCount();
                updateChips();
            }
        }

        function updatePriceUI() {
            if (!minInput || !maxInput || !minLabel || !maxLabel || !progress) return;

            var min = parseInt(minInput.value, 10);
            var max = parseInt(maxInput.value, 10);
            var rangeMin = parseInt(minInput.min, 10);
            var rangeMax = parseInt(maxInput.max, 10);

            if (min > max) {
                var swap = min;
                min = max;
                max = swap;
            }

            minInput.value = min;
            maxInput.value = max;
            minLabel.textContent = formatNumber(min);
            maxLabel.textContent = formatNumber(max);

            var left = ((min - rangeMin) / (rangeMax - rangeMin)) * 100;
            var right = 100 - (((max - rangeMin) / (rangeMax - rangeMin)) * 100);
            progress.style.left = left + '%';
            progress.style.right = right + '%';
        }

        openBtn.addEventListener('click', openPanel);
        overlay.addEventListener('click', closePanel);
        if (closeBtn) closeBtn.addEventListener('click', closePanel);
        if (applyBtn) applyBtn.addEventListener('click', closePanel);
        if (clearAllBtn) clearAllBtn.addEventListener('click', clearAllFilters);
        if (clearSelectedBtn) {
            clearSelectedBtn.addEventListener('click', function () {
                inputs.forEach(function (input) {
                    input.checked = false;
                });
                updateCount();
                updateChips();
            });
        }

        document.addEventListener('click', function (event) {
            var chip = event.target.closest('[data-filter-remove]');
            var toggle = event.target.closest('[data-filter-section-toggle]');
            if (chip) {
                removeChip(chip.getAttribute('data-filter-remove'), chip.getAttribute('data-filter-value'));
            }
            if (toggle) {
                var group = toggle.closest('.catalog-filter-group');
                if (group) {
                    group.classList.toggle('is-collapsed');
                    var icon = group.querySelector('.catalog-filter-group__icon');
                    if (icon) {
                        icon.textContent = group.classList.contains('is-collapsed') ? '+' : '-';
                    }
                }
            }
        });

        inputs.forEach(function (input) {
            input.addEventListener('change', function () {
                updateCount();
                updateChips();
            });
        });

        if (minInput) {
            minInput.addEventListener('input', function () {
                if (parseInt(minInput.value, 10) > parseInt(maxInput.value, 10)) {
                    minInput.value = maxInput.value;
                }
                updatePriceUI();
            });
        }

        if (maxInput) {
            maxInput.addEventListener('input', function () {
                if (parseInt(maxInput.value, 10) < parseInt(minInput.value, 10)) {
                    maxInput.value = minInput.value;
                }
                updatePriceUI();
            });
        }

        document.addEventListener('keyup', function (event) {
            if (event.key === 'Escape') closePanel();
        });

        updateCount();
        updateChips();
        updatePriceUI();
    }

    document.addEventListener('DOMContentLoaded', initFilterPanel);
})();
