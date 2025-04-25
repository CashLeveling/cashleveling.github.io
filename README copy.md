# Personal Budget

A personal financial budgeting application built with React, Tailwind CSS, and Firebase.

## Features

- User authentication (signup, login, password reset)
- Dashboard with financial summary
- Add income, expense, and savings entries
- Budget overview with category breakdown
- Goal tracking for savings targets
- Savings calculator

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Firebase Setup

1. Go to the Firebase console (https://console.firebase.google.com/)
2. Click "Add project" and follow the steps to create a new project
3. Once your project is created, click on the web icon (</>) to add a web app to your project
4. Register your app with a nickname (e.g., "personal-budget")
5. Copy the Firebase configuration object
6. Create a `.env` file based on the `.env.example` template and add your Firebase configuration values:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
7. Update the `.firebaserc` file with your Firebase project ID:
   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```
8. Install Firebase CLI (if not already installed):
   ```
   npm install -g firebase-tools
   ```
9. Login to Firebase:
   ```
   firebase login
   ```

### Using GitHub Secrets for Firebase Configuration

For CI/CD pipelines, you should use GitHub secrets to store your Firebase configuration:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`
   - `FIREBASE_SERVICE_ACCOUNT` (Generate this in Firebase Project Settings > Service accounts > Generate new private key)

The GitHub workflow file (`.github/workflows/firebase-deploy.yml`) is already set up to use these secrets for deployment.

### Enable Authentication

1. In the Firebase console, go to "Authentication" > "Sign-in method"
2. Enable the "Email/Password" provider

### Firestore Database Setup

1. In the Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database
5. Deploy the security rules using Firebase CLI:
   ```
   firebase deploy --only firestore:rules
   ```
6. Deploy the indexes using Firebase CLI:
   ```
   firebase deploy --only firestore:indexes
   ```

### Firebase Security Rules

The project includes security rules in `firestore.rules` that:
- Restrict access to user-specific data
- Ensure users can only read and write their own data
- Validate data structure on write operations

### Running the Application

```
npm run dev
```

The application will be available at http://localhost:5173 (or another port if 5173 is in use).

## Project Structure

- `/src/components`: Reusable UI components
- `/src/components/auth`: Authentication-related components
- `/src/contexts`: React context providers
- `/src/firebase`: Firebase configuration and initialization
- `/src/layouts`: Layout components
- `/src/pages`: Page components
- `/src/utils`: Utility functions

## Phase 1: Frontend Development

- Basic UI components
- Local storage for data persistence
- Core functionality without backend

## Phase 2: Backend Integration

- Firebase Authentication
- Firestore Database
- User-specific data
