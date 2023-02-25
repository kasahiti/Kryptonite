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
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';

// hooks
import {useParams} from "react-router-dom";
import {createRef, useContext, useEffect, useState} from "react";
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

export default function UploadPage() {
    const { baseAPI } = useContext(UserContext);
    const {uuid} = useParams();
    const mdUp = useResponsive('up', 'md');

    const [evalName, setEvalName] = useState("");
    const [studentFirstName, setStudentFirstName] = useState("");
    const [studentLastName, setStudentLastName] = useState("");
    const [file, setFile] = useState(null);
    const fileInput = createRef();

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            console.log(file);
        }
    };

    const getByUUID = () => {
        axios.get(`${baseAPI}/assessments/public?uuid=${uuid}`)
            .then(response => {
                setEvalName(response.data)
            })
            .catch(error => {
                console.error(error);
            })
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
            })
            .catch(error => {
                console.log(error);
            });
    }

    useEffect(() => {
        getByUUID()
    }, []);

    return (
        <>
            <Helmet>
                <title> Upload | Kryptonite </title>
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
                            Rendu étudiant du projet : {evalName}
                        </Typography>
                        <Grid container spacing={2} sx={{mt: 2}}>
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
                                <Button variant="text" onClick={() => fileInput.current.click()} sx={{mr: 2}}>
                                    Sélectionner
                                </Button>
                                {file &&
                                    <>
                                        {file.name}
                                    </>
                                }
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="outlined" onClick={upload} sx={{mr: 2}}>
                                    Envoyer!
                                </Button>
                            </Grid>
                        </Grid>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}
