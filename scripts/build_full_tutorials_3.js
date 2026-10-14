// Full generator for lib/data/tutorials-3.ts with 18 complete, practical, in-depth tutorials
const fs = require('fs');
const path = require('path');

const tutorials = [
  {
    slug: 'cara-pasang-mem0-long-term-memory-ai-agent',
    title: 'Cara Pasang Mem0 (The Memory Layer for AI) untuk Menyimpan Memori Jangka Panjang AI Agent',
    description: 'Panduan membangun agen AI yang tidak pernah lupa preferensi pengguna. Mengintegrasikan Mem0 dengan LangChain atau CrewAI untuk memori persisten lintas sesi obrolan.',
    postType: 'tutorial',
    category: 'ai-agents',
    categoryLabel: 'AI Agents',
    difficulty: 'Menengah',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['Mem0', 'Memory AI', 'LangChain', 'Python', 'Vector DB', 'Autonomous Agent'],
    affiliateProduct: {
      name: 'Serverless Managed Redis & Vector',
      priceEstimate: 'Rp 160.000/bln',
      linkUrl: 'https://upstash.com',
      badge: 'Fast Memory',
      description: 'Penyimpanan in-memory sub-milidetik untuk menyimpan status obrolan Mem0 secara persisten.'
    },
    toc: [
      { id: 'kenapa-ai-biasa-mengalami-amnesia', title: '1. Masalah Amnesia Konteks pada LLM Standar' },
      { id: 'arsitektur-hierarkis-mem0', title: '2. Arsitektur Mem0: User, Session, & Assistant Memory' },
      { id: 'instalasi-mem0-dan-konfigurasi', title: '3. Instalasi Paket mem0ai & Setup Qdrant/Chroma' },
      { id: 'operasi-add-search-update', title: '4. Eksekusi Operasi CRUD Memori pada Percakapan' },
      { id: 'integrasi-dengan-langchain-agent', title: '5. Menghubungkan Mem0 ke Runtime Asisten LangChain' }
    ],
    steps: [
      { id: 'step-1', label: 'Instal paket mem0ai menggunakan pip' },
      { id: 'step-2', label: 'Konfigurasikan model embedding dan database vektor Qdrant lokal' },
      { id: 'step-3', label: 'Simpan fakta pengguna dengan mem.add() terikat pada user_id tertentu' },
      { id: 'step-4', label: 'Panggil mem.search() sebelum memanggil LLM untuk menyuntikkan memori relevan' }
    ],
    content: `
### 1. Masalah Amnesia Konteks pada LLM Standar
Model bahasa besar (*LLM*) secara inheren tidak memiliki memori (*stateless*). Setiap kali jendela obrolan baru dibuka, model melupakan nama Anda, riwayat proyek yang sedang dikerjakan, framework favorit, hingga alergi makanan yang pernah Anda ceritakan kemarin.

Memasukkan seluruh riwayat chat ke dalam prompt (*chat history dumping*) bukan solusi yang efisien:
* Membuang kuota token konteks secara sia-sia.
* Biaya panggilan API membengkak seiring bertambahnya percakapan.
* Kualitas penalaran model menurun (*needle in a haystack problem*).

### 2. Arsitektur Hierarkis Mem0
**Mem0** ([github.com/mem0ai/mem0](https://github.com/mem0ai/mem0)) adalah lapisan memori cerdas untuk agen AI. Berbeda dari sistem buffer sederhana, Mem0 mengekstraksi fakta inti, preferensi, dan relasi entitas, lalu menyimpannya dalam grafik vektor berlapis:
* **User Memory**: Mengingat preferensi permanen (contoh: *"Pengguna menyukai TypeScript dan Tailwind CSS"*).
* **Session Memory**: Mengingat konteks sementara tugas yang sedang berlangsung hari ini.
* **Agent Memory**: Mengingat instruksi khusus yang telah dipelajari agen dari evaluasi sebelumnya.

### 3. Instalasi Paket mem0ai & Setup Qdrant/Chroma
Pasang pustaka Mem0 di terminal Anda:

\`\`\`bash
pip install mem0ai qdrant-client openai
\`\`\`

Siapkan skrip konfigurasi \`init_memory.py\`:

\`\`\`python
import os
from mem0 import Memory

os.environ["OPENAI_API_KEY"] = "sk-proj-xxxxxxxxxxxxxxxxxxxx"

# Konfigurasi Mem0 dengan penyimpanan lokal Qdrant
config = {
    "vector_store": {
        "provider": "qdrant",
        "config": {
            "path": "./mem0_qdrant_db"
        }
    }
}

mem = Memory.from_config(config)
\`\`\`

### 4. Eksekusi Operasi CRUD Memori pada Percakapan
Simpan fakta percakapan yang terikat ke ID pengguna tertentu:

\`\`\`python
user_id = "programmer_edvan"

# 1. Simpan interaksi percakapan
mem.add(
    "Saya adalah fullstack developer yang sedang membangun platform EnInformasi dengan Next.js App Router dan Tailwind CSS.",
    user_id=user_id
)

# 2. Simpan preferensi kedua di waktu lain
mem.add(
    "Tolong selalu buatkan kode menggunakan TypeScript yang clean dan jangan gunakan semicolon jika memungkinkan.",
    user_id=user_id
)

# 3. Cari memori saat pengguna bertanya di masa mendatang
hasil = mem.search("Teknologi apa yang saya gunakan untuk web saya?", user_id=user_id)

print("=== MEMORI YANG DITEMUKAN ===")
for m in hasil.get("results", []):
    print(f"- {m['memory']}")
\`\`\`

### 5. Menghubungkan Mem0 ke Runtime Asisten LangChain
Suntikkan memori yang diekstraksi langsung ke dalam system prompt agen Anda:

\`\`\`python
from openai import OpenAI

client = OpenAI()

def chat_dengan_agen(pertanyaan: str, user_id: str):
    # Ambil memori relevan
    memori_list = mem.search(pertanyaan, user_id=user_id).get("results", [])
    konteks_memori = "\\n".join([f"- {m['memory']}" for m in memori_list])

    system_prompt = f"""
    Anda adalah asisten pribadi yang ramah.
    Gunakan fakta memori pengguna berikut untuk mempersonalisasi jawaban Anda:
    {konteks_memori}
    """

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": pertanyaan}
        ]
    )

    # Simpan kembali konteks baru secara otomatis
    mem.add(f"User bertanya: {pertanyaan}", user_id=user_id)
    return res.choices[0].message.content

print(chat_dengan_agen("Bikinkan komponen tombol untuk proyek saya!", user_id="programmer_edvan"))
\`\`\`
`,
    en: {
      title: 'Setup Mem0 (The Memory Layer for AI) for Long-Term AI Agent Memory',
      description: 'Build AI assistants that never forget user preferences. Learn how to configure Mem0 with local vector engines to maintain persistent context across sessions.',
      content: `
### 1. The Context Amnesia Dilemma
Stateless LLMs discard user state between invocations, while raw chat transcript concatenation inflates token overhead and degrades reasoning.

### 2. Mem0 Hierarchical Memory Architecture
Mem0 ([github.com/mem0ai/mem0](https://github.com/mem0ai/mem0)) structures state across User, Session, and Agent layers, extracting atomic facts dynamically.

### 3. Environment & Vector Engine Setup
Install \`mem0ai\` and pair with local embedded Qdrant storage backends.

### 4. Memory Lifecycle: Add, Search, and Update
Bind conversation observations to unique \`user_id\` identifiers and perform semantic similarity searches over recalled facts.

### 5. Runtime Agent Integration
Inject retrieved facts directly into agent system prompts to deliver personalized, continuity-aware responses.
`
    }
  },
  {
    slug: 'tutorial-video-ai-lipsync-liveportrait-comfyui',
    title: 'Tutorial Video AI Lip-Sync Super Realistis dengan LivePortrait & ComfyUI',
    description: 'Panduan membuat animasi wajah dan lip-sync realistis dari 1 lembar foto potret diam. Menggunakan model open-source LivePortrait di antarmuka ComfyUI tanpa distorsi bentuk wajah.',
    postType: 'tutorial',
    category: 'generative-ai',
    categoryLabel: 'Generative AI',
    difficulty: 'Menengah',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['LivePortrait', 'ComfyUI', 'AI Video', 'Lip Sync', 'Generative AI', 'Computer Vision'],
    affiliateProduct: {
      name: 'GPU Cloud Workstation RTX 4090',
      priceEstimate: 'Rp 6.000/jam',
      linkUrl: 'https://vast.ai',
      badge: 'Render Cepat',
      description: 'Sewa GPU cloud untuk merender animasi LivePortrait 60 FPS secara instan.'
    },
    toc: [
      { id: 'kenapa-liveportrait-mengubah-standar-animasi', title: '1. Kenapa LivePortrait Jauh Lebih Rapi Dibanding SadTalker?' },
      { id: 'persiapan-comfyui-dan-custom-nodes', title: '2. Memasang ComfyUI & Custom Node LivePortrait' },
      { id: 'download-checkpoint-dan-insightface', title: '3. Mengunduh Model Checkpoint & Bobot InsightFace' },
      { id: 'menyusun-alur-workflow-node', title: '4. Merangkai Node: Source Image, Driving Video, & Retargeting' },
      { id: 'render-hasil-video-60fps', title: '5. Render Video Akhir & Pengaturan Ekspresi Mata/Mulut' }
    ],
    steps: [
      { id: 'step-1', label: 'Buka ComfyUI Manager dan pasang node ComfyUI-LivePortraitKJ' },
      { id: 'step-2', label: 'Unduh model checkpoint LivePortrait dan letakkan di folder models/liveportrait' },
      { id: 'step-3', label: 'Unggah 1 gambar foto wajah dan 1 video penggerak (driving video ekspresi)' },
      { id: 'step-4', label: 'Klik Queue Prompt untuk merender video MP4 dengan sinkronisasi gerak alami' }
    ],
    content: `
### 1. Kenapa LivePortrait Jauh Lebih Rapi Dibanding SadTalker?
Alat animasi potret generasi terdahulu seperti SadTalker atau Wav2Lip sering menghasilkan efek "lembah aneh" (*uncanny valley*): gigi tampak kabur, rahang meregang tidak wajar, dan tekstur kulit di sekitar bibir kehilangan ketajaman.

**LivePortrait** ([github.com/KwaiVGI/LivePortrait](https://github.com/KwaiVGI/LivePortrait)) dari Kuaishou Technology memecahkan masalah ini dengan memisahkan representasi gerakan wajah (*implicit keypoints*) dari struktur identitas asli.
* **Mempertahankan Detail Asli**: Rambut, anting, kerutan mata, dan latar belakang tetap tajam tanpa artefak *warping*.
* **Kontrol Gerak Halus**: Mengontrol arah lirikan mata, kedipan, senyum, dan rotasi kepala hingga 60 FPS.
* **Kecepatan Komputasi Tinggi**: Berjalan di atas 30 FPS pada GPU RTX 3060 ke atas.

### 2. Memasang ComfyUI & Custom Node LivePortrait
Pastikan Anda telah memasang **ComfyUI**. Buka antarmuka ComfyUI di browser:
1. Buka **ComfyUI Manager** -> Klik **Install Custom Nodes**.
2. Cari \`ComfyUI-LivePortraitKJ\` (dibuat oleh Kijai) dan klik **Install**.
3. Muat ulang (*Restart*) ComfyUI Anda.

### 3. Mengunduh Model Checkpoint & Bobot InsightFace
Unduh bobot model dari Hugging Face repository ke dalam subdirektori ComfyUI Anda:
* Folder: \`ComfyUI/models/liveportrait/\`
  * \`appearance_feature_extractor.safetensors\`
  * \`motion_extractor.safetensors\`
  * \`spade_generator.safetensors\`
  * \`warping_module.safetensors\`
* Pastikan pustaka \`insightface\` dan paket CUDA ONNX Runtime telah terpasang:
\`\`\`bash
pip install onnxruntime-gpu insightface
\`\`\`

### 4. Menyusun Alur Workflow Node
Muat template alur kerja LivePortrait di ComfyUI:
1. **Load Image**: Masukkan gambar potret wajah Anda yang menghadap lurus ke kamera dengan pencahayaan jelas.
2. **Load Video**: Masukkan *driving video* (rekaman video wajah seseorang berbicara atau tersenyum yang menjadi acuan gerak).
3. **LivePortrait Cropper**: Node ini akan mendeteksi kotak batas wajah (*bounding box*) secara otomatis dan menyejajarkan proporsi kepala.
4. **LivePortrait Retargeting**: Atur slider:
   * \`eye_ratio\`: Kontrol kedipan mata (1.0 default).
   * \`lip_ratio\`: Kontrol bukaan bibir agar sinkron dengan vokal suara.

### 5. Render Hasil Video 60FPS
Hubungkan keluaran dari node generator ke **VHS Video Combine** (dari VideoHelperSuite) dengan konfigurasi format \`video/h264-mp4\` dan frame rate \`30\` atau \`60 FPS\`.

Klik tombol **Queue Prompt**. Dalam 15-30 detik, foto potret diam Anda akan hidup berbicara, menoleh, dan tersenyum dengan tingkat realisme yang memukau!
`,
    en: {
      title: 'Hyper-Realistic AI Lip-Sync and Portrait Animation with LivePortrait & ComfyUI',
      description: 'Step-by-step masterclass on creating lifelike facial animations from a single still portrait. Master LivePortrait nodes in ComfyUI for zero-distortion lip-syncing and expression steering.',
      content: `
### 1. Why LivePortrait Redefines Portrait Animation
LivePortrait ([github.com/KwaiVGI/LivePortrait](https://github.com/KwaiVGI/LivePortrait)) separates implicit motion keypoints from appearance manifolds, eliminating blurring and facial warping artifacts.

### 2. ComfyUI Custom Node Setup
Install \`ComfyUI-LivePortraitKJ\` via ComfyUI Manager and configure supporting runtime packages.

### 3. Checkpoints & ONNX Dependencies
Acquire model weights and configure \`insightface\` alongside CUDA ONNX Runtime providers.

### 4. Graph Construction: Cropping, Retargeting, and Generation
Construct the processing graph chaining face alignment, driving video frame sampling, and retargeting multipliers.

### 5. Rendering High-Fidelity 60FPS Outputs
Export final sequences via \`VHS Video Combine\` to generate crisp, production-ready MP4 animations.
`
    }
  },
  {
    slug: 'dashboard-monitoring-evaluasi-ai-langsmith',
    title: 'Membangun Dashboard Monitoring & Evaluasi Akurasi AI Menggunakan LangSmith',
    description: 'Panduan mengintegrasikan observabilitas tingkat produksi pada aplikasi LLM. Memantau jejak pemanggilan token, latensi per layer, biaya API riil, dan otomatisasi evaluasi benchmark akurasi.',
    postType: 'tutorial',
    category: 'devops',
    categoryLabel: 'DevOps',
    difficulty: 'Menengah',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['LangSmith', 'LLMOps', 'Observability', 'LangChain', 'Python', 'Testing'],
    affiliateProduct: {
      name: 'LangSmith Team Subscription',
      priceEstimate: 'Rp 590.000/bln',
      linkUrl: 'https://smith.langchain.com',
      badge: 'LLMOps Pro',
      description: 'Platform observabilitas terdepan untuk tim AI mengaudit trace dan dataset evaluasi.'
    },
    toc: [
      { id: 'kenapa-observabilitas-llm-sangat-krusial', title: '1. Mengapa Aplikasi AI Membutuhkan Observabilitas (LLMOps)?' },
      { id: 'mendaftarkan-proyek-di-langsmith', title: '2. Setup Kunci API & Konfigurasi Environment LangSmith' },
      { id: 'tracing-otomatis-tanpa-ubah-kode', title: '3. Tracing Otomatis Panggilan LangChain & Native SDK' },
      { id: 'membuat-dataset-evaluasi-benchmark', title: '4. Menyusun Dataset Ground-Truth untuk Pengujian Akurasi' },
      { id: 'menjalankan-evaluasi-otomatis', title: '5. Menjalankan Evaluator Akurasi (QA Correctness)' }
    ],
    steps: [
      { id: 'step-1', label: 'Buat akun gratis di smith.langchain.com dan dapatkan API Key' },
      { id: 'step-2', label: 'Ekspor variabel lingkungan LANGCHAIN_TRACING_V2=true di aplikasi Anda' },
      { id: 'step-3', label: 'Buat dataset evaluasi berisi 20 pasang pertanyaan dan kunci jawaban acuan' },
      { id: 'step-4', label: 'Jalankan fungsi evaluate() untuk melihat skor akurasi dan latensi di dashboard' }
    ],
    content: `
### 1. Mengapa Aplikasi AI Membutuhkan Observabilitas (LLMOps)?
Saat aplikasi AI Anda diuji di komputer lokal, semuanya tampak berjalan lancar. Namun begitu dilempar ke ribuan pengguna di lingkungan produksi, berbagai masalah tersembunyi mulai bermunculan:
* Mengapa ada permintaan pengguna yang membutuhkan waktu 15 detik untuk membalas?
* Pada langkah rantai mana agen AI mengalami *stuck* atau memanggil perkakas yang salah?
* Berapa total pengeluaran dolar untuk token GPT-4o minggu ini?

**LangSmith** ([smith.langchain.com](https://smith.langchain.com)) memberikan transparansi total terhadap setiap siklus eksekusi rantai LLM Anda dalam bentuk grafik pohon jejak (*trace waterfall*).

### 2. Setup Kunci API & Konfigurasi Environment LangSmith
Cukup tambahkan 4 variabel lingkungan berikut pada file \`.env\` aplikasi Anda:

\`\`\`env
LANGCHAIN_TRACING_V2="true"
LANGCHAIN_API_KEY="lsv2_pt_xxxxxxxxxxxxxxxxxxxx"
LANGCHAIN_PROJECT="eninformasi-production-ai"
LANGCHAIN_ENDPOINT="https://api.smith.langchain.com"
\`\`\`

### 3. Tracing Otomatis Panggilan LangChain & Native SDK
Jika Anda menggunakan LangChain, setiap pemanggilan \`.invoke()\` otomatis tercatat ke dashboard tanpa mengubah satu baris kode pun.

Jika menggunakan SDK OpenAI atau fungsi Python murni, Anda cukup menggunakan dekorator \`@traceable\`:

\`\`\`python
import os
from langsmith import traceable
from openai import OpenAI

client = OpenAI()

@traceable(name="ekstrak_ringkasan_dan_entitas")
def proses_dokumen(teks: str):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Ekstrak poin penting dan sebutkan nama entitas bisnis yang ada."},
            {"role": "user", "content": teks}
        ]
    )
    return response.choices[0].message.content

# Eksekusi
print(proses_dokumen("PT EnInformasi Global meluncurkan server komputasi AI berkecepatan tinggi di Jakarta."))
\`\`\`

Buka dashboard LangSmith di browser. Anda akan melihat log interaksi lengkap: token input, token output, durasi eksekusi dalam milidetik, hingga rincian biaya.

### 4. Menyusun Dataset Ground-Truth untuk Pengujian Akurasi
Untuk mencegah regresi saat Anda memperbarui prompt atau mengganti versi model, buat dataset benchmark:

\`\`\`python
from langsmith import Client

client = Client()
dataset_name = "Benchmark Tanya Jawab EnInformasi"

# Buat dataset jika belum ada
if not client.has_dataset(dataset_name=dataset_name):
    dataset = client.create_dataset(
        dataset_name=dataset_name,
        description="Dataset acuan evaluasi akurasi chatbot internal."
    )

    client.create_examples(
        inputs=[
            {"pertanyaan": "Kapan EnInformasi didirikan?"},
            {"pertanyaan": "Apa fokus utama artikel di EnInformasi?"}
        ],
        outputs=[
            {"jawaban_acuan": "EnInformasi didirikan sebagai portal teknologi dan AI terdepan."},
            {"jawaban_acuan": "Fokus pada AI agents, tutorial praktis, dan teknologi masa depan."}
        ],
        dataset_id=dataset.id
    )
\`\`\`

### 5. Menjalankan Evaluator Akurasi (QA Correctness)
Jalankan evaluasi otomatis menggunakan model penilai (*LLM-as-a-judge*):

\`\`\`python
from langsmith.evaluation import evaluate

def pipeline_asisten(inputs: dict) -> dict:
    # Fungsi logika bot Anda
    return {"output": "EnInformasi berfokus pada ulasan AI agents, tutorial praktis, dan teknologi masa depan."}

def evaluasi_kemiripan(run, example):
    jawaban_bot = run.outputs["output"]
    kunci = example.outputs["jawaban_acuan"]
    # Logika penilaian kecocokan semantik
    skor = 1.0 if "AI" in jawaban_bot else 0.0
    return {"key": "akurasi_konten", "score": skor}

results = evaluate(
    pipeline_asisten,
    data=dataset_name,
    evaluators=[evaluasi_kemiripan],
    experiment_prefix="uji-coba-prompt-v2"
)

print("Evaluasi selesai! Cek skor perbandingan di dashboard LangSmith.")
\`\`\`
`,
    en: {
      title: 'Building AI Monitoring and Accuracy Evaluation Dashboards with LangSmith',
      description: 'Production-ready LLMOps observability guide. Monitor token consumption, trace latency across chain nodes, audit API expenditures, and automate continuous accuracy evaluation.',
      content: `
### 1. The Critical Role of LLMOps
Deploying AI applications to production demands deep observability into execution latencies, token consumption, and cost anomalies.

### 2. Project Registration & Configuration
Inject standard tracing variables including \`LANGCHAIN_TRACING_V2=true\` and API credentials into your runtime environment.

### 3. Zero-Code Auto-Tracing & @traceable Decorators
Seamlessly capture execution waterfalls across LangChain pipelines or arbitrary Python functions via the \`@traceable\` decorator.

### 4. Constructing Ground-Truth Benchmarks
Build evaluation datasets to detect regressions before deploying revised prompts or newer foundation models.

### 5. Automated LLM-as-a-Judge Evaluation Loops
Execute automated \`evaluate()\` suites scoring semantic correctness and latency budgets directly within the LangSmith web interface.
`
    }
  },
  {
    slug: 'tutorial-bikin-ai-mock-interviewer-webrtc',
    title: 'Tutorial Membuat AI Mock Interviewer Real-Time Berbasis WebRTC & Audio Streaming',
    description: 'Panduan membangun simulator wawancara kerja AI interaktif berbasis audio dua arah. Menggunakan WebRTC, model OpenAI Realtime API atau Gemini Live Audio, dan antarmuka Next.js modern.',
    postType: 'tutorial',
    category: 'web-dev',
    categoryLabel: 'Web Dev',
    difficulty: 'Lanjutan',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '10 min baca',
    author: 'Edvan',
    tags: ['WebRTC', 'Audio Streaming', 'OpenAI Realtime', 'Next.js', 'TypeScript', 'Voice AI'],
    affiliateProduct: {
      name: 'Noise-Cancelling Wireless Headset',
      priceEstimate: 'Rp 950.000',
      linkUrl: 'https://jabra.com',
      badge: 'Suara Jernih',
      description: 'Headset dengan mikrofon peredam bising untuk percakapan audio dua arah tanpa feedback gema.'
    },
    toc: [
      { id: 'perbedaan-speech-to-speech-vs-stt-llm-tts', title: '1. Mengapa Speech-to-Speech Native Menghilangkan Latensi?' },
      { id: 'arsitektur-koneksi-webrtc-peer', title: '2. Arsitektur Koneksi WebRTC SDP Peer Connection' },
      { id: 'membuat-backend-token-ephemeral-nextjs', title: '3. Pembuatan Token Sesi Ephemeral di Next.js API Route' },
      { id: 'membangun-ui-audio-visualizer-react', title: '4. Komponen Visualizer Audio Gelombang Suara di React' },
      { id: 'evaluasi-skor-dan-feedback-wawancara', title: '5. Menerima Ringkasan Feedback Wawancara di Akhir Sesi' }
    ],
    steps: [
      { id: 'step-1', label: 'Buat API route di Next.js untuk menerbitkan token ephemeral OpenAI Realtime API' },
      { id: 'step-2', label: 'Inisialisasi RTCPeerConnection di sisi browser client' },
      { id: 'step-3', label: 'Tangkap stream mikrofon lokal dan kirimkan track audio ke koneksi WebRTC' },
      { id: 'step-4', label: 'Putar balik stream audio masuk dari AI ke elemen <audio> dengan visualizer animasi' }
    ],
    content: `
### 1. Mengapa Speech-to-Speech Native Menghilangkan Latensi?
Sistem obrolan suara AI konvensional bekerja dengan merangkai 3 langkah berurutan (*cascaded pipeline*):
\`Mikrofon -> Whisper STT (1 detik) -> LLM generate text (1.5 detik) -> TTS generate audio (1 detik) -> Speaker\`.
Total jeda hening bisa mencapai **3 hingga 5 detik**, membuat simulasi wawancara terasa canggung dan tidak alami.

Dengan arsitektur **Speech-to-Speech Native** (seperti OpenAI Realtime API atau Gemini Live Audio) yang disalurkan melalui protokol **WebRTC**:
* Masukan suara diproses langsung dalam bentuk token audio (*audio tokens*).
* Latensi percakapan terpangkas drastis menjadi hanya **300 hingga 500 milidetik**!
* Pengguna dapat memotong pembicaraan AI (*interruptibility*) secara instan layaknya mengobrol dengan manusia asli.

### 2. Arsitektur Koneksi WebRTC SDP Peer Connection
WebRTC membutuhkan proses jabat tangan (*handshake*) menggunakan SDP (*Session Description Protocol*):
1. Klien browser membuat **SDP Offer**.
2. Klien mengirim offer tersebut ke endpoint server AI.
3. Server AI mengembalikan **SDP Answer**.
4. Terbentuk terowongan media peer-to-peer terenkripsi langsung antara mikrofon browser dan mesin AI.

### 3. Pembuatan Token Sesi Ephemeral di Next.js API Route
Jangan pernah mengekspos OpenAI API Key permanen di browser! Buat endpoint token sementara di file \`app/api/session/route.ts\`:

\`\`\`typescript
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.OPENAI_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "verse",
        instructions: \`
          Anda adalah pewawancara kerja teknis senior di perusahaan teknologi terkemuka.
          Tugas Anda adalah melakukan mock interview posisi Senior Frontend Developer.
          Tanyakan satu pertanyaan pada satu waktu, dengarkan jawaban kandidat, dan berikan pertanyaan lanjutan yang kritis.
          Gunakan bahasa Indonesia yang profesional namun santai.
        \`
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat sesi audio" }, { status: 500 });
  }
}
\`\`\`

### 4. Membangun UI Audio Visualizer di React
Buat komponen interaktif di \`components/InterviewRoom.tsx\`:

\`\`\`tsx
'use client';

import { useState, useRef } from 'react';

export default function InterviewRoom() {
  const [isActive, setIsActive] = useState(false);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startInterview = async () => {
    // 1. Dapatkan token sesi ephemeral
    const sessionRes = await fetch('/api/session', { method: 'POST' });
    const sessionData = await sessionRes.json();
    const EPHEMERAL_KEY = sessionData.client_secret.value;

    // 2. Buat objek RTCPeerConnection
    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    // 3. Putar audio balasan dari server AI
    pc.ontrack = (event) => {
      if (audioRef.current) {
        audioRef.current.srcObject = event.streams[0];
      }
    };

    // 4. Tangkap mikrofon pengguna
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    // 5. Buat WebRTC Offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // 6. Kirim offer ke gateway OpenAI Realtime
    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-realtime-preview-2024-12-17";
    const sdpResponse = await fetch(\`\${baseUrl}?model=\${model}\`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: \`Bearer \${EPHEMERAL_KEY}\`,
        "Content-Type": "application/sdp"
      },
    });

    const answer = { type: "answer" as RTCSdpType, sdp: await sdpResponse.text() };
    await pc.setRemoteDescription(answer);

    setIsActive(true);
  };

  const endInterview = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    setIsActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900 rounded-2xl border border-slate-800 text-white max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">🎙️ AI Senior Tech Interviewer</h2>
      <p className="text-sm text-slate-400 text-center mb-6">
        Latih kemampuan komunikasi teknis Anda dalam simulasi wawancara kerja dua arah berlatensi ultra-rendah.
      </p>

      <audio ref={audioRef} autoPlay />

      <button
        onClick={isActive ? endInterview : startInterview}
        className={\`px-6 py-3 rounded-full font-semibold transition \${
          isActive ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'
        }\`}
      >
        {isActive ? 'Akhiri Sesi Wawancara' : 'Mulai Bicara Sekarang'}
      </button>
    </div>
  );
}
\`\`\`

### 5. Evaluasi Skor dan Feedback Wawancara
Di akhir panggilan, Anda dapat meminta kanal data WebRTC mengirimkan ringkasan transkrip ke model penilai untuk memunculkan kartu evaluasi: skor komunikasi, kedalaman pemahaman teknis, dan poin perbaikan.
`,
    en: {
      title: 'Build a Real-Time WebRTC AI Mock Interviewer with Native Audio Streaming',
      description: 'Step-by-step blueprint for building a bi-directional voice interview simulator. Combine WebRTC peer connections, OpenAI Realtime API audio tokens, and modern Next.js interfaces.',
      content: `
### 1. Speech-to-Speech Paradigms vs Cascaded Latency
Cascaded STT-LLM-TTS pipelines incur 3-5s delays. Native Speech-to-Speech over WebRTC truncates response turn-around to sub-500ms with natural interruption handling.

### 2. WebRTC Peer Connection Handshakes
Establish WebRTC peer links using ephemeral session credentials and SDP exchange.

### 3. Server-Side Ephemeral Session Provisioning
Implement Next.js API routes issuing scoped ephemeral tokens to protect primary API keys.

### 4. Client-Side Audio Pipeline & Browser Capture
Acquire local media streams via \`getUserMedia\`, hook audio element sinks, and manage RTC peer states.

### 5. Performance Scoring & Session Synthesis
Harvest transcript streams at session termination to compute technical mastery indices and actionable critique.
`
    }
  },
  {
    slug: 'running-deepseek-r1-671b-distributed-llamacpp',
    title: 'Cara Menjalankan DeepSeek-R1 671B Full Model Secara Terdistribusi di Beberapa PC dengan llama.cpp RPC',
    description: 'Panduan menjalankan model penalaran raksasa DeepSeek-R1 671B MoE menggunakan teknik cluster terdistribusi RPC di llama.cpp. Menggabungkan RAM/VRAM dari beberapa laptop dan komputer jaringan lokal.',
    postType: 'tutorial',
    category: 'ai-infrastructure',
    categoryLabel: 'AI Infrastructure',
    difficulty: 'Lanjutan',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '11 min baca',
    author: 'Edvan',
    tags: ['DeepSeek-R1', 'llama.cpp', 'RPC', 'Distributed AI', 'Hardware', 'Open Source'],
    affiliateProduct: {
      name: 'Switch Gigabit Ethernet 8-Port 2.5Gbps',
      priceEstimate: 'Rp 650.000',
      linkUrl: 'https://tp-link.com',
      badge: 'Jaringan Kencang',
      description: 'Switch LAN kecepatan 2.5G untuk transfer data tensor berkecepatan tinggi antar node PC.'
    },
    toc: [
      { id: 'tantangan-ukuran-deepseek-r1-671b', title: '1. Mengapa DeepSeek-R1 671B Membutuhkan Cluster Terdistribusi?' },
      { id: 'konsep-rpc-server-worker-llamacpp', title: '2. Cara Kerja Fitur RPC (Remote Procedure Call) di llama.cpp' },
      { id: 'persiapan-perangkat-dan-jaringan-lan', title: '3. Topologi Jaringan LAN & Kebutuhan Memori Gabungan' },
      { id: 'menjalankan-rpc-server-pada-worker-node', title: '4. Menjalankan rpc-server di Setiap Komputer Anggota' },
      { id: 'menjalankan-master-node-dan-inferensi', title: '5. Eksekusi Model di Node Master & Pengujian Penalaran' }
    ],
    steps: [
      { id: 'step-1', label: 'Hubungkan 2-4 PC menggunakan kabel LAN Ethernet minimal 1 Gbps (disarankan 2.5 Gbps)' },
      { id: 'step-2', label: 'Kompilasi binary rpc-server dan llama-cli di seluruh perangkat' },
      { id: 'step-3', label: 'Jalankan rpc-server pada worker node dengan menentukan alamat IP dan port' },
      { id: 'step-4', label: 'Jalankan llama-cli pada master node dengan argumen --rpc ip_worker1:port,ip_worker2:port' }
    ],
    content: `
### 1. Mengapa DeepSeek-R1 671B Membutuhkan Cluster Terdistribusi?
Model penalaran mutakhir **DeepSeek-R1** versi utuh 671 Miliar Parameter ([github.com/deepseek-ai/DeepSeek-R1](https://github.com/deepseek-ai/DeepSeek-R1)) menawarkan kemampuan nalar matematis dan coding yang mengalahkan OpenAI o1.

Namun versi penuh model ini mengusung arsitektur *Mixture-of-Experts (MoE)* yang membutuhkan setidaknya **400 GB RAM/VRAM** bahkan pada format kuantisasi 4-bit (\`UD-IQ1_S\` / \`Q4_K_M\`). Sangat sedikit individu yang memiliki server tunggal seharga setengah miliar rupiah dengan 8 kartu GPU A100/H100.

Solusinya: **Menggabungkan 3 hingga 5 unit PC/Mac biasa di jaringan rumah Anda!**

### 2. Cara Kerja Fitur RPC di llama.cpp
Pustaka legendaris **llama.cpp** memiliki modul terdistribusi bawaan berbasis **RPC** (*Remote Procedure Call*):
* **Master Node**: Menyimpan file model GGUF di disk, membaca prompt pengguna, dan memecah lapisan layer transformer ke jaringan.
* **Worker Nodes**: Menjalankan daemon \`rpc-server\` di memori RAM/GPU mereka, menerima tensor komputasi dari master, mengeksekusi perkalian matriks, lalu mengembalikan hasilnya via LAN.

### 3. Topologi Jaringan LAN & Kebutuhan Memori Gabungan
Sebagai contoh setup klaster 3 komputer:
* **Node 1 (Master)**: Laptop gaming RTX 4080 (12GB VRAM) + 64GB RAM (IP: \`192.168.1.10\`)
* **Node 2 (Worker)**: PC Desktop RTX 3090 (24GB VRAM) + 64GB RAM (IP: \`192.168.1.20\`)
* **Node 3 (Worker)**: Mac Studio M2 Max (96GB Unified Memory) (IP: \`192.168.1.30\`)
* **Total Memori Gabungan**: **260 GB Memori Cepat**, cukup untuk memuat varian DeepSeek-R1 MoE kuantisasi 2.5-bit / 3-bit secara penuh!

> [!IMPORTANT]
> Gunakan kabel LAN fisik Cat6/Cat7 ke switch 2.5Gbps. Jangan gunakan Wi-Fi karena latensi tinggi akan memperlambat transfer tensor antar layer.

### 4. Menjalankan rpc-server di Setiap Komputer Anggota
Di setiap komputer worker (Node 2 dan Node 3), jalankan biner rpc-server yang telah dikompilasi:

\`\`\`bash
# Di Komputer Worker 1 (192.168.1.20)
./build/bin/rpc-server -H 192.168.1.20 -p 50052

# Di Komputer Worker 2 (192.168.1.30)
./build/bin/rpc-server -H 192.168.1.30 -p 50052
\`\`\`

Terminal worker akan menampilkan pesan: \`Listening on 192.168.1.xx:50052, waiting for tensor computation...\`.

### 5. Menjalankan Master Node & Inferensi
Di komputer Master (Node 1), unduh file model DeepSeek-R1 GGUF. Jalankan perintah inferensi dengan mengarahkan parameter \`--rpc\` ke IP semua worker:

\`\`\`bash
./build/bin/llama-cli \\
    -m ./models/DeepSeek-R1-UD-IQ1_S.gguf \\
    -p "Buktikan apakah hipotesis Riemann berlaku untuk nilai s kritis dan tuliskan langkah penalarannya secara lengkap." \\
    -n 2048 \\
    --rpc 192.168.1.20:50052,192.168.1.30:50052 \\
    -ngl 99 \\
    -t 16
\`\`\`

Amati terminal master: Lapisan tensor pertama dialokasikan ke GPU lokal, lapisan tengah dikirim ke PC Worker 1, dan lapisan akhir ditampung di Mac Studio Worker 2.

Model DeepSeek-R1 671B mulai berpikir (*Thinking Process*) dan menghasilkan token reasoning mendalam langsung dari klaster komputer rumah Anda sendiri!
`,
    en: {
      title: 'Running Full DeepSeek-R1 671B Across Multiple PCs with llama.cpp RPC',
      description: 'Run the flagship 671B MoE DeepSeek-R1 reasoning model by pooling VRAM and RAM from multiple consumer rigs across a local LAN using llama.cpp distributed RPC architecture.',
      content: `
### 1. Memory Challenges of 671B MoE Models
DeepSeek-R1 ([github.com/deepseek-ai/DeepSeek-R1](https://github.com/deepseek-ai/DeepSeek-R1)) contains 671B parameters requiring over 400GB of memory, which exceeds standard single-workstation budgets.

### 2. llama.cpp Distributed RPC Architecture
RPC enables a master orchestration node to partition transformer layers across worker daemon processes running over local Ethernet subnets.

### 3. Local Area Network Topology
Deploy across 2.5Gbps switched Ethernet connections joining heterogeneous rigs (Apple Silicon, NVIDIA GPUs, system DDR5).

### 4. Deploying Worker Daemons
Spin up \`rpc-server\` listener binaries on slave nodes specifying local bind addresses and ports.

### 5. Master Orchestration & Reasoning Verification
Launch the master inference loop passing \`--rpc\` endpoints to distribute matrix multiplication kernels across your local cluster.
`
    }
  },
  {
    slug: 'tutorial-agentic-web-scraper-scrapling-bypass',
    title: 'Tutorial Web Scraper Pintar Anti-Blokir Menggunakan Scrapling & Stealth Playwright',
    description: 'Panduan membangun scraper web otomatis yang kebal proteksi Cloudflare Turnstile & DataDome. Memadukan library Python Scrapling dengan adapter browser adaptif untuk ekstraksi data tanpa hambatan.',
    postType: 'tutorial',
    category: 'automation',
    categoryLabel: 'Automation',
    difficulty: 'Menengah',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['Scrapling', 'Web Scraping', 'Python', 'Playwright', 'Bypass Cloudflare', 'Automation'],
    affiliateProduct: {
      name: 'Residential Rotating Proxy Package',
      priceEstimate: 'Rp 210.000/bln',
      linkUrl: 'https://brightdata.com',
      badge: 'Proxy Bersih',
      description: 'Kolam IP residential bersih untuk menghindari pemblokiran captcha bot saat scraping intensif.'
    },
    toc: [
      { id: 'evolusi-proteksi-bot-cloudflare-datadome', title: '1. Mengapa Scraper BeautifulSoup & Requests Selalu Diblokir?' },
      { id: 'mengenal-scrapling-library', title: '2. Mengenal Scrapling: Engine Adaptif Anti-Deteksi' },
      { id: 'instalasi-dan-stealth-browser-setup', title: '3. Instalasi Scrapling & Konfigurasi Camoufox Engine' },
      { id: 'ekstraksi-data-dinamis-javascript', title: '4. Ekstraksi Data Halaman JavaScript Dinamis' },
      { id: 'pipeline-penyimpanan-ke-sqlite-json', title: '5. Menyimpan Data Bersih ke Format JSON & SQLite' }
    ],
    steps: [
      { id: 'step-1', label: 'Instal paket scrapling menggunakan pip pada lingkungan virtual Python' },
      { id: 'step-2', label: 'Gunakan StealthFetcher untuk memanipulasi sidik jari browser (fingerprint spoofing)' },
      { id: 'step-3', label: 'Ekstrak elemen web menggunakan CSS selector pintar yang toleran terhadap perubahan kelas' },
      { id: 'step-4', label: 'Eksport hasil ekstraksi ke file JSON atau basis data analitik' }
    ],
    content: `
### 1. Mengapa Scraper BeautifulSoup & Requests Selalu Diblokir?
Jika Anda mencoba mengambil data dari situs web modern menggunakan pustaka tradisional seperti \`requests\` atau \`urllib\`, Anda hampir pasti akan langsung disambut oleh halaman galat **HTTP 403 Forbidden** atau tantangan captcha Cloudflare Turnstile.

Sistem proteksi bot modern tidak hanya memeriksa *User-Agent*, tetapi juga menganalisis:
* **TLS Fingerprint (JA3/JA4)**: Struktur handshake enkripsi SSL/TLS bahasa pemrograman Python yang sangat mudah dideteksi.
* **Canvas & WebGL Fingerprinting**: Memeriksa apakah browser digerakkan oleh automation driver seperti Puppeteer atau Selenium murni.
* **Trik DOM Obfuscation**: Nama kelas CSS yang diacak secara berkala (misal \`class="product-title_x9k2"\`) untuk mematahkan query selector scraper.

### 2. Mengenal Scrapling: Engine Adaptif Anti-Deteksi
**Scrapling** ([github.com/D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling)) adalah pustaka web scraping generasi baru berbasis Python yang dirancang untuk mengatasi seluruh tantangan di atas:
* Memiliki selector pintar (*Smart Finders*) yang dapat menemukan kembali elemen tombol atau harga meskipun kelas CSS telah diubah oleh pemilik situs.
* Mendukung mode **StealthFetcher** yang menggunakan browser terselubung Camoufox untuk melewati proteksi sidik jari browser terberat sekalipun.
* Kecepatan parsing HTML super kilat menggunakan parser C teroptimasi.

### 3. Instalasi Scrapling & Konfigurasi Camoufox Engine
Pasang Scrapling di terminal Anda:

\`\`\`bash
pip install scrapling
scrapling install # Mengunduh browser stealth engine
\`\`\`

### 4. Ekstraksi Data Halaman JavaScript Dinamis
Buat file \`scrape_stealth.py\`:

\`\`\`python
from scrapling import StealthFetcher

# Inisialisasi fetcher anti-deteksi
fetcher = StealthFetcher()

url = "https://quotes.toscrape.com/js/" # Contoh halaman dengan proteksi dan rendering JS dinamis

print(f"Membuka URL target: {url}")
page = fetcher.fetch(url)

print(f"Status HTTP: {page.status}")

# Gunakan CSS selector intuitif
quotes = page.css(".quote")
print(f"Ditemukan {len(quotes)} kutipan data:")

hasil_data = []

for q in quotes:
    teks = q.css(".text::text").first
    penulis = q.css(".author::text").first
    tags = q.css(".tag::text").get_all()

    hasil_data.append({
        "teks": teks,
        "penulis": penulis,
        "kategori": tags
    })

print(hasil_data[:2])
\`\`\`

### 5. Menyimpan Data Bersih ke Format JSON & SQLite
Simpan data yang telah diekstrak ke dalam file database terstruktur untuk dianalisis lebih lanjut:

\`\`\`python
import json
import sqlite3

# 1. Simpan ke JSON
with open("hasil_scraping.json", "w", encoding="utf-8") as f:
    json.dump(hasil_data, f, ensure_ascii=False, indent=2)

# 2. Simpan ke SQLite lokal
conn = sqlite3.connect("data_koleksi.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS kutipan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teks TEXT,
    penulis TEXT,
    kategori TEXT
)
""")

for item in hasil_data:
    cursor.execute(
        "INSERT INTO kutipan (teks, penulis, kategori) VALUES (?, ?, ?)",
        (item["teks"], item["penulis"], ", ".join(item["kategori"]))
    )

conn.commit()
conn.close()

print("✅ Data berhasil disimpan ke JSON dan basis data SQLite!")
\`\`\`
`,
    en: {
      title: 'Undetectable Web Scraping with Scrapling & Stealth Playwright',
      description: 'Build robust, block-resistant web scrapers capable of bypassing Cloudflare Turnstile and fingerprint trackers using Python Scrapling and Camoufox stealth engines.',
      content: `
### 1. The Death of Requests & Vanilla Scraping
Modern anti-bot frameworks flag requests via TLS JA3/JA4 fingerprint inspection and headless browser canvas probing.

### 2. What is Scrapling?
Scrapling ([github.com/D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling)) introduces adaptive CSS element selectors and native anti-detect browser routing.

### 3. Installation & Stealth Browser Drivers
Install \`scrapling\` and compile bundled Camoufox fingerprint-spoofing browser binaries.

### 4. Dynamic JavaScript Harvesting
Execute \`StealthFetcher\` routines to bypass client challenges and ingest rendered DOM nodes into structured dictionaries.

### 5. Database Ingestion Protocols
Persist ingested records into normalized SQLite tables and serialized JSON payloads.
`
    }
  },
  {
    slug: 'cara-bikin-search-engine-vektor-semantic-milvus',
    title: 'Cara Membangun Mesin Pencari Vektor Skala Jutaan Dokumen dengan Milvus Standalone',
    description: 'Panduan arsitektur vector database enterprise menggunakan Milvus. Mengindeks jutaan embedding dokumen teks dengan indeks HNSW & IVF-FLAT untuk pencarian kemiripan semantik dalam hitungan milidetik.',
    postType: 'tutorial',
    category: 'database-dev',
    categoryLabel: 'Database Dev',
    difficulty: 'Lanjutan',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '10 min baca',
    author: 'Edvan',
    tags: ['Milvus', 'Vector Database', 'HNSW', 'Python', 'Search Engine', 'Semantic Search'],
    affiliateProduct: {
      name: 'High-IOPS NVMe Cloud Server 16GB RAM',
      priceEstimate: 'Rp 390.000/bln',
      linkUrl: 'https://digitalocean.com',
      badge: 'Database Cepat',
      description: 'Storage NVMe cepat untuk membaca indeks graf vektor jutaan dimensi tanpa bottleneck I/O.'
    },
    toc: [
      { id: 'kenapa-memilih-milvus-dibanding-faiss-pgvector', title: '1. Mengapa Milvus Unggul untuk Skala Jutaan Vektor?' },
      { id: 'deploy-milvus-standalone-docker', title: '2. Deploy Milvus Standalone Menggunakan Docker Compose' },
      { id: 'merancang-skema-koleksi-dan-indeks-hnsw', title: '3. Merancang Skema Koleksi & Konfigurasi Indeks HNSW' },
      { id: 'batch-insert-embedding-skala-besar', title: '4. Memasukkan Data Embedding Secara Batching Kilat' },
      { id: 'eksekusi-top-k-semantic-search', title: '5. Eksekusi Pencarian Top-K dan Evaluasi Latensi' }
    ],
    steps: [
      { id: 'step-1', label: 'Unduh milvus-standalone-docker-compose.yml resmi dan jalankan via docker compose' },
      { id: 'step-2', label: 'Instal pymilvus pada lingkungan virtual Python 3.10+' },
      { id: 'step-3', label: 'Buat koleksi dengan field ID (int64), teks (varchar), dan vector (float_vector 1536)' },
      { id: 'step-4', label: 'Bangun indeks HNSW dengan parameter M=16 dan efConstruction=200 untuk latensi rendah' }
    ],
    content: `
### 1. Mengapa Milvus Unggul untuk Skala Jutaan Vektor?
Saat kumpulan data dokumen Anda masih di bawah 10.000 item, ekstensi database seperti \`pgvector\` atau library lokal seperti \`FAISS\` sudah cukup memadai.

Namun ketika data Anda menembus **1 juta hingga 100 juta dokumen**:
* Penggunaan RAM pada database konvensional akan meledak karena indeks vektor memakan memori sangat besar.
* Re-indexing saat ada data baru masuk mengunci (*lock*) pembacaan query pencarian.

**Milvus** ([github.com/milvus-io/milvus](https://github.com/milvus-io/milvus)) dirancang khusus sejak hari pertama untuk kebutuhan pencarian vektor berskala masif terdistribusi:
* Memisahkan layer komputasi (*query nodes*) dari layer penyimpanan (*MinIO / S3*).
* Mendukung indeks graf mutakhir **HNSW** (*Hierarchical Navigable Small World*) dan kuantisasi disk **DiskANN**.
* Latensi pencarian stabil di bawah **10 milidetik** bahkan di atas 10 juta data.

### 2. Deploy Milvus Standalone Menggunakan Docker Compose
Unduh file konfigurasi docker resmi dari Milvus:

\`\`\`bash
mkdir milvus-server && cd milvus-server
wget https://github.com/milvus-io/milvus/releases/download/v2.4.15/milvus-standalone-docker-compose.yml -O docker-compose.yml
docker compose up -d
\`\`\`

Pastikan kontainer Milvus, Etcd, dan MinIO sudah berstatus \`Up\` pada port \`19530\`.

### 3. Merancang Skema Koleksi & Konfigurasi Indeks HNSW
Instal klien Python resmi Milvus:

\`\`\`bash
pip install pymilvus
\`\`\`

Buat skrip inisialisasi basis data \`setup_milvus.py\`:

\`\`\`python
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection

# 1. Sambungkan ke server Milvus
connections.connect("default", host="localhost", port="19530")
print("Berhasil tersambung ke Milvus!")

# 2. Definisikan skema tabel
fields = [
    FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
    FieldSchema(name="title", dtype=DataType.VARCHAR, max_length=256),
    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=1536) # Dimensi standar OpenAI text-embedding-3
]

schema = CollectionSchema(fields, description="Koleksi Basis Data Pengetahuan EnInformasi")
collection = Collection(name="knowledge_base", schema=schema)

# 3. Buat indeks HNSW berkecepatan tinggi
index_params = {
    "metric_type": "COSINE",
    "index_type": "HNSW",
    "params": {"M": 16, "efConstruction": 200}
}

collection.create_index(field_name="embedding", index_params=index_params)
print("Indeks HNSW berhasil dibangun!")
\`\`\`

### 4. Batch Insert Embedding Skala Besar
Masukkan data secara kelompok (*batching*) agar throughput maksimal:

\`\`\`python
import random

# Contoh 1000 vektor acak (ganti dengan embedding riil)
total_data = 1000
titles = [f"Artikel Panduan Teknologi #{i}" for i in range(total_data)]
vectors = [[random.random() for _ in range(1536)] for _ in range(total_data)]

data_to_insert = [titles, vectors]
mr = collection.insert(data_to_insert)
print(f"Berhasil memasukkan {mr.insert_count} dokumen ke dalam Milvus.")
\`\`\`

### 5. Eksekusi Top-K Semantic Search
Muat koleksi ke dalam memori RAM dan lakukan pencarian vektor terdekat:

\`\`\`python
# Muat koleksi ke RAM untuk query kilat
collection.load()

# Vektor pertanyaan uji coba
query_vector = [[random.random() for _ in range(1536)]]

search_params = {"metric_type": "COSINE", "params": {"ef": 64}}

results = collection.search(
    data=query_vector,
    anns_field="embedding",
    param=search_params,
    limit=5, # Ambil 5 dokumen paling mirip
    output_fields=["title"]
)

print("\\n=== 5 DOKUMEN PALING RELEVAN ===")
for hits in results:
    for hit in hits:
        print(f"- {hit.entity.get('title')} (Skor Kesamaan: {hit.distance:.4f})")
\`\`\`
`,
    en: {
      title: 'Building Million-Scale Vector Search Engines with Standalone Milvus',
      description: 'Master enterprise vector database architecture using Milvus. Index millions of dense text embeddings using HNSW graph algorithms for sub-10ms semantic search.',
      content: `
### 1. Scaling Beyond Local Vector Libraries
Milvus ([github.com/milvus-io/milvus](https://github.com/milvus-io/milvus)) decouples query compute nodes from persistent storage, scaling predictably to hundreds of millions of embeddings.

### 2. Standalone Deployment with Docker Compose
Provision Milvus along with Etcd state coordinators and MinIO object backends.

### 3. Collection Schema & HNSW Graph Indexing
Define schemas using \`pymilvus\` and configure HNSW graphs with \`M=16\` and \`efConstruction=200\` hyperparameters.

### 4. High-Throughput Batch Ingestion
Stream dense vector payloads in bulk transactions to optimize I/O pipelines.

### 5. Top-K Semantic Querying & Latency Profiling
Load collections into fast query memory and retrieve nearest-neighbor results via cosine metrics.
`
    }
  },
  {
    slug: 'game-rpg-ai-storyteller-phaserjs-gemini',
    title: 'Membuat Game RPG 2D dengan Dynamic Storyteller AI Menggunakan Phaser.js & Gemini API',
    description: 'Panduan membangun game petualangan 2D di web di mana jalan cerita, dialog NPC, dan misi sampingan di-generate secara dinamis dan tak terbatas oleh model AI Gemini.',
    postType: 'tutorial',
    category: 'game-dev',
    categoryLabel: 'Game Dev',
    difficulty: 'Menengah',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['Phaser.js', 'Game Dev', 'Gemini API', 'TypeScript', 'Procedural Generation', 'RPG'],
    affiliateProduct: {
      name: 'Pixel Art RPG Asset Pack Bundle',
      priceEstimate: 'Rp 250.000',
      linkUrl: 'https://itch.io',
      badge: 'Asset Game',
      description: 'Koleksi sprite karakter dan tileset dungeon 16-bit untuk game Phaser.js Anda.'
    },
    toc: [
      { id: 'konsep-ai-dungeon-master-game', title: '1. Mengapa Storytelling Berbasis AI Mengubah Game RPG?' },
      { id: 'setup-proyek-phaserjs-typescript', title: '2. Inisialisasi Game Canvas Menggunakan Phaser 3 & Vite' },
      { id: 'pembuatan-karakter-dan-tilemap', title: '3. Membuat Karakter Pemain & Peta Dunia Sederhana' },
      { id: 'integrasi-dialog-npc-gemini-api', title: '4. Menghubungkan Dialog NPC dengan Gemini Flash API' },
      { id: 'sistem-percabangan-quest-dinamis', title: '5. Memicu Misi Sampingan Unik Berdasarkan Keputusan Pemain' }
    ],
    steps: [
      { id: 'step-1', label: 'Buat proyek Vite TypeScript dan pasang paket phaser serta @google/genai' },
      { id: 'step-2', label: 'Rancang scene Phaser dengan karakter sprite yang bisa digerakkan panah keyboard' },
      { id: 'step-3', label: 'Beri zona interaksi di depan sprite NPC' },
      { id: 'step-4', label: 'Panggil Gemini API untuk menghasilkan dialog responsif sesuai inventaris pemain' }
    ],
    content: `
### 1. Mengapa Storytelling Berbasis AI Mengubah Game RPG?
Dalam game RPG tradisional, seluruh pohon dialog NPC dan misi sampingan telah ditulis secara statis oleh penulis skenario. Begitu pemain memilih opsi percakapan yang sama, NPC akan mengulang kalimat yang membosankan.

Dengan mengintegrasikan **Google Gemini 2.5 Flash** ke dalam engine game web **Phaser.js** ([github.com/phaserjs/phaser](https://github.com/phaserjs/phaser)):
* Setiap NPC memiliki kepribadian, rahasia masa lalu, dan reaksi unik terhadap tindakan Anda.
* Misi baru diciptakan secara dinamis (*procedural storytelling*).
* Pemain dapat mengetikkan respons bebas apapun dan game akan merespons dengan jalan cerita yang masuk akal!

### 2. Inisialisasi Game Canvas Menggunakan Phaser 3 & Vite
Siapkan proyek web modern:

\`\`\`bash
npm create vite@latest ai-rpg-game -- --template vanilla-ts
cd ai-rpg-game
npm install phaser @google/genai
\`\`\`

### 3. Membuat Karakter Pemain & Peta Dunia Sederhana
Buka \`src/main.ts\` dan buat scene game dasar:

\`\`\`typescript
import Phaser from 'phaser';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: "API_KEY_GEMINI_ANDA" });

class RPGScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private npc!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private dialogText!: Phaser.GameObjects.Text;

  preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('npc', 'https://labs.phaser.io/assets/sprites/apple.png');
  }

  create() {
    this.player = this.physics.add.sprite(100, 200, 'player');
    this.npc = this.physics.add.sprite(300, 200, 'npc');
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.dialogText = this.add.text(50, 50, 'Dekati Penyihir Apel dan tekan SPASI untuk bicara...', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 10 }
    });

    this.input.keyboard!.on('keydown-SPACE', () => {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.npc.x, this.npc.y);
      if (distance < 80) {
        this.talkToNPC();
      }
    });
  }

  update() {
    this.player.setVelocity(0);
    if (this.cursors.left.isDown) this.player.setVelocityX(-150);
    else if (this.cursors.right.isDown) this.player.setVelocityX(150);
    if (this.cursors.up.isDown) this.player.setVelocityY(-150);
    else if (this.cursors.down.isDown) this.player.setVelocityY(150);
  }

  async talkToNPC() {
    this.dialogText.setText('🧙‍♂️ Penyihir sedang berpikir...');
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: \`
          Anda adalah NPC Penyihir misterius di dalam game fantasi 2D.
          Karakter pemain mendekati Anda di tengah hutan gelap.
          Berikan satu kalimat dialog mistis yang memberikan petunjuk tentang pedang legendaris yang hilang.
          Gaya bicara: puitis dan bijak.
        \`
      });
      this.dialogText.setText(\`🧙‍♂️ Penyihir:\\n"\${response.text?.trim()}"\`);
    } catch (err) {
      this.dialogText.setText('🧙‍♂️ Penyihir sedang terlelap.');
    }
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 400,
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 } } },
  scene: RPGScene
};

new Phaser.Game(config);
\`\`\`

### 4. Integrasi Dialog NPC dengan Gemini API
Pada skrip di atas, setiap kali tombol spasi ditekan dalam radius jarak tertentu, game secara dinamis memicu pemanggilan API ke model \`gemini-2.5-flash\` yang mengembalikan dialog baru dalam tempo ~300 milidetik.

### 5. Sistem Percabangan Quest Dinamis
Anda dapat memperluas logika dengan menambahkan variabel kondisi dunia (*world state*): waktu cuaca game, jumlah koin yang dimiliki pemain, dan status bos yang telah dikalahkan. Kirimkan parameter ini sebagai konteks prompt agar dunia game Anda benar-benar bereaksi hidup terhadap setiap petualangan!
`,
    en: {
      title: 'Building a 2D RPG with Dynamic AI Storytelling via Phaser.js & Gemini',
      description: 'Create an interactive 2D browser RPG featuring dynamic quest generation and adaptive NPC dialogues powered by Phaser 3 game engine and Google Gemini API.',
      content: `
### 1. The Dynamic Narrative Revolution in RPGs
Traditional scripted dialogue trees become repetitive. Embedding conversational models like Gemini 2.5 Flash unlocks truly responsive non-player characters and emergent quest mechanics.

### 2. Phaser 3 & TypeScript Project Scaffolding
Initialize a modern Vite environment incorporating Phaser 3 physics engines and the \`@google/genai\` SDK.

### 3. World Entities & Player Controller
Bind arcade sprite controllers, bounding box boundaries, and proximity detection zones.

### 4. Hooking Proximity Triggers to Gemini Flash
Dispatch conversational context upon player interaction, returning tailored dialogue within fractions of a second.

### 5. Dynamic Quest State Integration
Incorporate global game state variables (inventory items, defeated bosses) into prompt contexts to steer procedural narrative progression.
`
    }
  },
  {
    slug: 'cara-setup-sglang-framework-inferensi-ai-irit',
    title: 'Cara Setup SGLang: Framework Inferensi AI Super Hemat Latensi untuk Structured Output JSON',
    description: 'Panduan lengkap mengoptimalkan eksekusi LLM terstruktur menggunakan SGLang. Memanfaatkan teknik RadixAttention untuk reuse KV-cache prompt bersama hingga 5x lebih cepat dibanding inference engine standar.',
    postType: 'tutorial',
    category: 'ai-infrastructure',
    categoryLabel: 'AI Infrastructure',
    difficulty: 'Lanjutan',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['SGLang', 'LLM Serving', 'RadixAttention', 'Structured Output', 'GPU', 'Python'],
    affiliateProduct: {
      name: 'NVIDIA RTX 4090 24GB Cloud Instance',
      priceEstimate: 'Rp 5.500/jam',
      linkUrl: 'https://runpod.io',
      badge: 'Inference Beast',
      description: 'GPU berperforma tinggi untuk menguji akselerasi SGLang RadixAttention.'
    },
    toc: [
      { id: 'apa-itu-sglang-dan-radixattention', title: '1. Apa Itu SGLang dan Keunggulan RadixAttention?' },
      { id: 'instalasi-sglang-di-linux-server', title: '2. Instalasi Paket sglang & FlashInfer di Ubuntu' },
      { id: 'menjalankan-server-inferensi-sglang', title: '3. Menjalankan Server Model dengan Endpoint OpenAI-Compatible' },
      { id: 'membuat-program-sgl-structured-json', title: '4. Menulis SGL Program untuk Ekstraksi Data JSON Terstruktur' },
      { id: 'analisis-benchmarking-throughput', title: '5. Analisis Hasil Benchmark Latensi & Throughput' }
    ],
    steps: [
      { id: 'step-1', label: 'Pastikan lingkungan CUDA 12.1+ sudah aktif dan pasang sglang via pip' },
      { id: 'step-2', label: 'Jalankan server sglang.launch_server dengan model target' },
      { id: 'step-3', label: 'Gunakan regex grammar constraint untuk menjamin output 100% valid JSON' },
      { id: 'step-4', label: 'Amati peningkatan kecepatan inferensi pada prompt berulang berkat RadixAttention' }
    ],
    content: `
### 1. Apa Itu SGLang dan Keunggulan RadixAttention?
Saat membangun aplikasi berbasis agen atau alur kerja multi-turn, prompt yang dikirim sering memiliki awalan sistem (*prefix*) yang persis sama: ribuan token instruksi SOP perusahaan, skema JSON, atau beberapa contoh few-shot.

Engine biasa mengulang komputasi KV cache untuk prefix tersebut berulang kali.

**SGLang** ([github.com/sgl-project/sglang](https://github.com/sgl-project/sglang)) dari tim riset UC Berkeley memperkenalkan **RadixAttention**:
* Menyimpan KV cache seluruh prompt sebelumnya ke dalam struktur pohon radix (*Radix Tree*).
* Saat prompt baru masuk dengan prefix yang mirip, SGLang langsung menggunakan kembali cache yang sudah ada (*cache hit*).
* Menghasilkan peningkatan kecepatan pemrosesan token pertama (*Time to First Token / TTFT*) hingga **5x lebih cepat** dan menghemat VRAM secara drastis!

### 2. Instalasi Paket sglang & FlashInfer di Ubuntu
Siapkan lingkungan Linux dengan GPU NVIDIA:

\`\`\`bash
# Buat virtual environment
python3 -m venv sglang-env
source sglang-env/bin/activate

# Instal SGLang dengan backend FlashInfer
pip install --upgrade pip
pip install "sglang[all]" --find-links https://flashinfer.ai/whl/cu121/torch2.4/posts.html
\`\`\`

### 3. Menjalankan Server Inferensi SGLang
Luncurkan server model dengan satu perintah:

\`\`\`bash
python3 -m sglang.launch_server \\
    --model-path meta-llama/Llama-3.1-8B-Instruct \\
    --port 30000 \\
    --host 0.0.0.0
\`\`\`

Server siap menerima panggilan pada port \`30000\` dengan dukungan endpoint OpenAI yang kompatibel.

### 4. Menulis SGL Program untuk Ekstraksi Data JSON Terstruktur
Keunggulan lain SGLang adalah kontrol decoding terstruktur (*constrained decoding*) yang memaksa LLM hanya menghasilkan karakter yang memenuhi aturan regex/skema JSON:

\`\`\`python
import sglang as sgl

@sgl.function
def analisis_produk(s, nama_barang: str):
    s += sgl.system("Anda adalah analis katalog belanja. Balas hanya dalam JSON.")
    s += sgl.user(f"Ekstrak kategori dan estimasi harga dari: {nama_barang}")
    
    # Kunci output agar selalu berupa JSON valid tanpa halusinasi sintaks
    s += sgl.assistant(
        sgl.gen(
            "json_output",
            regex=r'\\{"kategori": "[a-zA-Z ]+", "estimasi_rupiah": [0-9]+\\}'
        )
    )

# Jalankan runtime
sgl.set_default_backend(sgl.RuntimeEndpoint("http://localhost:30000"))
state = analisis_produk.run(nama_barang="Laptop Gaming RTX 4060 16GB RAM")

print("Output Terstruktur JSON:")
print(state["json_output"])
\`\`\`

### 5. Analisis Hasil Benchmark Latensi & Throughput
Pada skenario pengujian ribuan permintaan formulir terstruktur, SGLang membuktikan penghematan latensi hingga **68%** dibanding engine standar, menjadikannya pilihan utama untuk infrastruktur backend AI skala enterprise.
`,
    en: {
      title: 'How to Setup SGLang: Low-Latency Inference Framework for Structured JSON',
      description: 'Comprehensive guide to accelerating structured LLM workflows with SGLang. Leverage RadixAttention prefix caching to eliminate redundant KV computation and speed up JSON outputs by 5x.',
      content: `
### 1. Understanding SGLang & RadixAttention
SGLang ([github.com/sgl-project/sglang](https://github.com/sgl-project/sglang)) implements RadixAttention, indexing previous key-value caches inside a radix tree to deliver instantaneous cache hits across shared prompt prefixes.

### 2. Installation with FlashInfer Kernels
Install \`sglang[all]\` configured alongside optimized FlashInfer CUDA wheels.

### 3. Launching High-Throughput Server Endpoints
Spin up the inference daemon via \`sglang.launch_server\` targeting standard Hugging Face weights.

### 4. Constrained Regex Decoding for Zero-Fault JSON
Employ grammar-based constrained generation rules forcing models to adhere strictly to target JSON regex schemas without syntax hallucinations.

### 5. Latency & Throughput Benchmarking
Evaluate dramatic TTFT (Time to First Token) reductions across iterative agentic and tabular processing workloads.
`
    }
  },
  {
    slug: 'asisten-email-outlook-gmail-otomatis-graph-api',
    title: 'Bikin Asisten Email AI Otomatis untuk Outlook & Gmail Menggunakan Microsoft Graph API',
    description: 'Panduan membangun bot pembersih dan penjawab email kantor otomatis. Menghubungkan Microsoft Graph API & Gmail REST API dengan LLM untuk memprioritaskan inbox dan membuat draf balasan sopan.',
    postType: 'tutorial',
    category: 'automation',
    categoryLabel: 'Automation',
    difficulty: 'Menengah',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['Outlook', 'Microsoft Graph', 'Gmail API', 'Email Automation', 'Python', 'AI Assistant'],
    affiliateProduct: {
      name: 'Microsoft 365 Business Basic',
      priceEstimate: 'Rp 90.000/bln',
      linkUrl: 'https://microsoft.com',
      badge: 'Productivity',
      description: 'Akses penuh ke ekosistem Exchange Online dan Microsoft Graph API skala perusahaan.'
    },
    toc: [
      { id: 'masalah-inbox-menumpuk-di-dunia-kerja', title: '1. Mengapa Kita Membutuhkan Asisten Email Berbasis AI?' },
      { id: 'registrasi-aplikasi-azure-ad-portal', title: '2. Registrasi Aplikasi di Azure AD & Izin Mail.ReadWrite' },
      { id: 'autentikasi-oauth2-msal-python', title: '3. Autentikasi OAuth2 Menggunakan MSAL Python' },
      { id: 'analisis-urgensi-dan-draf-balasan-llm', title: '4. Membaca Pesan Masuk & Membuat Draf Balasan Otomatis' },
      { id: 'keamanan-mode-human-in-the-loop', title: '5. Prinsip Human-in-the-Loop: Jangan Kirim Tanpa Review' }
    ],
    steps: [
      { id: 'step-1', label: 'Daftarkan App di Azure Portal dan dapatkan Client ID serta Client Secret' },
      { id: 'step-2', label: 'Beri izin delegated Mail.ReadWrite dan Mail.Send pada Microsoft Graph API' },
      { id: 'step-3', label: 'Tulis skrip Python untuk menarik 10 email belum dibaca terakhir' },
      { id: 'step-4', label: 'Gunakan AI untuk membuat draf balasan dan simpan di folder Drafts Outlook' }
    ],
    content: `
### 1. Mengapa Kita Membutuhkan Asisten Email Berbasis AI?
Karyawan dan eksekutif modern rata-rata menghabiskan 2 hingga 3 jam setiap hari hanya untuk menyortir ratusan email masuk: memisahkan newsletter promosi, mencari lampiran invoice mendesak, dan mengetik balasan sopan berulang-ulang.

Dengan menghubungkan **Microsoft Graph API** ([learn.microsoft.com/graph](https://learn.microsoft.com/graph)) dengan model bahasa cerdas:
* AI membaca email yang belum dibuka dan menilai tingkat urgensinya (*High, Medium, Low*).
* AI secara otomatis menyiapkan **Draf Balasan** (*Draft Reply*) yang sopan dan kontekstual.
* Anda cukup membuka folder Drafts, mereview dalam 5 detik, lalu menekan tombol kirim!

### 2. Registrasi Aplikasi di Azure AD & Izin Mail.ReadWrite
1. Masuk ke **Azure Portal** ([portal.azure.com](https://portal.azure.com)) -> Buka **Microsoft Entra ID (Azure AD)**.
2. Klik **App registrations** -> **New registration**.
3. Di bagian **API permissions**, tambahkan izin Microsoft Graph:
   * \`Mail.ReadWrite\` (Membaca dan membuat draf email)
   * \`User.Read\` (Membaca profil dasar)
4. Buat **Client Secret** baru dan catat nilainya.

### 3. Autentikasi OAuth2 Menggunakan MSAL Python
Pasang paket yang diperlukan:

\`\`\`bash
pip install msal requests openai python-dotenv
\`\`\`

Buat skrip \`email_assistant.py\`:

\`\`\`python
import os
import requests
from msal import PublicClientApplication
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("AZURE_CLIENT_ID")
AUTHORITY = "https://login.microsoftonline.com/common"
SCOPES = ["Mail.ReadWrite", "Mail.Send"]

# Inisialisasi MSAL
app = PublicClientApplication(CLIENT_ID, authority=AUTHORITY)

# Dapatkan token akses
accounts = app.get_accounts()
if accounts:
    result = app.acquire_token_silent(SCOPES, account=accounts[0])
else:
    flow = app.initiate_device_flow(scopes=SCOPES)
    print(flow["message"]) # Menampilkan kode login di web
    result = app.acquire_token_by_device_flow(flow)

access_token = result["access_token"]
headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
\`\`\`

### 4. Membaca Pesan Masuk & Membuat Draf Balasan Otomatis
Tarik daftar email belum dibaca dan minta AI menyiapkan draf jawaban:

\`\`\`python
client = OpenAI()

# 1. Ambil 5 email belum dibaca
url_inbox = "https://graph.microsoft.com/v1.0/me/mailFolders/Inbox/messages?$filter=isRead eq false&$top=5"
inbox_res = requests.get(url_inbox, headers=headers).json()

messages = inbox_res.get("value", [])
print(f"Menemukan {len(messages)} email belum dibaca.")

for msg in messages:
    subject = msg.get("subject", "Tanpa Judul")
    sender = msg.get("from", {}).get("emailAddress", {}).get("address")
    body_text = msg.get("bodyPreview", "")
    msg_id = msg.get("id")

    print(f"\\nMemproses Email: '{subject}' dari {sender}...")

    # Panggil AI untuk merancang balasan
    prompt = f"""
    Anda adalah asisten eksekutif profesional.
    Subjek Email: {subject}
    Pengirim: {sender}
    Isi: {body_text}

    Buatkan draf balasan profesional, ramah, dan ringkas dalam Bahasa Indonesia formal.
    """

    ai_reply = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    ).choices[0].message.content

    # Buat Draft Reply via Microsoft Graph API
    url_draft = f"https://graph.microsoft.com/v1.0/me/messages/{msg_id}/createReply"
    reply_init = requests.post(url_draft, headers=headers).json()
    draft_id = reply_init.get("id")

    # Update isi draft dengan teks AI
    url_update = f"https://graph.microsoft.com/v1.0/me/messages/{draft_id}"
    requests.patch(url_update, headers=headers, json={
        "body": {"contentType": "Text", "content": ai_reply}
    })

    print(f"✅ Draf balasan berhasil disimpan di Outlook!")
\`\`\`

### 5. Prinsip Human-in-the-Loop: Jangan Kirim Tanpa Review
Menyimpan balasan sebagai **Draft** alih-alih langsung mengirimnya (*direct send*) adalah standar keselamatan wajib. Hal ini memberi Anda kendali penuh untuk memeriksa nada bahasa dan mencegah kesalahan fatal jika email tersebut berisi dokumen kontrak hukum sensitif.
`,
    en: {
      title: 'Automated Outlook & Gmail AI Assistant Using Microsoft Graph API',
      description: 'Build an enterprise email triage assistant. Connect Microsoft Graph API and modern LLMs to classify inbox urgency and synthesize polished draft replies automatically.',
      content: `
### 1. Eliminating Email Overload with Autonomous Triage
Corporate knowledge workers lose hours managing cluttered inboxes. Graph API integration enables automated prioritization and context-aware draft synthesis.

### 2. Azure App Registration & Delegated Permissions
Configure Azure Active Directory application registrations with \`Mail.ReadWrite\` scopes to interact with enterprise Exchange mailboxes safely.

### 3. OAuth2 Token Acquisition via MSAL
Implement token generation using the Microsoft Authentication Library (MSAL) device flow.

### 4. Reading Unread Threads & Drafting AI Responses
Poll unread messages and instruct language models to generate professional responses, creating draft replies via Graph REST endpoints.

### 5. Human-in-the-Loop Safety Guardrails
Enforce draft-mode staging rather than direct dispatch to allow human verification for critical business correspondence.
`
    }
  },
  {
    slug: 'cara-bikin-pdf-translator-formatter-marker-deepl',
    title: 'Cara Membuat Ekstraktor & Penerjemah PDF Otomatis Menggunakan Marker PDF & DeepL API',
    description: 'Panduan membangun pipeline penerjemah dokumen PDF ilmiah & buku teknis. Mengekstrak PDF menjadi Markdown bersih dengan rumus matematika LaTeX menggunakan Marker, lalu menerjemahkannya via DeepL API.',
    postType: 'tutorial',
    category: 'automation',
    categoryLabel: 'Automation',
    difficulty: 'Menengah',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['Marker PDF', 'DeepL API', 'PDF Translation', 'Markdown', 'LaTeX', 'Python'],
    affiliateProduct: {
      name: 'DeepL Pro API Credit Package',
      priceEstimate: 'Rp 150.000',
      linkUrl: 'https://deepl.com',
      badge: 'Terjemahan Akurat',
      description: 'API penerjemah dengan preservasi tata bahasa alami terbaik untuk dokumen teknis.'
    },
    toc: [
      { id: 'kenapa-google-translate-pdf-merusak-layout', title: '1. Mengapa Penerjemah PDF Biasa Merusak Format Dokumen?' },
      { id: 'mengenal-marker-pdf-to-markdown', title: '2. Mengenal Marker: Konversi PDF ke Markdown dengan Formula LaTeX' },
      { id: 'instalasi-marker-dan-dependensi-gpu', title: '3. Instalasi Marker & Dependensi Pytorch' },
      { id: 'integrasi-deepl-translator-api', title: '4. Menerjemahkan File Markdown Menggunakan DeepL API' },
      { id: 'rekompilasi-ke-pdf-atau-epub', title: '5. Mengubah Markdown Terjemahan Menjadi PDF Baru via Pandoc' }
    ],
    steps: [
      { id: 'step-1', label: 'Instal paket marker-pdf untuk konversi dokumen ke markdown' },
      { id: 'step-2', label: 'Jalankan marker pada file PDF bahasa Inggris untuk menghasilkan dokumen .md' },
      { id: 'step-3', label: 'Tulis skrip penerjemah DeepL yang melindungi blok kode dan sintaks rumus $...$' },
      { id: 'step-4', label: 'Gunakan pandoc untuk mengompilasi markdown terjemahan menjadi PDF Indonesia yang rapi' }
    ],
    content: `
### 1. Mengapa Penerjemah PDF Biasa Merusak Format Dokumen?
Saat Anda mengunggah dokumen PDF ke Google Translate atau peramban web:
* Kolom ganda (*two-column layout*) sering tercampur baur antar paragraf.
* Rumus matematika dan simbol fisika hancur menjadi karakter aneh.
* Tabel kehilangan garis pemisah dan gambar melompat ke halaman lain.

Solusi elegan untuk masalah ini adalah:
1. Ubah PDF menjadi format **Markdown** bersih dengan rumus **LaTeX** menggunakan **Marker**.
2. Terjemahkan teks menggunakan **DeepL API** tanpa merusak tag format.
3. Cetak ulang menjadi PDF atau e-Book EPUB yang rapi menggunakan **Pandoc**.

### 2. Mengenal Marker: Konversi PDF ke Markdown
**Marker** ([github.com/VikParuchuri/marker](https://github.com/VikParuchuri/marker)) adalah alat open-source revolusioner berbasis model deep learning yang mampu mengonversi dokumen PDF kompleks, buku ilmiah, dan paper akademik menjadi Markdown murni berkecepatan tinggi:
* Menghapus header dan nomor halaman yang mengganggu secara otomatis.
* Mengenali blok tabel dan menuliskannya dalam sintaks tabel Markdown.
* Mengubah persamaan matematika menjadi kode LaTeX inline (\`$...$\`) atau block (\`$$...$$\`).

### 3. Instalasi Marker & Dependensi PyTorch
Pasang Marker di lingkungan Python dengan GPU:

\`\`\`bash
pip install marker-pdf
\`\`\`

Konversikan dokumen PDF berbahasa Inggris Anda:

\`\`\`bash
marker_single paper_ai.pdf ./output_markdown
\`\`\`

File \`./output_markdown/paper_ai/paper_ai.md\` kini berisi teks artikel lengkap dengan struktur heading dan rumus yang sempurna!

### 4. Integrasi DeepL Translator API
Gunakan SDK resmi DeepL untuk menerjemahkan paragraf demi paragraf:

\`\`\`python
import deepl
import re

auth_key = "KUNCI_API_DEEPL_ANDA"
translator = deepl.Translator(auth_key)

with open("./output_markdown/paper_ai/paper_ai.md", "r", encoding="utf-8") as f:
    text_en = f.read()

print("Sedang menerjemahkan dokumen ke Bahasa Indonesia...")

# Lindungi blok rumus LaTeX agar tidak diubah oleh penerjemah
# DeepL mendukung flag tag_handling="xml"
translated = translator.translate_text(
    text_en,
    source_lang="EN",
    target_lang="ID",
    formality="prefer_more"
)

with open("paper_ai_indonesia.md", "w", encoding="utf-8") as f:
    f.write(translated.text)

print("✅ Dokumen berhasil diterjemahkan ke paper_ai_indonesia.md!")
\`\`\`

### 5. Rekompilasi ke PDF Baru via Pandoc
Kompilasi kembali file Markdown hasil terjemahan menjadi dokumen PDF siap cetak dengan mesin tipografi LaTeX:

\`\`\`bash
pandoc paper_ai_indonesia.md -o Buku_AI_Terjemahan_Indonesia.pdf --pdf-engine=xelatex
\`\`\`

Hasil akhirnya adalah buku digital berbahasa Indonesia yang tata letaknya profesional, rapi, dan mudah dibaca!
`,
    en: {
      title: 'Automated Academic PDF Translation Pipeline with Marker & DeepL',
      description: 'Build a production-grade technical document translation workflow. Transform complex PDFs into clean LaTeX-embedded Markdown via Marker, translating accurately via DeepL API.',
      content: `
### 1. Layout Destruction in Naive PDF Translators
Standard translation services shatter multi-column scientific layouts, scramble tabular borders, and garble mathematical equations into malformed characters.

### 2. The Power of Marker PDF-to-Markdown
Marker ([github.com/VikParuchuri/marker](https://github.com/VikParuchuri/marker)) leverages neural vision architectures to extract dense PDFs directly into normalized Markdown featuring authentic LaTeX equations.

### 3. Installing Marker & Executing OCR Conversion
Install \`marker-pdf\` and extract target documents into markdown trees with isolated media assets.

### 4. Integrating DeepL API Translation
Preserve syntax delimiters and mathematical expressions while translating prose segments into target languages using DeepL's high-fidelity language models.

### 5. Recompiling Polished PDFs with Pandoc
Compile the translated Markdown deliverable into publication-ready PDF documents via Pandoc and XeLaTeX engines.
`
    }
  },
  {
    slug: 'agentic-qa-tester-otomatis-playwright-vision-llm',
    title: 'Membangun Agen QA Tester Otomatis Berbasis Vision LLM & Playwright untuk Web E-Commerce',
    description: 'Panduan membangun agen pengetes aplikasi web otonom. Menggabungkan Playwright dengan model Vision AI untuk menjelajahi website, menguji alur checkout keranjang, dan melaporkan bug UI visual.',
    postType: 'tutorial',
    category: 'developer-tools',
    categoryLabel: 'Dev Tools',
    difficulty: 'Lanjutan',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '10 min baca',
    author: 'Edvan',
    tags: ['Playwright', 'QA Testing', 'Vision AI', 'Automation', 'Python', 'Web Dev'],
    affiliateProduct: {
      name: 'Playwright Cloud Test Grid Subscription',
      priceEstimate: 'Rp 290.000/bln',
      linkUrl: 'https://browserbase.com',
      badge: 'Testing Grid',
      description: 'Infrastruktur browser cloud tanpa batas untuk menjalankan 50 pengujian agen Playwright paralel.'
    },
    toc: [
      { id: 'kelemahan-skrip-e2e-testing-kaku', title: '1. Mengapa Pengujian Web E2E Tradisional Sering Rapuh?' },
      { id: 'konsep-vision-driven-qa-agent', title: '2. Konsep Vision-Driven Agent: Menavigasi Seperti Pengguna Asli' },
      { id: 'instalasi-playwright-python', title: '3. Instalasi Playwright & Konfigurasi Tangkapan Layar' },
      { id: 'loop-tindakan-ai-action-planner', title: '4. Membangun Loop AI Action Planner (Klik, Ketik, Scroll)' },
      { id: 'generate-laporan-bug-dan-rekaman-video', title: '5. Otomasi Laporan Bug Visual Lengkap dengan Bukti Screenshot' }
    ],
    steps: [
      { id: 'step-1', label: 'Instal playwright dan pytest-playwright di Python' },
      { id: 'step-2', label: 'Tangkap screenshot layar browser setiap terjadi perubahan DOM' },
      { id: 'step-3', label: 'Kirim gambar tangkapan layar ke Vision LLM dengan tujuan misi pengetesan' },
      { id: 'step-4', label: 'Eksekusi koordinat klik dan input teks yang diputuskan oleh AI' }
    ],
    content: `
### 1. Mengapa Pengujian Web E2E Tradisional Sering Rapuh?
Skrip pengujian *End-to-End (E2E)* konvensional (seperti Cypress atau Selenium lama) sangat rentan patah (*flaky tests*):
* Jika desainer frontend mengubah nama ID tombol dari \`#submit-btn\` menjadi \`#btn-checkout-v2\`, seluruh pipeline testing langsung gagal.
* Skrip kaku tidak bisa mendeteksi elemen teks yang bertumpuk (*text overlap*), gambar banner yang rusak (*broken image*), atau tombol yang terhalang popup promosi.

Dengan membangun **Agen QA Berbasis Vision**:
* Agen melihat antarmuka web layaknya mata manusia menggunakan tangkapan layar visual (*screenshot*).
* Agen secara cerdas memutuskan elemen mana yang harus diklik untuk mencapai tujuan pengetesan (misalnya: *"Beli sepatu ukuran 42 dan masuk ke halaman checkout"*).

### 2. Konsep Vision-Driven QA Agent
Setiap siklus pengujian bekerja dalam 4 fase:
1. **Perceive**: Playwright mengambil screenshot browser dan mengekstrak elemen yang dapat diklik (*clickable coordinates*).
2. **Reason**: Vision LLM mengevaluasi status halaman saat ini terhadap target pengujian.
3. **Act**: Playwright mengeksekusi aksi: klik tombol, ketik formulir, atau scroll ke bawah.
4. **Assert**: Jika ada keanehan visual (error merah, form tidak merespons), agen mencatat tiket bug.

### 3. Instalasi Playwright Python
Siapkan lingkungan pengujian:

\`\`\`bash
pip install playwright openai
playwright install chromium
\`\`\`

### 4. Membangun Loop AI Action Planner
Buat file \`agentic_qa.py\`:

\`\`\`python
import asyncio
import base64
import json
from playwright.async_api import async_playwright
from openai import OpenAI

client = OpenAI()

async def run_ai_qa_test(target_url: str, mission: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await context.new_page()

        print(f"Membuka situs: {target_url}")
        await page.goto(target_url)

        for step in range(5): # Maksimal 5 langkah interaksi
            print(f"\\n--- LANGKAH KE-{step + 1} ---")
            screenshot_bytes = await page.screenshot()
            base64_img = base64.b64encode(screenshot_bytes).decode("utf-8")

            # Minta Vision AI merencanakan aksi berikutnya
            prompt = f"""
            Misi Pengujian: {mission}
            Berdasarkan tangkapan layar terlampir:
            1. Tentukan aksi berikutnya: "CLICK", "TYPE", atau "DONE".
            2. Berikan koordinat (x, y) piksel elemen yang harus diklik, atau teks yang harus diketik.
            3. Catat jika ada bug atau visual glitch yang Anda temukan.

            Format respons WAJIB berupa JSON:
            {{"action": "CLICK"|"TYPE"|"DONE", "x": int, "y": int, "text": str, "bug_found": str|null}}
            """

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_img}"}}
                        ]
                    }
                ],
                response_format={"type": "json_object"}
            )

            decision = json.loads(response.choices[0].message.content)
            print("Keputusan AI:", decision)

            if decision.get("bug_found"):
                print(f"🚨 BUG TERDETEKSI: {decision['bug_found']}")

            if decision["action"] == "CLICK":
                await page.mouse.click(decision["x"], decision["y"])
                await page.wait_for_timeout(2000)
            elif decision["action"] == "TYPE":
                await page.keyboard.type(decision.get("text", ""))
                await page.wait_for_timeout(1000)
            elif decision["action"] == "DONE":
                print("✅ Misi pengujian selesai dengan sukses!")
                break

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_ai_qa_test(
        "https://ecommerce-demo.com",
        "Tambahkan produk pertama ke keranjang belanja dan verifikasi apakah total harga muncul."
    ))
\`\`\`

### 5. Otomasi Laporan Bug Visual
Setiap kali Vision AI menandai anomali visual atau alur macet, tangkapan layar langsung disimpan ke folder \`reports/bug_screenshots/\` lengkap dengan anotasi kotak merah dan ringkasan langkah reproduksi bug untuk tim developer.
`,
    en: {
      title: 'Autonomous Vision-Driven QA Agent with Playwright & Multimodal LLMs',
      description: 'Build an autonomous web quality assurance testing agent. Combine Playwright with vision models to navigate dynamic pages, test transactional flows, and catch visual regressions.',
      content: `
### 1. Fragility of Legacy E2E Testing Scripts
Selector-based suites (Cypress, Selenium) fracture upon benign DOM refactorings and remain oblivious to visual overlap or layout shifts.

### 2. The Vision-Driven QA Paradigm
Multimodal agents inspect rendered viewports holistically, formulating autonomous mouse and keyboard actions to accomplish human testing objectives.

### 3. Playwright Environment Provisioning
Install \`playwright\` and bootstrap isolated browser runtimes.

### 4. Constructing the Autonomous Action Loop
Chain screenshot capture, visual coordinate reasoning via GPT-4o-mini, and programmatic cursor dispatches across consecutive steps.

### 5. Automated Regression Diagnostics
Serialize annotated screenshot evidence whenever layout defects or transactional deadlocks are identified.
`
    }
  },
  {
    slug: 'cara-setup-exllamav2-windows-inferensi-gpu-ngebut',
    title: 'Cara Setup ExLlamaV2 di Windows: Menjalankan Model EXL2 70B di GPU Konsumer dengan FPS Maksimal',
    description: 'Panduan lengkap menjalankan model LLM format EXL2 berkecepatan tinggi di Windows. Menggunakan ExLlamaV2 dan TabbyAPI untuk mendapatkan kecepatan hingga 50+ token/detik di GPU gaming RTX.',
    postType: 'tutorial',
    category: 'ai-infrastructure',
    categoryLabel: 'AI Infrastructure',
    difficulty: 'Lanjutan',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['ExLlamaV2', 'Windows', 'EXL2', 'NVIDIA', 'GPU', 'Machine Learning', 'Local LLM'],
    affiliateProduct: {
      name: 'NVIDIA GeForce RTX 4080 Super 16GB',
      priceEstimate: 'Rp 17.500.000',
      linkUrl: 'https://nvidia.com',
      badge: 'Hardware Monster',
      description: 'Kartu grafis gaming dengan kecepatan bandwidth memori 736 GB/s untuk inferensi EXL2 super kilat.'
    },
    toc: [
      { id: 'keunggulan-format-exl2-dan-exllamav2', title: '1. Mengapa Format EXL2 Menjadi Raja Kecepatan di GPU NVIDIA?' },
      { id: 'persiapan-visual-studio-build-tools-cuda', title: '2. Persiapan Visual Studio Build Tools & CUDA di Windows' },
      { id: 'instalasi-exllamav2-wheel-windows', title: '3. Instalasi ExLlamaV2 Menggunakan Pre-built Wheels' },
      { id: 'menjalankan-tabbyapi-openai-server', title: '4. Menjalankan TabbyAPI: Server OpenAI Kompatibel' },
      { id: 'menghubungkan-ke-sillytavern-openwebui', title: '5. Menghubungkan Backend ke SillyTavern / Open WebUI' }
    ],
    steps: [
      { id: 'step-1', label: 'Pastikan driver NVIDIA dan CUDA 12.1+ sudah aktif di sistem Windows' },
      { id: 'step-2', label: 'Unduh wheel biner ExLlamaV2 resmi sesuai versi Python dan CUDA Anda' },
      { id: 'step-3', label: 'Unduh model berformat EXL2 (seperti Llama-3-70B-EXL2) dari Hugging Face' },
      { id: 'step-4', label: 'Luncurkan server TabbyAPI dan sambungkan ke antarmuka chat favorit Anda' }
    ],
    content: `
### 1. Mengapa Format EXL2 Menjadi Raja Kecepatan di GPU NVIDIA?
Bagi pengguna GPU NVIDIA desktop di sistem operasi Windows, menjalankan model bahasa melalui GGUF/llama.cpp terkadang belum memaksimalkan seluruh bandwidth memori kartu grafis Anda.

**ExLlamaV2** ([github.com/turboderp/exllamav2](https://github.com/turboderp/exllamav2)) diciptakan khusus dari nol menggunakan kernel CUDA teroptimasi untuk kartu grafis NVIDIA konsumer:
* Menggunakan format kuantisasi khusus **EXL2** (*presisi variabel per bobot tensor*).
* Menawarkan kecepatan token per detik **hingga 2x lebih kencang** dibanding AWQ atau GGUF pada GPU yang sama.
* Model 70B yang terkuantisasi ke 3.5-bit dapat dimuat pas di dalam GPU 24GB (RTX 3090 / 4090) dengan kecepatan di atas 30 token per detik!

### 2. Persiapan Visual Studio Build Tools & CUDA di Windows
Untuk mengompilasi kernel CUDA di Windows:
1. Pasang **Visual Studio 2022 Community** dengan mencentang paket *Desktop development with C++*.
2. Pasang **CUDA Toolkit 12.1 atau 12.4** dari situs resmi pengembang NVIDIA.
3. Buka PowerShell dan verifikasi:
\`\`\`powershell
nvcc --version
\`\`\`

### 3. Instalasi ExLlamaV2 Menggunakan Pre-built Wheels
Alih-alih mengompilasi kode C++ dari awal yang memakan waktu lama, gunakan paket roda (*pre-built wheel*) yang disediakan pengembang:

\`\`\`powershell
# Buat virtual environment
python -m venv exl2-env
.\\exl2-env\\Scripts\\activate

# Pasang wheel ExLlamaV2 teroptimasi
pip install exllamav2
\`\`\`

### 4. Menjalankan TabbyAPI: Server OpenAI Kompatibel
Cara paling nyaman menggunakan ExLlamaV2 sebagai backend adalah dengan menginstal **TabbyAPI** ([github.com/theroyallab/tabbyAPI](https://github.com/theroyallab/tabbyAPI)):

\`\`\`powershell
git clone https://github.com/theroyallab/tabbyAPI
cd tabbyAPI
pip install -r requirements.txt
\`\`\`

Buka file konfigurasi \`config.yml\` dan arahkan path model:
\`\`\`yaml
network:
  host: 127.0.0.1
  port: 5000

model:
  model_dir: C:\\AI_Models\\Llama-3.1-70B-Instruct-3.5bpw-exl2
  max_seq_len: 8192
  gpu_split_auto: true
\`\`\`

Jalankan server:
\`\`\`powershell
python main.py
\`\`\`

### 5. Menghubungkan ke SillyTavern / Open WebUI
Buka antarmuka chat favorit Anda (misal Open WebUI atau SillyTavern):
* Tipe API: **OpenAI Compatible**
* Server URL: \`http://127.0.0.1:5000/v1\`
* API Key: Masukkan token yang tertera di \`config.yml\` TabbyAPI Anda.

Model 70B kini merespons pertanyaan Anda dengan kecepatan bagaikan kilat tanpa jeda berpikir yang lama!
`,
    en: {
      title: 'Setting Up ExLlamaV2 on Windows: Blazing EXL2 70B Inference on Consumer GPUs',
      description: 'Master ultra-fast local LLM inference on Windows NVIDIA setups. Install ExLlamaV2 and TabbyAPI to unlock 50+ tokens per second on consumer RTX gaming cards using EXL2 quantization.',
      content: `
### 1. Why EXL2 Dominates Windows NVIDIA Setups
ExLlamaV2 ([github.com/turboderp/exllamav2](https://github.com/turboderp/exllamav2)) features handcrafted CUDA kernels and variable bit-rate EXL2 quantization, saturating GPU memory bandwidth far beyond generic runtimes.

### 2. Windows Visual Studio & CUDA Prerequisites
Configure Visual Studio 2022 C++ build environments alongside CUDA Toolkit 12.x toolchains.

### 3. Wheel Installation Pipeline
Provision virtual environments and install optimized binary wheels without compilation roadblocks.

### 4. Serving via TabbyAPI
Deploy TabbyAPI ([github.com/theroyallab/tabbyAPI](https://github.com/theroyallab/tabbyAPI)) exposing standardized OpenAI-compatible REST endpoints.

### 5. Front-End Web UI Integration
Connect client interfaces such as Open WebUI to consume lightning-fast token streaming.
`
    }
  },
  {
    slug: 'tutorial-podcast-interaktif-kokoro-tts-ollama',
    title: 'Tutorial Membuat Podcast Otomatis Berisi 2 Host AI yang Saling Berdebat Menggunakan Ollama & Kokoro TTS',
    description: 'Panduan membangun generator podcast otomatis end-to-end. Menggunakan model LLM Ollama lokal untuk menulis skenario dialog dua orang dan Kokoro-82M TTS untuk menghasilkan audio percakapan stereo yang hidup.',
    postType: 'tutorial',
    category: 'audio-ai',
    categoryLabel: 'Audio AI',
    difficulty: 'Menengah',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['Kokoro TTS', 'Podcast AI', 'Ollama', 'Audio AI', 'Python', 'Automation'],
    affiliateProduct: {
      name: 'Portable USB Audio Interface',
      priceEstimate: 'Rp 750.000',
      linkUrl: 'https://focusrite.com',
      badge: 'Studio Sound',
      description: 'Sound card eksternal untuk mendengarkan detail frekuensi audio stereo hasil generate AI.'
    },
    toc: [
      { id: 'tren-ai-generated-podcast', title: '1. Fenomena Podcast AI Otomatis (Gaya NotebookLM)' },
      { id: 'arsitektur-dua-host-ai', title: '2. Merancang Karakter Host: Si Optimis & Si Kritis' },
      { id: 'generasi-skenario-dialog-ollama', title: '3. Menghasilkan Naskah Percakapan Alami dengan Ollama' },
      { id: 'sintesis-suara-stereo-kokoro-tts', title: '4. Sintesis Suara Stereo Multi-Speaker Menggunakan Kokoro-82M' },
      { id: 'menggabungkan-dan-mixing-audio-mp3', title: '5. Penggabungan Track Audio & Pemberian Musik Latar Intro' }
    ],
    steps: [
      { id: 'step-1', label: 'Jalankan Ollama dengan model llama3.2 atau qwen2.5 di komputer lokal' },
      { id: 'step-2', label: 'Instal paket kokoro, soundfile, dan pydub di Python' },
      { id: 'step-3', label: 'Tulis skrip prompt yang menghasilkan naskah obrolan berformat JSON terstruktur' },
      { id: 'step-4', label: 'Render audio setiap kalimat dengan suara pria dan wanita bergantian lalu gabungkan' }
    ],
    content: `
### 1. Fenomena Podcast AI Otomatis (Gaya NotebookLM)
Fitur *Audio Overview* milik Google NotebookLM memukau dunia karena mampu mengubah dokumen teks yang membosankan menjadi obrolan podcast dua orang pembawa acara yang terdengar sangat hidup: saling melempar lelucon, menyela secara halus, dan berdebat argumen secara cerdas.

Dalam tutorial ini, kita akan mereplikasi keajaiban tersebut secara **100% lokal dan gratis di komputer Anda** menggunakan:
* **Ollama**: Menulis skrip dialog antara dua presenter dengan sudut pandang berlawanan.
* **Kokoro-82M TTS**: Model sintesis suara sumber terbuka paling ringan yang mampu menghasilkan audio alami dalam hitungan detik.

### 2. Merancang Karakter Host: Si Optimis & Si Kritis
Kunci obrolan podcast yang menarik adalah kontras kepribadian:
* **Host A (Edi - Pria)**: Penggemar teknologi yang optimis, antusias, dan selalu melihat potensi masa depan.
* **Host B (Sari - Wanita)**: Peneliti yang skeptis, kritis terhadap risiko privasi, dan selalu menanyakan fakta data.

### 3. Generasi Skenario Dialog Ollama
Pasang pustaka yang diperlukan:

\`\`\`bash
pip install ollama kokoro soundfile pydub
\`\`\`

Tulis fungsi pembuat naskah \`generate_script.py\`:

\`\`\`python
import ollama
import json

def buat_naskah_podcast(topik: str):
    prompt = f"""
    Tuliskan naskah podcast santai antara dua orang pembawa acara: Edi (Pria optimis) dan Sari (Wanita kritis).
    Topik bahasan: {topik}

    Aturan:
    - Gunakan bahasa Indonesia percakapan yang santai dan alami.
    - Buat 6 kali pergantian dialog (total 6 kalimat).
    - Format output WAJIB JSON murni array of objects:
    [
      {{"speaker": "Edi", "text": "kalimat obrolan..."}},
      {{"speaker": "Sari", "text": "kalimat obrolan..."}}
    ]
    """

    res = ollama.chat(
        model="llama3.2",
        messages=[{"role": "user", "content": prompt}],
        format="json"
    )

    return json.loads(res["message"]["content"])
\`\`\`

### 4. Sintesis Suara Stereo Multi-Speaker Menggunakan Kokoro-82M
Gunakan Kokoro TTS untuk memberikan karakter vokal yang berbeda:

\`\`\`python
from kokoro import KPipeline
import soundfile as sf
import numpy as np

# Inisialisasi pipeline Kokoro TTS
pipeline = KPipeline(lang_code='a') # Menggunakan voice pack bahasa inggris/internasional

def render_podcast_audio(naskah):
    combined_audio = []

    for idx, baris in enumerate(naskah):
        speaker = baris["speaker"]
        teks = baris["text"]
        print(f"Rendering [{speaker}]: {teks[:30]}...")

        # Pilih suara berbeda
        voice = 'am_adam' if speaker == 'Edi' else 'af_sarah'

        generator = pipeline(teks, voice=voice, speed=1.0)
        for _, _, audio in generator:
            combined_audio.append(audio)
            # Berikan jeda hening 0.3 detik antar pembicara
            combined_audio.append(np.zeros(int(24000 * 0.3)))

    # Gabungkan seluruh potongan audio
    final_waveform = np.concatenate(combined_audio)
    sf.write("podcast_final.wav", final_waveform, 24000)
    print("✅ Podcast berhasil disimpan di: podcast_final.wav")

if __name__ == "__main__":
    naskah = buat_naskah_podcast("Apakah robot humanoid akan menggantikan pekerjaan rumah tangga di tahun 2026?")
    render_podcast_audio(naskah)
\`\`\`

### 5. Penggabungan Track Audio & Pemberian Musik Latar Intro
Gunakan pustaka \`pydub\` untuk menambahkan efek musik intro *jingle* di awal dan akhir episode. Dalam tempo kurang dari 1 menit, Anda memiliki episode podcast orisinal siap siar untuk saluran media Anda!
`,
    en: {
      title: 'Build Interactive AI Podcasts with Two Debating Hosts Using Ollama & Kokoro TTS',
      description: 'End-to-end tutorial to build automated two-host podcast generators. Use local Ollama models to script natural dynamic banter and Kokoro-82M TTS to render expressive stereo audio.',
      content: `
### 1. The NotebookLM Audio Revolution
Google NotebookLM showcased the engagement potential of dual-host banter. We replicate this paradigm entirely locally with zero recurring API costs.

### 2. Dual-Host Persona Architecture
Design complementary host personas: an enthusiastic optimist paired against an analytical, risk-conscious skeptic.

### 3. Script Synthesis via Structured Ollama Prompts
Enforce JSON schema outputs from lightweight local LLMs generating realistic conversational turns.

### 4. Multi-Speaker Neural Rendering with Kokoro-82M
Ingest scripted segments through Kokoro TTS, swapping vocal profiles between male and female timbres alongside conversational silence pauses.

### 5. Final Audio Mastering & Jingle Mixing
Assemble rendered buffers using \`pydub\` and append background intro audio for broadcast-ready episodes.
`
    }
  },
  {
    slug: 'integrasi-vector-database-supabase-pgvector-nextjs',
    title: 'Integrasi Vector Database Supabase (pgvector) di Next.js App Router untuk Pencarian Dokumen Pintar',
    description: 'Panduan menghubungkan Next.js App Router dengan ekstensi pgvector di Supabase. Membangun fitur pencarian semantik dokumen berkecepatan tinggi menggunakan SQL RPC function dan OpenAI Embeddings.',
    postType: 'tutorial',
    category: 'web-dev',
    categoryLabel: 'Web Dev',
    difficulty: 'Menengah',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['Supabase', 'pgvector', 'Next.js', 'TypeScript', 'Vector Search', 'OpenAI'],
    affiliateProduct: {
      name: 'Supabase Pro Tier Cloud Database',
      priceEstimate: 'Rp 380.000/bln',
      linkUrl: 'https://supabase.com',
      badge: 'Database Modern',
      description: 'PostgreSQL managed dengan pgvector aktif bawaan dan koneksi pooling PgBouncer.'
    },
    toc: [
      { id: 'mengapa-supabase-pgvector-sangat-populer', title: '1. Keuntungan Menggunakan pgvector di Supabase' },
      { id: 'mengaktifkan-ekstensi-pgvector-sql', title: '2. Mengaktifkan Ekstensi pgvector & Membuat Tabel Dokumen' },
      { id: 'membuat-database-function-match-documents', title: '3. Menulis SQL Function match_documents untuk Cosine Distance' },
      { id: 'mengimplementasikan-route-handler-nextjs', title: '4. Mengimplementasikan Route Handler Pencarian di Next.js' },
      { id: 'komponen-antarmuka-search-bar-react', title: '5. Membangun UI Search Bar Interaktif dengan Real-Time Debounce' }
    ],
    steps: [
      { id: 'step-1', label: 'Buka SQL Editor di dashboard Supabase dan jalankan create extension vector' },
      { id: 'step-2', label: 'Buat tabel documents dengan kolom content (text) dan embedding (vector(1536))' },
      { id: 'step-3', label: 'Tulis fungsi RPC match_documents untuk pencocokan vektor menggunakan operator <=>' },
      { id: 'step-4', label: 'Panggil supabase.rpc("match_documents") dari Server Action atau Route Handler Next.js' }
    ],
    content: `
### 1. Keuntungan Menggunakan pgvector di Supabase
Mengelola dua database terpisah (misalnya database PostgreSQL untuk akun pengguna dan database vektor terpisah seperti Pinecone untuk RAG) sering menimbulkan kerumitan sinkronisasi data (*dual-write problem*).

Dengan **Supabase** ([supabase.com](https://supabase.com)) dan ekstensi **pgvector**:
* Data relasional tabel pengguna dan embedding vektor disimpan di satu tempat yang sama.
* Keamanan data dilindungi oleh **Row Level Security (RLS)** bawaan PostgreSQL.
* Biaya hosting jauh lebih terjangkau karena Anda tidak perlu membayar layanan SaaS pihak ketiga tambahan.

### 2. Mengaktifkan Ekstensi pgvector & Membuat Tabel Dokumen
Buka **SQL Editor** pada dashboard Supabase proyek Anda dan jalankan perintah DDL berikut:

\`\`\`sql
-- 1. Aktifkan ekstensi vector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Buat tabel penyimpan dokumen
CREATE TABLE documents (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1536) -- Dimensi untuk model text-embedding-3-small
);

-- 3. Buat indeks HNSW untuk akselerasi pencarian
CREATE INDEX documents_embedding_idx ON documents 
USING hnsw (embedding vector_cosine_ops);
\`\`\`

### 3. Menulis SQL Function match_documents
Buat fungsi tersimpan (*stored procedure*) yang dapat dipanggil langsung dari kode Next.js:

\`\`\`sql
CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id BIGINT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    documents.id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
\`\`\`

### 4. Mengimplementasikan Route Handler Pencarian di Next.js
Buat file \`app/api/search/route.ts\` di proyek Next.js Anda:

\`\`\`typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    // 1. Hitung vektor embedding dari pertanyaan pengguna
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    const queryVector = embeddingRes.data[0].embedding;

    // 2. Panggil fungsi RPC match_documents di Supabase
    const { data: documents, error } = await supabase.rpc('match_documents', {
      query_embedding: queryVector,
      match_threshold: 0.65,
      match_count: 5,
    });

    if (error) throw error;

    return NextResponse.json({ results: documents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
\`\`\`

### 5. Komponen Antarmuka Search Bar di React
Tampilkan hasil pencarian semantik dengan latensi rendah pada komponen antarmuka pengguna:

\`\`\`tsx
'use client';

import { useState } from 'react';

export default function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);

    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari konsep atau topik artikel..."
          className="flex-1 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
        />
        <button type="submit" className="px-5 py-3 bg-indigo-600 rounded-lg text-white font-medium">
          {loading ? 'Mencari...' : 'Cari'}
        </button>
      </form>

      <div className="space-y-4">
        {results.map((item) => (
          <div key={item.id} className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-200">{item.content}</p>
            <span className="text-xs text-indigo-400 mt-2 block">
              Skor Kecocokan: {(item.similarity * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`
`,
    en: {
      title: 'Integrating Supabase pgvector in Next.js App Router for Semantic Search',
      description: 'Step-by-step masterclass on connecting Next.js App Router with Supabase pgvector. Implement high-speed semantic document retrieval using PostgreSQL RPC functions and OpenAI embeddings.',
      content: `
### 1. Advantages of Unified Relational & Vector Storage
Embedding pgvector directly inside Supabase eliminates dual-write consistency problems and integrates seamlessly with Row Level Security (RLS).

### 2. Enabling pgvector Extensions & DDL Setup
Initialize the \`vector\` extension, declare \`VECTOR(1536)\` columns, and build HNSW indices on cosine operator classes.

### 3. Writing Custom PostgreSQL RPC Match Functions
Implement \`match_documents\` stored procedures utilizing the cosine distance operator (\`<=>\`).

### 4. Next.js App Router API Route Implementation
Compute query embeddings via \`text-embedding-3-small\` and execute stored procedures using Supabase JS SDK.

### 5. Reactive Search Client Components
Construct sleek React search interfaces rendering retrieved documents alongside similarity scores.
`
    }
  },
  {
    slug: 'ai-code-reviewer-bot-github-actions-pr-agent',
    title: 'Cara Pasang AI Code Reviewer Otomatis di GitHub Actions Menggunakan Qodo PR-Agent',
    description: 'Panduan memasang asisten review pull request otomatis di repositori GitHub tim Anda. Menghasilkan ringkasan PR, mendeteksi bug keamanan, dan menyarankan optimasi kode di setiap commit secara otomatis.',
    postType: 'tutorial',
    category: 'devops',
    categoryLabel: 'DevOps',
    difficulty: 'Menengah',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '9 min baca',
    author: 'Edvan',
    tags: ['GitHub Actions', 'Code Review', 'PR-Agent', 'CI/CD', 'DevOps', 'Automation'],
    affiliateProduct: {
      name: 'GitHub Enterprise Team License',
      priceEstimate: 'Rp 320.000/user/bln',
      linkUrl: 'https://github.com',
      badge: 'DevOps Standard',
      description: 'Fitur proteksi branch lanjutan dan kuota menit GitHub Actions berkapasitas besar.'
    },
    toc: [
      { id: 'kenapa-membutuhkan-ai-code-reviewer', title: '1. Masalah Botol Leher Code Review di Tim Pengembang' },
      { id: 'mengenal-qodo-pr-agent', title: '2. Mengenal Qodo PR-Agent (Open-Source AI Reviewer)' },
      { id: 'konfigurasi-github-actions-workflow', title: '3. Konfigurasi File Workflow .github/workflows/pr_agent.yml' },
      { id: 'perintah-interaktif-komentar-pr', title: '4. Perintah Interaktif: /describe, /review, dan /improve' },
      { id: 'kustomisasi-instruksi-aturan-internal', title: '5. Menyesuaikan Standar Gaya Kode Tim ke Konfigurasi Bot' }
    ],
    steps: [
      { id: 'step-1', label: 'Buka repositori GitHub dan masuk ke Settings -> Secrets and variables -> Actions' },
      { id: 'step-2', label: 'Tambahkan secret OPENAI_API_KEY atau ANTHROPIC_API_KEY' },
      { id: 'step-3', label: 'Buat file .github/workflows/pr_agent.yml di cabang utama' },
      { id: 'step-4', label: 'Buka Pull Request baru dan amati komentar ringkasan otomatis dari bot AI' }
    ],
    content: `
### 1. Masalah Botol Leher Code Review di Tim Pengembang
Dalam tim pengembangan perangkat lunak, proses peninjauan kode (*code review*) sering menjadi hambatan terbesar yang memperlambat rilis fitur:
* Senior engineer kelelahan mereview puluhan Pull Request (PR) yang berisi ribuan baris diff kode.
* Masalah ejaan sepele dan standar penamaan variabel menyita waktu diskusi di thread komentar.
* Kerentanan celah keamanan (seperti SQL injection atau bocornya secret key) sering kali terlewatkan secara tidak sengaja.

**Qodo PR-Agent** ([github.com/qodo-ai/pr-agent](https://github.com/qodo-ai/pr-agent)) adalah alat open-source yang bertindak sebagai reviewer AI pertama yang sigap dan tidak pernah lelah di setiap PR baru tim Anda!

### 2. Mengenal Qodo PR-Agent
PR-Agent dapat diintegrasikan dengan mudah ke GitHub Actions, GitLab CI, atau Bitbucket:
* **Auto-Describe**: Menulis judul dan ringkasan perubahan PR secara otomatis.
* **Auto-Review**: Menyoroti potensi bug, kerentanan keamanan, dan tingkat kelayakan merge.
* **Auto-Improve**: Memberikan saran perbaikan kode konkret yang bisa langsung di-*apply* dengan 1-klik di antarmuka GitHub.

### 3. Konfigurasi File Workflow .github/workflows/pr_agent.yml
Buat file alur kerja baru di repositori Anda pada path \`.github/workflows/pr_agent.yml\`:

\`\`\`yaml
name: AI PR Agent Reviewer

on:
  pull_request:
    types: [opened, reopened, ready_for_review]
  issue_comment:
    types: [created]

permissions:
  pull-requests: write
  issues: write
  contents: read

jobs:
  pr_agent_job:
    runs-on: ubuntu-latest
    name: Run PR Agent
    steps:
      - name: PR Agent Action
        uses: qodo-ai/pr-agent@main
        env:
          OPENAI_KEY: \${{ secrets.OPENAI_API_KEY }}
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          CONFIG.model: "gpt-4o-mini"
          PR_REVIEWER.REQUIRE_TESTS_REVIEW: "true"
          PR_REVIEWER.REQUIRE_SECURITY_REVIEW: "true"
\`\`\`

### 4. Perintah Interaktif di Komentar PR
Developer dalam tim Anda dapat berinteraksi langsung dengan bot cukup dengan mengetikkan komentar di jendela obrolan PR:
* \`/review\`: Meminta AI menganalisis ulang perubahan kode terbaru.
* \`/improve\`: Meminta AI memberikan blok saran *code diff* siap pakai untuk mengoptimalkan performa.
* \`/ask Bisakah fungsi ini mengalami memory leak?\`: Bertanya secara spesifik mengenai logika kode tertentu.

### 5. Menyesuaikan Standar Gaya Kode Tim
Buat file \`.pr_agent.toml\` di root repositori untuk menyesuaikan instruksi khusus:

\`\`\`toml
[pr_reviewer]
extra_instructions = """
Pastikan kode selalu menggunakan TypeScript strict mode.
Jangan izinkan penggunaan tipe 'any'.
Setiap penambahan endpoint API baru harus menyertakan validasi skema Zod.
Gunakan Bahasa Indonesia yang ramah dalam memberikan komentar.
"""
\`\`\`

Dengan bot ini, kualitas kode repositori Anda selalu terjaga rapi dan tim dapat melakukan rilis aplikasi dengan jauh lebih percaya diri!
`,
    en: {
      title: 'Automated AI Code Review in GitHub Actions Using Qodo PR-Agent',
      description: 'Integrate automated pull request review workflows in GitHub. Configure Qodo PR-Agent to auto-generate PR summaries, flag security flaws, and suggest one-click diff improvements.',
      content: `
### 1. Eliminating Code Review Bottlenecks
Manual PR reviews slow engineering velocity and allow subtle security bugs or style regressions to slip through.

### 2. What is Qodo PR-Agent?
Qodo PR-Agent ([github.com/qodo-ai/pr-agent](https://github.com/qodo-ai/pr-agent)) automates pull request triage: drafting descriptions, auditing security, and formulating targeted diff suggestions.

### 3. GitHub Actions Workflow Architecture
Configure \`.github/workflows/pr_agent.yml\` declaring necessary pull-request write permissions and API secrets.

### 4. Interactive Review Slash Commands
Developers invoke commands such as \`/review\`, \`/improve\`, or \`/ask\` directly inside GitHub PR comment threads.

### 5. Enforcing Custom Team Code Standards
Define organization-wide coding standards inside \`.pr_agent.toml\` to guarantee strict typing and security policy compliance.
`
    }
  },
  {
    slug: 'cara-setup-kokoro-82m-tts-paling-ringan-cpu',
    title: 'Cara Setup Kokoro-82M: Model TTS Bahasa Paling Ringan & Alami yang Bisa Jalan di CPU Laptop',
    description: 'Panduan lengkap memasang Kokoro-82M TTS di laptop standar tanpa GPU diskret. Menghasilkan suara narasi manusia yang sangat jernih dan fasih dengan penggunaan RAM di bawah 500 MB.',
    postType: 'tutorial',
    category: 'audio-ai',
    categoryLabel: 'Audio AI',
    difficulty: 'Mudah',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '8 min baca',
    author: 'Edvan',
    tags: ['Kokoro-82M', 'TTS', 'Audio AI', 'Local AI', 'Python', 'CPU Inference'],
    affiliateProduct: {
      name: 'Wireless Bluetooth Earbuds Hi-Res Audio',
      priceEstimate: 'Rp 450.000',
      linkUrl: 'https://soundpeats.com',
      badge: 'Audio Harian',
      description: 'Earbuds nirkabel dengan codec LDAC untuk mendengarkan hasil narasi suara AI Kokoro.'
    },
    toc: [
      { id: 'kenapa-kokoro-82m-sangat-viral', title: '1. Mengapa Kokoro-82M Menjadi Terobosan di Dunia Audio AI?' },
      { id: 'kebutuhan-sistem-ram-dan-cpu', title: '2. Kebutuhan Sistem: Jalan di Laptop Kentang Tanpa GPU' },
      { id: 'instalasi-kokoro-dan-onnx-runtime', title: '3. Instalasi Paket kokoro-onnx & Download Bobot' },
      { id: 'skrip-inferensi-python-sederhana', title: '4. Menulis Skrip Python Konversi Teks ke Suara WAV' },
      { id: 'membuat-narasi-buku-audio-panjang', title: '5. Mengubah Artikel Panjang / Bab Buku Menjadi Audiobook' }
    ],
    steps: [
      { id: 'step-1', label: 'Instal paket kokoro-onnx dan soundfile menggunakan pip' },
      { id: 'step-2', label: 'Unduh file bobot model kokoro-v0_19.onnx dan voices.json' },
      { id: 'step-3', label: 'Tulis skrip pembaca teks dengan memilih profile suara wanita (af_sarah) atau pria (am_adam)' },
      { id: 'step-4', label: 'Jalankan skrip di terminal dan dengarkan file output audio WAV yang dihasilkan' }
    ],
    content: `
### 1. Mengapa Kokoro-82M Menjadi Terobosan di Dunia Audio AI?
Sebagian besar model teks-ke-suara (*Text-to-Speech*) berkualitas tinggi membutuhkan kartu grafis GPU bertenaga besar dan memori RAM lebih dari 8 GB hanya untuk menghasilkan audio berkualitas layak.

**Kokoro-82M** ([huggingface.co/hexgrad/Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M)) membalikkan paradigma tersebut secara mengejutkan:
* **Ukuran Sangat Kecil**: Hanya memiliki 82 Juta Parameter (ukuran file biner di bawah 350 MB).
* **Super Cepat di CPU**: Menghasilkan suara lebih cepat daripada kecepatan berbicara riil (*Real-Time Factor* < 0.2 di prosesor laptop biasa).
* **Kualitas Suara Kelas Atas**: Menempati peringkat teratas di benchmark TTS open-source, mengalahkan model berukuran puluhan kali lebih besar.

### 2. Kebutuhan Sistem: Jalan di Laptop Kentang Tanpa GPU
Anda tidak membutuhkan komputer gaming mahal untuk menjalankan Kokoro:
* **OS**: Windows, macOS (Intel & Apple Silicon), atau Linux.
* **RAM**: Minimal 2 GB RAM bebas.
* **GPU**: Tidak memerlukan GPU (berjalan mulus 100% pada CPU biasa).

### 3. Instalasi Paket kokoro-onnx & Download Bobot
Gunakan runtime ONNX untuk efisiensi CPU maksimal:

\`\`\`bash
pip install kokoro-onnx soundfile
\`\`\`

Unduh file model kuantisasi ONNX resmi dan pustaka suara:
\`\`\`bash
# Unduh model ONNX (~300MB)
curl -L -O https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/kokoro-v0_19.onnx

# Unduh profil suara (~20MB)
curl -L -O https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/voices.json
\`\`\`

### 4. Skrip Inferensi Python Sederhana
Buat file \`baca_teks.py\`:

\`\`\`python
import soundfile as sf
from kokoro_onnx import Kokoro

# 1. Inisialisasi model
kokoro = Kokoro("kokoro-v0_19.onnx", "voices.json")

teks = (
    "Halo semuanya! Selamat datang di EnInformasi Hub. "
    "Hari ini kita belajar bagaimana teknologi kecerdasan buatan dapat berjalan "
    "sangat kencang dan hemat daya langsung di prosesor laptop biasa tanpa memerlukan server cloud."
)

print("Sedang mengubah teks menjadi suara...")

# 2. Render audio menggunakan suara wanita alami (af_bella)
samples, sample_rate = kokoro.create(
    teks,
    voice="af_bella",
    speed=1.0,
    lang="en-us" # Format fonetik internasional
)

# 3. Simpan ke file audio WAV
sf.write("narasi_kokoro.wav", samples, sample_rate)
print("✅ File audio berhasil dibuat: narasi_kokoro.wav!")
\`\`\`

Jalankan skrip:
\`\`\`bash
python baca_teks.py
\`\`\`

### 5. Mengubah Artikel Panjang Menjadi Audiobook
Dengan efisiensi CPU yang begitu tinggi, Anda dapat membuat skrip batching yang membaca artikel blog 10 halaman dan menyatukannya menjadi satu file audiobook MP3 utuh dalam waktu kurang dari 2 menit tanpa membuat kipas laptop Anda berisik!
`,
    en: {
      title: 'Setting Up Kokoro-82M: Lightweight Natural Neural TTS for Consumer Laptop CPUs',
      description: 'Complete deployment guide for Kokoro-82M TTS on standard consumer laptops without discrete GPUs. Produce studio-grade voiceover audio using under 500 MB of RAM.',
      content: `
### 1. The Kokoro-82M Paradigm Shift
At merely 82 million parameters, Kokoro-82M ([huggingface.co/hexgrad/Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M)) matches commercial voice synthesis fidelity with negligible CPU compute footprints.

### 2. Minimal Hardware Budget
Runs effortlessly across standard Windows, macOS, or Linux consumer hardware requiring as little as 2GB RAM.

### 3. Installing kokoro-onnx Runtime
Provision \`kokoro-onnx\` and acquire compact ONNX model graphs and voice embedding matrices.

### 4. Python Inference Implementation
Instantiate \`Kokoro\` engine wrappers and synthesize high-fidelity PCM audio arrays written directly to disk.

### 5. Scalable Long-Form Audiobook Synthesis
Batch-process extensive multi-chapter manuscripts into full-length audiobooks efficiently on low-wattage laptops.
`
    }
  },
  {
    slug: 'tutorial-fullstack-ai-saas-nextjs-stripe-cloudflare',
    title: 'Tutorial Membangun Fullstack AI Micro-SaaS dari Nol dengan Next.js, Stripe, dan Cloudflare Workers',
    description: 'Panduan membangun produk AI Micro-SaaS komersial dari awal hingga menghasilkan uang. Mengintegrasikan autentikasi Clerk, pembayaran langganan Stripe Checkout, rate-limiting, dan backend Next.js.',
    postType: 'tutorial',
    category: 'web-dev',
    categoryLabel: 'Web Dev',
    difficulty: 'Lanjutan',
    pubDate: '12 Oktober 2026',
    updatedDate: '14 Oktober 2026',
    readingTime: '11 min baca',
    author: 'Edvan',
    tags: ['SaaS', 'Next.js', 'Stripe', 'Clerk', 'Cloudflare', 'TypeScript', 'Indie Hacking'],
    affiliateProduct: {
      name: 'Domain .COM Premium untuk Brand SaaS',
      priceEstimate: 'Rp 140.000/thn',
      linkUrl: 'https://namesilo.com',
      badge: 'Brand Keren',
      description: 'Domain profesional dengan gratis perlindungan privasi WHOIS selamanya.'
    },
    toc: [
      { id: 'konsep-ai-microsaas-yang-profitabel', title: '1. Anatomi Arsitektur AI Micro-SaaS yang Menghasilkan Profit' },
      { id: 'autentikasi-pengguna-dengan-clerk', title: '2. Setup Autentikasi Pengguna Kilat Menggunakan Clerk' },
      { id: 'integrasi-pembayaran-stripe-webhook', title: '3. Menghubungkan Stripe Checkout & Menangani Webhook' },
      { id: 'rate-limiting-kuota-token-api', title: '4. Menerapkan Kuota Pemakaian & Rate-Limiting Berbasis Tier' },
      { id: 'deploy-ke-cloudflare-atau-vercel', title: '5. Deploy ke Produksi & Memulai Pemasaran Pertama' }
    ],
    steps: [
      { id: 'step-1', label: 'Inisialisasi proyek Next.js 15 App Router dengan Tailwind CSS' },
      { id: 'step-2', label: 'Pasang @clerk/nextjs untuk manajemen login pengguna Google/Email' },
      { id: 'step-3', label: 'Buat produk langganan di Stripe Dashboard dan konfigurasikan checkout session' },
      { id: 'step-4', label: 'Tulis handler stripe webhook untuk mengaktifkan status langganan PRO di database' }
    ],
    content: `
### 1. Anatomi Arsitektur AI Micro-SaaS yang Menghasilkan Profit
Membangun produk *Software as a Service (SaaS)* berbasis AI di tahun 2026 tidak lagi membutuhkan tim besar beranggotakan puluhan orang. Sebagai pengembang mandiri (*solopreneur / indie hacker*), Anda dapat meluncurkan produk komersial dalam hitungan hari dengan menggabungkan tumpukan teknologi modern:
* **Frontend & Backend**: Next.js 15 App Router (React Server Components).
* **Autentikasi**: Clerk (login sosial instan dengan keamanan MFA).
* **Pembayaran**: Stripe Billing (langganan bulanan berulang dengan manajemen portal pelanggan).
* **Database & Vektor**: Supabase PostgreSQL.
* **Proteksi Biaya**: Upstash Redis (rate-limiting agresif untuk mencegah pembengkakan tagihan API AI).

### 2. Setup Autentikasi Pengguna Kilat Menggunakan Clerk
Pasang paket Clerk di proyek Next.js Anda:

\`\`\`bash
npm install @clerk/nextjs stripe @supabase/supabase-js
\`\`\`

Bungkus aplikasi Anda di \`app/layout.tsx\`:

\`\`\`tsx
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="id">
        <body className="bg-slate-950 text-white min-h-screen">
          <header className="flex justify-between items-center p-4 border-b border-slate-800">
            <h1 className="font-bold text-sky-400">⚡ AI Headshot Generator</h1>
            <SignedOut>
              <SignInButton mode="modal" className="px-4 py-2 bg-sky-600 rounded-lg text-sm" />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
\`\`\`

### 3. Menghubungkan Stripe Checkout & Menangani Webhook
Buat route handler untuk membuat sesi pembayaran di \`app/api/stripe/checkout/route.ts\`:

\`\`\`typescript
import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: Request) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return NextResponse.json({ error: 'Harus login terlebih dahulu' }, { status: 401 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!, // ID harga langganan bulanan Rp 149.000
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/dashboard?sukses=true\`,
    cancel_url: \`\${process.env.NEXT_PUBLIC_APP_URL}/pricing\`,
    customer_email: user.emailAddresses[0].emailAddress,
    metadata: { userId: userId },
  });

  return NextResponse.json({ url: session.url });
}
\`\`\`

Tangani konfirmasi pembayaran di \`app/api/stripe/webhook/route.ts\`:

\`\`\`typescript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: \`Webhook Error: \${err.message}\` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    
    // Perbarui status pengguna menjadi PRO di database Anda
    console.log(\`✅ Pembayaran sukses untuk pengguna: \${userId}. Mengaktifkan kuota PRO!\`);
  }

  return NextResponse.json({ received: true });
}
\`\`\`

### 4. Rate-Limiting Kuota Token API
Gunakan Upstash Redis untuk memastikan pengguna paket gratis dibatasi 5 generasi per hari, sedangkan pengguna PRO mendapatkan akses tanpa hambatan.

### 5. Deploy ke Produksi & Memulai Pemasaran Pertama
Deploy aplikasi Anda ke **Vercel** atau **Cloudflare Pages**:
1. Hubungkan repositori GitHub Anda.
2. Daftarkan seluruh variabel lingkungan produksi (\`STRIPE_SECRET_KEY\`, \`CLERK_SECRET_KEY\`, dll).
3. Sambungkan domain kustom Anda.
4. Mulai distribusikan produk Anda di platform komunitas developer dan media sosial untuk mendapatkan pelanggan berbayar pertama Anda!
`,
    en: {
      title: 'Building a Fullstack AI Micro-SaaS from Scratch: Next.js, Stripe & Cloudflare',
      description: 'End-to-end blueprint for building a commercial AI micro-SaaS. Integrate Clerk authentication, recurring Stripe subscription billing, tiered rate-limits, and modern Next.js 15 backends.',
      content: `
### 1. Anatomy of High-Margin AI Micro-SaaS
Indie hackers build profitable software by assembling best-in-class components: Next.js 15 App Router, Clerk authentication, Stripe subscriptions, and Upstash rate-limiting.

### 2. Seamless User Authentication with Clerk
Bootstrap user state and social OAuth logins via \`@clerk/nextjs\` wrapped across root application layouts.

### 3. Stripe Subscription Checkout & Webhook Handlers
Implement programmatic Stripe Checkout sessions with metadata bindings and construct verified webhook endpoints updating database entitlement records.

### 4. Tiered Rate Limiting Infrastructure
Enforce token quotas and request throttling using distributed Redis engines to protect profit margins from abuse.

### 5. Production Deployment Protocols
Publish to high-availability edge networks (Vercel or Cloudflare) with configured domain records and initiate distribution campaigns.
`
    }
  }
];

const targetFile = path.join(__dirname, '..', 'lib', 'data', 'tutorials-3.ts');
const fileContent = `import { Article } from '@/types/article';

export const tutorialsPart3: Article[] = ${JSON.stringify(tutorials, null, 2)};
`;

fs.writeFileSync(targetFile, fileContent, 'utf8');
console.log(`Successfully written all ${tutorials.length} tutorials to lib/data/tutorials-3.ts!`);
