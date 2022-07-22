import { createRouter, createWebHistory } from 'vue-router'

import useGlobalState from './app/global-state'

import Dashboard from "./views/Dashboard.vue"
import Settings from "./views/Settings.vue"
import NotFound from "./views/NotFound.vue"

const routes = [
  { path: "/dashboard", alias: "/", name: "dashboard", component: Dashboard },
  { path: "/settings", name: "settings", component: Settings },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },

]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  setRoutingDirection(from, to)
  next()
})

export default router

function setRoutingDirection({ name: origin }, { name: destination }) {
  let direction

  switch (origin) {
    case "dashboard": {
      destinationIs("settings") && setDirection("forwards")
      break
    }
  }

  switch (destination) {
    case "dashboard": {
      originIs("settings") && setDirection("backwards")
      break
    }
  }

  const { routingDirection } = useGlobalState()
  routingDirection.value = direction

  function setDirection(dir) { direction = dir }
  function destinationIs(dest) { return destination === dest }
  function originIs(orig) { return origin === orig }
}
