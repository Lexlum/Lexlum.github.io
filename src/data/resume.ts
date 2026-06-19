// ============================================================
// Resume data — 孙圣杰 (Sun Shengjie)
// Single source of truth for all sections.
// ============================================================

export const PROFILE = {
  name: "Sun Shengjie",
  nameCN: "孙圣杰",
  title: "大模型算法工程师",
  company: "思必驰科技股份有限公司",
  location: "上海",
  hometown: "无锡",
  phone: "19906154505",
  email: "864293718@qq.com",
  education: "南京信息工程大学 · 硕士",
  researchFocus: "自然语言处理 / 大语言模型 / 知识图谱",
};

export const ABOUT_TEXT =
  "超过五年大模型研发经验，专注 LLM 训练、推理加速、车载智能体、Agent 系统与端侧运行时。我把训练数据、推理延迟、工具调用和业务回流放在同一张桌面上看，目标是让模型版本可解释、问题可复现、能力可上线。";

export const ABOUT_ADVANTAGES = [
  "主动跟进大模型领域最新进展，积极在新算法上进行业务测试",
  "针对新算法与新产品开源代码学习研读，持续提升代码规范性与方法创新性",
  "强自我驱动力，对任务有明确计划，能独立制定并执行达成目标的策略",
];

export interface Capability {
  number: string;
  name: string;
  description: string;
}

export const CAPABILITIES: Capability[] = [
  {
    number: "01",
    name: "Model Training",
    description:
      "基于 DeepSpeed、Megatron-LM、LLaMAFactory、MindSpeed-LLM 等框架主导 7B–235B Dense 与 MoE 模型训练，引入 CP/SP/EP 并行与 Packing 策略，DFM 系列 MFU 达 37%、效率提升 18%。",
  },
  {
    number: "02",
    name: "Inference & Deployment",
    description:
      "使用 vLLM、SGLang、MindIE 实现高效推理部署；模型量化 (GPTQ/AWQ/QAT)、KV Cache 前缀缓存、Speculative Decoding 与 MOE EP 方案，对齐 A800 性能。",
  },
  {
    number: "03",
    name: "Agent Systems",
    description:
      "自研 MCPhub 代理支持多 MCP 服务集成、分组管理与工具缓存；车控 Agent 融合物模型、长短记忆与 Function Call，实现 Workflow/Agent/MCP 混合调用。",
  },
  {
    number: "04",
    name: "Edge LLM Runtime",
    description:
      "端侧芯片选型与推理引擎优化：多进程大核绑定提升吞吐 3.3 倍、首 Token 降低 67%；会议本万字处理从 35 分钟降至 8 分钟，超竞品 2.7 倍。",
  },
  {
    number: "05",
    name: "Research",
    description:
      "自然语言处理与大语言模型方向研究，发表 KGCDP-T、Adaptive Layer Sparsity (NeurIPS)、MoE-SVD (ICML)、BayesKD (ACL Findings) 等论文，持续跟进前沿算法。",
  },
];

export interface Project {
  number: string;
  category: string;
  period: string;
  name: string;
  summary: string;
  detail: string;
  work: string[]; // 完整工作内容（多条）
  achievements: string[]; // 全部业绩
  stats: { value: string; label: string }[];
  stack: string[];
  diagram: "pipeline" | "cluster" | "deploy" | "agent" | "edge"; // 示意图类型
}

export const PROJECTS: Project[] = [
  {
    number: "01",
    category: "思必驰 · 车载",
    period: "2024.07 - 2026.03",
    name: "车载中枢大模型",
    summary: "车载中枢大模型多版本迭代，覆盖数据、训练、评测到上线的全流程闭环。",
    detail:
      "主导多版本迭代，训练数据集缩减 43%，结合 SFT/DPO/GRPO 持续提升性能。主导开发 REACT 中文训练集增强 Function Call；实现长记忆、敏感词检测、指代改写、错字纠正、动态拼字、高噪声指令提取、复杂拒识等功能；多语种蒸馏使垂域分类准确率提升 50%。",
    work: [
      "主导多版本迭代，精细优化训练数据集，实现 43% 数据缩减，持续提升提示词、回流数据与 bug 修复质量，支撑训练/测试/更新/上线全流程。",
      "构建高可靠性数据框架，结合创新数据扩增策略与 SFT/DPO/GRPO 算法，显著提升各项任务性能。",
      "主导开发 REACT 中文训练集，增强 Function Call 能力，实现长记忆、敏感词检测、指代改写、错字纠正、动态拼字拼句、高噪声指令提取、复杂拒识等关键功能。",
      "多语种数据蒸馏构建语料库，多语种垂域分类任务准确率提升 50%，奠定跨语言场景基础。",
      "测试并实施 S-LoRA 与 RAG 方案，支持产品级自定义中枢落域功能。",
      "线上数据回流评估与测试，确保数据质量与系统性能持续优化。",
    ],
    achievements: [
      "中枢模型各项任务业务测试指标达 95%，业内领先。",
      "智慧聆听模块（错字纠正、动态拼字、高噪声指令提取）车载量产落地，获各车厂好评。",
      "长时记忆功能为感知决策提供支持，存储车主个人信息、动态、喜好，提供个性化定制服务。",
    ],
    stats: [
      { value: "95%", label: "业务测试指标" },
      { value: "43%", label: "数据集缩减" },
      { value: "+50%", label: "多语种准确率" },
    ],
    stack: ["SFT", "DPO", "GRPO", "REACT", "Function Call", "S-LoRA", "RAG", "数据蒸馏", "长记忆"],
    diagram: "pipeline",
  },
  {
    number: "02",
    category: "A800 百卡集群",
    period: "2025.11 - 至今",
    name: "DFM 系列模型演进",
    summary: "基于 A800 百卡集群主导 Dense 与 MoE 全系列模型训练演进。",
    detail:
      "基于 A800 百卡集群主导 7B–110B Dense 与 235B MoE 模型训练演进，引入 CP/SP/EP 并行与 Packing 策略。针对智能家居、车控垂直场景数据蒸馏，让小模型 Function Call 对标 235B 大模型。江苏省首个双备案模型。",
    work: [
      "基于 A800 百卡集群，主导 DFM 系列（7B-110B Dense、235B MoE）模型演进与训练。",
      "引入 CP、SP、EP 并行化策略与 Packing 策略，提升模型收敛效率。",
      "模型效率提升 18%，MFU 达到 37%。",
      "针对智能家居、车控垂直场景数据蒸馏，使小模型 Function Call 对标 235B 大模型，真实场景准确率提升 23%。",
    ],
    achievements: [
      "模型效率提升 18%，训练 MFU 达 37%。",
      "小模型 Function Call 真实场景准确率提升 23%。",
      "DFM 系列为江苏省首个双备案模型，控标关键点。",
    ],
    stats: [
      { value: "235B", label: "MoE 规模" },
      { value: "37%", label: "训练 MFU" },
      { value: "+23%", label: "FC 准确率" },
    ],
    stack: ["DeepSpeed", "Megatron-LM", "CP/SP/EP", "Packing", "MoE", "数据蒸馏", "Function Call"],
    diagram: "cluster",
  },
  {
    number: "03",
    category: "昇腾 NPU",
    period: "2025.02 - 2025.03",
    name: "昇腾训练适配与优化",
    summary: "昇腾 NPU 全栈适配，训练精度对齐 A800，推理部署大型 MoE 模型。",
    detail:
      "适配 MindSpeed-LLM / LLaMAFactory / DeepSpeed-Chat 等框架，对 14B/1.5B 模型 prefile 分析使训练速度精度对齐 A800。基于 MindIE 部署 DeepSeek、Qwen3-235B-A22B 等 MoE 模型，速度达 Nvidia 70%。首个交付项目千万级收益，支持私有化部署。",
    work: [
      "昇腾适配 MindSpeed-LLM、LLaMAFactory、DeepSpeed-Chat 等训练框架，构建容器环境，适配 vc 调度启动方式；对 14B/1.5B 模型 prefile 分析使训练速度与精度对齐 A800，Packing 策略 MFU 接近 20%。",
      "基于昇腾 MindIE 推理框架部署 DeepSeek、Qwen3-235B-A22B 等大型 MoE 模型，速度达 Nvidia 70%，接入大模型应用平台。",
      "基于 MindSpeed-LLM 适配 Qwen1.5/2.5、LLaMa3.1、零一万物、ChatGLM3、DFM 等开源模型的全量参数与 Lora 训练脚本；平台采用 modelslim 框架支持 W8A8 量化、MindIE 框架推理。",
    ],
    achievements: [
      "为大模型训练平台提供算法支持，首个交付项目达千万级收益，支持私有化部署，模式可复制。",
      "支持 7B/14B 量级模型训练，MindSpeed-LLM 训练效率与 Nvidia LlamaFactory 持平，SFT 变长序列 MFU 近 20%，单次训练成本降一倍；通过 profiler 逐层分析纠正 attention mask 精度问题。",
      "迭代跟进 DeepSeek 在 MindIE 上的部署，与 A800 vLLM 推理速度对齐。",
    ],
    stats: [
      { value: "20%", label: "SFT MFU" },
      { value: "70%", label: "达 Nvidia 速度" },
      { value: "千万", label: "级项目收益" },
    ],
    stack: ["MindSpeed-LLM", "LLaMAFactory", "DeepSpeed-Chat", "MindIE", "W8A8 量化", "modelslim", "vc 调度"],
    diagram: "deploy",
  },
  {
    number: "04",
    category: "智能体平台",
    period: "2025.07 - 至今",
    name: "分布式智能体研发",
    summary: "MCPhub 代理平台 + 车控 Agent，实现工具混合调用与实时监控。",
    detail:
      "实现 MCPhub 代理：多 MCP 服务集成、分组管理、自定义工具描述、单工具禁用、Toollist 缓存，支持 npm/uvx/sse/streamhttp/dxt 加载。基于 Prometheus + Grafana 构建监控告警。车控 Agent 融合物模型、长短记忆、车辆状态与 MCP 筛选，已上线使用。",
    work: [
      "实现 MCPhub 代理，支持多 MCP 服务集成、分组管理、自定义工具描述、单工具禁用、Toollist 缓存；支持 npm、uvx、sse、streamhttp、dxt 等加载方式。",
      "基于 Prometheus + Grafana 技术栈构建实时监控与告警体系。",
      "实现车控 Agent，基于 Function Call 实现车控功能，融合物模型、长短期记忆、车辆状态、MCP list 筛选等功能。",
    ],
    achievements: [
      "接入大模型应用平台，实现 Workflow、Agent、MCP 等工具的混合调用。",
      "新车控 Agent 方案上线使用。",
    ],
    stats: [
      { value: "MCPhub", label: "代理平台" },
      { value: "Workflow", label: "混合调用" },
      { value: "已上线", label: "车控 Agent" },
    ],
    stack: ["MCPhub", "npm/uvx/sse/dxt", "Function Call", "物模型", "长短记忆", "Prometheus", "Grafana"],
    diagram: "agent",
  },
  {
    number: "05",
    category: "端侧推理",
    period: "2025.04 - 至今",
    name: "端侧大模型适配",
    summary: "端侧芯片选型 + MTK 推理引擎优化，会议本与车载端侧量产部署。",
    detail:
      "梳理主流端侧芯片（骁龙8295/MTK8678/RK3588/后摩M50/Orinx 等），输出《端侧 LLM 芯片选型指南》。MTK 端侧引擎：INT4 权重 + INT16 激活混合精度，C++ 实现 KV Cache 分块 Prefill。会议本万字处理 35→8 分钟，超讯飞 2.7 倍；车载端侧复杂车控 0.5s 完成。",
    work: [
      "系统梳理主流端侧芯片算力（骁龙8295/MTK8678/RK3588/RK1820/后摩M50/Orinx AIBox），量化对比 INT4/INT8 峰值算力、内存带宽、功耗；测试 LLaMA.cpp 与 MCL-LLM 多进程大核绑定，吞吐提升 3.3 倍，首 Token 延迟降低 67%。",
      "基于 MediaTek GenAI SDK 编译 LLM，启用 INT4 权重量化 + INT16 激活值混合精度。",
      "设计分段式 Prefill 策略：C++ 自主实现动态 KV Cache 管理器，将长文本拆分为 <128 tokens 块进行前缀匹配与 prefill 计算。",
      "推理策略升级：INT16 Logits 反量化转 FP16，结合 Temperature、Penalty 采样丰富回答多样性。",
    ],
    achievements: [
      "为车载客户输出《端侧 LLM 芯片选型指南》，发现内存带宽为端侧推理关键瓶颈，采用混合量化策略。",
      "主导会议本端侧加速引擎研发，会议四任务整体耗时提升 3.8 倍：1 万字会议 35 分钟→8 分钟，超讯飞竞品 2.7 倍。",
      "车载端侧大模型 0.5s 内完成垂域分类、敏感词检测、指代改写、复杂车控；闲聊首 Token 0.7s，支持主动打断与全时垂域免唤醒，在 IOV 车载 OS 量产部署。",
    ],
    stats: [
      { value: "3.8x", label: "会议端侧提速" },
      { value: "3.3x", label: "端侧吞吐" },
      { value: "0.5s", label: "复杂车控" },
    ],
    stack: ["LLaMA.cpp", "MCL-LLM", "MediaTek GenAI SDK", "INT4/INT16 混合精度", "KV Cache", "C++", "多进程大核绑定"],
    diagram: "edge",
  },
];

export interface Achievement {
  title: string;
  org: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    title: "江苏省首个双备案模型",
    org: "DFM 系列 · 中枢模型",
    description: "自研 DFM 系列模型与中枢模型，控标关键点，助力思必驰成为江苏省首个完成双备案的大模型。",
  },
  {
    title: "2024 优秀研发团队奖",
    org: "思必驰 · 团队荣誉",
    description: "显著提升团队研发效率，贡献获团队认可，助力团队荣获年度「优秀研发团队奖」。",
  },
  {
    title: "千万级首个交付项目",
    org: "昇腾大模型训练平台",
    description: "为大模型训练平台提供算法支持，首个交付项目达千万级收益，支持私有化部署，模式可快速复制。",
  },
  {
    title: "IOV 部门书面致谢",
    org: "车载智能 · 关键里程碑",
    description: "主导解决 IOV 部门关键技术挑战，通过算法优化推动关键里程碑达成，获部门书面致谢。",
  },
];

export interface SkillGroup {
  category: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  {
    category: "代码技能",
    items: ["Python", "Java", "C++", "TypeScript", "Lua"],
  },
  {
    category: "大模型训练",
    items: ["SFT 微调", "DPO", "PPO", "GRPO", "GSPO"],
  },
  {
    category: "训练优化",
    items: [
      "LLaMAFactory",
      "DeepSpeed",
      "Swift",
      "Megatron",
      "DP/TP/PP/SP/CP/EP",
      "FlashAttention",
      "Zero 模式",
      "Ray",
      "FSDP",
      "重计算",
    ],
  },
  {
    category: "推理加速",
    items: [
      "SGLang",
      "vLLM",
      "GPTQ",
      "AWQ",
      "QAT",
      "KV Cache 前缀缓存",
      "Speculative Decoding",
      "EAGLE",
      "Lookahead",
      "Medusa",
      "MOE EP",
      "PagedAttention",
    ],
  },
];

export interface Paper {
  venue: string;
  year: string;
  title: string;
  authorship: "一作/共一" | "合作";
}

export const PAPERS: Paper[] = [
  {
    venue: "Knowledge-Based Systems",
    year: "2024",
    title:
      "KGCDP-T: Interpreting knowledge graphs into text by content ordering and dynamic planning with three-level reconstruction",
    authorship: "一作/共一",
  },
  {
    venue: "计算机科学与探索",
    year: "2024",
    title: "融合干预与反事实的知识感知型去偏推理模型",
    authorship: "一作/共一",
  },
  {
    venue: "计算机科学",
    year: "2023",
    title: "基于动态记忆和双层重构强化的知识图谱至文本转译模型",
    authorship: "一作/共一",
  },
  {
    venue: "NeurIPS",
    year: "2024",
    title:
      "Adaptive layer sparsity for large language models via activation correlation assessment",
    authorship: "合作",
  },
  {
    venue: "ICML",
    year: "2025",
    title:
      "MoE-SVD: Structured Mixture-of-Experts LLMs Compression via Singular Value Decomposition",
    authorship: "合作",
  },
  {
    venue: "ACL Findings",
    year: "2025",
    title: "BayesKD: Bayesian Knowledge Distillation for Compact LLMs in Constrained Fine-tuning",
    authorship: "合作",
  },
  {
    venue: "ICML",
    year: "2025",
    title: "Delta Decompression for MoE-based LLMs Compression",
    authorship: "合作",
  },
  {
    venue: "Neurocomputing",
    year: "2025",
    title: "RTA: A reinforcement learning-based temporal knowledge graph question answering model",
    authorship: "合作",
  },
  {
    venue: "计算机科学与探索",
    year: "2024",
    title: "基于大语言模型多阶段推理的情绪支持对话生成方法",
    authorship: "合作",
  },
];

export const HOBBIES = ["健身", "骑行", "羽毛球", "壁球", "登山", "抱石"];
