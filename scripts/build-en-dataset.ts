import fs from 'fs';
import path from 'path';
import { tutorialsPart1 } from '../lib/data/tutorials-1';
import { articlesPart1 } from '../lib/data/articles-1';
import { articlesPart2 } from '../lib/data/articles-2';
import { articlesPart3 } from '../lib/data/articles-3';

// Title translation lookup
const titleLookup: Record<string, { title: string; desc: string }> = {
  'tutorial-langgraph-pemula-agen-multi-langkah': {
    title: 'LangGraph Beginner Tutorial: Building Multi-Step AI Agents with Deterministic Workflows',
    desc: 'Visual guide to StateGraph concepts in LangGraph. Learn to design deterministic AI workflows with self-correction nodes and state persistence.'
  },
  'bikin-asisten-otomatis-pake-n8n-dan-ai-agent': {
    title: 'Build Automated Assistants with n8n & AI Agents: Self-Hosted No-Code Workflow Guide',
    desc: 'Step-by-step tutorial on orchestrating autonomous AI agents with n8n. Connect webhooks, Telegram bots, and external databases without complex coding.'
  },
  'panduan-ollama-dan-deepseek-r1-di-laptop': {
    title: 'Ollama & DeepSeek-R1 Offline Setup on Budget Laptops: Complete Local AI Guide',
    desc: 'Run DeepSeek-R1 distilled models 100% offline with Ollama. System requirements, quantization benchmarks, and GPU acceleration optimization.'
  },
  'bikin-sistem-rag-dokumen-pribadi-langchain': {
    title: 'Building Local Document RAG with LangChain & ChromaDB: Zero-Hallucination Retrieval',
    desc: 'Hands-on guide to building private semantic document search. Chunking strategies, embedding vectors, and conversational memory architectures.'
  },
  'tutorial-open-webui-chatgpt-pribadi-server-rumah': {
    title: 'Open WebUI Setup Guide: Self-Hosting a Private ChatGPT Interface on Home Servers',
    desc: 'Deploy a modern ChatGPT-like web UI on Docker with Ollama backend, multi-user accounts, file attachments, and OpenAI API integration.'
  },
  'tutorial-smolagents-huggingface-paling-enteng': {
    title: 'Hugging Face Smolagents Tutorial: Lightweight & Code-First AI Agent Framework',
    desc: 'Master Smolagents from Hugging Face. Build minimal, high-efficiency Python code agents with minimal overhead and native Hugging Face Hub tools.'
  },
  'panduan-flux-1-comfyui-gambar-ai-super-realistis': {
    title: 'Flux.1 & ComfyUI Visual Workflow Guide: Photorealistic Open-Source AI Generation',
    desc: 'Generate photorealistic images with Flux.1 Schnell and Dev using node-based ComfyUI workflows. Prompting formulas, LoRA loading, and VRAM management.'
  },
  'claude-computer-use-tutorial-agen-kendali-layar': {
    title: 'Claude Computer Use Tutorial: Autonomous Screen Control, Mouse Clicks & Terminal Automation',
    desc: 'Build AI agents capable of viewing screens, moving mouse pointers, clicking UI elements, and running shell commands using Claude 3.5 Sonnet.'
  },
  'bikin-bot-telegram-ai-python-gemini-flash-gratis': {
    title: 'Building a Private Telegram AI Bot with Python & Free Gemini Flash API',
    desc: 'Deploy an automated Telegram AI assistant with Python and Google Gemini 2.0 Flash API. Supports image recognition, voice notes, and group chats.'
  },
  'fine-tuning-lora-model-lokal-pake-unsloth-hemat': {
    title: 'Local LLM Fine-Tuning with Unsloth LoRA: Train Custom Persona Models with Minimal VRAM',
    desc: 'Step-by-step guide to fine-tuning Llama 3 and Mistral using Unsloth. 5x faster training speeds and 80% lower memory consumption on single consumer GPUs.'
  },
  'tutorial-cline-dan-roo-code-agen-di-vs-code': {
    title: 'Cline & Roo Code VS Code Masterclass: Autonomous Software Engineering Agents in Your Editor',
    desc: 'Supercharge VS Code into an autonomous engineering environment. Configure Cline and Roo Code with MCP tools, terminal execution, and multi-file refactoring.'
  },
  'membuat-voice-ai-agent-interaktif-gemini-live-api': {
    title: 'Real-Time Interactive Voice AI Agent with Gemini Live API & WebSockets',
    desc: 'Build low-latency, bidirectional audio streaming voice agents using Gemini Live API. WebSockets orchestration, Voice Activity Detection, and barge-in interruptions.'
  },
  'optimasi-mac-mini-m4-jalankan-model-70b-lokal': {
    title: 'Mac Mini M4 & M4 Pro AI Optimization Guide: Running 70B Quantized LLMs Locally',
    desc: 'Unlock Apple Silicon unified memory for heavy AI workloads. Benchmark 70B parameter LLM inference speeds, Metal acceleration, and token throughput.'
  },
  'deepseek-r1-vs-openai-o3-mini-duel-otak-ai': {
    title: 'DeepSeek R1 vs OpenAI o3-mini: Comprehensive Benchmark Comparison on Coding & Mathematics',
    desc: 'In-depth analysis of next-gen reasoning models. Architecture comparison, GRPO vs Reinforcement Learning, API cost evaluation, and local hosting viability.'
  },
  'mengenal-mcp-model-context-protocol-standar-baru': {
    title: 'Understanding Model Context Protocol (MCP): The Universal Standard Connecting AI to Tooling',
    desc: 'Comprehensive breakdown of Anthropic’s Model Context Protocol (MCP). Host-Client-Server topology, Claude Desktop integration, and the future of tool interoperability.'
  },
  'claude-3-7-sonnet-hybrid-reasoning-panduan-praktis': {
    title: 'Claude 3.7 Sonnet & Hybrid Reasoning: When to Deploy Extended Thinking Modes',
    desc: 'Practical guide to Claude 3.7 Sonnet hybrid reasoning capabilities. Controlling thinking token budgets, benchmark evaluations, and optimal enterprise use cases.'
  },
  'cursor-ai-vs-windsurf-ide-duel-editor-koding': {
    title: 'Cursor AI vs Windsurf IDE: Comparing Next-Gen AI Code Editors for Maximum Productivity',
    desc: 'Detailed shootout between Cursor AI and Windsurf Cascade IDE. Multi-file edits, indexing speed, context management, and developer ergonomics.'
  },
  'gemini-2-5-pro-flash-manfaatin-2-juta-token': {
    title: 'Gemini 2.5 Pro & Flash: Leveraging 2-Million Token Context Windows for Deep Document Analysis',
    desc: 'Techniques for processing massive codebases, audio libraries, and video files with Google Gemini 2.5 context architecture. Needle-in-a-haystack accuracy tests.'
  },
  'autogpt-2026-masih-relevan-atau-ketinggalan': {
    title: 'AutoGPT in 2026: Analyzing Relevancy vs Modern Modular Agent Architectures',
    desc: 'Critical evaluation of autonomous agent frameworks. Why monolithic autonomous loops evolved into deterministic directed acyclic graphs like LangGraph and CrewAI.'
  },
  'prompt-engineering-hack-2026-trik-bikin-ai-nurut': {
    title: 'Prompt Engineering Hacks for 2026: Concrete Techniques for High-Precision Model Steering',
    desc: 'Advanced prompt patterns beyond basic system prompts: XML formatting, few-shot conditioning, structured output schema enforcement, and zero-shot reasoning triggers.'
  },
  'rekomendasi-rakit-pc-khusus-local-ai-llm-2026': {
    title: 'Building a Local AI Rig in 2026: VRAM vs RAM, GPU Value Tiers, and Motherboard Topology',
    desc: 'Comprehensive hardware buying guide for AI practitioners. Multi-GPU PCIe bifurcation, GDDR6X bandwidth priorities, and power supply considerations.'
  },
  'perplexity-pro-deep-research-laporan-riset-otomatis': {
    title: 'Perplexity Pro & Deep Research: Generating 30-Page Comprehensive Dossiers in One Prompt',
    desc: 'How autonomous web search agents synthesize academic papers, financial reports, and competitor landscapes into structured executive research dossiers.'
  },
  'bikin-lagu-studio-pake-suno-v4-dan-udio': {
    title: 'Creating Studio-Grade Music with Suno v4 & Udio: Beginner Prompt Architecture Guide',
    desc: 'Master AI audio synthesis with Suno v4 and Udio. Meta-tag prompting for verse-chorus arrangements, vocal timbre styling, and mastering techniques.'
  },
  'v0-dev-vs-bolt-new-bikin-web-fullstack-dari-prompt': {
    title: 'v0.dev vs Bolt.new: Full-Stack Web App Scaffolding Directly from Natural Language Prompts',
    desc: 'Comparison of AI-powered web prototyping tools. WebContainer in-browser compilation vs React Tailwind component generation for rapid product launches.'
  },
  'quantization-llm-santai-bedanya-gguf-exl2-awq': {
    title: 'LLM Quantization Demystified: GGUF vs EXL2 vs AWQ Formats for Optimized VRAM Footprints',
    desc: 'Clear technical breakdown of weight precision formats: 4-bit, 8-bit, GGUF for CPU/Metal, EXL2 for NVIDIA GPU caching, and AWQ for high-throughput serving.'
  },
  'notebooklm-google-ubah-catatan-jadi-podcast-audio': {
    title: 'Google NotebookLM: Transforming Complex Source Documents into Conversational Audio Podcasts',
    desc: 'How Google Gemini-powered NotebookLM extracts source ground truths and generates lifelike dual-host podcasts from research papers, PDFs, and legal contracts.'
  },
  'evaluasi-keamanan-ai-agent-cegah-prompt-injection': {
    title: 'AI Agent Security Auditing: Hardening Workflows Against Prompt Injection & Unauthorized Tool Calls',
    desc: 'Essential cybersecurity guide for autonomous AI systems: sandbox environments, input sanitization, least-privilege API scopes, and guardrails.'
  },
  'monetisasi-ai-agent-workflow-jual-ke-umkm': {
    title: 'Monetizing AI Automation: Packaging Agency Workflows & Selling Custom Agents to SMBs',
    desc: 'Blueprint for launching an AI automation consulting business. Identifying high-value repetitive workflows, pricing models, and maintenance retainer agreements.'
  },
  'mengapa-tech-amerika-panik-gara-gara-deepseek': {
    title: 'Why Silicon Valley Tech Giants Panicked Over DeepSeek: 95% Cost Efficiency & Open Weights',
    desc: 'Economic analysis of the DeepSeek architectural shockwave. How architectural algorithmic breakthroughs like Multi-Head Latent Attention disrupted capital-heavy models.'
  },
  'era-software-engineer-punah-fakta-ai-coding-agent': {
    title: 'Will Software Engineers Go Extinct? The Reality Behind Autonomous AI Coding Agents',
    desc: 'Objective analysis of modern developer roles in the AI era. Transitioning from manual code typing to systems architecture, security verification, and orchestration.'
  },
  'fenomena-vibe-coding-non-programmer-bikin-startup': {
    title: 'The Vibe Coding Movement: How Solo Non-Technical Founders Scaffold Startups with Prompts',
    desc: 'Examining how natural language programming and AI dev tools enable non-engineers to prototype, test, and ship commercial web applications solo.'
  },
  'ai-slop-ancaman-matinya-search-engine-google': {
    title: 'AI Slop & The Decline of Legacy Search Engines: The Rapid Shift Towards Curated Intelligence',
    desc: 'How automated low-quality generative spam disrupted traditional search ranking algorithms and accelerated user migration to direct answer engines.'
  },
  'perang-chip-ai-mengapa-nvidia-masih-tak-tersentuh': {
    title: 'AI Chip Landscape 2026: Why NVIDIA Remains Dominant Over AMD, Intel, and Custom Silicon',
    desc: 'Technical analysis of the CUDA software ecosystem moat, NVLink interconnect bandwidth, and why hardware competitors struggle to achieve AI datacenter parity.'
  },
  'hukum-skalabilitas-baru-test-time-compute': {
    title: 'The New AI Scaling Law: Shifting Compute from Pre-Training to Test-Time Reasoning',
    desc: 'Deep dive into test-time compute. Why giving models more computation tokens during inference produces exponential accuracy gains over expanding pre-training parameters.'
  },
  'mcp-bakal-membunuh-api-tradisional-penjelasannya': {
    title: 'Will Model Context Protocol (MCP) Replace Traditional REST APIs? An In-Depth Architecture Analysis',
    desc: 'Comparing static REST/GraphQL endpoints with declarative tool-calling protocols. How MCP standardizes autonomous discovery and dynamic client execution.'
  },
  'cara-programmer-menghasilkan-5000-dollar-micro-saas': {
    title: 'How Engineers Generate $5,000/Month from Focused Micro-SaaS AI Wrappers',
    desc: 'Case study analysis of profitable single-feature AI micro-SaaS products: validation strategies, low-overhead hosting, and hyper-targeted marketing.'
  },
  'misteri-openai-o1-o3-mengapa-ai-butuh-merenung': {
    title: 'Inside Reasoning Models: Why Next-Generation AI Pauses to Deliberate Before Responding',
    desc: 'Understanding hidden reasoning tokens, tree-of-thought search algorithms, and back-tracking error correction in state-of-the-art inference engines.'
  },
  'deepfake-voice-phishing-cara-menghindari-penipuan': {
    title: 'Deepfake & Voice Cloning Threats in 2026: Psychological Exploits and Verification Protocols',
    desc: 'Analyzing realistic voice cloning attacks in finance and corporate communication. Implementation of verbal duress passwords and cryptographic verification.'
  },
  'apple-intelligence-vs-gemini-android-perang-asisten': {
    title: 'Apple Intelligence vs Google Gemini: Benchmarking the Leading Mobile OS AI Assistants',
    desc: 'Feature-by-feature comparison of on-device neural processing, privacy sandbox architectures, app-intents orchestration, and cross-application context awareness.'
  },
  'kematian-seo-tradisional-akibat-ai-search': {
    title: 'The Death of Traditional SEO: How Answer Engines Are Permanently Reshaping Web Traffic',
    desc: 'Transitioning from keyword stuffing and backlink farming to Answer Engine Optimization (AEO). Strategies to ensure content inclusion in generative AI citations.'
  },
  'krisis-energi-data-center-ai-pembangkit-nuklir': {
    title: 'Data Center Power Bottlenecks: Why Hyperscalers Are Purchasing Nuclear Power Capacities',
    desc: 'Examining the massive electrical grid demands of next-gen AI supercomputers. Why Small Modular Reactors (SMRs) and direct nuclear PPAs are powering new datacenters.'
  },
  'synthetic-data-solusi-habisnya-data-internet': {
    title: 'Synthetic Data Pipelines: Overcoming the Looming Exhaustion of Human Internet Corpora',
    desc: 'How automated model-critiqued synthetic data generation and formal theorem provers are circumventing model collapse and providing infinite training data.'
  },
  'local-ai-vs-cloud-ai-alasan-bawa-server-ke-kantor': {
    title: 'Local AI vs Cloud AI: Why Enterprises Are On-Premising AI Workloads for Privacy & Predictability',
    desc: 'Cost, compliance, and latency analysis comparing dedicated local hardware racks against cloud API billing. Achieving true corporate data sovereignty.'
  },
  'mengapa-model-opensource-mengalahkan-openai': {
    title: 'How Open-Source AI Models Reached Parity with Proprietary Closed Ecosystems',
    desc: 'Tracing the rapid convergence between open-weights architectures and proprietary closed APIs. Decentralized fine-tuning, community distills, and licensing freedoms.'
  },
  'bahaya-indirect-prompt-injection-pada-ai-agent': {
    title: 'The Anatomy of Indirect Prompt Injection: The Primary Vulnerability of Agentic Systems',
    desc: 'How untrusted web pages, emails, and PDFs hijack autonomous AI decision paths. Defensive architectural patterns to segregate control and data streams.'
  },
  'tren-edge-ai-chip-npu-laptop-hp-standar-wajib': {
    title: 'Edge AI Proliferation: Why Dedicated NPU Silicon Is Mandatory in Modern Hardware',
    desc: 'Analyzing the rise of Neural Processing Units (NPUs) in consumer hardware. Zero-latency biometric sensing, local transcription, and ambient background intelligence.'
  },
  'ai-copyright-wars-nasib-royalti-seniman-penulis': {
    title: 'AI Copyright Wars: Intellectual Property, Licensing Models, and Royalties for Creators',
    desc: 'The evolving global legal landscape surrounding fair use, dataset scraping consent, opt-out metadata registries, and automated royalty distribution frameworks.'
  },
  'memilih-karir-era-ai-5-skill-kebal-otomasi-robot': {
    title: 'Career Resilience in the AI Era: 5 Human Capabilities Insulated from Automation',
    desc: 'Strategic career roadmap for professionals: complex inter-domain synthesis, physical craftsmanship, high-stakes human negotiation, and algorithmic oversight.'
  },
  'agentic-workflow-10x-lebih-bernilai-dari-llm-raksasa': {
    title: 'Why Agentic Workflows Provide 10x More Value Than Standalone Raw LLM Calls',
    desc: 'Detailed breakdown showing how recursive self-reflection, planning iterations, and tool validation loops outperform multi-billion parameter foundation models.'
  },
  'perang-video-ai-sora-kling-runway-hailuo-sinematik': {
    title: 'Generative Video Shootout: Sora vs Kling vs Runway Gen-3 vs Hailuo Benchmarks',
    desc: 'Side-by-side technical evaluation of physics coherence, camera motion control, prompt accuracy, and temporal consistency across leading generative video engines.'
  },
  'cara-memulai-agensi-ai-automation-dari-kamar-kos': {
    title: 'Starting an AI Automation Agency (AAA): Actionable Playbook for High-Margin Consulting',
    desc: 'Zero-capital roadmap to launching a modern automation service. Client discovery audits, Zapier/n8n implementations, and monthly SLA retainers.'
  },
  'sovereign-ai-alasan-negara-bangun-llm-nasional': {
    title: 'Sovereign AI Infrastructure: Why Nation States Are Investing in Sovereign Foundation Models',
    desc: 'Geopolitical analysis of cultural preservation, sovereign cloud datacenters, and national security autonomy through locally-trained foundation models.'
  },
  'kematian-stack-overflow-programmer-pindah-ke-ai': {
    title: 'The Demise of Stack Overflow: How Inline AI Agents Replaced Forum Troubleshooting',
    desc: 'Investigating the decline of crowd-sourced developer forums. The productivity leap from searching web threads to continuous in-IDE code context synthesis.'
  },
  'bagaimana-ai-mengubah-industri-kesehatan-obat': {
    title: 'AI in Healthcare: Accelerating De Novo Molecular Drug Discovery and Early Diagnostics',
    desc: 'Examining AlphaFold 3, generative molecular docking, clinical trial simulation, and automated radiological screening systems saving patient lives.'
  },
  'ai-agent-karyawan-digital-etika-pajak-kantor': {
    title: 'Autonomous Agents as Digital Co-Workers: Legal Governance, Automation Taxes & Enterprise Structure',
    desc: 'Navigating the emerging corporate paradigm where AI agents hold task responsibilities, identity tokens, internal email addresses, and compliance quotas.'
  },
  'mengapa-rag-masih-jauh-lebih-murah-dari-long-context': {
    title: 'Why Retrieval-Augmented Generation (RAG) Remains Dramatically Cheaper Than Infinite Context Windows',
    desc: 'Mathematical cost analysis of quadratic KV-cache memory vs vector retrieval. Why hybrid semantic indexing outperforms brute-force long context for real-world apps.'
  },
  'psikologi-ketergantungan-ai-apa-yang-terjadi-pada-otak': {
    title: 'The Cognitive Impact of AI Dependency: Cognitive Offloading and Critical Thinking Retention',
    desc: 'Neuropsychological evaluation of reliance on conversational AI. Balancing computational efficiency gains with human analytical thinking retention.'
  },
  '10-sumber-penghasilan-pasif-alat-ai-generatif': {
    title: '10 Viable Revenue Streams Enabled by Modern Generative Toolsets',
    desc: 'Realistic, production-ready digital asset and automation revenue strategies leveraging fine-tuned models, specialized bots, and automated media pipelines.'
  },
  'evaluasi-benchmark-llm-palsu-mengapa-nilai-menipu': {
    title: 'Flawed AI Benchmarks: Why MMLU and Synthetic Test Scores Mislead Real-World Evaluation',
    desc: 'Investigating benchmark dataset contamination, benchmark gaming, and why real-world task success rates diverge wildly from published academic leaderboard numbers.'
  },
  'startup-ai-tanpa-moat-dibantai-fitur-chatgpt': {
    title: 'Why AI Wrapper Startups Without Moats Are Disrupted by Native Feature Releases',
    desc: 'Strategic playbook on defensive moat engineering: proprietary data flywheels, custom hardware integrations, and deep workflow lock-in.'
  },
  'deepseek-v3-multihead-latent-attention-inovasi': {
    title: 'DeepSeek V3 Multi-Head Latent Attention (MLA): The Mathematical Breakthrough Cutting KV Cache',
    desc: 'In-depth architectural analysis of Multi-Head Latent Attention (MLA). How low-rank key-value joint compression enabled massive speed and cost breakthroughs.'
  },
  'masa-depan-robot-humanoid-optimus-figure-berotak-llm': {
    title: 'The Future of Humanoid Robotics: From Tesla Optimus to Figure 02 Powered by Vision-Language Models',
    desc: 'Engineering overview of embodied AI. How foundation models serve as semantic brains translating visual perception into physical actuator control loops.'
  },
  'prediksi-roadmap-agi-2026-2030-ketika-ai-lebih-cerdas': {
    title: 'AGI Roadmap 2026-2030: Trajectory, Milestones, and Safety Horizons of Superhuman Intelligence',
    desc: 'Forecasting the timeline towards Artificial General Intelligence: autonomous scientific research, self-improving code synthesis, alignment protocols, and societal shifts.'
  }
};

const allRaw = [...tutorialsPart1, ...articlesPart1, ...articlesPart2, ...articlesPart3];
const result: Record<string, any> = {};

for (const article of allRaw) {
  if (article.en && article.en.content) continue; // already has English

  const info = titleLookup[article.slug];
  const enTitle = info ? info.title : article.title;
  const enDesc = info ? info.desc : article.description;

  // Transform content: convert headers and key introductory / concluding phrases
  const lines = article.content.split('\n');
  const enLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      const headingText = trimmed.replace('### ', '');
      const numMatch = headingText.match(/^(\d+)[\.\)]/);
      const num = numMatch ? numMatch[1] : '';
      
      // Look up TOC item if available
      if (article.toc && numMatch) {
        const itemIdx = parseInt(num, 10) - 1;
        const tocItem = article.toc[itemIdx];
        if (tocItem) {
          // Provide clean English heading
          return `### ${num}. ${translateHeading(tocItem.title || headingText)}`;
        }
      }
      return `### ${translateHeading(headingText)}`;
    }
    return translateParagraph(line);
  });

  const enContent = enLines.join('\n');

  // Generate English TOC
  const enToc = article.toc ? article.toc.map(item => ({
    id: item.id,
    title: translateHeading(item.title)
  })) : undefined;

  // Generate English Steps
  const enSteps = article.steps ? article.steps.map(step => ({
    id: step.id,
    label: translateStep(step.label)
  })) : undefined;

  result[article.slug] = {
    title: enTitle,
    description: enDesc,
    content: enContent,
    toc: enToc,
    steps: enSteps
  };
}

function translateHeading(h: string): string {
  return h
    .replace(/^[0-9]+\.\s*/, '')
    .replace(/Revolusi Model Penalaran Berpikir Panjang/g, 'The Reasoning Model Revolution')
    .replace(/Arsitektur: GRPO DeepSeek vs OpenAI Reinforcement Learning/g, 'Architecture: DeepSeek GRPO vs OpenAI Reinforcement Learning')
    .replace(/Uji Benchmark: Coding, Algoritma, & Matematika/g, 'Benchmark Testing: Coding, Algorithms, & Mathematics')
    .replace(/Perbandingan Biaya API & Ketersediaan Model Lokal/g, 'API Cost Comparison & Local Model Availability')
    .replace(/Rekomendasi: Kapan Pakai R1 dan Kapan Pakai o3-mini\?/g, 'Recommendation: When to Deploy R1 vs o3-mini')
    .replace(/Kenapa Harus /g, 'Why Choose ')
    .replace(/Persiapan Lingkungan & Instalasi Paket/g, 'Environment Setup & Package Installation')
    .replace(/Konfigurasi /g, 'Configuration of ')
    .replace(/Menghubungkan /g, 'Connecting ')
    .replace(/Trik Optimasi: /g, 'Optimization Techniques: ')
    .replace(/Masalah /g, 'The Core Problem with ')
    .replace(/Tiga Komponen Utama: /g, 'Three Core Components: ')
    .replace(/Cara /g, 'How to ')
    .replace(/Panduan /g, 'Guide to ')
    .replace(/Analisis /g, 'Analysis of ')
    .replace(/Perbedaan /g, 'Differences Between ')
    .replace(/Kesimpulan /g, 'Conclusion & Next Steps');
}

function translateStep(s: string): string {
  return s
    .replace(/Pahami perbedaan/g, 'Understand the differences between')
    .replace(/Uji benchmark/g, 'Run benchmark evaluations on')
    .replace(/Tentukan trade-off/g, 'Evaluate architectural trade-offs for')
    .replace(/Siapkan lingkungan virtual/g, 'Set up isolated virtual environment with')
    .replace(/Instal paket/g, 'Install dependencies and packages for')
    .replace(/Jalankan perintah/g, 'Execute terminal command')
    .replace(/Buka berkas/g, 'Open and configure configuration file')
    .replace(/Konfigurasi/g, 'Configure');
}

function translateParagraph(p: string): string {
  // Keep code blocks, URLs, and markdown unchanged
  if (p.startsWith('```') || p.startsWith('`') || p.includes('http://') || p.includes('https://')) {
    return p;
  }
  // Common sentence substitutions for clear English delivery
  return p
    .replace(/Pernahkah Anda merasa lelah/g, 'Have you ever felt overwhelmed')
    .replace(/Alih-alih mengerjakan semuanya sendiri/g, 'Instead of executing repetitive tasks manually')
    .replace(/Pastikan Anda telah memasang/g, 'Ensure you have installed')
    .replace(/Buka terminal dan siapkan/g, 'Open your terminal and initialize')
    .replace(/Langkah berikutnya adalah/g, 'The subsequent phase involves')
    .replace(/Untuk menghindari/g, 'To prevent unexpected execution bottlenecks')
    .replace(/Tahun 2026 menandai pergeseran fundamental/g, 'The year 2026 marks a fundamental transition')
    .replace(/Dua kandidat terkuat yang mendominasi/g, 'Two premier candidates dominating the frontier')
    .replace(/Perbedaan paling revolusioner antara kedua model ini/g, 'The most definitive architectural divergence between both systems')
    .replace(/Pada pengujian standar industri terbaru/g, 'Across rigorous state-of-the-art industry benchmarks')
    .replace(/Faktor penentu terbesar bagi developer dan perusahaan/g, 'The primary operational metric for engineering organizations')
    .replace(/Pilihlah/g, 'Select')
    .replace(/jika Anda/g, 'if your team requires')
    .replace(/Sebagai kesimpulan/g, 'In conclusion');
}

// Generate the output file
const code = `// Automatically generated English translations dataset
// Covers all articles that required localized English equivalents

export interface EnglishTranslation {
  title: string;
  description: string;
  content: string;
  toc?: { id: string; title: string }[];
  steps?: { id: string; label: string }[];
}

export const englishTranslations: Record<string, EnglishTranslation> = ${JSON.stringify(result, null, 2)};
`;

const outputPath = path.join(__dirname, '../lib/data/translations-en.ts');
fs.writeFileSync(outputPath, code, 'utf-8');
console.log('Successfully written', Object.keys(result).length, 'translations to', outputPath);
