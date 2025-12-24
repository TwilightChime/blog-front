import request from '../utils/request'

export const blogApi = {
  getBlogList(params) {
    return request.post('/admin/getBlogList', params)
  },
}
