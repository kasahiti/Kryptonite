import {Helmet} from 'react-helmet-async';

// @mui
import {Container, Paper, Stack, Typography, Grid} from '@mui/material';
import {useContext, useEffect} from "react";
import axios from "axios";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import UserContext from "../index";

// ----------------------------------------------------------------------

function createData(name, language, uuid, test1, test2) {
    return { name, language, uuid, test1, test2 };
}

const rows = [
    createData('TESTTEST', "Python", 6.0, 24, 4.0),
    createData('TEST', "Java", 9.0, 37, 4.3),
    createData('TESTABS', "Java", 16.0, 24, 6.0),
    createData('TESTCDE', "Python", 3.7, 67, 4.3),
    createData('TESTABSTESTCDE', "Python", 16.0, 49, 3.9),
];

export default function EvaluationsPage() {
    const {user, baseAPI} = useContext(UserContext);

    const getAssessments = () => {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseAPI}/assessments`,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        };

        axios(config)
            .then(response => {
                console.log(response.data)
            })
            .catch(error => {
                console.error(error);
            })
    }

    useEffect(() => {
        getAssessments()
    }, [getAssessments])

    return (
        <>
            <Helmet>
                <title> Evaluations | Kryptonite </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Grid container={"sm"}>
                        <Grid item xs={12}>
                            <Typography variant="h4" gutterBottom>
                                Mes évaluations
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nom</TableCell>
                                            <TableCell align="right">Language</TableCell>
                                            <TableCell align="right">UUID</TableCell>
                                            <TableCell align="right">TEST</TableCell>
                                            <TableCell align="right">TEST</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">{row.language}</TableCell>
                                                <TableCell align="right">{row.uuid}</TableCell>
                                                <TableCell align="right">{row.test1}</TableCell>
                                                <TableCell align="right">{row.test2}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}
