import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box
} from '@mui/material';
import { MarkEmailRead } from '@mui/icons-material';

interface VerificationCardProps {
  children: React.ReactNode;
}

const VerificationCard = ({ children }: VerificationCardProps) => {
  return (
    <Card 
      sx={{ 
        maxWidth: 450, 
        width: '100%',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        border: '1px solid rgba(75, 85, 99, 0.3)'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3} alignItems="center">
          <Box sx={{ p: 2, backgroundColor: 'primary.main', borderRadius: '50%' }}>
            <MarkEmailRead sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" fontWeight="bold" color="white">
            Verify Your Email
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            We have sent a 6-digit verification code to your email address. 
            Please enter it below to complete your registration.
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
};

export default VerificationCard;