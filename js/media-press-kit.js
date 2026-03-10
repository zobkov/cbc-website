document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-partners-form]');
  const status = form?.querySelector('[data-form-status]');
  const successBox = form?.querySelector('.registration__form-result--success');
  const errorBox = form?.querySelector('.registration__form-result--error');
  const closeButtons = form?.querySelectorAll('.registration__form-close') || [];

  if (!form || !status) return;

  const setStatus = (message, state) => {
    status.textContent = message;
    status.classList.remove('is-success', 'is-error');
    if (state) status.classList.add(state);
  };

  const hideMessages = () => {
    successBox && (successBox.style.display = 'none');
    errorBox && (errorBox.style.display = 'none');
  };

  closeButtons.forEach((button) => {
    button.addEventListener('click', hideMessages);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideMessages();
    setStatus('', '');

    if (!form.reportValidity()) {
      setStatus('Пожалуйста, заполните обязательные поля.', 'is-error');
      return;
    }

    const humanCheckbox = form.querySelector('[data-human-check]');
    if (humanCheckbox && !humanCheckbox.checked) {
      setStatus('Пожалуйста, подтвердите, что вы человек.', 'is-error');
      humanCheckbox.focus();
      return;
    }

    const honeypot = form.querySelector('.registration__honeypot');
    if (honeypot && honeypot.value.trim() !== '') {
      setStatus('Проверка не пройдена. Попробуйте ещё раз.', 'is-error');
      return;
    }

    const submitButton = form.querySelector('.registration__submit');
    const defaultText = submitButton?.textContent || 'Отправить';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправка...';
    }

    try {
      const endpoint = form.querySelector('form')?.getAttribute('action')?.trim();
      if (endpoint && endpoint !== '#') {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form.querySelector('form')),
        });

        if (!response.ok) throw new Error('Request failed');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }

      form.querySelector('form')?.reset();
      setStatus('Спасибо! Ваша заявка была отправлена. Скоро мы свяжемся с вами.', 'is-success');
    } catch (error) {
      setStatus('Не удалось отправить форму. Проверьте endpoint и попробуйте ещё раз.', 'is-error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = defaultText;
      }
    }
  });
});
