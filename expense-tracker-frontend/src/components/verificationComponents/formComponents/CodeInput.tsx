'use client';

import { TextField } from '@mui/material';

interface CodeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  email: string;
}

const CodeInput = ({ value, onChange, email }: CodeInputProps) => (
  <TextField
    fullWidth
    label="Verification Code"
    value={value}
    onChange={onChange}
    placeholder="Enter 6-digit code"
    inputProps={{
      maxLength: 6,
      style: { textAlign: 'center', fontSize: '1rem', letterSpacing: '0.5rem' },
    }}
    helperText={`Code sent to ${email}`}
    required
  />
);

export default CodeInput;