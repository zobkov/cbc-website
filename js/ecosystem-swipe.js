// ./js/ecosystem-swipe.js
// Ecosystem: trackpad horizontal scroll + drag swipe (mouse/touch) + iOS touch fallback

(() => {
    const section = document.querySelector('.ecosystem');
    if (!section) return;

    const carousel = section.querySelector('[data-eco-carousel]') || section;
    const panel = carousel.querySelector('.ecosystem__panel');
    const prevBtn = carousel.querySelector('.ecosystem__arrow--prev');
    const nextBtn = carousel.querySelector('.ecosystem__arrow--next');

    // If any of these is null, swipes won't work.
    if (!panel || !prevBtn || !nextBtn) return;

    let locked = false;
    const lockFor = (ms = 520) => {
        locked = true;
        window.setTimeout(() => (locked = false), ms);
    };

    const go = (dir) => {
        if (locked) return;
        (dir === 'next' ? nextBtn : prevBtn).click();
        lockFor();
    };

    /* -------------------------
       Trackpad: horizontal wheel
       ------------------------- */
    let wheelAcc = 0;
    const THRESH = 40; // lower & accumulated (works with smooth deltas)

    const onWheel = (e) => {
        // Accept horizontal scroll. Some devices use shift+vertical for horizontal.
        const dx = e.deltaX || 0;
        const dy = e.deltaY || 0;
        const effectiveX = Math.abs(dx) > 0 ? dx : (e.shiftKey ? dy : 0);

        if (!effectiveX) return;

        // Only react when horizontal intent dominates (unless shift)
        if (!e.shiftKey && Math.abs(dx) < Math.abs(dy)) return;

        e.preventDefault();

        wheelAcc += effectiveX;

        if (wheelAcc > THRESH) {
            wheelAcc = 0;
            go('next');
        } else if (wheelAcc < -THRESH) {
            wheelAcc = 0;
            go('prev');
        }
    };

    // Capture = we receive the wheel even if a child element is on top
    carousel.addEventListener('wheel', onWheel, { passive: false, capture: true });

    /* -------------------------
       Drag swipe (mouse + touch)
       ------------------------- */
    let dragActive = false;
    let startX = 0;
    let startY = 0;

    const DRAG_X = 70; // px
    const startDrag = (x, y) => {
        dragActive = true;
        startX = x;
        startY = y;
    };

    const endDrag = (x, y) => {
        if (!dragActive) return;
        dragActive = false;

        const dx = x - startX;
        const dy = y - startY;

        if (Math.abs(dx) < DRAG_X) return;
        if (Math.abs(dx) < Math.abs(dy)) return;

        go(dx < 0 ? 'next' : 'prev');
    };

    // Pointer events (modern browsers)
    panel.addEventListener('pointerdown', (e) => {
        // allow both mouse and touch dragging
        startDrag(e.clientX, e.clientY);
    });

    panel.addEventListener('pointerup', (e) => {
        endDrag(e.clientX, e.clientY);
    });

    panel.addEventListener('pointercancel', () => {
        dragActive = false;
    });

    // iOS Safari fallback (if pointer events behave inconsistently)
    panel.addEventListener('touchstart', (e) => {
        const t = e.changedTouches[0];
        if (!t) return;
        startDrag(t.clientX, t.clientY);
    }, { passive: true });

    panel.addEventListener('touchend', (e) => {
        const t = e.changedTouches[0];
        if (!t) return;
        endDrag(t.clientX, t.clientY);
    }, { passive: true });
})();
