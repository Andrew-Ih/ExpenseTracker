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
        maxWidth: { xs: '90%', md: '80%' },
        minWidth: { xs: '150px', md: '200px' }
      }}>
        {/* Loading Header */}
        <Stack 
          direction="row" 
          spacing={1} 
          alignItems="center" 
          sx={{ mb: { xs: 0.5, md: 1 } }}
        >
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
          
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.7rem', md: '0.75rem' }
            }}
          >
            AI Assistant
          </Typography>
        </Stack>

        {/* Loading Content */}
        <Box sx={{
          p: { xs: 1.5, md: 2 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          boxShadow: 1
        }}>
          <Stack direction="row" spacing={{ xs: 1.5, md: 2 }} alignItems="center">
            <CircularProgress size={20} color="primary" />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', md: '1rem' }
              }}
            >
              Thinking...
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
} 