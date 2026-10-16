# AI Workflow Atlas — portable source package

完整源码与可独立部署版本，数据快照日期：2026-10-16；22 个条目，原站数据修订号 7。

## 文件结构
- `public/`：完整 HTML、CSS、JavaScript、SVG、指南页面、三语词典和目录数据。
- `public/directory-data.json`：全部 22 个条目、来源、翻译和历史检查日志。
- `scripts/build.mjs`：零依赖构建脚本；生成 `dist/`。
- `vercel.json`：Vercel 部署配置。
- `.github/workflows/pages.yml`：GitHub Pages 自动部署配置。
- `original-sites-source/`：原平台全部跟踪源码及配置（含服务端 API、原始构建脚本、依赖清单与锁文件）。仅作原站源码归档，根目录部署使用可移植版本。已排除平台项目标识和凭据。

## 本地运行
需要 Node.js 20+。构建无需安装 npm 依赖：

```sh
npm run build
python3 -m http.server 3000 --directory dist
```

打开 http://localhost:3000/ 。中文为 `/directory.html?lang=zh`，日文为 `?lang=ja`。也可用任意静态 HTTP 服务器。不要直接双击 HTML：浏览器通常阻止 file:// 下的数据读取。

## GitHub 和 GitHub Pages
1. 解压后将本目录内容（包括 `.github`）上传到自己的新 GitHub 仓库，默认分支设为 `main`。
2. 仅备份源码可以使用私有仓库；Pages 是否可用于私有仓库取决于套餐。公开 Pages 会公开站点数据。
3. 仓库 Settings → Pages → Source 选择 GitHub Actions。
4. 推送或手动运行 Deploy GitHub Pages。相对数据路径支持 `username.github.io/repository/` 子路径。

## Vercel
1. 在 Vercel 中导入上述 GitHub 仓库。
2. Root Directory 保持仓库根目录；Framework Preset 选择 Other。
3. Build Command：`npm run build`；Output Directory：`dist`；不需要环境变量和付费 API。
4. Deploy。若希望继续私密访问，请在部署前设置适用的 Deployment Protection。GitHub Pages 与 Vercel 的访问控制不同于原 Sites。
5. 不要选择 `original-sites-source` 作为部署根目录：该目录依赖 Cloudflare R2、Sites 身份边界及原平台构建工具。

## 已保留功能
目录搜索、分类、排序、详情与原始来源链接；英文/简体中文/日文；本机收藏、阅读列表导出、历史更新日志及数据刷新。原条目的部分翻译来自随包词典，其余来自条目 translations 字段。收藏属于浏览器本地存储，不跨域迁移；更换域名后需要重新收藏。第三方网站仍需网络访问。

## 自动更新与后端限制（请先阅读）
本独立部署版本是可运行的数据快照，不声称已经连接实时研究代理。原站的定时更新仍指向原 Sites；不会同步到这个 Vercel/GitHub Pages 副本。历史日志是原站的真实历史，不代表副本执行过任务。刷新只重新读取当前部署的数据文件。

要更新副本，修改 `public/directory-data.json` 后提交 GitHub，Vercel/Pages 将重新部署。根目录没有公开写入 API，也没有复制原站的私密令牌。`/api/directory` 在 Vercel 仅映射到快照，前端使用相对 JSON 路径以兼容 GitHub Pages。

要恢复无人值守写入，需要另行配置持久存储、写入认证及定时代理，并迁移/重新关联更新任务。原站 `original-sites-source/app/api/update/route.ts` 依赖 Sites 的私密边界，不得直接作为公开、无认证的 Vercel 写接口使用。

## 安全与真实性
未包含 node_modules、构建缓存、Git 历史、登录状态、API 密钥或服务访问令牌。所有条目 tested=false。来源说明、厂商/作者说法与实测结论保持区分。未添加流量、收入、效果保证。新部署默认不自动申请 Google 收录，也未添加未经授权的站点验证信息。
