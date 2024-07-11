import { css, html, useEffect, useState, useRouter } from '../../index.js';

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
