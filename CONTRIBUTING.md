# Contributing to Voice Cluster

We welcome contributions! This guide explains how to contribute to the Voice Cluster project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn
- Report issues professionally

## How to Contribute

### Reporting Issues

Found a bug? Have a feature request? 

1. Check existing issues first
2. Create new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Environment info (OS, Python version, etc.)

### Feature Requests

1. Describe the feature clearly
2. Explain the use case
3. Suggest implementation approach
4. Link related issues

### Pull Requests

#### Before Starting

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Set up development environment (see below)

#### Development Setup

**Backend:**
```bash
cd Voice_Cluster
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r backend/requirements.txt
pip install -r backend/requirements-dev.txt  # If exists
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

#### Making Changes

**Python Code:**
- Follow PEP 8 style guide
- Add type hints
- Write docstrings
- Test changes locally

**TypeScript Code:**
- Follow ESLint rules
- Use TypeScript strict mode
- Add JSDoc comments
- Run `npx tsc --noEmit` before commit

**Commit Messages:**
```
[area] Brief description

Detailed explanation if needed.
- Point 1
- Point 2

Fixes #123
```

**Areas:**
- `[backend]` — Python/API changes
- `[frontend]` — React/TypeScript changes
- `[docs]` — Documentation
- `[ci]` — CI/CD configuration

#### Testing Before PR

**Python:**
```bash
# Type checking
mypy backend/

# Linting
pylint backend/

# Format check
black --check backend/
```

**TypeScript:**
```bash
# Type checking
npm run build

# Lint
npm run lint

# Format
npm run format
```

#### Submitting PR

1. Push to your fork
2. Create PR with:
   - Clear title: `[area] Description`
   - Reference related issues: `Fixes #123`
   - List changes made
   - Note any breaking changes
3. Wait for review
4. Address feedback

#### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Related Issues
Fixes #123

## Changes Made
- Point 1
- Point 2

## Testing
How to test the changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

## Development Priorities

### High Priority
1. Bug fixes
2. Performance improvements
3. Documentation improvements
4. Security issues

### Medium Priority
1. New features with clear use case
2. Code refactoring
3. Test coverage
4. UI/UX improvements

### Lower Priority
1. Nice-to-have features
2. Style/formatting changes
3. Experimental features

## Project Structure Review

### Backend Improvements
- Add new clustering algorithms
- Support more audio formats
- Optimize embedding extraction
- Add model selection

### Frontend Improvements
- Add more visualizations
- Improve accessibility
- Add keyboard shortcuts
- Better error handling

### Documentation
- Add tutorials
- Improve existing docs
- Add API examples
- Create troubleshooting guide

## Code Style

### Python
```python
# PEP 8 compliant
def process_audio(file_path: str) -> np.ndarray:
    """
    Extract embeddings from audio file.
    
    Args:
        file_path: Path to audio file
        
    Returns:
        Audio embedding as numpy array
    """
    # Implementation
    pass
```

### TypeScript
```typescript
// Clear types and comments
interface Props {
  data: ClusterResult
  onSelect: (file: string) => void
}

export function Component({ data, onSelect }: Props) {
  // Implementation
  return <div>{/* JSX */}</div>
}
```

### Naming Conventions
- **Functions:** `snake_case` (Python), `camelCase` (TypeScript)
- **Classes:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Private:** `_leading_underscore` (Python), no prefix (TypeScript)

## Testing Guidelines

### What to Test
- New features
- Bug fixes
- Critical paths
- Error cases

### How to Test
- Unit tests for functions
- Integration tests for pipelines
- Manual testing with real data
- Edge cases (empty input, large files, etc.)

### Test Coverage
Aim for 80%+ coverage on new code

## Documentation Standards

### Code Comments
```python
# What: Clear description
# Why: Reason for this approach
# How: Implementation details if complex
result = algorithm(data)  # Brief inline comment
```

### Docstrings
```python
def cluster_speakers(embeddings: np.ndarray) -> np.ndarray:
    """
    Cluster audio embeddings using DBSCAN.
    
    Uses cosine distance metric for speaker verification embeddings.
    
    Args:
        embeddings: (n_samples, n_features) array of embeddings
        
    Returns:
        (n_samples,) array of cluster labels
        
    Raises:
        ValueError: If embeddings is empty
        
    Example:
        >>> embeddings = extract_embeddings(audio_files)
        >>> labels = cluster_speakers(embeddings)
    """
```

### README
- Clear purpose
- Quick start
- Usage examples
- Link to detailed docs

## Git Workflow

### Typical Workflow
```bash
# 1. Create branch
git checkout -b feature/my-feature

# 2. Make changes
git add .
git commit -m "[backend] Add new feature"

# 3. Keep updated
git fetch origin
git rebase origin/main

# 4. Push
git push origin feature/my-feature

# 5. Create PR on GitHub
```

### Branch Naming
- `feature/description` — New feature
- `fix/description` — Bug fix
- `docs/description` — Documentation
- `refactor/description` — Code refactoring

## Performance Considerations

### Python
- Use numpy for array operations
- Vectorize where possible
- Profile before optimizing
- Cache expensive computations

### TypeScript
- Code split components
- Memoize expensive renders
- Lazy load heavy libraries
- Monitor bundle size

## Security

### What to Avoid
- Hardcoded credentials
- SQL injection (not applicable here)
- XSS vulnerabilities
- Unvalidated user input

### Best Practices
- Validate file uploads
- Sanitize user input
- Use HTTPS in production
- Keep dependencies updated

## Review Process

### For Contributors
- Expect 2-3 business days for review
- Be open to feedback
- Ask questions if unclear
- Make requested changes promptly

### For Reviewers
- Provide constructive feedback
- Suggest improvements
- Explain reasoning
- Be respectful and encouraging

## Getting Help

### Resources
- GitHub Discussions
- GitHub Issues
- Documentation
- Community channels

### Questions?
- Check existing issues/discussions
- Ask in GitHub Discussions
- Create detailed issue if stuck

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Credited in releases
- Thanked in documentation

## Maintainers

Current maintainers:
- [Your Name] — Backend lead
- [Your Name] — Frontend lead
- [Your Name] — Documentation

Contact for questions or concerns.

## License

By contributing, you agree your contributions are licensed under the project's license.

---

Thank you for contributing to Voice Cluster! 🎉
