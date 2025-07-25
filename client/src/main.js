import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Import router
import { createPinia } from "pinia"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
