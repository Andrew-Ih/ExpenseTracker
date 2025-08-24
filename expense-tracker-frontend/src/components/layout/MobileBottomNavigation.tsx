'use client';

import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Dashboard, Receipt, AccountBalance, SmartToy, Person } from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

const MobileBottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { label: 'Transactions', icon: <Receipt />, path: '/transactions' },
    { label: 'Budgets', icon: <AccountBalance />, path: '/budget' },
    { label: 'AI', icon: <SmartToy />, path: '/ai-assistant' },
    { label: 'Profile', icon: <Person />, path: '/profile' }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const getCurrentValue = () => {
    const currentItem = navigationItems.find(item => item.path === pathname);
    return currentItem ? currentItem.path : false;
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1200,
        display: { xs: 'block', md: 'none' },
        borderTop: 1,
        borderColor: 'divider',
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={getCurrentValue()}
        onChange={(event, newValue) => {
          if (newValue) {
            handleNavigation(newValue);
          }
        }}
        showLabels
        sx={{
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px 4px',
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
          },
        }}
      >
        {navigationItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            value={item.path}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNavigation; 