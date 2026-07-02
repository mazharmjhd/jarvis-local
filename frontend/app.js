const jarvisCore = document.getElementById("jarvis-core");
const statusText = document.getElementById("status-text");
const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");
const btnKirim = document.getElementById("btn-kirim");
const btnBicara = document.getElementById("btn-bicara");

// ===== Nama suara pria yang ingin dipakai (opsional) =====
// Kosongkan "" untuk auto-pilih. Isi persis nama voice dari console
// (lihat log "SUARA TERSEDIA" di console browser setelah halaman dimuat)
// contoh: "Microsoft Andrew Online (Natural) - English (United States)"
const PREFERRED_VOICE_NAME = "";

// ===== Koneksi WebSocket + auto-reconnect =====
let socket;
let reconnectTimer = null;

function connectWebSocket() {
    socket = new WebSocket("ws://127.0.0.1:8000/ws");

    socket.onopen = () => {
        console.log("[WS] Terhubung ke backend.");
        updateStatus("JARVIS: STANDBY", "");
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);

        if (data.status === "berpikir") {
            updateStatus("JARVIS SEDANG BERPIKIR...", "berpikir");
        } else if (data.status === "berbicara") {
            updateStatus("JARVIS: BERBICARA", "berbicara");
            appendChat(data.respons, "bot-msg");
            suarakanTeks(data.respons);
        }
    };

    socket.onerror = (err) => {
        console.error("[WS] Error koneksi:", err);
        updateStatus("JARVIS: KONEKSI GAGAL", "");
    };

    socket.onclose = () => {
        console.warn("[WS] Terputus dari backend. Mencoba menyambung ulang dalam 2 detik...");
        updateStatus("JARVIS: TERPUTUS - RECONNECTING...", "");
        clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(connectWebSocket, 2000);
    };
}

connectWebSocket();

// Fitur Pengenalan Suara Bawaan Web Browser (Sangat Ringan)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "id-ID"; // Format Bahasa Indonesia

    recognition.onstart = () => {
        updateStatus("MENDENGARKAN...", "mendengarkan");
    };

    recognition.onresult = (event) => {
        const hasilSuara = event.results[0][0].transcript;
        appendChat(hasilSuara, "user-msg");
        kirimKeBackend(hasilSuara);
    };

    recognition.onerror = () => {
        updateStatus("JARVIS: STANDBY", "");
    };
}

function kirimKeBackend(teks) {
    if (teks.trim() === "") return;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error("[WS] Belum terhubung ke backend, pesan tidak terkirim.");
        appendChat("(Tidak terhubung ke server. Pastikan main.py sedang berjalan.)", "bot-msg");
        updateStatus("JARVIS: TIDAK TERHUBUNG", "");
        return;
    }

    socket.send(JSON.stringify({ pesan: teks }));
}

// ===== Pemilihan suara pria untuk Text-To-Speech =====
let suaraTerpilih = null;

function pilihSuaraPria() {
    const daftarSuara = window.speechSynthesis.getVoices();
    if (daftarSuara.length === 0) return; // belum termuat

    console.log("[TTS] SUARA TERSEDIA di browser ini:");
    console.table(daftarSuara.map(v => ({ name: v.name, lang: v.lang })));

    // 1. Kalau user sudah pilih manual lewat PREFERRED_VOICE_NAME, pakai itu
    if (PREFERRED_VOICE_NAME) {
        suaraTerpilih = daftarSuara.find(v => v.name === PREFERRED_VOICE_NAME) || null;
        if (suaraTerpilih) return;
    }

    // 2. Cari suara pria yang eksplisit disebut "male" di namanya
    suaraTerpilih = daftarSuara.find(v => /male/i.test(v.name) && !/female/i.test(v.name));

    // 3. Cari nama-nama suara pria yang umum tersedia (macOS/Windows/Chrome)
    if (!suaraTerpilih) {
        const namaPriaUmum = ["daniel", "david", "andrew", "guy", "alex", "fred", "eddy", "reed"];
        suaraTerpilih = daftarSuara.find(v => namaPriaUmum.some(n => v.name.toLowerCase().includes(n)));
    }

    // 4. Fallback: suara Bahasa Indonesia apapun yang ada (mungkin bukan pria)
    if (!suaraTerpilih) {
        suaraTerpilih = daftarSuara.find(v => v.lang.toLowerCase().startsWith("id"));
    }

    if (suaraTerpilih) {
        console.log(`[TTS] Suara dipilih otomatis: "${suaraTerpilih.name}" (${suaraTerpilih.lang})`);
    } else {
        console.warn("[TTS] Tidak ada suara pria/Indonesia ditemukan, memakai default browser.");
    }
}

// Voices sering baru termuat async setelah halaman dibuka
window.speechSynthesis.onvoiceschanged = pilihSuaraPria;
pilihSuaraPria();

function suarakanTeks(teks) {
    window.speechSynthesis.cancel(); // hentikan ucapan sebelumnya kalau masih jalan
    const speech = new SpeechSynthesisUtterance(teks);

    if (suaraTerpilih) {
        speech.voice = suaraTerpilih;
        speech.lang = suaraTerpilih.lang;
    } else {
        speech.lang = "id-ID";
    }

    speech.pitch = 0.85;  // sedikit lebih rendah, kesan maskulin
    speech.rate = 1.0;

    speech.onend = () => {
        updateStatus("JARVIS: STANDBY", "");
    };
    window.speechSynthesis.speak(speech);
}

function updateStatus(label, kelasAnimasi) {
    statusText.innerText = label;
    jarvisCore.className = "arc-reactor " + kelasAnimasi;
}

function appendChat(teks, tipeKelas) {
    const div = document.createElement("div");
    div.className = tipeKelas;
    div.innerText = teks;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// Event Listener Tombol
btnKirim.addEventListener("click", () => {
    const teks = userInput.value;
    if(teks) {
        appendChat(teks, "user-msg");
        kirimKeBackend(teks);
        userInput.value = "";
    }
});

btnBicara.addEventListener("click", () => {
    if (recognition) recognition.start();
    else alert("Browser Anda tidak mendukung pengenalan suara.");
});