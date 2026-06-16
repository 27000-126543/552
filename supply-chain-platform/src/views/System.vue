<template>
  <div class="system-page">
    <div class="page-header">
      <div class="header-info">
        <h2 class="page-title">系统设置</h2>
        <p class="page-desc">多级权限管控，按事业群、品类、区域划分角色</p>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :span="5">
        <div class="side-card">
          <el-menu :default-active="activeMenu" class="setting-menu" @select="handleMenuSelect">
            <el-menu-item index="permission">
              <el-icon><Lock /></el-icon>
              <span>权限管理</span>
            </el-menu-item>
            <el-menu-item index="role">
              <el-icon><User /></el-icon>
              <span>角色管理</span>
            </el-menu-item>
            <el-menu-item index="department">
              <el-icon><OfficeBuilding /></el-icon>
              <span>组织架构</span>
            </el-menu-item>
            <el-menu-item index="category">
              <el-icon><Goods /></el-icon>
              <span>品类管理</span>
            </el-menu-item>
            <el-menu-item index="region">
              <el-icon><Location /></el-icon>
              <span>区域管理</span>
            </el-menu-item>
            <el-menu-item index="log">
              <el-icon><Document /></el-icon>
              <span>操作日志</span>
            </el-menu-item>
            <el-menu-item index="config">
              <el-icon><Setting /></el-icon>
              <span>系统配置</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-col>

      <el-col :span="19">
        <div class="main-card">
          <div class="card-header">
            <span class="card-title">角色权限配置</span>
            <div class="card-actions">
              <el-button type="primary" size="small" :icon="Plus">新增角色</el-button>
            </div>
          </div>

          <el-table :data="roleList" style="width: 100%" row-key="id">
            <el-table-column prop="roleName" label="角色名称" width="160" />
            <el-table-column prop="roleCode" label="角色编码" width="140" />
            <el-table-column prop="department" label="所属部门" width="120" />
            <el-table-column prop="permissionCount" label="权限数量" width="100" />
            <el-table-column prop="userCount" label="用户数" width="100" />
            <el-table-column prop="description" label="角色描述" min-width="200" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === '启用' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default>
                <el-button type="primary" link size="small">权限配置</el-button>
                <el-button type="primary" link size="small">编辑</el-button>
                <el-button type="danger" link size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="main-card mt-20">
          <div class="card-header">
            <span class="card-title">权限树</span>
            <div class="card-actions">
              <el-button size="small" :icon="Expand">全部展开</el-button>
              <el-button size="small" :icon="Fold">全部收起</el-button>
            </div>
          </div>

          <el-row :gutter="24">
            <el-col :span="8">
              <div class="tree-section">
                <div class="tree-title">
                  <el-icon><DataAnalysis /></el-icon>
                  <span>数据看板</span>
                </div>
                <el-tree
                  :data="dashboardPermissions"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :props="{ label: 'name', children: 'children' }"
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div class="tree-section">
                <div class="tree-title">
                  <el-icon><OfficeBuilding /></el-icon>
                  <span>供应商管理</span>
                </div>
                <el-tree
                  :data="supplierPermissions"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :props="{ label: 'name', children: 'children' }"
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div class="tree-section">
                <div class="tree-title">
                  <el-icon><Document /></el-icon>
                  <span>采购审批</span>
                </div>
                <el-tree
                  :data="purchasePermissions"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :props="{ label: 'name', children: 'children' }"
                />
              </div>
            </el-col>
          </el-row>

          <el-row :gutter="24" class="mt-20">
            <el-col :span="8">
              <div class="tree-section">
                <div class="tree-title">
                  <el-icon><Box /></el-icon>
                  <span>库存调拨</span>
                </div>
                <el-tree
                  :data="inventoryPermissions"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :props="{ label: 'name', children: 'children' }"
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div class="tree-section">
                <div class="tree-title">
                  <el-icon><PriceTag /></el-icon>
                  <span>定价策略</span>
                </div>
                <el-tree
                  :data="pricingPermissions"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :props="{ label: 'name', children: 'children' }"
                />
              </div>
            </el-col>
            <el-col :span="8">
              <div class="tree-section">
                <div class="tree-title">
                  <el-icon><Setting /></el-icon>
                  <span>系统设置</span>
                </div>
                <el-tree
                  :data="systemPermissions"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :props="{ label: 'name', children: 'children' }"
                />
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="main-card mt-20">
          <div class="card-header">
            <span class="card-title">数据权限范围</span>
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="事业群">
              <el-tag type="primary">零售事业群</el-tag>
              <el-tag type="success">电商事业群</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="管理区域">
              <el-tag type="warning">华东区</el-tag>
              <el-tag type="warning">华南区</el-tag>
              <el-tag type="info">华北区</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="管理品类">
              <el-tag>电子产品</el-tag>
              <el-tag>食品饮料</el-tag>
              <el-tag>服装鞋帽</el-tag>
              <el-tag>家居用品</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="数据范围">
              <el-tag type="success">全部数据</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Lock, User, OfficeBuilding, Goods, Location, Document, Setting, Plus, Expand, Fold, DataAnalysis, Box, PriceTag } from '@element-plus/icons-vue'

const activeMenu = ref('permission')

const handleMenuSelect = (key) => {
  activeMenu.value = key
}

const roleList = ref([
  { id: 1, roleName: '超级管理员', roleCode: 'super_admin', department: '总部', permissionCount: 156, userCount: 3, description: '拥有系统所有权限', status: '启用' },
  { id: 2, roleName: '采购总监', roleCode: 'purchase_director', department: '采购部', permissionCount: 86, userCount: 5, description: '采购全流程审批与管理', status: '启用' },
  { id: 3, roleName: '采购经理', roleCode: 'purchase_manager', department: '采购部', permissionCount: 62, userCount: 12, description: '采购申请与审批管理', status: '启用' },
  { id: 4, roleName: '仓库管理员', roleCode: 'warehouse_admin', department: '仓储部', permissionCount: 45, userCount: 28, description: '库存管理与调拨执行', status: '启用' },
  { id: 5, roleName: '供应商专员', roleCode: 'supplier_specialist', department: '供应商管理部', permissionCount: 38, userCount: 15, description: '供应商信息维护与管理', status: '启用' },
  { id: 6, roleName: '财务审核', roleCode: 'finance_audit', department: '财务部', permissionCount: 28, userCount: 8, description: '付款结算与财务审核', status: '启用' },
  { id: 7, roleName: '数据分析师', roleCode: 'data_analyst', department: '数据部', permissionCount: 35, userCount: 10, description: '数据看板与报表查看', status: '启用' },
  { id: 8, roleName: '普通采购员', roleCode: 'purchase_staff', department: '采购部', permissionCount: 24, userCount: 45, description: '采购申请提交与跟进', status: '启用' }
])

const dashboardPermissions = ref([
  {
    id: 101, name: '数据看板查看', children: [
      { id: 1011, name: '库存数据查看' },
      { id: 1012, name: '价格数据查看' },
      { id: 1013, name: '物流数据查看' },
      { id: 1014, name: 'SKU钻取分析' }
    ]
  },
  { id: 102, name: '报表导出' }
])

const supplierPermissions = ref([
  {
    id: 201, name: '供应商管理', children: [
      { id: 2011, name: '供应商列表查看' },
      { id: 2012, name: '供应商新增' },
      { id: 2013, name: '供应商编辑' },
      { id: 2014, name: '供应商审核' }
    ]
  },
  {
    id: 202, name: '智能推荐', children: [
      { id: 2021, name: '推荐结果查看' },
      { id: 2022, name: '推荐规则配置' }
    ]
  }
])

const purchasePermissions = ref([
  {
    id: 301, name: '采购申请', children: [
      { id: 3011, name: '申请提交' },
      { id: 3012, name: '申请查看' },
      { id: 3013, name: '申请编辑' }
    ]
  },
  {
    id: 302, name: '审批流程', children: [
      { id: 3021, name: '一级审批' },
      { id: 3022, name: '二级审批' },
      { id: 3023, name: '审批流配置' }
    ]
  }
])

const inventoryPermissions = ref([
  {
    id: 401, name: '库存管理', children: [
      { id: 4011, name: '库存查询' },
      { id: 4012, name: '库存调整' },
      { id: 4013, name: '库存盘点' }
    ]
  },
  {
    id: 402, name: '调拨管理', children: [
      { id: 4021, name: '调拨方案查看' },
      { id: 4022, name: '调拨执行' },
      { id: 4023, name: '算法配置' }
    ]
  }
])

const pricingPermissions = ref([
  {
    id: 501, name: '定价管理', children: [
      { id: 5011, name: '价格查看' },
      { id: 5012, name: '调价申请' },
      { id: 5013, name: '价格审批' }
    ]
  },
  {
    id: 502, name: '策略配置', children: [
      { id: 5021, name: '定价规则配置' },
      { id: 5022, name: '促销日历管理' }
    ]
  }
])

const systemPermissions = ref([
  {
    id: 601, name: '权限管理', children: [
      { id: 6011, name: '角色管理' },
      { id: 6012, name: '用户管理' },
      { id: 6013, name: '权限配置' }
    ]
  },
  {
    id: 602, name: '系统配置', children: [
      { id: 6021, name: '参数配置' },
      { id: 6022, name: '日志查看' }
    ]
  }
])
</script>

<style scoped>
.system-page {
  padding: 20px;
}

.page-header {
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

.side-card, .main-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.setting-menu {
  border-right: none;
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

.card-actions {
  display: flex;
  gap: 8px;
}

.tree-section {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  height: 100%;
}

.tree-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.mt-20 {
  margin-top: 20px;
}
</style>
