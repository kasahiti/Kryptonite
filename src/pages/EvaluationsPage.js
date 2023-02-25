import {Helmet} from 'react-helmet-async';

// @mui
import {Container, Stack, Typography} from '@mui/material';

// ----------------------------------------------------------------------

export default function EvaluationsPage() {

    return (
        <>
            <Helmet>
                <title> Evaluations | Kryptonite </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Evaluations
                    </Typography>
                </Stack>
            </Container>
        </>
    );
}
