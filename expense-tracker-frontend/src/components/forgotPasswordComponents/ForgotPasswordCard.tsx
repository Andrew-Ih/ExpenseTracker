import { Card, CardContent } from '@mui/material';
import ForgotPasswordHeader from './ForgotPasswordHeader';
import ForgotPasswordForm from './ForgotPasswordForm';
import BackToLoginLink from './BackToLoginLink';

const ForgotPasswordCard = () => (
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
      <ForgotPasswordHeader />
      <ForgotPasswordForm />
      <BackToLoginLink />
    </CardContent>
  </Card>
);

export default ForgotPasswordCard;