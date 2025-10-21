# iStudy - AI Academy Platform

Full-stack online learning platform built with React and Django.

![iStudy Platform](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18.2-blue)
![Django](https://img.shields.io/badge/Django-5.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- **Modern React Frontend** with Vite build tool
- **Django REST API Backend** with full CRUD operations
- **Module-based Learning System** with lessons and tests
- **User Progress Tracking** with detailed analytics
- **AI ChatBot Integration** unlocked after course completion
- **Admin Panel** for managing users, modules, and content
- **Responsive Design** works on all devices
- **Dark Theme Support** for comfortable viewing

## Tech Stack

### Frontend
- React 18.2
- Vite 5.0
- TailwindCSS 3.4
- Lucide React Icons
- LocalStorage for state persistence

### Backend
- Django 5.0
- Django REST Framework 3.14
- PostgreSQL / SQLite
- CORS Headers
- Gunicorn for production

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- npm or yarn

### Local Development

**1. Clone repository:**
```bash
git clone https://github.com/mukhammad7733-crypto/istudy.git
cd istudy
```

**2. Start Backend:**
```bash
cd ai-academy-backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend runs on: http://localhost:8000

**3. Start Frontend:**
```bash
cd ai-academy-react

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: http://localhost:5173

### Default Credentials

**Admin:**
- Email: `admin@sqb.uz`
- Password: `admin123`

## Deployment

### Quick Deploy

**Frontend:**
- [![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mukhammad7733-crypto/istudy)
- [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/mukhammad7733-crypto/istudy)

**Backend:**
- [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### Deploy with Docker

```bash
# Build and run all services
docker-compose up --build

# Access:
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# Database: localhost:5432
```

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed deployment instructions for:
- Vercel, Netlify, GitHub Pages (Frontend)
- Railway, Render, Heroku, DigitalOcean (Backend)
- Docker/Kubernetes
- Production configurations

## Project Structure

```
istudy/
├── ai-academy-react/          # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── admin/        # Admin panel components
│   │   │   └── user/         # User interface components
│   │   ├── data/             # Mock data & content
│   │   └── utils/            # Helper functions
│   ├── public/               # Static assets
│   ├── Dockerfile            # Production Docker config
│   ├── Dockerfile.dev        # Development Docker config
│   ├── vercel.json           # Vercel deployment config
│   ├── netlify.toml          # Netlify deployment config
│   └── package.json
│
├── ai-academy-backend/        # Django Backend
│   ├── api/                  # API application
│   │   ├── models.py         # Database models
│   │   ├── serializers.py    # DRF serializers
│   │   ├── views.py          # API views
│   │   └── urls.py           # API routes
│   ├── backend/              # Project settings
│   │   ├── settings.py       # Django settings
│   │   ├── settings_prod.py  # Production settings
│   │   └── urls.py           # Main routes
│   ├── Dockerfile            # Docker configuration
│   ├── Procfile             # Heroku/Railway config
│   ├── runtime.txt          # Python version
│   └── requirements.txt
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # GitHub Actions CI/CD
│
├── docker-compose.yml        # Docker Compose config
├── DEPLOYMENT.md            # Detailed deployment guide
├── INTEGRATION_GUIDE.md     # API integration guide
├── QUICK_START.md           # Quick start guide
└── README.md               # This file
```

## API Endpoints

### Users
- `GET /api/users/` - List all users
- `POST /api/users/` - Create user
- `GET /api/users/{id}/` - Get user detail
- `GET /api/users/{id}/detail_with_progress/` - User with progress

### Modules
- `GET /api/modules/` - List all modules
- `POST /api/modules/` - Create module
- `GET /api/modules/{id}/` - Module with lessons

### Lessons
- `GET /api/lessons/` - List all lessons
- `GET /api/lessons/by_module/?module_id={id}` - Lessons by module

### Tests
- `GET /api/questions/by_module/?module_id={id}` - Module test questions
- `POST /api/questions/` - Create question

### Progress
- `GET /api/progress/by_user/?user_id={id}` - User progress
- `POST /api/progress/update_or_create/` - Update progress

### Test Results
- `GET /api/test-results/by_user/?user_id={id}` - User test results
- `POST /api/test-results/` - Save test result

See **[API_DOCUMENTATION.md](./ai-academy-backend/API_DOCUMENTATION.md)** for complete API reference.

## Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@localhost:5432/istudy
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## Features Roadmap

- [x] User authentication
- [x] Module catalog
- [x] Lesson viewer
- [x] Test system
- [x] Progress tracking
- [x] AI ChatBot
- [x] Admin panel
- [x] REST API
- [x] Docker support
- [x] CI/CD pipeline
- [ ] Email notifications
- [ ] Certificate generation
- [ ] Gamification system
- [ ] Mobile app

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Documentation:** See `/docs` folder
- **Issues:** [GitHub Issues](https://github.com/mukhammad7733-crypto/istudy/issues)
- **Discussions:** [GitHub Discussions](https://github.com/mukhammad7733-crypto/istudy/discussions)

## Acknowledgments

- Built with React and Django
- UI inspired by modern learning platforms
- Icons by Lucide React

---

**Generated with [Claude Code](https://claude.com/claude-code)**

**Co-Authored-By: Claude <noreply@anthropic.com>**
