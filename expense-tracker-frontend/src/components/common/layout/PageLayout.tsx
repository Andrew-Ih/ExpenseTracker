import { ReactNode } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import darkTheme from '../theme/darkTheme';

interface PageLayoutProps {
  children: ReactNode;
  centered?: boolean;
}

/**
 * PageLayout - Common layout wrapper for all pages
 * Provides consistent theming and styling across the application
 */
const PageLayout = ({ children, centered = true }: PageLayoutProps) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: darkTheme.palette.background.gradient,
          display: 'flex',
          flexDirection: 'column',
          ...(centered && {
            alignItems: 'center',
            justifyContent: 'center',
          }),
          p: 2,
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default PageLayout;