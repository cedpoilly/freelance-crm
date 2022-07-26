import { createRouter, createWebHistory } from 'vue-router'

import useGlobalState from './app/global-state'

import Dashboard from "./views/Dashboard.vue"
import Projects from "./views/Projects.vue"
import Settings from "./views/Settings.vue"
import NotFound from "./views/NotFound.vue"

const routes = [
  { path: "/app/dashboard", alias: "/", name: "dashboard", component: Dashboard },
  { path: "/app/projects/:clientId?", name: "projects", component: Projects },
  { path: "/app/settings", name: "settings", component: Settings },
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
      destinationIs("projects") && setDirection("forwards")
      break
    }

    case "projects": {
      destinationIs("settings") && setDirection("forwards")
      destinationIs("dashboard") && setDirection("backwards")
      break
    }

    case "settings": {
      destinationIs("dashboard") && setDirection("backwards")
      destinationIs("projects") && setDirection("backwards")
      break
    }
  }

  const { routingDirection } = useGlobalState()
  routingDirection.value = direction

  function setDirection(dir) { direction = dir }
  function destinationIs(dest) { return destination === dest }
}
