'use client';

import { Box, Typography, Paper, Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface DashboardWelcomeProps {
  userProfile: UserProfile | null;
}

const DashboardWelcome = ({ userProfile }: DashboardWelcomeProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFirstName = () => {
    return userProfile?.firstName || 'User';
  };

  return (
    <Paper sx={{ 
      p: { xs: 2, md: 3 }, 
      mb: 3, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden' // Prevent horizontal overflow
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          sx={{ 
            width: { xs: 50, md: 60 }, 
            height: { xs: 50, md: 60 }, 
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <Person sx={{ fontSize: { xs: 24, md: 32 }, color: 'white' }} />
        </Avatar>
        
        <Box sx={{ flex: 1, minWidth: 0 }}> {/* minWidth: 0 prevents text overflow */}
          <Typography 
            variant="h4" 
            sx={{ 
              color: 'white', 
              fontWeight: 600,
              mb: 0.5,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
              lineHeight: 1.2
            }}
          >
            {getGreeting()}, {getFirstName()}! 👋
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: { xs: '0.875rem', md: '1.1rem' },
              lineHeight: 1.3
            }}
          >
            {getCurrentDate()}
          </Typography>
        </Box>
      </Box>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.8)',
          mt: 2,
          fontStyle: 'italic',
          fontSize: { xs: '0.75rem', md: '0.875rem' }
        }}
      >
        Here is your financial overview for today
      </Typography>
    </Paper>
  );
};

export default DashboardWelcome; 