import PropTypes from 'prop-types';
import {forwardRef} from 'react';
import {Link as RouterLink} from 'react-router-dom';

// @mui
import {useTheme} from '@mui/material/styles';
import {Box, Link} from '@mui/material';
import SvgColor from '../svg-color';

// ----------------------------------------------------------------------

const Logo = forwardRef(({disabledLink = false, sx, ...other}, ref) => {
    const theme = useTheme();

    const PRIMARY_LIGHT = theme.palette.primary.light;

    const PRIMARY_MAIN = theme.palette.primary.main;

    const PRIMARY_DARK = theme.palette.primary.dark;

    const icon = (name, extension) => <SvgColor src={`/assets/icons/navbar/${name}.${extension}`}
                                                sx={{width: 1, height: 1}}/>;

    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    const logo = (
        <Box
            ref={ref}
            component="div"
            sx={{
                width: 150,
                height: 75,
                display: 'inline-flex',
                justifyContent: "center",
                margin: "auto",
                ...sx,
            }}
            {...other}
        >
            {icon('logo', 'svg')}
        </Box>
    );

    if (disabledLink) {
        return <>{logo}</>;
    }

    return (
        <Link to="/" component={RouterLink} sx={{display: 'contents'}}>
            {logo}
        </Link>
    );
});

Logo.propTypes = {
    sx: PropTypes.object,
    disabledLink: PropTypes.bool,
};

export default Logo;
