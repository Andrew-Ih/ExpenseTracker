'use client';

import { useState } from 'react';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from '../common/theme/darkTheme';
import Sidebar from './Sidebar';
import MobileTopNavbar from './MobileTopNavbar';
import MobileBottomNavigation from './MobileBottomNavigation';
import MobileDrawer from './MobileDrawer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const AppLayout = ({ children }: AppLayoutProps) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleMobileMenuClick = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Desktop Sidebar */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Sidebar />
        </Box>
        
        {/* Mobile Top Navbar */}
        <MobileTopNavbar onMenuClick={handleMobileMenuClick} isOpen={mobileDrawerOpen} />
        
        {/* Mobile Drawer */}
        <MobileDrawer open={mobileDrawerOpen} onClose={handleMobileDrawerClose} />
        
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1, md: 3 },
            width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
            mt: { xs: '56px', md: 0 }, // Top margin for mobile navbar (56px = AppBar height)
            mb: { xs: '56px', md: 0 }, // Bottom margin for mobile bottom navigation (56px = BottomNavigation height)
            minHeight: { xs: 'calc(100vh - 112px)', md: '100vh' }, // Account for top and bottom navigation
            overflow: 'auto', // Allow scrolling within the content area
          }}
        >
          {children}
        </Box>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNavigation />
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;
