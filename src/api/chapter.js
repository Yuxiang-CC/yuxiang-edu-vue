import request from '@/utils/request'

export default {
    saveChapterInfo(chapterInfo) {
        return request({
            url: '/admin/core/chapter/save',
            method: 'Post',
            data: chapterInfo
        })
    },
    getChapterById(id) {
        return request({
            url: `/admin/core/chapter/get/${id}`,
            method: 'get'
        })
    },
    updateChapterById(chapterInfo) {
        return request({
            url: '/admin/core/chapter/update',
            method: 'Put',
            data: chapterInfo
        })
    },
    removeChapterById(id) {
        return request({
            url: `/admin/core/chapter/remove/${id}`,
            method: 'Delete'
        })
    },
    getNestedListById(courseId) {
        return request({
            url: `/api/core/chapter/nested-list/${courseId}`,
            method: 'Get'
        })
    }
}