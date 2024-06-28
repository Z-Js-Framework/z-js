import { css, html, useEffect, useState } from '../../index.js';

export default function Layout() {
  return html`
    <section>
      <h1>Layout Page</h1>
      <p>This is the about page.</p>
      <div>
        <a href="/home">Home</a>
        <a href="/about">About</a>
        <a href="/layout" target="content">Layout View</a>
        <a href="https://www.google.com">Google</a>
      </div>
      <main id="content">-- dynamic content view --</main>
    </section>
  `;
}
