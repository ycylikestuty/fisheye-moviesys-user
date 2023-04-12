import Vue from 'vue'
import App from './App.vue'
import router from './router'
import modal from "./plugins/modal";
import Pagination from "@/components/Pagination";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from './axios'
import store from './store'
import qs from 'qs'

Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.config.productionTip = false
Vue.prototype.modal = modal
Vue.use(ElementUI)
Vue.component('Pagination', Pagination)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');