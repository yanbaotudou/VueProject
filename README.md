# 单店铺运营 Web 管理端（饮品管理系统）

基于 `Vue 3 + Vite + Vue Router + Pinia + Element Plus + ECharts` 的单店铺饮品运营后台。

- 仅前端项目，无后端依赖
- 所有数据通过 Mock API 提供
- 使用 `localStorage` 持久化，刷新后数据不丢失
- 支持基础权限控制（未登录不可访问后台、角色菜单可见性控制）

## 技术栈

- Vue 3
- Vite
- Vue Router 4
- Pinia
- Element Plus
- ECharts
- ESLint + Prettier

## 功能模块

- 登录管理（模拟登录、token 持久化）
- 仪表盘（销售额/订单量趋势图，今日/本周指标）
- 店铺信息管理
- 饮品管理（分类、属性、上下架、CRUD）
- 订单管理（筛选、详情）
- 规则管理
  - 次日备量推荐规则（可配置并预览结果）
  - 优惠券发放规则（按用户分层与时间窗口）
- 用户分析（分层、下单次数、一键按规则发券）
- 优惠券管理（模板 CRUD、发放记录、手动发券）
- 评论管理（筛选、回复）
- 员工管理（角色、启禁用、CRUD）
- 系统设置（主题切换、基础信息）

## 账号与权限

默认内置账号：

- 店长：`admin / admin123`
- 店员：`clerk / clerk123`

权限说明：

- 店长：可访问全部模块
- 店员：可访问 `仪表盘 / 饮品管理 / 订单管理 / 评论管理 / 系统设置`

## 快速开始

```bash
npm install
npm run dev
```

启动后访问：`http://localhost:5173`

## 常用命令

```bash
npm run dev      # 本地开发
npm run build    # 生产构建
npm run preview  # 预览构建产物
npm run lint     # 代码检查
npm run format   # 代码格式化
```

## Mock 与持久化机制

- Mock 实现目录：`src/mock/`
- API 调用层：`src/api/`
- 持久化工具：`src/utils/storage.js`
- 启动时自动 seed：`src/main.js` 中调用 `ensureDatabase()`

本地存储 key：

- `drink-admin:db`
- `drink-admin:token`
- `drink-admin:auth-profile`

如需重置数据，可在浏览器中清空以上 localStorage 项。

## 项目结构

```text
.
├─ src
│  ├─ api                # 页面调用 API（封装 mock）
│  ├─ mock               # Mock 数据与 CRUD
│  ├─ router             # 路由与守卫（按模块拆分）
│  ├─ stores             # Pinia 状态管理（按领域拆分）
│  ├─ layout             # 后台主布局（侧边栏/顶栏/面包屑）
│  ├─ views              # 业务页面
│  ├─ components/common  # 通用组件
│  ├─ utils              # 工具函数（storage 等）
│  └─ styles             # 全局样式
├─ vite.config.js
├─ package.json
└─ README.md
```

## 路由清单

- `/login` 登录页
- `/dashboard` 仪表盘
- `/store` 店铺信息
- `/drinks` 饮品管理
- `/orders` 订单管理
- `/rules` 规则管理
- `/users` 用户分析
- `/coupons` 优惠券管理
- `/reviews` 评论管理
- `/staff` 员工管理
- `/settings` 系统设置

## 说明

- 当前为纯前端 Mock 项目，适合作为后台原型、演示项目或前后端联调前的开发基线。
- 若后续接入真实后端，可保持 `src/api/*` 接口签名不变，替换实现为真实请求即可。
