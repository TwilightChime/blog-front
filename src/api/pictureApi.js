import request from '../utils/request'

export const pictureApi = {
  getPictureList() {
    return request.get('/admin/images/getImageList')
  },

  delPicture(data) {
    return request.get(`/admin/images/delImg/${data.id}`)
  }
}