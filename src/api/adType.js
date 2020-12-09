import request from '@/utils/request'

export default {

    list() {
        return request({
            url: '/admin/ams/ad-type/list',
            method: 'get'
        })
    },

    pageList(page, limit) {
        return request({
            url: `/admin/ams/ad-type/list/${page}/${limit}`,
            method: 'get'
        })
    },

    removeById(id) {
        return request({
            url: `/admin/ams/ad-type/remove/${id}`,
            method: 'delete'
        })
    },

    save(adType) {
        return request({
            url: '/admin/ams/ad-type/save',
            method: 'post',
            data: adType
        })
    },

    getById(id) {
        return request({
            url: `/admin/ams/ad-type/get/${id}`,
            method: 'get'
        })
    },

    updateById(adType) {
        return request({
            url: '/admin/ams/ad-type/update',
            method: 'put',
            data: adType
        })
    }
}