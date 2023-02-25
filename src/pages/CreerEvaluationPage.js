import {Helmet} from 'react-helmet-async';

// @mui
import {
    Button,
    Container,
    FormControl, FormControlLabel, FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack, Switch,
    TextField,
    Typography
} from '@mui/material';

import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {useContext, useState} from "react";

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism.css';
import UserContext from "../index";

// ----------------------------------------------------------------------

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function CreerEvaluationPage() {
    const { user } = useContext(UserContext);
    const [evalName, setEvalName] = useState("");
    const [language, setLanguage] = useState("");
    const [fileSwitch, setFileSwitch] = useState(false);
    const [file, setFile] = useState(false);

    const [code, setCode] = useState(
        `import check50\nimport check50_java\n\n@check50.check()\ndef prints_hello():\n    """hello world"""\n    check50.run("python3 hello.py").stdout("Hello, world!", regex=False).exit(0)\n`
    );

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <>
            <Helmet>
                <title> Créer une nouvelle évaluation | Kryptonite </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Créer une évaluation
                    </Typography>
                </Stack>

                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            required
                            label="Nom de l'évaluation"
                            value={evalName}
                            onChange={evt => setEvalName(evt.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel id="language-label">Language de programmation</InputLabel>
                            <Select
                                labelId="language-label"
                                value={language}
                                label="Language de programmation"
                                onChange={evt => setLanguage(evt.target.value)}
                            >
                                <MenuItem value={"Java"}>Java</MenuItem>
                                <MenuItem value={"Python"}>Python</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={12}>
                        <FormGroup sx={{mb: 3}}>
                            <FormControlLabel control={<Switch checked={fileSwitch} onChange={evt => setFileSwitch(evt.target.checked)} />} label="Uploader un fichier de correction .py" />
                        </FormGroup>
                        {fileSwitch &&
                            <input type="file" accept=".py" onChange={handleFileChange} />
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
                    <Grid item xs={4} sx={{mt:3}}>
                        <Button variant="contained" onClick={evt => console.log(user.token)}>
                            Créer l'évaluation
                        </Button>
                    </Grid>
                </Grid>

            </Container>
        </>
    );
}
