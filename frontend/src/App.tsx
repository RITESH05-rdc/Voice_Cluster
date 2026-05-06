import { useEffect, useState } from 'react'
import { fetchFiles, uploadFiles, runClustering } from './api'
import { StatsDashboard } from './components/StatsDashboard'
import { ScatterPlot } from './components/ScatterPlot'
import { ClusterDisplay } from './components/ClusterDisplay'

type ClusterMap = Record<string, string[]>

interface ClusterResult {
  files: string[]
  labels: number[]
  clusters: ClusterMap
  coordinates_2d: number[][]
}

function App() {
  const [availableFiles, setAvailableFiles] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [clusterResult, setClusterResult] = useState<ClusterResult | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    refreshFiles()
  }, [])

  const refreshFiles = async () => {
    try {
      const result = await fetchFiles()
      setAvailableFiles(result.files || [])
    } catch (error) {
      console.error(error)
      setMessage('Unable to load audio file list.')
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files)
    setMessage('')
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setMessage('Select at least one audio file to upload.')
      return
    }

    setLoading(true)
    setMessage('Uploading audio files...')

    try {
      const result = await uploadFiles(selectedFiles)
      setMessage(`Uploaded ${result.uploaded?.length ?? 0} file(s).`)
      await refreshFiles()
      setSelectedFiles(null)
      const input = document.querySelector('input[type=file]') as HTMLInputElement | null
      if (input) input.value = ''
    } catch (error) {
      console.error(error)
      setMessage('Upload failed. Check backend status.')
    } finally {
      setLoading(false)
    }
  }

  const handleCluster = async () => {
    setLoading(true)
    setMessage('Clustering audio files...')
    setClusterResult(null)

    try {
      const result = await runClustering()
      setClusterResult(result)
      setMessage('Clustering finished.')
    } catch (error) {
      console.error(error)
      setMessage('Clustering request failed. Ensure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header>
        <h1>Voice Clustering UI</h1>
        <p>Upload audio, run clustering, and inspect speaker groups with advanced visualizations.</p>
      </header>

      <section className="card">
        <h2>Upload audio</h2>
        <input type="file" multiple accept="audio/*,video/mp4" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          Upload
        </button>
      </section>

      <section className="card">
        <h2>Available audio files ({availableFiles.length})</h2>
        {availableFiles.length === 0 ? (
          <p>No audio files found. Upload one or more files first.</p>
        ) : (
          <ul>
            {availableFiles.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="card actions">
        <button onClick={handleCluster} disabled={loading || availableFiles.length === 0}>
          Run clustering
        </button>
      </section>

      {message && (
        <section className="card message">
          <p>{message}</p>
        </section>
      )}

      {clusterResult && (
        <>
          <section className="card">
            <StatsDashboard files={clusterResult.files} clusters={clusterResult.clusters} />
          </section>

          <section className="card">
            <ScatterPlot
              files={clusterResult.files}
              labels={clusterResult.labels}
              coordinates2D={clusterResult.coordinates_2d}
            />
          </section>

          <section className="card">
            <h2>Cluster Results</h2>
            <ClusterDisplay clusters={clusterResult.clusters} />
          </section>
        </>
      )}
    </div>
  )
}

export default App
