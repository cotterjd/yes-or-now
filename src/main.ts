import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'

createApp(App).use(store).use(PrimeVue).mount('#app')
