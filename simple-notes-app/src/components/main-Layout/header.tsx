import { Box, Button } from "@mui/material";
import { MdDarkMode } from "react-icons/md";
import React from 'react';
import Link from 'next/link'; // ✅ Import Link

const Header = () => {
  const handleModeChange = () => {
    // Add your dark/light mode change logic here.
  };

  return (
    <Box
      component="div"
      position="fixed"
      width="100%"
      height='62px'
      display="flex"
      bgcolor={'grey'}
      flexDirection="row"
      justifyContent="space-between"
      p={2}
    >
      <Link href="/" passHref><h2>Notes</h2></Link>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <Link href="/login" passHref legacyBehavior>
          <Button variant="contained" component="a">Login</Button>
        </Link>

        <Button variant="contained" onClick={handleModeChange}>
          <MdDarkMode />
        </Button>
      </div>
    </Box>
  );
};

export default Header;
