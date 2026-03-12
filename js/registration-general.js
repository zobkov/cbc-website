(() => {
    const form = document.querySelector('#generalRegistrationForm');
    if (!form) return;

    const roleBlocks = Array.from(form.querySelectorAll('[data-role-block]'));
    const selects = Array.from(form.querySelectorAll('[data-select]'));

    const closeAllSelects = (except = null) => {
        selects.forEach((select) => {
            if (select === except) return;
            select.classList.remove('is-open');
        });
    };

    const setRole = (role) => {
        roleBlocks.forEach((block) => {
            const isActive = block.dataset.roleBlock === role;
            block.hidden = !isActive;
            const controls = block.querySelectorAll('input, button');
            controls.forEach((control) => {
                if (control.type === 'submit') return;
                control.disabled = !isActive;
            });
            if (!isActive) {
                const carField = block.querySelector('[data-car-field]');
                if (carField) carField.hidden = true;
            }
        });
    };

    const toggleCarField = (block, transportValue) => {
        const carField = block.querySelector('[data-car-field]');
        if (!carField) return;
        carField.hidden = transportValue !== 'Личный транспорт';
    };

    const registerSelect = (select) => {
        const valueInput = select.querySelector('[data-select-value]');
        const toggle = select.querySelector('[data-select-toggle]');
        const label = select.querySelector('[data-select-label]');
        const options = Array.from(select.querySelectorAll('[data-select-option]'));

        toggle.addEventListener('click', () => {
            const isOpen = select.classList.contains('is-open');
            closeAllSelects();
            select.classList.toggle('is-open', !isOpen);
        });

        options.forEach((option) => {
            option.addEventListener('click', () => {
                const value = option.dataset.value || '';
                valueInput.value = value;
                label.textContent = option.textContent || '';
                select.classList.add('is-selected');
                select.classList.remove('is-open');

                if (valueInput.name === 'status') {
                    setRole(value);
                }

                if (select.hasAttribute('data-transport-select')) {
                    const roleBlock = select.closest('[data-role-block]');
                    if (roleBlock) {
                        toggleCarField(roleBlock, value);
                    }
                }
            });
        });
    };

    const collectActiveRoleData = (activeBlock) => {
        const payload = {};
        const fields = Array.from(activeBlock.querySelectorAll('input[name]'));

        fields.forEach((field) => {
            if (field.disabled || field.type === 'button' || field.type === 'submit') return;
            if (!field.value.trim()) return;
            payload[field.name] = field.value.trim();
        });

        const passportSeries = payload.passportSeries || '';
        const passportNumber = payload.passportNumber || '';
        const mergedPassport = [passportSeries, passportNumber].filter(Boolean).join(' ');

        if (mergedPassport) {
            payload.passport = mergedPassport;
        }

        delete payload.passportSeries;
        delete payload.passportNumber;

        return payload;
    };

    selects.forEach(registerSelect);

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.closest('[data-select]')) return;
        closeAllSelects();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllSelects();
        }
    });

    setRole('');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fullNameInput = form.querySelector('input[name="fullName"]');
        const statusInput = form.querySelector('input[name="status"]');

        const fullName = fullNameInput ? fullNameInput.value.trim() : '';
        const status = statusInput ? statusInput.value : '';

        const activeRoleBlock = form.querySelector(`[data-role-block="${status}"]`);

        const result = {
            fullName,
            status
        };

        if (activeRoleBlock) {
            Object.assign(result, collectActiveRoleData(activeRoleBlock));
        }

        const endpoint = (form.getAttribute('action') || '').trim();
        const submitButton = form.querySelector('.registration__submit');
        const defaultButtonText = submitButton ? submitButton.textContent : '';

        if (!endpoint) {
            window.location.href = './registration_error.html';
            return;
        }

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Отправка...';
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(result)
            });

            if (response.status !== 201) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const responseData = await response.json();
            const numericKey = responseData && responseData.numericKey;

            if (numericKey === null || numericKey === undefined || String(numericKey).trim() === '') {
                throw new Error('numericKey is missing in successful response');
            }

            const successUrl = new URL('./registration_success.html', window.location.href);
            successUrl.searchParams.set('numericKey', String(numericKey).trim());
            window.location.href = successUrl.toString();
            return;
        } catch (error) {
            console.error('Registration request failed:', error);
            window.location.href = './registration_error.html';
            return;
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = defaultButtonText;
            }
        }
    });
})();
