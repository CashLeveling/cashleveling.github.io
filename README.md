# Personal Budget Tracker

A React-based personal finance application for tracking budgets, expenses, and savings goals.

## Features

- User authentication with Firebase
- Budget tracking and management
- Expense categorization
- Savings goals and progress tracking
- Responsive design with Tailwind CSS
- Dark mode support

## Development Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/cashleveling.github.io.git
   cd cashleveling.github.io
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Deployment to GitHub Pages

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

### Setting up GitHub Secrets

For the GitHub Actions workflow to build and deploy correctly, you need to add your Firebase configuration as repository secrets:

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Add the following secrets:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`

### Manual Deployment

If you prefer to deploy manually:

1. Build the project
   ```
   npm run build
   ```

2. Deploy the `dist` folder to GitHub Pages

## Technologies Used

- React
- Firebase (Authentication, Firestore)
- React Router
- Tailwind CSS
- Vite
- Recharts (for data visualization)
