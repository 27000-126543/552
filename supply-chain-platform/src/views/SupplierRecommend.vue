<template>
  <div class="recommend-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="page-title">智能供应商推荐</h2>
        <p class="page-desc">基于历史交易、交付准时率、质量评分及动态市场行情，自动生成优选供应商列表</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="MagicStick">重新推荐</el-button>
        <el-button :icon="Setting">推荐规则配置</el-button>
      </div>
    </div>

    <div class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="需求品类">
          <el-select v-model="filterForm.category" placeholder="请选择" style="width: 160px">
            <el-option label="电子产品" value="electronics" />
            <el-option label="食品饮料" value="food" />
            <el-option label="服装鞋帽" value="clothing" />
            <el-option label="家居用品" value="home" />
          </el-select>
        </el-form-item>
        <el-form-item label="采购数量">
          <el-input v-model="filterForm.quantity" placeholder="请输入" style="width: 140px">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="目标价格">
          <el-input v-model="filterForm.targetPrice" placeholder="请输入" style="width: 140px">
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="交付期限">
          <el-date-picker v-model="filterForm.deadline" type="date" placeholder="选择日期" style="width: 180px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search">开始推荐</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row :gutter="16">
      <el-col :span="18">
        <div class="recommend-card">
          <div class="card-header">
            <span class="card-title">推荐供应商列表</span>
            <span class="card-subtitle">共找到 {{ recommendList.length }} 家匹配供应商，按综合评分排序</span>
          </div>

          <div class="recommend-list">
            <div v-for="(item, index) in recommendList" :key="item.id" class="recommend-item" :class="{ 'top-3': index < 3 }">
              <div class="rank-badge">
                <span class="rank-num">{{ index + 1 }}</span>
              </div>
              
              <div class="supplier-info">
                <div class="supplier-header">
                  <el-avatar :size="48" :style="{ backgroundColor: getAvatarColor(item.name) }">
                    {{ item.name.charAt(0) }}
                  </el-avatar>
                  <div class="supplier-basic">
                    <div class="supplier-name">
                      {{ item.name }}
                      <el-tag v-if="index === 0" type="danger" effect="dark" size="small" style="margin-left: 8px">首选推荐</el-tag>
                      <el-tag v-if="item.level === 'A'" type="success" size="small" style="margin-left: 6px">A级</el-tag>
                    </div>
                    <div class="supplier-meta">
                      <span class="meta-item">
                        <el-icon><OfficeBuilding /></el-icon>
                        {{ item.category }}
                      </span>
                      <span class="meta-item">
                        <el-icon><Clock /></el-icon>
                        {{ item.cooperationTime }}合作
                      </span>
                      <span class="meta-item">
                        <el-icon><Connection /></el-icon>
                        {{ item.accessType }}接入
                      </span>
                    </div>
                  </div>
                </div>

                <div class="score-section">
                  <div class="score-item">
                    <div class="score-label">综合评分</div>
                    <div class="score-value" :style="{ color: getScoreColor(item.totalScore) }">{{ item.totalScore }}</div>
                    <el-progress :percentage="item.totalScore" :color="getScoreColor(item.totalScore)" :stroke-width="4" />
                  </div>
                  <div class="score-detail">
                    <div class="detail-row">
                      <span class="detail-label">报价价格</span>
                      <span class="detail-value price">¥{{ item.price }}<span class="price-unit">/件</span></span>
                      <el-tag :type="item.priceLevel === '低' ? 'success' : item.priceLevel === '中' ? 'warning' : 'danger'" size="small">
                        价格{{ item.priceLevel }}
                      </el-tag>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">交付准时率</span>
                      <span class="detail-value text-success">{{ item.deliveryRate }}%</span>
                      <el-progress :percentage="item.deliveryRate" color="#67c23a" :stroke-width="4" style="width: 120px" />
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">质量评分</span>
                      <span class="detail-value">{{ item.qualityScore }}</span>
                      <el-progress :percentage="item.qualityScore" color="#409eff" :stroke-width="4" style="width: 120px" />
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">预计交付</span>
                      <span class="detail-value">{{ item.estimatedDelivery }}天</span>
                      <span class="delivery-note">{{ item.deliveryNote }}</span>
                    </div>
                  </div>
                </div>

                <div class="action-section">
                  <el-button type="primary" size="small">发起询价</el-button>
                  <el-button size="small">查看详情</el-button>
                  <el-button size="small" type="success">加入合作</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="side-card">
          <div class="card-header">
            <span class="card-title">推荐维度分析</span>
          </div>
          <v-chart :option="radarOption" autoresize class="radar-chart" />
        </div>

        <div class="side-card">
          <div class="card-header">
            <span class="card-title">市场行情</span>
          </div>
          <div class="market-info">
            <div class="market-item">
              <span class="market-label">品类均价</span>
              <span class="market-value">¥{{ avgPrice }}</span>
              <span class="market-trend up">↑ 2.3%</span>
            </div>
            <div class="market-item">
              <span class="market-label">价格波动</span>
              <span class="market-value">中</span>
              <span class="market-note">近30天</span>
            </div>
            <div class="market-item">
              <span class="market-label">供需指数</span>
              <span class="market-value">1.25</span>
              <span class="market-note">供大于求</span>
            </div>
            <div class="market-item">
              <span class="market-label">新增供应商</span>
              <span class="market-value">+28</span>
              <span class="market-note">本月</span>
            </div>
          </div>
        </div>

        <div class="side-card">
          <div class="card-header">
            <span class="card-title">推荐规则权重</span>
          </div>
          <div class="weight-list">
            <div class="weight-item">
              <span class="weight-label">价格竞争力</span>
              <div class="weight-bar">
                <div class="weight-fill" style="width: 30%; background: #409eff"></div>
              </div>
              <span class="weight-value">30%</span>
            </div>
            <div class="weight-item">
              <span class="weight-label">交付准时率</span>
              <div class="weight-bar">
                <div class="weight-fill" style="width: 25%; background: #67c23a"></div>
              </div>
              <span class="weight-value">25%</span>
            </div>
            <div class="weight-item">
              <span class="weight-label">产品质量</span>
              <div class="weight-bar">
                <div class="weight-fill" style="width: 25%; background: #e6a23c"></div>
              </div>
              <span class="weight-value">25%</span>
            </div>
            <div class="weight-item">
              <span class="weight-label">服务响应</span>
              <div class="weight-bar">
                <div class="weight-fill" style="width: 15%; background: #9b59b6"></div>
              </div>
              <span class="weight-value">15%</span>
            </div>
            <div class="weight-item">
              <span class="weight-label">合作年限</span>
              <div class="weight-bar">
                <div class="weight-fill" style="width: 5%; background: #909399"></div>
              </div>
              <span class="weight-value">5%</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MagicStick, Setting, Search, OfficeBuilding, Clock, Connection } from '@element-plus/icons-vue'

const filterForm = ref({
  category: 'electronics',
  quantity: 1000,
  targetPrice: 150,
  deadline: ''
})

const avgPrice = ref('168.50')

const recommendList = ref([
  { id: 1, name: '深圳科创电子有限公司', category: '电子产品', level: 'A', accessType: 'API', totalScore: 95, price: 145, priceLevel: '低', deliveryRate: 98.5, qualityScore: 94, estimatedDelivery: 2, deliveryNote: '次日达', cooperationTime: '5年' },
  { id: 2, name: '上海智造科技公司', category: '电子产品', level: 'A', accessType: 'API', totalScore: 90, price: 152, priceLevel: '低', deliveryRate: 96.8, qualityScore: 92, estimatedDelivery: 3, deliveryNote: '三日内', cooperationTime: '3年' },
  { id: 3, name: '东莞精密电子厂', category: '电子产品', level: 'B', accessType: 'EDI', totalScore: 85, price: 138, priceLevel: '低', deliveryRate: 92.5, qualityScore: 88, estimatedDelivery: 5, deliveryNote: '一周内', cooperationTime: '2年' },
  { id: 4, name: '广州电子科技集团', category: '电子产品', level: 'B', accessType: 'API', totalScore: 82, price: 158, priceLevel: '中', deliveryRate: 94.2, qualityScore: 85, estimatedDelivery: 3, deliveryNote: '三日内', cooperationTime: '4年' },
  { id: 5, name: '苏州数码配件厂', category: '电子产品', level: 'B', accessType: '邮件', totalScore: 78, price: 142, priceLevel: '低', deliveryRate: 90.8, qualityScore: 82, estimatedDelivery: 4, deliveryNote: '四日内', cooperationTime: '1年' },
  { id: 6, name: '杭州电子制造公司', category: '电子产品', level: 'C', accessType: '手工录入', totalScore: 72, price: 135, priceLevel: '低', deliveryRate: 85.6, qualityScore: 78, estimatedDelivery: 7, deliveryNote: '一周以上', cooperationTime: '1年' }
])

const radarOption = computed(() => ({
  tooltip: {},
  radar: {
    indicator: [
      { name: '价格竞争力', max: 100 },
      { name: '交付准时率', max: 100 },
      { name: '产品质量', max: 100 },
      { name: '服务响应', max: 100 },
      { name: '合作稳定性', max: 100 }
    ],
    radius: '70%'
  },
  series: [{
    type: 'radar',
    data: [
      {
        value: [95, 98, 94, 90, 92],
        name: '首选供应商',
        areaStyle: { color: 'rgba(64, 158, 255, 0.3)' },
        itemStyle: { color: '#409eff' },
        lineStyle: { color: '#409eff' }
      }
    ]
  }]
}))

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
.recommend-page {
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

.recommend-card, .side-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}

.card-header {
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-subtitle {
  font-size: 12px;
  color: #909399;
  margin-left: 12px;
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommend-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  transition: all 0.3s;
}

.recommend-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.15);
}

.recommend-item.top-3 {
  border-color: #e6a23c;
  background: linear-gradient(135deg, #fdf6ec 0%, #fff 100%);
}

.rank-badge {
  flex-shrink: 0;
}

.rank-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f0f2f5;
  color: #909399;
  font-weight: 600;
  font-size: 14px;
}

.top-3 .rank-badge .rank-num {
  background: linear-gradient(135deg, #e6a23c 0%, #f56c6c 100%);
  color: #fff;
}

.supplier-info {
  flex: 1;
  display: flex;
  gap: 24px;
}

.supplier-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.supplier-basic {
  flex: 1;
}

.supplier-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
}

.supplier-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.score-section {
  display: flex;
  gap: 24px;
  flex: 1;
}

.score-item {
  width: 100px;
  text-align: center;
}

.score-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.score-value {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 4px;
}

.score-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.detail-label {
  width: 70px;
  color: #909399;
}

.detail-value {
  width: 60px;
  font-weight: 600;
  color: #303133;
}

.detail-value.price {
  color: #f56c6c;
  font-size: 16px;
}

.price-unit {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
}

.delivery-note {
  font-size: 12px;
  color: #909399;
}

.text-success {
  color: #67c23a;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.radar-chart {
  width: 100%;
  height: 220px;
}

.market-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.market-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.market-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.market-label {
  font-size: 13px;
  color: #909399;
}

.market-value {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.market-trend {
  font-size: 12px;
  font-weight: 500;
}

.market-trend.up {
  color: #f56c6c;
}

.market-trend.down {
  color: #67c23a;
}

.market-note {
  font-size: 12px;
  color: #909399;
}

.weight-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.weight-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weight-label {
  width: 80px;
  font-size: 13px;
  color: #606266;
}

.weight-bar {
  flex: 1;
  height: 6px;
  background: #f0f2f5;
  border-radius: 3px;
  overflow: hidden;
}

.weight-fill {
  height: 100%;
  border-radius: 3px;
}

.weight-value {
  width: 40px;
  text-align: right;
  font-size: 12px;
  color: #909399;
}
</style>
