'use client';

import { List } from '@mui/material';
import { Logout } from '@mui/icons-material';
import SidebarItem from './SidebarItem';

interface SidebarFooterProps {
  onLogout: () => void;
}

const SidebarFooter = ({ onLogout }: SidebarFooterProps) => {
  return (
    <List>
      <SidebarItem
        text="Logout"
        icon={<Logout />}
        path=""
        selected={false}
        onClick={onLogout}
      />
    </List>
  );
};

export default SidebarFooter;
