// import { html } from './z/z.js';

const html = (string) => {
  // do something with the string param
  let newString = String(string);
  return console.log(newString);
};

function foo(name) {
  return html`
    <div>
      <p>
        <div className="flex">${name}</div>
      </p>
      <div>how man</div>
    </div>
  `;
}

console.log(foo());
