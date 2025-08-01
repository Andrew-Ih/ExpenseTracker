'use client';

import { Box, Typography, IconButton, Tooltip, Stack } from '@mui/material';
import { SmartToy, Clear, Help } from '@mui/icons-material';

interface AIChatHeaderProps {
  onClearChat: () => void;
}

export default function AIChatHeader({ onClearChat }: AIChatHeaderProps) {
  return (
    <Box sx={{
      p: 2,
      borderBottom: 1,
      borderColor: 'divider',
      bgcolor: 'background.paper',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Left side - Title and Icon */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          <SmartToy sx={{ fontSize: 24 }} />
        </Box>
        
        <Box>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            AI Financial Assistant
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ask me anything about your finances
          </Typography>
        </Box>
      </Stack>

      {/* Right side - Actions */}
      <Stack direction="row" spacing={1}>
        <Tooltip title="How to use AI Assistant">
          <IconButton 
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <Help />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Clear chat history">
          <IconButton 
            size="small"
            onClick={onClearChat}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'error.main' }
            }}
          >
            <Clear />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
} 