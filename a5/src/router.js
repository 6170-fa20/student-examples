import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'account',
      component: () => import('./views/Account.vue')
    },
    {
      path: '/feed',
      name : 'feed',
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/Feed.vue')
    },
    {
      path: '/explore',
      name : 'explore',
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/Explore.vue')
    },
    {
      path: '/profile',
      name : 'profile',
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/requests',
      name : 'requests',
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/Requests.vue')
    },
    {
      path: '/settings',
      name : 'settings',
      meta: {
        requiresAuth: true
      },
      component: () => import('./views/Settings.vue')
    },
    {
      path: '*',
      name : 'error',
      component: () => import('./views/ErrorPage.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth) {
    if (localStorage.getItem('user-auth') === null) {
        next('/');
      } else {
        next();
    }
  } else {
    if (localStorage.getItem('user-auth') !== null) {
      next('/feed')
    } else {
      next();
    }
  }
})

export default router