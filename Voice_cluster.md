# Voice Cluster Module Documentation

## Overview

Voice Cluster is a small full-stack speaker clustering prototype. The current implementation lets a user upload audio files, extracts one embedding per file, clusters the embeddings, and shows the result in a browser UI.

The repo does not currently implement the larger cross-case, FAISS, database, or multi-algorithm pipeline described in older drafts of this document.

## Architecture

The project uses a simple two-tier architecture:

1. Frontend layer
	- A Vite + React app in `frontend/`.
	- Handles file upload, file listing, clustering triggers, and result display.
	- Renders cluster counts, a t-SNE scatter plot, and per-cluster audio playback controls.

2. Backend layer
	- A FastAPI service in `backend/api.py`.
	- Exposes `/health`, `/files`, `/upload`, and `/cluster`.
	- Stores uploaded files in `data/audio/` and serves them back for playback.

3. Processing layer
	- `backend/service.py` owns the folder-level pipeline.
	- Supported file types are `.wav`, `.mp4`, `.mp3`, `.flac`, `.ogg`, and `.m4a`.
	- MP4 files are converted to WAV before embedding extraction.
	- `embedding/extract_embedding.py` loads audio with `torchaudio` and extracts one embedding per file using SpeechBrain ECAPA-TDNN.
	- Embeddings are normalized with scikit-learn and clustered with DBSCAN from `clustering/cluster_speakers.py`.
	- t-SNE is used to compute 2D coordinates for the frontend visualization.

4. Local script path
	- `main.py` runs the same basic flow from the command line against files already placed in `data/audio/`.

Data flow is:
frontend upload -> backend file storage -> embedding extraction -> normalization -> DBSCAN clustering -> t-SNE projection -> frontend visualization.

## Features

- **File upload and management**: Upload audio files through the web UI; list all uploaded files; auto-convert MP4 to WAV.
- **Multi-format support**: Accept `.wav`, `.mp4`, `.mp3`, `.flac`, `.ogg`, and `.m4a` files.
- **Speaker embedding extraction**: Extract one 192-dimensional speaker embedding per file using SpeechBrain ECAPA-TDNN.
- **Automatic clustering**: Cluster embeddings with DBSCAN using cosine distance; handle variable numbers of clusters automatically.
- **2D visualization**: Compute and display t-SNE projections of the embedding space.
- **Cluster statistics**: Show total file count, cluster count, and average files per cluster.
- **Audio playback**: Play uploaded audio files directly in the browser from the cluster cards.
- **Local batch processing**: Run the clustering pipeline from the command line via `main.py` on files already in `data/audio/`.
- **REST API**: Programmatic access to file listing, upload, and clustering through FastAPI endpoints.

## What Is Actually Implemented

- Local batch clustering from files placed in `data/audio/`.
- A FastAPI backend with file upload, file listing, health check, and clustering endpoints.
- A SpeechBrain ECAPA-TDNN embedding extractor.
- A single clustering backend based on DBSCAN with cosine distance.
- A Vite + React frontend for upload, cluster execution, cluster summaries, and a t-SNE scatter plot.
- MP4-to-WAV conversion for local processing of video uploads.

## Project Layout

- `main.py` - Local script that scans `data/audio/`, extracts embeddings, normalizes them, and prints cluster assignments.
- `backend/api.py` - FastAPI service exposing `/health`, `/files`, `/upload`, and `/cluster`.
- `backend/service.py` - Shared backend logic for file filtering, MP4 conversion, embedding extraction, clustering, and t-SNE coordinates.
- `embedding/extract_embedding.py` - SpeechBrain-based embedding extraction.
- `clustering/cluster_speakers.py` - DBSCAN clustering wrapper.
- `preprocessing/preprocess_audio.py` - Standalone trimming helper using Librosa.
- `frontend/` - Vite app that uploads files and renders the clustered output.
- `data/audio/` - Storage directory for uploaded or locally processed audio files.

## Processing Flow

1. The user uploads audio through the frontend, or drops files into `data/audio/` for the local script.
2. The backend accepts `.wav`, `.mp4`, `.mp3`, `.flac`, `.ogg`, and `.m4a` files.
3. MP4 files are converted to WAV before embedding extraction.
4. `torchaudio` loads each file and SpeechBrain's `speechbrain/spkrec-ecapa-voxceleb` model produces an embedding.
5. Embeddings are normalized with scikit-learn.
6. DBSCAN clusters the embeddings using cosine distance.
7. The backend returns filenames, numeric cluster labels, grouped clusters, failed files, and 2D t-SNE coordinates for visualization.

## Backend API

- `GET /health` - Returns service status.
- `GET /files` - Lists uploaded audio files in `data/audio/`.
- `POST /upload` - Accepts multiple files under the `files` form field.
- `POST /cluster` - Runs the full folder-processing pipeline and returns clustering results.

Static files under `data/audio/` are also mounted at `/data/audio` for playback in the frontend.

## Frontend

The frontend is a lightweight visualization layer rather than a separate analysis engine.

- `App.tsx` handles upload, refresh, and cluster actions.
- `StatsDashboard` shows file and cluster counts.
- `ScatterPlot` renders the t-SNE projection with Plotly.
- `ClusterDisplay` shows clusters and lets the user pick a file for playback.
- `AudioPlayer` streams the selected audio file from `/data/audio/<filename>`.

## Model And Clustering Details

- Embedding model: SpeechBrain ECAPA-TDNN from `speechbrain/spkrec-ecapa-voxceleb`.
- Input handling: `torchaudio.load` in the embedding extractor; `librosa.load` plus trimming in the standalone preprocessing helper.
- Clustering: DBSCAN with `eps=0.6`, `min_samples=1`, and cosine distance.
- Visualization: t-SNE with a small perplexity cap for local datasets.

## Notes And Limits

- There is no FAISS index, database persistence, or cross-case matching in the current code.
- There is no CLI named `vc-cluster`, `vc-import`, or `vc-match`.
- There is no implemented `voice_cluster` Python package with classes such as `ClusterPipeline` or `VCConfig`.
- The preprocessing helper exists, but the main runtime flow does not currently call it.
- The project is best described as a working prototype, not a production-ready forensic pipeline.

## Related Documentation

- [README.md](README.md) contains the shorter, current summary of the app.
- [BACKEND.md](BACKEND.md) documents the backend in more detail.
- [FRONTEND.md](FRONTEND.md) documents the UI and frontend setup.

## Generated Summary

Generated on: 2026-05-15
