import React, { useEffect, useRef } from 'react'
import Plotly from 'plotly.js-dist-min'

interface ScatterPlotProps {
  files: string[]
  labels: number[]
  coordinates2D: number[][]
}

const CLUSTER_COLORS = [
  '#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#06b6d4',
  '#8b5cf6', '#f97316', '#14b8a6', '#6366f1', '#d946ef',
]

export function ScatterPlot({ files, labels, coordinates2D }: ScatterPlotProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || coordinates2D.length === 0) return

    const trace = {
      x: coordinates2D.map((coord) => coord[0]),
      y: coordinates2D.map((coord) => coord[1]),
      mode: 'markers+text',
      type: 'scatter',
      text: files,
      textposition: 'top center',
      textfont: { size: 9 },
      marker: {
        size: 10,
        color: labels.map((label) => CLUSTER_COLORS[label % CLUSTER_COLORS.length]),
        opacity: 0.7,
        line: { width: 1, color: 'white' },
      },
      hovertemplate: '<b>%{text}</b><br>(%{x:.2f}, %{y:.2f})<extra></extra>',
    }

    const layout = {
      title: '2D Embedding Visualization (t-SNE)',
      xaxis: { title: 't-SNE 1', showgrid: true },
      yaxis: { title: 't-SNE 2', showgrid: true },
      hovermode: 'closest',
      plot_bgcolor: '#f9fafb',
      paper_bgcolor: 'white',
      width: containerRef.current?.offsetWidth || 500,
      height: 400,
    }

    Plotly.newPlot(containerRef.current, [trace as any], layout as any, { responsive: true })
  }, [coordinates2D, files, labels])

  if (!coordinates2D || coordinates2D.length === 0) {
    return <div className="scatter-plot"><p>No data to visualize.</p></div>
  }

  return <div className="scatter-plot" ref={containerRef} />
}
