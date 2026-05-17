<template>
  <div class="nav-bar">
    <div class="flex-box">
      <el-button @click="handleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">{{ route.meta.title || '心理健康AI助手' }}</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
          <p class="user-name">用户</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="layout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { useAdminStore } from '@/stores/admin'
import { useRoute, useRouter } from 'vue-router'
import { logout } from '@/api/admin'

const route = useRoute()
const router = useRouter()
const handleCommand = (command) => {
  console.log(command)
  if (command === 'layout') {
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      logout().then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        router.push('/auth/login')
      })
    })
  }
}

const handleCollapse = () => {
  useAdminStore().toggleCollapse() //状态的修改
}
</script>

<style lang="scss" scoped>
.nav-bar {
  height: 100%; //这里是继承父元素的高度,父元素是BackendLayout.vue
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #e5e7eb;
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .page-title {
    margin-left: 20px;
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
  }
}
</style>
