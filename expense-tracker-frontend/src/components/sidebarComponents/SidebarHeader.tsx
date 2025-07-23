'use client';

import { Typography, Toolbar } from '@mui/material';

interface SidebarHeaderProps {
  title: string;
}

const SidebarHeader = ({ title }: SidebarHeaderProps) => {
  return (
    <Toolbar>
      <Typography variant="h6" noWrap component="div">
        {title}
      </Typography>
    </Toolbar>
  );
};

export default SidebarHeader;
