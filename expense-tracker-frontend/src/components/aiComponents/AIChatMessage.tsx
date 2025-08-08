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
        maxWidth: { xs: '90%', md: '80%' },
        minWidth: { xs: '150px', md: '200px' }
      }}>
        {/* Message Header */}
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          sx={{ 
            mb: { xs: 0.5, md: 1 },
            justifyContent: isAI ? 'flex-start' : 'flex-end'
          }}
        >
          {isAI && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 20, md: 24 },
              height: { xs: 20, md: 24 },
              borderRadius: 1,
              bgcolor: 'primary.main',
              color: 'white'
            }}>
              <SmartToy sx={{ fontSize: { xs: 14, md: 16 } }} />
            </Box>
          )}
          
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.7rem', md: '0.75rem' }
            }}
          >
            {isAI ? 'AI Assistant' : 'You'}
          </Typography>
          
          {!isAI && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 20, md: 24 },
              height: { xs: 20, md: 24 },
              borderRadius: 1,
              bgcolor: 'secondary.main',
              color: 'white'
            }}>
              <Person sx={{ fontSize: { xs: 14, md: 16 } }} />
            </Box>
          )}
        </Stack>

        {/* Message Content */}
        <Paper sx={{
          p: { xs: 1.5, md: 2 },
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
              lineHeight: 1.6,
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            {message.content}
          </Typography>
          
          {/* Message Metadata */}
          <Box sx={{ 
            mt: { xs: 0.75, md: 1 }, 
            pt: { xs: 0.75, md: 1 }, 
            borderTop: 1, 
            borderColor: isAI ? 'divider' : 'rgba(255,255,255,0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography 
              variant="caption" 
              color={isAI ? 'text.secondary' : 'rgba(255,255,255,0.7)'}
              sx={{
                fontSize: { xs: '0.65rem', md: '0.75rem' }
              }}
            >
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
                  fontSize: { xs: '0.6rem', md: '0.7rem' },
                  height: { xs: 18, md: 20 },
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