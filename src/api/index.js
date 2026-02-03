import request from '@/utils/request'

export const indexApi = {
  getBlogCount() {
    return request.get('/admin/getBlogCount')
  },
  getBlogCountByMonth() {
    return request.get('/admin/getBlogCountByMonth')
  },
  getViewCount() {
    return request.get('/admin/getViewCount')
  },
  getViewCountByMonth() {
    return request.get('/admin/getViewCountByMonth')
  },
  getAppreciateCount() {
    return request.get('/admin/getAppreciateCount')
  },
  getAppreciateCountByMonth() {
    return request.get('/admin/getAppreciateCountByMonth')
  },
  getCommentCount() {
    return request.get('/admin/getCommentCount')
  },
  getCommentCountByMonth() {
    return request.get('/admin/getCommentCountByMonth')
  }
}
