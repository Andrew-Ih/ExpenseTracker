import { Box, Typography, Tooltip } from '@mui/material';

const PasswordTooltip = () => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Tooltip
      title={
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Password Requirements:
          </Typography>
          <Typography variant="body2">• At least 8 characters</Typography>
          <Typography variant="body2">• At least one uppercase letter</Typography>
          <Typography variant="body2">• At least one lowercase letter</Typography>
          <Typography variant="body2">• At least one number</Typography>
          <Typography variant="body2">• At least one special character</Typography>
        </Box>
      }
      arrow
      placement="bottom-end"
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          cursor: 'help',
          textDecoration: 'underline dotted',
          '&:hover': { color: 'primary.main' },
        }}
      >
        Password requirements
      </Typography>
    </Tooltip>
  </Box>
);

export default PasswordTooltip;