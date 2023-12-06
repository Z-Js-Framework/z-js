import { useState } from './useStateHook.js';
const myElement = document.querySelector('#myElement');
const addCountBtn = document.querySelector('#addCountButton');

// let count = 0;
let [count, setCount] = useState(0);

function rerender() {
  myElement.textContent = `Count: ${count}`;
}

rerender();

addCountBtn.addEventListener('click', () => {
  setCount(count++);
  rerender();
  // count++;
  console.log(`count: ${count}`);
});
