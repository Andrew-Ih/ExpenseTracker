import { Button } from '@mui/material';

interface Props {
  loading: boolean;
}

const SubmitButton = ({ loading }: Props) => (
  <Button
    type="submit"
    fullWidth
    variant="contained"
    size="large"
    disabled={loading}
    sx={{
      py: 1.5,
      background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
      '&:hover': {
        background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
      },
    }}
  >
    {loading ? 'Sending Code...' : 'Send Reset Code'}
  </Button>
);

export default SubmitButton;