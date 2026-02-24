# 部署教程（GitHub Pages + 阿里云 ECS）

本文档对应当前项目（Vue 3 + Vite）并覆盖两种部署方式：

1. `GitHub Pages`（自动化部署）
2. `阿里云 ECS + Nginx`（服务器部署）

---

## 1. GitHub Pages 自动部署

### 1.1 前置条件

- 仓库已在 GitHub（例如：`yanbaotudou/VueProject`）
- 默认分支为 `main`
- 仓库里已有工作流：`.github/workflows/deploy-pages.yml`

当前项目已配置：

- 构建命令：`npm run build`
- Pages workflow：`actions/configure-pages + actions/deploy-pages`
- 路由模式：构建时设置 `VITE_ROUTER_MODE=hash`（避免 Pages 刷新 404）

### 1.2 GitHub 仓库设置

按顺序检查：

1. `Settings -> Pages`
2. `Build and deployment -> Source` 选择 `GitHub Actions`

再检查权限：

1. `Settings -> Actions -> General`
2. `Workflow permissions` 选择 `Read and write permissions`
3. 勾选 `Allow GitHub Actions to create and approve pull requests`（可选，但建议开）

### 1.3 触发部署

本地提交并推送到 `main`：

```bash
git add .
git commit -m "chore: trigger pages deploy"
git push github main
```

然后到：`Actions -> Deploy To GitHub Pages` 查看执行状态。

部署成功后访问：

```text
https://<你的用户名>.github.io/<仓库名>/
```

本项目示例：

```text
https://yanbaotudou.github.io/VueProject/
```

---

## 2. 常见错误排查（重点）

### 2.1 报错：`Get Pages site failed ... Not Found`

这是你目前遇到的问题。通常由以下原因导致：

1. 仓库还没启用 Pages
2. `Source` 没选 `GitHub Actions`
3. Actions 权限不足（不是 Read/Write）
4. 仓库是组织仓库且策略限制了 Pages API

按这个顺序处理：

1. 先到 `Settings -> Pages` 手动把 `Source` 切到 `GitHub Actions`
2. 到 `Settings -> Actions -> General` 把 `Workflow permissions` 设为 `Read and write`
3. 重新 `Re-run all jobs`

如果仍报 `Not Found`，执行一次“初始化站点”操作：

1. `Settings -> Pages -> Source` 临时改成 `Deploy from a branch`
2. Branch 选 `main`，目录选 `/root`，点 `Save`
3. 页面刷新后再改回 `GitHub Actions`
4. 再次触发 workflow

这个步骤会强制创建 Pages site 记录，之后 `configure-pages` 就能正常读取。

### 2.2 报错：`Permission denied (publickey)`

说明本机 SSH key 没绑定 GitHub。处理方式：

1. 查看公钥：`cat ~/.ssh/id_ed25519.pub`
2. GitHub -> `Settings -> SSH and GPG keys` 添加公钥
3. 验证：`ssh -T git@github.com`

### 2.3 页面打开空白/资源 404

检查：

- `vite.config.js` 是否根据 `GITHUB_REPOSITORY` 设置了 `base`
- workflow 构建时是否传了 `VITE_ROUTER_MODE=hash`

当前项目已经处理好这两点。

---

## 3. 阿里云 ECS + Nginx 部署

适用于需要自定义域名、https、反向代理等场景。

### 3.1 服务器安装依赖

以 Ubuntu 为例：

```bash
sudo apt update
sudo apt install -y nginx
```

### 3.2 本地构建

```bash
npm install
npm run build
```

构建产物在：`dist/`

### 3.3 上传到服务器

```bash
scp -r dist/* <user>@<ecs-ip>:/var/www/vueproject/
```

首次部署可先建目录：

```bash
ssh <user>@<ecs-ip> "sudo mkdir -p /var/www/vueproject && sudo chown -R $USER:$USER /var/www/vueproject"
```

### 3.4 Nginx 配置

新建 `/etc/nginx/sites-available/vueproject.conf`：

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/vueproject;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

启用配置并重载：

```bash
sudo ln -s /etc/nginx/sites-available/vueproject.conf /etc/nginx/sites-enabled/vueproject.conf
sudo nginx -t
sudo systemctl reload nginx
```

访问：`http://<ecs-ip>/`

---

## 4. 发布检查清单

每次发布前建议确认：

1. `npm run lint` 通过
2. `npm run build` 通过
3. 路由跳转正常（登录页、仪表盘、业务页）
4. 刷新页面不报 404（GitHub Pages 必须 hash 路由）
5. 本地存储数据正常（`drink-admin:*`）

---

## 5. 回滚方案

### 5.1 GitHub Pages

- 方式：回滚到上一个可用 commit 并推送
- 操作：

```bash
git log --oneline
git revert <bad_commit>
git push github main
```

### 5.2 阿里云 ECS

- 方式：保留上一版静态文件目录
- 例子：`/var/www/vueproject_prev` 与 `/var/www/vueproject`
- 回滚时切回旧目录并 reload Nginx

