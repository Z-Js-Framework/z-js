import { css, html } from 'z-js-framework';

export const FullButton = (text, onClick) => {
  let buttonStyle = css`
    width: 100%;
    color: red;
  `;

  return html`
    <button class="${buttonStyle}" onClick="${() => onClick()}">${text}</button>
  `;
};
