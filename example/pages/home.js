import { css, html, useEffect, useState } from '../../index.js';
import { Button } from '../components/button.js';

export default function Home() {
  const [userName, setUserName] = useState('Z js Framework!');
  const [count, setCount] = useState(0);

  function handleInput(event) {
    setUserName(event.target.value);
  }

  useEffect(() => {
    console.log('userName changed::', userName.current());
  }, [userName]);

  const styledInput = css`
    width: 50%;
    border: 1px solid #ccc;
    padding: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    color: tomato;
  `;

  const home = html`<div>
    <h1>${userName.value}</h1>
    <p id="count">count: ${count.value}</p>
    <input
      type="text"
      class="${styledInput}"
      placeholder="just type something..."
      onInput="${handleInput}" />
    <!-- Button Component Usage -->
    <div class="flex-item">${Button('+ Add One', setCount)}</div>
  </div>`;

  useEffect(() => {
    console.log('count changed::', count.current());
    let countElement = home.querySelector('#count');
    countElement.innerHTML = `count: ${count.current()}`;
  }, [count]);

  return home;
}
