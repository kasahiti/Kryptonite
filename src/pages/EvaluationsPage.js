import {Helmet} from 'react-helmet-async';

// @mui
import {Container, Paper, Stack, Typography, Grid, Button, Fab, Snackbar} from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {forwardRef, useContext, useEffect, useState} from "react";
import axios from "axios";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import UserContext from "../index";


// ----------------------------------------------------------------------

const Alert = forwardRef((props, ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function createData(name, language, uuid, user) {
    return { name, language, uuid, user};
}

export default function EvaluationsPage() {
    const {user, baseAPI} = useContext(UserContext);
    const [rows, setRows] = useState([]);

    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [msg, setMsg] = useState("This is a message");

    const openSnack = (severity, message) => {
        setSeverity(severity);
        setMsg(message);
        setOpen(true);
    };

    const closeSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const deleteAssessment = (uuid) => {
        const config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `${baseAPI}/assessments/${uuid}`,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }

        axios(config)
            .then(response => {
                console.log(JSON.stringify(response.data));
                getAssessments();
                openSnack("success", "√Čvaluation supprim√©e !")
            })
            .catch(error => {
                console.log(error);
                openSnack("error", "Impossible de supprimer, r√©essayer !")
            })
    }

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

                const localRows = []

                // eslint-disable-next-line no-plusplus
                for(let i = 0; i < response.data.length; i++) {
                    localRows.push(createData(response.data[i].name, response.data[i].language, response.data[i].uuid, response.data[i].user.email))
                }

                setRows(localRows)

            })
            .catch(error => {
                console.error(error);
            })
    }

    useEffect(() => {
        getAssessments()
    }, [])


    return (
        <>
            <Helmet>
                <title> Evaluations | Kryptonite </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h4" gutterBottom>
                                Mes √©valuations
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nom</TableCell>
                                            <TableCell align="left">Language</TableCell>
                                            {user.role.includes("ADMIN") &&
                                                <TableCell align="left">Utilisateur</TableCell>
                                            }
                                            <TableCell align="center">URL Publique / UUID</TableCell>
                                            <TableCell align="center">Rendus</TableCell>
                                            <TableCell align="center">Modifier</TableCell>
                                            <TableCell align="center">Supprimer</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.uuid}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="left">{row.language}</TableCell>
                                                {user.role.includes("ADMIN") &&
                                                    <TableCell component="th" scope="row">
                                                        {row.user}
                                                    </TableCell>
                                                }
                                                <TableCell align="center"><a href={`${window.location.protocol}//${window.location.host}/assessment/${row.uuid}`} target="_blank" rel="noreferrer">{row.uuid}</a></TableCell>
                                                <TableCell align="center"><a href={`${window.location.protocol}//${window.location.host}/app/evaluations/${row.uuid}`}><Fab size="medium" color="secondary" aria-label="edit"><VisibilityIcon /></Fab></a></TableCell>
                                                <TableCell align="center"><a href={`${window.location.protocol}//${window.location.host}/app/assessment/${row.uuid}`} rel="noreferrer"><Button variant="contained" color="primary">Modifier</Button></a></TableCell>
                                                <TableCell align="center"><Button color="error" onClick={() => deleteAssessment(row.uuid)}>Supprimer</Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Stack>
                <Snackbar
                    open={open}
                    autoHideDuration={10000}
                    onClose={closeSnack}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                    <Alert onClose={closeSnack} severity={severity} sx={{ width: '100%' }}>
                        {msg}
                    </Alert>
                </Snackbar>
            </Container>
        </>
    );
}
