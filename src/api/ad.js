// @ 符号在build/webpack.base.conf.js 中配置 表示 'src' 路径
import request from '@/utils/request'

export default {

    pageList(page, limit) {
        return request({
            url: `/admin/ams/ad/list/${page}/${limit}`,
            method: 'get'
        })
    },

    removeById(id) {
        return request({
            url: `/admin/ams/ad/remove/${id}`,
            method: 'delete'
        })
    },

    save(ad) {
        return request({
            url: '/admin/ams/ad/save',
            method: 'post',
            data: ad
        })
    },

    getById(id) {
        return request({
            url: `/admin/ams/ad/get/${id}`,
            method: 'get'
        })
    },

    updateById(ad) {
        return request({
            url: '/admin/ams/ad/update',
            method: 'put',
            data: ad
        })
    }
}