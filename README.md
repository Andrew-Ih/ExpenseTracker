# Expense Tracker

A full-stack web application for tracking personal expenses with secure user authentication, profile management, transactions and and comprehensive budget tracking. 

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
  - Track transaction history with advanced filtering
  - User-specific transaction isolation
  - Partial updates for transaction fields
  - Pagination support for large datasets

- **Budget Management**
  - Create monthly budgets by category
  - Real-time budget vs actual spending tracking
  - Visual progress indicators with color-coded alerts
  - Budget history with yearly summaries
  - Over/under budget analysis
  - Duplicate budget prevention

- **Enhanced UI/UX**
  - Modern Material UI components with dark theme
  - Mobile-friendly responsive design
  - Professional currency formatting with commas
  - Smooth loading states without jarring re-renders
  - Intuitive navigation with sidebar layout

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **UI Library**: Material UI (MUI) v7
- **Authentication**: AWS Cognito integration
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **Type Safety**: TypeScript

### Backend
- **Runtime**: Node.js with Express.js
- **Architecture**: MVC pattern with helper abstraction
- **Database**: Amazon DynamoDB with GSI optimization
- **Authentication**: Amazon Cognito User Pools
- **Deployment**: AWS Lambda via Serverless Framework
- **Infrastructure as Code**: AWS CloudFormation
- **Error Handling**: Centralized error management

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
- Frontend runs on http://localhost:3000
```

### Backend Setup
```bash
cd expense-tracker-backend
npm install
npm run dev  # Run locally with serverless-offline
- Backend runs on http://localhost:3001
```

### Deployment
```bash
# Deploy backend to AWS Lambda
cd expense-tracker-backend
npm run deploy

# Update frontend environment variables with new API URL
```

## AWS Services Used:
- **Amazon Cognito**: User authentication and management
- **AWS Lambda**: Serverless backend compute
- **Amazon API Gateway**: REST API endpoints
- **Amazon DynamoDB**: NoSQL database with GSI
- **AWS IAM**: Security and permissions
- **AWS CloudFormation**: Infrastructure as Code

## Architecture Highlights

### Database Design
- **Users Table**: Profile information synced with Cognito
- **Transactions Table**: Financial records with UserDateIndex GSI
- **Budgets Table**: Monthly budget allocations with UserMonthIndex GSI
- **Optimized Queries**: Single-query operations for better performance

### Code Organization
- **MVC Pattern**: Clear separation of concerns
- **Helper Functions**: Abstracted DynamoDB operations
- **Error Handling**: Centralized error management with user-friendly messages
- **Validation**: Input validation at multiple layers
- **Type Safety**: Full TypeScript implementation


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
   - Registration → Email verification → Login → JWT token
   - Token-based API authentication

3. **Data Flow**:
   - User data stored in both Cognito and DynamoDB
   - Profile updates sync between both systems
   - Transactions stored in DynamoDB with user isolation

4. **Transaction Operations**:
   - Create: Add new income or expense entries
   - Read: View transaction history with filtering options
   - Update: Modify transaction details as needed
   - Delete: Remove unwanted transactions

5. **Budget Operations**:
  - Create: Monthly budget allocation by category
  - Track: Real-time spending vs budget comparison
  - Analyze: Historical performance and trends
  - Visualize: Progress bars and color-coded indicators

  ## Development Notes

For detailed information about issues encountered during development, solutions implemented, and technical learnings, see [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md).

**Key Issues Resolved:**
- Performance optimization (24 API calls → 2 API calls)
- Improved loading states and user experience
- Input validation and error handling
- Code architecture and maintainability
- UI consistency and professional formatting

## Key Learnings

1. **Performance Optimization**: Always consider the number of API calls and database queries. Batch operations when possible.

2. **User Experience**: Loading states should maintain visual continuity. Avoid full-page re-renders.

3. **Input Validation**: Validate on both client and server. Prevent unnecessary API calls with client-side checks.

4. **Code Architecture**: Abstract common patterns early. Use helper functions and centralized error handling.

5. **Professional Polish**: Consistent formatting, proper typography, and attention to detail make a significant difference.

6. **Database Design**: Proper GSI design enables efficient queries. Consider access patterns when designing tables.

7. **Error Handling**: User-friendly error messages are crucial. Technical errors should be logged, not displayed to users.
