export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    type: 'financial_analysis' | 'budget_insight' | 'spending_pattern' | 'general';
    confidence?: number;
    dataPoints?: number;
  };
}

export interface AIChatRequest {
  message: string;
  userId: string;
  context?: {
    transactions?: Transaction[];
    budgets?: Budget[];
    userProfile?: UserProfile;
  };
}

export interface AIChatResponse {
  message: string;
  metadata?: {
    type: 'financial_analysis' | 'budget_insight' | 'spending_pattern' | 'general';
    confidence: number;
    dataPoints: number;
    processingTime: number;
  };
  suggestions?: string[];
}

export interface AIServiceConfig {
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'claude-3-sonnet';
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}

export interface FinancialData {
  transactions: Transaction[];
  budgets: Budget[];
  userProfile: UserProfile;
  summary: FinancialSummary;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  month: string;
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

export interface AIChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  suggestions: string[];
} 