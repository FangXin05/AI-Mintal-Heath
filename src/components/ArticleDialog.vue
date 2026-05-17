<template>
  <el-dialog
    title="文章详情"
    v-model="dialogVisible"
    width="50%"
    :before-close="handleBeforeClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入文章标题"
          maxlength="20"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select
          v-model="form.categoryId"
          placeholder="请选择分类"
          style="width: 100%"
        >
          <el-option
            v-for="item in categories"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input
          v-model="form.summary"
          type="textarea"
          :rows="3"
          placeholder="请输入文章摘要"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="form.tags"
          placeholder="请选择标签"
          multiple
          filterable
          allow-create
          style="width: 100%"
        >
          <el-option
            v-for="item in commonTags"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片" prop="coverImage">
        <div
          style="display: flex; flex-direction: column; align-items: flex-start"
        >
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="handleUploadRequest"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>

          <el-button
            v-if="imageUrl"
            type="danger"
            size="small"
            @click="handleRemove"
            class="remove-btn"
            >移除封面</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          v-model="form.content"
          placeholder="请输入文章内容"
          :maxCharCount="10000"
          :showWordCount="true"
          minHeight="400px"
          @created="handleEditorCreated"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <h3>内容预览</h3>
      <div v-html="form.content"></div>
    </div>
    <template #footer>
      <el-button @click="btnPreview = !btnPreview">{{
        btnPreview ? '隐藏预览' : '预览效果'
      }}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">创建文章</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, reactive, ref, onMounted, shallowRef, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { articleAdd, uploadFile, articleUpdate } from '@/api/admin'
import { fileBaseUrl } from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
//父传子props，子传父emit
const props = defineProps({
  visible: { type: Boolean, default: false },
  article: { type: Object, default: null },
  categories: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:visible'])

const dialogVisible = computed({
  get() {
    return props.visible
  }, // 直接读父组件的值，没有副本
  set(val) {
    emit('update:visible', val)
  } // 直接改父组件的值
})
//关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
}

const form = reactive({
  title: '',
  content: '',
  coverImage: '',
  categoryId: '',
  summary: '',
  tags: []
})

const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  categoryId: [
    { required: true, message: '请选择所属分类', trigger: 'change' }
  ],
  summary: [{ required: true, message: '请输入文章摘要', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'change' }],
  tags: [
    {
      type: 'array',
      required: true,
      message: '请选择文章标签',
      trigger: 'blur'
    }
  ],
  coverImage: [
    { required: true, message: '请输入封面图片URL', trigger: 'blur' }
  ]
}
const commonTags = [
  '情绪管理',
  '焦虑',
  '抑郁',
  '压力',
  '睡眠',
  '冥想',
  '正念',
  '放松',
  '心理健康',
  '自我成长',
  '人际关系',
  '工作压力',
  '学习方法',
  '生活技巧'
]
const formRef = ref()

// 提交表单
const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const payload = {
        ...form,
        tags: form.tags.join(','),
        coverImage: form.coverImage || null
      }
      if (props.article) {
        // 编辑模式
        await articleUpdate({ ...payload, id: props.article.id })
        ElMessage.success('编辑成功')
      } else {
        // 新增模式
        await articleAdd(payload)
        ElMessage.success('新增成功')
      }
      emit('update:visible', false)
    }
  })
}
//上传图片
const imageUrl = ref('')
const beforeAvatarUpload = (file) => {
  const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
  if (!isImage) {
    ElMessage.error('只能上传 JPG / PNG / WEBP 格式的图片')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return false
  }
  return true
}
// 上传图片
const handleUploadRequest = async ({ file }) => {
  //UUID
  const businessId = crypto.randomUUID()
  const fileRes = await uploadFile(file, {
    businessId: businessId
  })
  console.log(fileRes)
  //拼接图片
  imageUrl.value = fileBaseUrl + fileRes.filePath
  form.coverImage = fileRes.filePath
}

//移除封面
const handleRemove = () => {
  imageUrl.value = ''
  form.coverImage = ''
}

// 单独存编辑器实例
const editorInstance = shallowRef(null)

// 编辑器创建完成时，保存实例
const handleEditorCreated = (editor) => {
  editorInstance.value = editor // ✅ 存实例
}
// 比如父组件传来了要编辑的文章数据
watch(
  () => props.article,
  (val) => {
    if (val) {
      // 编辑模式：把文章数据填进表单
      Object.assign(form, {
        title: val.title || '',
        summary: val.summary || '',
        categoryId: val.categoryId || '',
        coverImage: val.coverImage || '',
        content: val.content || '',
        tags: val.tags ? val.tags.split(',') : [] // 字符串转数组
      })
      // 封面图片预览
      imageUrl.value = val.coverImage ? fileBaseUrl + val.coverImage : ''
      // 编辑器回显内容
      if (editorInstance.value) {
        editorInstance.value.setHtml(val.content || '')
      }
    } else {
      // 新增模式：重置表单
      Object.assign(form, {
        title: '',
        content: '',
        coverImage: '',
        categoryId: '',
        summary: '',
        tags: []
      })
      imageUrl.value = ''
    }
  },
  { immediate: true }
)

//预览
const btnPreview = ref(false)
//关闭弹窗前的判断
const handleBeforeClose = (done) => {
  // done() 是 el-dialog 提供的回调，调用它才会真正关闭弹窗
  ElMessageBox.confirm('是否保留当前编辑的内容？', '提示', {
    confirmButtonText: '保留',
    cancelButtonText: '不保留',
    type: 'warning'
  })
    .then(() => {
      done()
    })
    .catch(() => {
      resetForm()
      done()
    })
}
const resetForm = () => {
  // 1. 清表单数据,Object.assignJavaScript 原生方法，作用是把一个对象的属性批量复制到另一个对象上
  Object.assign(form, {
    title: '',
    content: '',
    coverImage: '',
    categoryId: '',
    summary: '',
    tags: []
  })
  // 2. 清封面图片预览
  imageUrl.value = ''
  // 3. 清富文本编辑器显示
  if (editorInstance.value) {
    editorInstance.value.setHtml('')
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  display: block;
}

.avatar-uploader .avatar-uploader-icon {
  width: 200px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #8c939d;
  cursor: pointer;
}

.avatar-uploader .avatar-uploader-icon:hover {
  border-color: #409eff;
  color: #409eff;
}

.remove-btn {
  display: flex;
  margin-top: 10px;
}
</style>
