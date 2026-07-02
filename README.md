<img width="1430" height="686" alt="image" src="https://github.com/user-attachments/assets/d7e02745-97b2-47f4-80c0-18a6b969753e" />


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

Setelah proses download selesai, Anda bisa menutup terminal tersebut. Pastikan server base Ollama aktif di alamat default: http://127.0.0.1:11434.

Langkah 2: Kloning Repositori
Buka terminal baru, lalu kloning repositori ini dan masuk ke dalam direktori proyek:

Bash
git clone [https://github.com/mazharmjhd/jarvis-local.git](https://github.com/mazharmjhd/jarvis-local.git)
cd jarvis-local
Langkah 3: Konfigurasi & Menjalankan Backend
Masuk ke dalam direktori folder backend:

Bash
cd backend
(Sangat Direkomendasikan) Buat lingkungan virtual Python (Virtual Environment) agar dependensi tidak bentrok dengan sistem global Anda:

Bash
Untuk Windows:
python -m venv venv
venv\Scripts\activate

Untuk macOS/Linux:
python3 -m venv venv
source venv/bin/activate
Instal seluruh pustaka Python yang dibutuhkan yang terdaftar di requirements.txt:

Bash
pip install -r requirements.txt
Jalankan server backend FastAPI menggunakan Uvicorn:

Bash
python main.py
Jika berhasil, server backend akan berjalan di alamat http://127.0.0.1:8000 dan siap menerima koneksi WebSocket pada path /ws.

Langkah 4: Menjalankan Frontend Interface
Karena frontend dibuat menggunakan HTML, CSS, dan JavaScript murni (vanilla UI), Anda tidak perlu melakukan instalasi dependensi pihak ketiga (npm install).

Buka folder frontend di file explorer komputer Anda.

Klik dua kali pada file index.html untuk membukanya langsung di Google Chrome atau Microsoft Edge.

Alternatif Profesional: Jika Anda menggunakan VS Code, Anda bisa menginstal ekstensi Live Server, kemudian klik kanan pada file index.html dan pilih Open with Live Server (berjalan di http://127.0.0.1:5500) atau tinggal klick saja di folder frontend index.html nya jika backend sudah berjalan (untuk menampilkan GUI/ tampilan di web browser).

Cara Penggunaan Sistem
Saat halaman index.html terbuka, status indikator luar reaktor akan berwarna Cyan terang dengan label teks JARVIS: STANDBY.

Interaksi Teks: Ketik perintah teks Anda pada kolom input panel di bagian bawah, lalu klik tombol KIRIM atau tekan Enter.

Interaksi Suara: Klik tombol MIC. Izinkan browser mengakses mikrofon Anda jika muncul pop-up permission. Katakan perintah Anda setelah status berubah menjadi MENDENGARKAN... (Reaktor akan berubah menjadi Biru).

Ketika sistem mengirimkan perintah ke Ollama, Reaktor akan berputar cepat dan berubah warna menjadi Amber (JARVIS SEDANG BERPIKIR...).

Ketika jawaban diterima, J.A.R.V.I.S. akan merespons dalam bentuk teks ke log chat dan mengeluarkan output suara maskulin secara otomatis dengan indikator warna Hijau (JARVIS: BERBICARA).

Struktur Repositori Proyek


Plaintext
jarvis-local/
│
├── backend/
│   ├── main.py             # Server FastAPI & logika integrasi Ollama API
│   └── requirements.txt    # Daftar modul Python yang dibutuhkan
│
└── frontend/
    ├── index.html          # Struktur HUD interface bergaya Stark-Class
    ├── style.css           # Desain animasi reaktor, scanline efek, & grid panel
    └── app.js              # Logika koneksi WebSocket client & Web Speech API


Tips Tambahan Sebelum Commit ke GitHub:
1. Pastikan Anda meletakkan file tersebut dengan nama **`README.md`** tepat di dalam folder root (`jarvis-local/`), bukan di dalam folder backend atau frontend.
2. Jika Anda ingin mengganti suara default asisten menjadi spesifik, pengguna dapat dipandu untuk mengisi variabel `PREFERRED_VOICE_NAME` di dalam file `app.js` sesuai dengan daftar suara yang muncul pada *console log* browser mereka masing-masing.
