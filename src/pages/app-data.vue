<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 定义表格列的类型
interface TableColumn {
  prop: string
  label: string
  width?: number
}

// 使用 Record<string, any> 来表示动态数据项
type TableDataItem = Record<string, unknown>

// 定义响应式数据
const tableData = ref<TableDataItem[]>([])
const tableColumns = ref<TableColumn[]>([])
const loading = ref(true)

// 创建axios实例
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8080',
  timeout: 10000
})

// 获取表格模型和数据
const fetchModelTable = async () => {
  try {
    loading.value = true
    const response = await apiClient.get('/fetchModelInfo/user')

    // 假设后端返回格式为:
    // {
    //   columns: [{ prop: 'date', label: 'Date', width: 140 }, ...],
    //   data: [{ date: '2016-05-02', name: 'Tom', ... }, ...]
    // }
    if (response.data) {
      tableColumns.value = response.data.columns || []
      tableData.value = response.data.data || []
    }
  } catch (error) {
    console.error('获取表格数据失败:', error)
    // 出错时使用默认数据
    const defaultItem: TableDataItem = {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    }
    tableData.value = Array.from({ length: 20 }).fill(defaultItem) as TableDataItem[]

    // 默认列定义
    tableColumns.value = [
      { prop: 'date', label: 'Date', width: 140 },
      { prop: 'name', label: 'Name', width: 120 },
      { prop: 'address', label: 'Address' }
    ]
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchModelTable()
})
</script>

<template>
  <el-scrollbar>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column
        v-for="column in tableColumns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
      />
    </el-table>
  </el-scrollbar>
</template>

<style scoped></style>
