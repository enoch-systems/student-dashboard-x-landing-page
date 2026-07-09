"use client"

import { useEffect, useRef, useCallback } from "react"

interface SSEOptions {
  onMessage: (event: MessageEvent) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  enabled?: boolean
}

export function useSSE(url: string, options: SSEOptions) {
  const { onMessage, onError, onOpen, enabled = true } = options
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptRef = useRef(0)
  const maxReconnectAttempts = 10

  const closeConnection = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (!enabled) return

    // Close any existing connection
    closeConnection()

    const es = new EventSource(url)
    eventSourceRef.current = es

    es.onopen = () => {
      reconnectAttemptRef.current = 0
      onOpen?.()
    }

    es.onmessage = (event) => {
      // Ignore keepalive comments – they don't fire onmessage
      onMessage(event)
    }

    es.onerror = (error) => {
      onError?.(error)
      es.close()
      eventSourceRef.current = null

      // Exponential backoff reconnection
      if (reconnectAttemptRef.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 30000)
        reconnectAttemptRef.current += 1
        reconnectTimeoutRef.current = setTimeout(connect, delay)
      }
    }
  }, [url, enabled, onMessage, onError, onOpen, closeConnection])

  useEffect(() => {
    connect()

    return () => {
      closeConnection()
    }
  }, [connect, closeConnection])

  return { reconnect: connect, close: closeConnection }
}