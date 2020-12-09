// 直播管理API
import request from '@/utils/request'

export default {
    getLiveInfoPage(page = 1, size = 10) {
        return request({
            url: `/admin/trade/order/list/${page}/${size}`,
            method: 'get'
        })
    }

}