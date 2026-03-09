# Voice Cluster

Voice Cluster is a Python project for speaker clustering using audio data. It includes modules for preprocessing audio, extracting embeddings, and clustering speakers. The project is organized for easy experimentation and extension.

## Project Structure

- `main.py` — Main entry point for running the pipeline.
- `clustering/cluster_speakers.py` — Speaker clustering logic.
- `embedding/extract_embedding.py` — Audio embedding extraction.
- `preprocessing/preprocess_audio.py` — Audio preprocessing utilities.
- `data/audio/` — Directory for storing audio files.
- `voice_env/` — Python virtual environment (do not edit directly).

## Setup

1. **Clone the repository** and navigate to the project directory.
2. **Create and activate a virtual environment** (optional, recommended):
   ```bash
   python -m venv voice_env
   # On Windows:
   voice_env\Scripts\activate
   # On Unix or MacOS:
   source voice_env/bin/activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Place your audio files in the `data/audio/` directory.
2. Run the main script:
   ```bash
   python main.py
   ```

## Dependencies
See `requirements.txt` for the full list. Major packages include:
- numpy
- scipy
- librosa
- soundfile
- scikit-learn
- torch
- flask (if using web features)

## Notes
- The `voice_env/` folder contains the virtual environment and should not be modified manually.
- For best results, use high-quality audio files.

## License
Specify your license here.
