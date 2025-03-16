#!/bin/bash
set -e  # Exit on error

# Build frontend
echo "Building frontend..."
cd frontend
npm install -g pnpm
pnpm install
pnpm build
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Run migrations
echo "Running migrations..."
python manage.py migrate

echo "Build completed successfully!" 