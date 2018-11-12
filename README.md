@新坑

## 计划 
- 接入 
`iScaffold/manager` 部分


## Ant.Pro
> [参考1](https://www.missshi.cn/api/view/blog/5ab755dd22890966e2000003)

```example
.
├── config
├── dist
├── docker
├── functions
├── mock
├── node_modules
├── public
├── scripts
├── src # 源码
    ├── assets
    ├── components # 组件文件夹。每个页面可能是由一些组件组成的，对于一些相对通用的组件，建议将该组件写入components文件夹中，并在routes文件夹中的文件引入来使用。
    ├── defaultSettings.js
    ├── e2e
    ├── global.less
    ├── layouts # 每个路由对应的页面组件文件。主要定义具体页面的基本结构和内容。
    ├── locales
    ├── models # 用于组件的数据存储，接收请求返回的数据等。
    ├── pages
    ├── services # 用于与后台交互、发送请求等。
    └── utils
└── tests
```