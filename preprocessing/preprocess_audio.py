import librosa
import numpy as np

def preprocess_audio(file_path):

    audio, sr = librosa.load(file_path, sr=16000)

    audio = audio / np.max(np.abs(audio))

    audio_trimmed, _ = librosa.effects.trim(audio)

    return audio_trimmed