import { Header } from './components/header.js';
import { Footer } from './components/footer.js';
import ZPage from './z/z.js';

const homePage = document.querySelector('#homePage');

// set the shell or main element eg. body
const Z = new ZPage(homePage);

let myAppId = 'homePage';

// start rendering stuff, we have just a loader in our html, so we delay here for 2 minute and then do stuff
setTimeout(() => {
  Z.replace(myAppId, Header({ username: 'kizz' }));
  Z.append('after', myAppId, Footer);
  Z.log();
}, 2000);
