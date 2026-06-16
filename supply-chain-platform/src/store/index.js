import { reactive, computed, watch } from 'vue'

const STORAGE_KEY = 'supply_chain_platform_state'

const defaultState = {
  user: {
    isLoggedIn: false,
    username: '',
    avatar: ''
  },
  suppliers: {
    all: [
      { code: 'SUP-001', name: '深圳科创电子有限公司', level: 'A', category: '电子产品', accessType: 'API', score: 92, deliveryRate: 98.5, cooperationTime: '5年', status: 'active' },
      { code: 'SUP-002', name: '广州优品贸易有限公司', level: 'A', category: '食品饮料', accessType: 'EDI', score: 88, deliveryRate: 96.2, cooperationTime: '3年', status: 'active' },
      { code: 'SUP-003', name: '杭州时尚服饰有限公司', level: 'B', category: '服装鞋帽', accessType: 'API', score: 78, deliveryRate: 92.8, cooperationTime: '2年', status: 'active' },
      { code: 'SUP-004', name: '北京家居优品公司', level: 'B', category: '家居用品', accessType: '邮件', score: 75, deliveryRate: 90.5, cooperationTime: '4年', status: 'active' },
      { code: 'SUP-005', name: '上海美妆科技公司', level: 'A', category: '美妆个护', accessType: 'API', score: 90, deliveryRate: 97.8, cooperationTime: '6年', status: 'active' },
      { code: 'SUP-006', name: '江苏食品集团', level: 'B', category: '食品饮料', accessType: 'EDI', score: 82, deliveryRate: 94.3, cooperationTime: '3年', status: 'active' },
      { code: 'SUP-007', name: '东莞数码配件厂', level: 'C', category: '电子产品', accessType: '手工录入', score: 68, deliveryRate: 85.6, cooperationTime: '1年', status: 'active' },
      { code: 'SUP-008', name: '宁波服装织造厂', level: 'C', category: '服装鞋帽', accessType: '邮件', score: 65, deliveryRate: 82.9, cooperationTime: '2年', status: 'inactive' },
      { code: 'SUP-009', name: '成都家居用品公司', level: 'B', category: '家居用品', accessType: 'API', score: 80, deliveryRate: 93.1, cooperationTime: '3年', status: 'active' },
      { code: 'SUP-010', name: '武汉食品加工有限公司', level: 'B', category: '食品饮料', accessType: 'EDI', score: 76, deliveryRate: 91.7, cooperationTime: '2年', status: 'active' },
      { code: 'SUP-011', name: '深圳创新电子厂', level: 'A', category: '电子产品', accessType: 'API', score: 91, deliveryRate: 97.2, cooperationTime: '4年', status: 'active' },
      { code: 'SUP-012', name: '广州食品有限公司', level: 'C', category: '食品饮料', accessType: '手工录入', score: 62, deliveryRate: 80.5, cooperationTime: '1年', status: 'inactive' }
    ],
    filter: {
      name: '',
      level: '',
      accessType: '',
      category: ''
    }
  },
  purchases: {
    all: [
      { orderNo: 'PO-202606001', title: '智能手机批量采购申请', category: '电子产品', amount: 528000, applicant: '张三', applyDate: '2026-06-15', urgency: '紧急', status: 'pending', currentApprover: '李经理' },
      { orderNo: 'PO-202606002', title: '进口食品补货申请', category: '食品饮料', amount: 156000, applicant: '李四', applyDate: '2026-06-14', urgency: '普通', status: 'approving', currentApprover: '王总监' },
      { orderNo: 'PO-202606003', title: '夏季服装新品采购', category: '服装鞋帽', amount: 385000, applicant: '王五', applyDate: '2026-06-14', urgency: '一般', status: 'approved', currentApprover: '已完成' },
      { orderNo: 'PO-202606004', title: '家居用品补货申请', category: '家居用品', amount: 98000, applicant: '赵六', applyDate: '2026-06-13', urgency: '普通', status: 'rejected', currentApprover: '已驳回' },
      { orderNo: 'PO-202606005', title: '电子产品配件采购', category: '电子产品', amount: 245000, applicant: '钱七', applyDate: '2026-06-12', urgency: '紧急', status: 'pending', currentApprover: '李经理' },
      { orderNo: 'PO-202606006', title: '美妆产品季度采购', category: '美妆个护', amount: 189000, applicant: '孙八', applyDate: '2026-06-11', urgency: '普通', status: 'approving', currentApprover: '王总监' },
      { orderNo: 'PO-202606007', title: '食品饮料节日备货', category: '食品饮料', amount: 620000, applicant: '周九', applyDate: '2026-06-10', urgency: '紧急', status: 'approved', currentApprover: '已完成' },
      { orderNo: 'PO-202606008', title: '运动服装批量采购', category: '服装鞋帽', amount: 278000, applicant: '吴十', applyDate: '2026-06-09', urgency: '一般', status: 'pending', currentApprover: '李经理' },
      { orderNo: 'PO-202606009', title: '智能家居设备采购', category: '家居用品', amount: 456000, applicant: '郑十一', applyDate: '2026-06-08', urgency: '普通', status: 'approved', currentApprover: '已完成' },
      { orderNo: 'PO-202606010', title: '数码配件补货申请', category: '电子产品', amount: 89000, applicant: '冯十二', applyDate: '2026-06-07', urgency: '一般', status: 'approving', currentApprover: '张经理' },
      { orderNo: 'PO-202606011', title: '进口红酒采购', category: '食品饮料', amount: 320000, applicant: '张三', applyDate: '2026-06-06', urgency: '普通', status: 'pending', currentApprover: '李经理' },
      { orderNo: 'PO-202606012', title: '冬季服装采购', category: '服装鞋帽', amount: 420000, applicant: '李四', applyDate: '2026-06-05', urgency: '一般', status: 'approved', currentApprover: '已完成' }
    ],
    filter: {
      orderNo: '',
      status: '',
      category: '',
      dateRange: [],
      urgency: '',
      applicant: ''
    },
    activeTab: 'all'
  },
  warnings: {
    all: [
      { warningNo: 'WARN-202606001', type: '超低价交易', level: '高危', description: '订单价格低于成本价30%，疑似异常定价', relatedOrder: 'PO-202606125', amount: 52800, detectTime: '2026-06-16 10:25:30', handler: '-', status: '待处理', frozen: false, workOrder: '' },
      { warningNo: 'WARN-202606002', type: '重复订单', level: '中危', description: '同一供应商30分钟内重复提交相同SKU订单', relatedOrder: 'PO-202606128', amount: 18900, detectTime: '2026-06-16 09:15:20', handler: '张主管', status: '处理中', frozen: false, workOrder: 'WO-202606002' },
      { warningNo: 'WARN-202606003', type: '异常退货', level: '高危', description: '某账号近7天退货率达85%，疑似恶意退货', relatedOrder: 'RT-202606045', amount: 25600, detectTime: '2026-06-16 08:45:10', handler: '-', status: '待处理', frozen: true, workOrder: '' },
      { warningNo: 'WARN-202606004', type: '异常账号', level: '中危', description: '新注册账号下单金额突增，存在风险', relatedOrder: 'PO-202606130', amount: 128000, detectTime: '2026-06-15 18:30:00', handler: '李经理', status: '处理中', frozen: false, workOrder: 'WO-202606004' },
      { warningNo: 'WARN-202606005', type: '超低价交易', level: '低危', description: '价格略低于市场均价5%，需关注', relatedOrder: 'PO-202606120', amount: 8500, detectTime: '2026-06-15 16:20:45', handler: '-', status: '待处理', frozen: false, workOrder: '' },
      { warningNo: 'WARN-202606006', type: '重复订单', level: '低危', description: '相似订单间隔较短，人工确认', relatedOrder: 'PO-202606118', amount: 6200, detectTime: '2026-06-15 14:10:30', handler: '王主管', status: '已处理', frozen: false, workOrder: 'WO-202606006' },
      { warningNo: 'WARN-202606007', type: '异常退货', level: '中危', description: '单批次退货数量异常偏高', relatedOrder: 'RT-202606042', amount: 15800, detectTime: '2026-06-15 11:05:20', handler: '赵经理', status: '已处理', frozen: true, workOrder: 'WO-202606007' },
      { warningNo: 'WARN-202606008', type: '超低价交易', level: '高危', description: '批量采购价远低于正常市场价', relatedOrder: 'PO-202606112', amount: 256000, detectTime: '2026-06-14 20:15:00', handler: '李总监', status: '已处理', frozen: true, workOrder: 'WO-202606008' }
    ],
    filter: {
      type: '',
      level: '',
      status: '',
      keyword: '',
      frozen: ''
    },
    activeTab: 'all'
  },
  pricings: {
    all: [
      { skuCode: 'SKU-001', skuName: '智能手机 128G 黑色', category: '电子产品', currentPrice: 2599, suggestedPrice: 2699, priceChange: 3.8, cost: 1899, competitorPrice: 2799, supplyDemand: 85, reason: '竞品涨价，需求旺盛', status: '待审批' },
      { skuCode: 'SKU-002', skuName: '无线蓝牙耳机 Pro', category: '电子产品', currentPrice: 399, suggestedPrice: 379, priceChange: -5.0, cost: 210, competitorPrice: 429, supplyDemand: 62, reason: '促销活动期，提升销量', status: '待审批' },
      { skuCode: 'SKU-003', skuName: '进口牛奶 1L*12', category: '食品饮料', currentPrice: 128, suggestedPrice: 138, priceChange: 7.8, cost: 86, competitorPrice: 132, supplyDemand: 92, reason: '原材料涨价，供需紧张', status: '已通过' },
      { skuCode: 'SKU-004', skuName: '运动休闲外套', category: '服装鞋帽', currentPrice: 459, suggestedPrice: 399, priceChange: -13.1, cost: 220, competitorPrice: 429, supplyDemand: 45, reason: '换季清仓，库存偏高', status: '待审批' },
      { skuCode: 'SKU-005', skuName: '智能扫地机器人', category: '家居用品', currentPrice: 1899, suggestedPrice: 1999, priceChange: 5.3, cost: 1299, competitorPrice: 2099, supplyDemand: 78, reason: '新品上市，竞品定价高', status: '已驳回' },
      { skuCode: 'SKU-006', skuName: '保湿面霜 50ml', category: '美妆个护', currentPrice: 298, suggestedPrice: 308, priceChange: 3.4, cost: 120, competitorPrice: 328, supplyDemand: 88, reason: '竞品涨价，需求稳定', status: '待审批' },
      { skuCode: 'SKU-007', skuName: '平板电脑 256G', category: '电子产品', currentPrice: 3599, suggestedPrice: 3499, priceChange: -2.8, cost: 2699, competitorPrice: 3699, supplyDemand: 65, reason: '促销活动，冲销量', status: '已通过' },
      { skuCode: 'SKU-008', skuName: '有机坚果礼盒装', category: '食品饮料', currentPrice: 168, suggestedPrice: 158, priceChange: -6.0, cost: 98, competitorPrice: 178, supplyDemand: 55, reason: '节日后需求回落', status: '待审批' },
      { skuCode: 'SKU-009', skuName: '夏季连衣裙', category: '服装鞋帽', currentPrice: 328, suggestedPrice: 288, priceChange: -12.2, cost: 150, competitorPrice: 318, supplyDemand: 50, reason: '换季促销', status: '待审批' },
      { skuCode: 'SKU-010', skuName: '北欧风格沙发', category: '家居用品', currentPrice: 3299, suggestedPrice: 3499, priceChange: 6.1, cost: 2200, competitorPrice: 3599, supplyDemand: 82, reason: '原材料成本上涨', status: '待审批' }
    ],
    filter: {
      status: '',
      keyword: '',
      category: ''
    }
  },
  approvalTodos: [
    { id: 1, title: '智能手机批量采购申请', type: '采购审批', time: '10分钟前' },
    { id: 2, title: '2026年度供应商框架合同', type: '合同审批', time: '1小时前' },
    { id: 3, title: '6月供应商货款结算', type: '付款结算', time: '2小时前' },
    { id: 4, title: '新供应商准入审核', type: '供应商准入', time: '昨天' },
    { id: 5, title: 'SKU-001 调价审批', type: '调价审批', time: '30分钟前' },
    { id: 6, title: 'SKU-002 调价审批', type: '调价审批', time: '25分钟前' },
    { id: 7, title: 'SKU-004 调价审批', type: '调价审批', time: '20分钟前' },
    { id: 8, title: 'SKU-006 调价审批', type: '调价审批', time: '15分钟前' },
    { id: 9, title: 'SKU-008 调价审批', type: '调价审批', time: '10分钟前' },
    { id: 10, title: 'SKU-009 调价审批', type: '调价审批', time: '5分钟前' },
    { id: 11, title: 'SKU-010 调价审批', type: '调价审批', time: '刚刚' }
  ],
  skuList: [
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
  ]
}

function loadState() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return deepMerge(defaultState, parsed)
    }
  } catch (e) {
    console.warn('Failed to load state from sessionStorage:', e)
  }
  return JSON.parse(JSON.stringify(defaultState))
}

function deepMerge(target, source) {
  const result = { ...target }
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key])
    } else if (source[key] !== undefined) {
      result[key] = source[key]
    }
  }
  return result
}

function saveState(stateToSave) {
  try {
    const data = {
      user: stateToSave.user,
      pricings: { all: stateToSave.pricings.all },
      warnings: { all: stateToSave.warnings.all },
      approvalTodos: stateToSave.approvalTodos,
      purchases: { all: stateToSave.purchases.all },
      suppliers: { all: stateToSave.suppliers.all }
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save state to sessionStorage:', e)
  }
}

const state = reactive(loadState())

const getters = {
  filteredSuppliers: computed(() => {
    const f = state.suppliers.filter
    return state.suppliers.all.filter(item => {
      if (f.name && !item.name.toLowerCase().includes(f.name.toLowerCase())) return false
      if (f.level && item.level !== f.level) return false
      if (f.accessType && item.accessType !== f.accessType) return false
      if (f.category && item.category !== f.category) return false
      return true
    })
  }),
  filteredPurchases: computed(() => {
    const f = state.purchases.filter
    const tab = state.purchases.activeTab
    return state.purchases.all.filter(item => {
      if (f.orderNo && !item.orderNo.toLowerCase().includes(f.orderNo.toLowerCase())) return false
      if (f.status && item.status !== f.status) return false
      if (f.category && item.category !== f.category) return false
      if (f.urgency && item.urgency !== f.urgency) return false
      if (f.applicant && !item.applicant.includes(f.applicant)) return false
      if (tab === 'my' && item.applicant !== '张三') return false
      if (tab === 'todo' && item.status !== 'pending' && item.status !== 'approving') return false
      return true
    })
  }),
  filteredWarnings: computed(() => {
    const f = state.warnings.filter
    const tab = state.warnings.activeTab
    return state.warnings.all.filter(item => {
      if (f.type && item.type !== f.type) return false
      if (f.level && item.level !== f.level) return false
      if (f.keyword) {
        const kw = f.keyword.toLowerCase()
        if (!item.warningNo.toLowerCase().includes(kw) && !item.description.includes(f.keyword)) return false
      }
      if (f.frozen !== '' && f.frozen !== undefined && f.frozen !== null) {
        const isFrozen = f.frozen === 'true' || f.frozen === true
        if (item.frozen !== isFrozen) return false
      }
      if (tab === 'pending' && item.status !== '待处理') return false
      if (tab === 'processing' && item.status !== '处理中') return false
      if (tab === 'resolved' && item.status !== '已处理') return false
      return true
    })
  }),
  pendingPricings: computed(() => state.pricings.all.filter(p => p.status === '待审批')),
  priceApprovalTodos: computed(() => state.approvalTodos.filter(t => t.type === '调价审批')),
  filteredPricings: computed(() => {
    const f = state.pricings.filter
    return state.pricings.all.filter(item => {
      if (f.status && item.status !== f.status) return false
      if (f.keyword) {
        const kw = f.keyword.toLowerCase()
        if (!item.skuCode.toLowerCase().includes(kw) && !item.skuName.toLowerCase().includes(kw)) return false
      }
      if (f.category && item.category !== f.category) return false
      return true
    })
  })
}

const actions = {
  login(username, password) {
    state.user.isLoggedIn = true
    state.user.username = username
    state.user.avatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    saveState(state)
    return true
  },
  logout() {
    state.user.isLoggedIn = false
    state.user.username = ''
    state.user.avatar = ''
    saveState(state)
  },
  resetSupplierFilter() {
    state.suppliers.filter = { name: '', level: '', accessType: '', category: '' }
  },
  toggleSupplierStatus(code) {
    const s = state.suppliers.all.find(x => x.code === code)
    if (s) {
      s.status = s.status === 'active' ? 'inactive' : 'active'
      saveState(state)
    }
  },
  resetPurchaseFilter() {
    state.purchases.filter = { orderNo: '', status: '', category: '', dateRange: [], urgency: '', applicant: '' }
    state.purchases.activeTab = 'all'
  },
  resetWarningFilter() {
    state.warnings.filter = { type: '', level: '', status: '', keyword: '', frozen: '' }
  },
  resetPricingFilter() {
    state.pricings.filter = { status: '', keyword: '', category: '' }
  },
  approvePricing(skuCodes, pass = true) {
    const codes = Array.isArray(skuCodes) ? skuCodes : [skuCodes]
    state.pricings.all.forEach(p => {
      if (codes.includes(p.skuCode) && p.status === '待审批') {
        p.status = pass ? '已通过' : '已驳回'
        state.approvalTodos = state.approvalTodos.filter(t => !t.title.includes(p.skuCode))
      }
    })
    saveState(state)
  },
  approvePurchase(orderNo, pass = true) {
    const p = state.purchases.all.find(x => x.orderNo === orderNo)
    if (p && (p.status === 'pending' || p.status === 'approving')) {
      p.status = pass ? 'approved' : 'rejected'
      p.currentApprover = pass ? '已完成' : '已驳回'
      state.approvalTodos = state.approvalTodos.filter(t => t.type !== '采购审批' || t.title !== p.title)
    }
    saveState(state)
  },
  handleWarning(warningNo, handler = '管理员') {
    const w = state.warnings.all.find(x => x.warningNo === warningNo)
    if (w) {
      w.status = '处理中'
      w.handler = handler
      saveState(state)
    }
  },
  dispatchWarning(warningNo) {
    const w = state.warnings.all.find(x => x.warningNo === warningNo)
    if (w) {
      w.status = '处理中'
      w.handler = w.handler === '-' ? '张主管' : w.handler
      w.frozen = true
      const num = parseInt(warningNo.replace('WARN-', ''))
      w.workOrder = `WO-${num.toString().padStart(8, '0')}`
      saveState(state)
    }
  },
  resolveWarning(warningNo) {
    const w = state.warnings.all.find(x => x.warningNo === warningNo)
    if (w) {
      w.status = '已处理'
      saveState(state)
    }
  },
  addPriceApprovalTodo(item) {
    const exists = state.approvalTodos.some(t => t.title.includes(item.skuCode))
    if (!exists) {
      state.approvalTodos.push({
        id: Date.now(),
        title: `${item.skuCode} 调价审批`,
        type: '调价审批',
        time: '刚刚'
      })
      saveState(state)
    }
  }
}

watch(
  () => state,
  () => {
    saveState(state)
  },
  { deep: true }
)

export function useStore() {
  return { state, getters, actions }
}
