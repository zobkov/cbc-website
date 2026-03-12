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

    const validationMessage = document.createElement('p');
    validationMessage.className = 'reg-general__form-error';
    validationMessage.setAttribute('role', 'alert');
    validationMessage.setAttribute('aria-live', 'polite');
    validationMessage.hidden = true;

    const submitButtonNode = form.querySelector('.registration__submit');
    if (submitButtonNode) {
        form.insertBefore(validationMessage, submitButtonNode);
    } else {
        form.append(validationMessage);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const getInputByName = (name, scope = form) => {
        return scope.querySelector(`input[name="${name}"]`);
    };

    const clearFieldError = (target) => {
        if (!target) return;

        if (target.matches('input')) {
            target.classList.remove('is-invalid');
            target.removeAttribute('aria-invalid');
            return;
        }

        if (target.hasAttribute('data-select')) {
            target.classList.remove('is-invalid');
            const toggle = target.querySelector('[data-select-toggle]');
            if (toggle) toggle.removeAttribute('aria-invalid');
        }
    };

    const markFieldInvalid = (target) => {
        if (!target) return;

        if (target.matches('input')) {
            target.classList.add('is-invalid');
            target.setAttribute('aria-invalid', 'true');
            return;
        }

        if (target.hasAttribute('data-select')) {
            target.classList.add('is-invalid');
            const toggle = target.querySelector('[data-select-toggle]');
            if (toggle) toggle.setAttribute('aria-invalid', 'true');
        }
    };

    const clearValidationState = () => {
        validationMessage.hidden = true;
        validationMessage.textContent = '';

        form.querySelectorAll('input.is-invalid').forEach((input) => {
            clearFieldError(input);
        });

        form.querySelectorAll('[data-select].is-invalid').forEach((select) => {
            clearFieldError(select);
        });
    };

    const validateForm = ({ fullName, status, activeRoleBlock }) => {
        const errors = [];
        const invalidTargets = [];

        const addError = (message, target) => {
            errors.push(message);
            if (target) invalidTargets.push(target);
        };

        const fullNameInput = getInputByName('fullName');
        if (!fullName) {
            addError('Заполните поле ФИО.', fullNameInput);
        }

        const statusSelect = status ? null : form.querySelector('input[name="status"]')?.closest('[data-select]');
        if (!status) {
            addError('Выберите статус.', statusSelect);
        }

        if (!activeRoleBlock || !status) {
            return { isValid: errors.length === 0, errors, invalidTargets };
        }

        const requiredByRole = {
            speaker: ['email', 'transport', 'passportSeries', 'passportNumber'],
            participant: ['adult18', 'region', 'participantStatus', 'email', 'track', 'transport', 'passportSeries', 'passportNumber'],
            guest: ['email', 'transport', 'passportSeries', 'passportNumber']
        };

        const roleRequiredFields = requiredByRole[status] || [];

        roleRequiredFields.forEach((fieldName) => {
            const field = getInputByName(fieldName, activeRoleBlock);
            if (!field) return;
            const value = field.value.trim();
            if (value) return;

            const selectContainer = field.closest('[data-select]');
            addError('Заполните все обязательные поля формы.', selectContainer || field);
        });

        const emailInput = getInputByName('email', activeRoleBlock);
        if (emailInput && emailInput.value.trim() && !emailPattern.test(emailInput.value.trim())) {
            addError('Укажите корректный email.', emailInput);
        }

        const passportSeriesInput = getInputByName('passportSeries', activeRoleBlock);
        const passportNumberInput = getInputByName('passportNumber', activeRoleBlock);
        const passportSeries = passportSeriesInput ? passportSeriesInput.value.replace(/\D/g, '') : '';
        const passportNumber = passportNumberInput ? passportNumberInput.value.replace(/\D/g, '') : '';

        if (passportSeriesInput && passportSeriesInput.value.trim() && passportSeries.length !== 4) {
            addError('Серия паспорта должна содержать 4 цифры.', passportSeriesInput);
        }

        if (passportNumberInput && passportNumberInput.value.trim() && passportNumber.length !== 6) {
            addError('Номер паспорта должен содержать 6 цифр.', passportNumberInput);
        }

        const transportInput = getInputByName('transport', activeRoleBlock);
        const carNumberInput = getInputByName('carNumber', activeRoleBlock);
        if (transportInput && transportInput.value === 'Личный транспорт' && carNumberInput && !carNumberInput.value.trim()) {
            addError('Укажите номер автомобиля для личного транспорта.', carNumberInput);
        }

        return { isValid: errors.length === 0, errors, invalidTargets };
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
                clearFieldError(select);

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

    form.querySelectorAll('input').forEach((input) => {
        input.addEventListener('input', () => {
            clearFieldError(input);
            if (!validationMessage.hidden) {
                validationMessage.hidden = true;
            }
        });
    });

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
        clearValidationState();

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

        const validationResult = validateForm({ fullName, status, activeRoleBlock });
        if (!validationResult.isValid) {
            const uniqueTargets = Array.from(new Set(validationResult.invalidTargets));
            uniqueTargets.forEach(markFieldInvalid);

            validationMessage.textContent = validationResult.errors[0] || 'Проверьте корректность заполнения формы.';
            validationMessage.hidden = false;

            const firstInvalid = uniqueTargets[0];
            if (firstInvalid && typeof firstInvalid.scrollIntoView === 'function') {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
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
