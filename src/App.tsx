import React from 'react'
import HomeScreen from './screens/HomeScreen.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import AuthScreen from './screens/AuthScreen.tsx'
import ProtectiveRoute from './components/ProtectiveRoute.tsx'
import MobileScreen from './screens/MobileScreen.tsx'
import { useMediaQuery } from '@mui/material'
import HomeIndexRoute from './screens/routes/HomeIndexRoute.tsx'
import DmChatRoute from './screens/routes/DmChatRoute.tsx'
import GroupChatRoute from './screens/routes/GroupChatRoute.tsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <ProtectiveRoute>
                <HomeScreen />
            </ProtectiveRoute>
        ),
        children: [
            { index: true, element: <HomeIndexRoute /> },
            { path: 'chat/:chatId', element: <DmChatRoute /> },
            { path: 'group/:groupId', element: <GroupChatRoute /> },
        ],
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
