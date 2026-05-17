<template>
  <!-- template视图 -->
  <div>
    <!-- 在这里之所以使用title="知识文章"能拿到对应的值就是因为
     pagehead组件里面defineprops属性定义的title属性 -->
    <PageHead title="知识文章">
      <template #buttons>
        <!-- 具名插槽 -->
        <el-button @click="handleAdd" type="primary">新增</el-button>
      </template>
    </PageHead>
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column prop="title" label="文章标题" width="180" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon> <timer /></el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon> <timer /></el-icon>
            <span>{{ categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="150" />
      <el-table-column prop="readCount" label="阅读量" width="150" />
      <el-table-column prop="publishedAt" label="发布时间" width="150" />
      <el-table-column prop="title" label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button type="primary" text @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="scope.row.status === 0 || scope.row.status === 2"
            type="success"
            text
            @click="handlePublish(scope.row)"
            >发布</el-button
          >
          <el-button
            v-if="scope.row.status === 1"
            type="warning"
            text
            @click="handleUnpublish(scope.row)"
            >下线</el-button
          >
          <el-button @click="handleDelete(scope.row)" type="danger" text
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      layout="total, prev, pager, next, jumper"
      @current-change="handleChange"
      style="margin-top: 20px"
    />
    <ArticleDialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      @update:visible="dialogVisible = $event"
      @success="handleArticleSaved"
      :article="currentArticle"
      :categories="categories"
    />
  </div>
</template>
<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { ref, onMounted, reactive } from 'vue'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { formatBtoF } from '@/utils/formatBtoF'
import {
  categoryTree,
  articlePage,
  articleDelete,
  changeArticleStatus,
  articleDetail
} from '@/api/admin'
// ref只能接收一个参数，不能接收多个参数，这里用一个数组处理了多个对象
const formItem = ref([
  {
    comp: 'ElInput',
    prop: 'title',
    label: '文章标题',
    placeholder: '请输入文章标题'
  },
  {
    comp: 'ElSelect',
    prop: 'categoryId',
    label: '分类',
    placeholder: '请选择分类'
  },
  {
    comp: 'ElSelect',
    prop: 'status',
    label: '状态',
    placeholder: '请输入文章状态',
    options: [
      { label: '草稿', value: 0 },
      { label: '已发布', value: 1 },
      { label: '已下线', value: 2 }
    ]
  }
])
//分页参数
const pagination = reactive({
  currentPage: 1, //当前页码，默认是第一页
  size: 10, //每页显示的记录数，默认是10条
  total: 0 //总记录数，默认是0
})
// 上一次查询条件（翻页、保存后刷新时沿用）
const lastQueryParams = ref({})
//文章列表渲染
const handleSearch = async (formData) => {
  if (formData !== undefined && formData !== null) {
    lastQueryParams.value = { ...formData }
  }
  try {
    const params = {
      currentPage: pagination.currentPage,
      size: pagination.size,
      ...lastQueryParams.value
    }
    console.log('articlePage 参数:', params)

    const data = await articlePage(params)
    console.log('articlePage 返回:', data)

    tableData.value = data.records
    pagination.total = data.total
  } catch (err) {
    console.error('articlePage 请求失败:', err)
    throw err
  }
}
// 翻页函数
const handleChange = (page) => {
  pagination.currentPage = page
  handleSearch()
}
const categoryMap = reactive({}) //对于分类后端返回的只有一个数字，这行就是起到翻译作用
const categories = ref([]) //下拉框
const tableData = ref([]) //文章数据
//新增和编辑
const dialogVisible = ref(false) //父组件准备一个开关，默认关着，初始是关着的，并且这个初始值也传给了子组件
//onMounted用户看到页面那一刻这段代码就开始运行
onMounted(async () => {
  try {
    console.log('开始请求 categoryTree')
    const data = await categoryTree()
    console.log('categoryTree 成功：', data)

    categories.value = formatBtoF(data)
    formItem.value[1].options = categories.value
  } catch (err) {
    console.error('categoryTree 失败：', err)
  }

  try {
    console.log('开始请求 articlePage')
    await handleSearch()
    console.log('articlePage 成功')
  } catch (err) {
    console.error('articlePage 失败：', err)
  }
})
const currentArticle = ref(null)
//编辑
const handleEdit = async (row) => {
  const ContentDetail = await articleDetail(row.id)
  console.log('详情接口返回：', ContentDetail)
  currentArticle.value = ContentDetail
  dialogVisible.value = true
}
//新增
const handleAdd = () => {
  currentArticle.value = null
  dialogVisible.value = true
}
// 新增/编辑成功后刷新列表（否则表格仍是旧数据）
const handleArticleSaved = async (payload) => {
  // 新建后若仍带着「仅已发布」等筛选，草稿会看不到；新建时清空筛选再查
  if (payload?.mode === 'create') {
    lastQueryParams.value = {}
    pagination.currentPage = 1
  }
  await handleSearch()
  // 若后端按发布时间倒序把新数据排在很后，当前页仍可能没有；把接口返回的记录插到当前列表顶部
  const row = payload?.record
  if (payload?.mode === 'create' && row?.id) {
    const exists = tableData.value.some((r) => r.id === row.id)
    if (!exists) {
      tableData.value = [row, ...tableData.value]
      pagination.total = (pagination.total || 0) + 1
    }
  }
}
//发布
const handlePublish = (row) => {
  ElMessageBox.confirm(`确定要发布文章「${row.title}」吗？`, '确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    changeArticleStatus(row.id, { status: 1 })
      .then(() => {
        ElMessage.success('发布成功')
        handleSearch()
      })
      .catch(() => {})
  })
}
//下线
const handleUnpublish = (row) => {
  ElMessageBox.confirm(`确定要下线文章「${row.title}」吗？`, '确认', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    changeArticleStatus(row.id, { status: 2 })
      .then(() => {
        ElMessage.success('下线成功')
        handleSearch()
      })
      .catch(() => {})
  })
}
//删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除文章${row.title}吗？`, `确认`, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    articleDelete(row.id).then((res) => {
      ElMessage.success('删除成功')
      handleSearch()
    })
  })
}
</script>
