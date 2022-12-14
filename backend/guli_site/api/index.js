import request from '~/utils/request'
export default {

  getTopBannerAdList() {
    return request({
      baseURL: 'http://localhost:8140',
      url: '/api/cms/ad/list/1',
      method: 'get'
    })
  },

  getIndexData() {
    return request({
      url: '/api/edu/index',
      method: 'get'
    })
  }
}
