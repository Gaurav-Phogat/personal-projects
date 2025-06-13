import { Box, Typography } from "@mui/material";

const Login = () => {
    return (
        <>
            <Box component='div' flex={1} display={'flex'} justifyContent='center' alignItems='center' sx={{ height: '100vh', width: '100vw' }}>
                <Typography variant="h3" padding={2}>
                    Login Page
                </Typography>
            </Box>
        </>
    )
}

export default Login;