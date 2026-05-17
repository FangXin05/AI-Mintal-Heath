<template>
  <div class="content">
    <div class="title">
      <div class="back-home">
        <el-icon><Back /></el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>

    <div class="form-container">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名或邮箱"
            size="large"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
            size="large"
            show-password
            @keyup.enter="submitForm(ruleFormRef)"
          />
        </el-form-item>
        <div class="footer">
          <el-button
            class="btn"
            type="primary"
            size="large"
            @click="submitForm(ruleFormRef)"
            >登录</el-button
          >
          <p>还没有账户？<el-link to="/auth/register">去注册</el-link></p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { login } from '@/api/admin'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const ruleFormRef = ref()

const formData = reactive({
  username: '',
  password: ''
})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const submitForm = async (formEl) => {
  if (!formEl) return

  try {
    const valid = await formEl.validate()
    if (!valid) return

    // 清理旧登录信息
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    //调用了后端一个接口login
    const data = await login(formData)
    //后端没有返回token就是登录失败
    if (!data.token) {
      ElMessage.error('登录失败')
      return
    }
    //保存登录状态
    localStorage.setItem('token', data.token)
    localStorage.setItem('userInfo', JSON.stringify(data.userInfo))

    ElMessage.success('登录成功')

    if (data.userInfo.userType === 2) {
      router.push('/back/dashboard')
    } else {
      router.push('/frontendHome')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error(error?.msg || error?.message || '登录失败，请稍后重试')
  }
}
</script>
<style lang="scss" scoped>
.content {
  width: 384px;
  .title {
    .back-home {
      margin-bottom: 60px;
    }
    .title-text {
      text-align: center;
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .form-container {
    margin-top: 30px;
    .btn {
      width: 100%;
      margin-top: 40px;
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>
