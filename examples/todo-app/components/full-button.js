import { css, html } from '../../../index.js';

export const FullButton = (text, onClick) => {
  let buttonStyle = css`
    width: 100%;
    color: red;
  `;

  return html`
    <button class="${buttonStyle}" onClick="${() => onClick()}">${text}</button>
  `;
};
