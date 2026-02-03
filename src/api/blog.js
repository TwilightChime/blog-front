/*
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2025-12-17 15:07:57
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-01-12 10:29:37
 * @FilePath: \blog-front\src\api\blog.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

export const blogApi = {
  getBlogList(params) {
    return request.post('/admin/getBlogList', params)
  },
  getBlog(data) {
    return request.post('/admin/blogs', {blog: data})
  },

  delBlog(data){
    return request.get(`/admin/blogs/${data}/delete`)
  }
}
