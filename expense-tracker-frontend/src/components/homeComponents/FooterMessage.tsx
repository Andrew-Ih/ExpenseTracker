import { Box, Typography } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

export default function FooterMessage() {
  return (
    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <TrendingUp sx={{ color: 'text.secondary', mr: 1 }} />
      <Typography variant="body2" color="text.secondary">
        Start your financial journey today
      </Typography>
    </Box>
  );
}