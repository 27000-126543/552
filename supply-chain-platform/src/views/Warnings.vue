<template>
  <div class="warnings-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="page-title">异常交易预警</h2>
        <p class="page-desc">实时监测超低价、重复订单、异常退货模式，自动冻结并派发工单</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Bell">预警规则配置</el-button>
        <el-button :icon="List">工单管理</el-button>
      </div>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card stat-danger">
          <div class="stat-icon"><el-icon><Warning /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingCount }}</div>
            <div class="stat-label">待处理预警</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-warning">
          <div class="stat-icon"><el-icon><Clock /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ processingCount }}</div>
            <div class="stat-label">处理中</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-primary">
          <div class="stat-icon"><el-icon><CircleCheck /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ resolvedCount }}</div>
            <div class="stat-label">已处理</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-success">
          <div class="stat-icon"><el-icon><Lock /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">98.5%</div>
            <div class="stat-label">预警准确率</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">预警类型分布</span>
          </div>
          <v-chart :option="typeOption" autoresize class="chart-container" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">近7天预警趋势</span>
          </div>
          <v-chart :option="trendOption" autoresize class="chart-container" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">处理时效分布</span>
          </div>
          <v-chart :option="efficiencyOption" autoresize class="chart-container" />
        </div>
      </el-col>
    </el-row>

    <div class="filter-card mt-20">
      <el-form :model="filterForm" inline>
        <el-form-item label="预警类型">
          <el-select v-model="filterForm.type" placeholder="全部" clearable style="width: 140px">
            <el-option label="超低价交易" value="超低价交易" />
            <el-option label="重复订单" value="重复订单" />
            <el-option label="异常退货" value="异常退货" />
            <el-option label="异常账号" value="异常账号" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="filterForm.level" placeholder="全部" clearable style="width: 120px">
            <el-option label="高危" value="高危" />
            <el-option label="中危" value="中危" />
            <el-option label="低危" value="低危" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警编号">
          <el-input v-model="filterForm.keyword" placeholder="请输入编号" clearable style="width: 160px" />
        </el-form-item>
        <el-form-item label="是否冻结">
          <el-select v-model="filterForm.frozen" placeholder="全部" clearable style="width: 120px">
            <el-option label="已冻结" value="true" />
            <el-option label="未冻结" value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-card mt-20">
      <div class="table-header">
        <span class="table-title">预警列表</span>
        <div class="table-actions">
          <el-radio-group v-model="activeTab" size="small" @change="handleTabChange">
            <el-radio-button label="all">全部预警</el-radio-button>
            <el-radio-button label="pending">待处理</el-radio-button>
            <el-radio-button label="processing">处理中</el-radio-button>
            <el-radio-button label="resolved">已处理</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-table :data="pagedList" style="width: 100%" v-loading="loading">
        <el-table-column prop="warningNo" label="预警编号" width="140" />
        <el-table-column prop="type" label="预警类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getWarningType(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)" effect="dark" size="small">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="预警描述" min-width="220" />
        <el-table-column prop="relatedOrder" label="关联订单" width="140" />
        <el-table-column prop="amount" label="涉及金额" width="110">
          <template #default="{ row }">
            ¥{{ row.amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="frozen" label="冻结状态" width="90">
          <template #default="{ row }">
            <el-tag v-if="row.frozen" type="danger" size="small">已冻结</el-tag>
            <el-tag v-else type="info" size="small">未冻结</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="workOrder" label="工单号" width="140">
          <template #default="{ row }">
            <span v-if="row.workOrder" class="text-primary">{{ row.workOrder }}</span>
            <span v-else class="text-info">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="handler" label="处理人" width="100" />
        <el-table-column prop="detectTime" label="检测时间" width="160" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">详情</el-button>
            <el-button v-if="row.status === '待处理'" type="success" link size="small" @click="handleProcess(row)">处理</el-button>
            <el-button v-if="row.status === '待处理' || row.status === '处理中'" type="warning" link size="small" @click="handleDispatch(row)">派单</el-button>
            <el-button v-if="row.status === '处理中'" type="primary" link size="small" @click="handleResolve(row)">结案</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredCount"
          layout="total, sizes, prev, pager, next"
          @size-change="currentPage = 1"
        />
      </div>
    </div>

    <el-empty v-if="filteredCount === 0 && !loading" :description="`暂无${tabText}的预警`" style="padding: 60px 0" />

    <el-dialog v-model="detailVisible" title="预警详情" width="680px">
      <div v-if="currentWarning" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="预警编号">{{ currentWarning.warningNo }}</el-descriptions-item>
          <el-descriptions-item label="预警类型">
            <el-tag :type="getWarningType(currentWarning.type)" size="small">{{ currentWarning.type }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <el-tag :type="getLevelType(currentWarning.level)" effect="dark" size="small">{{ currentWarning.level }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="当前状态">
            <el-tag :type="getStatusType(currentWarning.status)" size="small">{{ currentWarning.status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="关联订单" :span="2">{{ currentWarning.relatedOrder }}</el-descriptions-item>
          <el-descriptions-item label="涉及金额">¥{{ currentWarning.amount.toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="检测时间">{{ currentWarning.detectTime }}</el-descriptions-item>
          <el-descriptions-item label="处理人">{{ currentWarning.handler === '-' ? '暂无' : currentWarning.handler }}</el-descriptions-item>
          <el-descriptions-item label="工单编号">{{ currentWarning.workOrder || '暂无' }}</el-descriptions-item>
          <el-descriptions-item label="冻结状态">
            <el-tag v-if="currentWarning.frozen" type="danger" size="small">已冻结</el-tag>
            <el-tag v-else type="info" size="small">未冻结</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="预警描述" :span="2">{{ currentWarning.description }}</el-descriptions-item>
        </el-descriptions>

        <div class="detail-actions">
          <el-button v-if="currentWarning.status === '待处理'" type="success" @click="handleProcess(currentWarning)">立即处理</el-button>
          <el-button v-if="currentWarning.status !== '已处理'" type="warning" @click="handleDispatch(currentWarning)">派发工单</el-button>
          <el-button v-if="currentWarning.status === '处理中'" type="primary" @click="handleResolve(currentWarning)">结案处理</el-button>
          <el-button @click="detailVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Bell, List, Warning, Clock, CircleCheck, Lock, Search, RefreshLeft } from '@element-plus/icons-vue'
import { useStore } from '../store'
import { ElMessage, ElMessageBox } from 'element-plus'

const { state, getters, actions } = useStore()

const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const detailVisible = ref(false)
const currentWarning = ref(null)

const filterForm = computed({
  get: () => state.warnings.filter,
  set: (val) => { state.warnings.filter = val }
})

const activeTab = computed({
  get: () => state.warnings.activeTab,
  set: (val) => { state.warnings.activeTab = val }
})

const tabText = computed(() => {
  const map = { all: '全部', pending: '待处理', processing: '处理中', resolved: '已处理' }
  return map[activeTab.value] || ''
})

const filteredList = computed(() => getters.filteredWarnings.value)

const filteredCount = computed(() => filteredList.value.length)
const pendingCount = computed(() => state.warnings.all.filter(w => w.status === '待处理').length)
const processingCount = computed(() => state.warnings.all.filter(w => w.status === '处理中').length)
const resolvedCount = computed(() => state.warnings.all.filter(w => w.status === '已处理').length)

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

const typeOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  series: [{
    type: 'pie',
    radius: ['50%', '75%'],
    center: ['50%', '55%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
    label: { formatter: '{b}\n{d}%' },
    data: [
      { value: pendingCount.value > 0 ? 12 : 0, name: '超低价交易', itemStyle: { color: '#f56c6c' } },
      { value: processingCount.value > 0 ? 8 : 0, name: '重复订单', itemStyle: { color: '#e6a23c' } },
      { value: resolvedCount.value > 0 ? 5 : 0, name: '异常退货', itemStyle: { color: '#9b59b6' } },
      { value: 3, name: '异常账号', itemStyle: { color: '#409eff' } }
    ]
  }]
}))

const trendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
  yAxis: { type: 'value' },
  series: [{
    type: 'line',
    smooth: true,
    data: [5, 8, 4, 6, 7, 3, 5],
    itemStyle: { color: '#f56c6c' },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(245, 108, 108, 0.3)' },
          { offset: 1, color: 'rgba(245, 108, 108, 0.05)' }
        ]
      }
    }
  }]
}))

const efficiencyOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
  xAxis: { type: 'value' },
  yAxis: { type: 'category', data: ['1小时内', '4小时内', '24小时内', '48小时内', '>48小时'] },
  series: [{
    type: 'bar',
    data: [
      { value: 45, itemStyle: { color: '#67c23a' } },
      { value: 68, itemStyle: { color: '#409eff' } },
      { value: 32, itemStyle: { color: '#e6a23c' } },
      { value: 8, itemStyle: { color: '#f56c6c' } },
      { value: 3, itemStyle: { color: '#909399' } }
    ],
    barWidth: 16,
    label: { show: true, position: 'right' }
  }]
}))

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
  actions.resetWarningFilter()
  currentPage.value = 1
  ElMessage.info('已重置筛选条件')
}

const handleView = (row) => {
  currentWarning.value = { ...row }
  detailVisible.value = true
}

const handleProcess = (row) => {
  actions.handleWarning(row.warningNo, state.user.username || '管理员')
  ElMessage.success(`已开始处理预警 ${row.warningNo}`)
  if (currentWarning.value && currentWarning.value.warningNo === row.warningNo) {
    currentWarning.value = { ...state.warnings.all.find(w => w.warningNo === row.warningNo) }
  }
}

const handleDispatch = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要为预警 ${row.warningNo} 派发工单吗？派发后将自动冻结相关交易。`, '派发工单确认', {
      confirmButtonText: '确定派发',
      cancelButtonText: '取消',
      type: 'warning'
    })
    actions.dispatchWarning(row.warningNo)
    ElMessage.success(`工单已派发，相关交易已冻结`)
    if (currentWarning.value && currentWarning.value.warningNo === row.warningNo) {
      currentWarning.value = { ...state.warnings.all.find(w => w.warningNo === row.warningNo) }
    }
  } catch {
    // 用户取消
  }
}

const handleResolve = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要将预警 ${row.warningNo} 结案吗？`, '结案确认', {
      confirmButtonText: '确定结案',
      cancelButtonText: '取消',
      type: 'success'
    })
    actions.resolveWarning(row.warningNo)
    ElMessage.success(`预警 ${row.warningNo} 已结案`)
    if (currentWarning.value && currentWarning.value.warningNo === row.warningNo) {
      currentWarning.value = { ...state.warnings.all.find(w => w.warningNo === row.warningNo) }
    }
  } catch {
    // 用户取消
  }
}

const getWarningType = (type) => {
  const map = { '超低价交易': 'danger', '重复订单': 'warning', '异常退货': 'info', '异常账号': 'primary' }
  return map[type] || 'info'
}

const getLevelType = (level) => {
  const map = { '高危': 'danger', '中危': 'warning', '低危': 'info' }
  return map[level] || 'info'
}

const getStatusType = (status) => {
  const map = { '待处理': 'warning', '处理中': 'primary', '已处理': 'success' }
  return map[status] || 'info'
}
</script>

<style scoped>
.warnings-page {
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

.stat-card {
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

.stat-danger .stat-icon { background: linear-gradient(135deg, #f56c6c 0%, #e74c3c 100%); }
.stat-warning .stat-icon { background: linear-gradient(135deg, #e6a23c 0%, #fa8c16 100%); }
.stat-primary .stat-icon { background: linear-gradient(135deg, #409eff 0%, #1890ff 100%); }
.stat-success .stat-icon { background: linear-gradient(135deg, #67c23a 0%, #52c41a 100%); }

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

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.chart-header {
  margin-bottom: 12px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.chart-container {
  width: 100%;
  height: 220px;
}

.filter-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.table-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.table-header, .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title, .card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.table-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.text-primary {
  color: #409eff;
  cursor: pointer;
}

.text-info {
  color: #909399;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.detail-content {
  padding: 10px 0;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}
</style>
