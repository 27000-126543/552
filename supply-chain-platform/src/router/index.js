import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/Layout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '数据看板', icon: 'DataAnalysis' }
      },
      {
        path: 'suppliers',
        name: 'Suppliers',
        component: () => import('../views/Suppliers.vue'),
        meta: { title: '供应商管理', icon: 'OfficeBuilding' }
      },
      {
        path: 'suppliers/recommend',
        name: 'SupplierRecommend',
        component: () => import('../views/SupplierRecommend.vue'),
        meta: { title: '智能推荐', icon: 'MagicStick' }
      },
      {
        path: 'purchase',
        name: 'Purchase',
        component: () => import('../views/Purchase.vue'),
        meta: { title: '采购审批', icon: 'Document' }
      },
      {
        path: 'approval',
        name: 'Approval',
        component: () => import('../views/Approval.vue'),
        meta: { title: '审批流程', icon: 'Tickets' }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('../views/Inventory.vue'),
        meta: { title: '库存调拨', icon: 'Box' }
      },
      {
        path: 'pricing',
        name: 'Pricing',
        component: () => import('../views/Pricing.vue'),
        meta: { title: '定价策略', icon: 'PriceTag' }
      },
      {
        path: 'warnings',
        name: 'Warnings',
        component: () => import('../views/Warnings.vue'),
        meta: { title: '异常预警', icon: 'Warning' }
      },
      {
        path: 'system',
        name: 'System',
        component: () => import('../views/System.vue'),
        meta: { title: '系统设置', icon: 'Setting' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '供应链协同平台'} - 统一智能供应链协同平台`
  next()
})

export default router
