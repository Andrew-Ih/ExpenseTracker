# Expense Tracker

A full-stack SaaS web app that allows users to track expenses, manage budgets and receive AI-powered financial insights through natural language queries using an AI assistant chatbot, currently serving 20+ users.

## 🔗 Live Demo: **[Try the Live App](https://andrew-ih-expense-tracker-dev.s3.ca-central-1.amazonaws.com/index.html)**

## 📸 Screenshots

### Dashboard Overview
| Main Dashboard |
|----------------|
| ![Dashboard](./expense-tracker-frontend/images/dashboard/dashboard.png) |

### Transaction Management
| Transaction Overview | Add Transaction |
|--------|--------|
| ![Transactions 1](./expense-tracker-frontend/images/transaction/transactionOverview.png) | ![Transactions 2](./expense-tracker-frontend/images/transaction/addTransaction.png) |

### Budget Tracking
| Budget Overview | Add Budget | Budget History |
|----------|---------|---------|
| ![Budget 1](./expense-tracker-frontend/images/budget/budgetOverview.png) | ![Budget 2](./expense-tracker-frontend/images/budget/addBudget.png) | ![Budget 3](./expense-tracker-frontend/images/budget/budgetHistory.png) |

### AI Financial Assistant
| Insights | Chat Interface |
|----------------|----------|
| ![AI 1](./expense-tracker-frontend/images/AI-assistant/AI_Insights.png) | ![AI 2](./expense-tracker-frontend/images/AI-assistant/chatInterface.png) |

### Profile Management
| Profile Page |
|--------------|
| ![Profile Page](./expense-tracker-frontend/images/profile/profileManagement.png) |


<details style="margin-bottom: 20px;">
<summary><h2 style="display: inline;">Features</h2></summary>

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

- **Budget Management**
  - Create monthly budgets by category
  - Real-time budget vs actual spending tracking
  - Visual progress indicators with color-coded alerts
  - Budget history with yearly summaries
  - Over/under budget analysis
  - Duplicate budget prevention

- **AI Financial Assistant**
  - Chat interface powered by OpenAI GPT
  - Personalized financial insights and spending analysis
  - Budget optimization recommendations
  - Persistent chat history with real-time data integration

- **Enhanced UI/UX**
  - Modern Material UI components with dark theme
  - Mobile-friendly responsive design
  - Intuitive navigation with sidebar layout

</details>

<details style="margin-bottom: 20px;">
<summary><h2 style="display: inline;">Complete Tech Stack, Tools & AWS Services</h2></summary>

### 🎨 Frontend Development
- **Framework**: Next.js 15 with TypeScript for fast, responsive UI
- **UI Library**: Material UI (MUI) v7 with dark theme
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: React hooks and context
- **Type Safety**: Full TypeScript implementation

### ⚙️ Backend Development
- **Runtime**: Node.js with Express.js framework
- **Architecture**: MVC pattern with helper abstraction
- **Deployment**: AWS Lambda serverless functions
- **API Management**: AWS API Gateway for endpoint routing
- **Error Handling**: Centralized error management

### 🗄️ Database & Storage
- **Database**: AWS DynamoDB with GSI optimization
- **Data Access**: DynamoDB Document Client with batch operations
- **Indexing**: Global Secondary Indexes for efficient queries

### 🔐 Authentication & Security
- **Authentication**: AWS Cognito User Pools
- **Authorization**: JWT token-based authentication
- **Security**: IAM roles with least privilege access

### 🚀 Infrastructure & Deployment
- **Infrastructure as Code**: AWS CloudFormation via Serverless Framework
- **Frontend Hosting**: AWS S3 and CloudFront for global CDN
- **CI/CD**: GitHub Actions for continuous integration and deployment
- **Environment Management**: Multi-stage deployments (dev/prod)

### 🤖 AI Integration
- **AI Platform**: OpenAI API integration
- **Prompt Engineering**: Custom prompts for financial insights
- **Data Integration**: Real-time user data for personalized responses
- **Chat Storage**: Persistent conversation history in DynamoDB

</details>

<details style="margin-bottom: 20px;">
<summary><h2 style="display: inline;">Getting Started</h2></summary>

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

</details>

<details style="margin-bottom: 20px;">
<summary><h2 style="display: inline;">Architecture Highlights</h2></summary>

### Database Design
- **Users Table**: Profile information synced with Cognito
- **Transactions Table**: Financial records with UserDateIndex GSI
- **Budgets Table**: Monthly budget allocations with UserMonthIndex GSI
- **Optimized Queries**: Single-query operations for better performance
- **Chat History Table**: AI conversation storage with UserTimestampIndex GSI

### Code Organization
- **MVC Pattern**: Clear separation of concerns
- **Helper Functions**: Abstracted DynamoDB operations
- **Error Handling**: Centralized error management with user-friendly messages
- **Validation**: Input validation at multiple layers
- **Type Safety**: Full TypeScript implementation

</details>

<details style="margin-bottom: 20px;">
<summary><h2 style="display: inline;">Infrastructure as Code (IaC)</h2></summary>

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

</details>

<details style="margin-bottom: 20px;">
<summary><h2 style="display: inline;">Key Learnings</h2></summary>

1. **Performance Optimization**: Always consider the number of API calls and database queries. Batch operations when possible.

2. **User Experience**: Loading states should maintain visual continuity. Avoid full-page re-renders.

3. **Input Validation**: Validate on both client and server. Prevent unnecessary API calls with client-side checks.

4. **Code Architecture**: Abstract common patterns early. Use helper functions and centralized error handling.

5. **Professional Polish**: Consistent formatting, proper typography, and attention to detail make a significant difference.

6. **Database Design**: Proper GSI design enables efficient queries. Consider access patterns when designing tables.

7. **Error Handling**: User-friendly error messages are crucial. Technical errors should be logged, not displayed to users.

</details>git reset --soft HEAD~4
