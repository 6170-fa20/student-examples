import Vue from 'vue'
import VueCookie from 'vue-cookie'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import { store } from './store/store'

Vue.use(VueCookie);

export const eventBus = new Vue();

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
