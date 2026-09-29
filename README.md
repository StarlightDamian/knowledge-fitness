# Lift Atlas · 循证健身图谱

想增肌、减脂，先弄清器材怎么选、训练怎么排、做到什么程度。这里把常见器材、训练方法和研究依据放在一起：查用途与限制，按手头器材和时间找训练模板，用记录观察自己的变化。

**练得明白，再练得更好。** 不必先买齐器材，也不必把所有方法都练一遍。先选能持续执行的一种，再根据恢复和实际完成情况调整。

[English](README.en.md) · [下载离线网页](https://github.com/StarlightDamian/knowledge-fitness/raw/refs/heads/main/index.html) · [完整器材目录](docs/EQUIPMENT_CATALOG.md) · [本次对抗式审核](docs/ADVERSARIAL_REVIEW.md) · [证据审计](docs/CLAIM_AUDIT.md)

> **定位：面向公众的教育与模板匹配工具，不是诊疗系统。** 资料案头核对日期为2026-09-29；未完成独立持证专家审校。不要将元数据校验通过理解为医学认可。

## 这份图谱能回答什么

| 你的问题 | 去哪里看 |
|---|---|
| 第一次去健身房，这些器材练什么、使用前检查什么？ | [器材目录](docs/EQUIPMENT_CATALOG.md)；网页「器材图谱」 |
| 家里只有哑铃或弹力带，能怎样安排训练？ | 网页「计划匹配」，填写时间、经验和实际器材 |
| 器械和自由重量怎么选？哪些器材能替换？ | 网页「横向比较」；动作表中的器材组合 |
| 增肌一定要练到力竭吗？减脂只做有氧够吗？ | [通识速查](docs/KNOWLEDGE.md)；网页「知识」和「方法」 |
| 组数、次数、休息、余力和进阶怎么落实？ | 网页模板的每次课表、热身、进阶和停止条件 |
| 体重、腰围和训练负重变化该怎么记录？ | 网页「量化记录」，可本地导出和删除 |
| 有疼痛、疾病或特殊人群需求，标准模板还能用吗？ | [安全与适用范围](docs/SAFETY.md)；网页「人群」 |
| 收录是否完整，建议有什么依据？ | [器材覆盖核对](docs/COVERAGE.md)、[对抗式审核](docs/ADVERSARIAL_REVIEW.md)、[来源登记](docs/SOURCES.md) |

## 怎么使用

1. **先认器材**：按名称、部位、动作或场景查找，阅读用途和注意事项；示意图不能替代现场教学和具体型号手册。
2. **再选模板**：据实填写安全筛查，勾选实际能用的器材。没有合适模板时，页面会说明限制。
3. **按课表执行和记录**：看清每侧次数、组间休息与余力；抗阻按重复次数和负荷进阶，有氧按时长、频率和强度调整。
4. **遇到不确定的结论就查来源**：每张知识卡说明依据支持什么、不能证明什么；可通过 Issue 提交可核验的纠错。

公开模板可直接阅读；自动匹配限于完成筛查的 18–64 岁一般健康成人。其他人群有教育入口，具体安排需要适配。

## 当前内容

| 模块 | v1.0.0 内容 |
|---|---|
| 器材图谱 | 140个条目、12个主类；中英文名称/用途/注意事项、别名与交叉标签 |
| 横向比较 | 全目录表、最多6项并排比较、完整CSV导出；不编造增肌分数、伤病率和每分钟热量 |
| 计划匹配 | 12份含实际动作、组次、余力、休息及进阶规则的教育模板；目标/时间/经验/场景/真实器材约束 |
| 知识 | 35张双语知识卡、34个动作摘要、14种方法、12条人群适配路径 |
| 证据 | 36个去重来源文档；知识卡逐条说明各来源支持什么、不能证明什么 |
| 量化 | BMI数值、体重/腰围/睡眠/负重/组次/RIR/时长/RPE记录；日历窗口体重均值、本地导出和删除 |
| 语言 | 完整专业正文：简体中文、英文。12种语言的导航/入口；其余正文明确回退，不冒充完整翻译 |
| 网站 | 单文件、零运行时外部依赖，响应式、明暗主题、阿拉伯语RTL、键盘可操作、打印样式 |

商业健身房和家庭基础训练的大类已基本覆盖，户外公共设施仍有缺项。**95%是覆盖率目标，而非已测结果。** 140条中包含支撑、恢复与测量工具；部分条目有父子类别关系，不能直接作为市场器材类型的分母。见[覆盖口径与核对清单](docs/COVERAGE.md)。

## 立即使用

下载完整仓库后，打开根目录 `index.html`。网页中已嵌入数据、样式、脚本和SVG，不需要构建或API密钥。部分浏览器禁止 `file://` 本地存储，阅读与计算不依赖存储；更稳妥的本地访问方式：

```bash
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

软件检查、浏览器验证方式及未验证项见[测试报告](docs/TEST_REPORT.md)。GitHub 的文件预览会显示 HTML 源码；下载后在浏览器打开，或使用上面的本地 HTTP 服务。

## 仓库与网页发布

项目仓库：[StarlightDamian/knowledge-fitness](https://github.com/StarlightDamian/knowledge-fitness)。可以直接下载离线网页，也可以克隆源码：

```bash
git clone https://github.com/StarlightDamian/knowledge-fitness.git
cd knowledge-fitness
python -m http.server 8000
```

推送 `main` 会运行数据、单元及浏览器检查。**Pages 发布采用手动触发**：仓库维护者在 `Settings → Pages → Source` 选择 **GitHub Actions**，再到 `Actions → Deploy Pages → Run workflow` 发布。部署后的真实网址以该次成功运行的输出为准。

也可选择 `Deploy from a branch → main → /(root)`，使用已生成的根目录 `index.html`。这种方式必须在修改JSON后重新构建并提交HTML；不要与Actions发布同时使用。

GitHub官方说明：[自定义Pages工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 开发与验证

只需要Node.js 22或更新兼容版本；核心构建/测试没有npm依赖，无需 `npm install`。

```bash
npm run check                 # 数据校验 + 单元测试 + 生成HTML
npm run validate              # 检查器材字段、引用与资源
npm test                      # /tests 下的 Node 测试
npm run build                 # /src 构建到根目录与 /dist
node src/audit-coverage.mjs docs/coverage_observations.json
```

浏览器集成检查为可选开发依赖：

```bash
python -m pip install -r tests/requirements.txt
python -m playwright install chromium
npm run test:browser           # 使用本地HTTP；会检查浏览器持久化
# 无导航权限的受限环境，可仅验证渲染/交互：
python tests/browser_smoke.py --mode document
```

`--mode document` 的保存流程使用明确的内存存储适配器，不等于验证了真实硬盘持久化。机器已装Chromium时可设置 `PLAYWRIGHT_CHROMIUM_PATH`。

## 一种新器材，只改数据

复制 `src/data/equipment/` 中最接近的JSON，使用新的稳定ID与文件名，补足两种正文、分类、独特用途、注意事项、来源及审校状态。运行 `npm run check` 后，搜索、比较、器材勾选器、页面计数自动更新。**增加同主类的器材不需要改推荐引擎或HTML**；具体计划是否可替换，还要修改并审核相应动作的 `equipmentOptions`。

详见[扩展指南](docs/ADDING_EQUIPMENT.md)与[JSON Schema](schemas/equipment.schema.json)。

## 阅读与维护

| 文档 | 解决的问题 |
|---|---|
| [知识分类](docs/TAXONOMY.md) | 通识、目标、器材、动作、方法、人群如何避免混层 |
| [专业维度](docs/PROFESSIONAL_DIMENSIONS.md) | 剂量、技术、营养、疲劳、功能、安全与指标怎么放在同一系统 |
| [证据政策](docs/EVIDENCE_POLICY.md) | 两个链接不等于两项独立研究；如何升级或撤回结论 |
| [逐条审计](docs/CLAIM_AUDIT.md) | 每张知识卡的证据角色与限制 |
| [安全与康复](docs/SAFETY.md) | 推荐边界、急症分流、人群适配、不能自动康复的原因 |
| [推荐架构](docs/ARCHITECTURE.md) | 硬约束、排序、隐私、可复现构建 |
| [语言状态](docs/LOCALIZATION.md) | 哪些已翻译，哪些仍回退 |
| [覆盖审计](docs/COVERAGE.md) | 如何测量“日常器材95%”而不是宣称它 |
| [对抗式审核](docs/ADVERSARIAL_REVIEW.md) | 此次发现了哪些遗漏和训练问题，如何修正，还有哪些边界 |
| [发布检查](docs/RELEASE_CHECKLIST.md) | 已完成与需要真实专家/用户/托管环境验证的工作 |

## 许可与来源

代码：MIT，见 `LICENSE`。本项目原创文字、数据组织与SVG：CC BY 4.0，见 `LICENSE-CONTENT.md`。被引用论文、商标与厂商资料保留原权利，未随仓库打包论文全文或第三方图片。

结构灵感来自 [eternity4719/HowToLiveBetter](https://github.com/eternity4719/HowToLiveBetter) 和 [cdyforever/how-to-live-better](https://github.com/cdyforever/how-to-live-better)。这是独立实现，不是内容镜像。二者当前许可描述及条目数存在不同步情况；不据下游README推定上游授权。详见 `THIRD_PARTY.md`。

**不要把个人体检、真实训练日志、姓名或其他健康资料提交到公开Issue、PR或仓库。**
