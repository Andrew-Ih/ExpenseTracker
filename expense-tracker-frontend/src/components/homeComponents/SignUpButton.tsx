import { Button } from '@mui/material';
import NextLink from 'next/link';


const SignUpButton = () => {
  return (
    <Button
        component={NextLink}
        href="/register"
        variant="outlined"
        size="large"
        sx={{
        py: 2,
        px: 4,
        borderColor: 'primary.main',
        color: 'primary.main',
        '&:hover': {
            borderColor: 'primary.light',
            backgroundColor: 'rgba(37, 99, 235, 0.1)'
        }
        }}
    >
        Sign Up
    </Button>
  )
}

export default SignUpButton;
