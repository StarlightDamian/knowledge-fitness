# 如何验证“日常器材95%覆盖”

**当前：未测量。** `meta.json` 中 `coverageTarget=0.95`，`measuredEquipmentCoverage=null`。140个条目、12个主类仅描述本项目清单，不构成95%的证据。

## 2026-09-29 器材对抗审核

**结论：商业健身房和家庭基础训练的主要功能组已纳入；户外公共设施仍为部分覆盖。** 本次是目录案头核对，没有随机抽样、场地台账或使用频率数据，不能认定“全部主流器材”或估计市场覆盖率。

140条包括74条抗阻、18条有氧、11条体能、24条支撑、6条恢复和7条测量工具。数量同时包含机器、自由负重及配件；不能把140当成同一粒度的独立训练机器数。`cable-handles` 为握把附件总类，`rowing-handle` 为其中的V形握把；测覆盖率时应在固定的类型层级归并，不重复增加分子或分母。

### 功能组核对矩阵

“已纳入”表示列出的功能组有对应条目，不表示该组每种结构和品牌型号均完整。已有条目的名称、用途和适配条件仍需按具体设备手册核实。以下清单用于持续找缺项，不作为普及率调查的分母。

| 场景 / 功能组 | 对应条目示例 | 本次状态及边界 |
|---|---|---|
| 商业 / 家庭：自由负重 | `barbell`、`dumbbell`、`adjustable-dumbbell`、`kettlebell`、`weight-plate` | 已纳入 |
| 商业 / 家庭：支架与训练凳 | `power-rack`、`half-rack`、`flat-bench`、`adjustable-bench`、`preacher-bench` | 已纳入；本次补牧师凳 |
| 商业：胸肩推举、夹胸 | `chest-press`、`lever-chest`、`shoulder-press`、`lever-shoulder`、`pec-deck` | 已纳入 |
| 商业：水平与垂直拉 | `seated-row`、`lever-row`、`tbar-row`、`lat-pulldown`、`lever-lat-pulldown` | 已纳入；本次区分挂片与插片下拉 |
| 商业：膝主导训练 | `leg-press-45`、`stack-leg-press`、`hack-squat`、`smith`、`leg-extension`、`seated-leg-curl` | 已纳入；型号的行程与负荷不可直接横比 |
| 商业：髋、小腿与后链 | `hip-thrust-machine`、`hip-abductor`、`hip-adductor`、`kickback`、`standing-calf`、`roman-chair` | 已纳入 |
| 商业 / 家庭：滑轮与综合站 | `functional-trainer`、`cable-crossover`、`high-low-pulley`、`multi-gym` | 已纳入；多功能设备不表示所有动作条件都满足 |
| 商业 / 家庭：自重、悬挂和躯干 | `pullup-bar`、`dip-bars`、`rings`、`suspension-trainer`、`ab-wheel`、`vertical-knee-raise` | 已纳入；本次补肘垫支撑举腿架 |
| 商业 / 家庭：心肺设备 | `treadmill`、`upright-bike`、`elliptical`、`air-rower`、`stair-climber` | 已纳入；另有其他阻力划船机和健身车类型 |
| 家庭 / 工作室：弹力和垫上工具 | `loop-band`、`mini-band`、`exercise-mat`、`stability-ball`、`slider-discs`、`pilates-ring` | 已纳入；本次补普拉提环，不等同吊环 |
| 商业 / 家庭：体能工具 | `jump-rope`、`battle-ropes`、`plyo-box`、`medicine-ball`、`sled`、`sandbag` | 已纳入；需要另核实动作、空间及地面 |
| 户外公共设施 | `pullup-bar`、`dip-bars`、`outdoor-air-walker`、`outdoor-leg-press`、`outdoor-rider` | **部分覆盖**；转腰器、太极轮、横梯、自重划船器等仍未收录 |
| 支撑、恢复与测量 | 卡箍、握把、护具、滚轴、秤、围度尺、心率设备等 | 已纳入；统计时与训练机器分层报告 |

### 本次修正与结构来源

| 条目 / 修正 | 官方结构依据 | 证据边界 |
|---|---|---|
| 新增 `lever-lat-pulldown` 挂片高位下拉 | [Hammer Strength Iso-Lateral Front Lat Pulldown](https://www.lifefitness.com/en-us/catalog/strength-training/plate-loaded/plate-loaded-iso-lateral-front-lat-pulldown) | 确认挂片、独立运动臂、可调座位与大腿垫；不采纳页面的效果营销或无关动作表述 |
| 新增 `preacher-bench` 牧师凳 | [Hammer Strength Seated Arm Curl](https://www.lifefitness.com.au/commercial/seated-arm-curl-fwac) | 确认牧师弯举支撑姿态；凳与提供阻力的弯举机分别登记 |
| 新增 `vertical-knee-raise` 肘垫支撑举腿架 | [Life Fitness Dip/Leg Raise](https://www.lifefitness.com/en-us/catalog/strength-training/benches/life-fitness-dip-leg-raise) | 确认肘垫支撑与上下机踏步；该示例兼具双杠，不假定所有举腿架都兼具双杠功能 |
| 新增 `pilates-ring` 普拉提环 | [Decathlon DOMYOS Pilates Ring](https://www.decathlon.co.uk/p/pilates-ring-black-40cm-ring/_/R-p-9224) | 确认环形工具和接触垫；不把厂商目录当作增肌或康复试验 |
| `dip-bars` 增加户外场景与别名 | [Outdoor-Fitness 产品目录](https://www.outdoor-fitness.com/) | 目录含公共双杠，也揭示转腰器、太极轮、横梯、自重划船器等缺项；不采纳厂商疗效宣称 |
| `hand-gripper`、`wrist-roller` 的动作标签改为抓握 / 腕部 | 对照条目现有结构与用途 | 修正其误归“肘屈伸”；没有新增疗效结论 |
| 杠铃片在分类文档中与数据统一为自由负重 | [分类约定](TAXONOMY.md) | 直接持握或为兼容设备加载；不是不提供主要负荷的支撑附件 |

上述链接在本次审核中用于核对结构。研究来源仍须按条目的 `evidenceScope` 理解；新增条目不代表完成型号安全认证、动作教学、独立专家审校或计划可替代性验证。未验证的普及率、承重和效果不填数值。

## 先写分母，再做采样

目标总体至少区分：普通商业健身房、家庭训练、公共/户外健身设施；按目标市场地域和场地类型分层。专项竞技与医院康复设备可以单设范围，不能先排除它们、再对外宣称“所有健身场景”。

分别报告三个口径，而不是混用：

- **类型覆盖**：样本出现的规范类型中，目录能正确识别的比例；去掉同类不同品牌重复。
- **设备台数覆盖**：样本实际设备件数中，正确归类的件数比例；需要解释同类大量设备的加权影响。
- **使用/任务覆盖**：按真实使用频次或读者查询任务计算；需要额外合规收集观察数据，不能用台数替代。

先固定采样方案，保留未知与无法映射项；不要为了把覆盖做高而只访问与目录接近的健身房。每次发布记录采样日期、场景数、地域和抽样方式。站点便利样本只能说明这个样本，不能未经依据外推全国或全球。

## 最小计算器

`src/audit-coverage.mjs` 只计算给定观察清单的加权占比，不估计真实市场覆盖率或置信区间。

```json
[
  {"equipmentId": "dumbbell", "count": 12},
  {"equipmentId": "unknown-outdoor-device", "count": 3}
]
```

这只是格式示例，**不是实际调查**。按此假设样本，覆盖为12/15=80%，未知项仍然留在分母。`count`的含义须在调查元数据中固定为台数或观察次数，不得同一文件混合。

```bash
node src/audit-coverage.mjs docs/coverage_observations.json
```

随包文件为空数组，输出 `not-measured` 和 `ratio: null`，不输出0%或100%的伪测量结果。

真实采样建议另存：`sampling_frame`、`region`、`setting`、`date`、匿名场地ID、原始器材名、规范ID/unknown、分类核查人。不要上传用户身份或可识别的健身活动轨迹。CLI接收完成清洗的汇总记录。

## 达标门槛

对外发布95%必须有定义好的总体和样本证据，并报告各分层结果、未知项与不确定性。聚类/加权抽样的区间估计需要相应统计方法，本版没有实现。不要只把一次小样本的点估计≥95%当成有统计把握的达标。

厂商目录适合发现缺项，不是无偏的器材普及率数据。品牌变体原则上映射既有类型，真正不同的机械原理或主要任务才新增类型ID。
