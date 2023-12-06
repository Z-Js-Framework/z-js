// function html(strings, ...values) {
//   let result = '';
//   strings.forEach((string, i) => {
//     result += string + (values[i] || '');
//   });
//   return result;
// }

const page = document.querySelector('#page');

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
// const name = 'Kizz';
// const greeting = html`<p>Hello, ${name}!</p>`;
function html(data, strings, ...values) {
  let result = '';
  strings.forEach((string, i) => {
    result += string + (values[i] || '');
  });

  // Create a DocumentFragment and set its innerHTML to the result
  let fragment = document.createElement('div');
  fragment.innerHTML = result;

  // Import the content of the template element into the DOM
  let template = fragment.querySelector('template');
  let content;
  if (template) {
    content = document.importNode(template.content, true);
  }

  // Attach the event handlers to the elements
  const elements = content.querySelectorAll('[data-action]');
  elements.forEach((element) => {
    const actions = element.getAttribute('data-action').split(', ');
    actions.forEach((action) => {
      const [event, handler, ...params] = action.split(": '");
      if (data[handler.slice(0, -1)]) {
        element.addEventListener(event.slice(7), () =>
          data[handler.slice(0, -1)](...params.slice(0, -1))
        );
      }
    });
  });

  return content;
}

const greeting = `<style>
    .todo-item {
      color: red;
    }
  </style>

  <template>
    <div class="todo-item">
      <input
        type="checkbox"
        name="todoCheck"
        id="todoCheck"
        ${data.todoItem.completed ? 'checked' : null} />
      <span>${data.todoItem.task}</span>
      <button
        class="edit-button"
        data-action="event: 'click', handler: 'edit', params: '${
          data.todoItem.id
        }', '${data.todoItem.task}'">
        edit todo
      </button>
      <button
        class="delete-button"
        data-action="event: 'click', handler: 'delete', params: '${
          data.todoItem.id
        }'">
        delete todo
      </button>
    </div>
  </template>`;

console.log('greeting', greeting);
// page.innerHTML = greeting;
// page.appendChild(greeting);
