import { Card, CardContent } from '@mui/material';
import LoginHeader from './LoginHeader';
import LoginForm from './LoginForm';
import LoginFooter from './LoginFooter';

const LoginCard = () => (
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
      <LoginHeader />
      <LoginForm />
      <LoginFooter />
    </CardContent>
  </Card>
);

export default LoginCard;