// React / React Router
import { Routes, Route } from 'react-router';
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';

// theme
import ThemeProvider from './theme';

// components
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';

// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';

// Pages
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import UserContext from './index';
import UploadPage from "./pages/UploadPage";

// ----------------------------------------------------------------------

const PrivateRoute = () => {
  const { user } = useContext(UserContext) ;

  return user.auth ? <Outlet /> : <Navigate to="/login" />;
}


export default function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />

      <Routes>
        <Route exact path="/app" element={<PrivateRoute />} >
          <Route exact path="/app" element={<DashboardLayout />} >
            <Route element={<Navigate to="/app/dashboard" />} index />
            <Route exact path="dashboard" element={<DashboardAppPage />} />
            <Route exact path="projets" element={<DashboardAppPage />} />
            <Route exact path="administration" element={<DashboardAppPage />} />
            <Route exact path="compte" element={<UserPage />} />
          </Route>
        </Route>
        <Route path="/assessment/:uuid" element={<UploadPage />} />
        <Route exact path="login" element={<LoginPage />} />
        <Route element={<SimpleLayout />} >
          <Route element={<Navigate to="/app/dashboard" />} index />
          <Route exact path="404" element={<Page404 />} />
          <Route exact path="*" element={<Navigate to="/404" />} />
        </Route>
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

    </ThemeProvider>
  );
}
