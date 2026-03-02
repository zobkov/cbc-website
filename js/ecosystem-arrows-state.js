// ./js/ecosystem-arrows-state.js
// Hides + disables ecosystem prev/next arrows on first/last slide.
// Updates immediately on arrow click (no waiting for transition end).

(() => {
    const section = document.querySelector('.ecosystem');
    if (!section) return;

    const panel = section.querySelector('.ecosystem__panel');
    if (!panel) return;

    const track = panel.querySelector(':scope > div'); // translated flex row
    if (!track) return;

    const prevBtn = section.querySelector('.ecosystem__arrow--prev');
    const nextBtn = section.querySelector('.ecosystem__arrow--next');
    if (!prevBtn || !nextBtn) return;

    const slides = Array.from(track.children);
    const total = slides.length;

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    const getTranslateX = () => {
        const t = getComputedStyle(track).transform;
        if (!t || t === 'none') return 0;

        if (t.startsWith('matrix(')) {
            const parts = t.slice(7, -1).split(',').map(Number);
            return parts[4] || 0;
        }
        if (t.startsWith('matrix3d(')) {
            const parts = t.slice(9, -1).split(',').map(Number);
            return parts[12] || 0;
        }
        return 0;
    };

    const getIndex = () => {
        const w = panel.getBoundingClientRect().width || 1;
        const tx = getTranslateX(); // negative when moving right
        const idx = Math.round((-tx) / w);
        return clamp(idx, 0, total - 1);
    };

    const setDisabled = (btn, disabled) => {
        btn.classList.toggle('is-disabled', disabled);
        if (disabled) {
            btn.setAttribute('disabled', '');
            btn.setAttribute('aria-disabled', 'true');
            btn.tabIndex = -1;
        } else {
            btn.removeAttribute('disabled');
            btn.setAttribute('aria-disabled', 'false');
            btn.tabIndex = 0;
        }
    };

    const applyIndexState = (i) => {
        setDisabled(prevBtn, i <= 0);
        setDisabled(nextBtn, i >= total - 1);
    };

    const update = () => applyIndexState(getIndex());

    // Immediate state update based on where we're going (no waiting)
    const predictAndApply = (dir) => {
        const cur = getIndex();
        const next = clamp(cur + (dir === 'next' ? 1 : -1), 0, total - 1);
        applyIndexState(next);

        // also resync with real transform ASAP (in case slide width/rounding differs)
        requestAnimationFrame(() => requestAnimationFrame(update));
    };

    // Initial
    update();

    // Keep in sync for non-click changes
    track.addEventListener('transitionend', update);

    const mo = new MutationObserver((muts) => {
        for (const m of muts) {
            if (m.type === 'attributes' && m.attributeName === 'style') {
                update();
                break;
            }
        }
    });
    mo.observe(track, { attributes: true });

    // CLICK: update immediately
    prevBtn.addEventListener('click', () => predictAndApply('prev'));
    nextBtn.addEventListener('click', () => predictAndApply('next'));

    // Resize safety
    let rAF = 0;
    window.addEventListener('resize', () => {
        cancelAnimationFrame(rAF);
        rAF = requestAnimationFrame(update);
    });
})();
