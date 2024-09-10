import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sign-in',
      name: 'sign-in',
      component: () => import('../views/SignInPage.vue')
    },
    {
      path: '/',
      name: 'home-page',
      component: () => import('../views/HomePage.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterPage.vue')
    },
   
    {
      path: '/feed',
      name: 'feed',
      component: () => import('../views/FeedPage.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/phone-auth',
      name: 'phone-auth',
      component: () => import('../views/PhoneAuth.vue'),
    }
  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })  
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next()
    } else {
      alert("You don't have access")
      next('/sign-in') // Redirect to sign-in if not authenticated
    }
  } else {
    next()
  }
})

export default router
