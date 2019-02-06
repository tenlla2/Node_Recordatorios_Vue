import '@babel/polyfill'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import './plugins/bootstrap-vue'
import './plugins/bootstrap-vue'
import './plugins/axios'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from "bootstrap-vue"
import PrettyCheckbox from 'pretty-checkbox-vue';
import VueSocketIO from 'vue-socket.io'
import Chat from 'vue-beautiful-chat'
Vue.use(Chat)
 
Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3000',

}));
Vue.use(PrettyCheckbox);

Vue.config.productionTip = false;
Vue.use(require("vue-moment"));
const $ = require("jquery");
window.$=$;


Vue.use(BootstrapVue);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
