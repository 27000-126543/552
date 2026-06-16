<template>
  <div class="inventory-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="page-title">库存调拨优化</h2>
        <p class="page-desc">跨区域库存调拨优化算法，综合考虑运输成本、时效约束与需求预测</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Refresh">生成调拨方案</el-button>
        <el-button :icon="Setting">算法配置</el-button>
        <el-button :icon="Download">导出方案</el-button>
      </div>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="4">
        <div class="stat-card">
          <div class="stat-title">总库存数量</div>
          <div class="stat-value">1,258,600</div>
          <div class="stat-trend up">
            <el-icon><Top /></el-icon>
            <span>3.2%</span>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-card">
          <div class="stat-title">仓库数量</div>
          <div class="stat-value">28</div>
          <div class="stat-sub">覆盖6大区域</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-card">
          <div class="stat-title">待调拨数量</div>
          <div class="stat-value">86,500</div>
          <div class="stat-trend down">
            <el-icon><Bottom /></el-icon>
            <span>12.5%</span>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-card">
          <div class="stat-title">调拨方案</div>
          <div class="stat-value">24</div>
          <div class="stat-sub">待执行</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-card">
          <div class="stat-title">预计节省成本</div>
          <div class="stat-value">¥128万</div>
          <div class="stat-trend up">
            <el-icon><Top /></el-icon>
            <span>8.6%</span>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="stat-card">
          <div class="stat-title">平均调拨时效</div>
          <div class="stat-value">2.5天</div>
          <div class="stat-trend down">
            <el-icon><Bottom /></el-icon>
            <span>0.3天</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">区域库存分布</span>
          </div>
          <v-chart :option="regionOption" autoresize class="chart-container" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">仓库库存热力</span>
          </div>
          <v-chart :option="warehouseOption" autoresize class="chart-container" />
        </div>
      </el-col>
    </el-row>

    <div class="table-card">
      <div class="table-header">
        <span class="table-title">最优调拨方案</span>
        <div class="table-actions">
          <el-tag type="success">已优化</el-tag>
          <el-button size="small" type="primary">全部执行</el-button>
        </div>
      </div>

      <el-table :data="transferList" style="width: 100%">
        <el-table-column prop="planNo" label="方案编号" width="120" />
        <el-table-column prop="skuName" label="商品名称" min-width="180" />
        <el-table-column prop="fromWarehouse" label="调出仓库" width="120" />
        <el-table-column prop="toWarehouse" label="调入仓库" width="120" />
        <el-table-column prop="quantity" label="调拨数量" width="100" sortable />
        <el-table-column prop="transportCost" label="运输成本" width="100">
          <template #default="{ row }">
            ¥{{ row.transportCost }}
          </template>
        </el-table-column>
        <el-table-column prop="estimatedTime" label="预计时效" width="100">
          <template #default="{ row }">
            {{ row.estimatedTime }}天
          </template>
        </el-table-column>
        <el-table-column prop="savedCost" label="节省成本" width="100">
          <template #default="{ row }">
            <span class="text-success">-¥{{ row.savedCost }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="80">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)" size="small">{{ row.priority }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small">详情</el-button>
            <el-button v-if="row.status === '待执行'" type="success" link size="small">执行</el-button>
            <el-button type="info" link size="small">跟踪</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="24"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </div>

    <div class="chart-card mt-20">
      <div class="chart-header">
        <span class="chart-title">运输成本分析</span>
        <el-select v-model="costType" size="small" style="width: 140px">
          <el-option label="按运输方式" value="type" />
          <el-option label="按区域" value="region" />
          <el-option label="按重量段" value="weight" />
        </el-select>
      </div>
      <v-chart :option="costOption" autoresize style="width: 100%; height: 280px" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Refresh, Setting, Download, Top, Bottom } from '@element-plus/icons-vue'

const currentPage = ref(1)
const pageSize = ref(10)
const costType = ref('type')

const regionOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['当前库存', '安全库存', '预计需求'], bottom: 0 },
  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
  xAxis: { type: 'category', data: ['华东区', '华南区', '华北区', '西南区', '西北区', '东北区'] },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}万件' } },
  series: [
    { name: '当前库存', type: 'bar', data: [325, 258, 212, 165, 98, 72], itemStyle: { color: '#409eff' }, barWidth: 16 },
    { name: '安全库存', type: 'bar', data: [200, 180, 150, 120, 80, 60], itemStyle: { color: '#e6a23c' }, barWidth: 16 },
    { name: '预计需求', type: 'bar', data: [280, 220, 180, 140, 90, 65], itemStyle: { color: '#67c23a' }, barWidth: 16 }
  ]
}))

const warehouseOption = computed(() => ({
  tooltip: { formatter: '{b}: {c}万件' },
  visualMap: {
    min: 0,
    max: 100,
    left: 'left',
    top: 'center',
    text: ['高', '低'],
    calculable: true,
    inRange: { color: ['#e0f3ff', '#409eff'] }
  },
  series: [{
    type: 'pie',
    radius: ['40%', '75%'],
    center: ['60%', '50%'],
    roseType: 'area',
    itemStyle: { borderRadius: 4 },
    label: { formatter: '{b}\n{c}万件' },
    data: [
      { value: 85, name: '上海仓' },
      { value: 72, name: '广州仓' },
      { value: 68, name: '北京仓' },
      { value: 52, name: '成都仓' },
      { value: 45, name: '武汉仓' },
      { value: 38, name: '西安仓' },
      { value: 32, name: '沈阳仓' },
      { value: 28, name: '厦门仓' }
    ]
  }],
  legend: { orient: 'vertical', left: '5%', top: 'center' }
}))

const costOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['公路运输', '铁路运输', '航空运输', '水路运输'], bottom: 0 },
  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}万元' } },
  series: [
    { name: '公路运输', type: 'line', smooth: true, data: [58, 62, 65, 58, 68, 72], itemStyle: { color: '#409eff' } },
    { name: '铁路运输', type: 'line', smooth: true, data: [32, 35, 38, 36, 42, 45], itemStyle: { color: '#67c23a' } },
    { name: '航空运输', type: 'line', smooth: true, data: [18, 20, 22, 25, 28, 30], itemStyle: { color: '#e6a23c' } },
    { name: '水路运输', type: 'line', smooth: true, data: [12, 14, 15, 16, 18, 20], itemStyle: { color: '#909399' } }
  ]
}))

const transferList = ref([
  { planNo: 'TR-20260601', skuName: '智能手机 128G 黑色', fromWarehouse: '上海仓', toWarehouse: '成都仓', quantity: 500, transportCost: 2500, estimatedTime: 3, savedCost: 8500, priority: '高', status: '待执行' },
  { planNo: 'TR-20260602', skuName: '无线蓝牙耳机 Pro', fromWarehouse: '广州仓', toWarehouse: '武汉仓', quantity: 2000, transportCost: 1800, estimatedTime: 2, savedCost: 5200, priority: '中', status: '待执行' },
  { planNo: 'TR-20260603', skuName: '进口牛奶 1L*12', fromWarehouse: '北京仓', toWarehouse: '沈阳仓', quantity: 800, transportCost: 1200, estimatedTime: 2, savedCost: 3600, priority: '高', status: '执行中' },
  { planNo: 'TR-20260604', skuName: '运动休闲外套', fromWarehouse: '上海仓', toWarehouse: '西安仓', quantity: 300, transportCost: 980, estimatedTime: 3, savedCost: 2800, priority: '低', status: '待执行' },
  { planNo: 'TR-20260605', skuName: '智能扫地机器人', fromWarehouse: '广州仓', toWarehouse: '成都仓', quantity: 150, transportCost: 2200, estimatedTime: 4, savedCost: 6800, priority: '中', status: '待执行' },
  { planNo: 'TR-20260606', skuName: '保湿面霜 50ml', fromWarehouse: '上海仓', toWarehouse: '厦门仓', quantity: 1000, transportCost: 680, estimatedTime: 2, savedCost: 2100, priority: '低', status: '已完成' },
  { planNo: 'TR-20260607', skuName: '平板电脑 256G', fromWarehouse: '北京仓', toWarehouse: '武汉仓', quantity: 200, transportCost: 1500, estimatedTime: 2, savedCost: 4500, priority: '高', status: '执行中' },
  { planNo: 'TR-20260608', skuName: '有机坚果礼盒装', fromWarehouse: '广州仓', toWarehouse: '上海仓', quantity: 500, transportCost: 800, estimatedTime: 1, savedCost: 1800, priority: '中', status: '待执行' }
])

const getPriorityType = (priority) => {
  const map = { '高': 'danger', '中': 'warning', '低': 'info' }
  return map[priority] || 'info'
}

const getStatusType = (status) => {
  const map = { '待执行': 'warning', '执行中': 'primary', '已完成': 'success' }
  return map[status] || 'info'
}
</script>

<style scoped>
.inventory-page {
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
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.stat-title {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend.up { color: #67c23a; }
.stat-trend.down { color: #f56c6c; }

.stat-sub {
  font-size: 12px;
  color: #909399;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
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

.chart-container {
  width: 100%;
  height: 280px;
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

.text-success {
  color: #67c23a;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.mt-20 {
  margin-top: 20px;
}
</style>
