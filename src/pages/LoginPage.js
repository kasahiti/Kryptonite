import {Helmet} from 'react-helmet-async';
// @mui
import {styled} from '@mui/material/styles';
import {Container, Typography, Box} from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
// sections
import {LoginForm} from '../sections/auth/login';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledSection = styled('div')(({theme}) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({theme}) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
    const mdUp = useResponsive('up', 'md');

    return (
        <>
            <Helmet>
                <title> Login | Kryptonite </title>
            </Helmet>

            <StyledRoot>
                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{px: 5, mt: 10, mb: 5}}>
                            Kryptonite
                        </Typography>
                        <Box sx={{justifyContent: "center", alignItems: "center"}}>
                            <img src="/assets/icons/navbar/logo.svg" width={"300px"} style={{margin: "auto"}} alt="login"/>
                        </Box>
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    <StyledContent>
                        <Typography variant="h4" gutterBottom>
                            Login
                        </Typography>

                        <LoginForm/>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
