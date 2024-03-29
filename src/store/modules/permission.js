import { constantRoutes } from '@/router'
import { getMenu } from '@/api/login'
import Layout from '@/layout'

function filterAsyncRouter(asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
    try {
        const accessedRouters = asyncRouterMap.filter(route => {
            if (route.component) {
                if (route.component === 'Layout') { // Layout组件特殊处理
                    route.component = Layout
                } else {
                    route.component = loadView(route.component)
                }
            }
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children)
            }
            return true
        })
        return accessedRouters
    } catch (e) {
        console.log(e, "error error error")
    }
}

const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    async generateRoutes({ commit }, roles) {
        // 取后台路由

        const asyncRouter = await getMenu()

        return new Promise(resolve => {
            const tmp = asyncRouter.data.permissionList
            const accessedRoutes = filterAsyncRouter(tmp)
            accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
        })
    }
}

export const loadView = (view) => { // 路由懒加载
    return (resolve) => require([`@/views${view}`], resolve)
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}