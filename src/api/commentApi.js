/*
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2026-02-05 16:05:46
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-02-05 17:12:47
 * @FilePath: \blog-front\src\api\recommendApi.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

export const commentApi = {
  getCommentList() {
    return request.get('/admin/getCommentList')
  },

  delComment(data) {
    return request.get('/admin/deleteCommentById', {params: data})
  }
}