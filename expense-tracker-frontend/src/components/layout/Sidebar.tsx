'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Dashboard,
  Receipt,
  Logout
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const drawerWidth = 240;

const Sidebar = ({ open, onToggle }: SidebarProps) => {
  const theme = useTheme();
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
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : theme.spacing(7),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : theme.spacing(7),
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.easeInOut, // Change from sharp to easeInOut
            duration: theme.transitions.duration.standard, // Use standard duration
          }),
          backgroundColor: theme.palette.background.paper,
          boxSizing: 'border-box',
        },
      }}
      open={open}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: open ? 'flex-end' : 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar 
      }}>
        <IconButton onClick={onToggle}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={Link}
              href={item.path}
              selected={pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ opacity: open ? 1 : 0 }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <Logout />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              sx={{ opacity: open ? 1 : 0 }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;