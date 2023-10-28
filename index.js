import { APP_STATE } from './app-state.js';
import { Loader } from './components/loader.js';
import { TodoItemsTemplate } from './components/todo-item.js';
import ZEngine from './z/z.js';

// get all elements you want to work with in your Js
const homePage = document.querySelector('#homePage');
const addTodoButton = document.querySelector('#addTodoButton');
const resetAllTodosButton = document.querySelector('#resetTodoButton');
const todoInput = document.querySelector('#todoInput');
const usernameElement = document.querySelector('.username');
const logOutButton = document.querySelector('.logout-button');
const todosList = document.querySelector('.todos-list');

// initialize Z instance with parent element or your main app wrapper eg. body
const Z = new ZEngine(homePage);

// get state methods and intialize Z state manager with intial state
// set persistStates to true to share state across your application pages and even when page reloads -- uses local storage
const { state, setState, getState } = Z.stateManager({
  initialState: APP_STATE,
  persistStates: false,
});

// try to log app state using state method!
console.log('Initial App State:', state);

// HANDLE USER
// log out current user
logOutButton.addEventListener('click', () => {
  setState((prevState) => ({ ...prevState, $user: 'Javascript' }));
  let currentState = getState();
  console.log('app state after username change:', currentState);
});

// react to username changes
Z.useEvent('userChanged', (data) => {
  // change user name to new user
  console.log('user change detected, new username:', data);
  usernameElement.textContent = `User: ${data}`;
});

// HANDLE TODOS
// render intial todos
Z.render('myTodos', TodoItemsTemplate(state.$todos));

// add a new todo on click of add todo
addTodoButton.addEventListener('click', (e) => {
  let currentState = getState();

  // define new todo item
  let newTodo = {
    id: currentState.$todos.length + 1,
    task: todoInput.value,
    completed: false,
  };

  // set new item in state todos
  if (todoInput.value) {
    setState((prevState) => ({
      $todos: [...prevState.$todos, newTodo],
    }));
  }
});

// remover, delete or reset all todos on click of reset todos
resetAllTodosButton.addEventListener('click', () => {
  setState((prevState) => ({
    ...prevState,
    $todos: [],
  }));

  // you can also manually change stuff as you like
  let myHtml = `<div class="todo-item">
          <span>🐱 all todos deleted!</span>
        </div>`;
  let myTodos = document.querySelector('#myTodos');
  myTodos.innerHTML = myHtml;
});

// or promptly listen for todos state change event and automatically react to changes anywhere in your code
Z.useEvent('todosChanged', (data) => {
  console.log('todos change event detected, new todos:', data);
  Z.render('myTodos', TodoItemsTemplate(data));
});

// Z.replace(myAppId, Header({ username: 'Kizz' }));
// Z.append('after', myAppId, Footer);

// show a splash screen loader for 2 milli seconds
Z.showLoader(Loader, 2000);

// optional, logs whatever Z rendered in broswer to the console
// Z.log();

// Todo: make a z load into or insert method and z use template for loop method
