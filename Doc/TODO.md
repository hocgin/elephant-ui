事件函数命名: `onClickXXX`

渲染组件函数: `renderXXX`


## 草稿
### 关于 `model` 的函数定义
```shell
// state
{
    // 分页数据
    page: {},
    // 详情数据
    detail: null,
    [..其他, 如: all]
    // 所有数据
    all: [],
}
// effects, 按功能命名
edit, 编辑
add, 新增
paging, 分页
changeXXX, 变更状态
delete, 删除
detail, 查询单个详情

// reducers,
fillPage, 填充分页数据
fillDetail, 填充详情数据

```

### 关于 `service` 的函数定义 
> service 按照后端 `controller` 的命名方式, 一一对应

```shell
// 分页查询
paging
// 分页查询(POST 方式)
_paging
// 更新单个
updateOne
// 新增单个
insertOne
// 删除多个
deletes,
// 查询单个
selectOne
// 查询所有
selectAll

```

### 关于每个页面的大体构成
- 分页查询
- 增加
- 删除
- 修改
- 详情

---------
## 代办事项
- [ ] 日志
- [ ] 系统配置
- [ ] 数据字典
- [ ] 账号管理