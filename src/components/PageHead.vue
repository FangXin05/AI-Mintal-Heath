<template>
  <div class="page-head">
    <p class="page-title">{{ props.title }}</p>
    <div class="action-btn">
      <slot name="buttons"></slot>
      <!-- 子组件定义插槽,名字叫做buttons的插槽需要父组件来填这个坑 -->
    </div>
  </div>
</template>

<script setup>
//defineProps 是 Vue 3 中用于接收父组件传过来的数据的编译器宏
const props = defineProps({
  title: {
    type: String,
    default: '页面标题' //默认值,父组件不传的时候使用
  }
})
</script>

<style lang="scss" scoped>
.page-head {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .page-title {
    font-size: 24px;
    color: #2d3748;
  }
}
</style>
