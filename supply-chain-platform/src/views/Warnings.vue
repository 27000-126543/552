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
            <div class="stat-value">5</div>
            <div class="stat-label">待处理预警</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-warning">
          <div class="stat-icon"><el-icon><Clock /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">28</div>
            <div class="stat-label">本月预警</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-primary">
          <div class="stat-icon"><el-icon><CircleCheck /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">156</div>
            <div class="stat-label">已处理</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-success">
          <div class="stat-icon"><el-icon><Shield /></el-icon></div>
          <div class="stat-content">
            <div class="stat-value">98.5%</div>
            <div class="stat-label">准确率</div>
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
            <span class="chart-title">预警趋势</span>
          </div>
          <v-chart :option="trendOption" autoresize class="chart-container" />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">处理时效</span>
          </div>
          <v-chart :option="efficiencyOption" autoresize class="chart-container" />
        </div>
      </el-col>
    </el-row>

    <div class="filter-card mt-20">
      <el-form :model="filterForm" inline>
        <el-form-item label="预警类型">
          <el-select v-model="filterForm.type" placeholder="全部" clearable style="width: 160px">
            <el-option label="超低价交易" value="lowPrice" />
            <el-option label="重复订单" value="duplicate" />
            <el-option label="异常退货" value="abnormalReturn" />
            <el-option label="异常账号" value="abnormalAccount" />
          </el-select>
        </el-form-item>
        <el-form-item label="预警等级">
          <el-select v-model="filterForm.level" placeholder="全部" clearable style="width: 140px">
            <el-option label="高危" value="high" />
            <el-option label="中危" value="medium" />
            <el-option label="低危" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable style="width: 140px">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已处理" value="resolved" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">搜索</el-button>
          <el-button :icon="RefreshLeft">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-card mt-20">
      <div class="table-header">
        <span class="table-title">预警列表</span>
        <div class="table-actions">
          <el-radio-group v-model="activeTab" size="small">
            <el-radio-button label="pending">待处理</el-radio-button>
            <el-radio-button label="processing">处理中</el-radio-button>
            <el-radio-button label="resolved">已处理</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-table :data="warningList" style="width: 100%">
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
        <el-table-column prop="description" label="预警描述" min-width="250" />
        <el-table-column prop="relatedOrder" label="关联订单" width="140" />
        <el-table-column prop="amount" label="涉及金额" width="120">
          <template #default="{ row }">
            ¥{{ row.amount.toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="detectTime" label="检测时间" width="160" />
        <el-table-column prop="handler" label="处理人" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small">详情</el-button>
            <el-button v-if="row.status === '待处理'" type="success" link size="small">处理</el-button>
            <el-button type="info" link size="small">派单</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="28"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </div>

    <div class="rules-card mt-20">
      <div class="card-header">
        <span class="card-title">预警规则引擎</span>
        <el-button type="primary" size="small" :icon="Plus">新增规则</el-button>
      </div>
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column prop="ruleName" label="规则名称" width="200" />
        <el-table-column prop="ruleType" label="规则类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getRuleType(row.ruleType)" size="small">{{ row.ruleType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="condition" label="触发条件" min-width="280" />
        <el-table-column prop="action" label="执行动作" width="150" />
        <el-table-column prop="triggerCount" label="触发次数" width="100" sortable />
        <el-table-column prop="accuracy" label="准确率" width="100">
          <template #default="{ row }">
            {{ row.accuracy }}%
          </template>
        </el-table-column>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Bell, List, Warning, Clock, CircleCheck, Shield, Search, RefreshLeft, Plus } from '@element-plus/icons-vue'

const activeTab = ref('pending')
const currentPage = ref(1)
const pageSize = ref(10)

const filterForm = ref({
  type: '',
  level: '',
  status: ''
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
      { value: 12, name: '超低价交易', itemStyle: { color: '#f56c6c' } },
      { value: 8, name: '重复订单', itemStyle: { color: '#e6a23c' } },
      { value: 5, name: '异常退货', itemStyle: { color: '#9b59b6' } },
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

const warningList = ref([
  { warningNo: 'WARN-202606001', type: '超低价交易', level: '高危', description: '订单价格低于成本价30%，疑似异常定价', relatedOrder: 'PO-202606125', amount: 52800, detectTime: '2026-06-16 10:25:30', handler: '-', status: '待处理' },
  { warningNo: 'WARN-202606002', type: '重复订单', level: '中危', description: '同一供应商30分钟内重复提交相同SKU订单', relatedOrder: 'PO-202606128', amount: 18900, detectTime: '2026-06-16 09:15:20', handler: '张主管', status: '处理中' },
  { warningNo: 'WARN-202606003', type: '异常退货', level: '高危', description: '某账号近7天退货率达85%，疑似恶意退货', relatedOrder: 'RT-202606045', amount: 25600, detectTime: '2026-06-16 08:45:10', handler: '-', status: '待处理' },
  { warningNo: 'WARN-202606004', type: '异常账号', level: '中危', description: '新注册账号下单金额突增，存在风险', relatedOrder: 'PO-202606130', amount: 128000, detectTime: '2026-06-15 18:30:00', handler: '李经理', status: '处理中' },
  { warningNo: 'WARN-202606005', type: '超低价交易', level: '低危', description: '价格略低于市场均价5%，需关注', relatedOrder: 'PO-202606120', amount: 8500, detectTime: '2026-06-15 16:20:45', handler: '-', status: '待处理' },
  { warningNo: 'WARN-202606006', type: '重复订单', level: '低危', description: '相似订单间隔较短，人工确认', relatedOrder: 'PO-202606118', amount: 6200, detectTime: '2026-06-15 14:10:30', handler: '王主管', status: '已处理' },
  { warningNo: 'WARN-202606007', type: '异常退货', level: '中危', description: '单批次退货数量异常偏高', relatedOrder: 'RT-202606042', amount: 15800, detectTime: '2026-06-15 11:05:20', handler: '赵经理', status: '已处理' },
  { warningNo: 'WARN-202606008', type: '超低价交易', level: '高危', description: '批量采购价远低于正常市场价', relatedOrder: 'PO-202606112', amount: 256000, detectTime: '2026-06-14 20:15:00', handler: '李总监', status: '已处理' }
])

const ruleList = ref([
  { ruleName: '超低价检测规则', ruleType: '价格规则', condition: '订单价格 < 成本价 * 0.8', action: '自动冻结 + 派单', triggerCount: 45, accuracy: 95.2, enabled: true },
  { ruleName: '重复订单检测', ruleType: '行为规则', condition: '同一供应商30分钟内相同SKU订单 > 2', action: '标记预警 + 审核', triggerCount: 28, accuracy: 88.6, enabled: true },
  { ruleName: '异常退货检测', ruleType: '行为规则', condition: '账号7天退货率 > 50%', action: '自动冻结 + 人工审核', triggerCount: 18, accuracy: 92.3, enabled: true },
  { ruleName: '新账号突增检测', ruleType: '账号规则', condition: '新账号首单金额 > 10万', action: '人工审核', triggerCount: 12, accuracy: 78.5, enabled: true },
  { ruleName: '夜间异常交易', ruleType: '时间规则', condition: '凌晨2-6点大额交易', action: '标记预警', triggerCount: 8, accuracy: 65.2, enabled: false }
])

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

const getRuleType = (type) => {
  const map = { '价格规则': 'danger', '行为规则': 'warning', '账号规则': 'primary', '时间规则': 'info' }
  return map[type] || 'info'
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
  height: 240px;
}

.filter-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.table-card, .rules-card {
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

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.mt-20 {
  margin-top: 20px;
}
</style>
