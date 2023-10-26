import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter,Routes, Route, createBrowserRouter, RouterProvider, } from 'react-router-dom';
import './index.css';
import App from './App';
import CarMarketPage from './pages/carmarket/carmarket';
import CarOwnedPage from './pages/carowned/carowned';
import UserInfoPage from './pages/userinfo/userinfo';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
    {
        path: '/', 
        element: <App/>,
        children: [
            { path:"carmarket" , element: <CarMarketPage/> },
            { path:"carowned" , element: <CarOwnedPage/> },
            { path:"user" , element: <UserInfoPage/> }
        ]
    },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
