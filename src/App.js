// React / React Router
import {Route, Routes} from 'react-router';
import {Navigate, Outlet} from 'react-router-dom';
import {useContext} from 'react';

// theme
import ThemeProvider from './theme';

// components
import ScrollToTop from './components/scroll-to-top';
import {StyledChart} from './components/chart';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';

// Pages
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import UserContext from './index';
import UploadPage from "./pages/UploadPage";
import AdministrationPage from "./pages/AdministrationPage";
import EvaluationsPage from "./pages/EvaluationsPage";
import CreerEvaluationPage from "./pages/CreerEvaluationPage";
import EvaluationRendusPage from "./pages/EvaluationRendusPage";
import Apropos from "./pages/Apropos";

// ----------------------------------------------------------------------

const PrivateRoute = () => {
    const {user} = useContext(UserContext);

    return user.auth ? <Outlet/> : <Navigate to="/login"/>;
}


export default function App() {
    return (
        <ThemeProvider>
            <ScrollToTop/>
            <StyledChart/>

            <Routes>
                <Route exact path="/app" element={<PrivateRoute/>}>
                    <Route exact path="/app" element={<DashboardLayout/>}>
                        <Route element={<Navigate to="/app/evaluations"/>} index/>
                        <Route exact path="assessment" element={<CreerEvaluationPage/>}/>
                        <Route exact path="evaluations" element={<EvaluationsPage/>}/>
                        <Route exact path="evaluations/:uuid" element={<EvaluationRendusPage/>}/>
                        <Route exact path="administration" element={<AdministrationPage/>}/>
                        <Route exact path="compte" element={<UserPage/>}/>
                        <Route exact path="about" element={<Apropos/>}/>
                    </Route>
                </Route>
                <Route path="/assessment/:uuid" element={<UploadPage/>}/>
                <Route exact path="login" element={<LoginPage/>}/>
                <Route element={<SimpleLayout/>}>
                    <Route element={<Navigate to="/app/evaluations"/>} index/>
                    <Route exact path="404" element={<Page404/>}/>
                    <Route exact path="*" element={<Navigate to="/404"/>}/>
                </Route>
                <Route path="*" element={<Navigate to="/404" replace/>}/>
            </Routes>
        </ThemeProvider>
    );
}
