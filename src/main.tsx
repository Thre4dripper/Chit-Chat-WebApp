import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './firebase/FirebaseInit.ts'
import SnackbarAlertProvider from './contexts/SnackbarAlert.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SnackbarAlertProvider>
            <App />
        </SnackbarAlertProvider>
    </React.StrictMode>
)
