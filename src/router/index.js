import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/index',
        children: [{
            path: 'index',
            name: '控制台',
            component: () =>
                import ('@/views/index/index'),
            meta: { title: '首页', icon: 'index' }
        }]
    }
]

export const asyncRoutes = [

    // 权限管理
    {
        path: '/acl',
        component: Layout,
        redirect: '/acl/user/list',
        name: '权限管理',
        meta: { title: '权限管理', icon: 'chart' },
        children: [{
                path: 'user/list',
                name: '用户管理',
                component: () =>
                    import ('@/views/acl/user/list'),
                meta: { title: '用户管理' }
            },
            {
                path: 'role/list',
                name: '角色管理',
                component: () =>
                    import ('@/views/acl/role/list'),
                meta: { title: '角色管理' }
            },
            {
                path: 'role/form',
                name: '角色添加',
                component: () =>
                    import ('@/views/acl/role/form'),
                meta: { title: '角色添加' },
                hidden: true
            },
            {
                path: 'role/update/:id',
                name: '角色修改',
                component: () =>
                    import ('@/views/acl/role/form'),
                meta: { title: '角色修改' },
                hidden: true
            },
            {
                path: 'role/distribution/:id',
                name: '角色权限',
                component: () =>
                    import ('@/views/acl/role/roleForm'),
                meta: { title: '角色权限' },
                hidden: true
            },
            {
                path: 'menu/list',
                name: '菜单管理',
                component: () =>
                    import ('@/views/acl/menu/list'),
                meta: { title: '菜单管理' }
            },
            {
                path: 'user/add',
                name: '用户添加',
                component: () =>
                    import ('@/views/acl/user/form'),
                meta: { title: '用户添加' },
                hidden: true
            },
            {
                path: 'user/update/:id',
                name: '用户修改',
                component: () =>
                    import ('@/views/acl/user/form'),
                meta: { title: '用户修改' },
                hidden: true
            },
            {
                path: 'user/role/:id',
                name: '用户角色',
                component: () =>
                    import ('@/views/acl/user/roleForm'),
                meta: { title: '用户角色' },
                hidden: true
            }

        ]
    },

    // 讲师管理
    {
        path: '/teacher',
        component: Layout,
        redirect: '/teacher/list',
        name: 'Teacher',
        meta: { title: '讲师管理', icon: 'teacher' },
        children: [{
                path: 'list',
                name: 'TeacherList',
                component: () =>
                    import ('@/views/teacher/list'),
                meta: { title: '讲师列表', icon: 'list' }
            },
            {
                path: 'create',
                name: 'TeacherCreate',
                component: () =>
                    import ('@/views/teacher/form'),
                meta: { title: '添加讲师', icon: 'add' }
            },
            {
                path: 'edit/:id',
                name: 'TeacherEdit',
                component: () =>
                    import ('@/views/teacher/form'),
                meta: { title: '编辑讲师' },
                hidden: true
            }
        ]
    },
    // 课程管理
    {
        path: '/course',
        component: Layout,
        redirect: '/course/list',
        name: 'Course',
        meta: { title: '课程管理', icon: 'book' },
        children: [{
                path: 'list',
                name: 'CourseList',
                component: () =>
                    import ('@/views/course/list'),
                meta: { title: '课程列表', icon: 'list' }
            },
            {
                path: 'info',
                name: 'CourseInfo',
                component: () =>
                    import ('@/views/course/form'),
                meta: { title: '发布课程', icon: 'add' }
            },
            {
                path: 'info/:id',
                name: 'CourseInfoEdit',
                component: () =>
                    import ('@/views/course/form'),
                meta: { title: '编辑课程' },
                hidden: true
            },
            {
                path: 'chapter/:id',
                name: 'CourseChapterEdit',
                component: () =>
                    import ('@/views/course/form'),
                meta: { title: '编辑课程大纲' },
                hidden: true
            }
        ]
    },
    // 课程分类管理
    {
        path: '/subject',
        component: Layout,
        redirect: '/subject/list',
        name: 'Subject',
        meta: { title: '课程分类管理', icon: 'bookcategoty' },
        children: [{
                path: 'list',
                name: 'SubjectList',
                component: () =>
                    import ('@/views/subject/list'),
                meta: { title: '课程分类列表', icon: 'list' }
            },
            {
                path: 'import',
                name: 'SubjectImport',
                component: () =>
                    import ('@/views/subject/import'),
                meta: { title: '导入课程分类', icon: 'upload' }
            }
        ]
    },
    // 内容管理
    {
        path: '/ad',
        component: Layout,
        redirect: '/ad/list',
        name: 'Ad',
        meta: { title: '内容管理', icon: 'neirong' },
        children: [{
                path: 'list',
                name: 'AdList',
                component: () =>
                    import ('@/views/ad/list'),
                meta: { title: '广告推荐', icon: 'guanggao' }
            },
            {
                path: 'create',
                name: 'AdCreate',
                component: () =>
                    import ('@/views/ad/form'),
                meta: { title: '添加广告推荐' },
                hidden: true
            },
            {
                path: 'edit/:id',
                name: 'AdEdit',
                component: () =>
                    import ('@/views/ad/form'),
                meta: { title: '编辑广告推荐' },
                hidden: true
            },

            {
                path: 'type-list',
                name: 'AdTypeList',
                component: () =>
                    import ('@/views/adType/list'),
                meta: { title: '推荐位管理', icon: 'tuijian' }
            },
            {
                path: 'type-create',
                name: 'AdTypeCreate',
                component: () =>
                    import ('@/views/adType/form'),
                meta: { title: '添加推荐位' },
                hidden: true
            },
            {
                path: 'type-edit/:id',
                name: 'AdTypeEdit',
                component: () =>
                    import ('@/views/adType/form'),
                meta: { title: '编辑推荐位' },
                hidden: true
            }
        ]
    },
    // 统计分析
    {
        path: '/statistics',
        component: Layout,
        redirect: '/statistics/create',
        name: 'Statistics',
        meta: { title: '统计分析', icon: 'shijian' },
        children: [{
                path: 'create',
                name: 'StatisticsCreate',
                component: () =>
                    import ('@/views/statistics/create'),
                meta: { title: '生成统计', icon: 'shengchengtongji' }
            },
            {
                path: 'chart',
                name: 'StatisticsChart',
                component: () =>
                    import ('@/views/statistics/chart'),
                meta: { title: '统计图表', icon: 'tongjitubiao' }
            }
        ]
    },
    // 订单管理
    {
        path: '/trade',
        component: Layout,
        redirect: '/trade/list',
        name: 'Trade',
        meta: { title: '订单管理', icon: 'dingdan' },
        children: [{
            path: 'list',
            name: 'TradeList',
            component: () =>
                import ('@/views/trade/list'),
            meta: { title: '订单列表', icon: 'list' }
        }, {
            path: 'info/:id',
            name: 'TradeInfo',
            component: () =>
                import ('@/views/trade/info'),
            meta: { title: '订单信息' },
            hidden: true
        }, ]
    },
    // 直播管理
    {
        path: '/live',
        component: Layout,
        redirect: '/live/list',
        name: 'Live',
        meta: { title: '直播管理', icon: 'dingdan' },
        children: [{
                path: 'list',
                name: 'LiveList',
                component: () =>
                    import ('@/views/live/list'),
                meta: { title: '直播列表', icon: 'list' }
            }, {
                path: 'category',
                name: 'LiveCategory',
                component: () =>
                    import ('@/views/livecategory/list'),
                meta: { title: '直播分类', icon: 'category' }
            },
            {
                path: 'import',
                name: 'LiveImport',
                component: () =>
                    import ('@/views/livecategory/import'),
                meta: { title: '导入直播分类', icon: 'upload' }
            }
        ]
    }
]

const createRouter = () => new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router