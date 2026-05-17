import axios from 'axios'
import { ElMessage } from 'element-plus'

//创建axios实例
const service = axios.create({
  baseURL: '/api', //请求的前缀
  timeout: 5000
})
//请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    const isAuthRequest =
      config.url?.includes('/user/login') ||
      config.url?.includes('/user/add') ||
      config.url?.includes('/admin/login') ||
      config.url?.includes('/admin/register')
    if (token && !isAuthRequest) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
//响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, config } = response
    if (data.code === '200') {
      return data.data
    }
    // 只有 401 才是登录过期
    if (data.code === '401') {
      ElMessage.error('登录过期，请重新登录')
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.href = '/auth/login'
      return Promise.reject('登录过期，请重新登录')
    }
    // 其他错误正常提示
    ElMessage.error(data.msg || '系统错误')
    return Promise.reject(data)
  },
  (error) => {
    ElMessage.error('网络不给力，心情机器人直叹气')
    return Promise.reject(error)
  }
)
export default service
