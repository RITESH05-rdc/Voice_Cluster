from pathlib import Path
from typing import List, Dict
import numpy as np
from sklearn.preprocessing import normalize
from sklearn.manifold import TSNE
from moviepy.editor import VideoFileClip

from embedding.extract_embedding import extract_embedding
from clustering.cluster_speakers import cluster_embeddings


def allowed_extensions() -> List[str]:
    return [".wav", ".mp4", ".mp3", ".flac", ".ogg", ".m4a"]


def get_audio_files(folder: Path) -> List[str]:
    return [path.name for path in sorted(folder.iterdir()) if path.suffix.lower() in allowed_extensions()]


def convert_mp4_to_wav(video_path: Path) -> Path:
    output_path = video_path.with_suffix(".wav")
    with VideoFileClip(str(video_path)) as clip:
        if clip.audio is None:
            raise ValueError(f"No audio track found in {video_path}")
        clip.audio.write_audiofile(str(output_path), fps=16000, verbose=False, logger=None)
    return output_path


def process_audio_folder(folder: Path) -> Dict[str, object]:
    files = [path for path in sorted(folder.iterdir()) if path.suffix.lower() in allowed_extensions()]
    if not files:
        return {"files": [], "clusters": {}, "labels": [], "coordinates_2d": []}

    embeddings = []
    names = []
    failed_files = []

    for path in files:
        try:
            file_path = path
            if path.suffix.lower() == ".mp4":
                file_path = convert_mp4_to_wav(path)

            embedding = extract_embedding(str(file_path))
            embeddings.append(embedding)
            names.append(path.name)
        except Exception as e:
            print(f"Failed to process {path.name}: {str(e)}")
            failed_files.append(path.name)

    if not embeddings:
        raise ValueError(f"No valid audio files to process. Failed: {failed_files}")

    embeddings = np.vstack(embeddings)
    embeddings = normalize(embeddings)
    labels = cluster_embeddings(embeddings)

    # Compute 2D coordinates using t-SNE for visualization
    try:
        tsne = TSNE(n_components=2, random_state=42, perplexity=min(5, len(names) - 1))
        coordinates_2d = tsne.fit_transform(embeddings)
        coordinates_2d = coordinates_2d.tolist()
    except Exception as e:
        print(f"t-SNE computation failed: {str(e)}")
        coordinates_2d = []

    clusters: Dict[str, List[str]] = {}
    for name, label in zip(names, labels):
        cluster_key = f"cluster_{label + 1}" if label >= 0 else "cluster_outlier"
        clusters.setdefault(cluster_key, []).append(name)

    return {
        "files": names,
        "labels": labels.tolist(),
        "clusters": clusters,
        "coordinates_2d": coordinates_2d,
        "failed_files": failed_files,
    }
