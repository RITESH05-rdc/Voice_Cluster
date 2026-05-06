import React, { useState } from 'react'
import { AudioPlayer } from './AudioPlayer'

interface ClusterDisplayProps {
  clusters: Record<string, string[]>
}

export function ClusterDisplay({ clusters }: ClusterDisplayProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const clusterEntries = Object.entries(clusters)
    .map(([name, files]) => ({
      name,
      files,
      fileCount: files.length,
    }))
    .sort((a, b) => b.fileCount - a.fileCount)

  return (
    <div className="cluster-display">
      <div className="clusters-grid">
        {clusterEntries.map(({ name, files, fileCount }) => (
          <div key={name} className="cluster-card">
            <h3>{name}</h3>
            <p className="file-count">{fileCount} file(s)</p>
            <ul className="file-list">
              {files.map((file) => (
                <li
                  key={file}
                  className={`file-item ${selectedFile === file ? 'selected' : ''}`}
                  onClick={() => setSelectedFile(file)}
                >
                  <span className="file-name">{file}</span>
                  <button className="play-icon">🔊</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="player-section">
          <h3>Now Playing</h3>
          <AudioPlayer fileName={selectedFile} />
        </div>
      )}
    </div>
  )
}
