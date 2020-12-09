import request from '@/utils/request'

export default {
    removeVodById(id) {
        return request({
            url: `/admin/vod/file/remove/${id}`,
            method: 'Delete',
        })
    }

}