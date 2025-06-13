import { Box, Typography } from "@mui/material";

const Login = () => {
    return (
        <>
            <Box component='div' flex={1} display={'flex'} justifyContent='center' alignItems='center' height={'100vh'} width={'100vh'}>
                <Typography variant="h3" padding={2}>
                    DashBoard
                </Typography>
            </Box>
        </>
    )
}

export default Login;