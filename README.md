# Node.js MongoDB Auth API (JWT + RBAC)

Functional authentication API built with Node.js, Express, and MongoDB.

## Features
- User registration
- User login with JWT token
- Role-based access control (`user`, `admin`)
- Protected routes
- Centralized error handling
- Structured logs

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with real MongoDB connection string and JWT secret.
4. Start in development:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (Bearer token required)
- `GET /api/v1/admin/users` (Bearer token + `admin` role required)

## Example JSON bodies
Register:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

Login:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
