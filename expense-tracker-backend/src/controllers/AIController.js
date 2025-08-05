import OpenAI from 'openai';
import TransactionModel from '../models/TransactionModel.js';
import BudgetModel from '../models/BudgetModel.js';
import UserModel from '../models/user.js';
import ChatHistoryModel from '../models/ChatHistoryModel.js';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ... existing imports and setup ...

class AIController {
  static async chat(req, res) {
    try {
      const userId = req.user.userId;
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Step 1: Save user message to chat history
      await ChatHistoryModel.saveMessage(userId, message, 'user');

      // Step 2: Get recent chat history (last 10 messages)
      const chatHistory = await ChatHistoryModel.getRecentMessages(userId, 10);

      // Step 3: Get user's financial data
      const [transactions, budgets, userProfile] = await Promise.all([
        TransactionModel.getTransactions(userId, { limit: 50 }), // Reduced from 100
        BudgetModel.getBudgets(userId),
        UserModel.getById(userId)
      ]);

      // Step 4: Create context for AI
      const context = AIController.createFinancialContext(transactions.transactions, budgets, userProfile);
      
      // Step 5: Create prompt with chat history
      const prompt = AIController.createPromptWithHistory(message, context, chatHistory);

      // Step 6: Get AI response using OpenAI
      const aiResponse = await AIController.getOpenAIResponse(prompt);

      // Step 7: Save AI response to chat history
      await ChatHistoryModel.saveMessage(userId, aiResponse, 'assistant');

      res.json({
        message: aiResponse,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('AI Chat error:', error);
      res.status(500).json({ error: 'Failed to process AI request' });
    }
  }

  // Helper method to create financial context (optimized)
  static createFinancialContext(transactions, budgets, userProfile) {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Only get top 3 spending categories to reduce tokens
    const spendingByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
        return acc;
      }, {});

    const topCategories = Object.entries(spendingByCategory)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3); // Only top 3 categories

    return {
      user: {
        name: `${userProfile.firstName} ${userProfile.lastName}`,
        email: userProfile.email
      },
      summary: {
        totalIncome,
        totalExpenses,
        netIncome: totalIncome - totalExpenses,
        transactionCount: transactions.length
      },
      topCategories: Object.fromEntries(topCategories),
      recentTransactions: transactions.slice(0, 5), // Only 5 recent transactions
      budgets: budgets.slice(0, 3) // Only 3 budgets
    };
  }

  // Helper method to create AI prompt with chat history
  static createPromptWithHistory(userMessage, context, chatHistory) {
    let conversationHistory = '';
    
    // Add recent conversation history (excluding the current message)
    if (chatHistory.length > 1) {
      conversationHistory = '\n\nRecent conversation:\n';
      chatHistory.slice(0, -1).forEach(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversationHistory += `${role}: ${msg.content}\n`;
      });
    }

    return `You are a helpful financial assistant with memory of previous conversations. Answer the user's question specifically and reference previous context when relevant.

User: ${context.user.name}
Income: $${context.summary.totalIncome.toFixed(0)}
Expenses: $${context.summary.totalExpenses.toFixed(0)}
Net: $${context.summary.netIncome.toFixed(0)}

Top spending: ${Object.entries(context.topCategories)
  .map(([category, amount]) => `${category}: $${amount.toFixed(0)}`)
  .join(', ')}${conversationHistory}

Current question: ${userMessage}

Answer the question directly. If the user asks about previous questions or context, reference the conversation history above. Only provide advice if specifically asked for it.`;
  }
  
  // Helper method to communicate with OpenAI (more direct)
  static async getOpenAIResponse(prompt) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful financial assistant with memory of previous conversations. Answer questions specifically and reference previous context when relevant. Keep responses brief and to the point."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200, // Increased for more detailed responses
        temperature: 0.3 // Lower temperature for more consistent responses
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  // New method to clear chat history
  static async clearChatHistory(req, res) {
    try {
      const userId = req.user.userId;
      await ChatHistoryModel.clearChatHistory(userId);
      
      res.json({ message: 'Chat history cleared successfully' });
    } catch (error) {
      console.error('Clear chat history error:', error);
      res.status(500).json({ error: 'Failed to clear chat history' });
    }
  }
}

export default AIController;
