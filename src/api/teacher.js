import request from '@/utils/request'

export default {
    getList() {
        return request({
            url: '/admin/core/teacher/list',
            method: 'get'
        })
    },
    pageList(page = 1, size = 10, searchObj = {}) {
        return request({
            url: `/api/core/teacher/list/${page}/${size}`,
            method: 'get',
            params: searchObj
        })
    },
    removeById(id) {
        return request({
            url: `/admin/core/teacher/remove/${id}`,
            method: 'Delete',
        })
    },
    save(teacher) {
        return request({
            url: 'admin/core/teacher/add',
            method: "Post",
            data: teacher
        })
    },
    getById(id) {
        return request({
            url: `/api/core/teacher/get/${id}`,
            method: 'get'
        })
    },
    updateById(teacher) {
        return request({
            url: 'admin/core/teacher/update',
            method: "Put",
            data: teacher
        })
    },
    batchRemove(idLIst) {
        return request({
            url: 'admin/core/teacher/batch-remove',
            method: "Delete",
            data: idList
        })
    },
    getNameListByKey(nameKey) {
        return request({
            url: `admin/core/teacher/list-name/${nameKey}`,
            method: "Get",
        })
    },
}