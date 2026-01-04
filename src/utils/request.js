/*
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-17 14:52:26
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2025-12-29 14:58:04
 * @FilePath: \blog-front\src\utils\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useCounterStore } from '@/stores/counter'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: 'http://localhost:8090',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

service.interceptors.request.use(
  (config) => {
    const stores = useCounterStore()
    config.headers.token = stores.token
    return config
  },
  (error) => {
    console.error('requestError', error)
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (config) => {
    if (config.data.code === 200) {
      return config
    } else {
      ElMessage.error(config.data.message || 'codeBackError')
      return Promise.reject(new Error(config.data.message || 'codeBackError'))
    }
  },
  (error) => {
    console.error('reponseError', error)
    if (error.response) {
      switch (error.response.status) {
        case 400:
          ElMessage.error('requestParamError')
          break
        case 401:
          ElMessage.error('unauthorized, log back in')
          // const stores = useCounterStore()
          // stores.logout()
          break
        case 403:
          ElMessage.error('rejectAccess')
          break
        case 404:
          ElMessage.error('resource not exit')
          break
        case 500:
          ElMessage.error('serviceError')
          break
        case 502:
          ElMessage.error('gatewayError')
          break
        case 503:
          ElMessage.error('service not used')
          break
        case 504:
          ElMessage.error('gatewayTimeout')
          break
        default:
          ElMessage.error(error.response.data?.message || 'requestFault')
      }
    } else if (error.request) {
      ElMessage.error('networkLinkFault, checkoutNetwork')
    } else {
      ElMessage.error(error.message || 'requestConfigError')
    }

    return Promise.reject(error)
  },
)

export default service
