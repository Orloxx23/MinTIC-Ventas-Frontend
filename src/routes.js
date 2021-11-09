import * as React from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
// import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
//
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = React.useContext(AuthContext);
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" /> },
        { path: 'app', element: user ? <DashboardApp /> : <Navigate to="/" /> },
        { path: 'user', element: user ? <User /> : <Navigate to="/" /> },
        { path: 'products', element: user ? <Products /> : <Navigate to="/" /> },
        { path: 'blog', element: user ? <Blog /> : <Navigate to="/" /> }
      ]
    },
    {
      path: '/',
      // element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '/', element: user ? <Navigate to="/dashboard/app" replace /> : <Home /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
