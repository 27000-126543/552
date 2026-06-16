<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
      <div class="logo">
        <div class="logo-icon">
          <el-icon :size="28"><DataLine /></el-icon>
        </div>
        <span v-if="!isCollapse" class="logo-text">供应链平台</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        router
        background-color="#001529"
        text-color="#b7c0cc"
        active-text-color="#fff"
        class="sidebar-menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>数据看板</template>
        </el-menu-item>
        
        <el-sub-menu index="suppliers">
          <template #title>
            <el-icon><OfficeBuilding /></el-icon>
            <span>供应商管理</span>
          </template>
          <el-menu-item index="/suppliers">供应商列表</el-menu-item>
          <el-menu-item index="/suppliers/recommend">智能推荐</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="purchase-group">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>采购审批</span>
          </template>
          <el-menu-item index="/purchase">采购申请</el-menu-item>
          <el-menu-item index="/approval">审批流程</el-menu-item>
        </el-sub-menu>
        
        <el-menu-item index="/inventory">
          <el-icon><Box /></el-icon>
          <template #title>库存调拨</template>
        </el-menu-item>
        
        <el-menu-item index="/pricing">
          <el-icon><PriceTag /></el-icon>
          <template #title>定价策略</template>
        </el-menu-item>
        
        <el-menu-item index="/warnings">
          <el-icon><Warning /></el-icon>
          <template #title>异常预警</template>
          <el-badge :value="5" class="menu-badge" />
        </el-menu-item>
        
        <el-sub-menu index="system-group">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </template>
          <el-menu-item index="/system">权限管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-tooltip content="搜索">
            <el-icon class="header-icon"><Search /></el-icon>
          </el-tooltip>
          <el-tooltip content="消息通知">
            <el-badge :value="3" class="header-badge">
              <el-icon class="header-icon"><Bell /></el-icon>
            </el-badge>
          </el-tooltip>
          <el-tooltip content="帮助">
            <el-icon class="header-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
          
          <el-dropdown @command="handleCommand" class="user-dropdown">
            <div class="user-info">
              <el-avatar size="small" :src="state.user.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
              <span class="username">{{ username || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="settings">账号设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from '../store'

const route = useRoute()
const router = useRouter()
const { state, actions } = useStore()

const isCollapse = ref(false)

const activeMenu = computed(() => route.path)
const currentPageTitle = computed(() => route.meta.title || '')
const username = computed(() => state.user.username)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleCommand = async (command) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      actions.logout()
      ElMessage.success('已退出登录')
      router.replace('/login')
    } catch {
      // 用户取消
    }
  }
}
</script>

<style scoped>
.layout-container {
  height: 100%;
}

.sidebar {
  background: #001529;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #002140;
  padding: 0 16px;
  overflow: hidden;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.logo-text {
  margin-left: 12px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar-menu {
  border-right: none;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
}

.menu-badge {
  margin-left: 8px;
}

.header {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  transition: color 0.3s;
}

.collapse-btn:hover {
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  font-size: 18px;
  color: #606266;
  cursor: pointer;
  transition: color 0.3s;
}

.header-icon:hover {
  color: #409eff;
}

.header-badge {
  display: flex;
  align-items: center;
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  color: #606266;
  font-size: 14px;
}

.main-content {
  background: #f0f2f5;
  padding: 0;
  overflow-y: auto;
}
</style>
