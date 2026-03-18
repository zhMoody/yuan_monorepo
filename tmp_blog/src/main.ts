import loadGif from '@/assets/load.gif';
import '@/router/permission';
import 'virtual:svg-icons-register';
import {createApp} from 'vue';
import lazyPlugin from 'vue3-lazy';
import App from './App.vue';
import {components, plugins} from './components';
import router from './router';
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// css
import '@/styles/fonts/iconfont.css'
import '@/styles/fonts/iconfont.js'
import 'vfonts/Lato.css'
import 'md-editor-v3/lib/style.css';
// 等宽字体
import 'vfonts/FiraCode.css'
import 'animate.css';
import './styles/reset.less';

const app = createApp(App);
app.use(pinia)
app.use(router);
app.use(lazyPlugin, {
  loading: loadGif,
  error: loadGif
})
// @ts-ignore
app.mount('#app');

// 加载全局组件
components.forEach((component) => {
  app.component(component.name, component);
});

// 加载全局插件
plugins.forEach((plugin) => {
  app.use(plugin);
});
