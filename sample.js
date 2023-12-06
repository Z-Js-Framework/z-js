import { render } from './z/rendering-engine/render.js';

let parentElement = document.getElementById('parent');

let data = {
  todoItem: {
    completed: false,
    task: 'Learn about Z Js Framework!',
    id: 1,
  },
  edit: function (id) {
    console.log('Edit todo item with id ' + id);
  },
  delete: function (id) {
    console.log('Delete todo item with id ' + id);
  },
};

render(parentElement, 'component1.html', data);
