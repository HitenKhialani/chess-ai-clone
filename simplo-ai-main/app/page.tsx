"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Sparkles, MessageSquare, Image, X, Clipboard, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

// Function to clean markdown formatting from AI responses
const cleanMarkdown = (text: string): string => {
  return text
    // Remove markdown headers (##, ###, etc.) and convert to plain text
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')
    // Remove bold formatting (**text**)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    // Remove italic formatting (*text*)
    .replace(/\*(.*?)\*/g, '$1')
    // Remove code formatting (`text`)
    .replace(/`(.*?)`/g, '$1')
    // Remove links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove horizontal rules (---, ***, etc.)
    .replace(/^[-*_]{3,}$/gm, '')
    // Clean up extra whitespace and normalize line breaks
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  image?: string // Base64 encoded image
}

export default function ChatBot() {
  const [isConfigured] = useState(true) // Always configured now
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showPasteHint, setShowPasteHint] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const streamingAssistantIndexRef = useRef<number | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            setSelectedImage(result)
            setShowPasteHint(true)
            setTimeout(() => setShowPasteHint(false), 3000)
          }
          reader.readAsDataURL(file)
        }
        break
      }
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const downloadChat = () => {
    if (messages.length === 0) return

    const formatTimestamp = (date: Date) => {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    let chatContent = `Simplo AI Assistant - Chat Export\n`
    chatContent += `Generated on: ${new Date().toLocaleString()}\n`
    chatContent += `Total messages: ${messages.length}\n`
    chatContent += `\n${'='.repeat(50)}\n\n`

    messages.forEach((message, index) => {
      const role = message.role === 'user' ? 'You' : 'AI Assistant'
      const timestamp = formatTimestamp(message.timestamp)
      const content = cleanMarkdown(message.content)
      
      chatContent += `[${timestamp}] ${role}:\n`
      if (message.image) {
        chatContent += `[Image attached]\n`
      }
      chatContent += `${content}\n\n`
    })

    const blob = new Blob([chatContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `simplo-chat-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const handleGlobalPaste = (event: ClipboardEvent) => {
      // Only handle paste if the input is focused or if we're in the chat area
      if (inputRef.current?.contains(event.target as Node) || 
          document.querySelector('.chat-container')?.contains(event.target as Node)) {
        handlePaste(event)
      }
    }

    document.addEventListener('paste', handleGlobalPaste)
    return () => {
      document.removeEventListener('paste', handleGlobalPaste)
    }
  }, [])

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSendMessage = async () => {
    if (!input.trim() && !selectedImage) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
      image: selectedImage || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: 'no-store',
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
            image: msg.image,
          })),
        }),
      })
      if (!response.ok || !response.body) {
        // Try to get the error payload
        let err: any
        try {
          err = await response.json()
        } catch {
          err = await response.text()
        }
        throw new Error(typeof err === 'string' ? err : JSON.stringify(err))
      }

      // Insert a streaming assistant message and capture its index
      setMessages((prev) => {
        const idx = prev.length
        streamingAssistantIndexRef.current = idx
        return [...prev, { role: "assistant", content: "", timestamp: new Date() }]
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      const flushChunk = (raw: string) => {
        // SSE frames are separated by double newlines
        const events = raw.split(/\n\n/)
        for (const evt of events) {
          const line = evt.trim()
          if (!line) continue
          // Expect lines like: data: {json}
          const match = line.match(/^data:\s*(.*)$/)
          if (!match) continue
          const payload = match[1]
          if (payload === "[DONE]") {
            return "done"
          }
          try {
            const json = JSON.parse(payload)
            const token =
              json.choices?.[0]?.delta?.content ??
              json.choices?.[0]?.message?.content ??
              json.content ??
              ""
            if (token) {
              setMessages((prev) => {
                const next = [...prev]
                const idx = streamingAssistantIndexRef.current ?? (next.length - 1)
                if (next[idx] && next[idx].role === "assistant") {
                  next[idx] = {
                    ...next[idx],
                    content: (next[idx].content || "") + token,
                  }
                }
                return next
              })
            }
          } catch (_) {
            // Ignore malformed frames
          }
        }
        return "more"
      }

      // Read the stream
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const status = flushChunk(buffer)
        if (status === "done") break
        // Keep last partial frame in buffer
        const lastSep = buffer.lastIndexOf("\n\n")
        if (lastSep !== -1) buffer = buffer.slice(lastSep + 2)
      }
      // Clear streaming index when finished
      streamingAssistantIndexRef.current = null
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: error instanceof Error ? `⚠️ ${error.message}` : "⚠️ Unknown error, check console.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (isConfigured) {
        handleSendMessage()
      }
    }
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'var(--background)' }}>
      <div className="container mx-auto max-w-5xl min-h-screen flex flex-col p-4 lg:p-6 relative">
        {/* Header */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}>
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-[var(--primary-text)]">
                    Simplo
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Assistant
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <Button
                    onClick={downloadChat}
                    size="sm"
                    variant="outline"
                    className="h-9 px-3 rounded-lg border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                    title="Download chat"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                )}
                <ThemeToggle />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Messages */}
        <Card className="flex-1 flex flex-col shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm min-h-0 chat-container">
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            <ScrollArea className="flex-1 p-6 scrollbar-thin min-h-0">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg" style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}>
                      <MessageSquare className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-[var(--primary-text)]">
                        Welcome to AI Assistant
                      </h3>
                      <p className="text-[var(--secondary-text)] max-w-md">
                        I'm your AI assistant. Ask me anything, upload images, or paste images from clipboard!
                      </p>
                      <div className="flex items-center justify-center gap-2 text-xs text-[var(--secondary-text)]">
                        <Clipboard className="h-3 w-3" />
                        <span>Ctrl+V to paste images</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}>
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
                          message.role === "user" 
                            ? "text-white" 
                            : "border"
                        }`}
                        style={
                          message.role === "user"
                            ? { background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }
                            : { background: 'var(--card)', color: 'var(--primary-text)', borderColor: 'var(--border)' }
                        }
                      >
                        <div className="space-y-3">
                          {message.image && (
                            <div className="mb-3">
                              <img 
                                src={message.image} 
                                alt="Uploaded image" 
                                className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                              />
                            </div>
                          )}
                          {message.role === "assistant" ? (
                            <div className="space-y-3">
                              <p className="whitespace-pre-wrap leading-relaxed text-sm" style={{ color: 'var(--primary-text)' }}>
                                {cleanMarkdown(message.content)}
                              </p>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--primary-text)' }}>{message.content}</p>
                          )}
                        </div>
                        <p className={`text-xs mt-3 ${message.role === "user" ? "text-blue-100" : ""}`} style={message.role === 'user' ? undefined : { color: 'var(--secondary-text)' }}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}>
                            <User className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-4 justify-start">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}>
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="rounded-2xl px-5 py-3 border" style={{ background: 'var(--card)', color: 'var(--primary-text)', borderColor: 'var(--border)' }}>
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'var(--secondary-text)' }}></div>
                          <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s", background: 'var(--secondary-text)' }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s", background: 'var(--secondary-text)' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50/50 dark:bg-slate-800/50">
              {showPasteHint && (
                <div className="mb-3 p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm flex items-center gap-2">
                  <Clipboard className="h-4 w-4" />
                  Image pasted from clipboard!
                </div>
              )}
              {selectedImage && (
                <div className="mb-3 relative inline-block">
                  <img 
                    src={selectedImage} 
                    alt="Selected image" 
                    className="max-w-32 h-auto rounded-lg max-h-24 object-cover"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  placeholder="Type your message or paste an image (Ctrl+V)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isLoading}
                  size="icon"
                  variant="outline"
                  className="h-12 w-12 rounded-xl border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  title="Upload image"
                >
                  <Image className="h-5 w-5" />
                </Button>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={(!input.trim() && !selectedImage) || isLoading} 
                  size="icon"
                  className="h-12 w-12 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--highlight))' }}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
