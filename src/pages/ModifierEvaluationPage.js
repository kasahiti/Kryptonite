import {Helmet} from 'react-helmet-async';

// @mui
import {
    Box,
    Button,
    Container,
    FormControl, FormControlLabel, FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Select, Snackbar,
    Stack, Switch,
    TextField,
    Typography
} from '@mui/material';

import MuiAlert from '@mui/material/Alert';

import {createRef, forwardRef, useContext, useEffect, useState} from "react";

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';
import axios from "axios";
import {useParams} from "react-router-dom";
import UserContext from "../index";

// ----------------------------------------------------------------------

const Alert = forwardRef((props, ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultCode = `import check50
import check50_java

@check50.check()
def exists():
    """Verify that projects file exists"""   
    check50.exists("hello.py", "helloadvanced.py")

@check50.check(exists)
def prints_hello():
    """Verify that hello.py displays Hello, World. Depends on exists() function."""   
    check50.run("python3 hello.py").stdout("Hello, world!", regex=False).exit(0)
    
`

export default function ModifierEvaluationPage() {
    const { user, baseAPI } = useContext(UserContext);
    const {uuid} = useParams();

    const [evalName, setEvalName] = useState("");
    const [newEvalName, setNewEvalName] = useState("");
    const [language, setLanguage] = useState("");
    const [fileSwitch, setFileSwitch] = useState(false);
    const [file, setFile] = useState(null);

    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [msg, setMsg] = useState("This is a message");

    const fileInput = createRef();

    const [code, setCode] = useState(
        defaultCode
    );

    const getByUUID = () => {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseAPI}/assessments/${uuid}`,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }

        axios(config)
            .then(response => {
                setEvalName(response.data.name);
                setNewEvalName(response.data.name);
                setCode(response.data.correction);
                let language = response.data.language.toLowerCase();
                language = language.charAt(0).toUpperCase() + language.slice(1)
                setLanguage(language);
            })
            .catch(error => {
                console.error(error);
            })
    }

    useEffect(() => {
        getByUUID();


    }, [])

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


    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const reset = () => {
        setNewEvalName("");
        setLanguage("");
        setFileSwitch(false);
        setFile(null);
        setCode(defaultCode);
        setOpen(false);
    }

    const verifyFields = () => {
        if(newEvalName.length > 0 && language.length > 0 && (code.length > 0 || file != null)) {
            modifyAssessment();
        } else {
            openSnack("error", "Il manque des champs obligatoires !")
        }
    }

    const modifyAssessment = async () => {
        const formData = new FormData();
        formData.append('name', newEvalName);
        formData.append('language', language.toUpperCase());

        if (fileSwitch) {
            if(file) {
                formData.append('correction', file);
            }
        } else {
            const pythonFile = new File([code], "correction.py", { type: 'text/plain' });
            formData.append('correction', pythonFile);
        }

        const config = {
            method: 'put',
            maxBodyLength: Infinity,
            url: `${baseAPI}/assessments/${uuid}`,
            headers: {
                'Authorization': `Bearer ${user.token}`,
            },
            data : formData
        };

        axios(config)
            .then((response) => {
                getByUUID();
                openSnack("success", "Evaluation modifiée avec succès !");
            })
            .catch((error) => {
                openSnack("error", "Impossible de modifier l'évaluation pour le moment...")
                console.log(error);
            });
    }

    return (
        <>
            <Helmet>
                <title> Modifier une évaluation | Kryptonite </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Modifier l'évaluation {evalName}
                    </Typography>
                </Stack>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            required
                            label="Nom de l'évaluation"
                            value={newEvalName}
                            onChange={evt => setNewEvalName(evt.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="language-label">Language de programmation *</InputLabel>
                            <Select
                                required
                                labelId="language-label"
                                value={language}
                                label="Language de programmation"
                                onChange={evt => setLanguage(evt.target.value)}
                            >
                                <MenuItem value={"Python"}>Python</MenuItem>
                                <MenuItem value={"Java"}>Java</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} />
                    <Grid item xs={12}>
                        <FormGroup sx={{mb: 3}}>
                            <FormControlLabel control={<Switch checked={fileSwitch} onChange={evt => setFileSwitch(evt.target.checked)} />} label="Uploader un fichier de correction .py" />
                        </FormGroup>
                        {fileSwitch &&
                            <Box sx={{border: "1px solid", borderRadius: "6px", borderColor: "rgba(145, 158, 171, 0.32)", padding: "10px", maxWidth: "375px"}}>
                                <input
                                    ref={fileInput}
                                    onChange={handleFileChange}
                                    type="file"
                                    accept=".py"
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
                            </Box>
                        }
                        {!fileSwitch &&
                            <>
                                <Typography variant="p" gutterBottom>
                                    Saisissez votre correction au format Python ici (<a href="https://cs50.readthedocs.io/projects/check50/en/latest/check_writer/" target="_blank" rel="noreferrer">documentation check50</a>):
                                </Typography>
                                <Editor
                                    value={code}
                                    onValueChange={code => setCode(code)}
                                    highlight={code => highlight(code, languages.python)}
                                    padding={10}
                                    style={{
                                        fontFamily: '"Fira code", "Fira Mono", monospace',
                                        fontSize: 15,
                                        border: "1px solid black"
                                    }}
                                />
                            </>
                        }
                    </Grid>
                    <Grid item xs={12} md={4} sx={{mt:3}}>
                        <Button variant="contained" onClick={verifyFields}>
                            Modifier
                        </Button>
                        <Button sx={{ml: 2}} variant="outlined" onClick={reset}>Tout vider</Button>
                    </Grid>
                </Grid>
            </Container>
            <Snackbar
                open={open}
                autoHideDuration={10000}
                onClose={closeSnack}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert onClose={closeSnack} severity={severity} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
        </>
    );
}
