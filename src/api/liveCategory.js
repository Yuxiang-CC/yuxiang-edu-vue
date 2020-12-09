// 直播分类管理API
import request from '@/utils/request'

export default {
    getAll() {
        return request({
            baseURL: 'http://localhost:9690',
            url: `/api/vod/live-category/nested-list`,
            method: 'get'
        })
    }
}