'use client';

import { useState, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import { 
  AIChatHeader, 
  AIChatMessages, 
  AIChatInput, 
  AIChatSuggestions 
} from './index';
import { useAIChat } from '../../hooks/useAIChat';

export default function AIChatContainer() {
  const { messages, isLoading, sendMessage, clearMessages, loadChatHistory } = useAIChat();
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Load chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  // Update showSuggestions based on whether there are messages
  useEffect(() => {
    setShowSuggestions(messages.length === 0);
  }, [messages.length]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    setShowSuggestions(false);
    await sendMessage(content);
  }, [sendMessage]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSendMessage(suggestion);
  }, [handleSendMessage]);

  const handleClearChat = useCallback(() => {
    clearMessages();
    setShowSuggestions(true);
  }, [clearMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Box 
      component="form"
      onSubmit={handleSubmit}
      sx={{ 
        height: 'calc(100vh - 48px)', // Account for AppLayout padding
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
    }}>
      {/* Header */}
      <AIChatHeader onClearChat={handleClearChat} />
      
      {/* Main Chat Area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Messages */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {messages.length === 0 && showSuggestions ? (
            <AIChatSuggestions onSuggestionClick={handleSuggestionClick} />
          ) : (
            <AIChatMessages messages={messages} isLoading={isLoading} />
          )}
        </Box>
        
        {/* Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <AIChatInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={messages.length === 0 && !showSuggestions}
          />
        </Box>
      </Box>
    </Box>
  );
} 