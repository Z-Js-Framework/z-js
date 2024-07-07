import { $, css, html } from '../../index.js';

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

  return $(
    () => html`<button class="${buttonClass}" onClick="${clickButton}">
      ${children}
    </button>`
  );
};
