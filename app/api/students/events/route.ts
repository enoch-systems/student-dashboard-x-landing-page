import { clients } from "@/lib/events"

export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller)

      controller.enqueue("data: connected\n\n")

      request.signal.addEventListener("abort", () => {
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
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  })
}