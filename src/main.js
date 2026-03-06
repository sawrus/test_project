import { createApp } from 'https://unpkg.com/vue@3.5.13/dist/vue.esm-browser.js'
import {
  createRouter,
  createWebHashHistory
} from 'https://unpkg.com/vue-router@4.5.0/dist/vue-router.esm-browser.js'
import App from './App.js'
import SnakePage from './components/SnakePage.js'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/snake' },
    { path: '/snake', component: SnakePage }
  ]
})

createApp(App).use(router).mount('#app')
