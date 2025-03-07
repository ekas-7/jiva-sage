#!/bin/bash

# Script to generate lab-report-ocr project structure
# Usage: bash setup_project.sh

set -e  # Exit on error

# Base directory
BASE_DIR="lab-report-ocr"

# Create base directory
mkdir -p "$BASE_DIR"

# Change to base directory
cd "$BASE_DIR"

# Create app directory and subdirectories
echo "Creating directory structure..."
mkdir -p app/{core,api/routes,db/repositories,models/{domain,schemas},services/{ocr,report_parser,storage}}

# Create __init__.py files in all directories
find app -type d | while read dir; do
    touch "$dir/__init__.py"
done

# Create main source files
echo "Creating source files..."
touch app/main.py
touch app/core/{config.py,security.py,logging.py}
touch app/api/{dependencies.py,errors.py}
touch app/api/routes/{reports.py,users.py}
touch app/db/database.py
touch app/db/repositories/{base.py,reports.py,users.py}
touch app/models/domain/{report.py,user.py}
touch app/models/schemas/{report.py,user.py}
touch app/services/ocr/{claude_service.py,pdf_processor.py,image_processor.py}
touch app/services/report_parser/{parser.py,cbc_parser.py,report_mapper.py}
touch app/services/storage/file_storage.py

# Create project files
touch {.env,.env.example,docker-compose.yml,Dockerfile,README.md}

# Create requirements.txt with dependencies
echo "Populating requirements.txt..."
cat > requirements.txt << EOL
# FastAPI and Web
fastapi==0.109.0
uvicorn==0.27.0
python-multipart==0.0.7
pydantic==2.5.3
pydantic-settings==2.1.0
email-validator==2.1.0

# MongoDB
motor==3.3.2
pymongo==4.6.1

# Claude and LangChain
anthropic==0.16.0
langchain==0.1.0
langchain-anthropic==0.1.1

# PDF Processing
PyMuPDF==1.23.8
Pillow==10.2.0

# Utilities
python-dotenv==1.0.0
python-jose==3.3.0
passlib==1.7.4
pandas==2.2.0
numpy==1.26.3
httpx==0.25.2
EOL

# Basic .gitignore content
echo "Creating .gitignore..."
cat > .gitignore << EOL
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
*.egg-info/
.installed.cfg
*.egg

# Environment variables
.env

# Virtual Environment
venv/
ENV/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS specific
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Project specific
/tmp/
EOL

# Create and configure the virtual environment
echo "Setting up virtual environment..."
python3 -m venv venv

# Determine OS to use correct activation command
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # Linux/Mac
    source venv/bin/activate
fi

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Basic .env.example content
echo "Creating .env.example..."
cat > .env.example << EOL
# API Settings
SECRET_KEY=your-secret-key-here

# MongoDB Settings
MONGODB_URL=mongodb://username:password@mongodb:27017/lab_reports?authSource=admin
MONGODB_DB_NAME=lab_reports
MONGO_INITDB_ROOT_USERNAME=username
MONGO_INITDB_ROOT_PASSWORD=password

# Claude API Settings
ANTHROPIC_API_KEY=your-anthropic-api-key-here
CLAUDE_MODEL=claude-3-5-sonnet-20240229

# Storage Settings
TEMP_FILE_PATH=/tmp/lab_reports

# CORS Settings
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://localhost:8080"]
EOL

# Create a copy of .env.example as .env for local development
cp .env.example .env

echo ""
echo "Project setup completed successfully!"
echo ""
echo "Project structure created at: $(pwd)"
echo "Virtual environment created and dependencies installed."
echo ""
echo "To activate the virtual environment in the future:"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "  source venv/Scripts/activate   # Windows"
else
    echo "  source venv/bin/activate       # Linux/Mac"
fi
echo ""
echo "To deactivate the virtual environment:"
echo "  deactivate"
echo ""
echo "Virtual environment is currently active."
echo "Next steps:"
echo "1. Edit the .env file with your specific configuration"
echo "2. Start developing your application!"