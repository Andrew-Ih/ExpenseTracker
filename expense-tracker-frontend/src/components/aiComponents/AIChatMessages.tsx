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
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Use setTimeout to ensure DOM is fully updated before scrolling
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

  return (
    <Box 
      ref={containerRef}
      sx={{ 
        height: '100%',
        overflow: 'auto',
        p: { xs: 1, md: 2 },
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: 3,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderRadius: 3,
        },
      }}
    >
      <Stack spacing={{ xs: 1.5, md: 2 }}>
        {messages.map((message, index) => (
          <AIChatMessage 
            key={`${message.id}-${index}`}
            message={message}
          />
        ))}
        
        {isLoading && <AILoadingIndicator />}
      </Stack>
    </Box>
  );
} 