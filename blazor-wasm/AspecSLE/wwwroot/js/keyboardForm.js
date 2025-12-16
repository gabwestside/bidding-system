window.keyboardForm = {
  focusElement: function (element, center) {
    if (!element) return;

    //  * Recupera o elemento contêiner rolável.
    //  * Primeiro, tenta encontrar o elemento ancestral mais próximo com a classe 'kb-scroll-container'.
    //  * Se nenhum ancestral for encontrado, consulta todo o documento em busca do primeiro elemento com essa classe.
    if (element.focus) {
      try {
        element.focus({ preventScroll: true });
      } catch {
        element.focus();
      }
    }

    var container = element.closest('.kb-scroll-container')
      || document.querySelector('.kb-scroll-container');

    if (!container) return;

    var padding = 16;
    var containerRect = container.getBoundingClientRect();
    var elRect = element.getBoundingClientRect();

    if (center) {
      var containerHeight = containerRect.height;
      var currentOffset = elRect.top - containerRect.top;
      var targetOffset = containerHeight * 0.30;

      var delta = currentOffset - targetOffset;
      container.scrollTop += delta;
    } else {
      if (elRect.top < containerRect.top + padding) {
        container.scrollTop += elRect.top - (containerRect.top + padding);
      } else if (elRect.bottom > containerRect.bottom - padding) {
        container.scrollTop += elRect.bottom - (containerRect.bottom - padding);
      }
    }
  }
};
