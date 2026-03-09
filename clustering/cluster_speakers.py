from sklearn.cluster import DBSCAN

def cluster_embeddings(embeddings):

    clustering = DBSCAN(
        eps=0.6,
        min_samples=1,
        metric="cosine"
    ).fit(embeddings)

    return clustering.labels_