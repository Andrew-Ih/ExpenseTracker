'use client';

import { Box, Typography, Paper, Stack, Chip } from '@mui/material';
import { SmartToy, Person } from '@mui/icons-material';
import { Message } from '../../types/ai';


interface AIChatMessageProps {
  message: Message;
}

export default function AIChatMessage({ message }: AIChatMessageProps) {
  const isAI = message.role === 'assistant';
  
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: isAI ? 'flex-start' : 'flex-end',
      mb: 1
    }}>
      <Box sx={{
        maxWidth: '80%',
        minWidth: '200px'
      }}>
        {/* Message Header */}
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          sx={{ 
            mb: 1,
            justifyContent: isAI ? 'flex-start' : 'flex-end'
          }}
        >
          {isAI && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: 1,
              bgcolor: 'primary.main',
              color: 'white'
            }}>
              <SmartToy sx={{ fontSize: 16 }} />
            </Box>
          )}
          
          <Typography variant="caption" color="text.secondary">
            {isAI ? 'AI Assistant' : 'You'}
          </Typography>
          
          {!isAI && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              borderRadius: 1,
              bgcolor: 'secondary.main',
              color: 'white'
            }}>
              <Person sx={{ fontSize: 16 }} />
            </Box>
          )}
        </Stack>

        {/* Message Content */}
        <Paper sx={{
          p: 2,
          bgcolor: isAI ? 'background.paper' : 'primary.main',
          color: isAI ? 'text.primary' : 'white',
          borderRadius: 2,
          border: isAI ? 1 : 'none',
          borderColor: 'divider',
          boxShadow: 1,
          '&:hover': {
            boxShadow: 2
          }
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6
            }}
          >
            {message.content}
          </Typography>
          
          {/* Message Metadata */}
          <Box sx={{ 
            mt: 1, 
            pt: 1, 
            borderTop: 1, 
            borderColor: isAI ? 'divider' : 'rgba(255,255,255,0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="caption" color={isAI ? 'text.secondary' : 'rgba(255,255,255,0.7)'}>
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Typography>
            
            {message.metadata && (
              <Chip 
                label={message.metadata.type} 
                size="small" 
                variant="outlined"
                sx={{ 
                  fontSize: '0.7rem',
                  height: 20,
                  borderColor: isAI ? 'primary.main' : 'rgba(255,255,255,0.5)',
                  color: isAI ? 'primary.main' : 'rgba(255,255,255,0.8)'
                }}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
} 