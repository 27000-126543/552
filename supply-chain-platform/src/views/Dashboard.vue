<template>
  <div class="dashboard-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="page-title">供应链数据看板</h2>
        <p class="page-desc">实时监控库存、价格、物流全链路数据</p>
      </div>
      <div class="header-actions">
        <el-radio-group v-model="timeRange" size="default">
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
          <el-radio-button label="quarter">本季度</el-radio-button>
          <el-radio-button label="year">本年</el-radio-button>
        </el-radio-group>
        <el-button type="primary" :icon="Refresh" @click="refreshData">刷新数据</el-button>
      </div>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon icon-blue">
            <el-icon><Wallet /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-title">库存总金额</div>
            <div class="stat-value">¥12,856.8万</div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              <span>8.5% 较上月</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon icon-green">
            <el-icon><ShoppingCart /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-title">今日采购订单</div>
            <div class="stat-value">1,258</div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              <span>12.3% 较昨日</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon icon-orange">
            <el-icon><OfficeBuilding /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-title">活跃供应商</div>
            <div class="stat-value">862</div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              <span>5.2% 较上月</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon icon-purple">
            <el-icon><Van /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-title">平均物流时效</div>
            <div class="stat-value">2.8天</div>
            <div class="stat-trend down">
              <el-icon><Bottom /></el-icon>
              <span>0.3天 较上月</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="chart-row">
      <el-col :span="16">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">库存水位趋势</span>
            <div class="chart-actions">
              <el-radio-group v-model="inventoryType" size="small">
                <el-radio-button label="amount">金额</el-radio-button>
                <el-radio-button label="quantity">数量</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <v-chart :option="inventoryOption" autoresize class="chart-container" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">品类库存分布</span>
          </div>
          <v-chart :option="categoryOption" autoresize class="chart-container" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="chart-row">
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">价格波动分析</span>
            <el-select v-model="priceCategory" size="small" style="width: 140px">
              <el-option label="电子产品" value="electronics" />
              <el-option label="食品饮料" value="food" />
              <el-option label="服装鞋帽" value="clothing" />
              <el-option label="家居用品" value="home" />
            </el-select>
          </div>
          <v-chart :option="priceOption" autoresize class="chart-container" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">需求预测趋势</span>
            <div class="chart-legend">
              <span class="legend-item"><i class="legend-dot actual"></i>实际销量</span>
              <span class="legend-item"><i class="legend-dot forecast"></i>预测销量</span>
            </div>
          </div>
          <v-chart :option="forecastOption" autoresize class="chart-container" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="chart-row">
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">物流时效分布</span>
          </div>
          <v-chart :option="logisticsOption" autoresize class="chart-container" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">供应商质量评分</span>
          </div>
          <v-chart :option="supplierScoreOption" autoresize class="chart-container" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">区域库存分布</span>
          </div>
          <v-chart :option="regionOption" autoresize class="chart-container" />
        </div>
      </el-col>
    </el-row>

    <div class="chart-card sku-card">
      <div class="chart-header">
        <span class="chart-title">SKU 库存明细</span>
        <div class="header-right">
          <el-input v-model="skuSearch" placeholder="搜索SKU名称/编码" style="width: 240px" clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" link @click="drillDown">钻取分析</el-button>
        </div>
      </div>
      <el-table :data="skuList" style="width: 100%">
        <el-table-column prop="skuCode" label="SKU编码" width="140" />
        <el-table-column prop="skuName" label="商品名称" min-width="200" />
        <el-table-column prop="category" label="品类" width="120" />
        <el-table-column prop="stock" label="库存数量" width="120" sortable>
          <template #default="{ row }">
            <span :class="getStockClass(row.stock, row.safeStock)">{{ row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="safeStock" label="安全库存" width="100" />
        <el-table-column prop="stockValue" label="库存金额" width="120" sortable>
          <template #default="{ row }">
            ¥{{ (row.stockValue / 10000).toFixed(2) }}万
          </template>
        </el-table-column>
        <el-table-column prop="turnoverDays" label="周转天数" width="100" sortable />
        <el-table-column prop="warehouse" label="所在仓库" width="120" />
        <el-table-column label="库存状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStockTagType(row.stock, row.safeStock)" size="small">
              {{ getStockStatus(row.stock, row.safeStock) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
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
import { ref, computed } from 'vue'
import { Refresh, Search } from '@element-plus/icons-vue'

const timeRange = ref('week')
const inventoryType = ref('amount')
const priceCategory = ref('electronics')
const skuSearch = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const inventoryOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['库存金额', '采购金额', '销售金额'], bottom: 0 },
  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: '{value}万' }
  },
  series: [
    {
      name: '库存金额',
      type: 'line',
      smooth: true,
      data: [9800, 10200, 10500, 11200, 11800, 12000, 11500, 12200, 12500, 12800, 12600, 12857],
      itemStyle: { color: '#409eff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ]
        }
      }
    },
    {
      name: '采购金额',
      type: 'line',
      smooth: true,
      data: [5200, 5800, 6100, 6500, 7200, 6800, 7500, 7800, 8200, 8500, 8300, 8800],
      itemStyle: { color: '#67c23a' }
    },
    {
      name: '销售金额',
      type: 'line',
      smooth: true,
      data: [4800, 5400, 5700, 6200, 6800, 6500, 7200, 7500, 7900, 8200, 8000, 8500],
      itemStyle: { color: '#e6a23c' }
    }
  ]
}))

const categoryOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c}万 ({d}%)' },
  legend: { orient: 'vertical', right: '5%', top: 'center' },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    center: ['35%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    emphasis: {
      label: { show: true, fontSize: 14, fontWeight: 'bold' }
    },
    data: [
      { value: 4256, name: '电子产品', itemStyle: { color: '#409eff' } },
      { value: 2890, name: '食品饮料', itemStyle: { color: '#67c23a' } },
      { value: 2380, name: '服装鞋帽', itemStyle: { color: '#e6a23c' } },
      { value: 1850, name: '家居用品', itemStyle: { color: '#f56c6c' } },
      { value: 1480, name: '美妆个护', itemStyle: { color: '#909399' } }
    ]
  }]
}))

const priceOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['采购均价', '销售均价', '竞品均价'], bottom: 0 },
  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周']
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: '¥{value}' }
  },
  series: [
    {
      name: '采购均价',
      type: 'line',
      smooth: true,
      data: [156, 152, 148, 155, 160, 158, 162, 165],
      itemStyle: { color: '#409eff' }
    },
    {
      name: '销售均价',
      type: 'line',
      smooth: true,
      data: [228, 225, 220, 226, 232, 230, 235, 238],
      itemStyle: { color: '#67c23a' }
    },
    {
      name: '竞品均价',
      type: 'line',
      smooth: true,
      data: [235, 230, 225, 232, 238, 235, 240, 242],
      itemStyle: { color: '#f56c6c' }
    }
  ]
}))

const forecastOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}万件' } },
  series: [
    {
      name: '实际销量',
      type: 'line',
      smooth: true,
      data: [85, 92, 98, 105, 110, 108, 115, 120, null, null, null, null],
      itemStyle: { color: '#409eff' },
      lineStyle: { width: 3 }
    },
    {
      name: '预测销量',
      type: 'line',
      smooth: true,
      data: [null, null, null, null, null, null, null, 120, 128, 135, 142, 150],
      itemStyle: { color: '#67c23a' },
      lineStyle: { type: 'dashed', width: 2 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(103, 194, 58, 0.2)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.02)' }
          ]
        }
      }
    }
  ]
}))

const logisticsOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
  xAxis: { type: 'value' },
  yAxis: {
    type: 'category',
    data: ['华东仓', '华南仓', '华北仓', '西南仓', '西北仓', '东北仓']
  },
  series: [{
    type: 'bar',
    data: [
      { value: 2.1, itemStyle: { color: '#67c23a' } },
      { value: 2.5, itemStyle: { color: '#67c23a' } },
      { value: 2.8, itemStyle: { color: '#e6a23c' } },
      { value: 3.2, itemStyle: { color: '#e6a23c' } },
      { value: 3.8, itemStyle: { color: '#f56c6c' } },
      { value: 3.5, itemStyle: { color: '#f56c6c' } }
    ],
    barWidth: 16,
    label: {
      show: true,
      position: 'right',
      formatter: '{c}天'
    }
  }]
}))

const supplierScoreOption = computed(() => ({
  tooltip: {},
  radar: {
    indicator: [
      { name: '交付准时率', max: 100 },
      { name: '产品质量', max: 100 },
      { name: '价格竞争力', max: 100 },
      { name: '服务响应', max: 100 },
      { name: '合作年限', max: 100 },
      { name: '技术能力', max: 100 }
    ],
    radius: '65%'
  },
  series: [{
    type: 'radar',
    data: [
      {
        value: [92, 88, 85, 90, 80, 78],
        name: 'A级供应商',
        areaStyle: { color: 'rgba(64, 158, 255, 0.3)' },
        itemStyle: { color: '#409eff' },
        lineStyle: { color: '#409eff' }
      },
      {
        value: [78, 75, 82, 72, 65, 70],
        name: 'B级供应商',
        areaStyle: { color: 'rgba(103, 194, 58, 0.2)' },
        itemStyle: { color: '#67c23a' },
        lineStyle: { color: '#67c23a' }
      }
    ]
  }],
  legend: { data: ['A级供应商', 'B级供应商'], bottom: 0 }
}))

const regionOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c}万件 ({d}%)' },
  series: [{
    type: 'pie',
    radius: '70%',
    center: ['50%', '50%'],
    roseType: 'radius',
    itemStyle: { borderRadius: 4 },
    label: { formatter: '{b}\n{d}%' },
    data: [
      { value: 3250, name: '华东区' },
      { value: 2580, name: '华南区' },
      { value: 2120, name: '华北区' },
      { value: 1650, name: '西南区' },
      { value: 980, name: '西北区' },
      { value: 720, name: '东北区' }
    ],
    color: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#9b59b6']
  }]
}))

const skuList = ref([
  { skuCode: 'SKU-001', skuName: '智能手机 128G 黑色', category: '电子产品', stock: 2580, safeStock: 500, stockValue: 5160000, turnoverDays: 28, warehouse: '华东仓' },
  { skuCode: 'SKU-002', skuName: '无线蓝牙耳机 Pro', category: '电子产品', stock: 5680, safeStock: 1000, stockValue: 1704000, turnoverDays: 22, warehouse: '华南仓' },
  { skuCode: 'SKU-003', skuName: '进口牛奶 1L*12', category: '食品饮料', stock: 890, safeStock: 1000, stockValue: 89000, turnoverDays: 15, warehouse: '华北仓' },
  { skuCode: 'SKU-004', skuName: '运动休闲外套 男款', category: '服装鞋帽', stock: 320, safeStock: 200, stockValue: 128000, turnoverDays: 45, warehouse: '华东仓' },
  { skuCode: 'SKU-005', skuName: '智能扫地机器人', category: '家居用品', stock: 156, safeStock: 300, stockValue: 624000, turnoverDays: 60, warehouse: '西南仓' },
  { skuCode: 'SKU-006', skuName: '保湿面霜 50ml', category: '美妆个护', stock: 2850, safeStock: 800, stockValue: 427500, turnoverDays: 35, warehouse: '华南仓' },
  { skuCode: 'SKU-007', skuName: '平板电脑 256G WiFi版', category: '电子产品', stock: 680, safeStock: 400, stockValue: 2040000, turnoverDays: 42, warehouse: '华东仓' },
  { skuCode: 'SKU-008', skuName: '有机坚果礼盒装', category: '食品饮料', stock: 1250, safeStock: 600, stockValue: 156250, turnoverDays: 20, warehouse: '华北仓' },
  { skuCode: 'SKU-009', skuName: '真丝连衣裙 夏季款', category: '服装鞋帽', stock: 420, safeStock: 150, stockValue: 294000, turnoverDays: 55, warehouse: '华东仓' },
  { skuCode: 'SKU-010', skuName: '北欧风格餐桌 1.4米', category: '家居用品', stock: 85, safeStock: 50, stockValue: 425000, turnoverDays: 75, warehouse: '华北仓' }
])

const getStockClass = (stock, safeStock) => {
  if (stock < safeStock * 0.5) return 'text-danger'
  if (stock < safeStock) return 'text-warning'
  return 'text-success'
}

const getStockTagType = (stock, safeStock) => {
  if (stock < safeStock * 0.5) return 'danger'
  if (stock < safeStock) return 'warning'
  return 'success'
}

const getStockStatus = (stock, safeStock) => {
  if (stock < safeStock * 0.5) return '紧急'
  if (stock < safeStock) return '偏低'
  return '正常'
}

const refreshData = () => {
  // 模拟刷新数据
}

const drillDown = () => {
  // 钻取分析
}
</script>

<style scoped>
.dashboard-page {
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
  align-items: center;
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
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
}

.icon-blue {
  background: linear-gradient(135deg, #409eff 0%, #1890ff 100%);
}

.icon-green {
  background: linear-gradient(135deg, #67c23a 0%, #52c41a 100%);
}

.icon-orange {
  background: linear-gradient(135deg, #e6a23c 0%, #fa8c16 100%);
}

.icon-purple {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  line-height: 1.2;
}

.stat-trend {
  margin-top: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend.up {
  color: #67c23a;
}

.stat-trend.down {
  color: #f56c6c;
}

.chart-row {
  margin-bottom: 16px;
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

.chart-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chart-container {
  width: 100%;
  height: 280px;
}

.chart-legend {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #606266;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot.actual {
  background: #409eff;
}

.legend-dot.forecast {
  background: #67c23a;
}

.sku-card {
  margin-top: 16px;
}

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.text-danger {
  color: #f56c6c;
  font-weight: 600;
}

.text-warning {
  color: #e6a23c;
  font-weight: 600;
}

.text-success {
  color: #67c23a;
  font-weight: 600;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
