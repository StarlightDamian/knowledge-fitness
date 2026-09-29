# Contributing / 贡献指南

先阅读`docs/EVIDENCE_POLICY.md`与`docs/SAFETY.md`。一次PR解决一个可说明的变更，不用批量改写覆盖未知内容。

内容PR说明：原论点、建议修改、适用对象、来源与DOI、不同来源的角色/重叠、影响的知识ID或计划ID、是否涉及剂量/禁忌/特殊人群。纯表达润色也不能删除限制条件。

器材PR按`docs/ADDING_EQUIPMENT.md`；翻译PR按`docs/LOCALIZATION.md`。引用第三方图片或手册片段必须说明许可。不得提交真实个人健康记录、照片、姓名、账号、密钥或病历。

运行`npm run check`；涉及界面交互再运行`npm run test:browser`。受限环境使用document模式时明确局限，不能标注真实持久化/线上部署已通过。测试通过不是医学审批。

独立合格人员审校尚未完成时，保留pending。不得伪造资质、审阅人或签署日期。安全相关结论发生争议时，优先限制自动建议，再讨论证据，而不是追求推荐覆盖率。
