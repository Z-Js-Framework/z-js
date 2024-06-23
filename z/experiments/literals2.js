'use strict';
function html(strings, ...values) {
  let result = '';
  strings.forEach((string, i) => {
    result += string + (values[i] || '');
  });
  return result;
}

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

let user = 'kizz';
// let message = html`<p onclick="() => console.log('hola')">some ${user}</p>`;
// console.log(message);

// let content = html`<template>
//   <div class="todo-item">
//     <input
//       type="checkbox"
//       name="todoCheck"
//       id="todoCheck"
//       ${data.todoItem.completed ? 'checked' : null} />
//     <span>${data.todoItem.task}</span>
//     <button class="edit-button" onclick="${() => data.edit(data.todoItem.id)}">
//       edit todo
//     </button>
//     <button
//       class="delete-button"
//       onclick="${() => data.delete(data.todoItem.id)}">
//       delete todo
//     </button>
//   </div>
// </template>`;

let content = html` <div class="todo-item">
  <input
    type="checkbox"
    name="todoCheck"
    id="todoCheck"
    ${data.todoItem.completed ? 'checked' : null} />
  <span>${data.todoItem.task}</span>
  <button class="edit-button" onclick="(() => data.edit(data.todoItem.id))()">
    edit todo
  </button>
  <button
    class="delete-button"
    onclick="(() => data.delete(data.todoItem.id))()">
    delete todo
  </button>
</div>`;

console.log(content);

// Insert the HTML string into the DOM
document.body.innerHTML += content;

// Add the onclick functions as event listeners
// document
//   .querySelector('.edit-button')
//   .addEventListener('click', data.edit.bind(data, data.todoItem.id));
// document
//   .querySelector('.delete-button')
//   .addEventListener('click', data.delete.bind(data, data.todoItem.id));
