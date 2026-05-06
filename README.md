# Voice Cluster

Voice Cluster is a Python project for speaker clustering using audio data. It includes modules for preprocessing audio, extracting embeddings, and clustering speakers.

## Project Structure

- `main.py` — Main entry point for running the pipeline locally.
- `backend/` — FastAPI service wrapping the speaker clustering pipeline.
- `frontend/` — TypeScript React UI for uploading audio and viewing cluster results.
- `clustering/cluster_speakers.py` — Speaker clustering logic.
- `embedding/extract_embedding.py` — Audio embedding extraction.
- `preprocessing/preprocess_audio.py` — Audio preprocessing utilities.
- `data/audio/` — Directory for storing audio files.
- `voice_env/` — Python virtual environment (do not edit directly).

## Backend Setup

1. Create and activate a Python environment.
   ```bash
   python -m venv voice_env
   # On Windows:
   voice_env\Scripts\activate
   # On Unix or MacOS:
   source voice_env/bin/activate
   ```
2. Install backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Start the API:
   ```bash
   uvicorn backend.api:app --reload
   ```

The backend exposes:
- `GET /health`
- `GET /files`
- `POST /upload`
- `POST /cluster`

## Frontend Setup

1. Install Node.js dependencies from the frontend folder.
   ```bash
   cd frontend
   npm install
   ```
2. Start the UI app.
   ```bash
   npm run dev
   ```
3. Open the local Vite URL (usually `http://localhost:5173`).

## Usage

1. Upload audio or MP4 files from the frontend UI.
2. Run clustering from the UI.
3. View the grouped cluster results in the browser.

## Notes

- The frontend and backend are intentionally separate for easier integration.
- The backend stores uploaded audio in `data/audio/` and clusters all supported files.
- The root `main.py` continues to work as a local pipeline entrypoint.

## License
RDC.
