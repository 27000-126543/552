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
        <el-button type="primary" :icon="Refresh" @click="handleRefresh">刷新数据</el-button>
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
          <el-input v-model="skuKeyword" placeholder="搜索SKU名称/编码" style="width: 240px" clearable @clear="currentPage = 1" @input="handleSkuSearch">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" :disabled="!selectedSku" @click="openDrillDialog">钻取分析</el-button>
        </div>
      </div>
      <el-table
        ref="skuTableRef"
        :data="pagedSkuList"
        style="width: 100%"
        highlight-current-row
        @current-change="handleSkuRowChange"
      >
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="skuCode" label="SKU编码" width="140" />
        <el-table-column prop="skuName" label="商品名称" min-width="200" />
        <el-table-column prop="category" label="品类" width="120" />
        <el-table-column prop="stock" label="库存数量" width="120" sortable>
          <template #default="{ row }">
            <span :class="getStockClass(row.stock, row.safeStock)">{{ row.stock.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="safeStock" label="安全库存" width="100">
          <template #default="{ row }">{{ row.safeStock.toLocaleString() }}</template>
        </el-table-column>
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
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openDrillDialog(row)">钻取</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="filteredSkuCount"
          layout="total, sizes, prev, pager, next"
          @size-change="currentPage = 1"
        />
      </div>
    </div>

    <el-dialog v-model="drillDialogVisible" title="SKU 钻取分析" width="900px" class="drill-dialog">
      <div v-if="selectedSku" class="drill-content">
        <div class="drill-header">
          <div class="sku-info">
            <div class="sku-name">{{ selectedSku.skuName }}</div>
            <div class="sku-code">{{ selectedSku.skuCode }} · {{ selectedSku.category }}</div>
          </div>
          <div class="sku-stats">
            <div class="stat-item">
              <div class="num">{{ selectedSku.stock.toLocaleString() }}</div>
              <div class="label">当前库存</div>
            </div>
            <div class="stat-item">
              <div class="num">¥{{ (selectedSku.stockValue / 10000).toFixed(2) }}万</div>
              <div class="label">库存金额</div>
            </div>
            <div class="stat-item">
              <div class="num">{{ selectedSku.turnoverDays }}天</div>
              <div class="label">周转天数</div>
            </div>
            <div class="stat-item">
              <div class="num">{{ selectedSku.warehouse }}</div>
              <div class="label">主仓库</div>
            </div>
          </div>
        </div>

        <el-row :gutter="16" class="drill-charts">
          <el-col :span="12">
            <div class="mini-chart-card">
              <div class="mini-chart-title">库存趋势（近30天）</div>
              <v-chart :option="stockTrendOption" autoresize class="mini-chart" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="mini-chart-card">
              <div class="mini-chart-title">仓库库存分布</div>
              <v-chart :option="warehouseDistOption" autoresize class="mini-chart" />
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="16" class="drill-charts">
          <el-col :span="12">
            <div class="mini-chart-card">
              <div class="mini-chart-title">价格走势（近90天）</div>
              <v-chart :option="priceTrendOption" autoresize class="mini-chart" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="mini-chart-card">
              <div class="mini-chart-title">周转情况分析</div>
              <v-chart :option="turnoverOption" autoresize class="mini-chart" />
            </div>
          </el-col>
        </el-row>

        <div class="drill-footer">
          <el-button type="primary" @click="drillDialogVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Refresh, Search } from '@element-plus/icons-vue'
import { useStore } from '../store'
import { ElMessage } from 'element-plus'

const { state } = useStore()

const timeRange = ref('week')
const inventoryType = ref('amount')
const priceCategory = ref('electronics')
const skuKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const selectedSku = ref(null)
const drillDialogVisible = ref(false)
const skuTableRef = ref(null)


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

const filteredSkuList = computed(() => {
  const keyword = skuKeyword.value.trim().toLowerCase()
  if (!keyword) return state.skuList
  return state.skuList.filter(item =>
    item.skuCode.toLowerCase().includes(keyword) ||
    item.skuName.toLowerCase().includes(keyword) ||
    item.category.toLowerCase().includes(keyword)
  )
})

const filteredSkuCount = computed(() => filteredSkuList.value.length)

const pagedSkuList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredSkuList.value.slice(start, end)
})

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

const handleSkuSearch = () => {
  currentPage.value = 1
}

const handleSkuRowChange = (row) => {
  selectedSku.value = row
}

const openDrillDialog = (row) => {
  const target = row || selectedSku.value
  if (!target) {
    ElMessage.warning('请先选择一个SKU')
    return
  }
  selectedSku.value = target
  drillDialogVisible.value = true
}

const handleRefresh = () => {
  ElMessage.success('数据已刷新')
}

const stockTrendOption = computed(() => {
  const base = selectedSku.value ? selectedSku.value.stock : 2000
  const data = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const variation = Math.floor(Math.random() * 400 - 200)
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      value: Math.max(50, base + variation - Math.floor(i * 2))
    })
  }
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      axisLabel: { fontSize: 10, interval: 4 }
    },
    yAxis: { type: 'value' },
    series: [{
      type: 'line',
      smooth: true,
      data: data.map(d => d.value),
      itemStyle: { color: '#409eff' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.02)' }
          ]
        }
      }
    }]
  }
})

const warehouseDistOption = computed(() => {
  const base = selectedSku.value ? selectedSku.value.stock : 2000
  const mainWh = selectedSku.value ? selectedSku.value.warehouse : '华东仓'
  const warehouses = ['华东仓', '华南仓', '华北仓', '西南仓', '西北仓', '东北仓']
  const data = warehouses.map(wh => ({
    name: wh,
    value: wh === mainWh
      ? base
      : Math.floor(base * (0.05 + Math.random() * 0.25))
  }))
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c}件 ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center', itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 12 } },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 12, fontWeight: 'bold' }
      },
      data: data.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#9b59b6'][i] }
      }))
    }]
  }
})

const priceTrendOption = computed(() => {
  const base = selectedSku.value
    ? Math.floor(selectedSku.value.stockValue / selectedSku.value.stock)
    : 200
  const data = []
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const variation = Math.floor(Math.random() * 30 - 15)
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      value: base + variation
    })
  }
  return {
    tooltip: { trigger: 'axis', formatter: '{b}<br/>售价: ¥{c}' },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      axisLabel: { fontSize: 10, interval: 14 }
    },
    yAxis: { type: 'value', axisLabel: { formatter: '¥{value}' } },
    series: [{
      type: 'line',
      smooth: true,
      data: data.map(d => d.value),
      itemStyle: { color: '#67c23a' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(103, 194, 58, 0.25)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.02)' }
          ]
        }
      }
    }]
  }
})

const turnoverOption = computed(() => {
  const days = selectedSku.value ? selectedSku.value.turnoverDays : 30
  const categories = ['1-7天', '8-15天', '16-30天', '31-60天', '61-90天', '90天以上']
  const values = [5, 18, 42, 22, 10, 3]
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: {c}%' },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { fontSize: 10, rotate: 0 }
    },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' }, max: 50 },
    series: [{
      type: 'bar',
      data: values.map((v, i) => ({
        value: v,
        itemStyle: {
          color: days <= 15
            ? '#67c23a'
            : days <= 30
              ? '#409eff'
              : days <= 60
                ? '#e6a23c'
                : '#f56c6c'
        }
      })),
      barWidth: 24,
      label: { show: true, position: 'top', formatter: '{c}%', fontSize: 10 }
    }]
  }
})
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

.drill-content {
  padding: 10px 0;
}

.drill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
  margin-bottom: 16px;
}

.sku-info .sku-name {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.sku-info .sku-code {
  font-size: 13px;
  color: #909399;
}

.sku-stats {
  display: flex;
  gap: 24px;
}

.sku-stats .stat-item {
  text-align: center;
}

.sku-stats .stat-item .num {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.sku-stats .stat-item .label {
  font-size: 12px;
  color: #909399;
}

.drill-charts {
  margin-bottom: 16px;
}

.mini-chart-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.mini-chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.mini-chart {
  width: 100%;
  height: 200px;
}

.drill-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}
</style>
