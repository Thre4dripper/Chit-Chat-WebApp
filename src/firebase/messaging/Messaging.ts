const FCM_URL = import.meta.env.VITE_LAMBDA_FCM_URL as string
const FCM_API_KEY = import.meta.env.VITE_LAMBDA_FCM_API_KEY as string
const FCM_AUTH_TOKEN = import.meta.env.VITE_LAMBDA_FCM_AUTH_TOKEN as string

interface NotificationPayload {
    deviceToken: string
    data: Record<string, string>
}

class Messaging {
    static async fireNotification(payload: NotificationPayload) {
        if (!payload.deviceToken) return

        try {
            await fetch(FCM_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': FCM_API_KEY,
                    'Authorization': `Bearer ${FCM_AUTH_TOKEN}`,
                },
                body: JSON.stringify(payload),
            })
        } catch (error) {
            console.error('Error sending FCM notification:', error)
        }
    }
}

export default Messaging
