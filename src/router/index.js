import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'
import FrontendLayout from '@/components/FrontendLayout.vue'

//路由配置
//路由数组，每一个对象代表着一条路由规则
const BackendRouters = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart'
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineRound'
        }
      },
      {
        path: 'consultation',
        component: () => import('@/views/consultation.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      },
      {
        path: 'emotional',
        component: () => import('@/views/emotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User'
        }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: () => import('@/views/login.vue'),
        // 懒加载路由，当访问该路由时才会加载组件，避免初始加载时的性能问题
        // 而使用import导入的方式是会立即加载组件，导致初始加载时的性能问题
        meta: {
          title: '登录'
        }
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        // 懒加载路由，当访问该路由时才会加载组件，避免初始加载时的性能问题
        // 而使用import导入的方式是会立即加载组件，导致初始加载时的性能问题
        meta: {
          title: '注册'
        }
      }
    ]
  }
]
const FrontendRouters = [
  {
    path: '/',
    component: FrontendLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/frontendHome.vue')
      },
      {
        path: '/frontendHome',
        component: () => import('@/views/frontendHome.vue')
      },
      {
        path: '/frontendConsulations',
        component: () => import('@/views/frontendConsulations.vue')
      },
      {
        path: '/frontendEmotionDiary',
        component: () => import('@/views/frontendEmotionDiary.vue')
      },
      {
        path: '/frontendKnowledge',
        component: () => import('@/views/frontendKnowledge.vue')
      },
      {
        path: 'frontendKnowledgeArticle/article/:id',
        component: () => import('@/views/articleDetail.vue'),
        props: true
      }
    ]
  },
  //兜底路由，也就是当访问的路径不存在时跳转到这里
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/NotFound.vue')
  }
]
//路由表是配置，路由实例是引擎
const router = createRouter({
  history: createWebHistory(),
  routes: [...BackendRouters, ...FrontendRouters]
})
// 路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    const userinfo = JSON.parse(localStorage.getItem('userInfo'))
    const userType = userinfo.userType
    //如果是后台用户
    if (userinfo.userType == 2) {
      if (to.path.startsWith('/back')) {
        next()
      } else {
        next('/back/dashboard')
      }
    } else if (userinfo.userType == 1) {
      //对于用户端，只能够访问前台的路由
      if (to.path.startsWith('/back') || to.path.startsWith('/auth')) {
        next('/')
      } else {
        //next是导航到正常的路径，也就是不包含back和auth的路径
        next()
      }
    }
  } else {
    if (to.path.startsWith('/back')) {
      //如果是访问后台页面，跳转为登录页面
      next('/auth/login')
    } else {
      next()
    }
  }
})

//导出
export default router
