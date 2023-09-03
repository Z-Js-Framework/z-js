// Define re-usable functions
export function _useNavigate(route) {
  window.location.href = route;
  return window.location.href;
}

export const _getContent = (component) => {
  return typeof component === 'function' ? component() : component;
};

// some utility export functions
export function _makeHtml(htmlString) {
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

export function _makeFrame(id, urlPath) {
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

export function _isUserOnline() {
  return navigator.onLine;
}

// utility function to compare objects say state objects to determine if they're same -- consider using utility libs like lodash, this can stack overflow and loop infinitely for circular refrences!
export function _deepObjectCompare(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if the objects have the same keys
  if (
    keys1.length !== keys2.length ||
    !keys1.every((key) => keys2.includes(key))
  ) {
    return false;
  }

  // Perform deep comparison for each key
  return keys1.every((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (typeof value1 === 'object' && value1 !== null) {
      return _deepObjectCompare(value1, value2);
    } else {
      return value1 === value2;
    }
  });
}

// test the compare function utility
// let object1 = {
//   appLoading: false,
//   count: 0,
//   $user: 'Kizz',
//   $todos: [
//     {
//       id: 1,
//       task: 'feed the cat!',
//       completed: true,
//     },
//     {
//       id: 2,
//       task: 'go to the gym',
//       completed: false,
//     },
//   ],
// };

// let object2 = {
//   appLoading: false,
//   count: 0,
//   $user: 'Kizz',
//   $todos: [
//     {
//       id: 3,
//       task: 'write some code!',
//       completed: false,
//     },
//   ],
// };

// let areEqual = _deepObjectCompare(object2, object2);
// console.log('areEqual:', areEqual);
