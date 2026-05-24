importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js')

firebase.initializeApp({
    apiKey: '%VITE_FIREBASE_API_KEY%',
    authDomain: '%VITE_FIREBASE_AUTH_DOMAIN%',
    projectId: '%VITE_FIREBASE_PROJECT_ID%',
    storageBucket: '%VITE_FIREBASE_STORAGE_BUCKET%',
    messagingSenderId: '%VITE_FIREBASE_MESSAGING_SENDER_ID%',
    appId: '%VITE_FIREBASE_APP_ID%',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    const data = payload.data ?? {}
    const chatType = data.chatType ?? ''
    const messageType = data.messageType ?? ''
    const notifierName = data.notifierName ?? 'Chit Chat'
    const groupName = data.name ?? ''

    // Title: "GroupName: sender" for groups, just sender for DMs
    let title = notifierName
    if (chatType === 'GROUP' && groupName) {
        title = `${groupName}: ${notifierName}`
    }

    // Body text and optional large image
    let body = ''
    let image = undefined
    if (messageType === 'TypeText') {
        body = data.notificationText ?? ''
    } else if (messageType === 'TypeImage') {
        body = '📷 Photo'
        image = data.notificationImage
    } else if (messageType === 'TypeSticker') {
        body = '🎭 Sticker'
    }

    self.registration.showNotification(title, {
        body,
        icon: data.notifierImage || '/favicon.ico',
        image,
        data: payload.data,
    })
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    const data = event.notification.data ?? {}
    const chatType = data.chatType ?? ''

    let path = '/'
    if (chatType === 'USER') {
        path = '/chat/' + data.chatId
    } else if (chatType === 'GROUP') {
        path = '/group/' + data.group_id
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            const existingClient = windowClients.find((c) => c.url.startsWith(self.location.origin))
            if (existingClient) {
                return existingClient.focus().then(() => {
                    existingClient.postMessage({ type: 'SW_NAVIGATE', path })
                })
            }
            return clients.openWindow(self.location.origin + path)
        })
    )
})
