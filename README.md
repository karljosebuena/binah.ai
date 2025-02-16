# Binah.ai FCV Analysis Portal

A web portal for analyzing Forced Cough Vocalization (FCV) samples to detect various health conditions.

## Features

- Upload and analyze FCV audio samples
- Test for multiple conditions (TB, COVID-19, Smoking)
- View historical test results
- Filter and sort results
- Detailed test-specific result views

## Tech Stack

- Frontend: React with TypeScript
- Backend: NestJS
- Database: MongoDB
- Authentication: Clerk
- State Management: React Query
- UI: Tailwind CSS

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- MongoDB
- Clerk account and credentials

## Environment Setup

1. Clone the repository
2. Copy environment files:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

3. Update the environment variables:

### API (.env)
```
MONGODB_URI=mongodb://admin:password123@localhost:27017/fcv_db
CLERK_SECRET_KEY=your_clerk_secret_key
UPLOAD_DIRECTORY=./uploads
```

### Web (.env)
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000
```

## Development

1. Start MongoDB:
```bash
docker-compose up -d
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development servers:
```bash
# Start both frontend and backend
pnpm dev

# Or individually:
cd apps/api && pnpm dev
cd apps/web && pnpm dev
```

The web app will be available at http://localhost:5173
The API will be available at http://localhost:3000

## API Documentation

### Authentication

All API endpoints require authentication using a Bearer token from Clerk.

### Endpoints

#### Upload Sample
```http
POST /v1/samples/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "userId": "string",
  "testTypes": ["TB", "COVID19", "SMOKING"],
  "file": <audio_file>
}
```

#### Get Results
```http
GET /v1/test-results?userId=<userId>&testType=<testType>
Authorization: Bearer <token>
```

### Response Types

#### Test Result
```typescript
{
  id: string;
  sampleId: string;
  userId: string;
  testType: "TB" | "COVID19" | "SMOKING";
  confidenceScore: number;
  processingStatus: "INCOMPLETE" | "COMPLETE_SUCCESS" | "COMPLETE_ERROR" | "COMPLETE_FAILURE";
  createdAt: string;
  updatedAt: string;
}
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Project Structure

```
.
└── apps/
    ├── api/              # NestJS backend
    │   ├── src/
    │   │   ├── application/    # Application services
    │   │   ├── domain/        # Domain entities and logic
    │   │   ├── infrastructure/ # External services
    │   │   └── presentation/  # Controllers and DTOs
    │   └── test/
    └── web/              # React frontend
        ├── src/
        │   ├── components/    # Reusable UI components
        │   ├── hooks/        # Custom React hooks
        │   ├── lib/          # Utilities and API client
        │   └── pages/        # Page components
        └── test/
```


## TODOs

### Security Enhancements
- [ ] Implement proper JWT validation with Clerk SDK
- [ ] Add token expiration checks
- [ ] Implement role-based access control
- [ ] Add rate limiting
- [ ] Add request origin validation
- [ ] Implement audit logging for security events

### Testing
- [ ] Add backend unit tests
- [ ] Add frontend component tests
- [ ] Add integration tests
