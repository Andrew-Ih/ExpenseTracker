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

- **Transaction Management**
  - Create, read, update, and delete financial transactions
  - Categorize expenses and income
  - Track transaction history
  - User-specific transaction isolation
  - Partial updates for transaction fields

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
- **Infrastructure as Code**: AWS CloudFormation via Serverless Framework

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

## AWS Services Used:
- **Amazon Cognito**: User authentication
- **AWS Lambda**: Serverless backend
- **Amazon API Gateway**: REST API endpoints
- **Amazon DynamoDB**: NoSQL database
- **AWS IAM**: Security and permissions
- **AWS CloudFormation**: Infrastructure as Code

## Infrastructure as Code (IaC)

This project uses AWS CloudFormation through the Serverless Framework to define and provision AWS infrastructure:

- **DynamoDB Tables**: User and transaction tables with appropriate indexes
- **IAM Roles and Policies**: Least privilege access for Lambda functions
- **API Gateway**: REST API configuration
- **Lambda Functions**: Serverless compute for the backend

Benefits of using IaC with CloudFormation:
- **Reproducible environments**: The same infrastructure can be deployed consistently
- **Version control**: Infrastructure changes are tracked in Git
- **Automated deployments**: One command to deploy all resources
- **Reduced human error**: No manual steps in the AWS console
- **Cost management**: Resources are defined explicitly, preventing unexpected charges

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
   - Transactions stored in DynamoDB with user isolation

4. **Transaction Operations**:
   - Create: Add new income or expense entries
   - Read: View transaction history with filtering options
   - Update: Modify transaction details as needed
   - Delete: Remove unwanted transactions