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
            <div class="stat-value">156</div>
            <div class="stat-label">待审批</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item stat-success">
          <div class="stat-icon"><el-icon><CircleCheck /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">1,258</div>
            <div class="stat-label">已通过</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item stat-danger">
          <div class="stat-icon"><el-icon><CircleClose /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">23</div>
            <div class="stat-label">已驳回</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item stat-warning">
          <div class="stat-icon"><el-icon><Clock /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">8</div>
            <div class="stat-label">待我处理</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="申请单号">
          <el-input v-model="filterForm.orderNo" placeholder="请输入" clearable style="width: 160px" />
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
            <el-option label="电子产品" value="electronics" />
            <el-option label="食品饮料" value="food" />
            <el-option label="服装鞋帽" value="clothing" />
            <el-option label="家居用品" value="home" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期">
          <el-date-picker v-model="filterForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">搜索</el-button>
          <el-button :icon="RefreshLeft">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-card">
      <div class="table-header">
        <span class="table-title">采购申请列表</span>
        <div class="table-actions">
          <el-radio-group v-model="activeTab" size="small">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="my">我的申请</el-radio-button>
            <el-radio-button label="todo">待我审批</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-table :data="purchaseList" style="width: 100%">
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
          :total="156"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Upload, Document, CircleCheck, CircleClose, Clock, Search, RefreshLeft } from '@element-plus/icons-vue'

const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

const filterForm = ref({
  orderNo: '',
  status: '',
  category: '',
  dateRange: []
})

const purchaseList = ref([
  { orderNo: 'PO-202606001', title: '智能手机批量采购申请', category: '电子产品', amount: 528000, applicant: '张三', applyDate: '2026-06-15', urgency: '紧急', status: 'pending', currentApprover: '李经理' },
  { orderNo: 'PO-202606002', title: '进口食品补货申请', category: '食品饮料', amount: 156000, applicant: '李四', applyDate: '2026-06-14', urgency: '普通', status: 'approving', currentApprover: '王总监' },
  { orderNo: 'PO-202606003', title: '夏季服装新品采购', category: '服装鞋帽', amount: 385000, applicant: '王五', applyDate: '2026-06-14', urgency: '一般', status: 'approved', currentApprover: '已完成' },
  { orderNo: 'PO-202606004', title: '家居用品补货申请', category: '家居用品', amount: 98000, applicant: '赵六', applyDate: '2026-06-13', urgency: '普通', status: 'rejected', currentApprover: '已驳回' },
  { orderNo: 'PO-202606005', title: '电子产品配件采购', category: '电子产品', amount: 245000, applicant: '钱七', applyDate: '2026-06-12', urgency: '紧急', status: 'pending', currentApprover: '李经理' },
  { orderNo: 'PO-202606006', title: '美妆产品季度采购', category: '美妆个护', amount: 189000, applicant: '孙八', applyDate: '2026-06-11', urgency: '普通', status: 'approving', currentApprover: '王总监' },
  { orderNo: 'PO-202606007', title: '食品饮料节日备货', category: '食品饮料', amount: 620000, applicant: '周九', applyDate: '2026-06-10', urgency: '紧急', status: 'approved', currentApprover: '已完成' },
  { orderNo: 'PO-202606008', title: '运动服装批量采购', category: '服装鞋帽', amount: 278000, applicant: '吴十', applyDate: '2026-06-09', urgency: '一般', status: 'pending', currentApprover: '李经理' },
  { orderNo: 'PO-202606009', title: '智能家居设备采购', category: '家居用品', amount: 456000, applicant: '郑十一', applyDate: '2026-06-08', urgency: '普通', status: 'approved', currentApprover: '已完成' },
  { orderNo: 'PO-202606010', title: '数码配件补货申请', category: '电子产品', amount: 89000, applicant: '冯十二', applyDate: '2026-06-07', urgency: '一般', status: 'approving', currentApprover: '张经理' }
])

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
