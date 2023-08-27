import { Loader } from './components/loader.js';
import ZPage from './z/z.js';

const homePage = document.querySelector('#homePage');

// set the shell or main element eg. body
const Z = new ZPage(homePage);

// Z.replace(myAppId, Header({ username: 'Kizz' }));
// Z.append('after', myAppId, Footer);

// show a splash screen loader for 2 milli seconds
Z.showLoader(Loader, 2000);

// optional, logs whatever Z rendered in broswer to the console
Z.log();
