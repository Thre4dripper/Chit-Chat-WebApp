import { createContext, useState } from 'react'
import { Snackbar, Alert, AlertColor } from '@mui/material'
interface SnackbarContextType {
    openSnackbar: (message: string, alerttype: AlertColor | undefined) => void
}
export const SnackbarContext = createContext<SnackbarContextType>({
    openSnackbar: () => {},
})

const SnackbarAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    //   type AlertColor = "success" | "info" | "warning" | "error"
    const [alertType, setAlerttype] = useState<AlertColor | undefined>(undefined)

    const openSnackbar = (msg: string, alerttype: AlertColor | undefined) => {
        setMessage(msg)
        setAlerttype(alerttype)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <SnackbarContext.Provider value={{ openSnackbar }}>
            {children}
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} message={message}>
                <Alert
                    onClose={handleClose}
                    severity={alertType}
                    variant='filled'
                    sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    )
}

export default SnackbarAlertProvider
