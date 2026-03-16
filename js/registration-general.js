(() => {
    const form = document.querySelector('#generalRegistrationForm');
    if (!form) return;

    const roleBlocks = Array.from(form.querySelectorAll('[data-role-block]'));
    const selects = Array.from(form.querySelectorAll('[data-select]'));
    const popupMessagesByStatus = {
        409: 'Такой email уже зарегистрирован.'
    };
    const defaultPopupMessage = 'Не удалось отправить форму. Попробуйте позже.';
    const participantEducationConfig = {
        'Среднее образование': {
            hint: 'Напиши в формате: город, название уч. заведения, класс.'
        },
        'Высшее образование': {
            hint: 'Напиши в формате: город, название ВУЗа, факультет, курс, год окончания.'
        }
    };

    const trackDescriptions = {
        finance: 'Финансы и инвестиции (Finance & Banking): Участники изучат банковский сектор Поднебесной, научатся структурировать финансовые сделки в международном контексте и анализировать инвестиционные рынки.',
        logistics: 'Логистика и ВЭД (Supply Chain & Trade): Участники научатся планировать и управлять цепочками поставок, страхованием, доставкой и таможенными операциями, а также оптимизировать маршруты и себестоимость.',
        consulting: 'Консалтинг и риск-менеджмент (Strategy & Consulting): Участники научатся решать сложные бизнес-задачи, разрабатывать стратегии выхода на рынок Китая, оценивать риски и собирать аналитические рекомендации для топ-менеджмента.',
        politics: 'Политика, право и дипломатия (Rules of the Game): Участники научатся ориентироваться в международных правилах игры: решать сложные межгосударственные бизнес-задачи, разрабатывать стратегии с учётом правовых норм, оценивать риски и выстраивать отношения с китайскими партнёрами.',
        marketing: 'Маркетинг и медиа (Digital & Brand): Участники изучат специфику продвижения и продаж на китайском рынке, освоят локальные digital-инструменты, а также получат навыки выстраивания эффективных коммуникаций с аудиторией.',
        language: 'Язык, культура и перевод (Humanities & Arts): Участники глубоко погрузятся в китайский язык и культуру, освоят тонкости перевода, поймут культурный код и научатся превращать полученные знания в реальные карьерные возможности.',
        chinese: 'Китайский трек (Chinese Track): Специальный трек только для студентов из Китая, обучение проводится на китайском языке. Участники знакомятся с программой форума, образовательными и культурными форматами, интегрируясь в мероприятия вместе с другими участниками.',
        rosmolodezh_grants: 'Росмолодёжь.Гранты: Трек для участников, которые разрабатывают свои проекты и будут презентовать их на конкурсе «Росмолодёжь.Гранты», с возможностью получить до 1 млн. рублей. Образовательная программа с 26 февраля по 11 апреля 2026 года.<br><br><b>ВНИМАНИЕ!</b> Этот трек для участников конкурса «Росмолодёжь.Гранты». Подробную информцию о конкурсе можно найти на сайте Росмолодёжи: <a href="https://myrosmol.ru/events/f70b4bd4-5df5-4794-b5b1-7ab67b1ca048" style="text-decoration: underline;">Ссылка на сайт</a> и в наших социальный сетях!'
    };

    const closeAllSelects = (except = null) => {
        selects.forEach((select) => {
            if (select === except) return;
            select.classList.remove('is-open');
        });
    };

    const popupNode = document.createElement('div');
    popupNode.className = 'reg-general-popup';
    popupNode.setAttribute('role', 'dialog');
    popupNode.setAttribute('aria-modal', 'true');
    popupNode.setAttribute('aria-labelledby', 'regGeneralPopupTitle');
    popupNode.hidden = true;
    popupNode.innerHTML = `
        <div class="reg-general-popup__backdrop" data-popup-close></div>
        <div class="reg-general-popup__dialog" role="document">
            <button class="reg-general-popup__close" type="button" aria-label="Закрыть" data-popup-close>&times;</button>
            <h2 class="reg-general-popup__title" id="regGeneralPopupTitle">Ошибка регистрации</h2>
            <p class="reg-general-popup__text" data-popup-text></p>
            <button class="reg-general-popup__button" type="button" data-popup-close>Понятно</button>
        </div>
    `;
    document.body.append(popupNode);

    const popupTextNode = popupNode.querySelector('[data-popup-text]');
    let popupLastFocusedElement = null;

    const closeErrorPopup = () => {
        if (popupNode.hidden) return;
        popupNode.hidden = true;
        document.body.classList.remove('reg-general-popup-open');
        if (popupLastFocusedElement && typeof popupLastFocusedElement.focus === 'function') {
            popupLastFocusedElement.focus();
        }
    };

    const openErrorPopup = (message) => {
        if (!popupTextNode) return;
        popupLastFocusedElement = document.activeElement;
        popupTextNode.textContent = message;
        popupNode.hidden = false;
        document.body.classList.add('reg-general-popup-open');

        const firstButton = popupNode.querySelector('.reg-general-popup__button');
        if (firstButton && typeof firstButton.focus === 'function') {
            firstButton.focus();
        }
    };

    const resolvePopupMessage = (statusCode) => {
        return popupMessagesByStatus[statusCode] || defaultPopupMessage;
    };

    popupNode.querySelectorAll('[data-popup-close]').forEach((control) => {
        control.addEventListener('click', closeErrorPopup);
    });

    // --- Guest warning popup ---
    const guestWarningPopupNode = document.createElement('div');
    guestWarningPopupNode.className = 'reg-general-popup';
    guestWarningPopupNode.setAttribute('role', 'dialog');
    guestWarningPopupNode.setAttribute('aria-modal', 'true');
    guestWarningPopupNode.setAttribute('aria-labelledby', 'regGuestPopupTitle');
    guestWarningPopupNode.hidden = true;
    guestWarningPopupNode.innerHTML = `
        <div class="reg-general-popup__backdrop" data-guest-popup-close></div>
        <div class="reg-general-popup__dialog" role="document">
            <button class="reg-general-popup__close" type="button" aria-label="Закрыть" data-guest-popup-close>&times;</button>
            <h2 class="reg-general-popup__title reg-general-guest-popup__title" id="regGuestPopupTitle">&#9888; ВНИМАНИЕ</h2>
            <p class="reg-general-popup__text">При регистрации как гость ты сможешь находиться на площадке форума, но не сможешь посещать мастер-классы и трековые мероприятия. Для участия в них нужна регистрация как участника с выбором трека.<br><br>Регистрируйся как гость, только если уверен в своём выборе. Если сомневаешься, просто напиши нам, поможем разобраться:<br><br>Почта: <a href="mailto:info@forum-cbc.ru" style="color:#c31632;font-weight:700">info@forum-cbc.ru</a><br>Telegram: <a href="https://t.me/cbc_assistant" target="_blank" rel="noopener noreferrer" style="color:#c31632;font-weight:700">@cbc_assistant</a></p>
            <div class="reg-general-guest-popup__buttons">
                <button class="reg-general-popup__button reg-general-guest-popup__confirm" type="button">Всё равно продолжить</button>
                <button class="reg-general-popup__button reg-general-guest-popup__cancel" type="button" data-guest-popup-close>Назад</button>
            </div>
        </div>
    `;
    document.body.append(guestWarningPopupNode);

    let guestPopupOnConfirm = null;
    let guestPopupLastFocusedElement = null;

    const closeGuestWarningPopup = () => {
        if (guestWarningPopupNode.hidden) return;
        guestWarningPopupNode.hidden = true;
        document.body.classList.remove('reg-general-popup-open');
        guestPopupOnConfirm = null;
        if (guestPopupLastFocusedElement && typeof guestPopupLastFocusedElement.focus === 'function') {
            guestPopupLastFocusedElement.focus();
        }
    };

    const openGuestWarningPopup = (onConfirm) => {
        guestPopupLastFocusedElement = document.activeElement;
        guestPopupOnConfirm = onConfirm;
        guestWarningPopupNode.hidden = false;
        document.body.classList.add('reg-general-popup-open');
        const confirmBtn = guestWarningPopupNode.querySelector('.reg-general-guest-popup__confirm');
        if (confirmBtn) confirmBtn.focus();
    };

    guestWarningPopupNode.querySelectorAll('[data-guest-popup-close]').forEach((control) => {
        control.addEventListener('click', closeGuestWarningPopup);
    });

    const guestConfirmBtn = guestWarningPopupNode.querySelector('.reg-general-guest-popup__confirm');
    if (guestConfirmBtn) {
        guestConfirmBtn.addEventListener('click', () => {
            if (typeof guestPopupOnConfirm === 'function') {
                guestPopupOnConfirm();
            }
            closeGuestWarningPopup();
        });
    }

    // --- Track info popup ---
    const trackInfoLines = Object.entries(trackDescriptions).map(([, desc]) => {
        const colonIdx = desc.indexOf(':');
        const title = colonIdx !== -1 ? desc.slice(0, colonIdx) : desc;
        const body = colonIdx !== -1 ? desc.slice(colonIdx + 1).trim() : '';
        return `<div class="reg-general-track-info__item"><strong class="reg-general-track-info__name">${title}</strong>${body ? `<p class="reg-general-track-info__desc">${body}</p>` : ''}</div>`;
    }).join('');

    const trackInfoPopupNode = document.createElement('div');
    trackInfoPopupNode.className = 'reg-general-popup reg-general-track-info-popup';
    trackInfoPopupNode.setAttribute('role', 'dialog');
    trackInfoPopupNode.setAttribute('aria-modal', 'true');
    trackInfoPopupNode.setAttribute('aria-labelledby', 'regTrackInfoPopupTitle');
    trackInfoPopupNode.hidden = true;
    trackInfoPopupNode.innerHTML = `
        <div class="reg-general-popup__backdrop" data-track-info-close></div>
        <div class="reg-general-popup__dialog reg-general-track-info-popup__dialog" role="document">
            <button class="reg-general-popup__close" type="button" aria-label="Закрыть" data-track-info-close>&times;</button>
            <h2 class="reg-general-popup__title" id="regTrackInfoPopupTitle">Профильные треки</h2>
            <div class="reg-general-track-info__list">${trackInfoLines}</div>
            <button class="reg-general-popup__button" type="button" data-track-info-close style="margin-top:1rem">Понятно</button>
        </div>
    `;
    document.body.append(trackInfoPopupNode);

    let trackInfoLastFocusedElement = null;

    const closeTrackInfoPopup = () => {
        if (trackInfoPopupNode.hidden) return;
        trackInfoPopupNode.hidden = true;
        document.body.classList.remove('reg-general-popup-open');
        if (trackInfoLastFocusedElement && typeof trackInfoLastFocusedElement.focus === 'function') {
            trackInfoLastFocusedElement.focus();
        }
    };

    const openTrackInfoPopup = () => {
        trackInfoLastFocusedElement = document.activeElement;
        trackInfoPopupNode.hidden = false;
        document.body.classList.add('reg-general-popup-open');
        const firstClose = trackInfoPopupNode.querySelector('[data-track-info-close]');
        if (firstClose) firstClose.focus();
    };

    trackInfoPopupNode.querySelectorAll('[data-track-info-close]').forEach((control) => {
        control.addEventListener('click', closeTrackInfoPopup);
    });

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
            addError('Заполни поле ФИО.', fullNameInput);
        }

        const statusSelect = status ? null : form.querySelector('input[name="status"]')?.closest('[data-select]');
        if (!status) {
            addError('Выбери статус.', statusSelect);
        }

        const consentInput = form.querySelector('input[name="personalDataConsent"]');
        if (consentInput && !consentInput.checked) {
            addError('Подтверди согласие с политикой обработки персональных данных.', consentInput);
        }

        if (!activeRoleBlock || !status) {
            return { isValid: errors.length === 0, errors, invalidTargets };
        }

        const transportInput = getInputByName('transport', activeRoleBlock);
        const isOnlineTransport = transportInput && transportInput.value === 'Онлайн';

        const requiredByRole = {
            speaker: ['email', 'transport', 'passportNumber'],
            participant: ['adult18', 'region', 'participantStatus', 'email', 'track', 'transport', 'passportNumber'],
            guest: ['email', 'transport', 'passportNumber']
        };

        const roleRequiredFields = requiredByRole[status] || [];

        roleRequiredFields.forEach((fieldName) => {
            if (isOnlineTransport && fieldName === 'passportNumber') {
                return;
            }

            const field = getInputByName(fieldName, activeRoleBlock);
            if (!field) return;
            const value = field.value.trim();
            if (value) return;

            const selectContainer = field.closest('[data-select]');
            addError('Заполни все обязательные поля формы.', selectContainer || field);
        });

        const emailInput = getInputByName('email', activeRoleBlock);
        if (emailInput && emailInput.value.trim() && !emailPattern.test(emailInput.value.trim())) {
            addError('Укажи корректный email.', emailInput);
        }

        const carNumberInput = getInputByName('carNumber', activeRoleBlock);
        if (transportInput && transportInput.value === 'Личный транспорт' && carNumberInput && !carNumberInput.value.trim()) {
            addError('Укажи номер автомобиля для личного транспорта.', carNumberInput);
        }

        if (status === 'participant') {
            const participantStatusInput = getInputByName('participantStatus', activeRoleBlock);
            const educationInput = getInputByName('education', activeRoleBlock);
            const participantStatusValue = participantStatusInput ? participantStatusInput.value.trim() : '';

            if (participantEducationConfig[participantStatusValue] && educationInput && !educationInput.value.trim()) {
                addError('Заполни поле об образовании.', educationInput);
            }
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
            if (isActive) {
                const transportInput = getInputByName('transport', block);
                const transportValue = transportInput ? transportInput.value : '';
                toggleCarField(block, transportValue);
                togglePassportField(block, transportValue);
            }
            if (!isActive) {
                const carField = block.querySelector('[data-car-field]');
                if (carField) carField.hidden = true;
                const educationField = block.querySelector('[data-education-field]');
                if (educationField) {
                    toggleEducationField(block, '');
                }
            }
        });
    };

    const toggleCarField = (block, transportValue) => {
        const carField = block.querySelector('[data-car-field]');
        if (!carField) return;

        const carNumberInput = getInputByName('carNumber', block);
        const shouldShowCarField = transportValue === 'Личный транспорт';

        carField.hidden = !shouldShowCarField;

        if (!carNumberInput) return;

        carNumberInput.disabled = !shouldShowCarField;

        if (!shouldShowCarField) {
            carNumberInput.value = '';
            clearFieldError(carNumberInput);
        }
    };

    const togglePassportField = (block, transportValue) => {
        const passportSeriesInput = getInputByName('passportSeries', block);
        const passportNumberInput = getInputByName('passportNumber', block);
        if (!passportSeriesInput || !passportNumberInput) return;

        const passportField = passportSeriesInput.closest('.reg-general__field');
        const passportInfoNodes = Array.from(block.querySelectorAll('.reg-general__field-info')).filter((node) => {
            return /паспортные данные/i.test(node.textContent || '');
        });
        const shouldHidePassport = transportValue === 'Онлайн';

        if (passportField) {
            passportField.hidden = shouldHidePassport;
        }

        passportInfoNodes.forEach((node) => {
            node.hidden = shouldHidePassport;
        });

        [passportSeriesInput, passportNumberInput].forEach((input) => {
            input.disabled = shouldHidePassport;
            if (shouldHidePassport) {
                input.value = '';
                clearFieldError(input);
            }
        });
    };

    const toggleEducationField = (block, participantStatusValue) => {
        const educationField = block.querySelector('[data-education-field]');
        if (!educationField) return;

        const educationInput = educationField.querySelector('input[name="education"]');
        const educationHint = educationField.querySelector('[data-education-hint]');
        const config = participantEducationConfig[participantStatusValue];

        if (!config) {
            educationField.hidden = true;
            if (educationInput) {
                educationInput.value = '';
                educationInput.disabled = true;
                clearFieldError(educationInput);
            }
            if (educationHint) {
                educationHint.textContent = '';
            }
            return;
        }

        educationField.hidden = false;
        if (educationInput) {
            educationInput.disabled = false;
        }
        if (educationHint) {
            educationHint.textContent = config.hint;
        }
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

                if (valueInput.name === 'status' && value === 'guest') {
                    select.classList.remove('is-open');
                    openGuestWarningPopup(() => {
                        valueInput.value = 'guest';
                        label.textContent = option.textContent.trim() || '';
                        select.classList.add('is-selected');
                        clearFieldError(select);
                        setRole('guest');
                    });
                    return;
                }

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
                        togglePassportField(roleBlock, value);
                    }
                }

                if (valueInput.name === 'participantStatus') {
                    const roleBlock = select.closest('[data-role-block]');
                    if (roleBlock) {
                        toggleEducationField(roleBlock, value);
                    }
                }

                if (valueInput.name === 'track') {
                    const field = select.closest('.reg-general__field');
                    if (field) {
                        const descEl = field.querySelector('[data-track-desc]');
                        if (descEl) {
                            const desc = trackDescriptions[value] || '';
                            descEl.innerHTML = desc ? '<b>Описание выбранного трека:</b> <br>' + desc : '';
                            descEl.hidden = !desc;
                        }
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

    form.querySelectorAll('[data-track-info-btn]').forEach((btn) => {
        btn.addEventListener('click', openTrackInfoPopup);
    });

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
            if (!popupNode.hidden) {
                closeErrorPopup();
                return;
            }
            if (!guestWarningPopupNode.hidden) {
                closeGuestWarningPopup();
                return;
            }
            if (!trackInfoPopupNode.hidden) {
                closeTrackInfoPopup();
                return;
            }
            closeAllSelects();
        }
    });

    const defaultRole = form.dataset.defaultRole || '';
    if (defaultRole) {
        const statusHiddenInput = form.querySelector('input[name="status"]');
        if (statusHiddenInput) {
            const statusSelect = statusHiddenInput.closest('[data-select]');
            if (statusSelect && statusHiddenInput.value) {
                const matchingOption = statusSelect.querySelector(`[data-select-option][data-value="${statusHiddenInput.value}"]`);
                if (matchingOption) {
                    const labelEl = statusSelect.querySelector('[data-select-label]');
                    if (labelEl) labelEl.textContent = matchingOption.textContent.trim();
                    statusSelect.classList.add('is-selected');
                }
            }
        }
    }
    setRole(defaultRole);

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

            if (response.status === 400) {
                window.location.href = './registration_error.html';
                return;
            }

            if (response.status !== 201) {
                openErrorPopup(resolvePopupMessage(response.status));
                return;
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
