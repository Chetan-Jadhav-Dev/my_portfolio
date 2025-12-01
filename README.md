# Portfolio Website

A modern, full-stack portfolio website showcasing projects, blog posts, skills, and professional experience. Built with React frontend and Flask backend, featuring an admin dashboard for content management, analytics tracking, and seamless GitHub integration.

## 🚀 Live URL

**Portfolio**: [https://chetan-jadhav-dev.github.io/my_portfolio](https://chetan-jadhav-dev.github.io/my_portfolio)

## ✨ Features

- 🎨 **Modern Frontend**: React-based with smooth animations and responsive design
- 🔐 **Admin Dashboard**: Full CRUD operations for portfolio content management
- 📝 **Blog System**: Medium-style blog with rich text editor, syntax highlighting, and like functionality
- 📊 **Analytics**: Track user interactions, page views, locations, and detailed metrics
- 🐙 **GitHub Integration**: Display selected repositories with beautiful card-based layout
- 📧 **Contact Form**: Real-time email notifications with form validation
- 🌙 **Dark/Light Mode**: Theme support in admin dashboard
- 🔄 **Activity Logging**: Track and undo admin actions
- 💬 **Comments & Replies**: Blog commenting system with like functionality
- 📸 **Project Screenshots**: Gallery view for project screenshots
- ⏱️ **Experience Timeline**: Beautiful timeline view of professional experience

## 🛠️ Technologies Used

### Frontend
- **React** (18.2.0) - UI library
- **React Router DOM** (6.20.0) - Client-side routing
- **Framer Motion** (11.18.2) - Smooth animations and transitions
- **Axios** (1.6.2) - HTTP client for API calls
- **React Icons** (5.5.0) - Icon library
- **React Quill** (2.0.0) - Rich text editor for blog posts
- **Prism.js** (1.30.0) - Syntax highlighting for code blocks
- **Recharts** (2.15.4) - Analytics charts and graphs
- **React Toastify** (10.0.6) - Toast notifications
- **React Intersection Observer** (9.16.0) - Scroll-based animations

### Backend
- **Flask** (3.0.0) - Python web framework
- **Flask-SQLAlchemy** (3.1.1) - Database ORM
- **Flask-CORS** (4.0.0) - Cross-origin resource sharing
- **Flask-JWT-Extended** (4.6.0) - JWT authentication
- **Flask-Mail** (0.10.0) - Email functionality
- **SQLAlchemy** - Database abstraction layer
- **psycopg** - PostgreSQL adapter (for Supabase)
- **python-dotenv** (1.0.0) - Environment variable management
- **Werkzeug** (3.0.1) - WSGI utilities
- **requests** (2.31.0) - HTTP library

### Database
- **SQLite** - Development database
- **PostgreSQL (Supabase)** - Production database with connection pooling

### Deployment & CI/CD
- **GitHub Actions** - Continuous integration and deployment
- **GitHub Pages** - Frontend hosting
- **Render** - Backend hosting (free tier)
- **Vercel** - Alternative frontend hosting option

## 📁 Project Structure

```
Portfolio/
├── backend/                          # Flask backend application
│   ├── app.py                       # Main Flask application with all API routes
│   ├── models.py                    # SQLAlchemy database models
│   ├── config.py                    # Application configuration
│   ├── init_db.py                   # Database initialization script
│   ├── requirements.txt             # Python dependencies
│   ├── env.example                  # Environment variables template
│   ├── Procfile                     # Deployment configuration
│   ├── start_backend.sh            # Backend startup script
│   ├── runtime.txt                  # Python version specification
│   └── instance/                    # Database files (SQLite)
│       └── portfolio.db
│
├── frontend/                         # React frontend application
│   ├── public/                      # Static public files
│   │   └── index.html              # HTML template
│   ├── src/                         # Source code
│   │   ├── components/             # React components
│   │   │   ├── Admin.js            # Admin dashboard component
│   │   │   ├── Admin.css           # Admin dashboard styles
│   │   │   ├── Analytics.js        # Analytics dashboard
│   │   │   ├── Analytics.css       # Analytics styles
│   │   │   ├── BlogEditor.js       # Blog post editor
│   │   │   ├── BlogEditor.css      # Blog editor styles
│   │   │   ├── BlogList.js         # Blog listing page
│   │   │   ├── BlogList.css        # Blog list styles
│   │   │   ├── BlogPost.js         # Individual blog post view
│   │   │   ├── BlogPost.css        # Blog post styles
│   │   │   ├── Contact.js          # Contact form component
│   │   │   ├── Contact.css         # Contact form styles
│   │   │   ├── Home.js             # Homepage component
│   │   │   ├── ModernHome.js       # Modern homepage design
│   │   │   ├── ModernHome.css      # Modern homepage styles
│   │   │   ├── Home.css            # Homepage styles
│   │   │   ├── ProjectDetail.js    # Project detail page
│   │   │   ├── ProjectDetail.css   # Project detail styles
│   │   │   ├── CustomCursor.js     # Custom cursor component
│   │   │   ├── ParticleBackground.js # Particle animation background
│   │   │   └── DynamicIcon.js      # Dynamic icon component
│   │   ├── utils/                  # Utility functions
│   │   │   └── analytics.js        # Analytics tracking utilities
│   │   ├── App.js                  # Main App component
│   │   ├── App.css                 # Global app styles
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   ├── package.json                # Node.js dependencies
│   ├── package-lock.json           # Dependency lock file
│   └── vercel.json                 # Vercel deployment config
│
├── .github/                         # GitHub configuration
│   └── workflows/                  # GitHub Actions workflows
│       ├── deploy-frontend.yml     # Frontend deployment workflow
│       └── backend-tests.yml       # Backend testing workflow
│
├── render.yaml                      # Render deployment configuration
├── README.md                        # This file
└── .gitignore                      # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites

- **Python** 3.11 or higher
- **Node.js** 18 or higher
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chetan-Jadhav-Dev/my_portfolio.git
   cd my_portfolio
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

5. **Start Backend Server**
   ```bash
   python app.py
   # Backend runs on http://localhost:5001
   ```

6. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   ```

7. **Start Frontend Development Server**
   ```bash
   npm start
   # Frontend runs on http://localhost:3000
   ```

## 🔐 Default Credentials

- **Admin Username**: `admin`
- **Admin Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## 🌐 Environment Variables

### Backend (.env)

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=sqlite:///portfolio.db  # or PostgreSQL connection string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Email Configuration (optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Frontend

- `REACT_APP_API_URL`: Backend API URL (default: `http://localhost:5001/api`)

## 📝 API Endpoints

### Authentication
- `POST /api/login` - Admin login

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/<id>` - Get project by ID
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/<id>` - Update project (admin)
- `DELETE /api/projects/<id>` - Delete project (admin)

### Blog
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/<id>` - Get blog post by ID
- `POST /api/blogs` - Create blog post (admin)
- `PUT /api/blogs/<id>` - Update blog post (admin)
- `DELETE /api/blogs/<id>` - Delete blog post (admin)
- `POST /api/blogs/<id>/like` - Like/unlike blog post
- `GET /api/blogs/<id>/likes` - Get blog likes

### Comments
- `GET /api/blogs/<id>/comments` - Get blog comments
- `POST /api/blogs/<id>/comments` - Add comment
- `POST /api/comments/<id>/like` - Like/unlike comment
- `GET /api/comments/<id>/likes` - Get comment likes

### Analytics
- `POST /api/analytics` - Track analytics event
- `GET /api/analytics` - Get analytics data (admin)
- `GET /api/analytics/stats` - Get analytics statistics (admin)

### Contact
- `POST /api/contact` - Submit contact form

### Health Check
- `GET /api/health` - Health check endpoint

## 🚀 Deployment

### Frontend (GitHub Pages)

The frontend is automatically deployed to GitHub Pages via GitHub Actions when you push to the `main` branch.

1. Configure GitHub Secrets:
   - Go to Repository Settings → Secrets and variables → Actions
   - Add `API_URL` secret with your backend URL

2. Deploy:
   - Push to `main` branch
   - GitHub Actions will automatically build and deploy

### Backend (Render)

1. **Connect Repository**:
   - Sign up at [render.com](https://render.com)
   - Create new Web Service
   - Connect GitHub repository

2. **Configure Service**:
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && python app.py`

3. **Set Environment Variables**:
   - Add all required environment variables in Render dashboard
   - Use Supabase connection string for production database

4. **Deploy**:
   - Render will automatically deploy on push to `main` branch

## 🧪 Development

### Running Tests

```bash
# Backend
cd backend
pytest  # Add tests as needed

# Frontend
cd frontend
npm test
```

### Code Quality

```bash
# Backend linting (if configured)
cd backend
flake8 .
black --check .

# Frontend linting
cd frontend
npm run lint
```

## 📊 Database Models

- **Project** - Portfolio projects
- **About** - Personal information
- **Skill** - Technical skills with icons
- **Experience** - Work experience entries
- **Blog** - Blog posts with rich content
- **BlogLike** - Blog post likes
- **BlogComment** - Blog comments
- **CommentLike** - Comment likes
- **Analytics** - User analytics events
- **Contact** - Contact form submissions
- **ActivityLog** - Admin activity tracking
- **GitHubSettings** - GitHub integration settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Chetan Jadhav**

- GitHub: [@Chetan-Jadhav-Dev](https://github.com/Chetan-Jadhav-Dev)
- Portfolio: [https://chetan-jadhav-dev.github.io/my_portfolio](https://chetan-jadhav-dev.github.io/my_portfolio)

## 🙏 Acknowledgments

- React community for amazing libraries
- Flask team for the excellent framework
- All open-source contributors whose packages made this project possible

---

⭐ Star this repository if you find it helpful!
