import { TextField } from '@mui/material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  email: string;
}

const CodeInput = ({ value, onChange, email }: Props) => (
  <TextField
    fullWidth
    name="code"
    label="Verification Code"
    value={value}
    onChange={onChange}
    placeholder="Enter 6-digit code"
    helperText={`Code sent to ${email}`}
    required
    inputProps={{
      maxLength: 6,
      style: { textAlign: 'center', fontSize: '1rem', letterSpacing: '0.5rem' },
    }}
  />
);

export default CodeInput;