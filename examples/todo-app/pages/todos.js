// import { html, useState } from 'z-js-framework';
import { html, useState, List, reactive } from '../../../index.js';
import { AppHeader } from '../components/app-header';
import { TodoItem } from '../components/todo-item.js';

export default function TodosPage() {
  const [todos, setTodos] = useState([
    {
      id: 1,
      task: 'something cool',
      completed: true,
    },
    {
      id: 2,
      task: 'something again',
      completed: false,
    },
  ]);

  const handleEdit = (id) => {
    console.log(id);
  };
  const handleDelete = (id) => {
    console.log(id);
  };
  const handleArchive = (id) => {
    console.log(id);
  };
  const handleCheck = (id) => {
    console.log(id);
  };

  const handleAddTodo = (newTodo) => {
    console.log('newTodo::', newTodo);
    setTodos([
      ...todos.current(),
      {
        id: todos.current().length + 1,
        completed: false,
        task: newTodo,
      },
    ]);
  };

  let UI = () => html`
    <div class="todos-page">
      <h1>🗃️ Zero Todos</h1>
      <div class="flex-col">
        ${AppHeader({
          addTodo: handleAddTodo,
        })}
        <!-- Todos List -->
        <table class="todos-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Item</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody ref="todoRef">
            ${List({
              ref: 'todoRef',
              items: todos,
              render: ({ item: todo }) =>
                TodoItem({
                  todo,
                  onEdit: handleEdit,
                  onDelete: handleDelete,
                  onArchive: handleArchive,
                  onCheck: handleCheck,
                }),
            })}
          </tbody>
        </table>
      </div>
      <footer>
        made in 💚 by
        <a class="link" href="https://x.com/hussein_kizz">Hussein Kizz</a>
      </footer>
    </div>
  `;

  return reactive(UI);
}
