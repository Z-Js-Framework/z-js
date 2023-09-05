export const TodoItemsTemplate = (data) => {
  // do anythig with data like creating a todos markup array
  let todosList = data.map((todoItem) => {
    return `
     <div class="todo-item">
          <input type="checkbox" name="todoCheck" id="todoCheck" ${
            todoItem.completed ? 'checked' : null
          }>
          <span>${todoItem.task}</span>
          <button class="edit-button">edit</button>
          <button class="delete-button">delete</button>
        </div>
  `;
  });

  // return new todos list
  return todosList;
};
