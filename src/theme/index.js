import PropTypes from 'prop-types';
import {useMemo} from 'react';
// @mui
import {CssBaseline} from '@mui/material';
import {createTheme, StyledEngineProvider, ThemeProvider as MUIThemeProvider} from '@mui/material/styles';
//
import {frFR} from "@mui/material/locale";
import palette from './palette';
import shadows from './shadows';
import typography from './typography';
import GlobalStyles from './globalStyles';
import customShadows from './customShadows';
import componentsOverride from './overrides';


// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
    children: PropTypes.node,
};

export default function ThemeProvider({children}) {
    const themeOptions = useMemo(
        () => ({
            palette,
            shape: {borderRadius: 6},
            typography,
            shadows: shadows(),
            customShadows: customShadows(),
        }),
        []
    );

    const theme = createTheme(themeOptions, frFR);
    theme.components = componentsOverride(theme);

    return (
        <StyledEngineProvider injectFirst>
            <MUIThemeProvider theme={theme}>
                <CssBaseline/>
                <GlobalStyles/>
                {children}
            </MUIThemeProvider>
        </StyledEngineProvider>
    );
}
