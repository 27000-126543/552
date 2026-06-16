<template>
  <div class="pricing-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="page-title">定价策略</h2>
        <p class="page-desc">根据竞品价格、供需关系及促销日历，自动生成建议售价</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="MagicStick">重新计算</el-button>
        <el-button :icon="Setting">策略配置</el-button>
        <el-button :icon="Calendar">促销日历</el-button>
      </div>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card stat-primary">
          <div class="stat-icon"><el-icon><Goods /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">12,586</div>
            <div class="stat-label">在售SKU数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-success">
          <div class="stat-icon"><el-icon><TrendCharts /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">1,258</div>
            <div class="stat-label">待调价商品</div>
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

    <div class="table-card mt-20">
      <div class="table-header">
        <span class="table-title">建议调价列表</span>
        <div class="table-actions">
          <el-button size="small" type="primary">批量审批</el-button>
          <el-button size="small">导出</el-button>
        </div>
      </div>

      <el-table :data="pricingList" style="width: 100%">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="skuCode" label="SKU编码" width="120" />
        <el-table-column prop="skuName" label="商品名称" min-width="180" />
        <el-table-column prop="category" label="品类" width="100" />
        <el-table-column prop="currentPrice" label="当前售价" width="100" sortable>
          <template #default="{ row }">
            <span class="current-price">¥{{ row.currentPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="suggestedPrice" label="建议售价" width="100">
          <template #default="{ row }">
            <span class="suggest-price">¥{{ row.suggestedPrice }}</span>
            <el-tag :type="row.priceChange > 0 ? 'danger' : 'success'" size="small" style="margin-left: 4px">
              {{ row.priceChange > 0 ? '+' : '' }}{{ row.priceChange }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="成本价" width="100" />
        <el-table-column prop="competitorPrice" label="竞品均价" width="100" />
        <el-table-column prop="supplyDemand" label="供需指数" width="100">
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
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small">详情</el-button>
            <el-button v-if="row.status === '待审批'" type="success" link size="small">审批</el-button>
            <el-button type="info" link size="small">历史</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="1258"
          layout="total, sizes, prev, pager, next, jumper"
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MagicStick, Setting, Calendar, Goods, TrendCharts, Wallet, Warning } from '@element-plus/icons-vue'

const selectedCategory = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

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

const pricingList = ref([
  { skuCode: 'SKU-001', skuName: '智能手机 128G 黑色', category: '电子产品', currentPrice: 2599, suggestedPrice: 2699, priceChange: 3.8, cost: 1899, competitorPrice: 2799, supplyDemand: 85, reason: '竞品涨价，需求旺盛', status: '待审批' },
  { skuCode: 'SKU-002', skuName: '无线蓝牙耳机 Pro', category: '电子产品', currentPrice: 399, suggestedPrice: 379, priceChange: -5.0, cost: 210, competitorPrice: 429, supplyDemand: 62, reason: '促销活动期，提升销量', status: '待审批' },
  { skuCode: 'SKU-003', skuName: '进口牛奶 1L*12', category: '食品饮料', currentPrice: 128, suggestedPrice: 138, priceChange: 7.8, cost: 86, competitorPrice: 132, supplyDemand: 92, reason: '原材料涨价，供需紧张', status: '已通过' },
  { skuCode: 'SKU-004', skuName: '运动休闲外套', category: '服装鞋帽', currentPrice: 459, suggestedPrice: 399, priceChange: -13.1, cost: 220, competitorPrice: 429, supplyDemand: 45, reason: '换季清仓，库存偏高', status: '待审批' },
  { skuCode: 'SKU-005', skuName: '智能扫地机器人', category: '家居用品', currentPrice: 1899, suggestedPrice: 1999, priceChange: 5.3, cost: 1299, competitorPrice: 2099, supplyDemand: 78, reason: '新品上市，竞品定价高', status: '已驳回' },
  { skuCode: 'SKU-006', skuName: '保湿面霜 50ml', category: '美妆个护', currentPrice: 298, suggestedPrice: 308, priceChange: 3.4, cost: 120, competitorPrice: 328, supplyDemand: 88, reason: '竞品涨价，需求稳定', status: '待审批' },
  { skuCode: 'SKU-007', skuName: '平板电脑 256G', category: '电子产品', currentPrice: 3599, suggestedPrice: 3499, priceChange: -2.8, cost: 2699, competitorPrice: 3699, supplyDemand: 65, reason: '促销活动，冲销量', status: '已通过' },
  { skuCode: 'SKU-008', skuName: '有机坚果礼盒装', category: '食品饮料', currentPrice: 168, suggestedPrice: 158, priceChange: -6.0, cost: 98, competitorPrice: 178, supplyDemand: 55, reason: '节日后需求回落', status: '待审批' }
])

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
</style>
