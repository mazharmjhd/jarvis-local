J.A.R.V.I.S. — Localhost Voice Assistant

J.A.R.V.I.S. (Just A Rather Very Intelligent System) adalah asisten AI pribadi lokal berbasis web interface futuristik (Stark-Class HUD Interface). Proyek ini mengintegrasikan **FastAPI WebSocket** di backend untuk menangani komunikasi data secara *real-time*, **Ollama (Model: Qwen2.5:3b)** sebagai otak pemrosesan bahasa lokal, dan fitur bawaan browser **Web Speech API** untuk interaksi berbasis suara (*Speech-to-Text* & *Text-to-Speech*).

Fitur Utama
- **Stark-Class Sci-Fi HUD:** Tampilan reaktor busur (*Arc Reactor*) interaktif yang berubah status/warna secara dinamis (`STANDBY`, `BERPIKIR`, `BERBICARA`, `MENDENGARKAN`).
- **Local AI Processing:** Menggunakan model Open-Source `qwen2.5:3b` yang berjalan 100% lokal melalui Ollama tanpa ketergantungan API eksternal.
- **Real-Time Communication:** Menggunakan protokol WebSockets untuk memotong *latency* pengiriman pesan antara interface dan model AI.
- **Voice Integration:** Fitur pengenalan suara via mikrofon bawaan browser dan *Text-to-Speech* otomatis dengan filter cerdas untuk mendeteksi suara karakter pria (*male voice*).


Kebutuhan Sistem & Dependensi (Prerequisites)

Sebelum menjalankan proyek ini, pastikan perangkat Anda telah menginstal komponen-komponen berikut:

1. Lingkungan Sistem (System Environment)
- **Python:** Versi `3.9` hingga `3.11` (Direkomendasikan versi Python 3.10+).
- **Ollama:** Platform untuk menjalankan LLM secara lokal ([Unduh Ollama di sini](https://ollama.com/)).
- **Modern Web Browser:** Google Chrome, Microsoft Edge, atau browser berbasis Chromium lainnya (diperlukan agar fitur *Speech Recognition* berjalan optimal).

2. Dependensi Backend (`backend/requirements.txt`)
- `fastapi==0.111.0` (Framework API Web)
- `uvicorn==0.30.1` (Server ASGI untuk menjalankan FastAPI)
- `websockets==12.0` (Protokol WebSocket untuk Python)
- `requests==2.32.3` (Untuk mengirim request HTTP ke endpoint API Ollama)

Langkah-Langkah Instalasi & Cara Menjalankan

Ikuti panduan langkah demi langkah di bawah ini untuk memasang dan menjalankan J.A.R.V.I.S. di komputer lokal Anda:

Langkah 1: Persiapan Model AI (Ollama)
1. Pastikan aplikasi **Ollama** sudah terpasang dan sedang berjalan di latar belakang (*background system*).
2. Buka Terminal atau Command Prompt Anda, lalu unduh model `qwen2.5:3b` dengan menjalankan perintah berikut:
   ```bash
   ollama run qwen2.5:3b
