import request from '@/utils/request'

export default {

    // 分页获取订单
    pageList(page = 1, size = 10, searchObj = {}) {
        return request({
            url: `/admin/trade/order/list/${page}/${size}`,
            method: 'get',
            params: searchObj
        })
    },
    // 根据订单ID获取订单
    getOrderInfo(orderId) {
        return request({
            url: `/admin/trade/order/info/${orderId}`,
            method: 'get'
        })
    }


}