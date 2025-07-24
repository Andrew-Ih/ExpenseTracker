'use client';

import { List } from '@mui/material';
import { Dashboard, Receipt, AccountBalance } from '@mui/icons-material';
import SidebarItem from './SidebarItem';

interface SidebarNavigationProps {
  pathname: string;
}

const SidebarNavigation = ({ pathname }: SidebarNavigationProps) => {
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Transactions', icon: <Receipt />, path: '/transactions' },
    { text: 'Budget', icon: <AccountBalance />, path: '/budget' }
  ];

  return (
    <List>
      {menuItems.map((item) => (
        <SidebarItem 
          key={item.text}
          text={item.text}
          icon={item.icon}
          path={item.path}
          selected={pathname === item.path}
        />
      ))}
    </List>
  );
};

export default SidebarNavigation;
