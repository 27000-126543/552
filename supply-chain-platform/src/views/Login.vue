<template>
  <div class="login-container">
    <div class="login-left">
      <div class="login-brand">
        <div class="brand-logo">
          <el-icon size="48"><DataAnalysis /></el-icon>
        </div>
        <h1 class="brand-title">统一智能供应链协同平台</h1>
        <p class="brand-desc">面向大型零售集团的全链路供应链数字化解决方案</p>
      </div>
      
      <div class="feature-list">
        <div class="feature-item">
          <el-icon><OfficeBuilding /></el-icon>
          <span>多渠道供应商接入 · API / EDI / 邮件自动解析</span>
        </div>
        <div class="feature-item">
          <el-icon><MagicStick /></el-icon>
          <span>智能供应商推荐 · 基于历史交易与质量评分</span>
        </div>
        <div class="feature-item">
          <el-icon><DataLine /></el-icon>
          <span>实时大数据看板 · 库存/价格/物流全维度分析</span>
        </div>
        <div class="feature-item">
          <el-icon><Tickets /></el-icon>
          <span>多级审批流 · 采购/合同/付款全流程管控</span>
        </div>
      </div>
    </div>
    
    <div class="login-right">
      <div class="login-box">
        <h2 class="login-title">欢迎登录</h2>
        <p class="login-subtitle">请输入您的账号信息</p>
        
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入账号（如 admin）"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码（如 123456）"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item>
            <div class="login-options">
              <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
              <a href="#" class="forgot-password" @click.prevent="showTip">忘记密码？</a>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="login-btn"
              @click="handleLogin"
              :loading="loading"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>
        
        <el-alert
          title="测试账号：admin / 123456"
          type="info"
          :closable="false"
          show-icon
          style="margin-top: 16px"
        />
        
        <div class="login-footer">
          <span>© 2026 智能供应链协同平台 版权所有</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useStore } from '../store'

const router = useRouter()
const { actions } = useStore()

const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  remember: true
})

const loginRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 2, max: 20, message: '账号长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, max: 20, message: '密码长度在 4 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = () => {
  if (!loginFormRef.value) return
  loginFormRef.value.validate((valid) => {
    if (!valid) {
      ElMessage.warning('请检查账号密码输入是否正确')
      return
    }
    loading.value = true
    setTimeout(() => {
      actions.login(loginForm.username, loginForm.password)
      loading.value = false
      ElMessage.success(`欢迎回来，${loginForm.username}！`)
      router.replace('/dashboard')
    }, 800)
  })
}

const showTip = () => {
  ElMessage.info('请联系系统管理员重置密码')
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  top: -100px;
  right: -100px;
}

.login-left::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  bottom: -50px;
  left: -100px;
}

.login-brand {
  position: relative;
  z-index: 1;
}

.brand-logo {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 24px;
}

.brand-title {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.brand-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.feature-list {
  margin-top: 60px;
  position: relative;
  z-index: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 15px;
  margin-bottom: 20px;
}

.feature-item .el-icon {
  font-size: 20px;
  color: #fff;
}

.login-right {
  width: 480px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 380px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #909399;
  margin-bottom: 32px;
}

.login-form {
  margin-top: 24px;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.forgot-password {
  font-size: 14px;
  color: #409eff;
  text-decoration: none;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  margin-top: 8px;
}

.login-footer {
  margin-top: 32px;
  text-align: center;
  color: #c0c4cc;
  font-size: 12px;
}
</style>
