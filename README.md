# Node.js Express API

A simple Node.js Express server with two POST API endpoints:
1. Generate Signed URLs for S3 file uploads
2. Get Trivia Questions from Open Trivia Database

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables by creating a `.env` file:
```bash
# AWS Configuration (for signed URL generation)
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### GET /
Returns API information and available endpoints.

### POST /api/generate-signed-url
Generates a signed URL for S3 file upload.

**Request Body:**
```json
{
  "fileName": "example.jpg",
  "fileType": "image/jpeg",
  "expiresIn": 3600
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "signedUrl": "https://your-bucket.s3.amazonaws.com/...",
    "fileName": "example.jpg",
    "fileType": "image/jpeg",
    "expiresIn": 3600,
    "bucket": "your-bucket-name"
  }
}
```

### POST /api/trivia
Fetches trivia questions from Open Trivia Database.

**Request Body:**
```json
{
  "amount": 10,
  "category": 9,
  "difficulty": "easy",
  "type": "multiple"
}
```

**Parameters:**
- `amount`: Number of questions (1-50, default: 10)
- `category`: Category ID (optional)
- `difficulty`: "easy", "medium", or "hard" (optional)
- `type`: "multiple" or "boolean" (default: "multiple")

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 10,
    "questions": [
      {
        "id": 1,
        "category": "General Knowledge",
        "type": "multiple",
        "difficulty": "easy",
        "question": "What is the capital of France?",
        "correctAnswer": "Paris",
        "incorrectAnswers": ["London", "Berlin", "Madrid"],
        "allAnswers": ["Paris", "London", "Berlin", "Madrid"]
      }
    ],
    "metadata": {
      "amount": 10,
      "category": 9,
      "difficulty": "easy",
      "type": "multiple"
    }
  }
}
```

## Testing the APIs

You can test the APIs using curl, Postman, or any HTTP client:

```bash
# Test trivia endpoint
curl -X POST http://localhost:3000/api/trivia \
  -H "Content-Type: application/json" \
  -d '{"amount": 5, "difficulty": "easy"}'

# Test signed URL endpoint (requires AWS configuration)
curl -X POST http://localhost:3000/api/generate-signed-url \
  -H "Content-Type: application/json" \
  -d '{"fileName": "test.jpg", "fileType": "image/jpeg"}'
```
