# 饮品管理系统架构说明（system.md）

本文档用于帮助新开发者快速理解当前前端项目的设计方式、技术选型、代码分层和扩展路径。

## 1. 项目定位

- 项目类型：单店铺运营 Web 管理端（仅前端）
- 目标：以接近真实后台系统的方式完成运营管理、数据看板与规则配置
- 当前后端形态：无真实后端，全部通过 Mock API + localStorage 持久化

核心价值：

- 页面与交互完整，可直接演示业务流程
- 数据可持久保存，刷新不丢失
- 分层明确，后续可平滑替换成真实接口

## 2. 技术栈

- 框架：Vue 3（Composition API + `<script setup>`）
- 构建工具：Vite 5
- 路由：Vue Router 4（懒加载 + 守卫）
- 状态管理：Pinia（按业务域拆分）
- UI：Element Plus
- 图表：ECharts（仪表盘趋势图）
- 代码规范：ESLint + Prettier
- 语言：JavaScript（ESM）

## 3. 架构设计方式（分层）

采用典型前端“页面-状态-接口-数据源”分层：

1. `views/`（页面层）
- 负责页面结构、交互事件、表单校验、状态展示
- 不直接操作 mock 数据

2. `stores/`（状态层）
- 管理列表数据、分页参数、loading、详情等页面状态
- 统一封装页面调用动作（fetch/create/update/remove 等）

3. `api/`（接口层）
- 暴露稳定的业务接口方法
- 当前实现对接 `mock/*`；未来可替换为真实 HTTP 请求

4. `mock/`（数据源层）
- 模拟后端 CRUD
- 通过 Promise + 延迟模拟网络
- 通过统一 DB 与 seed 机制维护业务数据

5. `utils/`（基础能力层）
- 本地存储封装、通用函数等

这种分层的重点是：

- 页面不依赖具体数据来源
- mock 可无痛切换为真实后端
- 业务复杂度主要沉淀在 `store + api + mock`，便于维护

## 4. 目录速览（你该先看哪里）

```text
src/
├─ main.js                    # 应用入口，注册插件、初始化 mock DB
├─ App.vue                    # 根组件，全局 loading 与主题切换
├─ layout/                    # 后台布局（侧栏/顶栏/内容区）
├─ router/                    # 路由配置与全局守卫
├─ views/                     # 业务页面
├─ stores/                    # Pinia 业务状态
├─ api/                       # 页面调用接口（当前代理 mock）
├─ mock/                      # 模拟后端与持久化数据
├─ components/common/         # 通用组件（如 PageHeader）
├─ utils/storage.js           # localStorage 统一封装
└─ styles/                    # 全局样式
```

推荐阅读顺序：

1. `src/main.js`
2. `src/router/index.js`
3. `src/layout/AppLayout.vue`
4. 任一业务链路（例如 drinks）：
   `views/drinks/DrinksView.vue -> stores/drinks.js -> api/drinks.js -> mock/drinks.js`
5. `src/mock/db.js` + `src/mock/seed.js`

## 5. 路由与权限设计

### 5.1 路由组织

- 路由按模块拆分在 `src/router/modules/*.js`
- 主路由在 `src/router/index.js` 汇总
- 页面组件采用懒加载

### 5.2 权限控制

- 登录态控制：
  - 未登录访问后台 => 重定向 `/login`
  - 已登录访问 `/login` => 重定向 `/dashboard`
- 角色控制（菜单可见 + 路由访问）：
  - 角色：`manager`（店长）、`clerk`（店员）
  - 路由 `meta.roles` 标记可访问角色
  - 守卫中校验，越权时跳转到当前角色可访问首页

### 5.3 Token 与登录信息

- token 和用户信息存 localStorage
- key 定义在 `src/utils/storage.js`

## 6. 数据层与持久化设计

### 6.1 统一数据库模型

- `src/mock/db.js` 负责：
  - 首次启动初始化 seed 数据
  - 读取与写入统一数据库对象
  - 提供 update 风格更新入口

### 6.2 Seed 策略

- `src/mock/seed.js` 内置默认业务数据：
  - 店铺、饮品、订单、用户、优惠券、评论、员工、规则等
- 首次进入应用自动落盘

### 6.3 Mock API 设计

- 每个业务文件提供 CRUD 与查询
- 使用 `Promise + setTimeout` 模拟网络时延
- 分页/筛选在 mock 层完成，前端行为接近真实后端

### 6.4 持久化 key

- `drink-admin:db`
- `drink-admin:token`
- `drink-admin:auth-profile`

## 7. 状态管理（Pinia）设计

按业务域划分 store，例如：

- `auth.js`：登录态、用户角色
- `orders.js`：订单列表、详情、趋势、指标
- `drinks.js`：饮品列表、分类、分页查询
- `coupons.js`：模板与发放记录
- `rules.js`：备量规则、发券规则、预览结果

通用模式：

1. state 存放 `list/total/loading/query/detail`
2. actions 统一执行 `fetch/create/update/delete`
3. 页面只调用 store action，不直接操作数据源

## 8. 页面与组件设计约定

### 8.1 页面结构

后台页面普遍遵循：

1. `PageHeader`（标题 + 操作区）
2. 搜索区（Element Plus Form inline）
3. 列表区（Table + Pagination）
4. 弹窗区（Dialog + Form）

### 8.2 交互规范

- 列表统一支持分页与空状态
- 新增/编辑统一走对话框 + 校验
- 删除操作带确认
- 全局消息使用 `ElMessage`
- 路由切换有全局 loading

## 9. 业务规则实现说明

### 9.1 次日备量推荐

- 位于 `mock/rules.js`
- 输入：窗口天数、近期/趋势权重、保底/上限
- 基于历史订单计算各饮品推荐备量

### 9.2 分层发券规则

- 配置维度：用户层级 + 下单次数区间 + 时间窗口 + 优惠券模板
- 规则可预览命中结果
- 用户分析页可一键按规则自动发券（模拟写入记录）

## 10. 主题与 UI 机制

- 系统设置页可切换浅/深色主题
- 主题状态保存在设置 store 中
- `App.vue` 通过监听主题给 `document.documentElement` 增加/移除 `dark` class
- 全局样式变量在 `src/styles/index.css`

## 11. 开发与运行

```bash
npm install
npm run dev
```

其他命令：

```bash
npm run build
npm run preview
npm run lint
npm run format
```

## 12. 如何扩展（最常见场景）

### 场景 A：新增一个业务页面

1. 新建 `views/xxx/XxxView.vue`
2. 新建 `router/modules/xxx.js` 并注册到 `router/index.js`
3. 新建 `stores/xxx.js`
4. 新建 `api/xxx.js`
5. 新建 `mock/xxx.js` 并接入 `mock/db.js` 数据结构

### 场景 B：把 mock 接口替换为真实后端

1. 保留 `api/*.js` 方法签名
2. 用 `fetch/axios` 替换 `api` 内部实现
3. store 和页面层基本无需改动（或只做少量字段适配）

### 场景 C：新增一个字段（例如 Drink 新增热量）

1. 修改 seed 与 DB 数据结构
2. 修改 mock CRUD 的读写逻辑
3. 修改 store/页面表单与展示列
4. 若接后端，再同步 API 字段映射

## 13. 风险与注意事项

- 当前为纯前端模拟，鉴权与权限仅用于前端展示控制，不具备安全防护能力
- localStorage 数据可被清空或篡改，仅用于开发/演示
- 图表与页面 chunk 较大，后续可通过 manualChunks 做体积优化

## 14. 关键文件索引

- 应用入口：`src/main.js`
- 路由守卫：`src/router/index.js`
- 布局：`src/layout/AppLayout.vue`
- 持久化工具：`src/utils/storage.js`
- Mock DB：`src/mock/db.js`
- Seed：`src/mock/seed.js`
- 登录态：`src/stores/auth.js`
- 仪表盘：`src/views/dashboard/DashboardView.vue`

---

如果你是第一次接手此项目，建议先跑起来，再按“目录速览的推荐阅读顺序”看一遍代码，半小时内可建立完整心智模型。
