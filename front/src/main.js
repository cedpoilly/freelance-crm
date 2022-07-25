import { createApp } from 'vue'

import App from './App.vue'

import './index.scss'
import "./route-transitions.css"

import router from "./router"

import clickOutsideConfig from "./directives/click-outside.js"
import useAlert from './app/alert'

const { alert } = useAlert()

const app = createApp(App)

app.config.errorHandler = async (err, _, info) => {
  const message = `This happened:
"${err}." 
In the: "${info}"
  `

  console.trace(message)

  await alert({
    title: "⚠️ OOPS! ⚠️",
    text: message
  })
}

app.use(router)
app.directive(...clickOutsideConfig)



app.mount('#app')
