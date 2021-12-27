import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import  ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import qs from 'qs'
import  * as echarts from 'echarts'
Vue.config.productionTip = false
// 将echarts挂载到Vue原型对象上
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;

new Vue({
    router,
    store,
  template: '<layout/>',
    render: h => h(App)
}).$mount('#app')


router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    if (to.meta.requireAuth) {
        if (store.state.recorded_username !== '') {
            next();
        } else {
            this.$router.push({path: '/login'}).then(r => (
                console.log(r)
            ))
        }
    } else {
        next();
    }
//     let token = localStorage.getItem("token");
//     if (to.path == "/home") {
//     // 此时必须要有token
//       if (token) {
//       next();
//     } else {
//       Vue.prototype.$toast("请先登录");
//       setTimeout(() => {
//         next("/login");
//       }, 1000);
//     }
//     return;
//   }
//   next();
})
