import { clients } from "@/lib/events"

export async function GET(request: Request) {
  let lastEventId = request.headers.get("Last-Event-ID") || "0"
  let eventId = parseInt(lastEventId, 10)

  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller)

      // Send an initial comment to confirm connection
      const encoder = new TextEncoder()
      controller.enqueue(`: connected\n\n`)

      // Keepalive heartbeat every 30 seconds to prevent proxy timeouts
      const keepalive = setInterval(() => {
        try {
          controller.enqueue(`: keepalive\n\n`)
        } catch {
          clearInterval(keepalive)
          clients.delete(controller)
        }
      }, 30000)

      request.signal.addEventListener("abort", () => {
        clearInterval(keepalive)
        clients.delete(controller)
      })
    },

    cancel(controller) {
      clients.delete(controller)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}