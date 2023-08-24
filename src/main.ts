import { createApp } from 'vue';
import { createPinia } from 'pinia';

// @ts-ignore
import App from './App.vue';
import router from './router';

if (import.meta.env.MODE === 'production') {
  console.assert = () => {};
  console.debug = () => {};
  console.error = () => {};
  console.log = () => {};
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
