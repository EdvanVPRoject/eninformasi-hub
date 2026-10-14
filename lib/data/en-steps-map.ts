// English step translations for all 51 tutorials that had Indonesian steps
export const enStepsMap: Record<string, { id: string; label: string }[]> = {
  "cara-bikin-autonomous-ai-agent-sendiri-crewai": [
    {
      "id": "step-1",
      "label": "Set up a clean Python 3.10+ virtual environment and install crewai with dependencies"
    },
    {
      "id": "step-2",
      "label": "Obtain API keys for your preferred LLM provider (OpenAI, Gemini, or Groq API)"
    },
    {
      "id": "step-3",
      "label": "Define Researcher and Writer Agent personas alongside Tasks in main.py"
    },
    {
      "id": "step-4",
      "label": "Execute crew.kickoff() and observe multi-agent orchestration in your terminal"
    }
  ],
  "tutorial-bikin-custom-mcp-server-postgresql": [
    {
      "id": "step-1",
      "label": "Create a TypeScript project and install @modelcontextprotocol/sdk and pg"
    },
    {
      "id": "step-2",
      "label": "Configure PostgreSQL database connection pool and secure credentials"
    },
    {
      "id": "step-3",
      "label": "Implement read-only schema inspection and SQL query execution tools"
    },
    {
      "id": "step-4",
      "label": "Connect the MCP server to Claude Desktop or Cursor IDE via claude_desktop_config.json"
    }
  ],
  "panduan-autogen-0-4-grup-chat-multi-agent": [
    {
      "id": "step-1",
      "label": "Install the latest autogen-agentchat and autogen-ext packages"
    },
    {
      "id": "step-2",
      "label": "Configure AssistantAgent with model client and system prompts"
    },
    {
      "id": "step-3",
      "label": "Build a RoundRobinGroupChat or SelectorGroupChat with termination conditions"
    },
    {
      "id": "step-4",
      "label": "Run the multi-agent market analysis team and stream real-time agent dialogue"
    }
  ],
  "cara-bikin-ekstensi-chrome-ai-plasmo-gemini": [
    {
      "id": "step-1",
      "label": "Initialize a Plasmo project with React and TypeScript templates"
    },
    {
      "id": "step-2",
      "label": "Configure Chrome Built-in AI (Prompt API / Gemini Nano) and API fallback"
    },
    {
      "id": "step-3",
      "label": "Build popup UI and content scripts for selected webpage text extraction"
    },
    {
      "id": "step-4",
      "label": "Load unpacked extension into chrome://extensions and test live summarizing"
    }
  ],
  "tutorial-langchain-expression-language-lcel": [
    {
      "id": "step-1",
      "label": "Install langchain-core, langchain-community, and LLM provider packages"
    },
    {
      "id": "step-2",
      "label": "Compose prompt, model, and StrOutputParser using the pipe operator |"
    },
    {
      "id": "step-3",
      "label": "Implement RunnableParallel for simultaneous context retrieval and question processing"
    },
    {
      "id": "step-4",
      "label": "Test streaming and batch invocation with .stream() and .batch() methods"
    }
  ],
  "cara-setup-vllm-ubuntu-server-inferensi-kilat": [
    {
      "id": "step-1",
      "label": "Verify NVIDIA drivers and CUDA 12.1+ status with nvidia-smi"
    },
    {
      "id": "step-2",
      "label": "Install vLLM in a dedicated Python virtual environment via pip"
    },
    {
      "id": "step-3",
      "label": "Launch the OpenAI-compatible vLLM server with PagedAttention and tensor parallelism"
    },
    {
      "id": "step-4",
      "label": "Benchmark throughput using curl or OpenAI client library"
    }
  ],
  "tutorial-rag-multimodal-colpali-baca-grafik-pdf": [
    {
      "id": "step-1",
      "label": "Convert PDF document pages into high-resolution image sequences"
    },
    {
      "id": "step-2",
      "label": "Extract visual token embeddings using the ColPali vision-language model"
    },
    {
      "id": "step-3",
      "label": "Store multi-vector embeddings in Qdrant or Vespa vector store"
    },
    {
      "id": "step-4",
      "label": "Perform Late Interaction retrieval to answer queries about complex charts and tables"
    }
  ],
  "bikin-bot-whatsapp-ai-baileys-groq-api-ngebut": [
    {
      "id": "step-1",
      "label": "Initialize Node.js project and install @whiskeysockets/baileys and groq-sdk"
    },
    {
      "id": "step-2",
      "label": "Set up QR code terminal authentication and session storage"
    },
    {
      "id": "step-3",
      "label": "Implement message listener with debounce and rate limiting"
    },
    {
      "id": "step-4",
      "label": "Send ultra-fast AI responses powered by Llama 3.3 on Groq LPUs"
    }
  ],
  "cara-bikin-ai-coding-assistant-neovim-avante": [
    {
      "id": "step-1",
      "label": "Ensure Neovim 0.10+ and Rust toolchain are installed on your system"
    },
    {
      "id": "step-2",
      "label": "Install Avante.nvim and dependencies (dressing.nvim, plenary.nvim, nui.nvim)"
    },
    {
      "id": "step-3",
      "label": "Configure provider settings with Claude 3.5 Sonnet or OpenAI API keys"
    },
    {
      "id": "step-4",
      "label": "Use <leader>aa to ask questions and <leader>ae to apply inline code edits"
    }
  ],
  "tutorial-local-search-engine-searxng-crawl4ai": [
    {
      "id": "step-1",
      "label": "Create docker-compose.yml to run private SearXNG and Redis instances"
    },
    {
      "id": "step-2",
      "label": "Configure settings.yml to enable JSON format outputs without rate limits"
    },
    {
      "id": "step-3",
      "label": "Integrate Crawl4AI to scrape and sanitize search result URLs into clean markdown"
    },
    {
      "id": "step-4",
      "label": "Connect the local search tool to your AI agent framework"
    }
  ],
  "convert-model-huggingface-ke-gguf-llamacpp": [
    {
      "id": "step-1",
      "label": "Clone ggerganov/llama.cpp repository and compile with CMake or make"
    },
    {
      "id": "step-2",
      "label": "Download Safetensors model weights from Hugging Face Hub"
    },
    {
      "id": "step-3",
      "label": "Run convert_hf_to_gguf.py to produce initial F16 or F32 GGUF model"
    },
    {
      "id": "step-4",
      "label": "Quantize to Q4_K_M or Q8_0 using llama-quantize for fast local inference"
    }
  ],
  "tutorial-voice-clone-ai-f5-tts-indonesia": [
    {
      "id": "step-1",
      "label": "Record an 8-12 second clean audio sample of your voice with clear articulation"
    },
    {
      "id": "step-2",
      "label": "Install F5-TTS and PyTorch with CUDA acceleration"
    },
    {
      "id": "step-3",
      "label": "Transcribe reference audio and configure inference parameters"
    },
    {
      "id": "step-4",
      "label": "Synthesize speech in Indonesian and English with natural emotional inflections"
    }
  ],
  "deploy-n8n-cloudflare-tunnels-gratis-aman": [
    {
      "id": "step-1",
      "label": "Point your domain to Cloudflare DNS with free SSL protection"
    },
    {
      "id": "step-2",
      "label": "Create a docker-compose.yml running n8n with persistent data storage"
    },
    {
      "id": "step-3",
      "label": "Install cloudflared and authenticate via Cloudflare Zero Trust tunnel"
    },
    {
      "id": "step-4",
      "label": "Route your custom domain to local n8n port without opening router ports"
    }
  ],
  "tutorial-bot-discord-ai-musik-suno-api": [
    {
      "id": "step-1",
      "label": "Create a Discord application in the Developer Portal and get your Bot Token"
    },
    {
      "id": "step-2",
      "label": "Set up Node.js or Python discord client with audio streaming permissions"
    },
    {
      "id": "step-3",
      "label": "Integrate Suno API / Chirp client to generate full music tracks from user prompts"
    },
    {
      "id": "step-4",
      "label": "Stream generated audio into voice channels and send track details in chat"
    }
  ],
  "cara-setup-dify-ai-agentic-workflow-selfhosted": [
    {
      "id": "step-1",
      "label": "Verify Docker and Docker Compose plugin are active on Ubuntu server"
    },
    {
      "id": "step-2",
      "label": "Clone langgenius/dify repository and copy .env.example to .env"
    },
    {
      "id": "step-3",
      "label": "Launch Dify services with docker compose up -d"
    },
    {
      "id": "step-4",
      "label": "Open web console, configure admin account, and connect your LLM API keys"
    }
  ],
  "smart-home-ai-home-assistant-local-voice-llm": [
    {
      "id": "step-1",
      "label": "Install Whisper (STT) and Piper (TTS) add-ons in Home Assistant OS"
    },
    {
      "id": "step-2",
      "label": "Configure Ollama or local LLM server integration in Home Assistant"
    },
    {
      "id": "step-3",
      "label": "Set up Assist voice pipeline with localized smart home intents"
    },
    {
      "id": "step-4",
      "label": "Test hands-free voice control of smart lights, climate, and switches"
    }
  ],
  "fine-tuning-vision-model-qwen2-vl-faktur-pajak": [
    {
      "id": "step-1",
      "label": "Collect 100-500 invoice images and annotate with structured JSON schema"
    },
    {
      "id": "step-2",
      "label": "Prepare dataset in conversations format required by Qwen2-VL"
    },
    {
      "id": "step-3",
      "label": "Run LoRA / QLoRA fine-tuning using Unsloth or LLaMA-Factory"
    },
    {
      "id": "step-4",
      "label": "Evaluate extraction accuracy on unseen invoices and deploy inference endpoint"
    }
  ],
  "tutorial-bot-trading-crypto-sentimen-ai-python": [
    {
      "id": "step-1",
      "label": "Create a Telegram bot via @BotFather and secure your Bot Token and Chat ID"
    },
    {
      "id": "step-2",
      "label": "Scrape crypto news and Twitter/X sentiment feeds with Python scripts"
    },
    {
      "id": "step-3",
      "label": "Score market sentiment using FinBERT or quantized LLMs"
    },
    {
      "id": "step-4",
      "label": "Connect exchange API (Binance/Bybit) for automated stop-loss trading signals"
    }
  ],
  "cara-pasang-mem0-long-term-memory-ai-agent": [
    {
      "id": "step-1",
      "label": "Install mem0ai package via pip in your virtual environment"
    },
    {
      "id": "step-2",
      "label": "Configure vector store backend (Qdrant, Chroma, or local SQLite)"
    },
    {
      "id": "step-3",
      "label": "Add memory extraction on user messages with Memory.add()"
    },
    {
      "id": "step-4",
      "label": "Query contextual memories using Memory.search() to ground agent responses"
    }
  ],
  "tutorial-video-ai-lipsync-liveportrait-comfyui": [
    {
      "id": "step-1",
      "label": "Open ComfyUI Manager and install ComfyUI-LivePortraitKJ nodes"
    },
    {
      "id": "step-2",
      "label": "Download required InsightFace and LivePortrait checkpoint weights"
    },
    {
      "id": "step-3",
      "label": "Load portrait image and source driving video/audio into the workflow"
    },
    {
      "id": "step-4",
      "label": "Queue prompt and export photorealistic lip-synced talking head video"
    }
  ],
  "dashboard-monitoring-evaluasi-ai-langsmith": [
    {
      "id": "step-1",
      "label": "Create a free account at smith.langchain.com and generate an API Key"
    },
    {
      "id": "step-2",
      "label": "Export LANGCHAIN_TRACING_V2=true and LANGCHAIN_API_KEY environment variables"
    },
    {
      "id": "step-3",
      "label": "Run your LangChain or LangGraph application to stream trace telemetry"
    },
    {
      "id": "step-4",
      "label": "Inspect latency, token cost breakdowns, and agent execution trees in the dashboard"
    }
  ],
  "tutorial-bikin-ai-mock-interviewer-webrtc": [
    {
      "id": "step-1",
      "label": "Create a Next.js API route to generate ephemeral tokens for OpenAI Realtime API"
    },
    {
      "id": "step-2",
      "label": "Establish client-side WebRTC peer connection using navigator.mediaDevices"
    },
    {
      "id": "step-3",
      "label": "Configure interviewer persona and technical question sequence via session update"
    },
    {
      "id": "step-4",
      "label": "Capture audio streams, render live transcriptions, and provide structured feedback"
    }
  ],
  "running-deepseek-r1-671b-distributed-llamacpp": [
    {
      "id": "step-1",
      "label": "Connect 2-4 PCs using minimum 1 Gbps (preferably 2.5 Gbps) Ethernet LAN"
    },
    {
      "id": "step-2",
      "label": "Build llama.cpp with MPI or RPC distributed inference support"
    },
    {
      "id": "step-3",
      "label": "Launch rpc-server on secondary worker machines"
    },
    {
      "id": "step-4",
      "label": "Run main llama-cli with --rpc parameters to distribute DeepSeek-R1 671B layers"
    }
  ],
  "tutorial-agentic-web-scraper-scrapling-bypass": [
    {
      "id": "step-1",
      "label": "Install scrapling package via pip in your Python virtual environment"
    },
    {
      "id": "step-2",
      "label": "Configure StealthFetcher with TLS fingerprint masking and header rotation"
    },
    {
      "id": "step-3",
      "label": "Bypass Cloudflare Turnstile and bot protection without expensive proxies"
    },
    {
      "id": "step-4",
      "label": "Extract clean structured JSON data using CSS selectors and regex filters"
    }
  ],
  "cara-bikin-search-engine-vektor-semantic-milvus": [
    {
      "id": "step-1",
      "label": "Download milvus-standalone-docker-compose.yml and launch via docker compose"
    },
    {
      "id": "step-2",
      "label": "Install pymilvus and sentence-transformers in Python"
    },
    {
      "id": "step-3",
      "label": "Create collection schema with HNSW index and COSINE similarity metrics"
    },
    {
      "id": "step-4",
      "label": "Insert document embeddings and perform sub-10ms semantic searches"
    }
  ],
  "game-rpg-ai-storyteller-phaserjs-gemini": [
    {
      "id": "step-1",
      "label": "Create Vite TypeScript project and install phaser and @google/genai"
    },
    {
      "id": "step-2",
      "label": "Build 2D map scenes, player character sprites, and dialogue interaction areas"
    },
    {
      "id": "step-3",
      "label": "Connect Gemini API with structured system prompt for adaptive NPC storytelling"
    },
    {
      "id": "step-4",
      "label": "Render dynamic quest outcomes and branch storylines based on player decisions"
    }
  ],
  "cara-setup-sglang-framework-inferensi-ai-irit": [
    {
      "id": "step-1",
      "label": "Verify CUDA 12.1+ environment is active and install sglang via pip"
    },
    {
      "id": "step-2",
      "label": "Launch SGLang server with RadixAttention for automatic KV cache reuse"
    },
    {
      "id": "step-3",
      "label": "Configure constrained decoding with regex and JSON schema grammars"
    },
    {
      "id": "step-4",
      "label": "Benchmark latency savings across repeated system prompt prefixes"
    }
  ],
  "asisten-email-outlook-gmail-otomatis-graph-api": [
    {
      "id": "step-1",
      "label": "Register app in Azure Portal and obtain Client ID and Client Secret"
    },
    {
      "id": "step-2",
      "label": "Configure Microsoft Graph Mail.ReadWrite and Mail.Send API permissions"
    },
    {
      "id": "step-3",
      "label": "Fetch unread emails, classify urgency with LLMs, and draft personalized replies"
    },
    {
      "id": "step-4",
      "label": "Set up cron job or webhook listener to automate mailbox triage 24/7"
    }
  ],
  "cara-bikin-pdf-translator-formatter-marker-deepl": [
    {
      "id": "step-1",
      "label": "Install marker-pdf package for OCR document to markdown conversion"
    },
    {
      "id": "step-2",
      "label": "Convert complex multi-column academic PDF into clean markdown"
    },
    {
      "id": "step-3",
      "label": "Translate markdown preserving LaTeX math formulas and code blocks"
    },
    {
      "id": "step-4",
      "label": "Compile translated markdown back into high-quality PDF using Pandoc / Typst"
    }
  ],
  "agentic-qa-tester-otomatis-playwright-vision-llm": [
    {
      "id": "step-1",
      "label": "Install playwright and pytest-playwright in Python"
    },
    {
      "id": "step-2",
      "label": "Capture viewport screenshots and DOM accessibility tree on user actions"
    },
    {
      "id": "step-3",
      "label": "Send UI screenshots to multimodal LLM to detect layout bugs and broken buttons"
    },
    {
      "id": "step-4",
      "label": "Generate automated bug reports with reproduction steps and suggested fixes"
    }
  ],
  "cara-setup-exllamav2-windows-inferensi-gpu-ngebut": [
    {
      "id": "step-1",
      "label": "Verify NVIDIA drivers and CUDA 12.1+ toolkit are active on Windows"
    },
    {
      "id": "step-2",
      "label": "Install pre-compiled ExLlamaV2 wheels via pip in Python 3.10+"
    },
    {
      "id": "step-3",
      "label": "Download EXL2 quantized model weights (e.g., 4.0bpw or 5.0bpw)"
    },
    {
      "id": "step-4",
      "label": "Launch local API server or web UI to achieve 60+ tokens/sec on consumer GPUs"
    }
  ],
  "tutorial-podcast-interaktif-kokoro-tts-ollama": [
    {
      "id": "step-1",
      "label": "Run Ollama with llama3.2 or qwen2.5 on your local machine"
    },
    {
      "id": "step-2",
      "label": "Install kokoro-onnx and soundfile for lightweight local speech synthesis"
    },
    {
      "id": "step-3",
      "label": "Generate dynamic dialogue script between two hosts from a topic prompt"
    },
    {
      "id": "step-4",
      "label": "Synthesize alternating host voices and merge into final MP3 podcast file"
    }
  ],
  "integrasi-vector-database-supabase-pgvector-nextjs": [
    {
      "id": "step-1",
      "label": "Open Supabase SQL Editor and execute create extension vector"
    },
    {
      "id": "step-2",
      "label": "Create documents table with embedding vector(1536) column and match_documents function"
    },
    {
      "id": "step-3",
      "label": "Connect Next.js project using @supabase/supabase-js client"
    },
    {
      "id": "step-4",
      "label": "Generate embeddings with OpenAI API and perform similarity search via RPC"
    }
  ],
  "ai-code-reviewer-bot-github-actions-pr-agent": [
    {
      "id": "step-1",
      "label": "Navigate to GitHub Repository -> Settings -> Secrets and add OPENAI_API_KEY"
    },
    {
      "id": "step-2",
      "label": "Create .github/workflows/pr-agent.yml workflow definition file"
    },
    {
      "id": "step-3",
      "label": "Configure PR trigger to trigger automated code review on pull_request events"
    },
    {
      "id": "step-4",
      "label": "Test by opening a test PR and inspect automated line-by-line review comments"
    }
  ],
  "cara-setup-kokoro-82m-tts-paling-ringan-cpu": [
    {
      "id": "step-1",
      "label": "Install kokoro-onnx and soundfile using pip"
    },
    {
      "id": "step-2",
      "label": "Download kokoro-v0_19.onnx model file (approx. 82MB) and voices.bin"
    },
    {
      "id": "step-3",
      "label": "Write Python script to load voice styles (af_bella, am_adam, etc.)"
    },
    {
      "id": "step-4",
      "label": "Generate studio-quality voice audio on regular CPU with sub-200ms latency"
    }
  ],
  "tutorial-fullstack-ai-saas-nextjs-stripe-cloudflare": [
    {
      "id": "step-1",
      "label": "Initialize Next.js 15 App Router project with Tailwind CSS"
    },
    {
      "id": "step-2",
      "label": "Configure Supabase Auth and Database for user subscription tracking"
    },
    {
      "id": "step-3",
      "label": "Implement Stripe Checkout and webhook handler for recurring billing"
    },
    {
      "id": "step-4",
      "label": "Deploy global edge application to Cloudflare Pages / Vercel"
    }
  ],
  "cara-setting-sensi-gyro-pubg-mobile-no-recoil-2026": [
    {
      "id": "step-1",
      "label": "Open Settings -> Sensitivity -> Select Advanced Customization mode"
    },
    {
      "id": "step-2",
      "label": "Configure Camera and ADS Sensitivity for Red Dot, 3x, and 4x scopes"
    },
    {
      "id": "step-3",
      "label": "Enable Gyroscope: Always On and tune Gyro ADS sensitivity values"
    },
    {
      "id": "step-4",
      "label": "Test weapon sprays at Training Grounds and upload cloud sensitivity layout"
    }
  ],
  "tutorial-rotasi-jungler-mobile-legends-mythic-glory": [
    {
      "id": "step-1",
      "label": "Determine opening buff (Blue for mana consumption / Red for burst attack)"
    },
    {
      "id": "step-2",
      "label": "Clear lithowanderer and gank the gold lane at exactly minute 1:30"
    },
    {
      "id": "step-3",
      "label": "Secure the first Turtle objective using Retribution timing and zone control"
    },
    {
      "id": "step-4",
      "label": "Snowball enemy jungle camps and rotate with mid roamer to end the match"
    }
  ],
  "panduan-hero-honor-of-kings-hok-pemula-auto-grandmaster": [
    {
      "id": "step-1",
      "label": "Open Settings -> Controls -> Select Advanced Target Selection (Minion & Turret Buttons)"
    },
    {
      "id": "step-2",
      "label": "Master high-impact beginner friendly heroes: Arthur (Clash), Angela (Mid), Hou Yi (Farm)"
    },
    {
      "id": "step-3",
      "label": "Learn Level 150 Arcana builds tailored for physical and magical damage output"
    },
    {
      "id": "step-4",
      "label": "Execute macro wave management and prioritize Tempest Dragon objectives"
    }
  ],
  "tutorial-setting-crosshair-sensi-valorant-headshot-machine": [
    {
      "id": "step-1",
      "label": "Open mouse software and configure hardware DPI to 800 or 1600"
    },
    {
      "id": "step-2",
      "label": "Set in-game sensitivity between 0.25 - 0.35 (eDPI range 200 - 320)"
    },
    {
      "id": "step-3",
      "label": "Import pro player crosshair profile (e.g. 1-4-2-2 Cyan or Green)"
    },
    {
      "id": "step-4",
      "label": "Calibrate crosshair placement at head height in The Range and Deathmatch"
    }
  ],
  "cara-optimasi-fps-cs2-counter-strike-laptop-kentang": [
    {
      "id": "step-1",
      "label": "Open Steam -> Right-click Counter-Strike 2 -> Properties -> Enter launch options"
    },
    {
      "id": "step-2",
      "label": "Configure in-game video settings: set shadows, textures, and particles to Low"
    },
    {
      "id": "step-3",
      "label": "Enable NVIDIA Reflex Low Latency (Enabled + Boost) and disable motion blur"
    },
    {
      "id": "step-4",
      "label": "Test frame rate stability in benchmark map and lock max FPS to refresh rate"
    }
  ],
  "tutorial-setting-dpi-hud-free-fire-auto-headshot-2026": [
    {
      "id": "step-1",
      "label": "Open Phone Settings -> Developer Options -> Adjust Smallest Width (DPI) to 420 - 550"
    },
    {
      "id": "step-2",
      "label": "Set in-game General sensitivity to 95-100 and Red Dot sensitivity to 90"
    },
    {
      "id": "step-3",
      "label": "Position Fire Button at lower right corner sized between 45% - 52%"
    },
    {
      "id": "step-4",
      "label": "Practice J-drag and straight drag shooting techniques in Training Grounds"
    }
  ],
  "cara-kuasai-macro-micro-gameplay-mobile-legends": [
    {
      "id": "step-1",
      "label": "Assess personal gameplay: identify whether 1v1 mechanics (micro) or map awareness (macro) is the bottleneck"
    },
    {
      "id": "step-2",
      "label": "Train camera panning on minimap every 3 seconds while clearing lane minions"
    },
    {
      "id": "step-3",
      "label": "Anticipate enemy rotations based on missing map icons and buff timers"
    },
    {
      "id": "step-4",
      "label": "Coordinate team objective fights only when ultimate skills and numbers advantage exist"
    }
  ],
  "tutorial-setting-grafis-delta-force-hawk-ops-kompetitif": [
    {
      "id": "step-1",
      "label": "Open Settings -> Video -> Set Display Mode to Exclusive Fullscreen"
    },
    {
      "id": "step-2",
      "label": "Tune render resolution to 100% and enable DLSS / FSR on Quality mode"
    },
    {
      "id": "step-3",
      "label": "Disable depth of field, chromatic aberration, and weapon motion blur"
    },
    {
      "id": "step-4",
      "label": "Customize keybinds for lean, crouch, and weapon mounting for rapid combat response"
    }
  ],
  "panduan-main-duelist-valorant-breeze-ascent-bind": [
    {
      "id": "step-1",
      "label": "Understand primary core duty: Create space for your team to safely plant the Spike"
    },
    {
      "id": "step-2",
      "label": "Coordinate entry flashes and smokes with initiators and controllers before executing"
    },
    {
      "id": "step-3",
      "label": "Master dash and satchel entry lineups on Breeze A-site and Ascent B-main"
    },
    {
      "id": "step-4",
      "label": "Play post-plant first contact angles without giving away careless man-advantage"
    }
  ],
  "cara-build-item-emblem-mlbb-meta-terbaru": [
    {
      "id": "step-1",
      "label": "Check scoreboard every 2 minutes to inspect enemy gold and item completions"
    },
    {
      "id": "step-2",
      "label": "Build Sea Halberd / Glowing Wand early when facing high lifesteal and regen heroes"
    },
    {
      "id": "step-3",
      "label": "Counter burst physical damage with Antique Cuirass or Blade Armor"
    },
    {
      "id": "step-4",
      "label": "Optimize custom emblem talents (Thrall, Bargain Hunter, War Cry) for role scaling"
    }
  ],
  "tutorial-setting-controller-gyro-hok-mobile": [
    {
      "id": "step-1",
      "label": "Open Settings -> Controls -> Access Camera Movement Settings"
    },
    {
      "id": "step-2",
      "label": "Enable Swipe Camera and set camera horizontal sensitivity to 65%-75%"
    },
    {
      "id": "step-3",
      "label": "Configure skill wheel sensitivity to prevent misplaced skill casts"
    },
    {
      "id": "step-4",
      "label": "Test rapid skill combos in Practice Mode with target lock enabled"
    }
  ],
  "cara-aim-training-valorant-di-the-range-dan-aimlab": [
    {
      "id": "step-1",
      "label": "Launch Aimlabs and play Sixshot scenario for 2 repetitions to warm up micro-adjustments"
    },
    {
      "id": "step-2",
      "label": "Play Spidershot or Gridshot for 3 rounds to practice target acquisition speed"
    },
    {
      "id": "step-3",
      "label": "Enter Valorant The Range and eliminate 50 strafing practice bots with Vandal"
    },
    {
      "id": "step-4",
      "label": "Finish warmup with 2 rounds of Deathmatch focusing strictly on headshots"
    }
  ],
  "tutorial-smoke-lineup-mirage-inferno-cs2": [
    {
      "id": "step-1",
      "label": "Purchase Smoke Grenade at the beginning of the round as Terrorist side (T-Side)"
    },
    {
      "id": "step-2",
      "label": "Align crosshair with T-spawn roof antenna and jumpthrow to execute Mirage A-Ticket smoke"
    },
    {
      "id": "step-3",
      "label": "Execute Jungle and Stairs smokes simultaneously with teammates"
    },
    {
      "id": "step-4",
      "label": "Practice Coffins and CT smokes on Inferno B-site before queuing competitive Premier"
    }
  ],
  "cara-atasi-ping-merah-frame-drop-pubg-mobile": [
    {
      "id": "step-1",
      "label": "Open Phone Settings -> Connection -> Private DNS -> Enter one.one.one.one"
    },
    {
      "id": "step-2",
      "label": "Disable Background App Refresh and battery saver optimizations for PUBG Mobile"
    },
    {
      "id": "step-3",
      "label": "Set in-game graphics to Smooth and frame rate to 90 FPS / Extreme"
    },
    {
      "id": "step-4",
      "label": "Use Game Space or performance mode to lock touch sampling rate"
    }
  ],
  "tutorial-build-karakter-genshin-impact-f2p": [
    {
      "id": "step-1",
      "label": "Convert Original Resin into Condensed Resin at the crafting bench before farming domains"
    },
    {
      "id": "step-2",
      "label": "Focus artifact farming on universal high-value domains (Emblem of Severed Fate, Marechaussee Hunter)"
    },
    {
      "id": "step-3",
      "label": "Level core character talents to Level 8 or 9 before optimizing sub-stat rolls"
    },
    {
      "id": "step-4",
      "label": "Equip craftable 4-star F2P weapons (Catch, Amenoma Kageuchi) at refinement rank 5"
    }
  ]
};
