# Z.Js Framework (v0.0.3)

The literally low overhead js framework!

## Why?

As everyone is running for meta frameworks, server side rendering and whole new stuff out there in js frameworks ecosystem some of us got faded, frontend is hard, why make it harder with bloat and more mental overhead on devs? #DevsBrainsMatter

so, I needed something very simple but can make a plain html, css and js project have a modern like developer experience and be scalable and yet has the power of single page applications (SPAs) or not to say, reactive applications.

Nothing fancy, something to bring that ease feeling when you just go vanilla using the bare minimums but not less powerful or make you repeat your implementations or copy paste code as you do in vanilla projects due to lack of compose-ability and components model, these are things we could solve without becoming complex and we instead capitalize on intuitve architecture, native web platform features and principles instead of a bunch of libs, meta frameworks, build tools, and server sh*t that newer devs are even not familiar with usually.

> So after months of work, and learning, z js framework is the fruit of the efforts to make a simpler build step less js framework that trades all shinny stuff for simplicity and low mental overhead on devs, your tired of having to learn and always play catch up on new framework features just to make a simple app? try Z.Js!

work in progress and calling on all those who feel like modern js frameworks have become so bloated, come contribute and we make this awesome, of course no shinny features allowed, z doesn't plan to included server side rendering, or related stuff, just do it old way, let your backend do it's job, and here we handle frontend side, this is not another one size fits all thing, this is a client side framework inspired by frameworks like react but not like them or another fullstack ferry, humbly it's just meant to be used for frontend and that's all!

## Roadmap And Features If You Like To Contribute

- ✅ Define framework usage and semantic basics
- ✅ Create a custom state management mechanism
- ✅ Create a simple way to persist state -- just use local storage or web storage
- ✅ Create a custom events driven system for reactive UI updates
- ✅ Create main Z binding layer to bring everything together
- ✅ Create UI templating and styling foundations
- ✅ Handle single page application model and routing
- ✅ Handle automatic re-rendering on state change
- ✅ Add useful hooks and utilities for common patterns
- 🔳 Add in builtin form utilities and enhancements
- 🔳 Add in builtin promise utilities
- 🔳 Add in builtin page transition and component transition animations
- 🔳 Add builtin low boilerplate data fetching mechanisms
- 🔳 Improve documentation and provide more examples
- 🔳 Introduce Js doc and ship this for massive adoption!

what else?

## How it works?

This is relatively very simple if you know some js, and how to use template literals, just drop in a z.js script and start building, use any http server cause broswers these days yell at you when you just open an html file directly without at least an http server or https secure preferably. you can for testing sake you can just clone this repo, then navigte into `example-with-vite` folder and run `npm install` and then `npm run dev` and you will have a simple example running on `localhost:5173` that's if you familiar with vite and want an easy start but can also just get the vscode extension [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) and open the `example` directly and just run live sever on the html file there, like, any or those options would do just fine. you don't need a full flenged server for z to work, you just need to serve the html file over http that's all.

> Tip: Literals can look unlovely sometimes, so if you want a bit more better dx I recommend this vscode extension [Inline HTML](https://marketplace.visualstudio.com/items?itemName=pushqrdx.inline-html) as it  will highlight them and give you some auto completions here and there, as we wait to work on our own z.js vscode extension, you can use this extension and it will work just fine with z.js.

otherwise here is an example of how it works, start by seting up your routes...

``` js
'use strict';

import { render } from 'z.js';
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

Then have some index html file which can act as the entry point of your application in the browser, it can look like this, no magic just a simple html file with a script tag pointing to your index.js file with type module attribute to tell broswer that it's module that can import other js files, otherwise in there you can do normal stuff like add a style tag if you like, just make sure the there's an element wit root id so that's where z will render the app as seen in first step above.

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

Now, let's have a look at a z js component, a simple re-usable button component, it can be found in `example/components/button.js` and here is how it's implemented,

```js
import { css, html } from 'z.js';

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

ohh so you wondering what's happening, don't freak, let me explain:

1. first we import `css` and `html` from z.js, `css` is a function that takes a css template literal and returns a class name that you can use on your class attribute, it automatically creates those styles you define on that class with css tag function and makes sure they not recreated if they have not changed, it's like a builtin css-in-js solution, just write css, z will handle the rest, and then simillary the `html` is a function that takes a template literal and returns a html element out of it, you can use it to render your components, it returns a normal dom element with all events binded, like onclick event in this example.
2. since these are just literals, we use `${__expression__}` syntax to interpolate the values, in this case we are interpolating the value of `children` and `setCount` which are the props passed to the component, and we are also interpolating the `clickButton` function which is the event handler for the button.
3. we then export our Button function or component for re-usablity, that's it.

congs, you have just created your first z js component, now let's use it in a page, let's see how a home page with a button looks like, along some other 2 concepts, state and routing.

```js
import { css, html, useEffect, useState } from 'z.js';
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

well what's happening here? let's try to understand the code above,

1. we again import different stuff from z js framework, they're like hooks or utility functions each doing a well defined thing.
2. we import the Button component from components directory, we can also import other components from other directories, it's just a convention to keep all your components in a components directory. We already saw how such component is made in previous steps!
3. since we already know about the html and css functions now, let's look at the new ones here, useState and useEffect, these are much inspired by those of react, but make no mistake they're quite different in how they work, this is not react!
4. the useState returns the state object and a state setter, eg. count and setCount, the state object has 2 properties that you can use for now, the value and cuerent, the value is the current value of the state, the current is a function that returns the current value of the state, so you can use it to get the current value of the state, and the setter is a function that takes a new value and updates the state, so you can use it to update the state. The state setter is useful when you want to update the state from a function, or you want to update the state from a child component. While the current function on the state object is useful when you want to get the current value of the state from a child component or in a series of comonent and state lifecycle, basically in useffects use state.current() to access state's current value not just state.value, you will be good.
5. the useEffect is a function that takes a function and an array of state object dependencies, it's called when the dependencies change, it's called after the component is rendered, so you can use it to react to state changes, you can also use it to fetch data from an api upon some change of state, or do any other side effects, but make no mistake, unlike that of react, this one only runs when the state changes, it's not run on render of component, it's like an event listener which only happens when something happens say change of state in this case, otherwise if the an empty state dependecies array is provided, the provided function is run only once and for all on component load. Otherwise it would rerun this function everytime any of the provided state dependecy objects change or never if they never change!
6. notice how we manually select the parts we want to update on state change from our home element and change it's inner html, real dom manipulation, the framework doesn't handle this for you as of now, you update what you want to update as you see fit, just like you would in a vanilla js, this is just a bit simplified but not a replacement.
7. notcie how we use state.current() inside the useEffect, this ensures we get the latest value of this state object, otherwise state.value would be the old value of the state object, which would be the value of the state object at the time the component was rendered.
8. state and state setters can be passed to child components as you see how setCount is being passed to Button component.
9. unlike vanilla js literals here we can define our literals and attach events all at once, it's like jsx + template literals = jsx literals kind of, you see we attach the onChange handler on the input, and we do this by directly referencing the handleInput function, under the hood z js will create a real dom element out of this template and attach this as it should be, given in it's there in the component scope, or passed as an argument.
10. all component or page functions in z return the created element, thats how we are able to reuse them and render them in the dom.

all most that's all of z as of now, just one last thing though...
this is how you link between pages,

```js
import { html, useRouter } from 'z.js';

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

so here we doing a few things, building on old concepts, we import the useRouter function from z js, we use it to get the getParam function, this function takes a key as an argument and returns the value of the key in the url, in this case we are getting the blogId from the url, we log it to the console, and then we return the template, we have a div with links to other pages, and a main element with id content, this is where we will render the dynamic content view.

1. we use z-link to create links to other pages, it's a z js custom element that works with the router to route between pages, you pass the target attribute to it, which is the id of the element you want to render the content in, in this case we are rendering the content in the main element with id content.
2. or  the to attribute to it, which is the url you want to route to, in this case we are routing to the about page or home page.
3. normal a anchor tag links work just fine, they will route to the url you pass them as normal as they should.

## Reactivity

As with many modern frameworks, they are able to automatically re-render the app UI when state changes, and they do this in kinda different ways, usually using the virtual dom to make sure only minimum changes are applied to the real dom, this is way better and more efficient than just saying element.innerHtml = newHtml, but then z is just real dom, we have no virtual dom, so you either have to do this step manually inside a useEffect or we reached out to some great library [Morphdom](https://github.com/patrick-steele-idem/morphdom) to enable us do this in a smart way but with real dom not virtual dom. You don't have to do anything on your end, you just wrapp your component literal in a callback in our reactive function like below and it will automatically reflect changes on state change, so cool right, here is an example:

```js
import { html, reactive, useState } from 'z.js';

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

Up above, the username will always change to new value as user types into the input.

## Hooks And Utilities

-- useSuspense: this hook helps you show a loading ui or fallback and then load the content when it's ready. useful when feteching data from an api or something.
It just takes in the promise or fetch function or any async one and a fallback element, and it will return the resolved value of the promise or the fallback element if the promise rejects. It can take retry, maxRetries and retryDelay as options, and it doesn't retry by default otherwise it retries 3 times by default when retry option is set to true.

```js
import { html, useSuspense } from 'z.js';

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
That there shows loading and then bingo, shows the content.

## You want more?

come on more stuff coming, and if you reached all the way here, your really a sumurai now, you can start using z js to build your next app, see the examples folder for some examples, as we prepare more docs later, but that's it for now, that's z js framework, let's get building!

More documentation and example of common use cases will be coming soon, help contribute!

## What Next?

Well this is still work in progress, am working on it in my little free time, so if you have other ideas or what, reach out to me at [hssnkizz@gmail.com](hssnkizz@gmail.com) or read [Contribution Guide](./CONTRIBUTION.MD) to get started on how things work and the whole project plan and roadmap!