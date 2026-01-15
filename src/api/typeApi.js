/*
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2026-01-12 11:05:19
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-01-15 15:10:06
 * @FilePath: \blog-front\src\api\typeApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

export const typeApi = {
  getTypeList() {
    return request.get('/admin/getFullTypeList')
  },
  delType(data) {
    return request.get(`/admin/types/${data.id}/delete`)
  },
  updataType(data) {
    return request.post('/admin/types', {type: data})
  }
}
