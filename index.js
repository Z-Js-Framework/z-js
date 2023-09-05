import { APP_STATE } from './app-state.js';
import { Loader } from './components/loader.js';
import { TodoItemTemplate } from './components/todo-item.js';
import ZEngine from './z/z.js';

// get all elements you want to work with in your Js
const homePage = document.querySelector('#homePage');
const addTodoButton = document.querySelector('#addTodoButton');
const resetTodoButton = document.querySelector('#resetTodoButton');
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

resetTodoButton.addEventListener('click', () => {
  setState((prevState) => ({
    ...prevState,
    $todos: [],
  }));
});

// react to todo state changes
Z.useEvent('todosChanged', (data) => {
  console.log(
    'todos change event detected, do something in diffrent parts of UI:',
    data
  );
});

// react to todo state changes anywhere
Z.useEvent('todosChanged', (data) => {
  console.log('todos change event detected, new todos:', data);
  Z.replace('myTodos', TodoItemTemplate);
});

// Z.replace(myAppId, Header({ username: 'Kizz' }));
// Z.append('after', myAppId, Footer);

// show a splash screen loader for 2 milli seconds
// Z.showLoader(Loader, 2000);

// optional, logs whatever Z rendered in broswer to the console
// Z.log();

// Todo: make a z load into method and z use template for loop method
