import { Article } from './types';

export const articlesPart1: Article[] = [
  {
    slug: 'cara-bikin-autonomous-ai-agent-sendiri-crewai',
    title: 'Cara Bikin Autonomous AI Agent Sendiri Pake CrewAI & Python (Biar Gak Repot Ngerjain Tugas Rutin)',
    description: 'Panduan santai bikin pasukan agen AI otonom pake CrewAI. Biar bot lu yang riset, nulis draf, sampe review konten otomatis tanpa lu cape-cape.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'AI Agents',
    difficulty: 'Menengah',
    pubDate: '10 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '6 min baca',
    author: 'Edvan',
    tags: ['CrewAI', 'Python', 'Autonomous Agent', 'Automation'],
    affiliateProduct: {
      name: 'VPS Cloud 4 vCPU 8GB RAM',
      priceEstimate: 'Rp 149.000/bln',
      linkUrl: 'https://digitalocean.com',
      badge: 'Server Rekomendasi',
      description: 'Hosting 24/7 paling stabil buat jalanin worker CrewAI nonstop tanpa bikin laptop kepanasan.'
    },
    toc: [
      { id: 'apa-itu-crewai', title: '1. Kenapa Harus CrewAI?' },
      { id: 'persiapan-alat', title: '2. Persiapan & Install Paket' },
      { id: 'arsitektur-tim', title: '3. Setup Agen, Task, & Tools' },
      { id: 'eksekusi-kode', title: '4. Menjalankan Pasukan Bot' },
      { id: 'troubleshooting', title: '5. Trik Biar Bot Gak Loop Muter-Muter' },
    ],
    steps: [
      { id: 'step-1', label: 'Install Python 3.11+ dan pip package crewai' },
      { id: 'step-2', label: 'Dapetin API Key (OpenAI, Gemini, atau Groq)' },
      { id: 'step-3', label: 'Definisikan Agen Peneliti & Agen Penulis' },
      { id: 'step-4', label: 'Jalankan crew.kickoff() dan pantau log hasilnya' }
    ],
    content: `
### Kenapa Lu Butuh Pasukan Agen AI?
Pernah gak sih ngerasa capek kalo harus riset topik, nyaring artikel dari 10 website, bikin rangkuman, terus nyusun draf artikel dari nol? Nah, daripada lu ngerjain semuanya manual kayak kerja rodi, serahin aja ke **Autonomous AI Agent**.

Konsepnya simpel banget: lu bayangin punya kantor mini di dalem laptop lu. Ada **Agent Peneliti** (kerjanya cuma browsing cari data akurat), ada **Agent Penulis** (nyusun data jadi artikel enak dibaca), dan ada **Agent Reviewer** (ngoreksi ejaan dan fakta). Framework paling asyik dan gak ribet buat bikin ginian sekarang namanya **CrewAI**.

---

### Persiapan & Install Paket
Pertama-tama, siapin terminal atau command prompt lu. Pastiin Python udah nongkrong di versi 3.10 atau yang lebih baru. Tinggal pasang paket intinya:

\`\`\`bash
# Bikin virtual environment biar rapi
python -m venv venv
source venv/bin/activate  # Di Windows: venv\\Scripts\\activate

# Install CrewAI dan tool pembantu
pip install crewai langchain-community
\`\`\`

Siapin juga API Key lu di environment variable:
\`\`\`bash
export OPENAI_API_KEY="sk-proj-xxxxxxxxxxxx"
# Atau di Windows PowerShell:
$env:OPENAI_API_KEY="sk-proj-xxxxxxxxxxxx"
\`\`\`

---

### Setup Agen dan Kerjaan (Tasks)
Di CrewAI, kita cuma perlu tentuin tiga hal: **Role** (peran), **Goal** (target kerjaan), dan **Backstory** (latar belakang sifat agen biar jawabannya gak ngawur). Yuk bikin file \`main.py\`:

\`\`\`python
import os
from crewai import Agent, Task, Crew, Process

# 1. Definisikan Agen Peneliti
researcher = Agent(
    role='Senior Tech Researcher',
    goal='Cari tren terbaru seputar AI Agent di tahun 2026',
    backstory='Lu adalah analis teknologi kawakan yang paling jago nemuin info AGI dan automasi sebelum viral.',
    verbose=True,
    memory=True
)

# 2. Definisikan Agen Copywriter Gaul
writer = Agent(
    role='Content Strategist Gaul',
    goal='Tulis artikel santai dan renyah berdasarkan hasil riset',
    backstory='Lu copywriter yang jago bikin materi teknis rumit jadi segampang dongeng tongkrongan.',
    verbose=True
)

# 3. Bikin Task Masing-Masing
task_riset = Task(
    description='Kumpulin 3 terobosan terbesar AI di tahun 2026 dan rangkum poin intinya.',
    expected_output='Rangkuman peluru 3 tren teknologi masa kini.',
    agent=researcher
)

task_nulis = Task(
    description='Ubah hasil riset jadi draf postingan blog 300 kata yang asyik dibaca anak muda.',
    expected_output='Artikel blog full format Markdown.',
    agent=writer
)

# 4. Satukan dalam Tim (Crew)
tech_crew = Crew(
    agents=[researcher, writer],
    tasks=[task_riset, task_nulis],
    process=Process.sequential # Berurutan: riset dulu baru nulis
)

print("🚀 Pasukan AI lagi kerja...")
result = tech_crew.kickoff()
print("\n=== HASIL AKHIR ===")
print(result)
\`\`\`

---

### Trik Penting Biar Bot Gak Nyangkut (Infinite Loop)
Seringkali agen AI nyangkut muter-muter manggil tools gak jelas. Trik jitunya:
1. **Kasih batasan iterasi**: Tambahkan parameter \`max_iter=5\` di definisi Agent.
2. **Pakai model yang stabil**: Minimal GPT-4o-mini atau Gemini 1.5/2.0 Flash. Model receh 7B lokal kadang suka lupa sama format JSON tools.
3. **Simpan memory**: Aktifin \`memory=True\` biar bot lu gak lupa obrolan di task sebelumnya.
`
  },
  {
    slug: 'deepseek-r1-vs-openai-o3-mini-duel-otak-ai',
    title: 'DeepSeek R1 vs OpenAI o3-mini: Mana yang Beneran Lebih Jenius Buat Ngoding & Matpel?',
    description: 'Bongkar perbandingan dua rajanya model reasoning 2026: DeepSeek R1 open-weights vs OpenAI o3-mini. Mana yang paling worth it buat lu pake harian?',
    postType: 'artikel',
    category: 'llm-models',
    categoryLabel: 'LLM & Models',
    difficulty: 'Pemula',
    pubDate: '11 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '5 min baca',
    author: 'Edvan',
    tags: ['DeepSeek', 'OpenAI', 'o3-mini', 'Reasoning', 'Benchmark'],
    affiliateProduct: {
      name: 'NVIDIA RTX 4090 24GB VRAM',
      priceEstimate: 'Rp 31.500.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'GPU Idaman Local AI',
      description: 'Kartu grafis monster buat jalanin DeepSeek R1 versi kuantisasi 14B/32B lokal di PC sendiri.'
    },
    toc: [
      { id: 'latar-belakang', title: '1. Fenomena Model Penalaran (Reasoning)' },
      { id: 'komparasi-kemampuan', title: '2. Adu Otak Coding & Logika' },
      { id: 'biaya-dan-efisiensi', title: '3. Perbandingan Biaya Token (Cost)' },
      { id: 'kesimpulan-pilihan', title: '4. Kesimpulan: Lu Mesti Pilih Mana?' },
    ],
    steps: [
      { id: 'step-1', label: 'Kenali apa itu chain-of-thought tersembunyi' },
      { id: 'step-2', label: 'Uji dengan studi kasus algoritma rekursif' },
      { id: 'step-3', label: 'Timbang antara privasi lokal vs performa cloud API' }
    ],
    content: `
### Dunia AI Lagi Geger Sama "Reasoning Model"
Kalo dulu model kayak GPT-4 itu langsung nyerocos ngasih jawaban pertama yang kepikiran, model generasi baru sekarang pake teknik **Reasoning** alias mikir dulu sebelum jawab! Mereka bikin *Chain of Thought* (rantai pemikiran) internal buat ngetes hipotesisnya sendiri.

Dua nama paling panas saat ini adalah **DeepSeek R1** dan **OpenAI o3-mini**.

---

### Duel Coding: Siapa yang Paling Minim Bug?
Kita uji kedua model ini buat bikin sistem autentikasi JWT lengkap dengan refresh token rotation di Next.js:

* **DeepSeek R1**: Keunggulannya ada di kejujuran penjelasannya. Langkah pemikirannya (*thinking process*) transparan banget. Kalau ada celah keamanan kayak CSRF atau Race Condition di token rotation, DeepSeek langsung wanti-wanti dan ngasih kode mitigasinya.
* **OpenAI o3-mini**: Cenderung super cepat dan ringkas. Kode yang dibikin biasanya langsung siap copy-paste tanpa banyak cingcong, tapi kadang penjelasan *why*-nya agak disunat biar output tokennya irit.

\`\`\`json
// Perbandingan Ringkas Benchmark
{
  "DeepSeek_R1": {
    "AIME_Math": "79.8%",
    "LiveCodeBench": "65.9%",
    "Model_Weight": "Open Weights (Bisa self-host)",
    "Privasi": "100% aman kalau jalanin di server sendiri"
  },
  "OpenAI_o3_mini": {
    "AIME_Math": "82.4%",
    "LiveCodeBench": "67.1%",
    "Model_Weight": "Closed Source (API Only)",
    "Privasi": "Tergantung kebijakan data OpenAI"
  }
}
\`\`\`

---

### Masalah Harga: Kenapa Developer Pindah ke DeepSeek?
Biaya API DeepSeek R1 itu bisa **10x sampai 20x lebih murah** dibanding OpenAI untuk rasio akurasi yang hampir mirip! Belum lagi buat lu yang paranoid sama kebocoran data kantor, versi distilled DeepSeek (14B atau 32B) bisa lu jalanin offline pake laptop gaming biasa.

**Verdict Akhir:**
* Mau **super cepat lewat API instan** tanpa pusing setup? Ambil **o3-mini**.
* Mau **hemat duit, kontrol penuh, dan bisa di-host sendiri**? Jelas sikat **DeepSeek R1**.
`
  },
  {
    slug: 'tutorial-langgraph-pemula-agen-multi-langkah',
    title: 'Tutorial LangGraph Buat Pemula: Bikin Agen AI Multi-Langkah yang Anti-Halusinasi',
    description: 'Belajar konsep StateGraph di LangGraph secara visual dan gampang. Cara bikin alur bot AI yang bisa koreksi jawabannya sendiri sebelum ditampilin.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'AI Agents',
    difficulty: 'Menengah',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '7 min baca',
    author: 'Edvan',
    tags: ['LangGraph', 'LangChain', 'Python', 'State Machine'],
    affiliateProduct: {
      name: 'LangChain & LangGraph Masterclass E-Book',
      priceEstimate: 'Rp 89.000',
      linkUrl: 'https://lynk.id',
      badge: 'Buku Rekomendasi',
      description: 'Panduan studi kasus lengkap bikin 10 arsitektur graf AI produksi skala enterprise.'
    },
    toc: [
      { id: 'kenapa-langgraph', title: '1. Masalah Agen AI Tradisional' },
      { id: 'konsep-stategraph', title: '2. Konsep Node, Edge, dan State' },
      { id: 'coding-studi-kasus', title: '3. Praktek Bikin Graf Verifikasi' },
      { id: 'human-in-the-loop', title: '4. Fitur Human-in-the-Loop' },
    ],
    steps: [
      { id: 'step-1', label: 'Instal langgraph dan langchain-core' },
      { id: 'step-2', label: 'Bikin TypedDict buat nyimpen Agent State' },
      { id: 'step-3', label: 'Definisikan fungsi node dan conditional edge' },
      { id: 'step-4', label: 'Kompilasi graf dan jalankan alur percakapan' }
    ],
    content: `
### Masalah Klasik Agen AI Biasa
Kalo lu pernah pake library agen AI standar, pasti pernah ngalamin momen nyebelin ini: bot lu ngeyel, halusinasi fakta, atau muter-muter di lubang kelinci tanpa tau kapan harus berhenti. 

Kenapa bisa gitu? Karena arsitektur agen biasa itu sifatnya *blackbox loop*—lu gak bisa ngontrol secara presisi kapan bot harus mikir, kapan harus nyari info tambahan, dan kapan harus ngelempar pertanyaan balik ke manusia. Nah, di sinilah **LangGraph** jadi penyelamat!

---

### Konsep Dasar: Bayangin Flowchart yang Punya Ingatan
Di LangGraph, bot lu dibentuk pake pola **State Graph**:
1. **State**: Variabel bersama yang nampung semua riwayat pesan dan data (kayak papan tulis bersama).
2. **Nodes**: Fungsi Python biasa yang ngelakuin aksi (misal: panggil LLM, search Google, hitung kalkulator).
3. **Edges**: Garis penunjuk arah. Hebatnya, ada *Conditional Edge*—cabang if/else logis. Kalau jawaban jelek, balik ke Node A; kalau bagus, lanjut ke Node B!

---

### Yuk Kita Praktek Bikin Kodenya!
Install dulu modulnya:

\`\`\`bash
pip install langgraph langchain-core langchain-openai
\`\`\`

Bikin skrip sederhana di mana bot akan ngecek apakah jawabannya mengandung fakta bohong sebelum disodorin ke user:

\`\`\`python
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END

# 1. Definisi State
class AgentState(TypedDict):
    question: str
    draft: str
    critique: str
    is_valid: bool

# 2. Bikin Node Fungsi
def generator_node(state: AgentState):
    print("🤖 Node Generator: Bikin draf jawaban...")
    return {"draft": f"Ini jawaban draf buat: {state['question']}"}

def critic_node(state: AgentState):
    print("🧐 Node Critic: Lagi ngoreksi draf...")
    is_ok = len(state['draft']) > 20
    return {
        "critique": "Draf aman dan valid!" if is_ok else "Draf kependekan!",
        "is_valid": is_ok
    }

# 3. Logika Percabangan (Conditional Edge)
def check_approval(state: AgentState):
    if state["is_valid"]:
        return "approved"
    return "rejected"

# 4. Susun Graf
builder = StateGraph(AgentState)
builder.add_node("generator", generator_node)
builder.add_node("critic", critic_node)

builder.set_entry_point("generator")
builder.add_edge("generator", "critic")

builder.add_conditional_edges(
    "critic",
    check_approval,
    {
        "approved": END,
        "rejected": "generator" # Looping benerin draf kalau ditolak!
    }
)

app = builder.compile()

# Jalankan!
output = app.invoke({"question": "Jelasin apa itu LangGraph?"})
print("Hasil Final:", output)
\`\`\`
`
  },
  {
    slug: 'mengenal-mcp-model-context-protocol-standar-baru',
    title: 'Mengenal MCP (Model Context Protocol): Standar Baru yang Bikin AI Kamu Bisa Akses Semua Tools',
    description: 'Penjelasan gampang soal MCP yang dibikin Anthropic. Kenapa protokol ini disebut sebagai USB Type-C buat dunia Artificial Intelligence.',
    postType: 'artikel',
    category: 'tools-automation',
    categoryLabel: 'Dev Tools & Automation',
    difficulty: 'Pemula',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '5 min baca',
    author: 'Edvan',
    tags: ['MCP', 'Anthropic', 'Protocol', 'Claude', 'API'],
    affiliateProduct: {
      name: 'Raspberry Pi 5 8GB Starter Kit',
      priceEstimate: 'Rp 1.450.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Alat Home Server',
      description: 'Mini PC hemat listrik buat dijadiin MCP Hub server lokal di rumah.'
    },
    toc: [
      { id: 'analogi-usb-c', title: '1. Analogi USB-C Buat AI' },
      { id: 'cara-kerja-mcp', title: '2. Cara Kerja MCP Server & Client' },
      { id: 'manfaat-nyata', title: '3. Kenapa Developer Wajib Paham Ini?' },
      { id: 'tutorial-pasang', title: '4. Cara Pasang MCP Server Pertama Lu' },
    ],
    steps: [
      { id: 'step-1', label: 'Pahami peran Client (Claude Desktop / Antigravity) dan Server' },
      { id: 'step-2', label: 'Buka konfigurasi claude_desktop_config.json' },
      { id: 'step-3', label: 'Tambahkan server MCP filesystem atau SQLite' }
    ],
    content: `
### Ingat Zaman Charger HP Beda-Beda Merk Dulu?
Dulu kalo lu punya HP Nokia colokannya bulat kecil, HP Sony Ericsson colokannya pipih lebar, Samsung colokannya micro-USB. Ribet banget kan? Pas lahir **USB Type-C**, semua perangkat di muka bumi akhirnya pake satu colokan seragam.

Nah, dunia AI kemarin-kemarin persis kayak zaman HP jadul itu! Tiap kali mau nyambungin ChatGPT atau Claude ke database Postgres, Google Drive, atau Git, developer harus nulis kode konektor custom dari nol.

Masuklah **MCP (Model Context Protocol)** yang diinisiasi sama Anthropic. MCP ini adalah "USB-C" buat AI: satu standar universal biar model AI apa pun bisa langsung ngobrol sama tool dan database apa pun tanpa ribet!
`
  },
  {
    slug: 'claude-3-7-sonnet-hybrid-reasoning-panduan-praktis',
    title: 'Claude 3.7 Sonnet & Fitur Hybrid Reasoning: Kapan Wajib Pake Mode Berpikir Panjang?',
    description: 'Review tuntas Claude 3.7 Sonnet yang punya tuas fleksibel antara mode kilat vs mode penalaran mendalam. Lengkap dengan taktik prompt hemat token.',
    postType: 'artikel',
    category: 'llm-models',
    categoryLabel: 'LLM & Models',
    difficulty: 'Menengah',
    pubDate: '13 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '6 min baca',
    author: 'Edvan',
    tags: ['Claude 3.7', 'Anthropic', 'Hybrid Reasoning', 'Coding AI'],
    affiliateProduct: {
      name: 'Keychron K2 V2 Wireless Keyboard',
      priceEstimate: 'Rp 1.150.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Gear Koding Idaman',
      description: 'Mechanical keyboard tactile empuk buat marathon ngoding bareng Claude seharian.'
    },
    toc: [
      { id: 'fitur-hybrid', title: '1. Apa Itu Hybrid Reasoning?' },
      { id: 'kapan-pake-thinking', title: '2. Kapan Wajib Aktifkan Mode Thinking?' },
      { id: 'skema-budget-token', title: '3. Cara Atur Budget Token Berpikir' },
      { id: 'studi-kasus', title: '4. Uji Coba Refactor Arsitektur Kompleks' },
    ],
    steps: [
      { id: 'step-1', label: 'Pilih model claude-3-7-sonnet-20250219 di API' },
      { id: 'step-2', label: 'Tentukan thinking.budget_tokens sesuai tingkat kesulitan kasus' }
    ],
    content: `
### Terobosan Baru: Satu Model, Dua Kepribadian
Sebelumnya, dunia AI terbelah dua: ada model kilat buat obrolan santai biasa (kayak Claude 3.5 Sonnet standar), dan ada model pemikir lambat tapi super cerdas (kayak OpenAI o1).

Anthropic bikin gebrakan baru lewat **Claude 3.7 Sonnet**. Model ini mengusung teknologi **Hybrid Reasoning**. Artinya: lu bisa ngatur sendiri seberapa keras dan seberapa lama si Claude boleh mikir sebelum dia ngeluarin jawaban pertama!
`
  },
  {
    slug: 'bikin-asisten-otomatis-pake-n8n-dan-ai-agent',
    title: 'Bikin Asisten Pribadi Otomatis Pake n8n + AI Agent Tanpa Nulis Ribuan Baris Kode',
    description: 'Cara gampang bikin workflow otomatisasi n8n self-hosted digabung OpenAI/Gemini buat balas email, sortir invoice, dan kirim notifikasi WhatsApp otomatis.',
    postType: 'tutorial',
    category: 'tools-automation',
    categoryLabel: 'Dev Tools & Automation',
    difficulty: 'Pemula',
    pubDate: '13 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '6 min baca',
    author: 'Edvan',
    tags: ['n8n', 'No-Code', 'Automation', 'Workflow', 'AI Agent'],
    affiliateProduct: {
      name: 'Akun Cloud Server VPS KVM 4GB',
      priceEstimate: 'Rp 95.000/bln',
      linkUrl: 'https://digitalocean.com',
      badge: 'Best Value VPS',
      description: 'Server murah buat install Docker n8n jalan terus 24 jam nonstop.'
    },
    toc: [
      { id: 'kenapa-n8n', title: '1. Kenapa n8n Lebih Juara Dibanding Zapier?' },
      { id: 'setup-docker', title: '2. Cara Pasang n8n Pake Docker (5 Menit Jadi)' },
      { id: 'bikin-alur-ai', title: '3. Merangkai Node AI Agent di n8n' },
      { id: 'studi-kasus-invoice', title: '4. Otomasi Ekstrak Invoice & WhatsApp' },
    ],
    steps: [
      { id: 'step-1', label: 'Jalankan container docker n8n dengan volume persistensi' },
      { id: 'step-2', label: 'Buka dashboard n8n di browser localhost:5678' },
      { id: 'step-3', label: 'Tarik node AI Agent + Chat Model + Tools' }
    ],
    content: `
### Bosan Bayar Langganan Zapier yang Mahal?
Zapier atau Make.com emang asyik, tapi begitu automasi lu rame, tagihan bulanannya bisa bikin dompet jebol. Solusi pro player jaman sekarang: **Self-hosted n8n**!

n8n itu gratis kalau lu host sendiri pake Docker di VPS atau PC kantor. Hebatnya lagi, versi terbaru n8n punya komponen **AI Agent bawaan** yang tinggal di-*drag and drop* kayak main Lego!

---

### Cara Pasang n8n Kilat Pake Docker
Cukup satu baris perintah sakti di terminal VPS lu:

\`\`\`bash
docker run -d \\
  --name n8n \\
  -p 5678:5678 \\
  -v n8n_data:/home/node/.n8n \\
  --restart unless-stopped \\
  n8nio/n8n:latest
\`\`\`
`
  },
  {
    slug: 'panduan-lengkap-ollama-jalanin-llm-lokal-gratis',
    title: 'Panduan Lengkap Ollama: Cara Jalanin LLM Kelas Sultan di Laptop Lokal 100% Gratis & Offline',
    description: 'Kupas tuntas Ollama buat pemula. Cara download Llama 3.3, Mistral, dan DeepSeek langsung di komputer sendiri tanpa internet dan tanpa kuota API!',
    postType: 'tutorial',
    category: 'hardware-setup',
    categoryLabel: 'Hardware & Gear',
    difficulty: 'Pemula',
    pubDate: '13 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '5 min baca',
    author: 'Edvan',
    tags: ['Ollama', 'Local LLM', 'Llama 3', 'Offline AI', 'Privacy'],
    affiliateProduct: {
      name: 'SSD NVMe Gen4 2TB Read 7000MB/s',
      priceEstimate: 'Rp 2.100.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Storage Kilat',
      description: 'SSD kenceng wajib punya buat loading bobot model AI raksasa 20GB dalam 2 detik.'
    },
    toc: [
      { id: 'keuntungan-lokal', title: '1. Kenapa Mesti Pake AI Lokal?' },
      { id: 'install-ollama', title: '2. Cara Install Ollama di Windows / Mac / Linux' },
      { id: 'perintah-sakral', title: '3. Kumpulan Perintah Terminal Ollama' },
      { id: 'rekomendasi-model', title: '4. Rekomendasi Model Sesuai Spek Laptop' },
    ],
    steps: [
      { id: 'step-1', label: 'Download installer dari ollama.com' },
      { id: 'step-2', label: 'Jalankan perintah ollama run llama3.3:8b di terminal' },
      { id: 'step-3', label: 'Coba tanya prompt koding atau ringkasan dokumen' }
    ],
    content: `
### Privasi Harga Mati: Jangan Kirim Data Kantor ke Cloud!
Banyak perusahaan atau developer yang parno pas mau pake AI: *"Gimana kalo data keuangan, password database, atau source code rahasia kita disimpen sama server asing?"*

Jawaban paling mantap: **Jalanin AI di komputer lu sendiri pake Ollama!**
Ollama itu semacam *Docker khusus buat model AI*. Gak ada lagi drama setting CUDA driver yang bikin pusing tujuh keliling.

\`\`\`bash
# Download sekaligus ngobrol langsung sama Llama 3.3
ollama run llama3.3:8b
\`\`\`
`
  },
  {
    slug: 'cursor-ai-vs-windsurf-ide-duel-editor-koding',
    title: 'Cursor AI vs Windsurf IDE: Duel Text Editor AI Terbaik Buat Naikin Produktivitas 10x Lipat',
    description: 'Perbandingan tajam antara dua editor paling heboh 2026: Cursor AI (fitur Composer legendaris) vs Windsurf Codeium (fitur Flows & Cascade cerdas).',
    postType: 'artikel',
    category: 'tools-automation',
    categoryLabel: 'Dev Tools & Automation',
    difficulty: 'Pemula',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '6 min baca',
    author: 'Edvan',
    tags: ['Cursor AI', 'Windsurf', 'VS Code', 'Dev Tools', 'Coding'],
    affiliateProduct: {
      name: 'Monitor Ultrawide 34 Inch IPS 144Hz',
      priceEstimate: 'Rp 5.250.000',
      linkUrl: 'https://tokopedia.com',
      badge: 'Display Impian Koding',
      description: 'Layar lebar lega buat nampung jendela koding, terminal, dan panel chat AI barengan.'
    },
    toc: [
      { id: 'era-baru-editor', title: '1. Selamat Tinggal VS Code Polosan' },
      { id: 'cursor-composer', title: '2. Kekuatan Utama Cursor AI (Composer & Shadow Workspace)' },
      { id: 'windsurf-cascade', title: '3. Keajaiban Windsurf (Flows & Real-Time Awareness)' },
      { id: 'tabel-perbandingan', title: '4. Tabel Adu Fitur & Harga' },
    ],
    steps: [
      { id: 'step-1', label: 'Coba fitur multi-file edit (Cmd+I) di Cursor' },
      { id: 'step-2', label: 'Coba fitur Cascade collaborative flow di Windsurf' }
    ],
    content: `
### Kalau Masih Ngetik Manual Satu-Satu, Lu Ketinggalan Kereta!
Tahun 2026 ini, koding bukan lagi soal lu hafalan sintaks loop atau bolak-balik buka Stack Overflow cuma buat nyari cara slicing array. Sekarang peran software engineer berubah jadi semacam **Tech Lead**: lu yang ngasih visi arsitektur, AI yang ngetik kodenya secara simultan di 15 file sekaligus!

Dua penguasa medan perang ini adalah **Cursor AI** dan **Windsurf (dari Codeium)**.
`
  },
  {
    slug: 'tutorial-browser-use-ai-agent-otomatisasi-web',
    title: 'Tutorial Bikin Browser Use AI Agent: Biar Bot yang Browsing, Belanja, & Isi Form Otomatis Buat Lu',
    description: 'Cara setting library Browser-Use open source pake Python. Bikin agen AI yang bisa navigasi Google Chrome, isi form pendaftaran, dan download file sendiri.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'AI Agents',
    difficulty: 'Mahir',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '7 min baca',
    author: 'Edvan',
    tags: ['Browser Use', 'Playwright', 'Web Scraping', 'Automation', 'Python'],
    affiliateProduct: {
      name: 'Proxies Residensial Unmetered 10GB',
      priceEstimate: 'Rp 220.000',
      linkUrl: 'https://smartproxy.com',
      badge: 'Anti-Block Web',
      description: 'IP proxy bersih biar bot browser lu gak kena blokir Cloudflare pas crawling data.'
    },
    toc: [
      { id: 'apa-itu-browser-use', title: '1. Apa Itu Browser-Use?' },
      { id: 'instalasi-playwright', title: '2. Setup Playwright & Chrome' },
      { id: 'skrip-otomasi-pertama', title: '3. Skrip Agen Pemburu Tiket / Data' },
      { id: 'tips-anti-captcha', title: '4. Trik Lolos Deteksi Bot & Captcha' },
    ],
    steps: [
      { id: 'step-1', label: 'Install browser-use dan install browser Playwright' },
      { id: 'step-2', label: 'Tentukan model visi (misal: GPT-4o atau Claude 3.5 Sonnet)' },
      { id: 'step-3', label: 'Jalankan skrip otonom dan tonton browser gerak sendiri' }
    ],
    content: `
### Bukan Sekadar Web Scraping Kuno!
Web scraping konvensional pake BeautifulSoup atau Selenium itu gampang banget rusak. Begitu website target ganti satu nama class CSS aja, skrip lu langsung error berantakan.

**Browser-Use** hadir dengan pendekatan masa depan: model AI multimodal (yang bisa ngeliat gambar layar) dikasih kendali langsung atas browser Playwright. Jadi bot lu "melihat" layar web layaknya mata manusia!

\`\`\`bash
pip install browser-use playwright
playwright install
\`\`\`
`
  },
  {
    slug: 'gemini-2-5-pro-flash-manfaatin-2-juta-token',
    title: 'Gemini 2.5 Pro & Flash: Cara Manfaatin Context Window 2 Juta Token Buat Analisis Dokumen Raksasa',
    description: 'Trik praktis lempar buku 500 halaman, video rekaman 2 jam, atau 1 repository kode full ke Google Gemini tanpa dipotong-potong lagi.',
    postType: 'artikel',
    category: 'llm-models',
    categoryLabel: 'LLM & Models',
    difficulty: 'Menengah',
    pubDate: '14 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '5 min baca',
    author: 'Edvan',
    tags: ['Google Gemini', 'Long Context', 'Multimodal', 'Large Documents'],
    affiliateProduct: {
      name: 'Google One AI Premium Plan (2TB Cloud)',
      priceEstimate: 'Rp 309.000/bln',
      linkUrl: 'https://one.google.com',
      badge: 'Langganan Resmi',
      description: 'Akses penuh ke model Gemini Advanced dan integrasi langsung di Google Docs.'
    },
    toc: [
      { id: 'keajaiban-long-context', title: '1. Kenapa 2 Juta Token Itu Game Changer?' },
      { id: 'lempar-repo-penuh', title: '2. Masukin 1 Proyek Source Code Sekaligus' },
      { id: 'video-audio-analysis', title: '3. Analisis Video Kuliah 2 Jam Tanpa Transkrip' },
      { id: 'optimasi-biaya-cache', title: '4. Trik Context Caching Biar Gak Boros Dolar' },
    ],
    steps: [
      { id: 'step-1', label: 'Daftar akun di Google AI Studio' },
      { id: 'step-2', label: 'Upload file PDF tebal atau video rekaman panjang' }
    ],
    content: `
### Ucapkan Selamat Tinggal Pada "Token Limit Exceeded"!
Ingat gak dulu pas prompt lu kepanjangan dikit langsung muncul pesan galat merah: *"Prompt exceeds maximum context length"*? 

Keluarga **Google Gemini** ngerombak aturan main itu dengan menyediakan **Context Window sampai 2 Juta Token**!
Bisa muat 40 buku tebal sekaligus dalam satu kali percakapan.
`
  }
];
