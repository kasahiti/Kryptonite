import {Helmet} from 'react-helmet-async';

// @mui

import {Container, Paper, Stack, Typography, Grid, Button, Fab, Snackbar} from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {useParams} from "react-router-dom";
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


function createData(name, language, uuid) {
    return { name, language, uuid };
}

export default function EvaluationRendusPage() {
    const {user, baseAPI} = useContext(UserContext);
    const {uuid} = useParams();

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
                                Évaluation no {uuid}
                            </Typography>
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
