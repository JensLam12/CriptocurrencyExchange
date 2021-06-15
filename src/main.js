import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/css/tailwind.css'
import Router from '@/router'
import VueChartkick from 'vue-chartkick'
import 'chartkick/chart.js'

createApp(App)
    .use(Router)
    .use(VueChartkick)
    .mount('#app')
