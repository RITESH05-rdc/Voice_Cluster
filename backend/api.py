from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from typing import List
import shutil
import traceback

from backend.service import process_audio_folder, get_audio_files, allowed_extensions

ROOT_DIR = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT_DIR / "data" / "audio"

app = FastAPI(title="Voice Cluster API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount audio directory for static file serving
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/data/audio", StaticFiles(directory=str(AUDIO_DIR)), name="audio")


def health():
    return {"status": "ok"}


@app.get("/health")
def get_health():
    return health()


@app.get("/files")
def list_files():
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    files = get_audio_files(AUDIO_DIR)
    return {"files": files}


async def save_upload_file(upload_file: UploadFile, destination: Path):
    with destination.open("wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)


@app.post("/upload")
async def upload_audio(files: List[UploadFile] = File(...)):
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    uploaded_names = []

    for upload in files:
        if not upload.filename:
            continue

        extension = Path(upload.filename).suffix.lower()
        if extension not in allowed_extensions():
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {upload.filename}")

        destination = AUDIO_DIR / upload.filename
        await save_upload_file(upload, destination)
        uploaded_names.append(destination.name)

    return {"uploaded": uploaded_names}


@app.post("/cluster")
def cluster_audio():
    try:
        AUDIO_DIR.mkdir(parents=True, exist_ok=True)
        result = process_audio_folder(AUDIO_DIR)
        return result
    except Exception as e:
        print(f"Clustering error: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Clustering failed: {str(e)}")

