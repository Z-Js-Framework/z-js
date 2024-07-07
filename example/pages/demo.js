import { html, useSuspense } from '../../index.js';

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
