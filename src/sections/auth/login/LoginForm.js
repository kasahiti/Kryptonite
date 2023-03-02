import {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

// @mui
import {Collapse, IconButton, InputAdornment, Stack, TextField} from '@mui/material';
import {Alert, LoadingButton} from '@mui/lab';

// components
import axios from 'axios';
import UserContext from '../../../index';
import Iconify from '../../../components/iconify';


// ----------------------------------------------------------------------

export default function LoginForm() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [userForm, setUserForm] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useContext(UserContext);
    const {user} = useContext(UserContext);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (user.auth) {
            navigate('/app', {replace: true});
        }
    })


    const handleClick = () => {
        login(userForm, password)
            .then(res => {
                if (res) {
                    setUserForm('');
                    setPassword('');
                    navigate('/app', {replace: true});
                } else {
                    console.error('Erreur')
                    setErrorMsg("Impossible de se connecter. Vérifiez votre nom d'utilisateur ou votre mot de passe");
                    setError(true);
                }
            });
    };

    const handlePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleUser = (event) => {
        setUserForm(event.target.value);
    }

    const handleRegistration = () => {
        const data = JSON.stringify(
            {
                email: userForm,
                password
            }
        );

        axios.post('https://krypto-backend.adron.ch/api/auth/register', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data);
                setError(false);
                setSuccess(true);
                setUserForm('');
                setPassword('');
            })
            .catch(() => {
                setSuccess(false);
                setErrorMsg("Impossible de créer un compte. Vérifier s'il n'existe pas déjà ou réssayer plus tard !");
                setError(true);
            })
    }

    return (
        <>
            <Stack spacing={3}>
                <TextField
                    name="username"
                    label="Nom d'utiliasteur"
                    value={userForm}
                    onChange={handleUser}
                />

                <TextField
                    name="password"
                    label="Mot de passe"
                    value={password}
                    onChange={handlePassword}
                    type={showPassword ? 'text' : 'password'}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.preventDefault();
                            handleClick();
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}/>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}>
                <LoadingButton size="large" type="submit" variant="contained" onClick={handleClick}>
                    Se connecter
                </LoadingButton>
            </Stack>

            <Collapse in={success}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setSuccess(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                    }
                    sx={{mb: 2}}
                >
                    Inscription réussie
                </Alert>
            </Collapse>

            <Collapse in={error}>
                <Alert
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setError(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                    }
                    sx={{mb: 2}}
                >
                    {errorMsg}
                </Alert>
            </Collapse>
        </>
    );
}
