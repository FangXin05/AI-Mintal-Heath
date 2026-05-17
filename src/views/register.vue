<template>
  <div class="container">
    <!-- 标题区域 -->
    <div class="title">
      <div class="title-text">
        <h2>
          用户注册<br />
          创建你的心理健康账号
        </h2>
      </div>
    </div>
    <!-- 表单区域 -->
    <el-form
      ref="submitFormRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      class="form-container"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="formData.nickname"
          placeholder="请输入昵称（选填）"
        />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号（选填）" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="formData.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="formData.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          show-password
        />
      </el-form-item>

      <el-button type="primary" class="btn" @click="submitForm(submitFormRef)">
        注册
      </el-button>

      <div class="footer">
        <span style="color: #6b7280; font-size: 14px">
          已有账号？
          <el-link type="primary" @click="router.push('/auth/login')">
            立即登录
          </el-link>
        </span>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { register } from '@/api/frontendAdmin'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const submitFormRef = ref(null)

const formData = reactive({
  username: '',
  email: '',
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: 0,
  userType: 1
})
//确认密码方法
const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请确认密码'))
  } else if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    //校验通过
    callback()
  }
}
//表单校验规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
}
//提交表单
const submitForm = async (formEl) => {
  //如果页面没有记载完成被点击了提交直接退出,这里检验的就是form相关的组件是否挂载完成
  if (!formEl) return
  //校验表单规则
  try {
    await formEl.validate()
  } catch (validError) {
    return
  }
  try {
    console.log('发送的数据:', JSON.parse(JSON.stringify(formData)))
    const data = await register(formData)
    ElMessage.success('注册成功')
    router.push('/auth/login')
  } catch (error) {
    console.error('register error:', error)
  }
}
</script>

<style lang="css" scoped>
.container {
  width: 384px;
  .flex-box {
    display: flex;
    align-items: center;
  }
  .title {
    .title-text {
      text-align: center;
      h2 {
        margin-top: 40px;
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
    margin-bottom: 0;
    .btn {
      width: 80%;
      display: block;
      margin: 0 auto;
    }
    .footer {
      padding: 20px 30px 0 30px;
      text-align: center;
    }
  }
}
</style>
