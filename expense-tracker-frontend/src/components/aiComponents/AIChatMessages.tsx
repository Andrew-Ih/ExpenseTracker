'use client';

import { Box, Stack } from '@mui/material';
import { useEffect, useRef } from 'react';
import AIChatMessage from './AIChatMessage';
import AILoadingIndicator from './AILoadingIndicator';
import { Message } from '../../types/ai';

interface AIChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export default function AIChatMessages({ messages, isLoading }: AIChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <Box sx={{ 
      flex: 1, 
      overflow: 'auto',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      <Stack spacing={2} sx={{ flex: 1 }}>
        {messages.map((message, index) => (
          <AIChatMessage 
            key={`${message.id}-${index}`}
            message={message}
          />
        ))}
        
        {isLoading && <AILoadingIndicator />}
      </Stack>
      
      <div ref={messagesEndRef} />
    </Box>
  );
} 