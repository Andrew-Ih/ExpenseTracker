import { Typography } from '@mui/material';

export default function HeroText() {
  return (
    <>
      <Typography variant="h2" fontWeight="bold" color="white" sx={{ mb: 2 }}>
        Expense Tracker
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>
        Take control of your finances and track your expenses efficiently
      </Typography>
    </>
  );
}