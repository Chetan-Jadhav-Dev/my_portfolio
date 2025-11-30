# Portfolio Website

A modern, full-stack portfolio website with admin dashboard, blog system, GitHub integration, and analytics.

## Features

- 🎨 **Modern Frontend**: React-based with animations and responsive design
- 🔐 **Admin Dashboard**: Full CRUD operations for portfolio content
- 📝 **Blog System**: Medium-style blog with rich text editor and syntax highlighting
- 📊 **Analytics**: Track user interactions, page views, and locations
- 🐙 **GitHub Integration**: Display selected repositories on frontend
- 📧 **Contact Form**: Real-time email notifications
- 🌙 **Dark/Light Mode**: Theme support in admin dashboard
- 🔄 **Activity Logging**: Track and undo admin actions

## Tech Stack

### Backend
- Flask (Python)
- SQLAlchemy (Database ORM)
- JWT Authentication
- Flask-Mail (Email)
- SQLite/PostgreSQL

### Frontend
- React
- Framer Motion (Animations)
- React Router
- Axios
- ReactQuill (Rich Text Editor)
- Prism.js (Syntax Highlighting)
- Recharts (Analytics Charts)

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Portfolio
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize Database**
   ```bash
   python init_db.py
   ```

5. **Start Backend**
   ```bash
   python app.py
   # Backend runs on http://localhost:5001
   ```

6. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

7. **Start Frontend**
   ```bash
   npm start
   # Frontend runs on http://localhost:3000
   ```

## Default Credentials

- **Admin Username**: `admin`
- **Admin Password**: `admin123`

⚠️ **Change these in production!**

## Project Structure

```
Portfolio/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── config.py           # Configuration
│   ├── requirements.txt    # Python dependencies
│   └── instance/           # Database files
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   └── utils/          # Utility functions
│   └── package.json        # Node dependencies
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
└── README.md
```

## Deployment

See [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md) for detailed deployment instructions.

### Quick Deploy

1. **Backend (Render)**
   - Connect GitHub repository
   - Render auto-detects `render.yaml`
   - Set environment variables

2. **Frontend (Vercel/Netlify)**
   - Connect GitHub repository
   - Set build directory: `frontend`
   - Add `REACT_APP_API_URL` environment variable

## CI/CD

GitHub Actions workflows:
- **Backend CI**: Linting, testing, security checks
- **Frontend CI**: Build and lint checks
- **PR Checks**: Automated checks on pull requests
- **Auto Deploy**: Deploys backend on main branch push

## Development

### Running Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Code Quality
```bash
# Backend linting
cd backend
flake8 .
black --check .
pylint app.py models.py config.py

# Frontend linting
cd frontend
npm run lint
```

## Environment Variables

### Backend
See `backend/env.example` for all required variables.

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: `http://localhost:5001/api`)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
