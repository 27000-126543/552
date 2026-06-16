<template>
  <div class="suppliers-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="page-title">供应商管理</h2>
        <p class="page-desc">管理多渠道接入的供应商信息，支持API、EDI及邮件自动解析</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">新增供应商</el-button>
        <el-button :icon="Upload">批量导入</el-button>
        <el-button :icon="Connection">接入配置</el-button>
      </div>
    </div>

    <div class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="供应商名称">
          <el-input v-model="filterForm.name" placeholder="请输入" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="供应商等级">
          <el-select v-model="filterForm.level" placeholder="全部" clearable style="width: 140px">
            <el-option label="A级" value="A" />
            <el-option label="B级" value="B" />
            <el-option label="C级" value="C" />
            <el-option label="D级" value="D" />
          </el-select>
        </el-form-item>
        <el-form-item label="接入方式">
          <el-select v-model="filterForm.accessType" placeholder="全部" clearable style="width: 140px">
            <el-option label="API" value="api" />
            <el-option label="EDI" value="edi" />
            <el-option label="邮件" value="email" />
            <el-option label="手工录入" value="manual" />
          </el-select>
        </el-form-item>
        <el-form-item label="品类">
          <el-select v-model="filterForm.category" placeholder="全部" clearable style="width: 140px">
            <el-option label="电子产品" value="electronics" />
            <el-option label="食品饮料" value="food" />
            <el-option label="服装鞋帽" value="clothing" />
            <el-option label="家居用品" value="home" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">搜索</el-button>
          <el-button :icon="RefreshLeft">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-label">供应商总数</div>
          <div class="stat-value">1,256</div>
          <div class="stat-sub">较上月 +5.2%</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-label">活跃供应商</div>
          <div class="stat-value">862</div>
          <div class="stat-sub">占比 68.6%</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-label">A级供应商</div>
          <div class="stat-value">158</div>
          <div class="stat-sub">占比 12.6%</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-label">待审核</div>
          <div class="stat-value">28</div>
          <div class="stat-sub">需处理</div>
        </div>
      </el-col>
    </el-row>

    <div class="table-card">
      <div class="table-header">
        <span class="table-title">供应商列表</span>
        <div class="table-actions">
          <el-radio-group v-model="viewType" size="small">
            <el-radio-button label="table">列表</el-radio-button>
            <el-radio-button label="card">卡片</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      
      <el-table :data="supplierList" style="width: 100%">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="code" label="供应商编码" width="120" />
        <el-table-column prop="name" label="供应商名称" min-width="200">
          <template #default="{ row }">
            <div class="supplier-name-cell">
              <el-avatar size="small" :style="{ backgroundColor: getAvatarColor(row.name) }">
                {{ row.name.charAt(0) }}
              </el-avatar>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="等级" width="80">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)" size="small">{{ row.level }}级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="主营品类" width="120" />
        <el-table-column prop="accessType" label="接入方式" width="100">
          <template #default="{ row }">
            <el-tag :type="getAccessType(row.accessType)" effect="plain" size="small">
              {{ row.accessType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="综合评分" width="120" sortable>
          <template #default="{ row }">
            <div class="score-cell">
              <el-progress :percentage="row.score" :color="getScoreColor(row.score)" :stroke-width="6" />
              <span class="score-text">{{ row.score }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryRate" label="准时交付率" width="110">
          <template #default="{ row }">
            <span class="text-success">{{ row.deliveryRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="cooperationTime" label="合作年限" width="100" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '活跃' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default>
            <el-button type="primary" link size="small">详情</el-button>
            <el-button type="primary" link size="small">编辑</el-button>
            <el-button type="danger" link size="small">停用</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="1256"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Upload, Connection, Search, RefreshLeft } from '@element-plus/icons-vue'

const viewType = ref('table')
const currentPage = ref(1)
const pageSize = ref(10)

const filterForm = ref({
  name: '',
  level: '',
  accessType: '',
  category: ''
})

const supplierList = ref([
  { code: 'SUP-001', name: '深圳科创电子有限公司', level: 'A', category: '电子产品', accessType: 'API', score: 92, deliveryRate: 98.5, cooperationTime: '5年', status: 'active' },
  { code: 'SUP-002', name: '广州优品贸易有限公司', level: 'A', category: '食品饮料', accessType: 'EDI', score: 88, deliveryRate: 96.2, cooperationTime: '3年', status: 'active' },
  { code: 'SUP-003', name: '杭州时尚服饰有限公司', level: 'B', category: '服装鞋帽', accessType: 'API', score: 78, deliveryRate: 92.8, cooperationTime: '2年', status: 'active' },
  { code: 'SUP-004', name: '北京家居优品公司', level: 'B', category: '家居用品', accessType: '邮件', score: 75, deliveryRate: 90.5, cooperationTime: '4年', status: 'active' },
  { code: 'SUP-005', name: '上海美妆科技公司', level: 'A', category: '美妆个护', accessType: 'API', score: 90, deliveryRate: 97.8, cooperationTime: '6年', status: 'active' },
  { code: 'SUP-006', name: '江苏食品集团', level: 'B', category: '食品饮料', accessType: 'EDI', score: 82, deliveryRate: 94.3, cooperationTime: '3年', status: 'active' },
  { code: 'SUP-007', name: '东莞数码配件厂', level: 'C', category: '电子产品', accessType: '手工录入', score: 68, deliveryRate: 85.6, cooperationTime: '1年', status: 'active' },
  { code: 'SUP-008', name: '宁波服装织造厂', level: 'C', category: '服装鞋帽', accessType: '邮件', score: 65, deliveryRate: 82.9, cooperationTime: '2年', status: 'inactive' },
  { code: 'SUP-009', name: '成都家居用品公司', level: 'B', category: '家居用品', accessType: 'API', score: 80, deliveryRate: 93.1, cooperationTime: '3年', status: 'active' },
  { code: 'SUP-010', name: '武汉食品加工有限公司', level: 'B', category: '食品饮料', accessType: 'EDI', score: 76, deliveryRate: 91.7, cooperationTime: '2年', status: 'active' }
])

const getLevelType = (level) => {
  const map = { A: 'success', B: 'warning', C: 'info', D: 'danger' }
  return map[level] || 'info'
}

const getAccessType = (type) => {
  const map = { 'API': 'success', 'EDI': 'primary', '邮件': 'warning', '手工录入': 'info' }
  return map[type] || 'info'
}

const getScoreColor = (score) => {
  if (score >= 90) return '#67c23a'
  if (score >= 80) return '#409eff'
  if (score >= 70) return '#e6a23c'
  return '#f56c6c'
}

const getAvatarColor = (name) => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#9b59b6', '#1abc9c', '#e74c3c']
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}
</script>

<style scoped>
.suppliers-page {
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

.filter-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}

.stat-row {
  margin-bottom: 16px;
}

.stat-item {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 26px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.stat-sub {
  font-size: 12px;
  color: #67c23a;
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

.supplier-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-cell .el-progress {
  flex: 1;
}

.score-text {
  font-size: 12px;
  color: #606266;
  width: 30px;
}

.text-success {
  color: #67c23a;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
