import { TextField, InputAdornment } from '@mui/material';
import { Person } from '@mui/icons-material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FullNameInput = ({ value, onChange }: Props) => (
  <TextField
    fullWidth
    name="fullName"
    label="Full Name"
    value={value}
    onChange={onChange}
    required
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Person sx={{ color: 'text.secondary' }} />
        </InputAdornment>
      ),
    }}
  />
);

export default FullNameInput;