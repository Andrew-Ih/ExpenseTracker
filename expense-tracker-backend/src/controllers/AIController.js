import OpenAI from 'openai';
import TransactionModel from '../models/TransactionModel.js';
import BudgetModel from '../models/BudgetModel.js';
import UserModel from '../models/user.js';
import ChatHistoryModel from '../models/ChatHistoryModel.js';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      let chatHistory = await ChatHistoryModel.getRecentMessages(userId, 10);

      // Add this: Clear old chat history if it's causing confusion
      if (chatHistory.length > 20) {
        console.log('Clearing old chat history to improve AI responses');
        await ChatHistoryModel.clearChatHistory(userId);
        chatHistory = [];
      }

      // Step 3: Extract month from message and get filtered data
      const monthMatch = message.match(/(january|february|march|april|may|june|july|august|september|october|november|december|\d{4}-\d{2})/i);
      let filteredTransactions;
      
      if (monthMatch) {
        const monthStr = monthMatch[1].toLowerCase();
        const currentYear = new Date().getFullYear();
        const monthMap = {
          'january': `${currentYear}-01`, 'february': `${currentYear}-02`, 'march': `${currentYear}-03`,
          'april': `${currentYear}-04`, 'may': `${currentYear}-05`, 'june': `${currentYear}-06`,
          'july': `${currentYear}-07`, 'august': `${currentYear}-08`, 'september': `${currentYear}-09`,
          'october': `${currentYear}-10`, 'november': `${currentYear}-11`, 'december': `${currentYear}-12`
        };
        
        const targetMonth = monthMap[monthStr] || monthStr;
        
        // Fetch transactions for specific month
        filteredTransactions = await TransactionModel.getTransactions(userId, { 
          startDate: `${targetMonth}-01`,
          endDate: `${targetMonth}-31`
        });
        
        // Keep this one for basic monitoring
        console.log(`AI request processed for user ${userId} - ${message.substring(0, 50)}...`);
      } else {
        // Fetch all recent transactions
        filteredTransactions = await TransactionModel.getTransactions(userId, { limit: 50 });
      }

      // Step 4: Get other financial data
      const [budgets, userProfile] = await Promise.all([
        BudgetModel.getBudgets(userId),
        UserModel.getById(userId)
      ]);

      // Step 5: Create context for AI
      const context = AIController.createFinancialContext(filteredTransactions.transactions, budgets, userProfile);
      
      // Step 6: Create prompt with chat history
      const prompt = AIController.createPromptWithHistory(message, context, chatHistory);

      // Step 7: Get AI response using OpenAI
      const aiResponse = await AIController.getOpenAIResponse(prompt);

      // Step 8: Save AI response to chat history
      await ChatHistoryModel.saveMessage(userId, aiResponse, 'assistant');

      res.json({
        message: aiResponse,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      // Keep this for error tracking
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

    // Get ALL spending categories, not just top 3
    const spendingByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
        return acc;
      }, {});

    const allCategories = Object.entries(spendingByCategory)
      .sort(([,a], [,b]) => b - a);

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
      topCategories: Object.fromEntries(allCategories), // All categories
      recentTransactions: transactions.slice(0, 10), // More transactions
      budgets: budgets // ALL budgets, not just 3
    };
  }

  // Helper method to create AI prompt with chat history
  static createPromptWithHistory(userMessage, context, chatHistory) {
    let conversationHistory = '';
    
    // Only include very recent history (last 3 messages max)
    if (chatHistory.length > 1 && chatHistory.length <= 6) {
      conversationHistory = '\n\nRecent conversation:\n';
      chatHistory.slice(-6).forEach(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        conversationHistory += `${role}: ${msg.content}\n`;
      });
    }

    return `You are a precise financial assistant. You have access to the user's financial data. Answer questions accurately and completely.

USER DATA:
- Name: ${context.user.name}
- Total Income: $${context.summary.totalIncome.toFixed(0)}
- Total Expenses: $${context.summary.totalExpenses.toFixed(0)}
- Net Income: $${context.summary.netIncome.toFixed(0)}
- Number of Transactions: ${context.summary.transactionCount}

ALL BUDGETS (${context.budgets.length} budgets):
${context.budgets.map((budget, index) => 
  `${index + 1}. ${budget.category}: $${budget.amount} (Month: ${budget.month})`
).join('\n')}

SPENDING BY CATEGORY:
${Object.entries(context.topCategories)
  .map(([category, amount]) => `- ${category}: $${amount.toFixed(0)}`)
  .join('\n')}

ALL TRANSACTIONS (${context.recentTransactions.length} transactions):
${context.recentTransactions.map((t, index) => 
  `${index + 1}. ${t.date}: ${t.description} (${t.category}) - $${t.amount}`
).join('\n')}

${conversationHistory}

USER QUESTION: ${userMessage}

INSTRUCTIONS: 
- Answer the user's question directly and completely
- If asked for budget count, count the ACTUAL budgets listed above
- If asked for budget details, list ALL budgets with categories and amounts
- If asked for transaction count, give the exact number
- If asked for transaction list, list ALL transactions with dates, descriptions, categories, and amounts
- Be precise with amounts and dates
- Do not make up or guess any information
- If you don't have the data, say so clearly`;
  }
  
  // Helper method to communicate with OpenAI (improved)
  static async getOpenAIResponse(prompt) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a precise financial assistant. Always provide accurate, complete information based on the data provided. List all relevant transactions when asked. Be specific with amounts, dates, and categories. Do not truncate responses."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500, // Increased from 200
        temperature: 0.1, // Lower temperature for more consistent responses
        presence_penalty: 0.1, // Slight penalty for repetition
        frequency_penalty: 0.1 // Slight penalty for repetitive phrases
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

  // Optional: Add auto-clear for old history
  static async autoClearOldHistory(userId) {
    try {
      const chatHistory = await ChatHistoryModel.getRecentMessages(userId, 50);
      if (chatHistory.length > 30) {
        console.log(`Auto-clearing old chat history for user ${userId}`);
        await ChatHistoryModel.clearChatHistory(userId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auto-clear history error:', error);
      return false;
    }
  }
}

export default AIController;
