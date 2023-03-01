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
    Chip, Tab, Tabs, Box
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
                console.log(response.data)
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
                                            {project.status.includes("DONE") ? <Chip label="Correction terminée" color="success" size="small" />
                                                : project.status.includes("NOT_STARTED") ? <Chip label="En attente" color="info" size="small" />
                                                : <Chip label="Correction en cours" color="warning" size="small" />
                                            }
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                                            {project.jsonResults && !JSON.parse(project.jsonResults).error && JSON.parse(project.jsonResults).results.map((result) => (
                                                <>
                                                    <Grid item sx={{mt: 2}} xs={5} textAlign={"right"}>
                                                        <Typography variant="h5" color={result.passed ? "success.main" : "error.main"}>Check : {result.name}</Typography>
                                                    </Grid>
                                                    <Grid item sx={{mt: 2}} xs={7} textAlign={"left"}>
                                                        <Typography variant="body1"><b>Description</b> : {result.description}</Typography>
                                                        <Typography variant="body1"><b>Check result</b> : {result.passed ? 'Passed' : 'Failed'}</Typography>
                                                        <Typography variant="body1"><b>Logs</b> : </Typography>
                                                        {result.log.map((line) => (
                                                            <Typography sx={{ml: 2}} variant="body1">- {line}</Typography>
                                                        ))}
                                                    </Grid>
                                                </>
                                            ))}
                                            {project.jsonResults && JSON.parse(project.jsonResults).error &&
                                                <Typography>Error : {JSON.parse(project.jsonResults).error.value}</Typography>
                                            }
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                                ))}
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </>
    );
}
