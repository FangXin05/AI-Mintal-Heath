<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image
          :src="iconUrl"
          style="width: 50px; height: 50px"
          alt="MindHealth"
        />
        <h1 class="brand-name">心理健康AI助手</h1>
      </div>
      <div class="nav-section">
        <div class="menu-section">
          <router-link class="nav-link" to="/">首页</router-link>
          <template v-if="isLogin">
            <router-link class="nav-link" to="/frontendConsulations"
              >AI咨询</router-link
            >
            <router-link class="nav-link" to="/frontendEmotionDiary"
              >情绪日记</router-link
            >
          </template>
          <router-link class="nav-link" to="/frontendKnowledge"
            >知识库</router-link
          >
        </div>
        <div class="auth-section">
          <template v-if="isLogin">
            <el-button class="nav-link logout-btn" @click="handleLogout"
              >退出登录</el-button
            >
          </template>
          <template v-else>
            <router-link class="nav-link" to="/auth/login">登录</router-link>
            <router-link class="nav-link" to="/auth/register">
              <el-button type="primary" size="small">注册</el-button>
            </router-link>
          </template>
        </div>
      </div>
    </div>
    <div class="main-container"><router-view /></div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>&copy; 2026心理健康AI助手. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

//router = 方向盘，控制去哪
// route = 仪表盘，知道现在在哪
const router = useRouter()
const route = useRoute()

const iconUrl = new URL('@/assets/images/机器人.png', import.meta.url).href

const isLogin = ref(false)
//刷新登录状态
const refreshLoginState = () => {
  isLogin.value = localStorage.getItem('token') !== null
}
refreshLoginState()
watch(
  () => route.path,
  () => {
    refreshLoginState()
  }
)
//退出登录
const handleLogout = () => {
  //清除缓存
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  isLogin.value = false
  router.push('/auth/login')
}
</script>

<style lang="css" scoped>
.frontend-layout {
  background-color: #fff;
  .navbar-container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .brand-section {
      display: flex;
      align-items: center;
      .brand-name {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }
    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;
      .menu-section {
        display: flex;
        align-items: center;
        gap: 32px;
      }
      .auth-section {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .nav-link {
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;
        &:hover {
          color: #4a90e2;
        }
      }
      .logout-btn {
        background: transparent;
        border: none;
        padding: 0;
      }
    }
  }

  .footer-container {
    background: #1f2937;
    color: white;
    padding: 15px 0;
    margin-top: auto;
    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>
