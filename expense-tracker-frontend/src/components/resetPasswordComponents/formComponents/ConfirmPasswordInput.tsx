import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConfirmPasswordInput = ({ value, onChange }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      name="confirmPassword"
      label="Confirm New Password"
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      required
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Lock sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default ConfirmPasswordInput;