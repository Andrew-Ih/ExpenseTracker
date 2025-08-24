'use client';

import { Box, Typography, IconButton, Tooltip, Stack } from '@mui/material';
import { SmartToy, Clear, Help } from '@mui/icons-material';

interface AIChatHeaderProps {
  onClearChat: () => void;
}

export default function AIChatHeader({ onClearChat }: AIChatHeaderProps) {
  return (
    <Box sx={{
      p: { xs: 1.5, md: 2 },
      borderBottom: 1,
      borderColor: 'divider',
      bgcolor: 'background.paper',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Left side - Title and Icon */}
      <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: 32, md: 40 },
          height: { xs: 32, md: 40 },
          borderRadius: { xs: 1.5, md: 2 },
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          <SmartToy sx={{ fontSize: { xs: 20, md: 24 } }} />
        </Box>
        
        <Box>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color="text.primary"
            sx={{
              fontSize: { xs: '1.125rem', md: '1.25rem' }
            }}
          >
            AI Financial Assistant
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.75rem', md: '0.875rem' }
            }}
          >
            Ask me anything about your finances
          </Typography>
        </Box>
      </Stack>

      {/* Right side - Actions */}
      <Stack direction="row" spacing={{ xs: 0.5, md: 1 }}>
        <Tooltip title="How to use AI Assistant">
          <IconButton 
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
              p: { xs: 0.5, md: 1 }
            }}
          >
            <Help sx={{ fontSize: { xs: 18, md: 20 } }} />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Clear chat history">
          <IconButton 
            size="small"
            onClick={onClearChat}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'error.main' },
              p: { xs: 0.5, md: 1 }
            }}
          >
            <Clear sx={{ fontSize: { xs: 18, md: 20 } }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
} 