'use client';

import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, AIChatState } from '../types/ai';
import { aiService } from '../services/aiService';

const STORAGE_KEY = 'ai_chat_history';

export function useAIChat() {
  const [state, setState] = useState<AIChatState>({
    messages: [],
    isLoading: false,
    error: null,
    suggestions: []
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load chat history from localStorage
  const loadChatHistory = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const history = JSON.parse(stored);
        setState(prev => ({
          ...prev,
          messages: history.messages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, []);

  // Save chat history to localStorage
  const saveChatHistory = useCallback((messages: Message[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages }));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, []);

  // Add message to chat
  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: new Date()
    };

    setState(prev => {
      const updatedMessages = [...prev.messages, newMessage];
      saveChatHistory(updatedMessages);
      return {
        ...prev,
        messages: updatedMessages,
        error: null
      };
    });

    return newMessage;
  }, [saveChatHistory]);

  // Send message to AI
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Add user message
    addMessage({
      role: 'user',
      content: content.trim()
    });

    // Set loading state
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      // Send to AI service
      const response = await aiService.sendMessage(content, abortControllerRef.current.signal);

      // Add AI response
      addMessage({
        role: 'assistant',
        content: response.message,
        metadata: response.metadata
      });

      // Update suggestions if provided
      if (response.suggestions) {
        setState(prev => ({
          ...prev,
          suggestions: response.suggestions || []
        }));
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled, do nothing
        return;
      }

      console.error('AI service error:', error);
      
      // Add error message
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        metadata: {
          type: 'general'
        }
      });

      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));

    } finally {
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
      abortControllerRef.current = null;
    }
  }, [addMessage]);

  // Clear all messages
  const clearMessages = useCallback(async () => {
    try {
      // Clear backend chat history
      // await aiService.clearChatHistory();
      
      // Clear frontend state
      setState(prev => ({
        ...prev,
        messages: [],
        error: null,
        suggestions: []
      }));
      
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      // Still clear frontend state even if backend fails
      setState(prev => ({
        ...prev,
        messages: [],
        error: null,
        suggestions: []
      }));
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Remove specific message
  const removeMessage = useCallback((messageId: string) => {
    setState(prev => {
      const updatedMessages = prev.messages.filter(msg => msg.id !== messageId);
      saveChatHistory(updatedMessages);
      return {
        ...prev,
        messages: updatedMessages
      };
    });
  }, [saveChatHistory]);

  // Retry last message
  const retryLastMessage = useCallback(() => {
    const lastUserMessage = state.messages
      .filter(msg => msg.role === 'user')
      .pop();

    if (lastUserMessage) {
      // Remove the last AI response if it exists
      const messagesWithoutLastAI = state.messages.filter((msg, index) => {
        if (msg.role === 'assistant' && index === state.messages.length - 1) {
          return false;
        }
        return true;
      });

      setState(prev => ({
        ...prev,
        messages: messagesWithoutLastAI
      }));

      // Resend the last user message
      sendMessage(lastUserMessage.content);
    }
  }, [state.messages, sendMessage]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    suggestions: state.suggestions,
    sendMessage,
    clearMessages,
    removeMessage,
    retryLastMessage,
    loadChatHistory
  };
} 