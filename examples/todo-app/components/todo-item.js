import { html } from '../../../index.js';

export const TodoItem = (props) => {
  const { todo, onEdit, onCheck, onDelete, onArchive } = props;

  return html`
    <tr>
      <td>${todo.id}</td>
      <td class="todo-text">${todo.task}</td>
      <td>
        <input
          type="checkbox"
          ${todo.completed ? 'checked' : ''}
          onChange="${() => onCheck(todo.id)}" />
        ${todo.completed ? 'completed' : 'pending'}
      </td>
      <td>
        <div class="flex-simple">
          <button class="edit" onClick="${() => onEdit(todo.id)}">Edit</button>
          <button class="delete" onClick="${() => onDelete(todo.id)}">
            Delete
          </button>
          <button class="archive" onClick="${() => onArchive(todo.id)}">
            Archive
          </button>
        </div>
      </td>
    </tr>
  `;
};
