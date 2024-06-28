import { css, html, useEffect, useState } from '../../index.js';

export default function About() {
  return html`
    <h1>About Page</h1>
    <p>This is the about page.</p>
    <div>
      <a href="/home">Home</a>
      <a href="/about">About</a>
      <a href="/layout">Layout</a>
      <a href="https://www.google.com">Google</a>
    </div>
  `;
}
