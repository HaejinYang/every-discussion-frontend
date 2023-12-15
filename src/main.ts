import { createApp } from 'vue';
import VNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"
import { createPinia } from 'pinia';

// @ts-ignore
import './assets/base.scss';
import App from './App.vue';
import router from './router';

if (import.meta.env.MODE === 'production') {
  console.assert = () => {};
  console.debug = () => {};
  console.error = () => {};
  console.log = () => {};
}

const app = createApp(App);

app.use(VNetworkGraph);
app.use(createPinia());
app.use(router);

app.mount('#app');
