'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Tooltip, Paper } from '@mui/material';
import { Send, AttachFile, Mic } from '@mui/icons-material';

interface AIChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function AIChatInput({ onSendMessage, isLoading, disabled = false }: AIChatInputProps) {
  const [message, setMessage] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() || isLoading || disabled) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = () => {
    // TODO: Implement file upload functionality
    console.log('File upload not implemented yet');
  };

  const handleVoiceInput = () => {
    // TODO: Implement voice input functionality
    console.log('Voice input not implemented yet');
  };

  useEffect(() => {
    if (!isLoading && !disabled) {
      textFieldRef.current?.focus();
    }
  }, [isLoading, disabled]);

  return (
    <Paper sx={{
      p: { xs: 0.75, md: 1 },
      bgcolor: 'background.paper',
      border: 1,
      borderColor: 'divider',
      borderRadius: 2
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: { xs: 0.5, md: 1 }
      }}>
        {/* File Upload Button - Desktop Only */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Tooltip title="Attach file (coming soon)">
            <IconButton
              size="small"
              onClick={handleFileUpload}
              disabled={isLoading || disabled}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
                p: { xs: 0.5, md: 1 }
              }}
            >
              <AttachFile sx={{ fontSize: { xs: 18, md: 20 } }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Voice Input Button - Desktop Only */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Tooltip title="Voice input (coming soon)">
            <IconButton
              size="small"
              onClick={handleVoiceInput}
              disabled={isLoading || disabled}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
                p: { xs: 0.5, md: 1 }
              }}
            >
              <Mic sx={{ fontSize: { xs: 18, md: 20 } }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Text Input */}
        <TextField
          ref={textFieldRef}
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about your finances..."
          disabled={isLoading || disabled}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              fontSize: { xs: '0.875rem', md: '1rem' },
              '& fieldset': {
                borderColor: 'transparent'
              },
              '&:hover fieldset': {
                borderColor: 'transparent'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent'
              }
            }
          }}
        />

        {/* Send Button */}
        <Tooltip title="Send message">
          <IconButton
            onClick={handleSend}
            disabled={!message.trim() || isLoading || disabled}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: { xs: 0.75, md: 1 },
              '&:hover': {
                bgcolor: 'primary.dark'
              },
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled'
              }
            }}
          >
            <Send sx={{ fontSize: { xs: 18, md: 20 } }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
} 