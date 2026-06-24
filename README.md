# 问卷管理系统

基于 Next.js 16 的在线问卷管理与编辑器，支持问卷创建、发布、数据收集和文件管理。
## 页面
![登录页](/public/readme/login.png)
![首页](/public/readme/homePage.png)
![问卷列表页](/public/readme/filePage.png)
![回收站页](/public/readme/recyclePage.png)
![创建问卷](/public/readme/addPage.png)
## 技术栈

- **框架**: Next.js 16 (App Router)
- **UI 库**: Ant Design 6
- **状态管理**: Zustand
- **语言**: TypeScript
- **样式**: CSS Modules + Tailwind CSS

## 功能模块

### 登录认证
- 用户名/密码登录
- Token 鉴权，路由守卫拦截未登录访问
- Zustand 管理用户状态（token、角色、用户名）

### 我的问卷
- 问卷列表（所有 / 已结束 / 待收集 筛选）
- 翻页查询
- 开始/停止问卷收集
- 复制填写链接、生成二维码
- 删除问卷（移入回收站）

### 回收站
- 查看已删除问卷
- 恢复问卷

### 我的文件
- PDF 文件上传
- 文件列表分页查询
- 文件删除

### 问卷编辑器
- **题型面板**：段落说明、单选题、多选题、下拉选项、单行文本、多行文本、矩形单选题
- **中间编辑区**：问卷标题、问卷说明、题目编辑、选项管理
- **属性面板**：必选设置、删除题目
- 上移/下移调整题目顺序

## 项目结构

```
├── app/
│   ├── (auth)/login/          # 登录页
│   ├── (dashboard)/
│   │   ├── page.tsx           # 我的问卷
│   │   ├── recycleBin/        # 回收站
│   │   ├── myFiles/           # 我的文件
│   │   └── layout.tsx         # 后台布局 + 路由守卫
│   ├── add/                   # 问卷编辑器
│   └── _components/           # 全局组件（Topbar、Sidebar）
├── components/
│   └── SvgIcon/               # SVG 图标组件
├── lib/
│   └── request.ts             # 请求封装（注入 token、解包数据）
├── services/                  # API 接口函数
│   ├── user/                  # 登录
│   ├── file/                  # 文件管理
│   └── apiPaths.ts            # 接口路径枚举
├── stores/
│   └── authStore.ts           # 认证状态
└── public/
    └── svg/                   # SVG 图标资源
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务
pnpm start
```

访问 http://localhost:3000 进入登录页。

## 环境变量

```env
# 后端 API 地址
BACKEND_URL=http://localhost:8080
```

## API 说明

所有请求通过 `lib/request.ts` 统一封装，自动注入 token、JSON 序列化请求体、解包后端 `ApiResponse` 返回的 `data` 字段。

```ts
import { reqFileList, reqDeleteFile } from '@/services/file/file'

// 获取文件列表
const data = await reqFileList(page, pageSize)

// 删除文件
await reqDeleteFile(fileId)
```
