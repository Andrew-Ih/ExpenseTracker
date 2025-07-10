import { Button } from '@mui/material';
import NextLink from 'next/link';


const SignInButton = () => {
  return (
    <Button
        component={NextLink}
        href="/login"
        variant="contained"
        size="large"
        sx={{
        py: 2,
        px: 4,
        background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
        '&:hover': {
            background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
        }
        }}
    >
        Sign In
    </Button>
  )
}

export default SignInButton;
