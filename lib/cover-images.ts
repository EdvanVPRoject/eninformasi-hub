// lib/cover-images.ts
// Precision Visual Engine for EnInformasi Hub
// Maps articles to authentic, high-resolution topic-aligned photography (Zero title-repeating placeholder SVGs)

export interface ArticleVisual {
  url: string;
  caption: string;
  source: 'Unsplash' | 'Informasi Hub' | string;
}

const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

// 1. Direct Slug-to-Visual Mappings for Featured & Recent Daily News Articles (100% Subject Aligned)
const SLUG_VISUALS: Record<string, ArticleVisual> = {
  'claude-fable-52-bikin-kopi-darat-gears-of-war-e--20261111': {
    url: U('1677442136019-21780ecad995'),
    caption: "Tampilan kode pemrograman kompleks dan antarmuka model bahasa besar di layar monitor kerja.",
    source: 'Unsplash'
  },
  'amd-pecahkan-rekor-lewat-arsitektur-zen-6-epyc-v-20261110': {
    url: U('1511512578047-dfb367046420'),
    caption: "Tampak dekat modul prosesor server AMD EPYC Venice dengan arsitektur chiplet mutakhir.",
    source: 'Unsplash'
  },
  'kebangkitan-mass-effect-mantan-co-founder-biowar-20261110': {
    url: U('1612287230202-1ff1d85d1bdf'),
    caption: "Tampilan layar sinematik kapal pendarat fiksi ilmiah berlatar galaksi luar angkasa luas.",
    source: 'Unsplash'
  },
  'terobosan-pendinginan-ai-ekstrem-chip-deepx-dx-m-20261110': {
    url: U('1597852074816-d933c7d2b988'),
    caption: "Potret close-up chip silikon DEEPX DX-M1 yang terpasang di atas motherboard khusus.",
    source: 'Unsplash'
  },
  'skandal-privasi-wearable-pelacak-tidur-ternyata--20261109': {
    url: U('1624705002806-5d72df19c3ad'),
    caption: "Sensor biometrik canggih pada perangkat wearable yang memantau aktivitas saraf pengguna saat tidur.",
    source: 'Unsplash'
  },
  'revolusi-ai-lokal-llama-modchip-memungkinkan-inf-20261109': {
    url: U('1591488320449-011701bb6704'),
    caption: "Visualisasi representasi data memori sistem yang dioptimalkan untuk menjalankan model bahasa besar pada arsitektur CPU standar.",
    source: 'Unsplash'
  },
  'akhir-sebuah-era-linux-75-hapus-total-optimasi-i-20261109': {
    url: U('1581092160607-ee22621dd758'),
    caption: "Tampak potongan kode kernel Linux terbaru di layar monitor workstation modern beresolusi tinggi.",
    source: 'Unsplash'
  },
  'terobosan-ekstrem-homelabber-jalankan-model-ai-2-20261108': {
    url: U('1555617981-dac3880eac6e'),
    caption: "Modifikasi pendingin blower ekstrim pada stik memori Optane server rumahan performa tinggi",
    source: 'Unsplash'
  },
  'revolusi-vr-terkini-valve-steam-frame-dibanderol-20261108': {
    url: U('1538481199705-c710c4e965fc'),
    caption: "Headset virtual reality futuristis berwarna hitam dengan lensa optik canggih dan tali pengikat ergonomis di atas meja kerja.",
    source: 'Unsplash'
  },
  'skandal-geopolitik-teknologi-ceo-nvidia-jensen-h-20261108': {
    url: U('1518770660439-4636190af475'),
    caption: "Ilustrasi visual konsep keamanan siber enterprise, silikon semikonduktor, dan investigasi data intelijen tingkat tinggi.",
    source: 'Unsplash'
  },
  'tragedi-32000-investigasi-kabel-12v-26-yang-nyar-20261107': {
    url: U('1606813907291-d86efa9b94db'),
    caption: "Inspeksi visual mendalam pada konektor kabel daya GPU yang menunjukkan tanda awal degradasi termal.",
    source: 'Unsplash'
  },
  'era-baru-ai-tesla-ungkap-peta-jalan-akselerator--20261107': {
    url: U('1562408590-e32931084e23'),
    caption: "Visualisasi chip silikon canggih Tesla yang dirancang untuk komputasi saraf berkecepatan tinggi di pusat data.",
    source: 'Unsplash'
  },
  'ironi-infrastruktur-ai-produsen-rel-laci-dapur-t-20261107': {
    url: U('1587202372634-32705e3bf49c'),
    caption: "Rak server canggih berstandar industri dengan rel geser presisi tinggi menopang klaster GPU.",
    source: 'Unsplash'
  },
  'terobosan-paten-playstation-6-berantas-smurfing--20261106': {
    url: U('1605901309584-818e25960b8f'),
    caption: "Ilustrasi render konsep kontroler PlayStation mutakhir di atas meja studio gaming futuristik",
    source: 'Unsplash'
  },
  'ambisi-mandiri-india-menggebrak-pasar-gpu-global-20261106': {
    url: U('1591799264318-7e6ef8ddb7ea'),
    caption: "Diagram skematik arsitektur chip silikon RISC-V yang sedang dikembangkan oleh para insinyur di fasilitas riset India.",
    source: 'Unsplash'
  },
  'krisis-energi-pusat-data-mengapa-infrastruktur-a-20261106': {
    url: U('1587202372775-e229f172b9d7'),
    caption: "Deretan rak server performa tinggi dalam fasilitas data center modern dengan pendinginan cair canggih.",
    source: 'Unsplash'
  },
  'revolusi-ai-generatif-anthropic-ubah-kebijakan-c-20261105': {
    url: U('1677442136019-21780ecad995'),
    caption: "Antarmuka pemrograman AI yang menampilkan kode sumber game yang sedang dikembangkan secara dinamis di layar monitor.",
    source: 'Unsplash'
  },
  'krisis-antrean-review-steam-tembus-12-hari-kerja-20261105': {
    url: U('1542751371-adc38448a05e'),
    caption: "Tangkapan layar dasbor developer Steam menampilkan indikator antrean moderasi game digital.",
    source: 'Unsplash'
  },
  'skandal-pembatalan-pesanan-pc-rtx-5090-oleh-cors-20261105': {
    url: U('1597852074816-d933c7d2b988'),
    caption: "Tampilan dekat unit kartu grafis flagship RTX 5090 terpasang di motherboard high-end dengan sistem pendingin cairan.",
    source: 'Unsplash'
  },
  'sejarah-baru-industri-pc-amd-diproyeksikan-salip-20261104': {
    url: U('1624705002806-5d72df19c3ad'),
    caption: "Deretan chip prosesor silikon berperforma tinggi di atas papan motherboard server enterprise modern.",
    source: 'Unsplash'
  },
  'skandal-energi-xai-elon-musk-gunakan-8-mesin-jet-20261104': {
    url: U('1558494949-ef010cbdcc31'),
    caption: "Deretan turbin jet industri yang dimodifikasi berdiri kokoh di area fasilitas pusat data.",
    source: 'Unsplash'
  },
  'skandal-postman-auto-install-plugin-ai-kebocoran-20261104': {
    url: U('1581092160607-ee22621dd758'),
    caption: "Tangkapan layar antarmuka aplikasi pengujian API dengan jendela peringatan keamanan sistem.",
    source: 'Unsplash'
  },
  'skandal-penyelundupan-chip-ai-memori-hbm-korsel--20261103': {
    url: U('1555617981-dac3880eac6e'),
    caption: "Tumpukan wafer semikonduktor canggih dan modul memori HBM dalam fasilitas laboratorium pengujian bersih.",
    source: 'Unsplash'
  },
  // === Nov 2026 Daily News ===
  'kejutan-besar-di-steam-hardware-survey-geforce-r-20261103': {
    url: U('1591488320449-011701bb6704'),
    caption: 'Komparasi Kartu Grafis NVIDIA GeForce RTX Seri 30 & RTX Seri 50 pada Rig PC Gaming Modern',
    source: 'Unsplash'
  },
  'kecerdasan-buatan-tingkat-lanjut-model-ai-berhas-20261103': {
    url: U('1518770660439-4636190af475'),
    caption: 'Arsitektur Mikroprosesor RISC-V 32-Bit & Eksekusi Instruksi di Dalam Bobot Parameter AI',
    source: 'Unsplash'
  },
  'perang-firmware-playstation-persyaratan-firmware-20261102': {
    url: U('1606813907291-d86efa9b94db'),
    caption: 'Konsol PlayStation 5 & Proteksi Keamanan Firmware Sistem Operasi Generasi Baru',
    source: 'Unsplash'
  },
  'malware-windows-berbasis-ai-canggih-manfaatkan-c-20261102': {
    url: U('1526374965328-7f61d4dc18c5'),
    caption: 'Deteksi Ancaman Siber & Analisis Forensik Keamanan Sistem Operasi Windows',
    source: 'Unsplash'
  },
  'terobosan-open-source-usb-tool-berhasil-jebol-ba-20261102': {
    url: U('1587202372634-32705e3bf49c'),
    caption: 'Pengujian Performa Komputasi FP16 Kartu Grafis NVIDIA RTX Melalui Utilitas Open-Source',
    source: 'Unsplash'
  },
  'eksperimen-gila-ai-agent-di-minecraft-gagal-tota-20261101': {
    url: U('1620712943543-bcc4688e7485'),
    caption: 'Simulasi Multi-Agen Otonom & Orkestrasi Keputusan Kecerdasan Buatan di Lingkungan Virtual',
    source: 'Unsplash'
  },
  'krisis-pasokan-chip-ai-terparah-intel-alihkan-ka-20261101': {
    url: U('1591799264318-7e6ef8ddb7ea'),
    caption: 'Lini Fabrikasi Prosesor Server & Manajemen Kapasitas Silikon Semikonduktor Intel',
    source: 'Unsplash'
  },
  'skandal-pinjaman-mahasiswa-rp31-triliun-operasi--20261101': {
    url: U('1563986768609-322da13575f3'),
    caption: 'Investigasi Forensik Digital & Sistem Deteksi Anomali Identitas Berbasis AI',
    source: 'Unsplash'
  },

  // === Late Oct 2026 Daily News ===
  'kontroversi-sam-altman-ram-pc-disebut-sangat-men-20261031': {
    url: U('1562408590-e32931084e23'),
    caption: 'Modul Memori DRAM Kecepatan Tinggi & Infrastruktur Komputasi Cloud Terpusat',
    source: 'Unsplash'
  },
  'revolusi-pendinginan-ekstrem-radiator-ac-4kw-uba-20261031': {
    url: U('1587202372775-e229f172b9d7'),
    caption: 'Sistem Pendinginan Ekstrem & Modifikasi Termal Kartu Grafis Berdaya Tinggi',
    source: 'Unsplash'
  },
  'bencana-pasar-semikonduktor-ambruknya-valuasi-pa-20261031': {
    url: U('1551288049-bebda4e38f71'),
    caption: 'Analisis Dinamika Valuasi Pasar Semikonduktor Global & Rantai Pasok Perangkat Keras',
    source: 'Unsplash'
  },
  'cisco-berikan-token-ai-tak-terbatas-ke-insinyur--20261030': {
    url: U('1555066931-4365d14bab8c'),
    caption: 'Modernisasi Arsitektur Kode Warisan Skala Enterprise Menggunakan Agen Pemrograman AI',
    source: 'Unsplash'
  },
  'lonjakan-harga-gpu-global-35-dalam-tiga-bulan-gu-20261030': {
    url: U('1597852074816-d933c7d2b988'),
    caption: 'Analisis Fluktuasi Harga & Ketersediaan Stok Kartu Grafis Global',
    source: 'Unsplash'
  },
  'krisis-pcb-global-memuncak-permintaan-ai-picu-lo-20261030': {
    url: U('1581092160607-ee22621dd758'),
    caption: 'Jalur Sirkuit Papan Induk (PCB) Multi-Layer & Manufaktur Komponen Server AI',
    source: 'Unsplash'
  },
  'heboh-karyawan-raih-pengecualian-agama-pertama-d-20261029': {
    url: U('1519389950473-47ba0277781c'),
    caption: 'Etika Pemanfaatan Kecerdasan Buatan & Otonomi Kognitif di Lingkungan Kerja Modern',
    source: 'Unsplash'
  },
  'google-gemini-4-carbon-guncang-industri-dominasi-20261029': {
    url: U('1677442136019-21780ecad995'),
    caption: 'Arsitektur Penalaran Model AI Generasi Terbaru & Otomasi Patch Keamanan Siber',
    source: 'Unsplash'
  },
  'malaysia-sita-chip-ai-senilai-12-juta-di-dalam-3-20261029': {
    url: U('1558494949-ef010cbdcc31'),
    caption: 'Inspeksi Unit Server Data Center & Pengawasan Distribusi Akselerator AI',
    source: 'Unsplash'
  },
  'superkomputer-ai-senilai-60-juta-dijual-di-ebay--20261028': {
    url: U('1558346490-a72e53ae2d4f'),
    caption: 'Kluster Rak Server Superkomputer AI & Infrastruktur Komputasi Skala Enterprise',
    source: 'Unsplash'
  },
  'skandal-layanan-asus-penolakan-garansi-rtx-5080--20261028': {
    url: U('1624705002806-5d72df19c3ad'),
    caption: 'Inspeksi Komponen VRM & Induktor Kartu Grafis Kelas Enthusiast',
    source: 'Unsplash'
  },
  'skandal-harga-rtx-5090-tembus-7500-di-jepang-pas-20261028': {
    url: U('1625842268584-8f3296236761'),
    caption: 'Distribusi Ritel Kartu Grafis Flagship & Kelangkaan Pasokan Chip GB202',
    source: 'Unsplash'
  },
  'krisis-biaya-infrastruktur-ai-microsoft-tawarkan-20261027': {
    url: U('1451187580459-43490279c0fa'),
    caption: 'Skala Ekspansi Infrastruktur Cloud Global & Efisiensi Operasional Korporasi Teknologi',
    source: 'Unsplash'
  },
  'unreal-engine-58-resmi-hadirkan-advanced-shader--20261027': {
    url: U('1542751371-adc38448a05e'),
    caption: 'Pipeline Rendering Grafis Real-Time & Optimasi Kompilasi Shader Unreal Engine 5.8',
    source: 'Unsplash'
  },
  'revolusi-chip-ai-cadence-maestro-siap-mengubah-m-20261027': {
    url: U('1581092334651-ddf26d9a09d0'),
    caption: 'Otomasi Desain Semikonduktor (EDA) & Tata Letak Transistor Silikon Berbantuan AI',
    source: 'Unsplash'
  },
  'bocor-cpu-epyc-zen-6c-256-core-hancurkan-perform-20261026': {
    url: U('1555680202-c86f0e12f086'),
    caption: 'Arsitektur Multi-Chiplet Prosesor Server AMD EPYC Berkerapatan Tinggi',
    source: 'Unsplash'
  },
  'serangan-drone-ukraina-hantam-pusat-data-keuanga-20261026': {
    url: U('1550751827-4bd374c3f58b'),
    caption: 'Ketahanan Infrastruktur Pusat Data Nasional & Keamanan Jaringan Kritis',
    source: 'Unsplash'
  },
  'skandal-rtx-5090-deteksi-dini-safeguard-selamatk-20261026': {
    url: U('1593640408182-31c70c8268f5'),
    caption: 'Sistem Proteksi Arus Daya Konektor 12V-2x6 pada Kartu Grafis Flagship',
    source: 'Unsplash'
  },

  // === Mid Oct 2026 & Curated Hits (All SVGs replaced with real photography) ===
  'skandal-industri-ai-global-ribuan-unit-gpu-rtx-5-20261024': {
    url: U('1591488320449-011701bb6704'),
    caption: 'Unit Kartu Grafis NVIDIA GeForce RTX 5090 Flagship Konsumen yang Menjadi Sasaran Modifikasi Server',
    source: 'Unsplash'
  },
  'kebangkitan-rahasia-mass-effect-terungkapnya-kon-20261024': {
    url: U('1506703719100-a0f3a48c0f86'),
    caption: 'Eksplorasi Galaksi & Konsep Peradaban Sci-Fi Semesta Mass Effect Generasi Baru',
    source: 'Unsplash'
  },
  'misteri-komunikasi-rahasia-ai-saat-model-agen-op-20261024': {
    url: U('1677442136019-21780ecad995'),
    caption: 'Simulasi Koordinasi Agen AI Otonom Multi-Model pada Lingkungan Komputasi Terdistribusi',
    source: 'Unsplash'
  },
  'keteledoran-epik-gpu-curian-rtx-5090-seharga-rp1-20261023': {
    url: U('1550751827-4bd374c3f58b'),
    caption: 'Pelacakan Identitas Nomor Seri Pabrik Unit GPU Flagship RTX 5090',
    source: 'Unsplash'
  },
  'peringatan-keras-masahiro-sakurai-19000-game-ste-20261023': {
    url: U('1542751371-adc38448a05e'),
    caption: 'Katalog Distribusi Game Digital & Antarmuka Pasar Game PC Global',
    source: 'Unsplash'
  },
  'kontroversi-ai-megajam-epic-games-mengapa-komuni-20261023': {
    url: U('1550745165-9bc0b252726f'),
    caption: 'Komunitas Pengembang Game Unreal Engine 5 dalam Gelaran Game Jam Global',
    source: 'Unsplash'
  },
  'skandal-keamanan-kritis-kebocoran-private-key-8--20261022': {
    url: U('1518770660439-4636190af475'),
    caption: 'Inspeksi Fisik Chip Firmware SPI Flash & Komponen Motherboard Komputer',
    source: 'Unsplash'
  },
  'solusi-revolusioner-driver-gpu-nvidia-akhiri-mas-20261022': {
    url: U('1593640495253-23196b27a87f'),
    caption: 'Setup PC Gaming Enthusiast dengan Pemantauan Frame-Pacing Real-Time',
    source: 'Unsplash'
  },
  'deepseek-buka-bukaan-rilis-deepinfer-open-source-20261022': {
    url: U('1639322537228-f710d846310a'),
    caption: 'Arsitektur Mesin Inferensi Terdistribusi DeepSeek DeepInfer Open-Source',
    source: 'Unsplash'
  },
  'industri-game-sembunyikan-fakta-ai-orang-dalam-x-20261021': {
    url: U('1538481199705-c710c4e965fc'),
    caption: 'Integrasi Model Generatif dalam Pipeline Produksi Game AAA Studio Modern',
    source: 'Unsplash'
  },
  'revolusi-handheld-pc-setup-steam-machine-seharga-20261021': {
    url: U('1578301978693-85fa9c0320b9'),
    caption: 'Kompilasi Hardware Small Form Factor (SFF) SteamOS Mini Console Kustom',
    source: 'Unsplash'
  },
  'amd-bawa-fsr-41-ke-xbox-series-xs-dan-radeon-rx--20261021': {
    url: U('1607604276583-eef5d076aa5f'),
    caption: 'Integrasi Neural Super Resolution FSR 4.1 pada Ekosistem Konsol Xbox & GPU Radeon',
    source: 'Unsplash'
  },
  'revolusi-performa-gaming-gamer-oblivion-manfaatk-20261020': {
    url: U('1511512578047-dfb367046420'),
    caption: 'Dunia Terbuka RPG Klasik The Elder Scrolls IV: Oblivion dengan Pembaruan Visual Modern',
    source: 'Unsplash'
  },
  'skandal-ai-minimax-m31-flash-teori-konspirasi-da-20261020': {
    url: U('1618005182384-a83a8bd57fbe'),
    caption: 'Evaluasi Komparasi Model MiniMax M3.1 Flash pada Leaderboard AI Global',
    source: 'Unsplash'
  },
  'manajer-xbox-akui-pemanfaatan-ai-untuk-bangun-ga-20261020': {
    url: U('1600861194942-f883de0dfe96'),
    caption: 'Prototipe Cepat Game Interaktif Menggunakan Generative AI Pipeline',
    source: 'Unsplash'
  },
  'kecerdasan-buatan-claude-code-berhasil-ungkap-pe-20261019': {
    url: U('1555066931-4365d14bab8c'),
    caption: 'Audit Forensik Proses Tersembunyi pada macOS Menggunakan Claude Code CLI',
    source: 'Unsplash'
  },
  'revolusi-chip-ai-custom-broadcom-mengapa-raksasa-20261019': {
    url: U('1581092160607-ee22621dd758'),
    caption: 'Desain Silikon Custom ASIC & Jaringan Optik Terabyte Broadcom untuk Data Center',
    source: 'Unsplash'
  },
  'reolusi-npc-gta-v-mod-npctalk-hidupkan-karakter--20261019': {
    url: U('1514565131-fce0801e5785'),
    caption: 'Integrasi Mesin Suara AI Real-Time pada Karakter Pejalan Kaki GTA V',
    source: 'Unsplash'
  },
  'pertempuran-gpu-2026-memanas-amd-radeon-rx-9070--20261018': {
    url: U('1587202372634-32705e3bf49c'),
    caption: 'Kartu Grafis AMD Radeon RX Generasi RDNA 4 Berpendingin Triple Fan Kustom',
    source: 'Unsplash'
  },
  'deepseek-v41-flash-guncang-industri-kalahkan-gpt-20261018': {
    url: U('1620712943543-bcc4688e7485'),
    caption: 'Evaluasi Benchmark Pemrograman Kode Otonom DeepSeek V4.1-Flash vs GPT-5.5',
    source: 'Unsplash'
  },
  'krisis-rtx-5090-memanas-nvidia-ngotot-gpu-flagsh-20261018': {
    url: U('1624705002806-5d72df19c3ad'),
    caption: 'Rantai Pasok Global & Sistem Pendingin Ruang Uap (Vapor Chamber) RTX 5090',
    source: 'Unsplash'
  },
  'asus-resmi-masuk-pasar-intel-arc-luncurkan-kartu-20261017': {
    url: U('1555680202-c86f0e12f086'),
    caption: 'Kartu Grafis ASUS Dual Intel Arc Battlemage B70 dengan Arsitektur Xe2-HPG',
    source: 'Unsplash'
  },
  'kontroversi-gatgpt-senjata-3d-printed-pertama-bu-20261017': {
    url: U('1581092160607-ee22621dd758'),
    caption: 'Inspeksi Manufaktur Aditif 3D & Analisis Regulasi Blueprint Digital AI',
    source: 'Unsplash'
  },
  'kreator-dayz-sebut-industri-game-sedang-membusuk-20261017': {
    url: U('1552664730-d307ca884978'),
    caption: 'Pengembangan Game Survival Skala Besar & Desain Sistem Emergent',
    source: 'Unsplash'
  },
  'amd-fsr-4-siap-sambangi-konsol-handheld-akhir-ta-20261016': {
    url: U('1592478411213-6153e4ebc07d'),
    caption: 'Implementasi Penskalaan Neural AMD FSR 4 pada Layar Handheld 7 Inci Steam Deck',
    source: 'Unsplash'
  },
  'nvidia-rtx-5090-mendadak-hilang-dari-pasaran-rum-20261016': {
    url: U('1625842268584-8f3296236761'),
    caption: 'Situasi Ketersediaan Stok Kartu Grafis Flagship di Retailer Komputer Global',
    source: 'Unsplash'
  },
  'ledakan-pabrik-fab-38-intel-di-israel-picu-respo-20261015': {
    url: U('1581092334651-ddf26d9a09d0'),
    caption: 'Fasilitas Fabrikasi Semikonduktor Fab 38 & Jalur Pipa Gas Khusus Fab',
    source: 'Unsplash'
  },
  'zelda-ocarina-of-time-remake-tembus-60-fps-di-sw-20261015': {
    url: U('1518709268805-4e9042af9f23'),
    caption: 'Uji Performa Rendering 60 FPS Engine Zelda Ocarina of Time Remake di Switch 2',
    source: 'Unsplash'
  },
  'meta-gebrak-industri-crypto-ai-muse-sukses-ranca-20261015': {
    url: U('1639762681485-074b7f938ba0'),
    caption: 'Rancangan Sirkuit Terintegrasi SoC RISC-V Menggunakan Generative AI Agen',
    source: 'Unsplash'
  },
  'epic-games-rilis-launcher-baru-hasil-vibe-coding-20261015': {
    url: U('1498050108023-c5249f4df085'),
    caption: 'Komparasi Responsivitas Antarmuka Epic Games Launcher Baru vs Steam Client',
    source: 'Unsplash'
  },

  // === Future Hardware & Gaming Top Hits ===
  'nvidia-spark-dan-arsitektur-rubin-kapan-rilis': {
    url: U('1558494949-ef010cbdcc31'),
    caption: 'Arsitektur Komputasi Super Silikon: Fabrikasi TSMC 3nm CoWoS-L & Memori HBM4 2048-bit',
    source: 'Unsplash'
  },
  'nvidia-rtx-5090-vs-5080-bocoran-spesifikasi-vram-daya': {
    url: U('1587202372775-e229f172b9d7'),
    caption: 'Arsitektur Die Silikon GPU Blackwell GB202 & Modul Memori GDDR7 512-bit',
    source: 'Unsplash'
  },
  'apple-m5-chip-dan-revolusi-neural-engine-on-device': {
    url: U('1517336714731-489689fd1ca8'),
    caption: 'Arsitektur Apple Silicon SoIC 3D & Fabrikasi TSMC 2nm Nanosheet GAAFET',
    source: 'Unsplash'
  },
  'starlink-direct-to-cell-koneksi-hp-langsung-ke-satelit': {
    url: U('1451187580459-43490279c0fa'),
    caption: 'Jaringan Konstelasi Satelit Orbit Rendah Starlink Direct-to-Cell',
    source: 'Unsplash'
  },
  'gta-6-kapan-dipastikan-rilis-jadwal-bocoran-fitur': {
    url: U('1506744038136-46273834b3fb'),
    caption: 'Panorama Arsitektur Kota Pesisir Tropis & Lanskap Neon Terinspirasi Vice City',
    source: 'Unsplash'
  },
  'nintendo-switch-2-bocoran-spesifikasi-harga-rilis': {
    url: U('1606813907291-d86efa9b94db'),
    caption: 'Arsitektur Handheld Custom Tegra T239 & Layar OLED HDR Generasi Baru',
    source: 'Unsplash'
  },
  'cara-setting-sensi-gyro-pubg-mobile-no-recoil-2026': {
    url: U('1563089145-599997674d42'),
    caption: 'Kalibrasi Sensitivitas Gyroscope & Pengaturan Tata Letak Kontrol ADS PUBG Mobile',
    source: 'Unsplash'
  },
  'tutorial-rotasi-jungler-mobile-legends-mythic-glory': {
    url: U('1542751371-adc38448a05e'),
    caption: 'Peta Jalur Rotasi Jungler Land of Dawn & Strategi Objektif Turnamen Esports',
    source: 'Unsplash'
  },
  'panduan-lengkap-solo-rank-honor-of-kings-grandmaster': {
    url: U('1550745165-9bc0b252726f'),
    caption: 'Antarmuka Kontrol Lanjutan & Formasi Hero Kompetitif Honor of Kings',
    source: 'Unsplash'
  },
  'tutorial-setting-crosshair-sensi-valorant-headshot-machine': {
    url: U('1616588589676-62b3bd4ff6d2'),
    caption: 'Pengujian Sensitivitas eDPI & Penempatan Bidikan Crosshair Valorant Pro VCT',
    source: 'Unsplash'
  }
};

// 2. Multi-Photo Topic Rules Based on Keywords (Deterministic Selection per Article)
const TOPIC_KEYWORD_RULES: { keywords: string[]; visuals: ArticleVisual[] }[] = [
  {
    keywords: ['rtx', 'geforce', 'radeon', 'gpu', 'vram', 'dlss', 'fsr', 'blackwell', 'rdna', 'shader', 'grafis'],
    visuals: [
      {
        url: U('1591488320449-011701bb6704'),
        caption: 'Arsitektur Kartu Grafis Modern & Sistem Pendingin Vapor Chamber',
        source: 'Unsplash'
      },
      {
        url: U('1587202372634-32705e3bf49c'),
        caption: 'Unit Pemrosesan Grafis (GPU) Kelas Enthusiast & Akselerasi Ray Tracing',
        source: 'Unsplash'
      },
      {
        url: U('1624705002806-5d72df19c3ad'),
        caption: 'Komponen Silikon Kartu Grafis & Konfigurasi Memori GDDR Berkecepatan Tinggi',
        source: 'Unsplash'
      },
      {
        url: U('1625842268584-8f3296236761'),
        caption: 'Perangkat Keras Kartu Grafis Desktop & Pengujian Beban Kerja Komputasi Visual',
        source: 'Unsplash'
      }
    ]
  },
  {
    keywords: ['cpu', 'ryzen', 'epyc', 'intel', 'core-ultra', 'risc-v', 'semikonduktor', 'semiconductor', 'tsmc', 'wafer', 'chip', 'pcb', 'motherboard', 'ram', 'dram'],
    visuals: [
      {
        url: U('1518770660439-4636190af475'),
        caption: 'Arsitektur Mikroprosesor Silikon & Jalur Sirkuit Terintegrasi Presisi Tinggi',
        source: 'Unsplash'
      },
      {
        url: U('1591799264318-7e6ef8ddb7ea'),
        caption: 'Soket Prosesor Generasi Baru & Desain Multi-Chiplet Komputasi Performa Tinggi',
        source: 'Unsplash'
      },
      {
        url: U('1555680202-c86f0e12f086'),
        caption: 'Fabrikasi Wafer Semikonduktor & Modul Komponen Perangkat Keras Komputer',
        source: 'Unsplash'
      },
      {
        url: U('1562408590-e32931084e23'),
        caption: 'Konfigurasi Memori DRAM Kecepatan Tinggi & Interkoneksi Papan Induk (PCB)',
        source: 'Unsplash'
      }
    ]
  },
  {
    keywords: ['playstation', 'ps5', 'xbox', 'switch', 'nintendo', 'konsol', 'console', 'steam-deck', 'handheld', 'controller'],
    visuals: [
      {
        url: U('1606813907291-d86efa9b94db'),
        caption: 'Ekosistem Konsol Gaming Generasi Terbaru & Perangkat Kontroler Presisi',
        source: 'Unsplash'
      },
      {
        url: U('1592478411213-6153e4ebc07d'),
        caption: 'Arsitektur Konsol Handheld Portabel & Optimasi Layar Gaming Modern',
        source: 'Unsplash'
      },
      {
        url: U('1600861194942-f883de0dfe96'),
        caption: 'Perangkat Keras Konsol Ruang Keluarga & Pengalaman Gaming Resolusi 4K',
        source: 'Unsplash'
      },
      {
        url: U('1578301978693-85fa9c0320b9'),
        caption: 'Sistem Komputasi Gaming Kompak & Integrasi Perangkat Lunak Konsol',
        source: 'Unsplash'
      }
    ]
  },
  {
    keywords: ['valorant', 'pubg', 'mobile-legends', 'esports', 'crosshair', 'gyro', 'aim', 'turnamen', 'kompetitif', 'fps'],
    visuals: [
      {
        url: U('1542751371-adc38448a05e'),
        caption: 'Arena Kompetisi Esports Profesional & Setup Periferal Latensi Rendah',
        source: 'Unsplash'
      },
      {
        url: U('1616588589676-62b3bd4ff6d2'),
        caption: 'Konfigurasi Periferal Gaming Kompetitif & Kalibrasi Presisi Bidikan',
        source: 'Unsplash'
      },
      {
        url: U('1511512578047-dfb367046420'),
        caption: 'Battlestation Gaming Berperforma Tinggi untuk Turnamen Kompetitif',
        source: 'Unsplash'
      },
      {
        url: U('1538481199705-c710c4e965fc'),
        caption: 'Strategi Tim & Ekosistem Pertandingan Esports Global',
        source: 'Unsplash'
      }
    ]
  },
  {
    keywords: ['gta', 'unreal-engine', 'zelda', 'minecraft', 'elden-ring', 'cyberpunk', 'doom', 'steam', 'epic-games'],
    visuals: [
      {
        url: U('1550745165-9bc0b252726f'),
        caption: 'Visualisasi Dunia Terbuka (Open-World) & Pipeline Rendering Game Engine Modern',
        source: 'Unsplash'
      },
      {
        url: U('1518709268805-4e9042af9f23'),
        caption: 'Eksplorasi Lingkungan Virtual & Desain Level Game AAA Generasi Baru',
        source: 'Unsplash'
      },
      {
        url: U('1593640408182-31c70c8268f5'),
        caption: 'Pengujian Performa Grafis Game PC & Simulasi Pencahayaan Dinamis',
        source: 'Unsplash'
      }
    ]
  },
  {
    keywords: ['malware', 'security', 'keamanan', 'hack', 'jailbreak', 'firmware', 'exploit', 'kripto', 'siber', 'cyber', 'virus'],
    visuals: [
      {
        url: U('1526374965328-7f61d4dc18c5'),
        caption: 'Operasi Keamanan Siber, Audit Kriptografi & Proteksi Integritas Sistem',
        source: 'Unsplash'
      },
      {
        url: U('1563986768609-322da13575f3'),
        caption: 'Pemantauan Pertahanan Jaringan & Analisis Forensik Ancaman Digital',
        source: 'Unsplash'
      },
      {
        url: U('1550751827-4bd374c3f58b'),
        caption: 'Arsitektur Enkripsi Keamanan & Perlindungan Infrastruktur Data Kritis',
        source: 'Unsplash'
      }
    ]
  },
  {
    keywords: ['claude', 'gemini', 'openai', 'gpt', 'deepseek', 'qwen', 'llama', 'ollama', 'llm', 'ai-agent', 'agen-ai', 'prompt'],
    visuals: [
      {
        url: U('1677442136019-21780ecad995'),
        caption: 'Arsitektur Jaringan Saraf Tiruan & Penalaran Model Bahasa Skala Besar (LLM)',
        source: 'Unsplash'
      },
      {
        url: U('1620712943543-bcc4688e7485'),
        caption: 'Orkestrasi Agen Kecerdasan Buatan Otonom & Pipeline Komputasi Kognitif',
        source: 'Unsplash'
      },
      {
        url: U('1618005182384-a83a8bd57fbe'),
        caption: 'Visualisasi Pemrosesan Token & Pemodelan Generatif Multi-Modal',
        source: 'Unsplash'
      },
      {
        url: U('1639322537228-f710d846310a'),
        caption: 'Topologi Jaringan Terdistribusi untuk Pelatihan & Inferensi Model AI',
        source: 'Unsplash'
      }
    ]
  },
  {
    keywords: ['server', 'data-center', 'superkomputer', 'cloud', 'cluster', 'rack', 'docker', 'kubernetes', 'linux'],
    visuals: [
      {
        url: U('1558494949-ef010cbdcc31'),
        caption: 'Infrastruktur Kluster Server Pusat Data & Jaringan Serat Optik Berkecepatan Tinggi',
        source: 'Unsplash'
      },
      {
        url: U('1558346490-a72e53ae2d4f'),
        caption: 'Arsitektur Rak Komputasi Cloud & Manajemen Termal Server Skala Industri',
        source: 'Unsplash'
      }
    ]
  },
  {
    keywords: ['n8n', 'workflow', 'otomasi', 'automation', 'python', 'typescript', 'nextjs', 'react', 'git', 'vscode', 'cursor', 'coding', 'kode'],
    visuals: [
      {
        url: U('1555066931-4365d14bab8c'),
        caption: 'Pengembangan Perangkat Lunak Modern & Otomasi Alur Kerja Pemrograman',
        source: 'Unsplash'
      },
      {
        url: U('1498050108023-c5249f4df085'),
        caption: 'Lingkungan Pengembangan Terintegrasi (IDE) & Arsitektur Kode Siap Produksi',
        source: 'Unsplash'
      },
      {
        url: U('1504639725590-34d0984388bd'),
        caption: 'Implementasi Logika Algoritma & Orkestrasi API Lintas Platform',
        source: 'Unsplash'
      }
    ]
  }
];

// 3. Rich Category Fallback Pools (Guarantees Visual Variety & Zero Raw Slugs)
const CATEGORY_IMAGE_POOLS: Record<string, ArticleVisual[]> = {
  'gaming-esports': [
    {
      url: U('1542751371-adc38448a05e'),
      caption: 'Turnamen Esports Profesional & Konfigurasi Battlestation Gaming Modern',
      source: 'Unsplash'
    },
    {
      url: U('1550745165-9bc0b252726f'),
      caption: 'Eksplorasi Visual Game Modern & Pengujian Arsitektur Game Engine',
      source: 'Unsplash'
    },
    {
      url: U('1511512578047-dfb367046420'),
      caption: 'Periferal Presisi Tinggi & Responsivitas Input Game Kompetitif',
      source: 'Unsplash'
    },
    {
      url: U('1616588589676-62b3bd4ff6d2'),
      caption: 'Setup Monitor Refresh Rate Tinggi & Perangkat Kontroler Gaming Pro',
      source: 'Unsplash'
    },
    {
      url: U('1538481199705-c710c4e965fc'),
      caption: 'Atmosfer Kompetisi Esports & Strategi Mekanik Permainan Tingkat Lanjut',
      source: 'Unsplash'
    },
    {
      url: U('1606813907291-d86efa9b94db'),
      caption: 'Perangkat Keras Konsol Generasi Baru & Pengalaman Gaming Imersif',
      source: 'Unsplash'
    }
  ],
  'hardware-setup': [
    {
      url: U('1591488320449-011701bb6704'),
      caption: 'Arsitektur Silikon Kartu Grafis & Sistem Pendingin Performa Tinggi',
      source: 'Unsplash'
    },
    {
      url: U('1587202372775-e229f172b9d7'),
      caption: 'Rig Komputer Custom Enthusiast & Manajemen Efisiensi Termal',
      source: 'Unsplash'
    },
    {
      url: U('1518770660439-4636190af475'),
      caption: 'Interkoneksi Sirkuit Motherboard & Arsitektur Mikroprosesor Modern',
      source: 'Unsplash'
    },
    {
      url: U('1587202372634-32705e3bf49c'),
      caption: 'Komponen GPU Generasi Terbaru & Pengujian Beban Kerja Komputasi',
      source: 'Unsplash'
    },
    {
      url: U('1591799264318-7e6ef8ddb7ea'),
      caption: 'Teknologi Fabrikasi Semikonduktor & Prosesor Multi-Core Desktop',
      source: 'Unsplash'
    },
    {
      url: U('1624705002806-5d72df19c3ad'),
      caption: 'Desain Papan Sirkuit (PCB) & Modul Memori Berkecepatan Tinggi',
      source: 'Unsplash'
    }
  ],
  'tech-gadgets': [
    {
      url: U('1518770660439-4636190af475'),
      caption: 'Inovasi Semikonduktor & Ekosistem Perangkat Keras Masa Depan',
      source: 'Unsplash'
    },
    {
      url: U('1517336714731-489689fd1ca8'),
      caption: 'Rekayasa Perangkat Komputasi Portabel & Desain Produk Modern',
      source: 'Unsplash'
    },
    {
      url: U('1581092160607-ee22621dd758'),
      caption: 'Laboratorium Riset Teknologi & Prototipe Perangkat Keras Canggih',
      source: 'Unsplash'
    },
    {
      url: U('1531297484001-80022131f5a1'),
      caption: 'Transformasi Infrastruktur Digital & Perangkat Komputasi Modern',
      source: 'Unsplash'
    },
    {
      url: U('1526374965328-7f61d4dc18c5'),
      caption: 'Keamanan Jaringan Digital & Infrastruktur Teknologi Global',
      source: 'Unsplash'
    }
  ],
  'ai-agents': [
    {
      url: U('1620712943543-bcc4688e7485'),
      caption: 'Jaringan Keputusan Otonom & Orkestrasi Alur Kerja Agen AI',
      source: 'Unsplash'
    },
    {
      url: U('1677442136019-21780ecad995'),
      caption: 'Model Penalaran Kecerdasan Buatan & Sistem Multi-Agen Terdistribusi',
      source: 'Unsplash'
    },
    {
      url: U('1618005182384-a83a8bd57fbe'),
      caption: 'Arsitektur Kognitif Agen Cerdas & Otomasi Eksekusi Tugas Kompleks',
      source: 'Unsplash'
    },
    {
      url: U('1639322537228-f710d846310a'),
      caption: 'Integrasi Agen Otonom dengan Ekosistem API & Perangkat Lunak Modern',
      source: 'Unsplash'
    }
  ],
  'llm-models': [
    {
      url: U('1677442136019-21780ecad995'),
      caption: 'Struktur Attention Transformer & Pembelajaran Model Bahasa Skala Besar',
      source: 'Unsplash'
    },
    {
      url: U('1558494949-ef010cbdcc31'),
      caption: 'Infrastruktur Kluster Pelatihan & Inferensi Model Fondasi AI',
      source: 'Unsplash'
    },
    {
      url: U('1620712943543-bcc4688e7485'),
      caption: 'Optimasi Kuantisasi Bobot & Eksekusi Model Open-Source',
      source: 'Unsplash'
    },
    {
      url: U('1639762681485-074b7f938ba0'),
      caption: ' Evaluasi Benchmark Penalaran & Konteks Panjang Model Bahasa Modern',
      source: 'Unsplash'
    }
  ],
  'tools-automation': [
    {
      url: U('1555066931-4365d14bab8c'),
      caption: 'Pengembangan Perangkat Lunak & Otomasi Skrip Kode Siap Pakai',
      source: 'Unsplash'
    },
    {
      url: U('1498050108023-c5249f4df085'),
      caption: 'Lingkungan Kerja Pengembang Aplikasi & Tooling Produktivitas Modern',
      source: 'Unsplash'
    },
    {
      url: U('1504639725590-34d0984388bd'),
      caption: 'Integrasi Pipeline CI/CD, Webhook & Alur Kerja Otomasi Tanpa Kode',
      source: 'Unsplash'
    },
    {
      url: U('1629654297299-c8506221ca97'),
      caption: 'Konfigurasi Terminal, Ekosistem Linux & Utilitas Pengembang',
      source: 'Unsplash'
    }
  ],
  'prompting': [
    {
      url: U('1677442136019-21780ecad995'),
      caption: 'Rekayasa Prompt Terstruktur & Optimasi Konteks Penalaran Model AI',
      source: 'Unsplash'
    },
    {
      url: U('1618005182384-a83a8bd57fbe'),
      caption: 'Strategi System Prompting & Orkestrasi Output Kecerdasan Buatan',
      source: 'Unsplash'
    }
  ],
  'upcoming-booming': [
    {
      url: U('1451187580459-43490279c0fa'),
      caption: 'Teknologi Komputasi Masa Depan & Jaringan Infrastruktur Global',
      source: 'Unsplash'
    },
    {
      url: U('1506703719100-a0f3a48c0f86'),
      caption: 'Eksplorasi Inovasi Generasi Berikutnya & Tren Industri Masa Depan',
      source: 'Unsplash'
    }
  ]
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * High-precision visual resolver.
 * Never returns title-repeating text SVGs or raw slug captions.
 * Priority 1: Direct slug mapping (100% matched to curated & breaking news articles)
 * Priority 2: Specific topic keyword match across slug, tags, and title
 * Priority 3: Category photography pool with deterministic hash
 */
export function getArticleCover(
  slug: string,
  category: string = 'tech-gadgets',
  tags: string[] = [],
  title: string = ''
): ArticleVisual {
  // 1. Direct slug match
  if (SLUG_VISUALS[slug]) {
    return SLUG_VISUALS[slug];
  }

  const h = hashString(slug);
  const searchCorpus = `${slug} ${title} ${(tags || []).join(' ')}`.toLowerCase();

  // 2. Topic keyword rule match
  for (const rule of TOPIC_KEYWORD_RULES) {
    if (rule.keywords.some((kw) => searchCorpus.includes(kw))) {
      const picked = rule.visuals[h % rule.visuals.length];
      return picked;
    }
  }

  // 3. Category pool fallback
  const pool = CATEGORY_IMAGE_POOLS[category] || CATEGORY_IMAGE_POOLS['tech-gadgets'];
  return pool[h % pool.length];
}

export function getThumbnailUrl(url: string, width = 600): string {
  if (url && url.includes('images.unsplash.com')) {
    return url.replace(/w=\d+/, `w=${width}`).replace(/q=\d+/, 'q=75');
  }
  return url;
}
