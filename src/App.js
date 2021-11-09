import * as React from 'react';
// routes
import { Navigate, useNavigate, Routes, Route } from 'react-router-dom';
// import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';

import { AuthContext } from './context/AuthContext';
// import { io } from "socket.io-client";

import Home from './pages/Home';
import DashboardLayout from './layouts/dashboard';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import User from './pages/User';
import NotFound from './pages/Page404';
import Permission from './components/Permission';
import Sell from './pages/Sells';
import Welcome from './pages/Welcome';

// ----------------------------------------------------------------------

export default function App() {
  const { user } = React.useContext(AuthContext);

  const navigate = useNavigate();
  const goTo = (screen) => {
    navigate(screen);
    window.location.reload();
  };

  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      {/* <Router /> */}
        <Routes>
          {user ? (
            user.user.state === 'Autorizado' ? (
              (
                <Route path="/" element={<DashboardLayout />}>

                  <Route index element={<Welcome />} />

                  {user.user.role === 'Administrador' ? (
                    <Route path="tablero" element={user ? <DashboardApp /> : goTo('/')} />
                  ) : (
                    <Route path="*" element={<NotFound />} />
                  )}

                  <Route path="ventas" element={user ? <Sell /> : goTo('/')} />

                  {user.user.role === 'Administrador' ? (
                    <Route path="usuarios" element={user ? <User /> : goTo('/')} />
                  ) : (
                    <Route path="*" element={<NotFound />} />
                  )}

                  {user.user.role === 'Administrador' ? (
                    <Route path="productos" element={user ? <Products /> : goTo('/')} />
                  ) : (
                    <Route path="*" element={<NotFound />} />
                  )}

                  <Route path="*" element={<NotFound />} />
                </Route>
              )
            ) : (
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Permission />} />
              </Route>
            )
          ) : (
            <Route path="/" element={<Home />} />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </ThemeConfig>

  );
}
