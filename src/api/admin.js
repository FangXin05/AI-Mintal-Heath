import service from '@/utils/request'

export const login = (data) => {
  return service.post('/user/login', data)
}

export const categoryTree = (token) => {
  return service.get('/knowledge/category/tree')
}

export const articlePage = (params) => {
  return service.get('knowledge/article/page', { params })
  //这个params由knowledge传来，交给axios的实例方法service.get
} //service.get收到params这个配置后会自动把对象里的每个key-value拼接到URL后面
//  你传的 params
// { currentPage: 1, size: 10, title: '压力' }
//  axios 自动拼成
// GET /knowledge/article/page?currentPage=1&size=10&title=压力
// 这个 ?currentPage=1&size=10 叫做 Query String（查询字符串），是 GET 请求传参的标准方式。
//-------------------------------------------
//然后呢，在request里面有配置了baseURL，
// 所以最终发出的完整请求是：
// GET http://localhost:5173/api/knowledge/article/page?currentPage=1&size=10
// 但前端是 5173 端口，后端是另一个端口（比如 8080）。直接请求会跨域报错，所以 Vite 配置了代理，把 /api 开头的请求转发给后端：
// 浏览器请求  →  localhost:5173/api/knowledge/...
// Vite 代理   →  localhost:8080/knowledge/...（转发给真实后端）
// 后端收到请求后：
// 从 URL 里解析出参数 currentPage=1, size=10
// 拼 SQL：SELECT * FROM article LIMIT 10 OFFSET 0
// 查数据库，拿到数据
// 打包成 JSON 返回：
// 后端返回的 JSON，axios 会再包一层自己的壳
export function articleAdd(data) {
  return service.post('/knowledge/article', data)
}
//上传文件
export function uploadFile(file, businessInfo) {
  const formData = new FormData()
  //浏览器有一个专门的FormData类，用于处理文件上传，
  formData.append('file', file) //放文件本体
  formData.append('businessType', 'ARTICLE') //放文章类型
  formData.append('businessId', businessInfo.businessId) //放文章id
  formData.append('businessField', 'cover') //放封面

  return service.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
      //告诉后端"我发给你的是一个含有文件的表单，不是普通 JSON"
    }
  })
}
//删除文章
export function articleDelete(id) {
  return service.delete(`/knowledge/article/${id}`)
}
// 编辑知识文章
export function articleUpdate(data) {
  return service.put(`/knowledge/article/${data.id}`, data)
}
//发布/下线文章
export function changeArticleStatus(id, data) {
  return service.put(`/knowledge/article/${id}/status`, data)
}

export function articleDetail(id) {
  return service.get(`/knowledge/article/${id}`)
}

//咨询记录getConsultationPage
export const getConsultationPage = (params) => {
  return service.get('/psychological-chat/sessions', { params })
}
//咨询记录详情
export const getSessionDetail = (sessionId) => {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
//分页查询情绪日志
export const getEmotionalPage = (params) => {
  return service.get('/emotion-diary/admin/page', { params })
}
//删除情绪日志
export const deleteEmotional = (id) => {
  return service.delete(`/emotion-diary/admin/${id}`)
}
//获取综合数据分析
export const getAnalysisOverview = () => {
  return service.get('/data-analytics/overview')
}
//退出登录
export const logout = () => {
  return service.post('/user/logout')
}
