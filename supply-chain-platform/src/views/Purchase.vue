<template>
  <div class="purchase-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="page-title">采购申请</h2>
        <p class="page-desc">管理采购申请单，支持多级审批流程</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">新建申请</el-button>
        <el-button :icon="Upload">批量导入</el-button>
      </div>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-item stat-primary">
          <div class="stat-icon"><el-icon><Document /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingCount }}</div>
            <div class="stat-label">待审批</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item stat-success">
          <div class="stat-icon"><el-icon><CircleCheck /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ approvedCount }}</div>
            <div class="stat-label">已通过</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item stat-danger">
          <div class="stat-icon"><el-icon><CircleClose /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ rejectedCount }}</div>
            <div class="stat-label">已驳回</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item stat-warning">
          <div class="stat-icon"><el-icon><Clock /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ todoCount }}</div>
            <div class="stat-label">待我处理</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="申请单号">
          <el-input v-model="filterForm.orderNo" placeholder="请输入单号" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="申请状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable style="width: 140px">
            <el-option label="待审批" value="pending" />
            <el-option label="审批中" value="approving" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请品类">
          <el-select v-model="filterForm.category" placeholder="全部" clearable style="width: 140px">
            <el-option label="电子产品" value="电子产品" />
            <el-option label="食品饮料" value="食品饮料" />
            <el-option label="服装鞋帽" value="服装鞋帽" />
            <el-option label="家居用品" value="家居用品" />
            <el-option label="美妆个护" value="美妆个护" />
          </el-select>
        </el-form-item>
        <el-form-item label="紧急程度">
          <el-select v-model="filterForm.urgency" placeholder="全部" clearable style="width: 140px">
            <el-option label="紧急" value="紧急" />
            <el-option label="普通" value="普通" />
            <el-option label="一般" value="一般" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="filterForm.applicant" placeholder="请输入" clearable style="width: 120px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-card">
      <div class="table-header">
        <span class="table-title">采购申请列表</span>
        <div class="table-actions">
          <el-radio-group v-model="activeTab" size="small" @change="handleTabChange">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="my">我的申请</el-radio-button>
            <el-radio-button label="todo">待我审批</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-table :data="pagedList" style="width: 100%" v-loading="loading">
        <el-table-column prop="orderNo" label="申请单号" width="140" />
        <el-table-column prop="title" label="申请标题" min-width="200" />
        <el-table-column prop="category" label="品类" width="100" />
        <el-table-column prop="amount" label="申请金额" width="120" sortable>
          <template #default="{ row }">
            ¥{{ row.amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="applyDate" label="申请日期" width="120" />
        <el-table-column prop="urgency" label="紧急程度" width="100">
          <template #default="{ row }">
            <el-tag :type="getUrgencyType(row.urgency)" size="small">{{ row.urgency }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审批状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="currentApprover" label="当前节点" width="120" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small">详情</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link size="small">审批</el-button>
            <el-button type="info" link size="small">进度</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="currentPage = 1"
        />
      </div>
    </div>

    <el-empty v-if="filteredCount === 0 && !loading" description="没有找到匹配的采购申请" style="padding: 60px 0" />
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Plus, Upload, Document, CircleCheck, CircleClose, Clock, Search, RefreshLeft } from '@element-plus/icons-vue'
import { useStore } from '../store'
import { ElMessage } from 'element-plus'

const { state, actions } = useStore()

const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)

const extraFilter = reactive({
  urgency: '',
  applicant: ''
})

const filterForm = computed({
  get: () => ({ ...state.purchases.filter, ...extraFilter }),
  set: (val) => {
    state.purchases.filter.orderNo = val.orderNo
    state.purchases.filter.status = val.status
    state.purchases.filter.category = val.category
    extraFilter.urgency = val.urgency
    extraFilter.applicant = val.applicant
  }
})

const activeTab = computed({
  get: () => state.purchases.activeTab,
  set: (val) => { state.purchases.activeTab = val }
})

const filteredList = computed(() => {
  const list = state.getters.filteredPurchases.value
  return list.filter(item => {
    if (extraFilter.urgency && item.urgency !== extraFilter.urgency) return false
    if (extraFilter.applicant && !item.applicant.includes(extraFilter.applicant)) return false
    return true
  })
})

const filteredCount = computed(() => filteredList.value.length)
const pendingCount = computed(() => state.purchases.all.filter(p => p.status === 'pending').length)
const approvedCount = computed(() => state.purchases.all.filter(p => p.status === 'approved').length)
const rejectedCount = computed(() => state.purchases.all.filter(p => p.status === 'rejected').length)
const todoCount = computed(() => 8)

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

const handleTabChange = () => {
  currentPage.value = 1
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    currentPage.value = 1
    loading.value = false
    ElMessage.success(`搜索完成，找到 ${filteredCount.value} 条结果`)
  }, 300)
}

const handleReset = () => {
  actions.resetPurchaseFilter()
  extraFilter.urgency = ''
  extraFilter.applicant = ''
  currentPage.value = 1
  ElMessage.info('已重置筛选条件')
}

const getUrgencyType = (urgency) => {
  const map = { '紧急': 'danger', '普通': 'warning', '一般': 'info' }
  return map[urgency] || 'info'
}

const getStatusType = (status) => {
  const map = { pending: 'warning', approving: 'primary', approved: 'success', rejected: 'danger' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { pending: '待审批', approving: '审批中', approved: '已通过', rejected: '已驳回' }
  return map[status] || status
}
</script>

<style scoped>
.purchase-page {
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

.stat-row {
  margin-bottom: 16px;
}

.stat-item {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.stat-primary .stat-icon {
  background: linear-gradient(135deg, #409eff 0%, #1890ff 100%);
}

.stat-success .stat-icon {
  background: linear-gradient(135deg, #67c23a 0%, #52c41a 100%);
}

.stat-danger .stat-icon {
  background: linear-gradient(135deg, #f56c6c 0%, #e74c3c 100%);
}

.stat-warning .stat-icon {
  background: linear-gradient(135deg, #e6a23c 0%, #fa8c16 100%);
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #909399;
}

.filter-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}

.table-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.table-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
