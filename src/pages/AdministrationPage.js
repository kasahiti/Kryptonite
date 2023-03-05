import {Helmet} from 'react-helmet-async';
import {filter, sample} from 'lodash';
import {forwardRef, useContext, useEffect, useState} from 'react';

// @mui
import {
    Avatar,
    Button,
    Card,
    Checkbox,
    Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid,
    IconButton, InputLabel,
    MenuItem,
    Paper,
    Popover, Select, Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow, TextField,
    Typography,
} from '@mui/material';
import MuiAlert from "@mui/material/Alert";

import axios from 'axios';

// components
import {deepPurple} from "@mui/material/colors";
import {faker} from "@faker-js/faker";
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// sections
import {UserListHead, UserListToolbar} from '../sections/@dashboard/user';

// mock
import UserContext from "../index";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'name', label: 'Prénom Nom', alignRight: false},
    {id: 'id', label: 'ID', alignRight: false},
    {id: 'email', label: 'Email / Nom d\'utilisateur', alignRight: false},
    {id: 'role', label: 'Role', alignRight: false},
    {id: ''},
];

const localUsers = [];


// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Alert = forwardRef((props, ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdministrationPage() {
    const {baseAPI, user, modifyDetails} = useContext(UserContext);

    const [users, setUsers] = useState(localUsers);
    const [selectedUser, setSelectedUser] = useState({firstName: null, lastName: null, email: null, role: null});

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogModifyOpen, setDialogModifyOpen] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConf, setNewPasswordConf] = useState('');

    const [open, setOpen] = useState(null);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setSeverity] = useState('error')
    const [msg, setMsg] = useState('');

    const fetchUsers = () => {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseAPI}/users`,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        };

        axios(config)
            .then(response => {
                const newlist = [];

                if(response.data.length > 0) {
                    for(let i = 0; i < response.data.length; i++) {
                        const user = response.data[i]
                        newlist.push({
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            name: `${user.firstName} ${user.lastName}`,
                            role: user.role,
                            email: user.email
                        });
                    }
                }
                setUsers(newlist);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const deleteUser = (evt, id) => {
        const config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: `${baseAPI}/users/${id}`,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        };

        axios(config)
            .then(response => {
                openSnack("success", "Utilisateur(s) supprimé(s) avec succès !")
                setSelected([]);
                setOpen(null);
                fetchUsers();
            })
            .catch(error => {
                openSnack("error", "Une erreur est survenue, impossible de supprimer le(s) utilisateur(s) !")
                console.log(error);
            })
    }

    useEffect(() => {
        fetchUsers();

        const intervalId = setInterval(() => {
            fetchUsers()
        }, 5000)

        return () => clearInterval(intervalId);
    }, [])

    const handleOpenMenu = (event, user) => {
        setOpen(event.currentTarget);
        setSelectedUser(user);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleCancelDialog = () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setRole('');
        setNewPasswordConf('');
        setNewPassword('');
        setDialogOpen(false);
        setDialogModifyOpen(false);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = users.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

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

    const handleRegistration = () => {
        if(firstName.length === 0 || lastName.length === 0 || email.length === 0 || newPassword.length === 0 || newPasswordConf.length === 0) {
            openSnack("error", "Il manque un ou plusieurs champs obligatoires !");
        } else if (newPasswordConf !== newPassword) {
            openSnack("error", "Les mots de passe ne correspondent pas !");
        } else {
            const data = JSON.stringify({
                "email": email,
                "firstName": firstName,
                "lastName": lastName,
                "password": newPassword,
                "role": role
            });

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${baseAPI}/auth/register`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                data
            };

            axios(config)
                .then(response => {
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setNewPassword("");
                    setNewPasswordConf("");
                    setDialogOpen(false);
                    openSnack("success", "L'utilisateur a été créé avec succès !");
                    fetchUsers();
                })
                .catch(error => {
                    openSnack("error", "L'utilisateur existe déjà !");
                })
        }
    }

    const handleModifyUser = () => {
        if(newPasswordConf !== newPassword) {
            openSnack("error", "Les nouveaux mots de passes ne correspondent pas !");
        } else {
            modifyDetails(firstName, lastName, selectedUser.email, email, newPasswordConf, role, selectedUser.id)
                .then((res) => {
                    if (res) {
                        setOpen(false);
                        setNewPassword('');
                        setNewPasswordConf('');
                        openSnack("success", "L'utilisateur a bien été modifié !")
                        handleCancelDialog();
                        fetchUsers();
                    } else {
                        openSnack("error", "L'utilisateur n'a pas pu être modifié !")
                    }
                })
        }
    }

    const handleModifyDialog = () => {
        setFirstName(selectedUser.firstName);
        setLastName(selectedUser.lastName);
        setEmail(selectedUser.email);
        setRole(selectedUser.role);
        setDialogModifyOpen(true);
    }

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    return (
        <>
            <Helmet>
                <title> Administration | Kryptonite </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Gestion des utilisateurs
                    </Typography>
                    <Button variant="contained" onClick={() => setDialogOpen(true)} startIcon={<Iconify icon="eva:plus-fill"/>}>
                        Nouvel utilisateur
                    </Button>
                </Stack>

                <Card>
                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} deleteUser={deleteUser} users={selected} />

                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={users.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const {id, firstName, lastName, name, role, email} = row;
                                        const selectedUser = selected.indexOf(id) !== -1;

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, id)}/>
                                                </TableCell>

                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar sx={{ bgcolor: deepPurple[500] }}>{firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()}</Avatar>

                                                        <Typography variant="subtitle2" noWrap>
                                                            {name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{id}</TableCell>

                                                <TableCell align="left">{email}</TableCell>

                                                <TableCell align="left">{role.includes("ADMIN") ? "Administrateur" : "Utilisateur"}</TableCell>

                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={(evt) => handleOpenMenu(evt, row)}>
                                                        <Iconify icon={'eva:more-vertical-fill'}/>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{height: 53 * emptyRows}}>
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        Aucun utilisateur trouvé
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        Aucun résultat pour &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br/> Essayez avec une autre orthographe
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelDisplayedRows={({from, to, count, page}) => {
                            return `${from}-${to} sur ${count}`
                        }}
                        labelRowsPerPage={"Lignes par page :"}
                    />
                </Card>
            </Container>

            <Dialog open={dialogOpen} onClose={handleCancelDialog}>
                <DialogTitle>Nouvel utilisateur</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Pour créer un utilisateur, veuillez saisir les informations suivantes :
                        <Grid container direction="row" justifyContent={"space-between"} spacing={2} sx={{mt:2, mb:2}}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Prénom"
                                    value={firstName}
                                    onChange={(evt) => setFirstName(evt.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Nom"
                                    value={lastName}
                                    onChange={(evt) => setLastName(evt.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Email"
                                    value={email}
                                    onChange={(evt) => setEmail(evt.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="language-label">Role *</InputLabel>
                                    <Select
                                        required
                                        labelId="language-label"
                                        value={role}
                                        label="Role"
                                        onChange={evt => setRole(evt.target.value)}
                                    >
                                        <MenuItem value={"ROLE_USER"}>Utilisateur</MenuItem>
                                        <MenuItem value={"ROLE_ADMIN"}>Administrateur</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    margin="dense"
                                    label="Mot de passe"
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    margin="dense"
                                    label="Confirmer le mot de passe"
                                    type="password"
                                    fullWidth
                                    value={newPasswordConf}
                                    onChange={(event) => setNewPasswordConf(event.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDialog}>Annuler</Button>
                    <Button onClick={handleRegistration}>Créer</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialogModifyOpen} onClose={handleCancelDialog}>
                <DialogTitle>Modification utilisateur</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Modifier l'utilisateur :
                        <Grid container direction="row" justifyContent={"space-between"} spacing={2} sx={{mt:2, mb:2}}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Prénom"
                                    value={firstName}
                                    onChange={(evt) => setFirstName(evt.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Nom"
                                    value={lastName}
                                    onChange={(evt) => setLastName(evt.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Email"
                                    value={email}
                                    onChange={(evt) => setEmail(evt.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="language-label">Role *</InputLabel>
                                    <Select
                                        required
                                        labelId="language-label"
                                        value={role}
                                        label="Role"
                                        onChange={evt => setRole(evt.target.value)}
                                    >
                                        <MenuItem value={"ROLE_USER"}>Utilisateur</MenuItem>
                                        <MenuItem value={"ROLE_ADMIN"}>Administrateur</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    label="Mot de passe (optionnel)"
                                    type="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    label="Confirmer le mot de passe"
                                    type="password"
                                    fullWidth
                                    value={newPasswordConf}
                                    onChange={(event) => setNewPasswordConf(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>La saisie d'un nouveau mot de passe est facultative. Pour changer le mot de passe, remplissez les deux champs.</Typography>
                            </Grid>
                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDialog}>Annuler</Button>
                    <Button onClick={handleModifyUser}>Modifier</Button>
                </DialogActions>
            </Dialog>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem onClick={handleModifyDialog}>
                    <Iconify icon={'eva:edit-fill'} sx={{mr: 2}}/>
                    Editer
                </MenuItem>

                <MenuItem sx={{color: 'error.main'}} onClick={(evt) => deleteUser(evt, selectedUser.id)}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
                    Supprimer
                </MenuItem>
            </Popover>

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