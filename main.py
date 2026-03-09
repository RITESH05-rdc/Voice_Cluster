import os
import numpy as np
from sklearn.preprocessing import normalize

from embedding.extract_embedding import extract_embedding
from clustering.cluster_speakers import cluster_embeddings

audio_folder = "data/audio"

files = [f for f in os.listdir(audio_folder)
         if f.endswith((".wav",".mp4", ".mp3", ".flac", ".ogg"))]

embeddings = []
names = []

from moviepy import VideoFileClip
import subprocess
import os

def convert_mp4_to_wav(video_path):

    audio_path = video_path.replace(".mp4", ".wav")

    command = [
        "ffmpeg",
        "-i", video_path,
        "-vn",
        "-acodec", "pcm_s16le",
        "-ar", "16000",
        "-ac", "1",
        audio_path
    ]

    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    return audio_path
for file in files:

    path = os.path.join(audio_folder, file)

    print("Processing:", file)

    # Convert mp4 to wav automatically
    if file.lower().endswith(".mp4"):
        path = convert_mp4_to_wav(path)

    emb = extract_embedding(path)

    embeddings.append(emb)

    names.append(file)

embeddings = np.array(embeddings)

# Normalize embeddings
embeddings = normalize(embeddings)

labels = cluster_embeddings(embeddings)

print("\nClustering Results:\n")

clusters = {}

for name, label in zip(names, labels):
    if label not in clusters:
        clusters[label] = []
    clusters[label].append(name)

print("\nClustering Results:\n")

for cluster_id, files in clusters.items():
    print(f"Cluster {cluster_id + 1} -> {', '.join(files)}")

