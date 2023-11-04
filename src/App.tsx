import React from 'react'
import HomeScreen from './screens/HomeScreen.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthScreen from './screens/AuthScreen.tsx'
import ProtectiveRoute from './utils/ProtectiveRoute.tsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectiveRoute component={HomeScreen} />,
    },
    {
        path: '/auth',
        element: <AuthScreen />,
    },
])
const App: React.FC = () => {
    return <RouterProvider router={router} />
}

export default App
