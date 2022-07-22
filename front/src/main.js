import { createApp } from 'vue'
import './index.scss'
import "./route-transitions.css"

import App from './App.vue'
import router from "./router"

import clickOutsideConfig from "./directives/click-outside.js"

const app = createApp(App)

app.use(router)
app.directive(...clickOutsideConfig)
app.mount('#app')
