# Frontend Documentation

## Overview

The Voice Cluster frontend is a modern React + TypeScript application built with Vite. It provides an interactive UI for uploading audio files, visualizing clustering results, and playing back audio samples.

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type-safe development
- **Vite** — Fast build tool & dev server
- **Recharts** — Bar charts for statistics
- **Plotly.js** — Interactive 2D scatter plot
- **CSS3** — Modern styling

## Setup

### Prerequisites
- Node.js 16+ with npm

### Installation

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Verify installation:**
   ```bash
   npm --version  # Should be 8+
   node --version  # Should be 16+
   ```

## Running the Development Server

### Start Dev Server
```bash
npm run dev
```

Output:
```
  VITE v5.4.0 ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Access the App
Open browser to `http://localhost:5173`

### Features During Development
- **Hot Module Replacement (HMR)** — Changes auto-reload
- **TypeScript Checking** — Real-time validation
- **CSS Hot Reload** — Instant style updates
- **Fast Build** — Sub-second rebuilds

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AudioPlayer.tsx       # Audio playback component
│   │   ├── ClusterDisplay.tsx    # Cluster cards grid
│   │   ├── ScatterPlot.tsx       # 2D t-SNE visualization
│   │   └── StatsDashboard.tsx    # Statistics & bar chart
│   ├── App.tsx                   # Main app component
│   ├── api.ts                    # Backend API client
│   ├── styles.css                # Global styles
│   ├── main.tsx                  # App entry point
│   ├── vite-env.d.ts             # Vite type definitions
│   └── plotly.d.ts               # Plotly.js types
├── index.html                    # HTML entry point
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
└── dist/                         # Production build (after npm run build)
```

## Components

### StatsDashboard
**File:** `src/components/StatsDashboard.tsx`

Displays clustering statistics:
- Total files count
- Number of clusters found
- Average files per cluster
- Bar chart showing files per cluster

**Props:**
```typescript
interface StatsDashboardProps {
  files: string[]
  clusters: Record<string, string[]>
}
```

**Example:**
```jsx
<StatsDashboard 
  files={["file1.wav", "file2.wav"]} 
  clusters={{"cluster_1": ["file1.wav"], "cluster_2": ["file2.wav"]}}
/>
```

---

### ScatterPlot
**File:** `src/components/ScatterPlot.tsx`

Interactive 2D visualization using Plotly.js:
- Each point represents an audio file
- Color-coded by cluster
- Hover to see filename
- Zoom, pan, and other interactive features

**Props:**
```typescript
interface ScatterPlotProps {
  files: string[]
  labels: number[]
  coordinates2D: number[][]
}
```

**Features:**
- t-SNE dimensionality reduction
- 10 distinct cluster colors
- Interactive legend
- Responsive sizing

---

### AudioPlayer
**File:** `src/components/AudioPlayer.tsx`

Built-in audio playback component:
- Play/pause button
- Progress bar with seek
- Time display (current / total)
- Supports all audio formats

**Props:**
```typescript
interface AudioPlayerProps {
  fileName: string
}
```

**Features:**
- Streams audio from backend
- Responsive controls
- Time formatting
- Keyboard shortcuts (space = play/pause)

---

### ClusterDisplay
**File:** `src/components/ClusterDisplay.tsx`

Grid of cluster cards with file lists:
- Cards sorted by file count
- Click file to play in AudioPlayer
- Shows number of files per cluster
- Color-coded cards

**Props:**
```typescript
interface ClusterDisplayProps {
  clusters: Record<string, string[]>
}
```

---

### App
**File:** `src/App.tsx`

Main application component:
- File upload
- Clustering trigger
- Result visualization
- State management
- Backend integration

**State:**
```typescript
const [availableFiles, setAvailableFiles] = useState<string[]>([])
const [clusterResult, setClusterResult] = useState<ClusterResult | null>(null)
const [loading, setLoading] = useState(false)
const [message, setMessage] = useState('')
```

## API Client

**File:** `src/api.ts`

Provides functions to communicate with backend:

```typescript
// List uploaded files
const result = await fetchFiles()

// Upload files
const result = await uploadFiles(fileList)

// Run clustering
const result = await runClustering()
```

**Error Handling:**
- Throws error if response not OK
- Frontend catches and displays error message
- Detailed error info from backend

## Styling

**File:** `src/styles.css`

### CSS Variables
```css
:root {
  --primary: #4f46e5
  --primary-dark: #4338ca
  --purple: #8b5cf6
  --pink: #ec4899
}
```

### Layout System
- **CSS Grid** for responsive layouts
- **Flexbox** for alignment
- **CSS Variables** for theming
- **Gradient Backgrounds** for visual appeal

### Key Classes
- `.app-shell` — Main container
- `.card` — Content card
- `.stats-dashboard` — Statistics section
- `.scatter-plot` — Visualization
- `.cluster-card` — Individual cluster
- `.audio-player` — Audio controls

### Responsive Design
Breakpoints:
- Desktop: 1400px max-width
- Tablet: 768px and below
- Mobile: Single column layout

**Media Query:**
```css
@media (max-width: 768px) {
  .clusters-grid {
    grid-template-columns: 1fr;
  }
}
```

## Building for Production

### Create Optimized Build
```bash
npm run build
```

Output:
```
backend/dist/
├── index.html
├── assets/
│   ├── index-*.js
│   └── index-*.css
```

### Preview Build
```bash
npm run preview
```

Opens preview at `http://localhost:4173`

### Deployment
1. **Build:** `npm run build`
2. **Upload `dist/` folder** to web server
3. **Configure web server** to serve `index.html` for all routes

### Environment Variables
Create `.env.local`:
```
VITE_API_URL=http://api.example.com
```

Usage:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
```

## Type Definitions

### ClusterResult
```typescript
interface ClusterResult {
  files: string[]
  labels: number[]
  clusters: Record<string, string[]>
  coordinates_2d: number[][]
}
```

### API Response Types
```typescript
interface FileListResponse {
  files: string[]
}

interface UploadResponse {
  uploaded: string[]
}

interface ClusterResponse extends ClusterResult {
  failed_files: string[]
}
```

## Development Workflow

### Adding a New Component

1. **Create file:**
   ```bash
   touch src/components/MyComponent.tsx
   ```

2. **Write component:**
   ```typescript
   interface MyComponentProps {
     data: string[]
   }

   export function MyComponent({ data }: MyComponentProps) {
     return <div>{/* JSX */}</div>
   }
   ```

3. **Import in App.tsx:**
   ```typescript
   import { MyComponent } from './components/MyComponent'
   ```

4. **Use in JSX:**
   ```jsx
   <MyComponent data={someData} />
   ```

### Adding Styles

1. **Edit `src/styles.css`:**
   ```css
   .my-component {
     background: white;
     padding: 20px;
     border-radius: 8px;
   }
   ```

2. **Use in component:**
   ```jsx
   <div className="my-component">{/* content */}</div>
   ```

### State Management

Current implementation uses React hooks:
- `useState` for component state
- `useEffect` for side effects
- `useRef` for DOM refs

**Example:**
```typescript
const [data, setData] = useState<string[]>([])

useEffect(() => {
  // Fetch data
  fetchData().then(setData)
}, [])
```

## Performance Tips

### Code Splitting
Vite automatically code-splits components:
- Each route/component is a separate chunk
- Lazy load heavy components

### Optimization
```typescript
// Memoize expensive components
import { memo } from 'react'

export const ClusterCard = memo(({ data }) => {
  return <div>{/* render */}</div>
})
```

### Image/Asset Optimization
- SVG for icons (recommended)
- PNG for images
- WebP for photos

## Testing

### Unit Tests
```bash
npm install --save-dev vitest @testing-library/react
npm test
```

### E2E Tests
```bash
npm install --save-dev playwright
npx playwright test
```

## Debugging

### Browser DevTools
- Open DevTools: `F12` or `Ctrl+Shift+I`
- React DevTools extension recommended
- Network tab to inspect API calls

### Debug Mode
```typescript
// In components
console.log('Debug:', data)
debugger  // Sets breakpoint
```

### TypeScript Errors
```bash
# Check for errors
npx tsc --noEmit

# Watch mode
npx tsc --watch --noEmit
```

## Troubleshooting

### Issues

**"Cannot find module" error**
- Solution: `npm install` in frontend folder
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

**Port 5173 already in use**
- Solution: Vite will try next port automatically
- Or specify: `npm run dev -- --port 5174`

**Backend not responding**
- Check: `curl http://localhost:8000/health`
- Verify CORS settings in backend

**Slow compilation**
- Increase Node heap: `NODE_OPTIONS=--max_old_space_size=4096 npm run dev`

### Performance Issues

**Slow render:**
- Profile with DevTools Profiler
- Check for unnecessary re-renders
- Use `React.memo()` for expensive components

**Large bundle:**
- Analyze: `npm run build -- --analyze`
- Consider code splitting
- Remove unused dependencies

## Dependencies

### Core
- `react@18.3.1` — UI framework
- `react-dom@18.3.1` — React DOM renderer

### Visualization
- `recharts@2.12.7` — Bar charts
- `plotly.js-dist-min@2.26.0` — 2D scatter plot

### Build Tools
- `vite@5.4.0` — Build tool
- `@vitejs/plugin-react@4.3.1` — React support
- `typescript@5.6.2` — Type safety

### Development
- `@types/react@18.3.3` — React types
- `@types/react-dom@18.3.0` — React DOM types

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

### Features
- Semantic HTML
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance

### Improvements
```jsx
// Add aria-label
<button aria-label="Play audio">▶</button>

// Semantic HTML
<nav>Navigation</nav>
<main>Content</main>
<footer>Footer</footer>
```

## Future Enhancements

- [ ] Dark mode support
- [ ] File drag-and-drop zones
- [ ] Progress bars for long operations
- [ ] Export clustering results
- [ ] Advanced filtering options
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements

## Support & Issues

For problems:
1. Check browser console for errors
2. Verify backend is running
3. Check network tab in DevTools
4. Review troubleshooting section

## License

See main README.md
