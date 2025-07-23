'use client';

import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from '../common/theme/darkTheme';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${drawerWidth}px)`,
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout;
