import json
import requests
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Mengizinkan koneksi dari frontend browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/generate"

def tanya_ollama(prompt: str) -> str:
    """Fungsi untuk mengirim teks ke model AI lokal"""
    payload = {
        "model": "qwen2.5:3b",
        "prompt": prompt,
        "stream": False
    }
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=30)
        if response.status_code == 200:
            return response.json().get("response", "Maaf, saya tidak mendapatkan respons.")
        else:
            return f"Ollama merespon dengan kode error: {response.status_code}"
    except Exception as e:
        return f"Gagal terhubung ke otak AI (Pastikan Ollama sudah aktif): {str(e)}"

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("\n[INFO] Frontend Jarvis Terhubung ke WebSocket.")
    try:
        while True:
            # Menerima data dari JavaScript
            data = await websocket.receive_text()
            request_data = json.loads(data)
            pesan_user = request_data.get("pesan", "")
            
            if not pesan_user.strip():
                continue
                
            print(f"[USER]: {pesan_user}")
            
            # 1. Kirim status ke JS bahwa Jarvis sedang berpikir
            await websocket.send_text(json.dumps({"status": "berpikir", "respons": ""}))
            
            # 2. Ambil jawaban dari AI lokal
            jawaban_ai = tanya_ollama(pesan_user)
            
            print(f"[JARVIS]: {jawaban_ai}")
            
            # 3. Kirim kembali jawaban ke JS untuk ditampilkan dan disuarakan
            await websocket.send_text(json.dumps({"status": "berbicara", "respons": jawaban_ai}))
            
    except WebSocketDisconnect:
        print("[INFO] Frontend Jarvis Terputus dari WebSocket.")
    except Exception as e:
        print(f"[ERROR]: Terjadi masalah pada WebSocket: {str(e)}")

# PENTING: Baris ini harus menempel di kiri bodi file (tanpa spasi/tab di depannya)
if __name__ == "__main__":
    import uvicorn
    print("[STARTING] Menjalankan server Jarvis di localhost port 8000...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)