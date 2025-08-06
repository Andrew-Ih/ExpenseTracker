'use client';

import { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Stack, 
  Button, 
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { 
  DeleteForever, 
  Warning,
  Error 
} from '@mui/icons-material';

interface DeleteAccountProps {
  onDelete: () => Promise<void>;
  loading: boolean;
}

const DeleteAccount = ({ onDelete, loading }: DeleteAccountProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setConfirmationText('');
    setConfirmCheckbox(false);
    setErrors([]);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const validateDeletion = () => {
    const newErrors: string[] = [];

    if (confirmationText !== 'DELETE') {
      newErrors.push('Please type "DELETE" to confirm');
    }

    if (!confirmCheckbox) {
      newErrors.push('Please confirm that you understand the consequences');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleConfirmDelete = async () => {
    if (!validateDeletion()) return;

    try {
      await onDelete();
      setDialogOpen(false);
    } catch {
      // Error handling is done in the parent component
    }
  };

  return (
    <>
      <Paper sx={{ p: 3, border: '2px solid', borderColor: 'error.main' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <DeleteForever color="error" />
          <Typography variant="h6" color="error.main">Danger Zone</Typography>
        </Box>

        <Stack spacing={3}>
          <Alert severity="error" icon={<Warning />}>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Delete Account
            </Typography>
            <Typography variant="body2">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </Typography>
          </Alert>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              What will be deleted:
            </Typography>
            <Stack spacing={1} sx={{ pl: 2 }}>
              <Typography variant="body2" color="text.secondary">
                • All your financial transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • All your budget categories and settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Your user profile and account information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • All associated data from AWS Cognito and DynamoDB
              </Typography>
            </Stack>
          </Box>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForever />}
            onClick={handleOpenDialog}
            sx={{ alignSelf: 'flex-start' }}
          >
            Delete Account
          </Button>
        </Stack>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Error color="error" />
          Confirm Account Deletion
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3}>
            <Alert severity="error">
              <Typography variant="body2" fontWeight={500}>
                This action is irreversible!
              </Typography>
              <Typography variant="body2">
                Once you delete your account, all your data will be permanently removed and cannot be recovered.
              </Typography>
            </Alert>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                To confirm deletion, please:
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="Type 'DELETE' to confirm"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  fullWidth
                  size="small"
                  error={confirmationText !== '' && confirmationText !== 'DELETE'}
                  helperText={confirmationText !== '' && confirmationText !== 'DELETE' ? 'Please type DELETE exactly' : ''}
                />
                
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={confirmCheckbox}
                      onChange={(e) => setConfirmCheckbox(e.target.checked)}
                      color="error"
                    />
                  }
                  label="I understand that this action cannot be undone and all my data will be permanently deleted"
                />
              </Stack>
            </Box>

            {errors.length > 0 && (
              <Alert severity="error">
                <Stack spacing={0.5}>
                  {errors.map((error, index) => (
                    <Typography key={index} variant="body2">
                      • {error}
                    </Typography>
                  ))}
                </Stack>
              </Alert>
            )}
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loading || confirmationText !== 'DELETE' || !confirmCheckbox}
          >
            {loading ? 'Deleting...' : 'Permanently Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteAccount; 