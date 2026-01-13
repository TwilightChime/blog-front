import request from '@/utils/request'

export const typeApi = {
  getTypeList(){
    return request.get('/admin/getFullTypeList')
  }
}