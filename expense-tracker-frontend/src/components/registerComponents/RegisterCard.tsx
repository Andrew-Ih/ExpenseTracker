import { Card, CardContent } from '@mui/material';
import RegisterHeader from './RegisterHeader';
import RegisterForm from './RegisterForm';
import AlreadyHaveAccount from './AlreadyHaveAccount';

const RegisterCard = () => (
  <Card
    sx={{
      maxWidth: 450,
      width: '100%',
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      border: '1px solid rgba(75, 85, 99, 0.3)',
    }}
  >
    <CardContent sx={{ p: 4 }}>
      <RegisterHeader />
      <RegisterForm />
      <AlreadyHaveAccount />
    </CardContent>
  </Card>
);

export default RegisterCard;