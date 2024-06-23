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
    print(newContent);

    // let res = evaluateData(newContent);
    // print('res', res);
    // page.innerHTML = res;
    // page.append(res[0]);
    page.appendChild(newContent);
  }
}

handleComponent();

let myComponent = createComponent('p', { class: 'my-component' });

print(myComponent);

const evaluateData = (template) => {
  const data = {
    todoItem: {
      completed: true,
      task: 'Sample Task',
      id: 1,
    },
    edit: (id) => {
      // Your edit logic here
      console.log(`Edit clicked for id ${id}`);
    },
    delete: (id) => {
      // Your delete logic here
      console.log(`Delete clicked for id ${id}`);
    },
  };

  return template;
};

function replaceDataPlaceholders(templateHTML) {
  const data = {
    todoItem: {
      completed: true,
      task: 'Sample Task',
      id: 1,
    },
    edit: (id) => {
      // Your edit logic here
      console.log(`Edit clicked for id ${id}`);
    },
    delete: (id) => {
      // Your delete logic here
      console.log(`Delete clicked for id ${id}`);
    },
  };
  // Use a regular expression to find all placeholders like {data.something}
  const placeholderRegex = /{data\.(\w+)}/g;

  // Replace placeholders with corresponding values from the data object
  const replacedTemplate = templateHTML.replace(
    placeholderRegex,
    (match, key) => {
      if (data[key] !== undefined) {
        return data[key]; // Replace with the data value if it exists in the data object
      } else {
        return match; // Keep the original placeholder if the data key doesn't exist
      }
    }
  );

  return replacedTemplate;
}
