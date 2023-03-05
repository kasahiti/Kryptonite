import {Helmet} from 'react-helmet-async';
import {forwardRef, useContext, useState} from 'react';

// @mui
import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import MuiAlert from "@mui/material/Alert";


// mock
import UserContext from '../index';


const Alert = forwardRef((props, ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function UserPage() {
    const { user, modifyDetails } = useContext(UserContext);

    const [open, setOpen] = useState(false);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setSeverity] = useState('error')
    const [msg, setMsg] = useState('');

    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConf, setNewPasswordConf] = useState('');

    const [disabled, setDisabled] = useState(true);
    const [modifyText, setModifyText] = useState("Modifier");

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);

    const openSnack = (severity, message) => {
        setSeverity(severity);
        setMsg(message);
        setAlertOpen(true);
    };

    const closeSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
        setNewPassword('');
        setNewPasswordConf('');
        setAlertOpen(false);
    };

    const handleModify = () => {
        if(disabled) {
            setDisabled(false)
            setModifyText("Annuler");
        } else {
            setDisabled(true);
            setModifyText("Modifier")
            setFirstName(user.firstName)
            setLastName(user.lastName)
            setEmail(user.email)
        }
    }

    const handleSave = () => {
        modifyDetails(firstName, lastName, user.email, email, null, null, user.id)
            .then((res) => {
                if(res) {
                    setFirstName(firstName)
                    setLastName(lastName)
                    setEmail(email)
                    setDisabled(true)
                    setModifyText("Modifier")
                    openSnack("success", "La modification s'est déroulée avec succes !");
                } else {
                    openSnack("error", "Une erreur est survenue");
                }
            })
    }

    const handleChangePassword = () => {
        if (newPassword !== newPasswordConf) {
            openSnack("error", "Les novueaux mots de passes ne correpondent pas!");
        } else {
            modifyDetails(null, null, user.email, null, newPassword, user.id)
                .then((res) => {
                    if (res) {
                        setOpen(false);
                        setNewPassword('');
                        setNewPasswordConf('');
                        openSnack("success", "Le mot de passe a bien été changé !");
                    } else {
                        openSnack("error", "Le mot de passe n'as pas pu être changé pour une raison inconnue !");
                    }
                })
        }
    }

    return (
        <>
            <Helmet>
                <title> Mon Compte | Kryptonite </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Utilisateur
                    </Typography>
                </Stack>

                <Grid container direction="column" spacing={2} sx={{mt:2, mb:2}}>
                    <Grid item xs={4}>
                        <TextField
                            disabled={disabled}
                            id="outlined-disabled"
                            label="Prénom"
                            value={firstName}
                            onChange={(evt) => setFirstName(evt.target.value)}
                            sx={{width: "300px"}}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            disabled={disabled}
                            id="outlined-disabled"
                            label="Nom"
                            value={lastName}
                            onChange={(evt) => setLastName(evt.target.value)}
                            sx={{width: "300px"}}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            disabled={disabled}
                            id="outlined-disabled"
                            label="Email / Nom d'utilisateur"
                            value={email}
                            onChange={(evt) => setEmail(evt.target.value)}
                            sx={{width: "300px"}}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant='text' sx={{mr: 2.5}} onClick={handleModify}>{modifyText}</Button>
                        <Button variant='contained' disabled={disabled} sx={{mr: 2}} onClick={handleSave}>Enregistrer</Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant='outlined' onClick={handleClickOpen}>Changer le mot de passe</Button>
                    </Grid>
                </Grid>

                <Dialog open={open} onClose={handleCancel}>
                    <DialogTitle>Modification du mot de passe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Pour changer votre mot de passe, saisissez votre nouveau mot de passe
                        </DialogContentText>
                        <TextField
                            margin="dense"
                            id="newPass1"
                            label="Nouveau mot de passe"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                        />
                        <TextField
                            margin="dense"
                            id="newPass2"
                            label="Confirmer le mot de passe"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={newPasswordConf}
                            onChange={(event) => setNewPasswordConf(event.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancel}>Annuler</Button>
                        <Button onClick={handleChangePassword}>Changer</Button>
                    </DialogActions>
                </Dialog>
            </Container>
            <Snackbar
                open={alertOpen}
                autoHideDuration={10000}
                onClose={closeSnack}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
                <Alert onClose={closeSnack} severity={alertSeverity} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
        </>
    );
}
