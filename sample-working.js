function taggedTemplateLiteral(strings, ...values) {
  // Create a new template element
  let template = document.createElement('template');

  // Interpolate the strings and values to create a new HTML structure
  let html = strings.reduce((result, string, i) => {
    return result + string + (values[i] !== undefined ? values[i] : '');
  }, '');

  // Set the innerHTML of the template to the new HTML structure
  template.innerHTML = html;

  // Return the content of the template
  return template.content;
}

let parentElement = document.getElementById('parent');
let data = {
  todoItem: {
    completed: false,
    task: 'Learn about web components',
    id: 1,
  },
  edit: function (id) {
    console.log('Edit todo item with id ' + id);
  },
  delete: function (id) {
    console.log('Delete todo item with id ' + id);
  },
};

let node = taggedTemplateLiteral`
 <div class="todo-item">
 <input type="checkbox" name="todoCheck" id="todoCheck" data-checked="${data.todoItem.completed}">
 <span>${data.todoItem.task}</span>
 <button class="edit-button" data-onclick="edit" data-id="${data.todoItem.id}">
 edit todo
 </button>
 <button class="delete-button" data-onclick="delete" data-id="${data.todoItem.id}">
 delete todo
 </button>
 </div>
`;

parentElement.appendChild(node);

// Add event listeners to the elements with the data-onclick attribute
document.querySelectorAll('[data-onclick]').forEach((element) => {
  let event = element.getAttribute('data-onclick');
  let id = element.getAttribute('data-id');
  if (event && id) {
    element.addEventListener('click', () => data[event](id));
  }
});
