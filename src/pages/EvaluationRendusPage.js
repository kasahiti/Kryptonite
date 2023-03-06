import {Helmet} from 'react-helmet-async';

// @mui

import {
    Container,
    Stack,
    Typography,
    Grid,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Divider,
    Button
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
            })
            .catch(error => {
                console.log(error);
            })
    }

    const getByUUID = () => {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseAPI}/assessments/${uuid}`,
            headers: {
                'Authorization': `Bearer ${user.token}`
            },
        };

        axios(config)
            .then(response => {
                console.log(response.data)
                setEvalName(response.data.name)
            })
            .catch(error => {
                console.error(error);
            })
    }

    const downloadProject = (studentId, firstName, lastName) => {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseAPI}/files/${uuid}/${studentId}`,
            headers: {
                'Authorization': `Bearer ${user.token}`
            },
            responseType: 'blob'
        };

        axios(config)
            .then(response => {
                const fileURL = window.URL.createObjectURL(new Blob([response.data]));
                const fURL = document.createElement('a');

                fURL.href = fileURL;
                fURL.setAttribute(`download`, `${firstName}-${lastName}.zip`);
                document.body.appendChild(fURL);

                fURL.click();
            })
            .catch(error => {
                console.log(error);
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
                                            <Grid item sx={{mt: 2}} xs={5} textAlign={"right"}>
                                                Lien du rendu
                                            </Grid>
                                            <Grid item sx={{mt: 2}} xs={7} textAlign={"left"}>
                                                <Button onClick={(evt) => downloadProject(project.id, project.firstName, project.lastName)}>Télécharger</Button>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider/>
                                            </Grid>
                                            {project.check50Results && !JSON.parse(project.check50Results).error && JSON.parse(project.check50Results).results.map((result) => (
                                                <>
                                                    <Grid item sx={{mt: 2}} xs={5} textAlign={"right"}>
                                                        <Typography variant="h5" color={result.passed ? "success.main" : "error.main"}>Check : {result.name}</Typography>
                                                    </Grid>
                                                    <Grid item sx={{mt: 2}} xs={7} textAlign={"left"}>
                                                        <Typography variant="body1"><b>Description</b> : {result.description}</Typography>
                                                        <Typography variant="body1"><b>Résultat du check</b> : {result.passed ? 'Réussi' : 'Échoué'}</Typography>
                                                        <Typography variant="body1"><b>Logs</b> : </Typography>
                                                        {result.log.map((line) => (
                                                            <Typography sx={{ml: 2}} variant="body1">- {line}</Typography>
                                                        ))}
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Divider/>
                                                    </Grid>
                                                </>
                                            ))}
                                            {project.style50Results && !JSON.parse(project.style50Results).error && JSON.parse(project.style50Results).files.map((file) => (
                                                <>
                                                    <Grid item sx={{mt: 2}} xs={5} textAlign={"right"}>
                                                        <Typography variant="h5" color={file.score === 1 ? "success.main" : file.score > 0.5 ? "warning.main" : "error.main"}>Style : {file.name}</Typography>
                                                    </Grid>
                                                    <Grid item sx={{mt: 2}} xs={7} textAlign={"left"}>
                                                        <Typography variant="body1"><b>Score</b> : {file.score}</Typography>
                                                        {file.comments &&
                                                            <Typography variant="body1"><b>Commentaire</b> : il devrait y avoir plus de commentaires</Typography>
                                                        }
                                                        <Typography variant="body1"><b>Fichier avec éventuelles corrections</b> : </Typography>
                                                        <div dangerouslySetInnerHTML={{__html: file.diff}}/>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Divider/>
                                                    </Grid>
                                                </>
                                            ))}
                                            {project.check50Results && JSON.parse(project.check50Results).error &&
                                                <Typography>Error : {JSON.parse(project.check50Results).error.value}</Typography>
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
