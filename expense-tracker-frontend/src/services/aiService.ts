import { AIChatResponse, FinancialData, FinancialSummary } from '../types/ai';
import * as transactionService from './transactionService';
import * as budgetService from './budgetService';
import * as userService from './userService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class AIService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response;
  }

  private async getFinancialContext(): Promise<FinancialData> {
    try {
      // Fetch user profile
      const userProfile = await userService.getUserProfile();

      // Fetch ALL transactions (remove limit and extend range)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const transactions = await transactionService.getTransactions({
        startDate: oneYearAgo.toISOString().split('T')[0],
        // Remove limit to get all transactions
      });

      // Fetch recurring transactions
      const recurringTransactions = await transactionService.getRecurringTransactions();

      // Fetch current month budgets
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const budgets = await budgetService.getBudgets(currentMonth);

      // Calculate financial summary
      const summary = this.calculateFinancialSummary(transactions.transactions);

      return {
        transactions: transactions.transactions,
        recurringTransactions: recurringTransactions.transactions || [],
        budgets,
        userProfile,
        summary
      };
    } catch (error) {
      console.error('Failed to fetch financial context:', error);
      throw new Error('Failed to load your financial data');
    }
  }

  private calculateFinancialSummary(transactions: unknown[]): FinancialSummary {
    const totalIncome = transactions
      .filter((t: unknown) => (t as { type: string }).type === 'income')
      .reduce((sum: number, t: unknown) => sum + parseFloat((t as { amount: string }).amount), 0);

    const totalExpenses = transactions
      .filter((t: unknown) => (t as { type: string }).type === 'expense')
      .reduce((sum: number, t: unknown) => sum + parseFloat((t as { amount: string }).amount), 0);

    const netIncome = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

    // Calculate top spending categories
    const categorySpending = transactions
      .filter((t: unknown) => (t as { type: string }).type === 'expense')
      .reduce((acc: Record<string, number>, t: unknown) => {
        const category = (t as { category: string }).category;
        acc[category] = (acc[category] || 0) + parseFloat((t as { amount: string }).amount);
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      savingsRate,
      topCategories
    };
  }

  async sendMessage(message: string, signal?: AbortSignal): Promise<AIChatResponse> {
    try {
      // Simplified - just send the message, let backend handle data fetching
      const request = {
        message,
        userId: localStorage.getItem('userId') // If you have userId in localStorage
      };

      console.log('Sending message to AI backend:', message);

      const response = await this.fetchWithAuth('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify(request),
        signal
      });

      console.log('AI response status:', response.status);
      const data = await response.json();
      console.log('AI response data:', data);
      
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw error;
      }

      console.error('AI service error:', error);
      
      // Return a fallback response for development
      return {
        message: this.getFallbackResponse(message),
        metadata: {
          type: 'general',
          confidence: 0.5,
          dataPoints: 0,
          processingTime: 0
        }
      };
    }
  }

  private getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('spending') || lowerMessage.includes('spend')) {
      return "I can help you analyze your spending patterns! Once the AI backend is connected, I'll be able to provide detailed insights about your expenses, including your top spending categories, monthly trends, and recommendations for saving money.";
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('budget')) {
      return "I can help you with budget analysis! Once connected to your financial data, I'll be able to show you how you're tracking against your budget goals, identify areas where you might be overspending, and suggest ways to stay on track.";
    }
    
    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      return "I can help you with savings insights! Once the AI is fully connected, I'll analyze your income and expenses to show you your current savings rate, identify opportunities to save more, and help you reach your financial goals.";
    }
    
    return "I'm your AI Financial Assistant! I can help you analyze your spending, track budgets, and provide financial insights. The AI backend is currently being set up, but I'll soon be able to answer questions about your specific financial data.";
  }

  async getSuggestions(): Promise<string[]> {
    return [
      "What am I spending the most on?",
      "Which month did I spend the most?",
      "What was my most expensive purchase?",
      "How much did I spend on food this month?",
      "Am I on track to reach my budget goals?",
      "What are my top 3 spending categories?",
      "How much can I save if I reduce entertainment by 20%?",
      "Which days of the week do I spend the most money?",
      "What's my average daily spending?",
      "How does my spending compare to last month?"
    ];
  }

  async clearChatHistory(): Promise<void> {
    try {
      // Clear backend chat history
      await this.fetchWithAuth('/api/ai/chat-history', {
        method: 'DELETE'
      });
      
      // Also clear local storage
      localStorage.removeItem('ai_chat_history');
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      // Still clear frontend state even if backend fails
      localStorage.removeItem('ai_chat_history');
      throw new Error('Failed to clear chat history');
    }
  }
}

export const aiService = new AIService(); 