import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  //定义响应式状态
  const isCollapse = ref(false)
  //定义修改状态的方法
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
  //返回暴露给外部的状态和方法
  return {
    isCollapse,
    toggleCollapse
  }
})
