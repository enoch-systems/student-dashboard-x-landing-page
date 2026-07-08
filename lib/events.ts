export const clients = new Set<ReadableStreamDefaultController>()

export function broadcast(data: any) {
  const message = `data: ${JSON.stringify(data)}\n\n`

  clients.forEach((controller) => {
    try {
      controller.enqueue(message)
    } catch (error) {
      clients.delete(controller)
    }
  })
}