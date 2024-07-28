import { css, html, useEffect, useState } from '../../../index.js';

const deleteStyles = css`
  background: red;
  color: #fff;
  box-shadow: 0 0 2px 1px #000;

  &:hover {
    background: #f03;
  }
`;

export const AppHeader = (props) => {
  const [todo, setTodo] = useState('');

  useEffect(() => {
    console.log('todo::', todo.current());
  }, [todo]);

  return html` <header class="flex">
    <div class="flex-simple">
      <input
        type="text"
        class="todos-input"
        value="${todo.value}"
        onChange="${(e) => setTodo(e.target.value)}"
        placeholder="What needs to be done?" />
      <button
        class="brand-button"
        onClick="${() => props.addTodo(todo.current())}">
        Add Todo
      </button>
      <button class="search-button">Search Todo</button>
    </div>
    <div class="flex-simple">
      <button class="active">All</button>
      <button>Completed</button>
      <button>Archived</button>
      <button class="${deleteStyles}">Delete All</button>
    </div>
  </header>`;
};
