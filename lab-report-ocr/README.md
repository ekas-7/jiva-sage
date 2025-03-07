# Lab Report OCR API

A FastAPI backend service that uses Claude's vision capabilities to process and extract structured data from lab report images and PDFs. The system stores the extracted data in MongoDB and provides RESTful APIs for uploads and retrieval.

## Features

- OCR processing for lab reports from images and PDFs
- Flexible JSON schema that accommodates various report formats
- MongoDB storage for extracted data
- Phone number-based lookup for patient records
- Docker containerization for easy deployment
- Comprehensive API documentation via Swagger UI

## Technologies Used

- **FastAPI**: High-performance web framework
- **MongoDB**: NoSQL database for storing report data
- **Claude API**: AI vision model for OCR processing
- **LangChain**: Framework for working with AI models
- **PyMuPDF**: PDF processing library
- **Docker & Docker Compose**: Containerization

## Project Structure

```
lab-report-ocr/
├── app/
│   ├── api/             # API endpoints and dependencies
│   ├── core/            # Core configurations and settings
│   ├── db/              # Database connections and repositories
│   ├── models/          # Data models and schemas
│   ├── services/        # Business logic and services
│   └── main.py          # Application entry point
├── tests/               # Test suite
├── docker-compose.yml   # Docker Compose configuration
├── Dockerfile           # Docker container definition
├── requirements.txt     # Python dependencies
└── .env.example         # Environment variables example
```

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Anthropic API key (for Claude)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lab-report-ocr.git
   cd lab-report-ocr
   ```

2. Create an `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your credentials:
   - Add your Anthropic API key
   - Set MongoDB credentials
   - Configure a secret key for API authentication

4. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

5. The API will be available at http://localhost:8000
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### Reports

- `POST /api/v1/reports/upload`: Upload and process a lab report
- `GET /api/v1/reports/by-phone/{phone_number}`: Get all reports for a phone number
- `GET /api/v1/reports/{report_id}`: Get a specific report by ID
- `DELETE /api/v1/reports/{report_id}`: Delete a report

### Users

- `POST /api/v1/users/`: Create a new user
- `GET /api/v1/users/`: Get list of users
- `GET /api/v1/users/by-phone/{phone_number}`: Get user by phone
- `GET /api/v1/users/{user_id}`: Get user by ID
- `PUT /api/v1/users/{user_id}`: Update user
- `DELETE /api/v1/users/{user_id}`: Delete user

## Development

### Running Locally

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start MongoDB (using Docker):
   ```bash
   docker-compose up -d mongodb
   ```

4. Run the FastAPI application:
   ```bash
   uvicorn app.main:app --reload
   ```

### Running Tests

```bash
pytest
```

## Data Schema

The system uses a flexible schema to accommodate different types of lab reports. The core structure includes:

- **Lab Information**: Name, contact details, etc.
- **Patient Information**: Name, age, gender, etc.
- **Collection Information**: Dates and times
- **Test Results**: Hierarchical structure for various tests
- **Clinical Notes**: Additional context and observations

## Deployment

For production deployment:

1. Update the `.env` file with production configuration
2. Build and deploy the Docker containers
3. Set up proper authentication for the API
4. Configure MongoDB with appropriate security measures

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.