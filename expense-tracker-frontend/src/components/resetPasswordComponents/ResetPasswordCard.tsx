import { Card, CardContent } from '@mui/material';
import ResetPasswordHeader from './ResetPasswordHeader';
import ResetPasswordForm from './ResetPasswordForm';
import BackToLoginLink from './BackToLoginLink';

const ResetPasswordCard = () => (
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
      <ResetPasswordHeader />
      <ResetPasswordForm />
      <BackToLoginLink />
    </CardContent>
  </Card>
);

export default ResetPasswordCard;