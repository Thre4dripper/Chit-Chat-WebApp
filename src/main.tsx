import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './firebase/FirebaseInit.ts'
import { SnackbarProvider } from 'notistack'
import UserDataProvider from './contexts/UserData.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SnackbarProvider>
            <UserDataProvider>
                <App />
            </UserDataProvider>
        </SnackbarProvider>
    </React.StrictMode>
)
