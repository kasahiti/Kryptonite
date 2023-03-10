import PropTypes from 'prop-types';
// @mui
import {alpha, styled} from '@mui/material/styles';
import {IconButton, InputAdornment, OutlinedInput, Toolbar, Tooltip, Typography} from '@mui/material';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({theme}) => ({
    height: 96,
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({theme}) => ({
    width: 240,
    transition: theme.transitions.create(['box-shadow', 'width'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    '&.Mui-focused': {
        width: 320,
        boxShadow: theme.customShadows.z8,
    },
    '& fieldset': {
        borderWidth: `1px !important`,
        borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
    },
}));

// ----------------------------------------------------------------------

UserListToolbar.propTypes = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    deleteUser: PropTypes.func,
    users: PropTypes.string
};

export default function UserListToolbar({numSelected, filterName, onFilterName, deleteUser, users}) {

    const test = () => {
        for(let i=0; i<numSelected; i++) {
            deleteUser(null, users[i])
        }
    }

    return (
        <StyledRoot
            sx={{
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography component="div" variant="subtitle1">
                    {numSelected} selectionn√©(s)
                </Typography>
            ) : (
                <StyledSearch
                    value={filterName}
                    onChange={onFilterName}
                    placeholder="Chercher un utilisateur..."
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify icon="eva:search-fill" sx={{color: 'text.disabled', width: 20, height: 20}}/>
                        </InputAdornment>
                    }
                />
            )}

            {numSelected > 0 &&
                <Tooltip title="Delete" onClick={test}>
                    <IconButton>
                        <Iconify icon="eva:trash-2-fill"/>
                    </IconButton>
                </Tooltip>
            }
        </StyledRoot>
    );
}
