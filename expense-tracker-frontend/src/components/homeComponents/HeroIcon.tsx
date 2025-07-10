import { Box } from '@mui/material';
import { AccountBalanceWallet } from '@mui/icons-material';

export default function HeroIcon() {
  return (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
      <AccountBalanceWallet sx={{ fontSize: 80, color: 'primary.main' }} />
    </Box>
  );
}