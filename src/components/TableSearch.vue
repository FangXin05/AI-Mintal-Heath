<!-- 与knowledge.vue进行父子组件通信 -->
<template>
  <el-form ref="ruleFormRef" :model="formData">
    <!-- 这里template就是一个等待父组件传入数据的空模板 -->
    <el-row :gutter="24">
      <template v-for="item in formItemAttrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <el-input
              v-if="item.comp === 'ElInput'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder"
              clearable
            />
            <el-select
              v-else-if="item.comp === 'ElSelect'"
              v-model="formData[item.prop]"
              :placeholder="item.placeholder"
              clearable
              style="width: 100%"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="opt in item.options || []"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-row :gutter="24">
      <el-button type="primary" @click="handleSearch(formData)">查询</el-button>
      <el-button type="primary" @click="handleReset(ruleFormRef)"
        >重置
      </el-button>
    </el-row>
  </el-form>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'

//表单数据
const ruleFormRef = ref()
const formData = reactive({})

// 这个方法用来接受父组件传来的数据
const props = defineProps({
  formItem: {
    type: Array, //对象要求是数组
    default: () => []
  }
})

const emit = defineEmits(['search', 'reset'])

const formItemAttrs = computed(() => {
  // 拿到父组件传来的配置数组
  const formItem = props.formItem
  // 遍历每个配置对象
  formItem.forEach((item) => {
    item.col = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
  })
  return formItem
})

//查询
const handleSearch = (formData) => {
  emit('search', formData)
}

//重置
const handleReset = (formEl) => {
  // 先重置表单再触发查询
  if (!formEl) return
  formEl.resetFields()
  emit('reset', formData)
}
</script>
