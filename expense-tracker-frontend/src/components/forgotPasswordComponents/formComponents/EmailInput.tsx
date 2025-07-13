import { TextField, InputAdornment } from '@mui/material';
import { Email } from '@mui/icons-material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailInput = ({ value, onChange }: Props) => (
  <TextField
    fullWidth
    name="email"
    label="Email Address"
    type="email"
    value={value}
    onChange={onChange}
    required
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Email sx={{ color: 'text.secondary' }} />
        </InputAdornment>
      ),
    }}
  />
);

export default EmailInput;