const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/data/tutorials-1.ts');
let fileContent = fs.readFileSync(filePath, 'utf8');

// Load JSON/array by evaluating or regex replacement
// Since tutorialsPart1 is exported as TS, let's load it via require if tsx or write an automated parser
const enData = {
  'cara-bikin-autonomous-ai-agent-sendiri-crewai': {
    title: 'How to Build an Autonomous AI Agent with CrewAI & Python (Automating Tedious Workflows)',
    description: 'Comprehensive, hands-on guide to building multi-agent AI systems with the CrewAI framework. Learn Agent roles, Tasks, custom tools, and automated crew orchestration.',
    content: `
### 1. Why Choose CrewAI for Multi-Agent Workflows?
Building autonomous AI agents requires orchestrating specialized agents that collaborate seamlessly. **CrewAI** ([github.com/crewAIInc/crewAI](https://github.com/crewAIInc/crewAI)) provides an intuitive role-based abstraction where each agent possesses a persona, goals, and access to dedicated toolsets.

Unlike monolithic prompts, a crew divides complex workflows into modular tasks, enabling automatic task delegation, shared memory contexts, and iterative error recovery.

### 2. Environment Setup & Dependency Installation
Create an isolated Python 3.10+ environment and install CrewAI with tools:

\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: .\\venv\\Scripts\\activate
pip install crewai crewai-tools langchain-groq python-dotenv
\`\`\`

Create your environment configuration file (\`.env\`):
\`\`\`env
GROQ_API_KEY=gsk_your_groq_api_key_here
OPENAI_API_KEY=sk-proj-your_openai_api_key_here
\`\`\`

### 3. Defining Agents, Personas, and Specific Tasks
Create your orchestration script \`main.py\`:

\`\`\`python
import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool

load_dotenv()

# Define Researcher Agent
researcher = Agent(
    role="Senior Technology Researcher",
    goal="Uncover cutting-edge developments in open-source AI models as of October 2026",
    backstory="You are an expert tech analyst specializing in high-throughput local inference and reasoning architectures.",
    verbose=True,
    allow_delegation=False,
    tools=[SerperDevTool()] if os.getenv("SERPER_API_KEY") else []
)

# Define Writer Agent
writer = Agent(
    role="Principal Technical Content Editor",
    goal="Synthesize complex technical research into actionable, high-clarity engineering guides",
    backstory="You transform raw benchmarking telemetry into production-grade documentation and implementation advice.",
    verbose=True,
    allow_delegation=False
)

# Tasks Definition
research_task = Task(
    description="Analyze top open-source reasoning models released in late 2026. Focus on parameter efficiency, latency, and hardware constraints.",
    expected_output="A bulleted technical report detailing benchmark figures and architectural breakthroughs.",
    agent=researcher
)

writing_task = Task(
    description="Draft an executive summary and operational checklist based on the research findings.",
    expected_output="A clean markdown article with code snippets and production recommendations.",
    agent=writer
)

# Crew Orchestration
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential
)

result = crew.kickoff()
print("\\n### Execution Results ###\\n")
print(result)
\`\`\`

### 4. Integrating Custom Tools & Execution
You can extend agent capabilities by writing custom decorated tools:

\`\`\`python
from crewai.tools import tool

@tool("Database Health Checker")
def check_database_health(cluster_id: str) -> str:
    """Queries cluster telemetry and returns memory pressure status."""
    return f"Cluster {cluster_id} is running nominally with 24% VRAM utilization."
\`\`\`

Attach \`tools=[check_database_health]\` directly to your agent configuration.

### 5. Production Optimization: Preventing Loops & Token Spikes
* **Set Iteration Guardrails**: Configure \`max_iter=5\` on your Agent to prevent perpetual query loops.
* **Leverage Fast Inference**: Use high-speed inference endpoints like Groq (Llama-3.3-70B) or vLLM for intermediate reasoning passes to reduce latency by up to 80%.
* **Persistent Memory**: Enable \`memory=True\` on Crew kickoff to preserve cross-task context in a local Chroma/SQLite store.
`
  },
  'panduan-lengkap-rag-pemula-langchain-chromadb': {
    title: 'Complete Beginner Guide to RAG with LangChain & ChromaDB (Chat with Your Documents)',
    description: 'Build a production Retrieval-Augmented Generation (RAG) pipeline from scratch. Covers recursive document chunking, dense vector embeddings, ChromaDB persistence, and hallucination guardrails.',
    content: `
### 1. Understanding Retrieval-Augmented Generation (RAG)
Large Language Models excel at reasoning, but their knowledge is frozen at training cutoff. **Retrieval-Augmented Generation (RAG)** injects external, proprietary documents into the model's context window on demand, preventing hallucinations and enabling verifiable citations.

### 2. Environment Setup & Dependency Installation
Install required LangChain packages and local vector database:

\`\`\`bash
pip install langchain langchain-community langchain-openai chromadb pypdf tiktoken
\`\`\`

### 3. Document Ingestion & Recursive Chunking
Raw text must be split into semantically coherent chunks with overlap:

\`\`\`python
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

# Load technical specification PDF
loader = PyPDFLoader("system_architecture_2026.pdf")
docs = loader.load()

# Split text with semantic chunking
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=120,
    separators=["\\n\\n", "\\n", " ", ""]
)
chunks = text_splitter.split_documents(docs)
print(f"Total chunks created: {len(chunks)}")
\`\`\`

### 4. Dense Embeddings & ChromaDB Indexing
Generate vector representations and persist them locally:

\`\`\`python
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
\`\`\`

### 5. Assembling the LCEL Retrieval Chain
Build a modern LangChain Expression Language (LCEL) chain:

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

template = """You are a senior technical advisor. Answer the query strictly based on the provided context:
{context}

Question: {question}
Answer concisely with direct references:"""

prompt = ChatPromptTemplate.from_template(template)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)

def format_docs(documents):
    return "\\n\\n".join(doc.page_content for doc in documents)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

response = rag_chain.invoke("What are the latency guarantees of the cluster?")
print(response)
\`\`\`
`
  },
  'deploy-deepseek-r1-lokal-ollama-open-webui': {
    title: 'How to Deploy DeepSeek-R1 Locally with Ollama & Open WebUI (100% Private AI)',
    description: 'Step-by-step tutorial for hosting DeepSeek-R1 distilled and full quantized models locally. Configure GPU offloading, context window sizing, and private Docker WebUI interfaces.',
    content: `
### 1. The Value of Local DeepSeek-R1 Deployment
Running reasoning models locally eliminates API fees, guarantees complete data privacy for proprietary codebases, and provides offline reasoning resilience. With **Ollama** ([github.com/ollama/ollama](https://github.com/ollama/ollama)), deploying distilled DeepSeek-R1 models takes minutes.

### 2. Hardware Sizing Guide (October 2026)
* **DeepSeek-R1-Distill-Qwen-8B**: Requires 8GB VRAM (RTX 3060 / 4060) or 16GB Unified RAM (Apple Silicon).
* **DeepSeek-R1-Distill-Qwen-14B**: Requires 12GB VRAM (RTX 3060 12GB / 4070).
* **DeepSeek-R1-Distill-Qwen-32B**: Requires 20GB+ VRAM (RTX 3090 / 4090 / M-series 36GB+).

### 3. Installing Ollama & Pulling Distilled Reasoning Models
Install Ollama via terminal:

\`\`\`bash
# Linux / macOS
curl -fsSL https://ollama.com/install.sh | sh

# Pull DeepSeek-R1 Distilled 14B Q4_K_M
ollama run deepseek-r1:14b
\`\`\`

Test direct terminal reasoning:
\`\`\`bash
ollama run deepseek-r1:14b "Write a Python script that calculates rolling volatility for BTC/USDT."
\`\`\`

### 4. Deploying Open WebUI via Docker
Run the feature-packed ChatGPT-style interface with full Ollama integration:

\`\`\`bash
docker run -d -p 3000:8080 \\
  --add-host=host.docker.internal:host-gateway \\
  -v open-webui:/app/backend/data \\
  --name open-webui \\
  --restart always \\
  ghcr.io/open-webui/open-webui:main
\`\`\`

Open your browser at \`http://localhost:3000\`, create an admin account, and verify that \`deepseek-r1:14b\` appears in the model selection dropdown.

### 5. Production Tuning: Context Length & Thinking Tokens
DeepSeek-R1 uses \`<think>...</think>\` reasoning traces. To prevent context overflow, create a custom Modelfile:

\`\`\`dockerfile
FROM deepseek-r1:14b
PARAMETER num_ctx 16384
PARAMETER temperature 0.6
\`\`\`

Build and run your tuned model:
\`\`\`bash
ollama create r1-16k -f Modelfile
ollama run r1-16k
\`\`\`
`
  },
  'bikin-telegram-bot-ai-pake-python-groq': {
    title: 'Build an Ultra-Fast Telegram AI Bot with Python & Groq Cloud API',
    description: 'Create a blazing-fast Telegram AI chatbot running Llama-3.3-70B on Groq LPUs. Features conversational memory, voice transcription via Whisper-large, and webhook deployment.',
    content: `
### 1. Leveraging Groq LPU for Instant Chat Responses
Traditional cloud GPUs introduce 1-3 seconds of latency before returning first tokens. **Groq Language Processing Units (LPUs)** achieve 300-500 tokens per second, making Telegram bot conversations feel instant and natural.

### 2. Getting API Credentials
1. **Telegram Bot Token**: Open Telegram, chat with \`@BotFather\`, type \`/newbot\`, and copy your bot token.
2. **Groq API Key**: Navigate to [console.groq.com](https://console.groq.com) and create an API key.

### 3. Code Implementation with Python-Telegram-Bot & Groq SDK
Install required libraries:
\`\`\`bash
pip install python-telegram-bot groq python-dotenv
\`\`\`

Create \`bot.py\`:
\`\`\`python
import os
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes
from groq import Groq

load_dotenv()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("👋 Hello! I am your lightning-fast AI assistant powered by Groq Llama-3.3-70B. Send me any question!")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_text = update.message.text
    await context.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a concise, helpful technical assistant."},
                {"role": "user", "content": user_text}
            ],
            temperature=0.7,
            max_tokens=1024
        )
        reply = completion.choices[0].message.content
        await update.message.reply_text(reply)
    except Exception as e:
        await update.message.reply_text(f"⚠️ Error: {str(e)}")

if __name__ == '__main__':
    app = ApplicationBuilder().token(os.getenv("TELEGRAM_BOT_TOKEN")).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_message))
    print("Bot is listening for messages...")
    app.run_polling()
\`\`\`

### 4. Background Service Hosting with Systemd
To keep your bot running 24/7 on Ubuntu/Debian:
\`\`\`ini
# /etc/systemd/system/telegram-bot.service
[Unit]
Description=Telegram AI Bot Service
After=network.target

[Service]
User=azureuser
WorkingDirectory=/home/azureuser/telegram-bot
ExecStart=/home/azureuser/telegram-bot/venv/bin/python bot.py
Restart=always

[Install]
WantedBy=multi-user.target
\`\`\`

Enable and start the service:
\`\`\`bash
sudo systemctl daemon-reload
sudo systemctl enable --now telegram-bot.service
\`\`\`
`
  },
  'setup-comfyui-flux-schnell-di-rtx-3060': {
    title: 'Setup ComfyUI & FLUX.1-schnell on 12GB VRAM (RTX 3060 / 4060 Ti)',
    description: 'Generate photorealistic images locally in under 4 steps. Step-by-step guide to installing ComfyUI, NF4/FP8 quantized FLUX weights, and optimizing memory usage.',
    content: `
### 1. FLUX.1 Architecture on Mid-Range GPUs
Black Forest Labs' **FLUX.1-schnell** is a 12-billion parameter rectified-flow transformer model capable of generating photorealistic imagery with accurate hands and typography in just 4 sampling steps. Running it on consumer 12GB VRAM GPUs requires FP8/NF4 checkpoint quantization and ComfyUI memory management.

### 2. ComfyUI Installation via Git & Portable Python
\`\`\`bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
python -m venv venv
source venv/bin/activate
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu124
pip install -r requirements.txt
\`\`\`

### 3. Downloading Quantized Weights
Download the FP8 or NF4 model weights to their respective folders:
* **Checkpoint**: \`flux1-schnell-fp8.safetensors\` -> \`models/checkpoints/\`
* **Text Encoder 1**: \`clip_l.safetensors\` -> \`models/clip/\`
* **Text Encoder 2**: \`t5xxl_fp8_e4m3fn.safetensors\` -> \`models/clip/\`
* **VAE**: \`ae.safetensors\` -> \`models/vae/\`

### 4. High-Performance Launch Flags
Launch ComfyUI with low-VRAM memory optimizations:
\`\`\`bash
python main.py --lowvram --fp8_e4m3fn-text-enc --use-split-cross-attention
\`\`\`

### 5. Optimal Generation Parameters
* **Steps**: 4 steps (FLUX.1-schnell is distilled for 4-step convergence).
* **Sampler**: \`euler\` with \`simple\` or \`beta\` scheduler.
* **CFG Scale**: \`1.0\` (Flux does not require high guidance scales).
* **Resolution**: 1024x1024 (native resolution for best structural fidelity).
`
  },
  'fine-tuning-llama-3-1-unsloth-google-colab': {
    title: 'Fine-Tuning Llama 3.1 8B with Unsloth on Free Google Colab GPU',
    description: 'Learn fast, memory-efficient LoRA fine-tuning with Unsloth. Covers dataset preparation, 4-bit QLoRA training parameters, GGUF export, and inference evaluation.',
    content: `
### 1. Why Unsloth for Local & Cloud Fine-Tuning?
**Unsloth** ([github.com/unslothai/unsloth](https://github.com/unslothai/unsloth)) provides hand-written OpenAI Triton kernels that accelerate fine-tuning by 2x-5x while reducing VRAM consumption by up to 70%. This makes fine-tuning an 8B model feasible on a single free T4 GPU (15GB VRAM).

### 2. Colab Setup & Package Installation
\`\`\`python
!pip install --upgrade --no-cache-dir "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
!pip install --no-deps trl peft accelerate bitsandbytes
\`\`\`

### 3. Loading Model & Applying 4-Bit LoRA Adapters
\`\`\`python
from unsloth import FastLanguageModel
import torch

max_seq_length = 2048
load_in_4bit = True

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Meta-Llama-3.1-8B-Instruct-bnb-4bit",
    max_seq_length=max_seq_length,
    load_in_4bit=load_in_4bit,
)

model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=3407,
)
\`\`\`

### 4. Training Configuration with SFTTrainer
\`\`\`python
from trl import SFTTrainer
from transformers import TrainingArguments

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=max_seq_length,
    dataset_num_proc=2,
    packing=False,
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=10,
        max_steps=60,
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=1,
        optim="adamw_8bit",
        output_dir="outputs",
    ),
)
trainer_stats = trainer.train()
\`\`\`

### 5. Exporting to GGUF for Ollama Deployment
\`\`\`python
# Save 16-bit GGUF or quantized 4-bit model directly
model.save_pretrained_gguf("llama3_custom_model", tokenizer, quantization_method="q4_k_m")
\`\`\`
`
  },
  'bikin-mcp-server-pertama-claude-desktop': {
    title: 'How to Build Your First Model Context Protocol (MCP) Server for Claude Desktop',
    description: 'Learn Anthropic’s open standard for connecting LLMs to external tools. Build a TypeScript MCP server with tool definitions, resources, and Claude Desktop config integration.',
    content: `
### 1. What is Anthropic Model Context Protocol (MCP)?
The **Model Context Protocol (MCP)** is an open-standard JSON-RPC specification enabling AI models (like Claude Desktop and Cursor) to discover and call local or remote tools in a secure, sandboxed manner.

### 2. Initializing a TypeScript MCP Project
\`\`\`bash
mkdir my-first-mcp && cd my-first-mcp
npm init -y
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node tsx
npx tsc --init
\`\`\`

### 3. Writing the MCP Server Implementation
Create \`src/index.ts\`:

\`\`\`typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  { name: "system-stats-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_system_time",
        description: "Returns the current UTC and local server timestamp",
        inputSchema: { type: "object", properties: {} }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_system_time") {
    return {
      content: [{ type: "text", text: new Date().toISOString() }]
    };
  }
  throw new Error("Tool not found");
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
\`\`\`

### 4. Registering with Claude Desktop
Edit \`claude_desktop_config.json\` (located in \`%APPDATA%\\Claude\\claude_desktop_config.json\` on Windows or \`~/Library/Application Support/Claude/\` on macOS):

\`\`\`json
{
  "mcpServers": {
    "system-stats": {
      "command": "npx",
      "args": ["-y", "tsx", "C:/path/to/my-first-mcp/src/index.ts"]
    }
  }
}
\`\`\`
Restart Claude Desktop and test asking Claude for the system time.
`
  },
  'otomasi-scraping-web-pake-crawl4ai-ollama': {
    title: 'Automated Web Scraping with Crawl4AI & Local Ollama (Clean Markdown Extraction)',
    description: 'Extract structured information from dynamic JavaScript websites using Crawl4AI. Filter noise, generate clean Markdown, and pass content to local LLMs for structured JSON schema extraction.',
    content: `
### 1. Why Crawl4AI Beats Traditional Web Scrapers
**Crawl4AI** ([github.com/unclecode/crawl4ai](https://github.com/unclecode/crawl4ai)) is an open-source, asynchronous LLM-friendly crawler. It renders client-side JavaScript via headless Playwright, strips navigation boilerplate, and produces pristine Markdown ready for prompt ingestion.

### 2. Installation & Browser Binaries
\`\`\`bash
pip install crawl4ai
crawl4ai-setup  # Installs Playwright Chromium drivers
\`\`\`

### 3. Extracting Clean Markdown Content
Create \`scrape.py\`:

\`\`\`python
import asyncio
from crawl4ai import AsyncWebCrawler

async def main():
    async with AsyncWebCrawler(verbose=True) as crawler:
        result = await crawler.arun(url="https://news.ycombinator.com")
        print("Scrape status:", result.success)
        print("Markdown excerpt:\\n", result.markdown[:500])

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

### 4. Combining Crawl4AI with Local Ollama for JSON Extraction
Pipe the raw markdown into Ollama to extract structured schema fields without paying API tokens:

\`\`\`python
import ollama

prompt = f"""Extract the top 5 articles with their title, points, and link from this Markdown:
{result.markdown}

Respond ONLY in valid JSON format:
{{"articles": [{{"title": "...", "points": 100, "url": "..."}}]}}"""

res = ollama.chat(model="llama3.2:3b", messages=[{"role": "user", "content": prompt}])
print(res["message"]["content"])
\`\`\`
`
  },
  'bikin-voice-agent-realtime-livekit-gemini': {
    title: 'Build a Real-Time Voice Agent with LiveKit & Gemini Live API',
    description: 'Create an ultra-low latency conversational voice assistant using LiveKit WebRTC infrastructure and Google Gemini Multimodal Live API. Under 500ms voice turnaround.',
    content: `
### 1. Real-Time Bidirectional Voice Paradigms
Traditional voice bots chain STT (Speech-to-Text), LLM generation, and TTS (Text-to-Speech), resulting in 2-4 seconds of unnatural lag. **LiveKit Agents** combined with **Gemini Live API** stream bidirectional audio over WebRTC, allowing human interruptions and responsive turn-taking.

### 2. Environment Setup
\`\`\`bash
pip install livekit-agents livekit-plugins-google python-dotenv
\`\`\`

### 3. Writing the Voice Agent Worker
Create \`agent.py\`:

\`\`\`python
import asyncio
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import JobContext, WorkerOptions, cli
from livekit.plugins import google

load_dotenv()

async def entrypoint(ctx: JobContext):
    await ctx.connect()
    print(f"Connected to room: {ctx.room.name}")

    session = google.beta.realtime.RealtimeSession(
        model="gemini-2.0-flash-exp",
        voice="Puck"
    )

    agent = agents.VoiceAssistant(
        llm=session,
        chat_ctx=agents.ChatContext().append(
            role="system",
            text="You are a helpful customer concierge. Speak concisely and conversationally."
        )
    )

    agent.start(ctx.room)
    await agent.say("Hello! How can I assist you today?")

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
\`\`\`

### 4. Connecting Your Frontend Client
Run the LiveKit Cloud sandbox or self-hosted server to connect your web/mobile microphone stream directly into the room.
`
  },
  'panduan-cursor-ai-rules-tips-ngoding-10x': {
    title: 'Mastering Cursor AI: .cursorrules & Context Strategies for 10x Velocity',
    description: 'Transform Cursor IDE into an elite pairing partner. Master system prompt rules, codebase indexing (@codebase), terminal agents, and multi-file refactoring patterns.',
    content: `
### 1. The Superpower of .cursorrules
A well-structured \`.cursorrules\` file in your repository root guides Cursor's Composer and inline completion models, eliminating repetitive corrections about coding conventions, linting rules, and preferred libraries.

### 2. Production .cursorrules Template
Create \`.cursorrules\` in your project root:

\`\`\`markdown
# Production Next.js & TypeScript Rules

## Architecture
- Use Next.js 15 App Router with Server Components by default.
- Place client interactions in components marked with 'use client'.
- Use Tailwind CSS for styling with CSS variables for dynamic theming.

## Code Standards
- Strict TypeScript: no 'any' types allowed. Always define explicit interfaces.
- Always use functional React components with standard export syntax.
- Handle loading states with React Suspense boundaries.
- Error handling: wrap async database operations in structured try/catch blocks.

## Anti-Hallucination
- Never invent API routes or import packages not declared in package.json.
- Always verify symbol definitions before referencing them in callers.
\`\`\`

### 3. Context Referencing Best Practices
* **@Files**: Pin exact target files instead of scanning the full project.
* **@Codebase**: Use sparingly for broad architectural questions; rely on specific symbol lookups for targeted edits.
* **@Git**: Review uncommitted diffs or commit history to ask for bug inspections.
`
  },
  'setup-private-ai-assistant-open-webui-docker': {
    title: 'Deploy a Private Enterprise AI Assistant with Open WebUI & Docker Compose',
    description: 'Self-host a collaborative, multi-user AI platform with role-based access control (RBAC), document RAG, tool calling, and multiple LLM backends.',
    content: `
### 1. Enterprise Features of Open WebUI
Open WebUI provides corporate teams with a self-hosted alternative to ChatGPT Teams:
* Internal document knowledge bases with automatic chunking.
* Role-Based Access Control (Admin, User, Auditor).
* Unified proxy bridging Ollama, vLLM, and OpenAI API endpoints.

### 2. Docker Compose Production Configuration
Create \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'

services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    restart: always
    ports:
      - "8080:8080"
    environment:
      - OLLAMA_BASE_URL=http://host.docker.internal:11434
      - WEBUI_SECRET_KEY=change_this_to_a_secure_random_string_32_chars
      - ENABLE_SIGNUP=true
    volumes:
      - open-webui_data:/app/backend/data
    extra_hosts:
      - "host.docker.internal:host-gateway"

volumes:
  open-webui_data:
\`\`\`

### 3. Deployment & Security Hardening
\`\`\`bash
docker compose up -d
docker compose logs -f
\`\`\`

After creating the initial admin account, navigate to **Admin Panel -> Settings -> General** and disable public signups (\`ENABLE_SIGNUP=false\`) to keep your instance private.
`
  },
  'bikin-rag-hybrid-search-bm25-dense-embeddings': {
    title: 'Building Hybrid Search RAG: BM25 Lexical + Dense Vector Embeddings',
    description: 'Eliminate vector search blind spots for technical terminology, serial numbers, and exact keywords by combining BM25 keyword matching with dense semantic embeddings via Reciprocal Rank Fusion (RRF).',
    content: `
### 1. Why Pure Vector Search Fails on Exact Keywords
Dense vector embeddings map semantic concepts well (e.g., "automobile" ≈ "car"), but frequently fail on precise alphanumeric terms like error codes (\`ERR_503_FAIL\`) or model numbers. **Hybrid Search** combines BM25 lexical precision with dense vector semantics.

### 2. Reciprocal Rank Fusion (RRF) Mathematics
RRF computes a unified score for each document across multiple ranked result lists:
$$RRF(d) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}$$
where $k$ is a constant (typically 60) and $r_m(d)$ is the rank position of document $d$ in system $m$.

### 3. Code Implementation with LangChain & BM25Retriever
\`\`\`python
from langchain_community.retrievers import BM25Retriever
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain.retrievers import EnsembleRetriever
from langchain_core.documents import Document

docs = [
    Document(page_content="Error code ERR_SOCKET_TIMEOUT occurs when connection pool is exhausted."),
    Document(page_content="Optimizing network latency using HTTP/3 and QUIC protocols."),
    Document(page_content="PostgreSQL database failover procedures for primary replica.")
]

# 1. BM25 Lexical Retriever
bm25_retriever = BM25Retriever.from_documents(docs)
bm25_retriever.k = 2

# 2. Dense Vector Retriever
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
chroma_store = Chroma.from_documents(docs, embeddings)
vector_retriever = chroma_store.as_retriever(search_kwargs={"k": 2})

# 3. Hybrid Ensemble Retriever (RRF)
hybrid_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, vector_retriever],
    weights=[0.5, 0.5]
)

results = hybrid_retriever.invoke("ERR_SOCKET_TIMEOUT")
for doc in results:
    print(f"- {doc.page_content}")
\`\`\`
`
  },
  'evaluasi-model-llm-pake-deepeval-ragas': {
    title: 'Automated LLM Evaluation: Unit Testing AI with DeepEval & Ragas',
    description: 'Set up automated CI/CD evaluation pipelines for LLMs. Measure Faithfulness, Answer Relevance, Context Recall, and Hallucination rates with unit tests.',
    content: `
### 1. Moving Beyond Manual Prompt Vibe Checks
Deploying LLM applications to production requires quantitative regression testing. **DeepEval** ([github.com/confident-ai/deepeval](https://github.com/confident-ai/deepeval)) enables unit-testing LLM outputs with assertions just like pytest.

### 2. Installing DeepEval
\`\`\`bash
pip install deepeval
\`\`\`

### 3. Writing RAG Evaluation Test Cases
Create \`test_rag.py\`:

\`\`\`python
import pytest
from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import FaithfulnessMetric, AnswerRelevancyMetric

def test_rag_faithfulness():
    test_case = LLMTestCase(
        input="What is the server warranty period?",
        actual_output="The server warranty period is 3 years covering all hardware defects.",
        retrieval_context=["All enterprise rack servers include a 3-year standard manufacturer warranty."]
    )

    faithfulness = FaithfulnessMetric(threshold=0.8)
    relevancy = AnswerRelevancyMetric(threshold=0.7)

    assert_test(test_case, [faithfulness, relevancy])
\`\`\`

### 4. Running CI/CD Pipeline
\`\`\`bash
deepeval test run test_rag.py
\`\`\`
Failed assertions report detailed reasoning breakdowns explaining exactly why the response drifted from source context.
`
  },
  'bikin-slack-bot-ai-agent-pake-langgraph': {
    title: 'Build a Stateful Slack Bot AI Agent with LangGraph & Bolt for Python',
    description: 'Construct a stateful corporate Slack bot with multi-turn conversation memory, human-in-the-loop approvals, and cyclical agent workflows using LangGraph.',
    content: `
### 1. Why LangGraph for Corporate Chatbots?
Linear chains cannot handle real-world conversations that require stateful branching, loops, or human authorization. **LangGraph** ([github.com/langchain-ai/langgraph](https://github.com/langchain-ai/langgraph)) models agent workflows as state machines with cyclical graphs.

### 2. Setting Up Slack App & Bolt
\`\`\`bash
pip install slack-bolt langgraph langchain-openai python-dotenv
\`\`\`

Create \`app.py\`:
\`\`\`python
import os
from dotenv import load_dotenv
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated, List

load_dotenv()

app = App(token=os.getenv("SLACK_BOT_TOKEN"))

class AgentState(TypedDict):
    messages: List[dict]

def call_model(state: AgentState):
    llm = ChatOpenAI(model="gpt-4o")
    response = llm.invoke(state["messages"])
    return {"messages": state["messages"] + [{"role": "assistant", "content": response.content}]}

workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.set_entry_point("agent")
workflow.add_edge("agent", END)
graph = workflow.compile()

@app.event("app_mention")
def handle_mention(event, say):
    text = event["text"]
    res = graph.invoke({"messages": [{"role": "user", "content": text}]})
    say(res["messages"][-1]["content"])

if __name__ == "__main__":
    handler = SocketModeHandler(app, os.getenv("SLACK_APP_TOKEN"))
    handler.start()
\`\`\`
`
  },
  'deploy-vllm-high-throughput-vps-gpu': {
    title: 'Deploying vLLM on GPU Cloud VPS: High-Throughput Production Serving',
    description: 'Host your own OpenAI-compatible API with vLLM and PagedAttention. Achieve 5x higher throughput and sub-10ms token latency compared to standard Hugging Face pipelines.',
    content: `
### 1. PagedAttention & vLLM Architecture
Traditional transformer inference wastes up to 60-80% of VRAM due to static KV-cache allocation. **vLLM** ([github.com/vllm-project/vllm](https://github.com/vllm-project/vllm)) utilizes PagedAttention to manage attention memory like virtual paging in operating systems, maximizing batch concurrency.

### 2. Docker Deployment with NVIDIA GPU Container
Launch an OpenAI-compatible vLLM server:

\`\`\`bash
docker run --gpus all \\
  -v ~/.cache/huggingface:/root/.cache/huggingface \\
  -p 8000:8000 \\
  --ipc=host \\
  vllm/vllm-openai:latest \\
  --model Qwen/Qwen2.5-7B-Instruct \\
  --tensor-parallel-size 1 \\
  --max-model-len 8192 \\
  --gpu-memory-utilization 0.90
\`\`\`

### 3. Calling Your vLLM Instance with the Official OpenAI SDK
Point existing OpenAI client libraries directly to your server:

\`\`\`python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="EMPTY"
)

response = client.chat.completions.create(
    model="Qwen/Qwen2.5-7B-Instruct",
    messages=[{"role": "user", "content": "Explain PagedAttention in three sentences."}],
    temperature=0.2
)

print(response.choices[0].message.content)
\`\`\`
`
  }
};

// Now apply enData to fileContent
let updatedCount = 0;
for (const [slug, trans] of Object.entries(enData)) {
  const pattern = new RegExp(`(\"slug\":\\s*\"${slug}\"[\\s\\S]*?\"content\":\\s*\`[\\s\\S]*?\`)(\\n\\s*\\},|\\n\\s*\\})`, 'g');
  if (pattern.test(fileContent)) {
    const enBlock = `,\n    "en": {\n      "title": ${JSON.stringify(trans.title)},\n      "description": ${JSON.stringify(trans.description)},\n      "content": ${JSON.stringify(trans.content)}\n    }\n  }`;
    fileContent = fileContent.replace(pattern, `$1${enBlock}`);
    updatedCount++;
    console.log(`[OK] Added en for ${slug}`);
  } else {
    // Try matching content with double quotes
    const pattern2 = new RegExp(`(\"slug\":\\s*\"${slug}\"[\\s\\S]*?\"content\":\\s*\"[\\s\\S]*?\")(\\n\\s*\\},|\\n\\s*\\})`, 'g');
    if (pattern2.test(fileContent)) {
      const enBlock = `,\n    "en": {\n      "title": ${JSON.stringify(trans.title)},\n      "description": ${JSON.stringify(trans.description)},\n      "content": ${JSON.stringify(trans.content)}\n    }\n  }`;
      fileContent = fileContent.replace(pattern2, `$1${enBlock}`);
      updatedCount++;
      console.log(`[OK-2] Added en for ${slug}`);
    } else {
      console.warn(`[WARN] Could not find slug pattern for ${slug}`);
    }
  }
}

fs.writeFileSync(filePath, fileContent, 'utf8');
console.log(`Successfully updated ${updatedCount} tutorials in tutorials-1.ts!`);
