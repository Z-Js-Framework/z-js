# 🔥 Z.Js Framework (v0.0.4)

The literally low overhead Js framework!

## 🤖 Why Another Framework? Why Not, Listen Up

As everyone is running for meta frameworks, server-side rendering, and all the new stuff out there in the Js frameworks ecosystem, some of us got fed up. The frontend is hard, so why make it harder with bloat and more mental overhead on devs? #DevsBrainsMatter

So, I needed something very simple that could make a plain HTML, CSS, and Js project have a modern developer experience, be scalable, and yet have the power of single-page applications (SPAs) or, not to say, reactive applications.

Nothing fancy, something to bring that easy feeling when you just go vanilla, using the bare minimums, but not less powerful having to repeat your implementations or copy-paste code as you do in vanilla projects due to lack of compose-ability and components model, these are things we could solve without becoming complex. We instead capitalise on intuitive architecture, native web platform features and principles instead of a bunch of libs, meta frameworks, build tools, and server sh*t that newer devs are not even familiar with usually.

> So, after months of work and learning, the Z Js framework is the fruit of the efforts to make a more straightforward, step-less Js framework that trades all the shiny stuff for simplicity and low mental overhead on developers. Are you tired of having to learn and always play catch-up on new framework features just to make a simple app? Try Z Js!

This is a work in progress and calling on all those who feel like modern js frameworks have become so bloated to contribute to Z, and we will make this awesome; of course, no shiny features allowed, Z doesn't plan to include server-side rendering or related stuff, just do it the old way, let your backend do its job, and here we handle frontend side, this is not another one size fits all thing, this is a client-side framework inspired by frameworks like react but not like them or another full-stack ferry, humbly it's just meant to be used for frontend only, and that's all!

## Roadmap And Features If You Like To Contribute

- ✅ Define framework usage and semantic basics
- ✅ Create a custom state management mechanism
- ✅ Create a simple way to persist state -- just use local storage or web storage
- ✅ Create a custom events-driven system for reactive UI updates
- ✅ Create a main Z binding layer to bring everything together
- ✅ Create UI templating and styling foundations
- ✅ Create common templating utilities (like for loops, conditionals, etc.) -- half way there!
- ✅ Handle single page application model and routing
- ✅ Handle automatic re-rendering on state change
- ✅ Add useful hooks and utilities for common patterns
- 🔳 Add in builtin form utilities and enhancements
- 🔳 Add in builtin promise utilities
- 🔳 Add in builtin page transition and component transition animations
- 🔳 Add builtin low boilerplate data fetching mechanisms
- 🔳 Improve documentation and provide more examples
- 🔳 Introduce Js doc and ship this for massive adoption!
- 🔳 Add tests coverage to ensure more reliability and trust
- 🔳 Do some benchmarks, refactoring and performance optimizations

What else?

## 🤣 How it works? Yes It Works

First things first, here is what you need to get started.

1. Z Js framework

you can install it with command below

```bash
npm install z-js-framework
```

or use a cdn link directly in your html file

```html
<script src="https://cdn.jsdelivr.net/npm/z-js-framework@0.0.4/dist/z.js"></script>
```

Or for the ninjas, grab the z.js script file from Z.Js github repo in dist directory and include it in your project.

2. Some static file server, optional but (recommended)

Honestly, you gonna need some tooling to have the best experience, but it's not mandatory.

💡 TIP: Use vite to run your project, run `npm i -g vite` to install vite globally and then run `vite dev` in your project root directory to start a dev server. And that's if you are familiar with vite and want an easy start but can also just get the VS Code extension [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
 and just run a live server on the HTML file there. Any of those options would do just fine. You don't need a full-fledged server for z to work; you just need to serve your artifacts over HTTP, and that's all. Otherwise, the browser will be very angry with you and might refuse to show your stuff.

 3. VS Code Extension (recommended)

This is not a must, but I must tell you that Z Js uses JavaScript template literals even for templating or crafting your UI, for example:

```html
import { html } from 'z-js-framework'

let name = 'Kizz'
let greetElement = html`<h1>Hello there, ${name}</h1>`
```

Now, as you can see, it's pretty easy: just put your stuff in backticks, but we know the IDE won't highlight that as HTML but as a normal string, so for the best experience and auto completions to make it feel like real HTML, get this extension [Inline HTML](https://marketplace.visualstudio.com/items?itemName=pushqrdx.inline-html) as it will highlight them and give you some auto completions here and there, as we wait to work on our own Z.Js VS Code extension, you can use that extension and it will work just fine with Z.Js. If you want, just don't use it; it's still fine!

4. The last thing you need is... well, guess it... you just need to write some JavaScript code, and that's it.

Otherwise, here is an example of how it works in great detail. These are the official docs for now, hehe, so pay attention. Start by setting up your routes in a main.js or index.js file, whatever your app entry point file is...

> ✅ Routing

``` js
'use strict';

import { render } from 'z-js-framework';
import About from './pages/about.js';
import Home from './pages/home.js';
import Layout from './pages/layout.js';
import NotFound from './pages/notFound.js';

const root = document.querySelector('#root');

const routes = [
  {
    route: '/',
    component: Home,
  },
  {
    route: '/about',
    component: About,
  },
  {
    route: '/*',
    component: NotFound,
  },
];

// render the app
render(root, routes);
```

Then, have an index HTML file that can act as the entry point for your application in the browser. It can look like this: no magic, just a simple HTML file with a script tag pointing to your index.js file with a type module attribute to tell the browser that it's a module that can import other JS files; otherwise, in there, you can do normal stuff like add a style tag if you like, just make sure the there's an element with root id so that's where z will render the app as seen in the first step above.

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Z App</title>
  <script src="./index.js" defer type="module"></script>
  <link rel="stylesheet" href="style.css">
</head>

<body>
  <div id="root">--loading app--</div>
</body>

</html>
```

Now, let's have a look at a Z Js component, a simple re-usable button component. It can be found in `example/components/button.js` and here is how it's implemented.

> ✅ Components & Styling

```js
import { css, html } from 'z-js-framework';

export const Button = (children, setCount) => {
  const buttonClass = css`
    background-color: tomato;
    color: #fff;
    display: flex;
    gap: 1rem;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    transition: background-color 0.2s;
    margin-top: 1rem;

    &:hover {
      background-color: crimson;
    }
  `;

  const clickButton = () => {
    console.log('button clicked!');
    setCount((currentCount) => currentCount + 1);
  };

  return html`<button class="${buttonClass}" onClick="${clickButton}">
    ${children}
  </button>`;
};

```

Ohh, so you are wondering what's happening? Don't freak, let me explain:

1. First, we import `css` and `html` from z.js, `css` is a function that takes a CSS template literal and returns a class name that you can use on your class attribute. It automatically creates those styles you define on that class with css tag function and makes sure they are not recreated if they have not changed. It's like a builtin css-in-js solution. Just write CSS, z will handle the rest, and then similarly, the `html` is a function that takes a template literal and returns an HTML element out of it. You can use it to render your components, and it returns a normal dom element with all events bound, like onclick event in this example.
2. Since these are just literals, we use `${__expression__}` syntax to interpolate the values; in this case, we are interpolating the value of `children` and `setCount`, which are the props passed to the component, and we are also interpolating the `clickButton` function which is the event handler for the button.
3. We then export our Button function or component for re-usability; that's it.

Congratulations! You have just created your first Z Js component. Now, let's use it on a page. Let's see how a home page with a button looks, along with some other concepts, state and routing.

> ✅ Global State Management

Here is how you would manage complex state in your z applications, create a file say store.js and define and export your global states, these you can then import and use elsewhere in your app components, no need to wrap into any providers or contexts. It's that dead simple as illustrated below.

```js

import { createStore } from 'z-js-framework';

export const countStore = createStore(100);

export const authStore = createStore(false);

// there's a lot you can do, channel.getHistor() for example gets the store state history upto 10 previous versions
const { getValue, setValue, subScribe, channel } = createStore({
  name: 'z-js-framework',
  age: 1,
});

// access store state
console.log(countStore.getValue()); // 100

// run everytime state changes
authStore.subScribe((newState) => {
  console.log('auth changed::', newState);
});
```

then in any compoent you can just do something like...

```js
import {
  html,
  reactive,
  useEffect,
  useStore,
  useRouter,
} from 'z-js-framework';
import { authStore } from '../store.js';

export const AuthComponent = () => {
  const [user, setUser] = useStore(authStore);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.goTo('/');
    }
  }, []);

  let UI = html`
    <div>
      <h1>Hello, ${user.value.userName}</h1>
      <button onclick="${() => setUser(null)}">Logout</button>
    </div>
  `;

  return reactive(UI);
};
```

The only thing to note here is we import useStore and pass in the store, it makes the state available to the component, and we can use it as a normal state variable within the component, and we can of course update it efficiently, all state updaets are granular and only affect their respective components. You can learn more about how state is handled and other interesting things you can do, z is powered by [State Radio](https://www.npmjs.com/package/state-radio) wrapped under hood for more simplicity but all state radio features can be accessed otherwise via the exposed state channels.

otherwise let's see in details how state works then on component level...

> ✅ Component Level State Management

```js
import { css, html, useEffect, useState } from 'z-js-framework';
import { Button } from '../components/button.js';

export default function Home() {
  // handle state
  const [userName, setUserName] = useState('Z js Framework!');
  const [count, setCount] = useState(0);

  function handleInput(event) {
    setUserName(event.target.value);
  }

  // define the markup
  const home = html`<div>
    <h1>${userName.value}</h1>
    <p id="count">count: ${count.value}</p>
    <input
      type="text"
      class="some-class"
      placeholder="just type something..."
      onChange="${handleInput}" />
    <!-- Button Component Usage -->
    <div class="flex-item">${Button('+ Add One', setCount)}</div>
  </div>`;

  // react to state changes
  useEffect(() => {
    console.log('count changed::', count.current());
    let countElement = home.querySelector('#count');
    countElement.innerHTML = `count: ${count.current()}`;
  }, [count]);

  // return the home element
  return home;
}

```

Well, what's happening here? let's try to understand the code above.

1. We again import different stuff from the Z Js framework. These are like hooks or utility functions, each doing a well-defined thing.

2. We import the Button component from the components directory. We can also import other components from other directories; it's just a convention to keep all your components in a components directory. We already saw how such a component is made in previous steps!

3. Since we already know about the HTML and CSS functions, let's look at the new ones here: useState and useEffect. These are much inspired by those of React, but make no mistake—they're quite different in how they work. This is not React!

4. The useState returns the state object and a state setter, e.g. count and setCount. The state object has 2 properties that you can use for now: the value and current. The value is the current value of the state, the current is a function that returns the current value of the state, so you can use it to get the current value of the state, and the setter is a function that takes a new value and updates the state, so you can use it to update the state.

    The state setter is useful when you want to update the state from a function or you want to update the state from a child component. While the current function on the state object is useful when you want to get the current value of the state from a child component or in a series of component and state lifecycle, basically in useffect use state.current() to access state's current value, not just state.value, you will be good.

5. The useEffect is a function that takes a function and an array of state object dependencies. It's called when the dependencies change, and it's called after the component is rendered, so you can use it to react to state changes. You can also use it to fetch data from an API upon some change of state or do any other side effects, but make no mistake. Unlike react, this one only runs when the state changes. It's not run on render of component. It's like an event listener, which only happens when something happens, say, a change of state in this case.

    Otherwise, if an empty state dependencies array is provided, the provided function is run only once and for all on component load. Otherwise, it would rerun this function every time any of the provided state-dependent objects change or never if they never change!

6. Notice how we manually select the parts we want to update on state change from our home element and change its inner HTML. This is real DOM manipulation. The framework doesn't handle this for you as of now. You update what you want to update as you see fit, just like you would in vanilla JS. This is just a bit simplified, but not a replacement.

7. Notice how we use state.current() inside the useEffect. This ensures we get the latest value of this state object; otherwise, state.value would be the old value of the state object, which would be the value of the state object at the time the component was rendered.

8. State and state setters can be passed to child components as you see how setCount is being passed to the Button component.

9. Unlike vanilla js literals here we can define our literals and attach events all at once, it's like jsx + template literals = jsx literals kind of, you see we attach the onChange handler on the input, and we do this by directly referencing the handleInput function, under the hood z js will create a real dom element out of this template and attach this as it should be, given in it's there in the component scope, or passed as an argument.

10. All component or page functions in z return the created element, thats how we are able to reuse them and render them in the dom.

Almost that's all of Z as of now. Just one last thing, though...
This next part is how you link between pages.

> ✅ Navigation

```js
import { html, useRouter } from 'z-js-framework';

export default function Layout() {
  const { getParam } = useRouter();
  let blogId = getParam('blogId');
  console.log('param::', blogId);

  return html`
    <section>
      <h1>Layout Page</h1>
      <p>This is the about page.</p>
      <div>
        <z-link to="/">Home</z-link>
        <z-link to="/about">About</z-link>
        <z-link to="/about" target="content">Layout view</z-link>
        <a href="https://www.google.com">Google</a>
      </div>
      <main id="content">-- dynamic content view --</main>
    </section>
  `;
}

```

So here we are doing a few things. Building on old concepts, we import the useRouter function from Z Js, and we use it to get the getParam function; this function takes a key as an argument and returns the value of the key in the URL. In this case, we are getting the blogId from the URL, we log it to the console, and then we return the template. We have a div with links to other pages and a main element with id content, and this is where we will render the dynamic content view.

1. We use z-link to create links to other pages. It's a Z Js custom element that works with the router to route between pages. You pass the target attribute to it, which is the ID of the element in which you want to render the content. In this case, we are rendering the content in the main element with id content.
2. Or the to attribute to it, which is the URL you want to route to. In this case we are routing to the about page or home page.
3. Normal a anchor tag links work just fine, they will route to the URL you pass them as normal as they should.

## ♻️ Reactivity

As with many modern frameworks, they are able to automatically re-render the app UI when the state changes, and they do this in kinda different ways, usually using the virtual dom to make sure only minimum changes are applied to the real dom. This is way better and more efficient than just saying element.innerHtml = newHtml, but then z is just real dom. We have no virtual dom, so you either have to do this step manually inside a useEffect or we reached out to some great library [Morphdom](https://github.com/patrick-steele-idem/morphdom) to enable us to do this in a smart way but with real dom, not virtual dom. You don't have to do anything on your end; you just wrap your component literal in a callback in our reactive function like below, and it will automatically reflect changes on state change. So cool, right? Here is an example:

> ✅ Reactivity

```js
import { html, reactive, useState } from 'z-js-framework';

export default function SomeComponent() {
  const [userName, setUserName] = useState('Kizz');

  const SomeElement = () => html`
    <div>
      <h1>UserName Is: ${userName}</h1>
      <input
        type="text"
        value="${userName}"
        onChange="${(e) => setUserName(event.target.value)}" />
    </div>`;

  return reactive(SomeElement);
}
```

Up above, the username will always change to a new value as the user types into the input.

## 🗃️ Hooks And Utilities

-- useSuspense: this hook helps you show a loading ui or fallback and then load the content when it's ready. useful when feteching data from an api or something.
It just takes in the promise or fetch function or any async one and a fallback element, and it will return the resolved value of the promise or the fallback element if the promise rejects. It can take retry, maxRetries and retryDelay as options, and it doesn't retry by default otherwise it retries 3 times by default when retry option is set to true.

> ✅ Hooks

```js
import { html, useSuspense } from 'z-js-framework';

const fallback = html`<p>Loading... chill for now!</p>`;

export default function Demo() {
  const demoElement = html`
    <div>
      <h1>Example of a suspension...</h1>
      ${useSuspense(fetchContent, fallback)}
    </div>
  `;

  return demoElement;
}

function fetchContent() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        const content = html`<p>This is the loaded content.</p>`;
        resolve(content);
      } else {
        reject('Failed to load content!!!');
      }
    }, 2000);
  });
}
```

## 🌲 Rendering Lists

Z Js has a few helpers to help you render lists or array of items. This is very useful when you working with a list of items or iterable data and you rendering them in a restrictive semantic element say a table or that you want to maintain the structure of the elements in dom exactly, i.e if elements a to be exactly direct children of the parent element, most frameworks provide helpers here such as the v-for in vue, etc. Here is how you can go about it in z.

> ✅ Rendering Lists

```js
import { html, useState, List, reactive } from 'z-js-framework';
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
   let UI = () => html`
        <table class="todos-table">
          <tbody ref="todoRef">
            ${List({
              ref: 'todoRef',
              items: todos,
              render: ({ item: props }) => TodoItem({...props}),
            })}
          </tbody>
        </table>`
   return reactive(UI);
}
```

As you can see, the `List` utility takes in a few options, the ref is the ref of the parent element, items is the array of items to render, and render is the function that renders each item, it should return a single element and takes in each item in the items array as item which you can even alias as props.

That shows loading, and then bingo shows the content.

## 😇 You want more?

Come on, more stuff is coming, and if you reach all the way here, you are really a samurai now. You can start using Z Js to build your next app. See the examples folder for some examples, as we prepare more docs later, but that's it for now, that's Z Js framework, let's get building!

More documentation and examples of common use cases will be coming soon. Help contribute!

## 👾 What Next?

Well, this is still work in progress. I am working on it in my little free time, so if you have other ideas or what, reach out to me at [hssnkizz@gmail.com](hssnkizz@gmail.com) or read [Contribution Guide](./CONTRIBUTION.MD) to get started on how things work and the whole project plan and roadmap!
