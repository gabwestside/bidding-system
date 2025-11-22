window.recaptchaInterop = (function () {
  let widgetId = null;

  function init(siteKey) {
    // a API carrega assíncronamente; usamos ready pra garantir
    if (!window.grecaptcha) {
      console.warn("reCAPTCHA ainda não carregou");
      return;
    }

    window.grecaptcha.ready(function () {
      if (widgetId !== null) {
        return; // já inicializado
      }

      widgetId = window.grecaptcha.render("recaptcha-container", {
        sitekey: siteKey,
      });
    });
  }

  function getResponse() {
    if (!window.grecaptcha || widgetId === null) {
      return "";
    }
    return window.grecaptcha.getResponse(widgetId);
  }

  function reset() {
    if (!window.grecaptcha || widgetId === null) {
      return;
    }
    window.grecaptcha.reset(widgetId);
  }

  return {
    init,
    getResponse,
    reset,
  };
})();
