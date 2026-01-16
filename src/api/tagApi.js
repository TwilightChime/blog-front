import request from '@/utils/request'

export const tagApi = {
  createTag(newTag) {
    return request.post('/admin/tags', { tag: { name: newTag } })
  },

  updataTag(data) {
    return request.post('/admin/tags', {tag: data})
  },

  tagUpdateBlog(data) {
    return request.post('/admin/blogs', { blog: data })
  },

  getTagList() {
    return request.get('/admin/getFullTagList')
  },

  delBlogTag(tag) {
    return request.get(`/admin/dealDeletedTag/${tag.id}`)
  },

  delTag(data) {
    return request.get(`/admin/tags/${data}/delete`)
  }
}
