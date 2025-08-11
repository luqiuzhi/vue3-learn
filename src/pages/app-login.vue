<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// 定义表单数据
const loginForm = ref({
  username: 'hahaha',
  password: '',
})

// 定义表单引用
const loginFormRef = useTemplateRef<FormInstance>('loginFormRef')

// 定义路由
const router = useRouter()

// 表单验证规则
const loginRules = ref<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3到20个字符之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应在6到20个字符之间', trigger: 'blur' },
  ],
})

// 处理登录
const handleLogin = async () => {
  const formEl = loginFormRef.value
  if (!formEl) return

  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        // 验证用户名和密码
        const formData = new FormData()
        formData.append('username', loginForm.value.username)
        formData.append('password', loginForm.value.password)
        const response = await axios.post('http://127.0.0.1:8080/login', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log('登录响应数据:', response)
        if (response.data) {
          // 登录成功，保存认证信息
          localStorage.setItem('authToken', 'admin-token')
          ElMessage.success('登录成功')
          console.log('登录成功', loginForm.value)
          // 登录成功后跳转到主页
          router.push('/')
        } else {
          // 登录失败提示
          ElMessage.error('用户名或密码错误')
        }
      } catch (error) {
        // 网络错误或服务器错误处理
        let errorMessage = '登录失败，请检查用户名和密码'
        if (axios.isAxiosError(error)) {
          errorMessage = error.response?.data?.message || error.message || errorMessage
        }
        ElMessage.error(errorMessage)
        console.error('登录请求失败:', error)
      }
    } else {
      console.log('表单验证失败', fields)
    }
  })
}

// 重置表单
const resetForm = () => {
  const formEl = loginFormRef.value
  if (!formEl) return
  formEl.resetFields()
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">
        <h2>后台管理系统</h2>
        <p>Management System</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-button" @click="handleLogin"> 登录 </el-button>
          <el-button @click="resetForm"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxMCIgZmlsbD0iI2RkZGRkZCIvPjwvc3ZnPg==');
  background-size: 100px 100px;
}

.login-box {
  width: 400px;
  padding: 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
}

.login-title h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.login-title p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #999;
}

.login-form {
  padding: 20px 0;
}

.login-button {
  width: 100%;
  margin-bottom: 20px;
}
</style>
