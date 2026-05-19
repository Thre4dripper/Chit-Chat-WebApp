import React from 'react'
import HomeScreen from './screens/HomeScreen.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import AuthScreen from './screens/AuthScreen.tsx'
import ProtectiveRoute from './components/ProtectiveRoute.tsx'
import MobileScreen from './screens/MobileScreen.tsx'
import { useMediaQuery } from '@mui/material'

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectiveRoute>
                <HomeScreen />
            </ProtectiveRoute>
        ),
    },
    {
        path: '/auth',
        element: <AuthScreen />,
    },
])
const App: React.FC = () => {
    const isMobile = useMediaQuery('(max-width: 768px)')

    if (isMobile) {
        return <MobileScreen />
    }

    return <RouterProvider router={router} />
}

export default App
