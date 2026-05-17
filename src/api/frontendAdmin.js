import service from '@/utils/request'
//注册
export const register = (data) => {
  return service.post('/user/add', data)
}
//新会话
export const startSession = (data) => {
  return service.post('/psychological-chat/session/start', data)
}
//获取咨询列表
export const getSessionList = (params) => {
  return service.get('/psychological-chat/sessions', {
    params
  })
}
//删除咨询列表中的会话
export const getSessionDelete = (sessionId) => {
  return service.delete(`/psychological-chat/sessions/${sessionId}`)
}
//获取某次会话里面的所有消息
export const getSessionDetail = (sessionId) => {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
//创建更新情绪日记
export const addEmotionDiary = (data) => {
  return service.post('/emotion-diary', data)
}
//知识文章列表
export const getKnowledgeList = (params) => {
  return service.get('/knowledge/article/page', {
    params
  })
}
//知识文章详情
export const getKnowledgeDetail = (id) => {
  return service.get(`/knowledge/article/${id}`)
}
//获取会话情绪分析结果
export const getSessionEmotion = (sessionId) => {
  return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}
