import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/pages/app-layout.vue'
import LearnButtons from '@/pages/learn-buttons.vue'
import AppLogin from '@/pages/app-login.vue'
import AppData from '@/pages/app-data.vue'

// 模拟用户认证状态检查函数
const isAuthenticated = () => {
  // 检查是否存在登录令牌或其他认证信息
  return !!localStorage.getItem('authToken')
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: AppLayout,
      children: [
        {
          path: '/buttons',
          name: 'buttons',
          component: LearnButtons,
        },
        {
          path: '/data',
          name: 'data',
          component: AppData,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: AppLogin,
    },
  ],
})

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  // 如果要访问的是登录页
  if (to.name === 'login') {
    // 如果已经登录了，直接跳转到主页
    if (isAuthenticated()) {
      next({ name: 'layout' })
    } else {
      // 否则正常显示登录页
      next()
    }
  } else {
    // 如果访问的是其他页面，检查是否已登录
    if (isAuthenticated()) {
      // 已登录，正常跳转
      next()
    } else {
      // 未登录，重定向到登录页
      next({ name: 'login' })
    }
  }
})

export default router
