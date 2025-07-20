# Expense Tracker

A full-stack web application for tracking personal expenses with secure user authentication and profile management.

## Features

- **User Authentication**
  - Secure registration and login with AWS Cognito
  - Email verification flow
  - Password reset functionality
  - JWT token-based authentication

- **User Profile Management**
  - View and edit profile information
  - Update name details
  - Delete account (removes data from both DynamoDB and Cognito)

- **Responsive UI**
  - Modern Material UI components
  - Mobile-friendly design
  - Dark theme support

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **UI Library**: Material UI (MUI) v7
- **Authentication**: AWS Cognito integration
- **Styling**: Tailwind CSS

### Backend
- **Runtime**: Node.js with Express.js
- **Architecture**: MVC pattern with serverless deployment
- **Database**: Amazon DynamoDB
- **Authentication**: Amazon Cognito User Pools
- **Deployment**: AWS Lambda via Serverless Framework

## Getting Started

### Prerequisites
- Node.js 18+
- AWS Account
- AWS CLI configured

### Frontend Setup
```bash
cd expense-tracker-frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd expense-tracker-backend
npm install
npm run dev  # Run locally with serverless-offline
```

### Deployment
```bash
# Deploy backend to AWS Lambda
cd expense-tracker-backend
npm run deploy

# Update frontend environment variables with new API URL
```

## AWS Services Used so far:
- **Amazon Cognito**: User authentication
- **AWS Lambda**: Serverless backend
- **Amazon API Gateway**: REST API endpoints
- **Amazon DynamoDB**: NoSQL database
- **AWS IAM**: Security and permissions

## Development Workflow

1. **Local Development**:
   - Frontend runs on http://localhost:3000
   - Backend runs on http://localhost:3001

2. **Authentication Flow**:
   - User registers → Email verification → Login → JWT token
   - Token used for authenticated API requests

3. **Data Flow**:
   - User data stored in both Cognito and DynamoDB
   - Profile updates sync between both systems

