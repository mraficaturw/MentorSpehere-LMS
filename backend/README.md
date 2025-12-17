# MentorSphere API

Backend API server for MentorSphere LMS built with Go and Fiber framework.

## Features

- 🔐 JWT Authentication
- 👤 User Management (Profile, Settings)
- 📚 Course Management
- 📊 Student Dashboard
- 👨‍🏫 Mentor Dashboard
- 🤖 AI Reflections & Risk Assessment
- 🔔 Notifications & Interventions

## Quick Start

### Prerequisites

- Go 1.21 or later
- (Optional) Firebase project for production

### Installation

```bash
# Install dependencies
go mod download

# Copy environment file
cp .env.example .env

# Run the server
go run cmd/server/main.go
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### User
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/avatar` - Update avatar
- `GET /api/user/settings` - Get settings
- `PUT /api/user/settings/:section` - Update settings
- `PUT /api/user/password` - Change password
- `DELETE /api/user` - Delete account

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/:id/modules` - Get modules
- `PUT /api/courses/:id/modules/:moduleId` - Update module status
- `GET /api/courses/:id/quiz-summary` - Get quiz summary

### Student
- `GET /api/student/dashboard` - Get dashboard
- `GET /api/student/courses` - Get enrolled courses
- `GET /api/student/activity` - Get activity logs

### Mentor
- `GET /api/mentor/dashboard` - Get dashboard
- `GET /api/mentor/students` - Get students
- `GET /api/mentor/students/:id` - Get student detail
- `POST /api/mentor/interventions` - Create intervention
- `GET /api/mentor/interventions` - Get interventions
- `PUT /api/mentor/interventions/:id` - Update intervention
- `GET /api/mentor/notifications` - Get notifications
- `PUT /api/mentor/notifications/:id/read` - Mark read

### Reflections
- `GET /api/reflections` - Get reflections
- `POST /api/reflections/generate` - Generate AI reflection
- `GET /api/reflections/daily` - Get daily reflection
- `GET /api/reflections/weekly` - Get weekly insight
- `GET /api/reflections/learning-path` - Get learning path
- `GET /api/reflections/risk-assessment` - Get risk assessment

## Test Accounts

| Email | Password | Role |
|-------|----------|------|
| budi@student.com | password123 | Student |
| siti@student.com | password123 | Student |
| hendra@mentor.com | password123 | Mentor |

## Project Structure

```
backend/
├── cmd/server/          # Application entry point
├── internal/
│   ├── config/          # Configuration
│   ├── database/        # Firebase connection
│   ├── handlers/        # HTTP handlers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Data models
│   ├── router/          # Route definitions
│   └── services/        # Business logic
└── pkg/utils/           # Utilities
```
