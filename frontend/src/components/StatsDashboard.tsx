import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface StatsDashboardProps {
  files: string[]
  clusters: Record<string, string[]>
}

export function StatsDashboard({ files, clusters }: StatsDashboardProps) {
  const clusterCount = Object.keys(clusters).length
  const chartData = Object.entries(clusters).map(([clusterName, fileNames]) => ({
    cluster: clusterName.replace('cluster_', ''),
    files: fileNames.length,
  }))

  return (
    <div className="stats-dashboard">
      <div className="stats-row">
        <div className="stat-box">
          <h3>Total Files</h3>
          <p className="stat-value">{files.length}</p>
        </div>
        <div className="stat-box">
          <h3>Clusters Found</h3>
          <p className="stat-value">{clusterCount}</p>
        </div>
        <div className="stat-box">
          <h3>Avg Files/Cluster</h3>
          <p className="stat-value">{clusterCount > 0 ? (files.length / clusterCount).toFixed(1) : 0}</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>Files per Cluster</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cluster" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="files" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
