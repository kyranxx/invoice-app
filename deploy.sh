#!/bin/bash

# deploy.sh - Script to deploy the Flask app on PythonAnywhere

# Exit immediately if a command exits with a non-zero status.
set -e

# Define project directory (IMPORTANT: Update this to your actual project path on PythonAnywhere)
# Example: PROJECT_DIR="/home/YourUserName/YourProjectName"
# PROJECT_DIR=$(dirname "$0") # Assumes deploy.sh is in the project root
# If not, specify the absolute path:
PROJECT_DIR="/home/kyranxx/invoice-app"

# Define PythonAnywhere WSGI file path (IMPORTANT: Update this)
# This is the file you "touch" to reload the web app.
# Example: WSGI_FILE="/var/www/yourusername_pythonanywhere_com_wsgi.py"
# Or if using a virtualenv wrapper for a specific app:
# WSGI_FILE="/home/YourUserName/.virtualenvs/YourVirtualEnvName/var/www/yourusername_pythonanywhere_com_wsgi.py"
# Find this in your PythonAnywhere "Web" tab.
WSGI_FILE="/var/www/kyranxx_pythonanywhere_com_wsgi.py" # <<< --- !!! UPDATE THIS LINE !!!

# Define the branch to pull (e.g., main, master, develop)
GIT_BRANCH="main" # <<< --- UPDATE THIS if you use a different branch for deployment

echo "Starting deployment process..."

# Navigate to the project directory
echo "Changing to project directory: $PROJECT_DIR"
cd "$PROJECT_DIR" || { echo "Failed to cd into $PROJECT_DIR"; exit 1; }

# Ensure the virtual environment is activated (IMPORTANT: Update if your venv is named differently or located elsewhere)
# Common path: YourProjectName/venv or .venv
VENV_PATH="$PROJECT_DIR/.venv" # Or "$PROJECT_DIR/venv"
if [ -d "$VENV_PATH/bin" ]; then
    echo "Activating virtual environment..."
    # shellcheck disable=SC1091
    source "$VENV_PATH/bin/activate"
else
    echo "Virtual environment not found at $VENV_PATH. Make sure it's created and path is correct."
    # Optionally, you could try to create it or exit
    # exit 1
fi


# Pull the latest changes from the specified branch
echo "Pulling latest changes from Git branch '$GIT_BRANCH'..."
git fetch origin "$GIT_BRANCH"
git reset --hard "origin/$GIT_BRANCH" # Discard local changes and use remote version
# Alternatively, if you might have local commits you want to keep (less common for automated deploy):
# git pull origin "$GIT_BRANCH"

# Install/update dependencies
echo "Installing/updating Python dependencies from requirements.txt..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "requirements.txt not found. Skipping pip install."
fi

# Run database migrations (if applicable)
# Example for Flask-Migrate:
# if [ -d "migrations" ]; then
#     echo "Running database migrations..."
#     flask db upgrade
# else
#     echo "No migrations directory found. Skipping migrations."
# fi

# Collect static files (if applicable, e.g., for Django)
# echo "Collecting static files..."
# python manage.py collectstatic --noinput

# Touch the WSGI file to reload the PythonAnywhere web app
echo "Reloading PythonAnywhere web app by touching WSGI file: $WSGI_FILE..."
if [ -f "$WSGI_FILE" ]; then
    touch "$WSGI_FILE"
    echo "Web app reload triggered."
else
    echo "Error: WSGI file not found at $WSGI_FILE. Web app NOT reloaded."
    echo "Please update the WSGI_FILE variable in deploy.sh to the correct path."
    exit 1
fi

echo "Deployment process completed successfully."
exit 0
