# Z.Js
A simple almost html based js framework!

## Why?

We needed something very simple but can make a plain html, css and js project have a modern like developer experience and be scalable and yet has the power of single page applications (SPAs) or nay to say, react applications. Nothing fancy, just the bare minimum, we capitalize on intuitve architecture, native web platform features and principles instead of a bunch of libs, meta frameworks etc that newer devs are even not familiar with usually. Here if know html, and some js, you can still make a great app, with only that you know!

## How it works?

This is all plain js and html just using js template literals, it's not `react`, we just using module syntax that allows us to import these templates as if components simillar to react, but notice their no build tools or bundlers or whatever yet here, make it work!

``` js
// in compoents/Header.js
export const Header = (props) => {
  let userName = props.user ? props.user : 'John Doe!';

  return `<header>
    <nav>
      <h1>Z.Js</h1>
      <p>User: ${userName}</p>
    </nav>
  </header>`;
};
```

and footer then footer.js looks like:

``` js
// in compoents/Footer.js
export const Footer = (props) => {
  return `<footer>
    <div>
      <p>copy; 2023 Z Js</p>
    </div>
  </footer>`;
};

```

then all handled in `index.js` as below for example:

``` js

import Z from './z';
import { Header } from './components/header';
import { Footer } from './components/footer';

const myApp = document.querySelector('#myApp');

// set the shell or main element eg. body
Z.setParent(myApp);

let myAppId = 'myApp';

// start rendering stuff
window.onload = () => {
  console.log('Am index and then comes Z');
  Z.replace(myAppId, Header({ username: kizz }));
  Z.append('after', myAppId, Footer);
};

```

And the Z class or so is an abstraction to handle all the dynamic renderings of your appliaction, states, and etc.


## What Next?

Well this is still work in progress, am working on it with guidance from my mentor, so if you have other ideas or what, reach out to me at [hssnkizz@gmail.com](hssnkizz@gmail.com) or read [Contribution Guide](./CONTRIBUTION.MD) to get started on how things work and the whole project plan and roadmap!