const FCM_URL = 'https://6753fab93e069e74e144.appwrite.global'

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
                },
                body: JSON.stringify(payload),
            })
        } catch (error) {
            console.error('Error sending FCM notification:', error)
        }
    }
}

export default Messaging
