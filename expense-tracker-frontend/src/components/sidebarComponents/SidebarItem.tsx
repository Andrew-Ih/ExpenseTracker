'use client';

import Link from 'next/link';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

interface SidebarItemProps {
  text: string;
  icon: React.ReactNode;
  path: string;
  selected: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ text, icon, path, selected, onClick }: SidebarItemProps) => {
  // Create different button based on whether it's a navigation link or action button
  if (onClick) {
    return (
      <ListItem disablePadding>
        <ListItemButton selected={selected} onClick={onClick}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem>
    );
  }
  
  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} href={path} selected={selected}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarItem;
