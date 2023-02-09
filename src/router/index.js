import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  // 商品管理相关路由
  {
    path: '/product',
    component: Layout,  //首先显示一级路由
    name: 'Product',
    meta: { title: '商品管理', icon: 'el-icon-s-shop' },
    children: [
      {
        path: 'trademark/list',
        component: () => import('@/views/product/trademark'),
        name: 'Trademark',
        meta: { title: '品牌管理' }
      },
      {
        path: 'attr/list',
        component: () => import('@/views/product/attr'),
        name: 'Attr',
        meta: { title: '属性管理' }
      },
      {
        path: 'sku/list',
        component: () => import('@/views/product/sku'),
        name: 'Sku',
        meta: { title: 'SKU管理' }
      },
      {
        path: 'spu/list',
        component: () => import('@/views/product/spu'),
        name: 'Spu',
        meta: { title: 'SPU管理' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
