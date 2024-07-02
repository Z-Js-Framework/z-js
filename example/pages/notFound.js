import { css, html, useEffect, useState } from '../../index.js';

export default function NotFound() {
  return html`
    <section>
      <h1>Not found Page</h1>
      <p>This is the not found page.</p>
      <div>
        <z-link to="/">Home</z-link>
        <z-link to="/about">About</z-link>
        <z-link to="/layout">Layout</z-link>
        <a href="https://www.google.com">Google</a>
      </div>
    </section>
  `;
}
