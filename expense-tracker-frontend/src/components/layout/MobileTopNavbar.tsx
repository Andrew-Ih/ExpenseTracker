'use client';

import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Menu, Close } from '@mui/icons-material';

interface MobileTopNavbarProps {
  onMenuClick: () => void;
  isOpen: boolean;
}

const MobileTopNavbar = ({ onMenuClick, isOpen }: MobileTopNavbarProps) => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: 1200,
        display: { xs: 'flex', md: 'none' },
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Expense Tracker
        </Typography>
        <IconButton
          color="inherit"
          aria-label={isOpen ? "close drawer" : "open drawer"}
          edge="end"
          onClick={onMenuClick}
          sx={{ ml: 2 }}
        >
          {isOpen ? <Close /> : <Menu />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default MobileTopNavbar; 