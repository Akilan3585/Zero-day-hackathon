# Backend Setup Guide

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Environment File
Create a `.env` file in the `backend` directory with your Firebase credentials:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# Server Configuration
PORT=3000
```

### 3. Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Copy the configuration values

### 4. Start the Server
```bash
npm start
```

### 5. Test the API
```bash
node test-announcement.js
```

## 🐛 Troubleshooting

### Common Issues:

1. **"Module not found" errors**: Run `npm install` to install dependencies
2. **Firebase connection errors**: Check your `.env` file has correct Firebase credentials
3. **CORS errors**: The backend has CORS enabled, but make sure frontend is running on the correct port
4. **Authentication errors**: Make sure you're logged in as admin in the frontend

### Debug Steps:

1. Check if server is running: `http://localhost:3000`
2. Check browser console for errors
3. Check network tab for failed requests
4. Check backend console for error logs

## 📝 API Endpoints

- `GET /api/announcement/announcements` - Get all announcements
- `POST /api/announcement/announcements` - Create new announcement (admin only)
- `PUT /api/announcement/announcements/:id` - Update announcement (admin only)
- `DELETE /api/announcement/announcements/:id` - Delete announcement (admin only)

## 🔐 Authentication

The announcement creation requires admin role. Make sure:
1. User is logged in
2. User role is set to 'admin' in localStorage
3. Valid token is sent in Authorization header 