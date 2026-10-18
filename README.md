# hw-proxy — Cloudflare Pages 反向代理

将所有请求代理到华为云 VPS（123.60.222.204），隐藏源站 IP。

## 部署步骤

1. 在 GitHub 新建仓库（如 `whdd-wdf/hw-proxy`），把本目录所有文件 push 上去
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
3. 选择刚建的仓库，Framework preset 选 None，Build command 留空，Deploy
4. 部署成功后 → Custom domains → 添加 `hw.whdd.ccwu.cc`
5. 在 Cloudflare DNS 把 `hw` 的 A 记录删掉（Pages 会自动接管），或保持灰云指向 Pages

## 文件结构

- `functions/[[path]].js` — 全量代理逻辑

## 原理

访问者 → hw.whdd.ccwu.cc → Cloudflare Pages → Functions 代理 → 123.60.222.204:80
源站防火墙只放行 Cloudflare IP，直接访问 IP 已被拒绝。
