import request from '@/utils/request'

export default {
    getNestedTreeList() {
        return request({
            url: "/api/core/subject/nested-list",
            method: "Get"
        })
    },
    getSubjectExcel() {
        return request({
            url: "/admin/core/subject/export",
            method: 'Get',
            responseType: 'blob'
        })
    }
}