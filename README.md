# Z.Js
A simple almost html based js framework!

## Why?

We needed something very simple but can make a plain html, css and js project have a modern like developer experience and be scalable and yet has the power of single page applications (SPAs) or not to say, react applications. Nothing fancy, just the bare minimum, we capitalize on intuitve architecture, native web platform features and principles instead of a bunch of libs, meta frameworks etc that newer devs are even not familiar with usually. Here if know html, and some js, you can still make a great app, with only that you know!

## How it works?

Basically just create 3 files initially, `index.js`, `index.html` and maybe also a style.css file if you like, then a components folder to keep your html strings as compoents, then bring in `z.js` and you good to go, no npm package for now, it will just be a single file for now, try the whole thing here: [ Try Z.Js On Gitpod](https://gitpod.io#snapshot/b9a123b5-4b7d-41dc-8e8c-7db2f109f096)

This is all plain js and html just using js template literals, it's not `react`, we just using module syntax that allows us to import these templates as if components simillar to react, but notice their no build tools or bundlers or whatever yet here, and funny enough, it works!

``` js
// in components/todo-item.js
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

```

then everything else predictably handled in `index.js` as below for example:

``` js
// in index.js
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

```

And all above is just js, no dependencies, no react, just the Z class or instance is an abstraction to handle all the dynamic renderings of your application, states, and etc.

## What Next?

Well this is still work in progress, am working on it with guidance from my mentor, so if you have other ideas or what, reach out to me at [hssnkizz@gmail.com](hssnkizz@gmail.com) or read [Contribution Guide](./CONTRIBUTION.MD) to get started on how things work and the whole project plan and roadmap!