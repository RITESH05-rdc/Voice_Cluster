# Quick Reference

Fast lookup for common commands and configurations.

## Quick Start (Copy-Paste)

### Terminal 1: Backend
```bash
cd c:\Users\2214042\Desktop\Voice_Clustering\Voice_Cluster
python -m venv voice_env
voice_env\Scripts\activate
pip install -r backend\requirements.txt
python -m uvicorn backend.api:app --reload
```

Backend runs at: `http://localhost:8000`

### Terminal 2: Frontend
```bash
cd c:\Users\2214042\Desktop\Voice_Clustering\Voice_Cluster\frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## Common Commands

### Backend Commands

| Command | Purpose |
|---------|---------|
| `python -m uvicorn backend.api:app --reload` | Start dev server |
| `python -m py_compile backend/*.py` | Check syntax |
| `pip install -r backend/requirements.txt` | Install deps |
| `curl http://localhost:8000/health` | Test backend |
| `curl http://localhost:8000/docs` | API documentation |

### Frontend Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npx tsc --noEmit` | Type check |

## File Locations

| Item | Path |
|------|------|
| Audio files | `data/audio/` |
| Backend code | `backend/` |
| Frontend code | `frontend/src/` |
| Documentation | `*.md` files |
| Config | `.gitignore`, `requirements.txt` |

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| GET | `/files` | List uploaded files |
| POST | `/upload` | Upload audio files |
| POST | `/cluster` | Run clustering |
| GET | `/data/audio/{filename}` | Stream audio |

## Environment URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| API Redoc | http://localhost:8000/redoc |

## Keyboard Shortcuts

### Frontend
- `Space` — Play/Pause audio
- `F12` — Open DevTools
- `Ctrl+Shift+I` — Open DevTools (alt)

### Terminal
- `Ctrl+C` — Stop server
- `Up Arrow` — Previous command
- `Ctrl+L` — Clear terminal

## Port Usage

| Port | Service |
|------|---------|
| 5173 | Frontend (Vite) |
| 8000 | Backend (FastAPI) |

**If ports conflict:**
```bash
# Backend on different port
uvicorn backend.api:app --reload --port 8001

# Frontend on different port
npm run dev -- --port 5174
```

## Common Issues & Fixes

### Backend Won't Start
```bash
# Solution 1: Check Python version
python --version  # Must be 3.10+

# Solution 2: Reinstall dependencies
pip install --force-reinstall -r backend/requirements.txt

# Solution 3: Port already in use
netstat -ano | findstr :8000  # Windows
lsof -i :8000  # Mac/Linux
```

### Frontend Won't Build
```bash
# Solution 1: Clear cache
rm -rf frontend/node_modules frontend/package-lock.json
npm install

# Solution 2: Clear Vite cache
rm -rf frontend/.vite

# Solution 3: Type errors
npx tsc --noEmit  # See details
```

### Backend Can't Find Module
```bash
# Make sure you're in the right directory
cd Voice_Cluster
python -m uvicorn backend.api:app --reload
```

### CORS Error (Frontend)
- Verify backend is running
- Check CORS origins in `backend/api.py`
- Make sure frontend URL matches

### Audio Won't Play
- Verify audio file uploaded
- Check `data/audio/` folder
- Check browser console for errors

## Configuration Tweaks

### Clustering (More/Fewer Clusters)

Edit `backend/service.py`:
```python
clustering = DBSCAN(
    eps=0.6,  # Lower = more clusters, Higher = fewer
    min_samples=1,
    metric="cosine"
)
```

**eps Values:**
- `0.3` — Many small clusters
- `0.6` — Balanced (default)
- `0.9` — Few large clusters

### Embedding Model

Edit `backend/service.py`:
```python
classifier = EncoderClassifier.from_hparams(
    source="speechbrain/spkrec-ecapa-voxceleb"  # Current
    # or
    source="speechbrain/spkrec-xvector-voxceleb"  # Faster
)
```

## Debugging

### See Backend Logs
```bash
# Verbose output
uvicorn backend.api:app --reload --log-level debug
```

### See Frontend Errors
- Open DevTools: `F12`
- Go to "Console" tab
- Look for red error messages

### Check What Files Are Uploaded
```bash
ls data/audio/  # List files
```

### Test API Manually
```bash
# List files
curl http://localhost:8000/files

# Run clustering
curl -X POST http://localhost:8000/cluster

# Check health
curl http://localhost:8000/health
```

## Documentation Files

| File | Content |
|------|---------|
| `README.md` | Main overview |
| `BACKEND.md` | Backend detailed guide |
| `FRONTEND.md` | Frontend detailed guide |
| `DEPLOYMENT.md` | Production deployment |
| `CONTRIBUTING.md` | How to contribute |
| `QUICK_REFERENCE.md` | This file |

## Useful Links

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [Plotly.js Docs](https://plotly.com/javascript/)
- [Recharts Docs](https://recharts.org/)

## Version Info

- Python: 3.10+
- Node.js: 16+
- React: 18.3.1
- FastAPI: 0.111.1
- Vite: 5.4.0

## Git Quick Reference

```bash
# Clone
git clone <repo-url>
cd Voice_Cluster

# Create branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "[area] Description"

# Push
git push origin feature/my-feature

# Update
git fetch origin
git merge origin/main
```

## Performance Tips

- **Backend:** Use GPU with CUDA (5x faster)
- **Frontend:** Clear browser cache if stale
- **Both:** Start fresh with new terminals

## Getting Help

1. Check relevant `.md` file
2. See troubleshooting section
3. Check logs (see Debugging above)
4. Create GitHub issue with details

## Next Steps

After getting started:
1. Try with sample audio files
2. Adjust clustering parameters
3. Explore visualizations
4. Read full documentation
5. Consider deployment

## License

See main README.md
