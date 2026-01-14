window.keyboardForm = window.keyboardForm || {};

window.keyboardForm.focusElement = function (element, center) {
  if (!element) return;

  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
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
};

window.keyboardForm.focusById = function (id, center) {
  const el = document.getElementById(id);
  if (!el) return;

  el.focus();

  const container = el.closest('.kb-scroll-container')
    || document.querySelector('.kb-scroll-container');

  if (!container) return;

  const padding = 16;
  const cRect = container.getBoundingClientRect();
  const eRect = el.getBoundingClientRect();

  if (center) {
    const target =
      eRect.top - cRect.top - (cRect.height / 2 - eRect.height / 2);
    container.scrollTop += target;
  } else {
    if (eRect.top < cRect.top + padding) {
      container.scrollTop += eRect.top - (cRect.top + padding);
    } else if (eRect.bottom > cRect.bottom - padding) {
      container.scrollTop += eRect.bottom - (cRect.bottom - padding);
    }
  }
};

window.keyboardForm.handleTextKeyDown = function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
};

window.keyboardForm.handleRadioKeyDown = function (event) {
  if (
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === 'ArrowUp' ||
    event.key === 'ArrowDown' ||
    event.key === ' ' ||
    event.key === 'Enter'
  ) {
    event.preventDefault();
  }
};

window.keyboardForm.setSelectIndex = function (id, index) {
  const el = document.getElementById(id);
  if (!el) return;

  el.selectedIndex = index;
};

window.keyboardForm.getSelectLength = function (id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  return el.options.length;
};

window.keyboardForm.openSelect = function (id) {
  const el = document.getElementById(id);
  if (!el || el.disabled) return;

  el.focus();
  
  const evt = new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  el.dispatchEvent(evt);
  
  try {
    el.click();
  } catch {
    // ignore
  }
};
