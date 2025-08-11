<template>
  <div class="app-wrapper">
    <el-container class="layout-container-demo">
      <el-scrollbar width="200px">
        <a-menu
          width="200px"
          v-model:open-keys="state.openKeys"
          v-model:selected-keys="state.selectedKeys"
          mode="inline"
          :items="menuItems"
          @click="handleMenuClick"
        />
        </el-scrollbar>
      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <div class="toolbar">
            <el-dropdown>
              <el-icon style="margin-right: 8px; margin-top: 1px">
                <setting />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>View</el-dropdown-item>
                  <el-dropdown-item>Add</el-dropdown-item>
                  <el-dropdown-item>Delete</el-dropdown-item>
                  <el-dropdown-item @click="logout">logout</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span>Tom</span>
          </div>
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import type { MenuProps } from 'ant-design-vue'
import { Setting } from '@element-plus/icons-vue'

// 定义菜单项类型
interface MenuDataItem {
  key: string
  title: string
  icon?: string
  route?: string
  children?: MenuDataItem[]
}

// 定义响应式数据
const menuItems = reactive<MenuDataItem[]>([])

const state = reactive({
  rootSubmenuKeys: [],
  openKeys: [],
  selectedKeys: [],
})

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  timeout: 10000,
})
const router = useRouter()

// 获取菜单数据
const fetchMenuData = async () => {
  try {
    // 假设后端提供获取菜单的接口
    const response = await apiClient.get('/rights')

    if (response.data) {
      // 转换后端数据格式为 ant-design-vue 所需格式
      // const data = transformMenuData(response.data || [])
      menuItems.splice(0, menuItems.length, ...(response.data || []))
      state.openKeys = response.data.defaultOpeneds || []
    }
  } catch (error) {
    console.error('获取菜单数据失败:', error)
    // 出错时使用默认菜单数据
    menuItems.splice(
      0,
      menuItems.length,
      ...[
        {
          key: '1',
          title: 'Navigator One',
          icon: 'Message',
          children: [
            {
              key: '1-1',
              title: 'Option 1',
              route: '/buttons',
            },
            {
              key: '1-2',
              title: 'Option 2',
              route: '/data',
            },
          ],
        },
        {
          key: '2',
          title: 'Navigator Two',
          icon: 'Menu',
          children: [
            {
              key: '2-1',
              title: 'Option 1',
            },
            {
              key: '2-2',
              title: 'Option 2',
            },
          ],
        },
        {
          key: '3',
          title: 'Navigator Three',
          icon: 'Setting',
          children: [
            {
              key: '3-1',
              title: 'Option 1',
            },
            {
              key: '3-2',
              title: 'Option 2',
            },
          ],
        },
      ],
    )
  }
}

// 处理菜单点击事件
const handleMenuClick: MenuProps['onClick'] = ({ item }) => {
  const route = item.route
  console.log(route)
  if (route) {
    router.push(route)
  }
}

const logout = () => {
  localStorage.removeItem('authToken')
  window.location.reload()
}

// 组件挂载时获取菜单数据
onMounted(() => {
  fetchMenuData()
})
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
.app-wrapper {
  height: 100%;
}
</style>
