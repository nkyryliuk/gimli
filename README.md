# Gimli

A suite of tools for Dungeon Masters to manage their campaigns.
Support includes only D&D 5E for now

## Prerequisites

- Python 3.11+
- Node.js v23+
- Docker and Docker Compose (for database only)
- Google OAuth 2.0 credentials
- UV (Python package manager)
- PNPM (Node.js package manager)

## Setup

### Database Setup with Docker Compose

We use Docker Compose to run the PostgreSQL database only:

```bash
docker compose up -d db
```

This will start a PostgreSQL instance with the configuration defined in the docker-compose.yml file. The backend and frontend applications are run locally for development.

### Backend Setup

1. Create a virtual environment and activate it using UV:
```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .\.venv\Scripts\activate
```

2. Install dependencies with UV:
```bash
uv pip install -r requirements.txt
```

3. Copy the environment file and configure it:
```bash
cp .env.example .env
```
Edit `.env` with your database and Google OAuth credentials.

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Install dependencies using PNPM:
```bash
cd frontend
pnpm install
```

2. Copy the environment file and configure it:
```bash
cp .env.example .env
```
Edit `.env` with your Google OAuth client ID.

3. Start the development server:
```bash
pnpm dev
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials and create an OAuth 2.0 Client ID
5. Add the following authorized redirect URIs:
   - `http://localhost:5173` (development)
   - `http://localhost:8000/accounts/google/login/callback/` (development)
6. Copy the Client ID and Client Secret to your environment files

## Development

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
