# v1.0.0 验证报告

验证日期：2026-09-29。本次在 Windows 完成器材与训练审核后的软件检查。结果不构成医学认证、临床效果验证或真人训练完成证明。

## 自有服务器上线验收（2026-09-29）

正式网址：[https://www.zengyuwei.cn/fitness/](https://www.zengyuwei.cn/fitness/)。使用 `tests/browser_smoke.py --url` 直接访问公网HTTPS，**70项通过，0失败**，包含实际器材搜索、计划匹配、CSV导出、中文/英文每侧次数、本地记录重载与删除；浏览器为Chromium 153.0.8010.12。

初次检查发现Cloudflare自动插入统计脚本，69项通过、1项失败。随后仅为健身路径添加 `no-transform` 响应头，最终保留原有外部请求断言并全部通过。页面字节哈希与本地发布产物一致。另有原主页/LeetCode及资源路径6项公网测试通过、Linux发布器5项测试通过、Windows及Linux静态响应头各2项测试通过。

证据：[公网浏览器报告](verification/browser-live-report.json)、[原主页公网结果](verification/homepage-public-tests.txt)、[部署与回滚](DEPLOYMENT.md)。测试使用独立浏览器上下文中的合成数据，不代表浏览器重启后恢复、多地区网络或真实移动设备均已验证。下表保留应用本地验证；GitHub Pages仍未部署，自有服务器上线与Pages无关。

## 当前结果

| 验证层 | 实际结果 | 边界 |
|---|---|---|
| 数据校验 | 140条器材通过；35知识卡、12计划、36来源 | 字段和引用存在不等于论点已获独立研究验证 |
| Node单元 / 数据 / 构建 | **149项通过，0失败** | 包含本次新增6项回归 |
| Chromium真实本地HTTP | **70项通过，0失败** | 无内存Storage替代；验证重载后localStorage保留记录及删除 |
| 页面渲染 | 检查桌面首页、390px手机首页、比较表、每侧次数课表截图 | 不是全设备或辅助技术兼容性证明 |
| 可复现构建 | 根目录与dist的HTML一致；重复构建一致 | 最终HTML为413382字节 |
| 新增条目可发现 | 临时副本新增一项后校验与构建通过 | 计划可替代性仍需单独审核 |
| 95%器材覆盖率 | **未测量**，空观察集返回not-measured与null | 未实施真实场地抽样 |
| 专家 / 临床 / 翻译审校 | **未完成独立签署** | 程序测试不替代专业审阅 |
| GitHub Actions | 推送后在仓库Actions页面核对该提交的结果 | 本报告记录推送前的本地验证 |
| GitHub Pages | **未部署**；工作流仅手动触发 | 不将仓库推送称为网站上线 |

## 环境与命令

Windows；Node.js v24.2.0；Python 3.12.14；Playwright 1.57.0；Chromium 153.0.8010.12。Python依赖安装在忽略的本地 .venv，浏览器通过 PLAYWRIGHT_CHROMIUM_PATH 指向已有Chromium。CI保留Node.js 22和固定Playwright依赖。

~~~powershell
npm run check
$env:PLAYWRIGHT_CHROMIUM_PATH = '<已安装的Chromium可执行文件>'
.\.venv\Scripts\python.exe tests/browser_smoke.py --mode http
node src/audit-coverage.mjs docs/coverage_observations.json
~~~

完整结果：[Node输出](verification/node-tests.txt)、[浏览器检查JSON](verification/browser-report.json)。

## 本次回归覆盖

- 下拉划船组合机可同时满足两种拉动任务；挂片机器没有重量片时不满足动作条件。
- 单侧动作逐侧计量；中文显示“8–12 / 侧”，英文保留“8–12 / side”。
- 骑行进阶使用时长和强度，徒手进阶可以通过动作难度实现。
- 新增器材可搜索，140行比较表与CSV完整；数据ID、来源和类别一致。
- 8个功能页、12种导航语言、回退提示、RTL、明暗主题、查询转义、对话框与Escape。
- 安全筛查未知值、症状、特殊人群分流、真实器材匹配、条件变化使旧推荐失效。
- BMI换算、显式同意保存、可访问图表标题、缺失值保持空、HTTP重载后的日志保留、明确删除。
- 390 / 768 / 1440宽度的首页与比较表无视口溢出；测试路径无未捕获JavaScript错误或外部运行时资源请求。

## 证据与未验证项

[桌面首页](assets/desktop.png) · [手机首页](assets/mobile.png) · [横向比较](assets/compare.png) · [单侧次数课表](assets/plan.png)

以上截图均来自本次真实本地HTTP测试；数据为项目公开内容或合成输入，没有真实个人健康日志。

原交付包只有143项Node测试和66项document模式检查；原环境限制不适用于此次HTTP结果。此前document模式使用内存Storage适配器，不作为真实持久化证据。

仍未验证：file协议存储、关闭整个浏览器后的记录恢复、禁用存储环境的人工体验、真实Pages部署、iOS Safari、Android、Firefox、屏幕阅读器及打印视觉效果。自动化中的刷新持久化不能扩展解释为所有这些环境均已通过。
