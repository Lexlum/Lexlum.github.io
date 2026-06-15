const introGate = document.querySelector("[data-intro-gate]");
const enterButton = document.querySelector("[data-enter-site]");
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const navLinks = [...document.querySelectorAll(".desktop-nav a")];
const sections = [...document.querySelectorAll(".section-observed")];

const hideIntro = () => {
  introGate?.classList.add("is-hidden");
  window.setTimeout(() => {
    introGate?.classList.add("is-gone");
  }, 460);
};

enterButton?.addEventListener("click", hideIntro);
window.addEventListener("load", () => {
  window.setTimeout(hideIntro, 900);
});

const setMenu = (open) => {
  menuToggle?.setAttribute("aria-expanded", String(open));
  mobileMenu?.classList.toggle("is-open", open);
  mobileMenu?.setAttribute("aria-hidden", String(!open));
};

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  setMenu(open);
});

mobileMenu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    setMenu(false);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.14 }
);

sections.forEach((section) => revealObserver.observe(section));

const sectionMap = new Map(
  navLinks
    .map((link) => [link, document.querySelector(link.getAttribute("href"))])
    .filter(([, section]) => section)
);

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
  let activeLink = null;
  sectionMap.forEach((section, link) => {
    const box = section.getBoundingClientRect();
    if (box.top <= 160 && box.bottom >= 160) {
      activeLink = link;
    }
  });
  navLinks.forEach((link) => link.classList.toggle("is-active", link === activeLink));
};

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", updateHeader);
updateHeader();

const featuredProject = document.querySelector("[data-featured-project]");
const featuredImage = document.querySelector("[data-featured-image]");
const featuredMeta = document.querySelector("[data-featured-meta]");
const featuredTitle = document.querySelector("[data-featured-title]");
const featuredSummary = document.querySelector("[data-featured-summary]");
const featuredBullets = document.querySelector("[data-featured-bullets]");
const featuredMetrics = document.querySelector("[data-featured-metrics]");
const projectCards = [...document.querySelectorAll(".project-card")];
const heroStage = document.querySelector(".hero-stage");

if (heroStage) {
  const setHeroReveal = (event) => {
    const rect = heroStage.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    heroStage.classList.toggle("is-revealed", inside);
  };
  heroStage.addEventListener("pointermove", setHeroReveal);
  heroStage.addEventListener("pointerenter", setHeroReveal);
  heroStage.addEventListener("pointerleave", () => heroStage.classList.remove("is-revealed"));
  window.addEventListener("blur", () => heroStage.classList.remove("is-revealed"));
  window.addEventListener("scroll", () => heroStage.classList.remove("is-revealed"), { passive: true });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") heroStage.classList.remove("is-revealed");
  });
}

const projectDetails = {
  flagship: {
    image: "assets/photos/car-interior.jpg",
    imageAlt: "车内视角，象征车载智能体和中枢大模型落地场景",
    meta: "Flagship / 2024.07 - 2026.03",
    title: "车载中枢大模型",
    panelTitle: "Impact Snapshot",
    panelSummary: "车载主线项目的结果面板：业务效果、数据缩减与量产落地集中看，不在左侧重复展开过程。",
    summary:
      "主导多版本迭代，精细优化训练数据集，实现 43% 数据缩减，并持续提升提示词、训练数据、回流数据与反馈 bug 修复质量。",
    bullets: [
      "围绕车载中枢模型持续迭代提示词、训练数据、回流数据和反馈 bug 修复质量。",
      "精细优化训练数据集，实现 43% 数据缩减。",
      "智慧聆听车载量产落地，业务测试效果指标达到 95%。",
    ],
    metrics: [
      ["95%", "业务测试效果指标"],
      ["43%", "训练数据缩减"],
      ["量产", "智慧聆听车载落地"],
    ],
  },
  dfm: {
    image: "assets/photos/aispeech-technology.jpg",
    imageAlt: "思必驰官网科技视觉，象征 DFM 系列模型与 AI 产品演进",
    meta: "Owner / 2025.11 - Present",
    title: "DFM 系列模型演进",
    panelTitle: "Scale Run",
    panelSummary: "A800 百卡训练中的规模化指标摘要，右侧展开保留并行策略、Packing 与真实场景提升细节。",
    summary: "基于 A800 百卡集群，主导 7B-110B Dense 模型与 235B MoE 模型演进训练。",
    bullets: [
      "引入 CP、SP、EP 并行策略和 Packing 策略，模型效率提升 18%。",
      "MFU 达到 37%，训练吞吐与资源利用率同步提升。",
      "小模型 Function Call 在真实场景准确率提升 23%。",
    ],
    metrics: [
      ["235B", "MoE 模型演进训练"],
      ["37%", "训练 MFU"],
      ["23%", "Function Call 准确率提升"],
    ],
  },
  ascend: {
    image: "assets/photos/aispeech-company.jpg",
    imageAlt: "思必驰官网公司视觉，象征企业级训练适配与交付",
    meta: "Ascend / 2025.02 - 2025.03",
    title: "昇腾训练适配与优化",
    panelTitle: "Delivery Snapshot",
    panelSummary: "昇腾适配的交付结果面板：训练规模、MFU 与首个交付收益集中呈现，细节留给右侧卡片。",
    summary: "适配 MindSpeed-LLM、LLaMAFactory、DeepSpeed-Chat 等训练框架，构建容器环境并适配调度启动方式。",
    bullets: [
      "支持 7B / 14B 模型训练，SFT 变长序列任务 MFU 接近 20%。",
      "MindIE 部署 DeepSeek、Qwen3-235B-A22B 等 MoE 模型，接入大模型应用平台。",
      "首个交付项目达到千万级收益，支持私有化部署并可快速复制。",
    ],
    metrics: [
      ["20%", "昇腾 SFT 任务 MFU"],
      ["14B", "训练适配规模"],
      ["千万级", "首个交付收益"],
    ],
  },
  agent: {
    image: "assets/photos/aispeech-technology.jpg",
    imageAlt: "思必驰官网科技视觉，象征分布式智能体和工具调用系统",
    meta: "Agent / 2025.07 - Present",
    title: "分布式智能体研发",
    panelTitle: "Agent Backbone",
    panelSummary: "工具代理、实时监控和车控 Agent 的系统能力总览，避免和展开列表重复叙述实现点。",
    summary: "实现 MCPhub 代理，支持多 MCP 服务集成、分组管理、自定义工具描述、单工具禁用和 Toollist 缓存。",
    bullets: [
      "支持 npm、uvx、sse、streamhttp、dxt 等方式加载 MCP。",
      "基于 Prometheus + Grafana 构建实时监控与告警体系。",
      "车控 Agent 上线使用，融合物模型快出、长短期记忆、车辆状态和 MCP list 筛选。",
    ],
    metrics: [
      ["MCP", "多服务统一代理"],
      ["Grafana", "实时监控告警"],
      ["车控", "Agent 上线使用"],
    ],
  },
  edge: {
    image: "assets/photos/car-interior.jpg",
    imageAlt: "车内智能系统场景，象征端侧大模型落地",
    meta: "Edge LLM / 2025.04 - Present",
    title: "端侧大模型适配",
    panelTitle: "Edge Runtime",
    panelSummary: "端侧落地的指标摘要：吞吐、首 Token 与车载响应窗口，详细优化路径在右侧展开。",
    summary: "调研主流端侧芯片并测试 LLaMA.cpp、MCL-LLM，多进程大核绑定提升吞吐并降低首 Token 延迟。",
    bullets: [
      "多进程大核绑定提升 3.3 倍吞吐，首 Token 延迟降低 67%。",
      "会议本端侧处理流程整体耗时提升 3.8 倍，1 万字会议从 35 分钟降至 8 分钟。",
      "车载端侧垂域分类、敏感词检测、指代改写和复杂车控可在 0.5s 内完成。",
    ],
    metrics: [
      ["3.3x", "端侧吞吐提升"],
      ["67%", "首 Token 延迟降低"],
      ["0.5s", "复杂车控响应窗口"],
    ],
  },
};

const renderFeaturedProject = (key) => {
  const data = projectDetails[key] ?? projectDetails.flagship;
  if (featuredImage) {
    featuredImage.src = data.image;
    featuredImage.alt = data.imageAlt;
  }
  if (featuredMeta) featuredMeta.textContent = data.meta;
  if (featuredTitle) featuredTitle.textContent = data.panelTitle ?? data.title;
  if (featuredSummary) featuredSummary.textContent = data.panelSummary ?? data.summary;
  if (featuredBullets) {
    featuredBullets.replaceChildren();
    featuredBullets.hidden = true;
  }
  if (featuredMetrics) {
    featuredMetrics.replaceChildren(...data.metrics.map(([value, label]) => {
      const item = document.createElement("div");
      const strong = document.createElement("strong");
      const span = document.createElement("span");
      strong.textContent = value;
      span.textContent = label;
      item.append(strong, span);
      return item;
    }));
  }
};

projectCards.forEach((card) => {
  const toggle = card.querySelector(".project-toggle");
  const detail = card.querySelector(".project-detail");
  toggle?.addEventListener("click", () => {
    const shouldOpen = toggle.getAttribute("aria-expanded") !== "true";
    projectCards.forEach((item) => {
      item.classList.remove("is-open");
      item.querySelector(".project-toggle")?.setAttribute("aria-expanded", "false");
      const itemDetail = item.querySelector(".project-detail");
      if (itemDetail) itemDetail.hidden = true;
    });
    if (shouldOpen) {
      card.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      if (detail) detail.hidden = false;
      renderFeaturedProject(card.dataset.projectKey);
      if (featuredProject) {
        const box = featuredProject.getBoundingClientRect();
        const targetTop = window.scrollY + box.top - 112;
        const viewportBottom = window.scrollY + window.innerHeight;
        if (targetTop < window.scrollY || window.scrollY + box.bottom > viewportBottom) {
          window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        }
      }
    } else {
      renderFeaturedProject("flagship");
    }
  });
});

const tabs = [...document.querySelectorAll("[role='tab']")];
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      const panel = document.getElementById(item.getAttribute("aria-controls"));
      if (panel) {
        panel.hidden = !selected;
      }
    });
  });
});

document.querySelector("[data-copy-email]")?.addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.textContent = "已复制";
  try {
    await navigator.clipboard.writeText("864293718@qq.com");
  } catch {
    button.textContent = "邮箱已显示";
  }
  window.setTimeout(() => {
    button.textContent = "复制邮箱";
  }, 1400);
});
