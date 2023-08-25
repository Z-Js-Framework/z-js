import { Header } from './components/header.js';
import { Footer } from './components/footer.js';
import Z from './z/index.js';

const myApp = document.querySelector('#myApp');

// set the shell or main element eg. body
Z.setParent(myApp);

let myAppId = 'myApp';

// start rendering stuff
window.onload = () => {
  console.log('Am index and then comes Z');
  Z.replace(myAppId, Header({ username: 'kizz' }));
  Z.append('after', myAppId, Footer());
};
