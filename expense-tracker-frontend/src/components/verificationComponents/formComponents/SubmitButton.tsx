'use client';

import { Button } from '@mui/material';

interface SubmitButtonProps {
  loading: boolean;
  disabled: boolean;
}

const SubmitButton = ({ loading, disabled }: SubmitButtonProps) => (
  <Button
    type="submit"
    fullWidth
    variant="contained"
    size="large"
    disabled={loading || disabled}
    sx={{
      py: 1.5,
      background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
      '&:hover': {
        background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
      },
    }}
  >
    {loading ? 'Verifying...' : 'Verify Email'}
  </Button>
);

export default SubmitButton;