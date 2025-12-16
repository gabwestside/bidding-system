window.recaptchaInterop = (function () {
  let widgetId = null;

  function init(siteKey) {
    // a API carrega assíncronamente; usamos ready pra garantir
    if (!window.grecaptcha) {
      console.warn("reCAPTCHA ainda não carregou");
      setTimeout(function() {
        init(siteKey);
      }, 500);
      return;
    }

    window.grecaptcha.ready(function () {
      var container = document.getElementById("recaptcha-container");
      if (!container) {
        return;
      }

      // Limpa o container para garantir que não haja duplicidade ou erro de re-renderização
      container.innerHTML = "";

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
