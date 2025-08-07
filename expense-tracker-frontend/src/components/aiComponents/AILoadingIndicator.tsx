'use client';

import { Box, Typography, Stack, CircularProgress } from '@mui/material';
import { SmartToy } from '@mui/icons-material';

export default function AILoadingIndicator() {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'flex-start',
      mb: 1
    }}>
      <Box sx={{
        maxWidth: '80%',
        minWidth: '200px'
      }}>
        {/* Loading Header */}
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          sx={{ mb: 1 }}
        >
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
          
          <Typography variant="caption" color="text.secondary">
            AI Assistant
          </Typography>
        </Stack>

        {/* Loading Content */}
        <Box sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          boxShadow: 1
        }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={20} color="primary" />
            <Typography variant="body2" color="text.secondary">
              Thinking...
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
} 