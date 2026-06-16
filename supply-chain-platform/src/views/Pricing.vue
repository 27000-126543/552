<template>
  <div class="pricing-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="page-title">定价策略</h2>
        <p class="page-desc">根据竞品价格、供需关系及促销日历，自动生成建议售价</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="MagicStick" @click="recalculate">重新计算</el-button>
        <el-button :icon="Setting">策略配置</el-button>
        <el-button :icon="Calendar">促销日历</el-button>
      </div>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card stat-primary">
          <div class="stat-icon"><el-icon><Goods /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ totalCount }}</div>
            <div class="stat-label">在售SKU数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-success">
          <div class="stat-icon"><el-icon><TrendCharts /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingCount }}</div>
            <div class="stat-label">待审批调价</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-warning">
          <div class="stat-icon"><el-icon><Wallet /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">+8.5%</div>
            <div class="stat-label">预计毛利提升</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-danger">
          <div class="stat-icon"><el-icon><Warning /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">36</div>
            <div class="stat-label">价格低于预警</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="16">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">价格趋势分析</span>
            <el-select v-model="selectedCategory" size="small" style="width: 160px">
              <el-option label="全部品类" value="all" />
              <el-option label="电子产品" value="electronics" />
              <el-option label="食品饮料" value="food" />
              <el-option label="服装鞋帽" value="clothing" />
            </el-select>
          </div>
          <v-chart :option="priceTrendOption" autoresize style="width: 100%; height: 300px" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">竞品价格对比</span>
          </div>
          <v-chart :option="competitorOption" autoresize style="width: 100%; height: 300px" />
        </div>
      </el-col>
    </el-row>

    <div class="filter-card mt-20">
      <el-form :model="filterForm" inline>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable style="width: 130px">
            <el-option label="待审批" value="待审批" />
            <el-option label="已通过" value="已通过" />
            <el-option label="已驳回" value="已驳回" />
          </el-select>
        </el-form-item>
        <el-form-item label="SKU名称/编码">
          <el-input v-model="filterForm.keyword" placeholder="请输入" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="品类">
          <el-select v-model="filterForm.category" placeholder="全部" clearable style="width: 130px">
            <el-option label="电子产品" value="电子产品" />
            <el-option label="食品饮料" value="食品饮料" />
            <el-option label="服装鞋帽" value="服装鞋帽" />
            <el-option label="家居用品" value="家居用品" />
            <el-option label="美妆个护" value="美妆个护" />
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
        <span class="table-title">建议调价列表</span>
        <div class="table-actions">
          <el-button size="small" type="success" :disabled="selectedRows.length === 0" @click="batchApprove(true)">
            批量通过
          </el-button>
          <el-button size="small" type="danger" :disabled="selectedRows.length === 0" @click="batchApprove(false)">
            批量驳回
          </el-button>
          <el-button size="small">导出</el-button>
        </div>
      </div>

      <el-table
        ref="tableRef"
        :data="pagedList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="skuCode" label="SKU编码" width="120" />
        <el-table-column prop="skuName" label="商品名称" min-width="180" />
        <el-table-column prop="category" label="品类" width="100" />
        <el-table-column prop="currentPrice" label="当前售价" width="100" sortable>
          <template #default="{ row }">
            <span class="current-price">¥{{ row.currentPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="suggestedPrice" label="建议售价" width="140">
          <template #default="{ row }">
            <span class="suggest-price">¥{{ row.suggestedPrice }}</span>
            <el-tag :type="row.priceChange > 0 ? 'danger' : 'success'" size="small" style="margin-left: 4px">
              {{ row.priceChange > 0 ? '+' : '' }}{{ row.priceChange }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="成本价" width="100" />
        <el-table-column prop="competitorPrice" label="竞品均价" width="100" />
        <el-table-column prop="supplyDemand" label="供需指数" width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.supplyDemand" :color="getSupplyDemandColor(row.supplyDemand)" :stroke-width="4" />
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="调价原因" min-width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDetail(row)">详情</el-button>
            <el-button v-if="row.status === '待审批'" type="success" link size="small" @click="handleApprove(row)">
              通过
            </el-button>
            <el-button v-if="row.status === '待审批'" type="danger" link size="small" @click="handleReject(row)">
              驳回
            </el-button>
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

    <el-row :gutter="16" class="mt-20">
      <el-col :span="12">
        <div class="side-card">
          <div class="card-header">
            <span class="card-title">定价策略规则</span>
            <el-button type="primary" link size="small">管理规则</el-button>
          </div>
          <div class="rule-list">
            <div v-for="rule in ruleList" :key="rule.id" class="rule-item">
              <div class="rule-header">
                <el-tag :type="rule.type === 'active' ? 'success' : 'info'" size="small" effect="plain">
                  {{ rule.type === 'active' ? '启用' : '停用' }}
                </el-tag>
                <span class="rule-name">{{ rule.name }}</span>
              </div>
              <div class="rule-desc">{{ rule.description }}</div>
              <div class="rule-weight">权重: {{ rule.weight }}%</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="side-card">
          <div class="card-header">
            <span class="card-title">促销日历</span>
            <el-button type="primary" link size="small">查看全部</el-button>
          </div>
          <div class="promo-list">
            <div v-for="promo in promoList" :key="promo.id" class="promo-item">
              <div class="promo-date">
                <div class="promo-day">{{ promo.day }}</div>
                <div class="promo-month">{{ promo.month }}</div>
              </div>
              <div class="promo-info">
                <div class="promo-name">{{ promo.name }}</div>
                <div class="promo-range">{{ promo.category }} · {{ promo.discount }}</div>
              </div>
              <el-tag :type="promo.status === '进行中' ? 'success' : 'warning'" size="small">{{ promo.status }}</el-tag>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-model="detailVisible" title="调价详情" width="560px">
      <div v-if="currentItem" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="SKU编码">{{ currentItem.skuCode }}</el-descriptions-item>
          <el-descriptions-item label="商品名称">{{ currentItem.skuName }}</el-descriptions-item>
          <el-descriptions-item label="品类">{{ currentItem.category }}</el-descriptions-item>
          <el-descriptions-item label="当前状态">
            <el-tag :type="getStatusType(currentItem.status)" size="small">{{ currentItem.status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="当前售价">¥{{ currentItem.currentPrice }}</el-descriptions-item>
          <el-descriptions-item label="建议售价">
            <span style="color: #f56c6c; font-weight: 600">¥{{ currentItem.suggestedPrice }}</span>
            <el-tag :type="currentItem.priceChange > 0 ? 'danger' : 'success'" size="small" style="margin-left: 6px">
              {{ currentItem.priceChange > 0 ? '+' : '' }}{{ currentItem.priceChange }}%
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="成本价">¥{{ currentItem.cost }}</el-descriptions-item>
          <el-descriptions-item label="竞品均价">¥{{ currentItem.competitorPrice }}</el-descriptions-item>
          <el-descriptions-item label="供需指数" :span="2">
            <el-progress :percentage="currentItem.supplyDemand" :color="getSupplyDemandColor(currentItem.supplyDemand)" :stroke-width="8" />
          </el-descriptions-item>
          <el-descriptions-item label="调价原因" :span="2">{{ currentItem.reason }}</el-descriptions-item>
        </el-descriptions>

        <div v-if="currentItem.status === '待审批'" class="detail-actions">
          <el-button type="success" @click="handleApprove(currentItem)">通过</el-button>
          <el-button type="danger" @click="handleReject(currentItem)">驳回</el-button>
          <el-button @click="detailVisible = false">关闭</el-button>
        </div>
        <div v-else class="detail-actions">
          <el-button type="primary" @click="detailVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { MagicStick, Setting, Calendar, Goods, TrendCharts, Wallet, Warning, Search, RefreshLeft } from '@element-plus/icons-vue'
import { useStore } from '../store'
import { ElMessage, ElMessageBox } from 'element-plus'

const { state, actions } = useStore()

const selectedCategory = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRows = ref([])
const detailVisible = ref(false)
const currentItem = ref(null)
const tableRef = ref(null)

const extraFilter = reactive({
  keyword: '',
  category: ''
})

const filterForm = computed({
  get: () => ({ status: state.pricings.filter?.status || '', ...extraFilter }),
  set: (val) => {
    if (!state.pricings.filter) {
      state.pricings.filter = { status: '' }
    }
    state.pricings.filter.status = val.status
    extraFilter.keyword = val.keyword
    extraFilter.category = val.category
  }
})

const allPricings = computed(() => state.pricings.all)

const filteredList = computed(() => {
  return allPricings.value.filter(item => {
    if (state.pricings.filter?.status && item.status !== state.pricings.filter.status) return false
    if (extraFilter.keyword) {
      const kw = extraFilter.keyword.toLowerCase()
      if (!item.skuCode.toLowerCase().includes(kw) && !item.skuName.toLowerCase().includes(kw)) return false
    }
    if (extraFilter.category && item.category !== extraFilter.category) return false
    return true
  })
})

const filteredCount = computed(() => filteredList.value.length)
const totalCount = computed(() => allPricings.value.length)
const pendingCount = computed(() => allPricings.value.filter(p => p.status === '待审批').length)

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

const priceTrendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['本平台均价', '竞品均价', '成本均价'], bottom: 0 },
  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
  xAxis: { type: 'category', data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'] },
  yAxis: { type: 'value', axisLabel: { formatter: '¥{value}' } },
  series: [
    { name: '本平台均价', type: 'line', smooth: true, data: [228, 225, 220, 226, 232, 230, 235, 238], itemStyle: { color: '#409eff' }, lineStyle: { width: 3 } },
    { name: '竞品均价', type: 'line', smooth: true, data: [235, 230, 225, 232, 238, 235, 240, 242], itemStyle: { color: '#f56c6c' } },
    { name: '成本均价', type: 'line', smooth: true, data: [156, 152, 148, 155, 160, 158, 162, 165], itemStyle: { color: '#67c23a' } }
  ]
}))

const competitorOption = computed(() => ({
  tooltip: {},
  grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
  xAxis: { type: 'category', data: ['手机', '耳机', '平板', '手表', '电脑'] },
  yAxis: { type: 'value', axisLabel: { formatter: '¥{value}' } },
  series: [{
    type: 'bar',
    data: [
      { value: 258, itemStyle: { color: '#409eff' }, name: '本平台' },
      { value: 268, itemStyle: { color: '#f56c6c' }, name: '竞品A' },
      { value: 255, itemStyle: { color: '#67c23a' }, name: '竞品B' },
      { value: 262, itemStyle: { color: '#e6a23c' }, name: '竞品C' },
      { value: 270, itemStyle: { color: '#909399' }, name: '竞品D' }
    ],
    barWidth: 24,
    label: { show: true, position: 'top', formatter: '¥{c}' }
  }]
}))

const ruleList = ref([
  { id: 1, name: '竞品价格追踪', type: 'active', description: '实时监控竞品价格，自动调整定价策略', weight: 30 },
  { id: 2, name: '供需关系分析', type: 'active', description: '基于供需指数动态调整价格，平衡库存与销售', weight: 25 },
  { id: 3, name: '促销日历联动', type: 'active', description: '根据促销活动节点自动调整售价', weight: 20 },
  { id: 4, name: '成本利润率保障', type: 'active', description: '确保最低利润率，防止恶意低价', weight: 15 },
  { id: 5, name: '用户行为分析', type: 'inactive', description: '基于用户浏览和购买行为优化定价', weight: 10 }
])

const promoList = ref([
  { id: 1, name: '618年中大促', day: '18', month: '6月', category: '全品类', discount: '5折起', status: '进行中' },
  { id: 2, name: '清凉一夏促销', day: '01', month: '7月', category: '夏季商品', discount: '满减', status: '即将开始' },
  { id: 3, name: '开学季特惠', day: '20', month: '8月', category: '数码文具', discount: '8折', status: '待开始' },
  { id: 4, name: '中秋国庆双节', day: '01', month: '10月', category: '全品类', discount: '满赠', status: '待开始' }
])

const getSupplyDemandColor = (value) => {
  if (value >= 80) return '#f56c6c'
  if (value >= 60) return '#e6a23c'
  return '#67c23a'
}

const getStatusType = (status) => {
  const map = { '待审批': 'warning', '已通过': 'success', '已驳回': 'danger' }
  return map[status] || 'info'
}

const handleSelectionChange = (rows) => {
  selectedRows.value = rows.filter(r => r.status === '待审批')
}

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success(`搜索完成，找到 ${filteredCount.value} 条结果`)
}

const handleReset = () => {
  if (state.pricings.filter) {
    state.pricings.filter.status = ''
  }
  extraFilter.keyword = ''
  extraFilter.category = ''
  currentPage.value = 1
  ElMessage.info('已重置筛选条件')
}

const viewDetail = (row) => {
  currentItem.value = { ...row }
  detailVisible.value = true
}

const handleApprove = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要通过 ${row.skuCode} 的调价申请吗？`, '审批确认', {
      confirmButtonText: '确定通过',
      cancelButtonText: '取消',
      type: 'success'
    })
    actions.approvePricing(row.skuCode, true)
    ElMessage.success(`已通过 ${row.skuCode} 的调价申请`)
    if (detailVisible.value && currentItem.value?.skuCode === row.skuCode) {
      currentItem.value = { ...state.pricings.all.find(p => p.skuCode === row.skuCode) }
    }
    if (tableRef.value) {
      tableRef.value.clearSelection()
    }
  } catch {
    // 用户取消
  }
}

const handleReject = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要驳回 ${row.skuCode} 的调价申请吗？`, '驳回确认', {
      confirmButtonText: '确定驳回',
      cancelButtonText: '取消',
      type: 'warning'
    })
    actions.approvePricing(row.skuCode, false)
    ElMessage.warning(`已驳回 ${row.skuCode} 的调价申请`)
    if (detailVisible.value && currentItem.value?.skuCode === row.skuCode) {
      currentItem.value = { ...state.pricings.all.find(p => p.skuCode === row.skuCode) }
    }
    if (tableRef.value) {
      tableRef.value.clearSelection()
    }
  } catch {
    // 用户取消
  }
}

const batchApprove = async (pass) => {
  if (selectedRows.value.length === 0) return
  try {
    const actionText = pass ? '通过' : '驳回'
    await ElMessageBox.confirm(`确定要批量${actionText}选中的 ${selectedRows.value.length} 条调价申请吗？`, `批量${actionText}确认`, {
      confirmButtonText: `确定${actionText}`,
      cancelButtonText: '取消',
      type: pass ? 'success' : 'warning'
    })
    const codes = selectedRows.value.map(r => r.skuCode)
    actions.approvePricing(codes, pass)
    ElMessage.success(`已批量${actionText} ${codes.length} 条调价申请`)
    if (tableRef.value) {
      tableRef.value.clearSelection()
    }
  } catch {
    // 用户取消
  }
}

const recalculate = () => {
  ElMessage.success('正在重新计算定价策略...')
  setTimeout(() => {
    ElMessage.success('定价策略重新计算完成')
  }, 1000)
}
</script>

<style scoped>
.pricing-page {
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

.stat-primary .stat-icon { background: linear-gradient(135deg, #409eff 0%, #1890ff 100%); }
.stat-success .stat-icon { background: linear-gradient(135deg, #67c23a 0%, #52c41a 100%); }
.stat-warning .stat-icon { background: linear-gradient(135deg, #e6a23c 0%, #fa8c16 100%); }
.stat-danger .stat-icon { background: linear-gradient(135deg, #f56c6c 0%, #e74c3c 100%); }

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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
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
  gap: 8px;
}

.current-price {
  color: #909399;
  text-decoration: line-through;
}

.suggest-price {
  color: #f56c6c;
  font-weight: 600;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.side-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
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

.rule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rule-item {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.rule-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.rule-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.rule-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.rule-weight {
  font-size: 12px;
  color: #409eff;
}

.promo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.promo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.promo-date {
  width: 50px;
  text-align: center;
  background: #409eff;
  color: #fff;
  border-radius: 6px;
  padding: 6px 0;
  flex-shrink: 0;
}

.promo-day {
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
}

.promo-month {
  font-size: 10px;
  margin-top: 2px;
}

.promo-info {
  flex: 1;
}

.promo-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.promo-range {
  font-size: 12px;
  color: #909399;
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
