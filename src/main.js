// import { createApp } from 'vue'
// import './style.css'
// import App from './App.vue'

// createApp(App).mount('#app')

import { createApp } from "vue"
import App from "./App.vue"

import PrimeVue from "primevue/config"
import ToastService from "primevue/toastservice"

import "primeicons/primeicons.css"

// PrimeVue v4 theme (recommended)
import Aura from "@primevue/themes/aura"

import "./style.css"

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.use(ToastService)

app.mount("#app")