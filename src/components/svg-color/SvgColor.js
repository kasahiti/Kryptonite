import PropTypes from 'prop-types';
import {forwardRef} from 'react';
// @mui
import {Box} from '@mui/material';

// ----------------------------------------------------------------------

const SvgColor = forwardRef(({src, sx, ...other}, ref) => (
    <Box
        component="span"
        className="svg-color"
        ref={ref}
        sx={{
            width: 24,
            height: 24,
            display: 'inline-block',
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            ...sx,
        }}
        {...other}
    />
));

SvgColor.propTypes = {
    src: PropTypes.string,
    sx: PropTypes.object,
};

export default SvgColor;
