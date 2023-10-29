'use strict';

import {
  createComponent,
  fetchComponentContent,
} from './z/rendering-engine/render.js';
import { print } from './z/utils/utilities.js';

const page = document.querySelector('#page');

async function handleComponent() {
  let newContent = await fetchComponentContent('component');

  if (newContent) {
    // print(newContent);
    page.append(newContent);
    // page.appendChild(newContent);
  }
}

handleComponent();

let myComponent = createComponent('p', { class: 'my-component' });

print(myComponent);
