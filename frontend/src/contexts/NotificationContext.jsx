import { createContext, useContext, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'

const NotificationContext = createContext()

const WS_URL = 'ws://localhost:3003'

export function NotificationProvider({ children, onEvent }) {
  const { token } = useAuth()
  const wsRef = useRef(null)

  useEffect(() => {
    if (!token) return

    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[frontend] WebSocket conectado')
    }

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        console.log('[frontend] Evento recebido:', payload.event)
        if (onEvent) onEvent(payload)
      } catch {}
    }

    ws.onclose = () => {
      console.log('[frontend] WebSocket desconectado')
    }

    return () => ws.close()
  }, [token])

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}
