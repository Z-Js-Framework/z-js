# Z.Js
A simple almost html based js framework!

## Why?

We needed something very simple but can make a plain html, css and js project have a modern like developer experience and be scalable and yet has the power of single page applications (SPAs) or not to say, react applications. Nothing fancy, just the bare minimum, we capitalize on intuitve architecture, native web platform features and principles instead of a bunch of libs, meta frameworks etc that newer devs are even not familiar with usually. Here if know html, and some js, you can still make a great app, with only that you know!


## Roadmap If You Like To Contribute

- ✅ Define framework usage and semantic basics
- ✅ Create a custom state management mechanism
- ✅ Create a simple way to persist state -- used local storage
- ✅ Create a custom events like system for reactive UI updates
- ✅ Create main Z function to bring everything together
- ✅ Create basic UI manipulating methods
- 🔳 Share state across different html pages
- 🔳 Handle multi pages and routing -- just enhance normal behaviors
- 🔳 Add in page transition and component transition animations
- 🔳 Add builtin data fetching mechanism
- 🔳 Enhance documentation
- 🔳 Introduce build tools, bundlers and Js doc and ship this to npm!

what else?

## How it works?

Most of this is to be provided soon in official documentation but in a nutshell architecture wise this how z js works, each page is separate and hence multi page architecture (MPA) by default but, then each page in it's own workings behaves like an SPA, as a single page application and that means you have a main page layout or parent component that loads other components, components in this case are just hmtl files you create in your project root directory under components directory and bingo we get them and render them for you whenever needed, we basically fetch these components on demand but all client side, it's like server side rendering (SSR) but client side which means it almost has zero latency compared to server side frameworks like htmx and yet provides the advantages of loading small javascript and payload on initial page load, since we only fetch the immediately rendered items and just fetch the rest on demand with zero latency since there already on client, at least there initially just got as static assets and not evaluated right away. Then we have a reactive mechanism in place to handle state and reactivity, the UI can automatically react to state changes, and so forth. It's that in a nutshell, just create `index.hml`, link a `index.js` file as a script with type module (important!) and then bring in `z js` then create a components directory and starting creating compoents in there say `sidebar.html` and you good to go, here is an example of a component:

``` html
<template id="anything" class="my-component">
  <p>are you freakin serious? this is an html component!!!</p>
</template>
```

it is important that it's in components directory and everything is wrapped inside a template tag, the rest you leave it to z js.

More documentation and example of common use cases will be coming soon, help contribute!

## What Next?

Well this is still work in progress, am working on it with guidance from my mentor, so if you have other ideas or what, reach out to me at [hssnkizz@gmail.com](hssnkizz@gmail.com) or read [Contribution Guide](./CONTRIBUTION.MD) to get started on how things work and the whole project plan and roadmap!