import request from '@/utils/request'

export const tagApi = {
  createTag(newTag) {
    return request.post('/admin/tags', { tag: { name: newTag } })
  },

  tagUpdateBlog(data) {
    return request.post('/admin/blogs', { blog: data })
  },

  getTagList() {
    return request.get('/admin/getFullTagList')
  },
}
