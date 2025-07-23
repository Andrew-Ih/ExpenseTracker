'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Box, 
  ThemeProvider, 
  CssBaseline, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider 
} from '@mui/material';
import { Dashboard, Receipt, Logout } from '@mui/icons-material';
import darkTheme from '../common/theme/darkTheme';

interface AppLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

const AppLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Transactions', icon: <Receipt />, path: '/transactions' }
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Fixed sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Expense Tracker
            </Typography>
          </Toolbar>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  selected={pathname === item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><Logout /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        
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
