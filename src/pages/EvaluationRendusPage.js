import {Helmet} from 'react-helmet-async';

// @mui

import {
    Container,
    Paper,
    Stack,
    Typography,
    Grid,
    Button,
    Fab,
    Snackbar,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

    const [studentProjects, setStudentProjects] = useState([]);
    const [evalName, setEvalName] = useState("");

    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [msg, setMsg] = useState("This is a message");
    const [expanded, setExpanded] = useState(false);

    const getProjects = () => {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseAPI}/assessments/${uuid}/projects`,
            headers: {
                'Authorization': `Bearer ${user.token}`
            },
        };

        axios(config)
            .then(response => {
                setStudentProjects(response.data)
            })
            .catch(error => {
                console.log(error);
            })
    }

    const getByUUID = () => {
        axios.get(`${baseAPI}/assessments/${uuid}`)
            .then(response => {
                setEvalName(response.data)
            })
            .catch(error => {
                console.error(error);
            })
    }

    useEffect(() => {
        getProjects()
        getByUUID();

        const intervalId = setInterval(() => {
            getProjects()
        }, 5000)

        return () => clearInterval(intervalId);
    }, [])

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

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
                                Évaluation "{evalName}"
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {studentProjects.map((project) => (
                                <Accordion expanded={expanded === `panel${project.id}`} key={project.id} onChange={handleChange(`panel${project.id}`)}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panelbh-content"
                                        id={`panelbh-header${project.id}`}
                                    >
                                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                            {project.firstName} {project.lastName}
                                        </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>
                                            {project.status.includes("DONE") ?
                                                  <Chip label="Correction terminée" color="success" size="small" />
                                                : <Chip label="Correction en cours" color="primary" size="small" />
                                            }
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            TestTest
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                                ))}
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
