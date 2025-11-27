import Website from './layouts/Website/index.jsx';
import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Admin from './layouts/Admin/index.jsx';
import Auth from './layouts/Auth/index.jsx';
import LoadingSpinner from './components/Loader/LoadingSpinner.jsx';

export const RenderRoutes = (routes = []) => (
  <Routes>
    {routes.map((route, i) => {
      const Guard = route.guard || Fragment;
      const Layout = route.layout || Fragment;
      const Element = route.element;

      if (route.children) {
        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout />
              </Guard>
            }
          >
            {route.children.map((child, index) => {
              const ChildGuard = child.guard || Fragment;
              const ChildElement = child.element;
              return (
                <Route
                  key={index}
                  path={child.path}
                  element={
                    <ChildGuard>
                      <Suspense fallback={<LoadingSpinner />}>
                        <ChildElement />
                      </Suspense>
                    </ChildGuard>
                  }
                />
              );
            })}
          </Route>
        );
      }

      return (
        <Route
          key={i}
          path={route.path}
          element={
            <Guard>
              <Suspense fallback={<LoadingSpinner />}>
                {Element && <Element />}
              </Suspense>
            </Guard>
          }
        />
      );
    })}
  </Routes>
);



const routes = [
  {
    path: '/',
    layout: Website,  // ky Layout ka Outlet
    children: [
      {
        path: 'home',
        element: lazy(() => import('./views/Website/home/index.jsx')),
      },
      {
        path: 'kati',
        element: lazy(() => import('./views/Website/kati/index.jsx')),
      },
       {
        path: 'reserve',
        element: lazy(() => import('./views/Website/Reserve/index.jsx')),
      }
    ],
  },
    {
    path: '/admin/',
    layout: Admin,  // ky Layout ka Outlet
    children: [
     
      {
        path: 'home',
        element: lazy(() => import('./views/Admin/home/index.jsx')),
      },
       {
        path: 'reserve',
        element: lazy(() => import('./views/Admin/Reserve/index.jsx')),
      },
       {
        path: 'edit',
        element: lazy(() => import('./views/Admin/Editor/index.jsx')),
      }, 
     ],
  },
   {
    path: '/',
    layout: Auth,  // ky Layout ka Outlet
    children: [
      {
        path: 'login',
        element: lazy(() => import('./views/Website/login/index.jsx')),
      },
     {
        path: 'admin/login',
        element: lazy(() => import('./views/Admin/login/index.jsx')),
      },
     ],
  },
];



export default routes;