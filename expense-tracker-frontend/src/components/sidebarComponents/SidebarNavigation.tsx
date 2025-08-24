'use client';

import { List } from '@mui/material';
import { Dashboard, Receipt, AccountBalance, Person, SmartToy } from '@mui/icons-material';
import SidebarItem from './SidebarItem';

interface SidebarNavigationProps {
  pathname: string;
}

const SidebarNavigation = ({ pathname }: SidebarNavigationProps) => {
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Transactions', icon: <Receipt />, path: '/transactions' },
    { text: 'Budgets', icon: <AccountBalance />, path: '/budget' },
    { text: 'AI Assistant', icon: <SmartToy />, path: '/ai-assistant' },
    { text: 'Profile', icon: <Person />, path: '/profile' }
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
