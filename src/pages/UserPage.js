import {Helmet} from 'react-helmet-async';
import {useContext, useState} from 'react';
// @mui
import {
  Button,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

// mock
import {Alert} from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import UserContext from '../index';


export default function UserPage() {
    const [open, setOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setSeverity] = useState('error')
    const [msg, setMsg] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConf, setNewPasswordConf] = useState('');
    const {changePassword} = useContext(UserContext);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleChangePassword = () => {
        if (newPassword !== newPasswordConf) {
            setAlertOpen(true);
            setSeverity('error');
            setMsg('Les novueaux mots de passes ne correpondent pas!');
        } else {
            changePassword(newPasswordConf)
                .then((res) => {
                    if (res) {
                        setAlertOpen(true);
                        setSeverity('success');
                        setMsg("Le mot de passe a bien été changé !");
                    } else {
                        setAlertOpen(true);
                        setSeverity('error');
                        setMsg("Le mot de passe n'as pas pu être changé pour une raison inconnue !");
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

                <Button variant='outlined' onClick={handleClickOpen}>Changer le mot de passe</Button>

                <Dialog open={open} onClose={handleCancel}>
                    <DialogTitle>Modification du mot de passe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Pour changer votre mot de passe, saisissez votre mot de passe actuel et le nouveau mot de
                            passe
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
                        <Collapse in={alertOpen} sx={{mt: 1}}>
                            <Alert
                                severity={alertSeverity}
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit"/>
                                    </IconButton>
                                }
                                sx={{mb: 2}}
                            >
                                {msg}
                            </Alert>
                        </Collapse>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancel}>Annuler</Button>
                        <Button onClick={handleChangePassword}>Changer</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}
