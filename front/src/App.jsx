// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import routes, { RenderRoutes } from './routes';
import './index.css';

const App = () => {
  return (
    <Provider store={store}>
        <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
          {RenderRoutes(routes)}
        </BrowserRouter>
    </Provider>
  );
};

export default App;
