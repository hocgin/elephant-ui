export default [
    // user
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
            { path: '/user', redirect: '/user/login' },
            { path: '/user/login', component: './User/Login' },
            { path: '/user/register', component: './User/Register' },
            { path: '/user/register-result', component: './User/RegisterResult' },
        ],
    },
    // app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [
            // forms
            {
                path: '/form',
                icon: 'form',
                name: 'form',
                routes: [
                    {
                        path: '/form/basic-form',
                        name: 'basicform',
                        component: './Forms/BasicForm',
                    },
                    {
                        path: '/form/step-form',
                        name: 'stepform',
                        component: './Forms/StepForm',
                        hideChildrenInMenu: true,
                        routes: [
                            {
                                path: '/form/step-form',
                                name: 'stepform',
                                redirect: '/form/step-form/info',
                            },
                            {
                                path: '/form/step-form/info',
                                name: 'info',
                                component: './Forms/StepForm/Step1',
                            },
                            {
                                path: '/form/step-form/confirm',
                                name: 'confirm',
                                component: './Forms/StepForm/Step2',
                            },
                            {
                                path: '/form/step-form/result',
                                name: 'result',
                                component: './Forms/StepForm/Step3',
                            },
                        ],
                    },
                    {
                        path: '/form/advanced-form',
                        name: 'advancedform',
                        authority: ['admin'],
                        component: './Forms/AdvancedForm',
                    },
                ],
            },
            // list
            {
                path: '/list',
                icon: 'table',
                name: 'list',
                routes: [
                    {
                        path: '/list/table-list',
                        name: 'searchtable',
                        component: './List/TableList',
                    },
                    {
                        path: '/list/basic-list',
                        name: 'basiclist',
                        component: './List/BasicList',
                    },
                    {
                        path: '/list/card-list',
                        name: 'cardlist',
                        component: './List/CardList',
                    },
                    {
                        path: '/list/search',
                        name: 'searchlist',
                        component: './List/List',
                        routes: [
                            {
                                path: '/list/search',
                                redirect: '/list/search/articles',
                            },
                            {
                                path: '/list/search/articles',
                                name: 'articles',
                                component: './List/Articles',
                            },
                            {
                                path: '/list/search/projects',
                                name: 'projects',
                                component: './List/Projects',
                            },
                            {
                                path: '/list/search/applications',
                                name: 'applications',
                                component: './List/Applications',
                            },
                        ],
                    },
                ],
            },
            {
                path: '/profile',
                name: 'profile',
                icon: 'profile',
                routes: [
                    // profile
                    {
                        path: '/profile/basic',
                        name: 'basic',
                        component: './Profile/BasicProfile',
                    },
                    {
                        path: '/profile/advanced',
                        name: 'advanced',
                        authority: ['admin'],
                        component: './Profile/AdvancedProfile',
                    },
                ],
            },
            {
                name: 'result',
                icon: 'check-circle-o',
                path: '/result',
                routes: [
                    // result
                    {
                        path: '/result/success',
                        name: 'success',
                        component: './Result/Success',
                    },
                    { path: '/result/fail', name: 'fail', component: './Result/Error' },
                ],
            },
            {
                name: 'exception',
                icon: 'warning',
                path: '/exception',
                routes: [
                    // exception
                    {
                        path: '/exception/403',
                        name: 'not-permission',
                        component: './Exception/403',
                    },
                    {
                        path: '/exception/404',
                        name: 'not-find',
                        component: './Exception/404',
                    },
                    {
                        path: '/exception/500',
                        name: 'server-error',
                        component: './Exception/500',
                    },
                    {
                        path: '/exception/trigger',
                        name: 'trigger',
                        hideInMenu: true,
                        component: './Exception/TriggerException',
                    },
                ],
            },
            // test
            {
                icon: 'warning',
                name: '测试专用',
                path: '/test',
                routes: [
                    {
                        name: '例子',
                        component: './Test/DataTable/Index',
                        path: '/test/data-table',
                    },
                ],
            },
            {
                icon: 'warning',
                name: '测试专用2',
                path: '/template',
                routes: [
                    {
                        name: '例子',
                        component: './.Template/Index',
                        path: '/template/index',
                    },
                ],
            },
            /**
             * =========================================================
             *                         正式环境
             * =========================================================
             */
            // dashboard
            {
                name: '主页',
                path: '/',
                redirect: '/dashboard/analysis',
            },
            {
                path: '/dashboard',
                name: '仪表盘',
                icon: 'dashboard',
                routes: [
                    {
                        name: '分析页',
                        path: '/dashboard/analysis',
                        component: './Dashboard/Analysis',
                    },
                    {
                        name: '监控页',
                        path: '/dashboard/monitor',
                        component: './Dashboard/Monitor',
                    },
                    {
                        name: '工作台',
                        path: '/dashboard/workplace',
                        component: './Dashboard/Workplace',
                    },
                ],
            },
            {
                icon: 'warning',
                name: '访问控制',
                path: '/access',
                routes: [
                    {
                        name: '角色管理',
                        path: '/access/role',
                        routes: [
                            {
                                name: '角色管理',
                                path: '/access/role',
                                component: './Access/Role/Index',
                            },
                            {
                                name: '角色详情',
                                path: '/access/role/detail',
                                component: './Access/Role/Detail',
                            },
                        ],
                    },
                    {
                        name: '资源管理',
                        path: '/access/resource',
                        component: './Access/Resource/Index',
                    },
                ],
            },
            {
                icon: 'warning',
                name: '系统配置',
                path: '/system',
                routes: [
                    {
                        name: '数据字典',
                        path: '/system/dictionary',
                        component: './System/Dictionary/Index',
                    },
                    // {
                    //     name: '变量配置',
                    //     path: '/system/property',
                    //     component: './System/Property/Index',
                    // }
                ],
            },
            {
                name: '账号管理',
                icon: 'user',
                path: '/account',
                routes: [
                    {
                        path: '/account/center',
                        name: 'center',
                        component: './Account/Center/Center',
                        routes: [
                            {
                                path: '/account/center',
                                redirect: '/account/center/articles',
                            },
                            {
                                path: '/account/center/articles',
                                component: './Account/Center/Articles',
                            },
                            {
                                path: '/account/center/applications',
                                component: './Account/Center/Applications',
                            },
                            {
                                path: '/account/center/projects',
                                component: './Account/Center/Projects',
                            },
                        ],
                    },
                    {
                        path: '/account/settings',
                        name: 'settings',
                        component: './Account/Settings/Info',
                        routes: [
                            {
                                path: '/account/settings',
                                redirect: '/account/settings/base',
                            },
                            {
                                path: '/account/settings/base',
                                component: './Account/Settings/BaseView',
                            },
                            {
                                path: '/account/settings/security',
                                component: './Account/Settings/SecurityView',
                            },
                            {
                                path: '/account/settings/binding',
                                component: './Account/Settings/BindingView',
                            },
                            {
                                path: '/account/settings/notification',
                                component: './Account/Settings/NotificationView',
                            },
                        ],
                    },
                    {
                        name: '用户管理',
                        path: '/account/staff',
                        routes: [
                            {
                                name: '员工管理',
                                path: '/account/staff',
                                component: './Account/Staff/Index',
                            },
                            {
                                name: '员工详情',
                                path: '/account/staff/detail',
                                component: './Account/Staff/Detail/Index',
                            },
                            {
                                name: '新建员工账号',
                                path: '/account/staff/add',
                                component: './Account/Staff/Add/Index',
                            },
                            {
                                name: '更新员工信息',
                                path: '/account/staff/edit',
                                component: './Account/Staff/Edit/Index',
                            },
                        ],
                    },
                    // {
                    //     name: '用户管理',
                    //     path: '/account/user',
                    //     component: './System/Dictionary/Index',
                    // }
                ],
            },
            // 例子
            {
                name: '模版',
                path: '/example/$template',
                routes: [
                    {
                        name: 'form',
                        path: '/example/$template/form',
                        component: './Template/form/Index',
                    },
                    {
                        name: 'form-详情',
                        path: '/example/$template/form/detail',
                        component: './Template/form/Detail/Index',
                    },
                    {
                        name: 'form-新增',
                        path: '/example/$template/form/add',
                        hideChildrenInMenu: true,
                        component: './Template/form/Add/Index',
                        routes: [
                            {
                                name: 'form-新增',
                                path: '/example/$template/form/add',
                                redirect: '/example/$template/form/add/basic',
                            },
                            {
                                name: '基础信息',
                                path: '/example/$template/form/add/basic',
                                component: './Template/form/Add/Steps/Basic',
                            },
                            {
                                name: '其他信息',
                                path: '/example/$template/form/add/other',
                                component: './Template/form/Add/Steps/Other',
                            },
                            {
                                name: '完成',
                                path: '/example/$template/form/add/done',
                                component: './Template/form/Add/Steps/Done',
                            },
                        ],
                    },
                    {
                        name: 'form-修改',
                        path: '/example/$template/form/edit',
                        component: './Template/form/Edit/Index',
                    },
                ],
            },
            {
                component: '404',
            },
        ],
    },
];
