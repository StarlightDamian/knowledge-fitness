# 自有服务器部署

正式入口：**[https://www.zengyuwei.cn/fitness/](https://www.zengyuwei.cn/fitness/)**。

## 当前结构

```text
www.zengyuwei.cn/fitness/
  → 现有 home-page-public 网站隧道
  → 127.0.0.1:11003 / home-page.service
  → ~/.local/share/home-page/releases/current/fitness/index.html
```

复用 ST45V 的现有静态服务与 HTTPS 入口，无新增监听端口、DNS、隧道或运行时依赖。`/fitness` 自动重定向到 `/fitness/`；内部页面使用哈希路由，例如 [哑铃详情](https://www.zengyuwei.cn/fitness/#equipment/dumbbell)。未知服务器路径保持404。

服务只需要构建后的 `dist/index.html`，其中已经嵌入数据、样式、脚本和SVG。服务器不保存个人训练记录；在线版的可选记录仍保存在浏览器。相同域名下的路径共享浏览器存储，本应用只操作 `lift-atlas:prefs`、`lift-atlas:logs`。

### 保留页面原文与更新行为

初次公网浏览器检查发现Cloudflare自动注入 `static.cloudflareinsights.com` 的统计脚本。现通过本仓库 `src/serve-static.py` 继续使用Python标准库静态服务，只为 `/fitness` 和 `/fitness/…` 添加 `Cache-Control: public, no-cache, no-transform`。其他路径保持原行为；该设置要求缓存重新验证，并按[Cloudflare官方说明](https://developers.cloudflare.com/web-analytics/get-started/)阻止自动改写和统计脚本注入。公网复测保留了“无外部运行时请求”的检查，没有放宽断言。

用户级 `home-page.service.d/fitness-headers.conf` 仅替换启动命令，监听地址、端口、服务目录及恢复策略保持原值。服务器脚本位于 `/mnt/raid1/03_software_engineering/05_github/knowledge/knowledge-fitness/src/serve-static.py`，标准库运行，无新增生产依赖。更新服务器代码时须同步该文件，运行 `python3 tests/test_static_server.py` 并重启服务。

## 首次发布记录

日期：2026-09-29。

| 项目 | 记录 |
|---|---|
| 应用产物来源 | Git提交 `ddc844ddeb62fb2b3e07258d999ff961fcfbc236` |
| HTML大小 | 413382字节 |
| SHA-256 | `f0b9be329966e17746a40582b4e545af10e6756954158c0978b8b081a832cd11` |
| 发布前主页版本 | `release-0cz63f2y` |
| 含健身页面的版本 | `release-fkl42kqn` |
| 产物归档 | `/mnt/raid1/03_software_engineering/05_github/knowledge/knowledge-fitness/releases/20260929T123303Z-ddc844d/` |
| 备份、候选及收据 | `~/.local/state/knowledge-fitness/20260929T123303Z-ddc844d/` |

候选由当前线上版本完整复制，再加入 `fitness/index.html`。原主页的13个文件逐一核对SHA-256一致，未发布主页源码中其他尚未上线的改动。通过主页现有发布器原子切换版本，再重启用户级 `home-page.service`。

主页项目为 `/mnt/raid1/03_software_engineering/05_github/home-assistant/home-page`。本次仅修改其中的 `src/scripts/publish-static.py`、`tests/deployment.test.py` 和 `nas/deployment.md`，原文件已备份；没有提交或覆盖其其他未提交工作。

## 后续更新

1. 在健身仓库运行 `npm run check`，记录待发布 `dist/index.html` 的SHA-256。
2. 上传至服务器健身项目的独立版本目录，核对上传前后的哈希。
3. 复制**当时正在服务的**主页版本为新候选，只替换候选中的 `fitness/`。不要直接使用尚未验收的主页工作树或在正在服务的目录内重建。
4. 调用主页 `src/scripts/publish-static.py` 发布完整候选，重启 `home-page.service`。
5. 核对公网正文哈希、`/fitness` 重定向、内部页面刷新，以及原主页和LeetCode入口。

主页发布器已有明确保留规则：普通主页候选没有 `fitness/` 时继承当前目录；候选明确提供该目录时完整使用候选，不混入旧文件。Linux回归测试覆盖这两种行为、首次挂载、普通主页回滚及原有原子切换行为，5项通过。

GitHub推送运行CI，不自动更新此服务器。GitHub Pages工作流仅供另建副本，不管理正式网址。

## 回滚

保留完整的旧版本和发布收据。普通主页回滚继续保留当前健身页面；需要回退健身内容时，在新候选中明确放入旧版 `fitness/`，再通过同一发布器发布。

完整撤销首次挂载时，使用上述备份目录中的旧发布器发布收据的 `previousRelease`；根据实际需要恢复备份的发布器、测试和主页部署文档，并移除本次新增的 `fitness-headers.conf`、执行用户级 `daemon-reload` 后重启服务。不要把普通主页回滚当作卸载健身页面，也不要直接切换旧链接丢失后续页面仍需的历史资源。

## 浏览器验收

```bash
python tests/browser_smoke.py --url https://www.zengyuwei.cn/fitness/ --output test-results/browser-live
```

此模式直接打开正式网址，在独立浏览器上下文中使用合成记录检查保存、刷新和删除，不操作真实用户日志。报告记录实际URL、浏览器版本和验证边界。当前结果见[验证报告](TEST_REPORT.md)。

本次结果：正式HTTPS页面70项浏览器检查通过；原主页相关6项公网检查通过；发布器5项、静态响应头2项Linux测试通过。公网HTML的SHA-256与发布产物一致，`/fitness`返回301，`/fitness-other/`与`/fitness/unknown/`保持404。未执行整机重启或其他浏览器、地区的覆盖测试。
