import React, { ReactNode } from 'react';
import Header from './header';
import { Box } from '@mui/material';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh',width: '100vw'
     }}>
      <Header/> 
      <Box component="main" sx={{ mt: '62px',height: '100%',width: '100%', px: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;