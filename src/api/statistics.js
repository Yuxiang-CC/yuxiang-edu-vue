import request from '@/utils/request'

export default {

    createDaily(date) {
        return request({
            url: `/admin/statistics/daily/create/${date}`,
            method: 'get'
        })
    },
    getDaily(date) {
        return request({
            url: `/admin/statistics/daily/get/${date}`,
            method: 'get'
        })
    },
    getDailyByDate(begin, end) {
        return request({
            url: `/admin/statistics/daily/between/${begin}/${end}`,
            method: 'get'
        })
    }
}