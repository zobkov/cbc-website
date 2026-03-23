(() => {
    const form = document.getElementById('mediaRegistrationForm');
    if (!form) return;

    /* ── Custom select ── */
    form.querySelectorAll('[data-select]').forEach((sel) => {
        const btn    = sel.querySelector('[data-select-btn]');
        const label  = btn.querySelector('[data-select-label]');
        const hidden = sel.querySelector('input[type="hidden"]');
        const menu   = sel.querySelector('[data-select-menu]');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = sel.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', open);
        });

        menu.querySelectorAll('[data-option-value]').forEach((opt) => {
            opt.addEventListener('click', () => {
                label.textContent = opt.textContent.trim();
                label.style.color = '';
                hidden.value = opt.dataset.optionValue;
                sel.classList.remove('is-open', 'is-invalid');
                btn.classList.remove('is-invalid');
                btn.setAttribute('aria-expanded', 'false');
            });
        });
    });

    document.addEventListener('click', () => {
        form.querySelectorAll('[data-select].is-open').forEach((s) => {
            s.classList.remove('is-open');
            s.querySelector('[data-select-btn]').setAttribute('aria-expanded', 'false');
        });
    });

    /* ── Radio: show/hide conditional field ── */
    const helpWrap = document.getElementById('helpDetailsWrap');
    form.querySelectorAll('[name="need-help"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            if (helpWrap) helpWrap.hidden = radio.value !== 'Да';
        });
    });

    /* ── Validation ── */
    const validate = () => {
        let ok = true;

        form.querySelectorAll(
            'input[required]:not([type="radio"]):not([type="checkbox"]):not([type="hidden"]), textarea[required]'
        ).forEach((f) => {
            if (f.closest('[hidden]')) return;
            const empty = !f.value.trim();
            f.classList.toggle('is-invalid', empty);
            if (empty) ok = false;
        });

        // Email format
        const emailEl = form.querySelector('[name="journalist-email"]');
        if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
            emailEl.classList.add('is-invalid');
            ok = false;
        }

        // Custom select
        form.querySelectorAll('[data-select]').forEach((sel) => {
            const hidden = sel.querySelector('input[type="hidden"]');
            const btn    = sel.querySelector('[data-select-btn]');
            const empty  = !hidden.value;
            btn.classList.toggle('is-invalid', empty);
            if (empty) ok = false;
        });

        // Radio group
        const radioChecked = form.querySelector('[name="need-help"]:checked');
        const radioGroup   = form.querySelector('[data-radio-group]');
        if (radioGroup) {
            radioGroup.classList.toggle('is-invalid', !radioChecked);
            if (!radioChecked) ok = false;
        }

        // Captcha
        const captcha = form.querySelector('[data-human-check]');
        if (captcha) {
            captcha.classList.toggle('is-invalid', !captcha.checked);
            if (!captcha.checked) ok = false;
        }

        return ok;
    };

    /* ── Clear invalid state on user input ── */
    form.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));
    form.addEventListener('change', (e) => {
        e.target.classList.remove('is-invalid');
        const rg = form.querySelector('[data-radio-group]');
        if (rg && e.target.name === 'need-help') rg.classList.remove('is-invalid');
    });

    /* ── Submit ── */
    const successEl = document.getElementById('mediaFormSuccess');
    const errorEl   = document.getElementById('mediaFormError');
    const submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (errorEl) errorEl.hidden = true;

        if (!validate()) {
            form.querySelector('.is-invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        submitBtn.disabled = true;
        const origText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка…';

        try {
            const resp = await fetch('./tg_media.php', { method: 'POST', body: new FormData(form) });
            const json = await resp.json();

            if (json.ok) {
                form.hidden = true;
                if (successEl) successEl.hidden = false;
            } else {
                if (errorEl) errorEl.hidden = false;
                submitBtn.disabled = false;
                submitBtn.textContent = origText;
            }
        } catch {
            if (errorEl) errorEl.hidden = false;
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
        }
    });
})();
