import {success} from "./utils/result";

export default {
    /**
     * 用户菜单资源
     */
    'GET /api/user/menu': (req, res) => {
        return res.json(success([{
            icon: "dashboard",
            locale: "menu.dashboard",
            name: "dashboard",
            path: "/dashboard",
            children: [{
                locale: "menu.dashboard.analysis",
                name: "analysis",
                icon: "dashboard",
                path: "/dashboard/analysis",
                children: [
                    {
                        locale: "menu.dashboard.analysis",
                        name: "analysis",
                        icon: "dashboard",
                        path: "/dashboard/analysis",
                        children: [
                            {
                                icon: "dashboard",
                                locale: "menu.dashboard.monitor",
                                name: "monitor",
                                path: "/dashboard/monitor",
                            }
                        ]
                    }
                ]
            }, {
                locale: "menu.dashboard.monitor",
                name: "monitor",
                path: "/dashboard/monitor",
            }, {
                locale: "menu.dashboard.workplace",
                name: "workplace",
                path: "/dashboard/workplace",
            }],
        }, {
            icon: "form",
            locale: "menu.form",
            name: "form",
            path: "/form",
            children: [{
                locale: "menu.form.basicform",
                name: "basicform",
                path: "/form/basic-form"
            }, {
                locale: "menu.form.stepform",
                name: "stepform",
                path: "/form/step-form"
            }, {
                locale: "menu.form.advancedform",
                name: "advancedform",
                path: "/form/advanced-form"
            }]
        }, {
            icon: "table",
            locale: "menu.list",
            name: "list",
            path: "/list",
            children: [{
                locale:
                    "menu.list.searchtable",
                name:
                    "searchtable",
                path:
                    "/list/table-list"
            }, {
                locale:
                    "menu.list.basiclist",
                name:
                    "basiclist",
                path:
                    "/list/basic-list",
            }, {
                locale: "menu.list.cardlist",
                name: "cardlist",
                path: "/list/card-list"
            }, {
                locale: "menu.list.searchlist",
                name: "searchlist",
                path: "/list/search"
            }]
        }, {
            icon: "profile",
            locale: "menu.profile",
            name: "profile",
            path: "/profile",
            children: [{
                locale: "menu.profile.basic",
                name: "basic",
                path: "/profile/basic"
            }, {
                locale: "menu.profile.advanced",
                name: "advanced",
                path: "/profile/advanced"
            }]
        }, {
            icon: "check-circle-o",
            locale: "menu.result",
            name: "result",
            path: "/result",
            children: [{
                locale: "menu.result.success",
                name: "success",
                path: "/result/success"
            }, {
                locale: "menu.result.fail",
                name: "fail",
                path: "/result/fail"
            }]
        }, {
            icon: "warning",
            locale: "menu.exception",
            name: "exception",
            path: "/exception",
            children: [{
                locale: "menu.exception.not-permission",
                name: "not-permission",
                path: "/exception/403"
            }, {
                locale: "menu.exception.not-find",
                name: "not-find",
                path: "/exception/404"
            }, {
                locale: "menu.exception.server-error",
                name: "server-error",
                path: "/exception/500"
            }, {
                locale: "menu.exception.trigger",
                name: "trigger",
                path: "/exception/trigger"
            }]
        }, {
            icon: "user",
            locale: "menu.account",
            name: "account",
            path: "/account",
            children: [{
                locale: "menu.account.center",
                name: "center",
                path: "/account/center"
            }, {
                locale: "menu.account.settings",
                name: "settings",
                path: "/account/settings"
            }]
        },

            // 测试专用
            {
                icon: "warning",
                name: "测试专用",
                path: "/test",
                children: [{
                    name: "例子",
                    path: "/test/data-table"
                }]
            },

            // 正式
            {
                icon: "warning",
                name: "访问控制",
                path: "/access",
                children: [{
                    name: "角色管理",
                    path: "/access/role"
                }, {
                    name: "资源管理",
                    path: "/access/resource"
                }]
            }, {
                icon: "warning",
                name: "系统配置",
                path: "/system",
                children: [{
                    name: "数据字典",
                    path: "/system/dictionary"
                },
                    // {
                    // name: "变量配置",
                    // path: "/system/data-dictionary"
                    // }
                ]
            }
        ]));
    },

    /**
     * 列出所有角色
     * - status [禁用/启用]
     */
    'GET /api/role': (req, res) => {
        return res.json(success({
            list: [{
                id: 1,
                name: "管理员",
                role: "ADMIN",
                describe: "可爱的管理员",
                createdAt: 1543674756762.010,
                status: 1
            }],
            pagination: {
                total: 0,
                pageSize: 10,
                current: 1
            },
        }));
    },
    /**
     * 列出所有权限
     * - type [菜单/资源]
     * - status [禁用/启用]
     */
    'GET /api/resource': (req, res) => {
        const {query: {params}} = req;
        const {
            status
        } = params;


        return res.json(success([{
            id: 1,
            name: "仪表盘",
            uri: "/dashboard",
            describe: "仪表盘的描述",
            createdAt: 1543674756762.010,
            type: 1,
            status: 1,
            children: [{
                id: 11,
                name: "仪表盘/1",
                uri: "/dashboard/1",
                describe: "仪表盘/1的描述",
                createdAt: 1543674756762.010,
                type: 2,
                status: 1
            }]
        }]))
    },

    'GET /api/dictionary': (req, res) => {
        const {query: {params}} = req;
        return res.json(success({
            list: [{
                id: 1,
                label: "gender",
                description: "性别",
                createdAt: 1543674756762.010,
            }, {
                id: 2,
                label: "switch",
                description: "开关",
                createdAt: 1543674756762.010,
            }],
            pagination: {
                total: 0,
                pageSize: 10,
                current: 1
            },
        }));
    },
    'GET /api/dictionary/1': (req, res) => {
        const data = success({
            id: Math.random(),
            label: "gender",
            describe: "性别",
            default: 2,
            list: [
                {
                    key: 1,
                    value: "女"
                }, {
                    key: 2,
                    value: "男"
                }
            ]
        });

        setTimeout(() => {
            res.json(data);
        }, 1000);
    },
    'DELETE /api/dictionary': (req, res) => {
        console.log('DELETE', success(null));
        setTimeout(() => {
            res.json(success(null));
        }, 1000);
    }
};
