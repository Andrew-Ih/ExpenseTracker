'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Drawer, Divider } from '@mui/material';
import SidebarHeader from '../sidebarComponents/SidebarHeader';
import SidebarNavigation from '../sidebarComponents/SidebarNavigation';
import SidebarFooter from '../sidebarComponents/SidebarFooter';

const drawerWidth = 240;

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
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
      <SidebarHeader title="Expense Tracker" />
      <Divider />
      <SidebarNavigation pathname={pathname} />
      <Divider />
      <SidebarFooter onLogout={handleLogout} />
    </Drawer>
  );
};

export default Sidebar;
