const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function fetchFiles() {
  const response = await fetch(`${BASE_URL}/files`)
  if (!response.ok) {
    throw new Error(`Failed to fetch files: ${response.statusText}`)
  }
  return response.json()
}

export async function uploadFiles(files: FileList) {
  const formData = new FormData()
  Array.from(files).forEach((file) => formData.append('files', file))

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(`Upload failed: ${errorData.detail || response.statusText}`)
  }
  return response.json()
}

export async function runClustering() {
  const response = await fetch(`${BASE_URL}/cluster`, {
    method: 'POST',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(error.detail || `Clustering failed: ${response.statusText}`)
  }
  return response.json()
}
