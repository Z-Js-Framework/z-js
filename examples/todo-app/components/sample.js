import {
  html,
  reactive,
  useEffect,
  useStore,
  useRouter,
} from 'z-js-framework/index.js';
import { authStore } from '../store.js';

export const AuthComponent = () => {
  const [user, setUser] = useStore(authStore);

  const router = useRouter();

  useEffect(() => {
    if (!user.value) {
      router.goTo('/login');
    }
  }, []);

  let UI = html`
    <div>
      <h1>Hello, ${user.value.userName}</h1>
      <button onclick="${() => setUser(null)}">Logout</button>
    </div>
  `;

  return reactive(UI);
};
