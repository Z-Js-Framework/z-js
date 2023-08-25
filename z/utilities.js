// Define re-usable functions
export function _useNavigate(route) {
  window.location.href = route;
  return window.location.href;
}

// some utility export functions
export function makeHtml(htmlString) {
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstElementChild;
}

export function _formatCurrency(amount) {
  let formatter = Intl.NumberFormat('us', {
    notation: 'standard',
  });
  return formatter.format(amount);
}

export function makeFrame(id, urlPath) {
  let newIframe = document.createElement('iframe');
  newIframe.id = id;
  newIframe.src = urlPath;
  newIframe.style.height = '100%';
  newIframe.style.width = '100%';
  newIframe.style.border = 'none';
  newIframe.classList.add('iframe-view');
  return newIframe;
}

export function _scrollToElement(Element) {
  Element.scrollIntoView({
    behavior: 'smooth', // or 'auto' for instant scrolling
    block: 'start', // scroll to the top of the element
    inline: 'nearest', // scroll to the nearest edge of the element
  });
}

export function _focusNextTab() {
  // Get the currently focused element
  let currentElement = document.activeElement;

  // Get all elements with a greater tabindex
  let tabItems = Array.from(document.querySelectorAll('[tabindex]')).filter(
    function (element) {
      return element.tabIndex > currentElement.tabIndex;
    }
  );

  // Sort the tabbable elements in ascending order
  tabItems.sort(function (a, b) {
    return a.tabIndex - b.tabIndex;
  });

  // Focus on the first element in the sorted list
  if (tabItems.length > 0) {
    tabItems[0].focus();
  }
}

function _isUserOnline() {
  if (navigator.onLine) {
    return true;
  } else {
    return false;
  }
}
