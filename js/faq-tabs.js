// ./js/faq-tabs.js
// FAQ categories – filters accordion items by data-faq-cat
// Also removes the top border from the FIRST VISIBLE question (adds .faq-first)
// so spacing is identical across categories.

(() => {
    const tabs = document.querySelector('[data-faq-tabs]');
    if (!tabs) return;

    const section = tabs.closest('.question') || document;
    const accordion = section.querySelector('.accordion');
    if (!accordion) return;

    const btns = Array.from(tabs.querySelectorAll('[data-faq-tab]'));
    const items = Array.from(accordion.querySelectorAll('.accordion__element'));
    if (!btns.length || !items.length) return;

    // Default category for items without data-faq-cat (so "forum" always has content)
    items.forEach((el) => {
        const v = (el.dataset.faqCat || '').trim();
        if (!v) el.dataset.faqCat = 'forum';
    });

    const parseCats = (value) =>
        String(value || '')
            .split(/[,\s]+/)
            .map((s) => s.trim())
            .filter(Boolean);

    const closeAccordionItem = (el) => {
        el.classList.remove('is-active');
        const content = el.querySelector('.accordion__content');
        if (content) {
            content.style.height = '';
            content.style.maxHeight = '';
        }
    };

    const setActive = (cat) => {
        // update tab states
        btns.forEach((b) => {
            const active = b.dataset.faqTab === cat;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        // show/hide items
        items.forEach((el) => {
            const isMatch = parseCats(el.dataset.faqCat).includes(cat);

            if (!isMatch) closeAccordionItem(el);

            el.hidden = !isMatch;
            el.classList.toggle('faq-is-hidden', !isMatch); // safety if CSS conflicts
        });

        // make top spacing consistent: remove top border from first visible item
        items.forEach((el) => el.classList.remove('faq-first'));
        const firstVisible = items.find((el) => !el.hidden);
        if (firstVisible) firstVisible.classList.add('faq-first');
    };

    // click handler
    tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-faq-tab]');
        if (!btn) return;
        setActive(btn.dataset.faqTab);
    });

    // initial category
    const initial =
        (btns.find((b) => b.classList.contains('is-active')) || btns[0])?.dataset.faqTab ||
        'forum';

    setActive(initial);
})();
