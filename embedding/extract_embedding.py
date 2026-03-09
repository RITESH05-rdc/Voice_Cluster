import torch
import torchaudio
from speechbrain.inference import EncoderClassifier

classifier = EncoderClassifier.from_hparams(
    source="speechbrain/spkrec-ecapa-voxceleb"
)

def extract_embedding(file_path):
    signal, fs = torchaudio.load(file_path)

    if signal.shape[0] > 1:
        signal = torch.mean(signal, dim=0, keepdim=True)

    embedding = classifier.encode_batch(signal)

    return embedding.squeeze().detach().numpy()