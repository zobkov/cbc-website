(() => {
    const form = document.getElementById('partnerRegistrationForm');
    if (!form) return;

    /* ── Validation ── */
    const validate = () => {
        let ok = true;

        form.querySelectorAll('input[required], textarea[required]').forEach((f) => {
            const empty = !f.value.trim();
            f.classList.toggle('is-invalid', empty);
            if (empty) ok = false;
        });

        const emailEl = form.querySelector('[name="user-email"]');
        if (emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
            emailEl.classList.add('is-invalid');
            ok = false;
        }

        const captcha = form.querySelector('[data-human-check]');
        if (captcha) {
            captcha.closest('.registration__captcha').classList.toggle('is-invalid', !captcha.checked);
            if (!captcha.checked) ok = false;
        }

        return ok;
    };

    form.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));
    form.addEventListener('change', (e) => {
        e.target.classList.remove('is-invalid');
        e.target.closest('.registration__captcha')?.classList.remove('is-invalid');
    });

    /* ── Submit ── */
    const wrapper    = form.closest('[data-partner-form]');
    const successEl  = wrapper?.querySelector('.registration__form-result--success');
    const errorEl    = wrapper?.querySelector('.registration__form-result--error');
    const submitBtn  = form.querySelector('[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (errorEl) errorEl.classList.remove('is-active');                                                                                                                                                                        

        if (!validate()) {
            form.querySelector('.is-invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        submitBtn.disabled = true;
        const origText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка…';

        try {
            const resp = await fetch('./tg_partner.php', { method: 'POST', body: new FormData(form) });
            const json = await resp.json();

            if (json.ok) {
                wrapper.style.minHeight = wrapper.offsetHeight + 'px';
                form.hidden = true;
                if (successEl) successEl.classList.add('is-active');
            } else {
                if (errorEl) errorEl.classList.add('is-active');
                submitBtn.disabled = false;
                submitBtn.textContent = origText;
            }
        } catch {
            if (errorEl) errorEl.classList.add('is-active');
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
        }
    });
})();
