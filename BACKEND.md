# Backend API Documentation

## Overview

The Voice Cluster backend is a FastAPI application that handles audio processing, embedding extraction, and clustering. It serves as the bridge between the React frontend and the core Python audio processing pipeline.

## Setup

### Prerequisites
- Python 3.10+
- pip or conda
- ~2GB disk space for model downloads (first run)

### Installation

1. **Create virtual environment (recommended):**
   ```bash
   python -m venv voice_env
   # Windows
   voice_env\Scripts\activate
   # Unix/macOS
   source voice_env/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

   This installs:
   - FastAPI & Uvicorn (web framework)
   - SpeechBrain (audio embeddings)
   - scikit-learn (clustering)
   - LibROSA (audio processing)
   - PyTorch (deep learning)

3. **Verify installation:**
   ```bash
   python -c "import fastapi, speechbrain, torch; print('All dependencies OK')"
   ```

## Running the Server

### Development Mode (with auto-reload)
```bash
cd Voice_Cluster
python -m uvicorn backend.api:app --reload
```

Output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Started reloader process
```

### Production Mode
```bash
uvicorn backend.api:app --host 0.0.0.0 --port 8000 --workers 4
```

### With Gunicorn
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.api:app
```

## API Reference

### Endpoints

#### 1. Health Check
```
GET /health
```
**Purpose:** Verify backend is running

**Response:**
```json
{"status": "ok"}
```

---

#### 2. List Files
```
GET /files
```
**Purpose:** Get all uploaded audio files

**Response:**
```json
{
  "files": ["speaker1.wav", "speaker2.wav", "speaker3.mp3"]
}
```

---

#### 3. Upload Files
```
POST /upload
Content-Type: multipart/form-data
```
**Parameters:**
- `files` (multipart): One or more audio files

**Supported Formats:**
- `.wav` — WAV audio
- `.mp3` — MP3 audio
- `.mp4` — MP4 video (audio extracted)
- `.flac` — FLAC audio
- `.ogg` — OGG audio

**Response:**
```json
{
  "uploaded": ["file1.wav", "file2.mp3"]
}
```

**Errors:**
- `400 Bad Request` — Unsupported file type
- `413 Payload Too Large` — File too large

**Example (curl):**
```bash
curl -X POST http://localhost:8000/upload \
  -F "files=@audio1.wav" \
  -F "files=@audio2.wav"
```

---

#### 4. Run Clustering
```
POST /cluster
```
**Purpose:** Process all uploaded files and run clustering

**Response:**
```json
{
  "files": ["file1.wav", "file2.wav", "file3.wav"],
  "labels": [0, 0, 1],
  "clusters": {
    "cluster_1": ["file1.wav", "file2.wav"],
    "cluster_2": ["file3.wav"]
  },
  "coordinates_2d": [
    [10.5, 20.3],
    [10.2, 19.8],
    [50.1, 60.2]
  ],
  "failed_files": []
}
```

**Response Fields:**
- `files` — List of processed files
- `labels` — DBSCAN cluster label for each file
- `clusters` — Dictionary mapping cluster ID to file names
- `coordinates_2d` — t-SNE 2D coordinates for visualization
- `failed_files` — Files that failed processing

**Errors:**
- `500 Internal Server Error` — Clustering failed (check logs)

---

#### 5. Get Audio File (Static)
```
GET /data/audio/{filename}
```
**Purpose:** Stream audio file for playback

**Supported from:** Frontend audio player

## Core Modules

### `backend/api.py`
Main FastAPI application with endpoint definitions.

**Key Functions:**
- `upload_audio()` — Handle file uploads
- `cluster_audio()` — Run clustering pipeline
- `list_files()` — Return available files

### `backend/service.py`
Core audio processing and clustering logic.

**Key Functions:**
- `process_audio_folder(folder)` — Main clustering pipeline
- `extract_embedding(file_path)` — Get audio embedding
- `convert_mp4_to_wav(video_path)` — Extract audio from video
- `allowed_extensions()` — List supported formats

## Configuration

### Clustering Parameters
Edit `backend/service.py`:

```python
def cluster_embeddings(embeddings):
    clustering = DBSCAN(
        eps=0.6,           # Distance threshold (lower = more clusters)
        min_samples=1,      # Min files per cluster
        metric="cosine"     # Distance metric
    ).fit(embeddings)
    return clustering.labels_
```

**DBSCAN Parameters:**
- `eps` — Smaller = more clusters (0.3-0.8 recommended)
- `min_samples` — Minimum cluster size (1 recommended)
- `metric` — `"cosine"` recommended for audio embeddings

### Embedding Model
Edit `backend/service.py`:

```python
classifier = EncoderClassifier.from_hparams(
    source="speechbrain/spkrec-ecapa-voxceleb"
)
```

**Available Models:**
- `speechbrain/spkrec-ecapa-voxceleb` — State-of-the-art (recommended)
- `speechbrain/spkrec-xvector-voxceleb` — Faster, slightly less accurate

### t-SNE Visualization
Edit `backend/service.py`:

```python
tsne = TSNE(
    n_components=2,
    random_state=42,
    perplexity=min(5, len(names) - 1)
)
```

**Parameters:**
- `n_components=2` — 2D visualization (don't change)
- `perplexity` — Should be 5-50 (auto-adjusted for small datasets)
- `random_state=42` — Reproducible results

## Performance

### Benchmarks
- **Audio Processing:** 0.5-2s per file (depends on duration & hardware)
- **Embedding Extraction:** 1-3s per file
- **Clustering (DBSCAN):** 0.1s for 100 files
- **t-SNE (visualization):** 2-5s for 50+ files

### GPU Acceleration
Install CUDA support for PyTorch:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

Then SpeechBrain will automatically use GPU. Check:
```python
import torch
print(torch.cuda.is_available())  # Should print True
```

## Error Handling

### Common Errors

**"No module named 'backend'"**
- Solution: Run from `Voice_Cluster` directory
- Use: `cd Voice_Cluster && python -m uvicorn backend.api:app --reload`

**"CUDA out of memory"**
- Solution: Reduce batch size or use CPU
- Set: `export CUDA_VISIBLE_DEVICES=""` for CPU-only

**"Failed to download embedding model"**
- Solution: Check internet connection, models download on first run
- Models stored in `~/.cache/huggingface/`

**"Port 8000 already in use"**
- Solution: `uvicorn backend.api:app --port 8001`

## CORS Configuration

The backend allows requests from:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

To add more origins, edit `backend/api.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "YOUR_URL_HERE"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Logging

View detailed logs with:
```bash
# Verbose output
uvicorn backend.api:app --reload --log-level debug
```

Logs show:
- Request/response details
- Processing times
- Errors and tracebacks
- Audio file processing progress

## Database & Persistence

**Current Implementation:**
- Files stored in `data/audio/`
- No database (files = state)
- Session-based (no persistence between restarts)

**Data Flow:**
1. Upload → `data/audio/` folder
2. Process → Compute embeddings & clusters
3. Response → Send results to frontend
4. Cleanup → Optional: Delete old files

## Testing

### Manual Testing with curl

1. **Upload:**
   ```bash
   curl -X POST http://localhost:8000/upload \
     -F "files=@test.wav"
   ```

2. **List:**
   ```bash
   curl http://localhost:8000/files
   ```

3. **Cluster:**
   ```bash
   curl -X POST http://localhost:8000/cluster
   ```

### Automated Testing
```bash
pytest backend/tests/
```

## Deployment

### Docker
```dockerfile
FROM python:3.10
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.api:app", "--host", "0.0.0.0"]
```

### Heroku
```bash
heroku create voice-cluster
git push heroku main
```

### AWS EC2
```bash
# SSH into instance
ssh -i key.pem ec2-user@instance

# Setup
git clone <repo>
cd Voice_Cluster
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# Run with systemd
sudo systemctl start voice-cluster
```

## Troubleshooting

### Check System
```bash
# Python version
python --version  # Should be 3.10+

# Dependencies installed
pip list | grep fastapi

# Port available
lsof -i :8000  # Check if 8000 in use
```

### Debug Mode
Add to `backend/api.py`:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### View All Files
```bash
ls -la data/audio/
```

## Support & Contribution

For issues:
1. Check logs for error details
2. Review troubleshooting section
3. Test with known-good audio files
4. Create GitHub issue with logs

## License

See main README.md
