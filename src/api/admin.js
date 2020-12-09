import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/admin/core/login',
        method: 'post',
        data
    })
}

export function getInfo(token) {
    return request({
        url: '/admin/core/info',
        method: 'get',
        params: { token }
    })
}

export function logout() {
    return request({
        url: '/admin/core/logout',
        method: 'post'
    })
}