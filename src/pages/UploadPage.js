import {Helmet} from 'react-helmet-async';
// @mui
import {styled} from '@mui/material/styles';
import {
    Box, Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select, Snackbar,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import MuiAlert from "@mui/material/Alert";

// hooks
import {useParams} from "react-router-dom";
import {createRef, forwardRef, useContext, useEffect, useState} from "react";
import axios from "axios";
import useResponsive from '../hooks/useResponsive';

// components
import UserContext from "../index";


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
const Alert = forwardRef((props, ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


// TODO: Can't send twice on same page; the file selection doesn't work after an initial "Envoyé!"

export default function UploadPage() {
    const { baseAPI } = useContext(UserContext);
    const {uuid} = useParams();
    const mdUp = useResponsive('up', 'md');

    const [evalName, setEvalName] = useState("");
    const [studentFirstName, setStudentFirstName] = useState("");
    const [studentLastName, setStudentLastName] = useState("");
    const [file, setFile] = useState(null);
    const fileInput = createRef();
    const [errorUuid, setErrorUuid] = useState(false);
    const [sent, setSent] = useState(false);

    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [msg, setMsg] = useState("This is a message");

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
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

    const getByUUID = () => {
        axios.get(`${baseAPI}/public/assessments/${uuid}`)
            .then(response => {
                setEvalName(response.data)
                setErrorUuid(false);
            })
            .catch(error => {
                console.error(error);
                setErrorUuid(true);
            })
    }

    const reset = () => {
        setStudentFirstName('');
        setStudentLastName('');
        setFile(null);
        closeSnack();
    }

    const upload = () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uuid", uuid);
        formData.append("firstName", studentFirstName);
        formData.append("lastName", studentLastName);

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseAPI}/files/`,
            data: formData
        };

        axios(config)
            .then(response => {
                console.log(JSON.stringify(response.data));
                reset()
                openSnack("success", "Fichier envoyé!")
                setSent(true);
            })
            .catch(error => {
                console.log(error);
                openSnack("error", "Une erreur s'est produite")
            });
    }

    const checkFields = () => {
        if(studentFirstName.length > 0 && studentLastName.length > 0 && file != null) {
            upload();
        } else {
            openSnack("error", "Il manque des champs obligatoires");
        }
    }

    useEffect(() => {
        getByUUID()
    }, [getByUUID]);

    return (
        <>
            <Helmet>
                <title> Rendu étudiant | Kryptonite </title>
            </Helmet>

            <StyledRoot>
                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{px: 5, mt: 10, mb: 5, ml: "auto", mr: "auto"}}>
                            Kryptonite
                        </Typography>
                        <Box sx={{justifyContent: "center", alignItems: "center"}}>
                            <img src="/assets/icons/navbar/logo.svg" width={"300px"} style={{margin: "auto"}} alt="login"/>
                        </Box>
                    </StyledSection>
                )}

                {!errorUuid && !sent &&
                    <Container maxWidth="sm">
                        <StyledContent>
                            <Typography variant="h4" gutterBottom>
                                Rendu étudiant du projet : {evalName}
                            </Typography>
                            <Grid container spacing={2} sx={{mt: 1}}>
                                <Grid item xs={12}>
                                    <Alert severity="warning">Veillez à rendre un seul fichier compressé au format zip !</Alert>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Prénom"
                                        value={studentFirstName}
                                        onChange={evt => setStudentFirstName(evt.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Nom"
                                        value={studentLastName}
                                        onChange={evt => setStudentLastName(evt.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <input
                                        ref={fileInput}
                                        onChange={handleFileChange}
                                        type="file"
                                        accept="application/zip,.rar,.7z,.zip"
                                        style={{ display: "none" }}
                                    />
                                    <Box sx={{border: "1px solid", borderRadius: "6px", borderColor: "rgba(145, 158, 171, 0.32)", padding: "10px"}}>
                                        <Button variant="text" onClick={() => fileInput.current.click()} sx={{mr: 2}}>
                                            Sélectionner
                                        </Button>
                                        {file &&
                                            <>
                                                {file.name}
                                            </>
                                        }
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" onClick={checkFields} sx={{mr: 2}}>
                                        Envoyer!
                                    </Button>
                                    <Button variant="outlined" onClick={reset} sx={{mr: 2}}>
                                        Tout vider
                                    </Button>
                                </Grid>
                            </Grid>
                        </StyledContent>
                    </Container>
                }
                {errorUuid &&
                    <Container maxWidth="sm">
                        <StyledContent>
                            <Typography variant="h3">
                                Aucun projet trouvé!
                            </Typography>
                        </StyledContent>
                    </Container>
                }
                {sent &&
                    <Container maxWidth="sm">
                        <StyledContent>
                            <Typography variant="h3">
                                Projet envoyé
                            </Typography>
                        </StyledContent>
                    </Container>
                }

                <Snackbar
                    open={open}
                    autoHideDuration={10000}
                    onClose={closeSnack}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                    <Alert onClose={closeSnack} severity={severity} sx={{ width: '100%' }}>
                        {msg}
                    </Alert>
                </Snackbar>
            </StyledRoot>
        </>
    );
}
