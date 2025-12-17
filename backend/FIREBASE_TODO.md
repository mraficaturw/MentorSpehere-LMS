# Firebase Configuration Guide for MentorSphere LMS

## Prerequisites
- Google Account
- Node.js installed (for Firebase CLI)

---

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `mentorsphere-lms`
4. Enable Google Analytics (optional)
5. Click **"Create project"**

---

## Step 2: Enable Firestore Database

1. In Firebase Console, go to **"Build" → "Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"** (or test mode for development)
4. Choose your region (e.g., `asia-southeast1` for Indonesia)
5. Click **"Enable"**

---

## Step 3: Set Up Authentication (Optional)

If you want Firebase Authentication instead of custom JWT:

1. Go to **"Build" → "Authentication"**
2. Click **"Get started"**
3. Enable **"Email/Password"** provider
4. (Optional) Enable **"Google"** sign-in

---

## Step 4: Generate Service Account Key

1. Go to **"Project Settings"** (gear icon) → **"Service accounts"**
2. Click **"Generate new private key"**
3. Download the JSON file
4. Rename to `firebase-credentials.json`
5. Move to `backend/` directory (DO NOT commit to git!)

---

## Step 5: Configure Environment Variables

Update your `backend/.env` file:

```env
# Server Configuration
PORT=3001
ENVIRONMENT=development

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-key-change-in-production

# Firebase Configuration
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## Step 6: Update .gitignore

Add to `backend/.gitignore`:

```
# Firebase credentials (NEVER commit this!)
firebase-credentials.json
*.json
!package.json
```

---

## Step 7: Firestore Collections Structure

Create the following collections in Firestore:

### `users` Collection
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "string (hashed)",
  "role": "student | mentor",
  "avatar": "string (URL)",
  "bio": "string",
  "location": "string",
  "phone": "string",
  "university": "string",
  "joinedDate": "timestamp",
  "enrolledCourses": ["courseId1", "courseId2"],
  "assignedStudents": ["studentId1", "studentId2"],
  "totalStudyTime": "number (minutes)",
  "completedModules": "number",
  "riskScore": "number (0-100)"
}
```

### `courses` Collection
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "instructor": "string",
  "thumbnail": "string (URL)",
  "duration": "string",
  "totalModules": "number",
  "category": "string",
  "level": "beginner | intermediate | advanced",
  "modules": [
    {
      "id": "number",
      "title": "string",
      "duration": "number (minutes)",
      "type": "video | quiz | assignment",
      "status": "locked | in-progress | completed",
      "score": "number (optional)"
    }
  ]
}
```

### `user_settings` Collection
```json
{
  "userId": "string",
  "notifications": {
    "email": "boolean",
    "push": "boolean",
    "studyReminder": "boolean",
    "weeklyReport": "boolean",
    "mentorMessages": "boolean"
  },
  "appearance": {
    "theme": "light | dark | system",
    "language": "id | en",
    "fontSize": "small | medium | large"
  },
  "privacy": {
    "profileVisibility": "public | private",
    "showActivity": "boolean",
    "showProgress": "boolean"
  },
  "learning": {
    "dailyGoal": "number (minutes)",
    "reminderTime": "string (HH:mm)",
    "autoplayVideos": "boolean",
    "subtitles": "boolean"
  }
}
```

### `reflections` Collection
```json
{
  "userId": "string",
  "daily": {
    "date": "string (YYYY-MM-DD)",
    "summary": "string",
    "strengths": ["string"],
    "improvements": ["string"],
    "mood": "string"
  },
  "weekly": {
    "weekNumber": "number",
    "totalStudyTime": "number",
    "averageDaily": "number",
    "topSubjects": ["string"],
    "insights": ["string"],
    "recommendation": "string"
  }
}
```

### `interventions` Collection
```json
{
  "id": "string",
  "mentorId": "string",
  "studentId": "string",
  "type": "focus | schedule | resource",
  "message": "string",
  "status": "active | completed | cancelled",
  "priority": "low | medium | high",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `notifications` Collection
```json
{
  "id": "string",
  "userId": "string",
  "type": "alert | reminder | message",
  "title": "string",
  "message": "string",
  "isRead": "boolean",
  "createdAt": "timestamp"
}
```

### `activity_logs` Collection
```json
{
  "id": "string",
  "userId": "string",
  "action": "string",
  "description": "string",
  "metadata": "object (optional)",
  "createdAt": "timestamp"
}
```

---

## Step 8: Security Rules

Go to **"Firestore Database" → "Rules"** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Courses are readable by authenticated users
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if false; // Admin only via backend
    }
    
    // User settings - only owner can access
    match /user_settings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // For backend admin access, use service account
  }
}
```

> **Note:** Since we're using a service account in the backend, these rules apply to client-side access. The backend has full admin access.

---

## Step 9: Verify Installation

Run the backend:

```bash
cd backend
go mod tidy
go run cmd/server/main.go
```

You should see:
```
✅ Firebase Firestore initialized successfully
🚀 MentorSphere API starting on port 3001
```

---

## Troubleshooting

### "Could not find default credentials"
- Make sure `FIREBASE_CREDENTIALS_PATH` is set correctly in `.env`
- Verify the JSON file exists and is valid

### "Permission denied"
- Check Firestore security rules
- Verify service account has correct permissions

### "Project not found"
- Ensure the project ID in credentials matches your Firebase project

---

## Next Steps

After Firebase is configured:

1. ✅ Backend will connect to real Firestore
2. ✅ Data will persist across restarts
3. ⚠️ Update services to use Firestore queries instead of mock data
4. ⚠️ Implement proper data seeding script
