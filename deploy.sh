#!/bin/bash
set -e

echo "=== NETKODE HUB - DEPLOYMENT SCRIPT ==="

# 1. Update & Install Prerequisites jika belum ada
if ! command -v docker &> /dev/null; then
    echo "Docker belum terdeteksi. Menginstall Docker & Docker Compose..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# 2. Build dan Jalankan Container
echo "Membangun image & menjalankan container Docker..."
docker compose down || true
docker compose up -d --build

echo ""
echo "✅ DEPLOYMENT BERHASIL!"
echo "Website NetKode Hub sekarang berjalan pada port 80 dan 3000."
echo "Buka: http://$(curl -s ifconfig.me) atau IP VPS Anda di browser."
