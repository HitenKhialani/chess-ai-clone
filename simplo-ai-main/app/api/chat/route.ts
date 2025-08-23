import { type NextRequest, NextResponse } from "next/server"

// Get API key from environment variable
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY environment variable is not set")
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Check if any message contains an image
    const hasImage = messages.some((msg: any) => msg.image)
    // Use vision model if there's an image, otherwise use the regular model
    const model = hasImage ? "meta-llama/llama-3.2-11b-vision-instruct:free" : "openai/gpt-oss-20b:free"

    // Process messages to include images in the correct format
    const processedMessages = messages.map((msg: any) => {
      if (msg.image) {
        return {
          role: msg.role,
          content: [
            { type: "text", text: msg.content || "Please describe this image." },
            { type: "image_url", image_url: { url: msg.image } },
          ],
        }
      }
      return { role: msg.role, content: msg.content }
    })

    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: hasImage
              ? "You are a helpful AI assistant with vision capabilities. When you see an image, describe what you observe in detail. Be friendly, helpful, and conversational. Always respond in English."
              : "You are a helpful AI assistant. Always respond in English, regardless of the language used in the user's message. Be friendly, helpful, and conversational.",
          },
          ...processedMessages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      }),
    })

    if (!upstream.ok || !upstream.body) {
      let err: any
      try {
        err = await upstream.json()
      } catch {
        err = await upstream.text()
      }
      console.error("OpenRouter API error:", err)
      return NextResponse.json({ error: err || "Failed to stream from provider" }, { status: upstream.status || 500 })
    }

    // Proxy SSE stream back to the client
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const reader = upstream.body!.getReader()
        const pump = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close()
              return
            }
            if (value) controller.enqueue(value)
            pump()
          }).catch((e) => {
            controller.error(e)
          })
        }
        pump()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

