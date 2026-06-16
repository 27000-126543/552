<template>
  <div class="approval-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="page-title">审批流程</h2>
        <p class="page-desc">自定义审批流配置，支持自动路由与加签规则</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">新建流程</el-button>
        <el-button :icon="Setting">流程设置</el-button>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :span="6">
        <div class="side-card">
          <div class="card-header">
            <span class="card-title">流程分类</span>
          </div>
          <el-menu :default-active="activeCategory" class="category-menu" @select="handleCategorySelect">
            <el-menu-item index="purchase">
              <el-icon><Document /></el-icon>
              <span>采购审批</span>
              <el-badge :value="8" class="menu-badge" />
            </el-menu-item>
            <el-menu-item index="contract">
              <el-icon><Tickets /></el-icon>
              <span>合同审批</span>
              <el-badge :value="3" class="menu-badge" />
            </el-menu-item>
            <el-menu-item index="payment">
              <el-icon><Wallet /></el-icon>
              <span>付款结算</span>
              <el-badge :value="5" class="menu-badge" />
            </el-menu-item>
            <el-menu-item index="price">
              <el-icon><PriceTag /></el-icon>
              <span>调价审批</span>
              <el-badge :value="2" class="menu-badge" />
            </el-menu-item>
            <el-menu-item index="supplier">
              <el-icon><OfficeBuilding /></el-icon>
              <span>供应商准入</span>
              <el-badge :value="4" class="menu-badge" />
            </el-menu-item>
          </el-menu>
        </div>

        <div class="side-card">
          <div class="card-header">
            <span class="card-title">我的待办</span>
            <el-button type="primary" link size="small">全部</el-button>
          </div>
          <div class="todo-list">
            <div v-for="item in todoList" :key="item.id" class="todo-item">
              <div class="todo-title">{{ item.title }}</div>
              <div class="todo-meta">
                <span class="todo-type">{{ item.type }}</span>
                <span class="todo-time">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="18">
        <div class="main-card">
          <div class="card-header">
            <span class="card-title">采购审批流程 - 流程图</span>
            <div class="card-actions">
              <el-button size="small" :icon="Edit">编辑流程</el-button>
              <el-button size="small" type="primary" :icon="View">预览</el-button>
            </div>
          </div>

          <div class="flow-chart">
            <div class="flow-node flow-start">
              <div class="node-icon"><el-icon><MagicStick /></el-icon></div>
              <div class="node-label">开始</div>
            </div>
            <div class="flow-line">↓</div>
            <div class="flow-node">
              <div class="node-icon node-blue"><el-icon><User /></el-icon></div>
              <div class="node-label">申请人提交</div>
              <div class="node-desc">采购申请单</div>
            </div>
            <div class="flow-line">↓</div>
            <div class="flow-node">
              <div class="node-icon node-orange"><el-icon><UserFilled /></el-icon></div>
              <div class="node-label">部门经理审批</div>
              <div class="node-desc">一级审批</div>
              <div class="node-tag">自动路由</div>
            </div>
            <div class="flow-line">↓</div>
            <div class="flow-condition">
              <div class="condition-text">金额 > 10万？</div>
              <div class="condition-branches">
                <div class="branch branch-yes">
                  <span>是</span>
                  <div class="branch-node">
                    <div class="node-icon node-purple"><el-icon><UserFilled /></el-icon></div>
                    <div class="node-label">财务总监审批</div>
                    <div class="node-tag">加签</div>
                  </div>
                </div>
                <div class="branch branch-no">
                  <span>否</span>
                  <div class="branch-node">
                    <div class="node-icon node-green"><el-icon><CircleCheck /></el-icon></div>
                    <div class="node-label">直接通过</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flow-line">↓</div>
            <div class="flow-node">
              <div class="node-icon node-green"><el-icon><CircleCheck /></el-icon></div>
              <div class="node-label">审批通过</div>
            </div>
            <div class="flow-line">↓</div>
            <div class="flow-node flow-end">
              <div class="node-icon"><el-icon><Finish /></el-icon></div>
              <div class="node-label">结束</div>
            </div>
          </div>
        </div>

        <div class="main-card">
          <div class="card-header">
            <span class="card-title">审批规则配置</span>
          </div>
          <el-table :data="ruleList" style="width: 100%">
            <el-table-column prop="ruleName" label="规则名称" width="200" />
            <el-table-column prop="ruleType" label="规则类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getRuleType(row.ruleType)" size="small">{{ row.ruleType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="condition" label="触发条件" min-width="250" />
            <el-table-column prop="action" label="执行动作" width="150" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-switch v-model="row.enabled" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default>
                <el-button type="primary" link size="small">编辑</el-button>
                <el-button type="danger" link size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Setting, Document, Tickets, Wallet, PriceTag, OfficeBuilding, Edit, View, MagicStick, User, UserFilled, CircleCheck, Finish } from '@element-plus/icons-vue'

const activeCategory = ref('purchase')

const todoList = ref([
  { id: 1, title: '智能手机批量采购申请', type: '采购审批', time: '10分钟前' },
  { id: 2, title: '2026年度供应商框架合同', type: '合同审批', time: '1小时前' },
  { id: 3, title: '6月供应商货款结算', type: '付款结算', time: '2小时前' },
  { id: 4, title: '电子产品价格调整申请', type: '调价审批', time: '今天上午' },
  { id: 5, title: '新供应商准入审核', type: '供应商准入', time: '昨天' }
])

const ruleList = ref([
  { ruleName: '大额采购自动加签', ruleType: '金额规则', condition: '采购金额 > 10万元', action: '自动加签财务总监', enabled: true },
  { ruleName: '紧急申请优先处理', ruleType: '优先级规则', condition: '紧急程度 = 紧急', action: '优先审批通道', enabled: true },
  { ruleName: '部门经理自动路由', ruleType: '路由规则', condition: '按申请人部门', action: '自动路由至部门经理', enabled: true },
  { ruleName: '超期自动提醒', ruleType: '超时规则', condition: '审批超时 > 24小时', action: '自动发送提醒', enabled: true },
  { ruleName: '供应商准入三审制', ruleType: '审批规则', condition: '新供应商准入', action: '三级审批流程', enabled: false }
])

const handleCategorySelect = (key) => {
  activeCategory.value = key
}

const getRuleType = (type) => {
  const map = { '金额规则': 'primary', '优先级规则': 'warning', '路由规则': 'success', '超时规则': 'danger', '审批规则': 'info' }
  return map[type] || 'info'
}
</script>

<style scoped>
.approval-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 4px 0;
}

.page-desc {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.side-card, .main-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.category-menu {
  border-right: none;
}

.menu-badge {
  margin-left: auto;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.todo-item:hover {
  background: #ecf5ff;
}

.todo-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 6px;
  font-weight: 500;
}

.todo-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.todo-type {
  color: #409eff;
}

.flow-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  background: #fafafa;
  border-radius: 8px;
}

.flow-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 140px;
  position: relative;
}

.flow-start, .flow-end {
  background: linear-gradient(135deg, #67c23a 0%, #52c41a 100%);
  color: #fff;
}

.flow-start .node-label, .flow-end .node-label {
  color: #fff;
}

.node-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #909399;
  margin-bottom: 8px;
}

.node-blue {
  background: #ecf5ff;
  color: #409eff;
}

.node-green {
  background: #f0f9eb;
  color: #67c23a;
}

.node-orange {
  background: #fdf6ec;
  color: #e6a23c;
}

.node-purple {
  background: #f3e8ff;
  color: #9b59b6;
}

.node-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.node-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.node-tag {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #409eff;
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
}

.flow-line {
  font-size: 20px;
  color: #dcdfe6;
  margin: 4px 0;
}

.flow-condition {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px 0;
}

.condition-text {
  padding: 12px 24px;
  background: #fdf6ec;
  color: #e6a23c;
  border-radius: 6px;
  font-weight: 500;
  margin-bottom: 16px;
}

.condition-branches {
  display: flex;
  gap: 60px;
}

.branch {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.branch span {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.branch-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.branch-node .node-icon {
  width: 36px;
  height: 36px;
  font-size: 18px;
}

.branch-node .node-label {
  font-size: 12px;
}

.branch-node .node-tag {
  top: -6px;
  right: -6px;
  font-size: 10px;
  padding: 1px 4px;
}
</style>
