import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        redirect: {name: 'Login'}   //将默认路由重定向为login页面
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
            requireAuth: true,
            title: 'chooseKing'
        }
    },
    {
        path: '/home2',
        name: 'Home2',
        component: () => import('../views/home2.vue'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: {
            title: 'login'
        }
    },
    {
        path: 'register',
        name: 'Register',
        component: () => import('../views/Register.vue'),
        meta: {
            title: 'register'
        }
    },
    {
        path: '/error',
        name: 'Error',
        component: () => import('../views/Error.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


export default router
