"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Sparkles, MessageSquare, Image, X, Download, Plus, Trash2, Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AnimatedText } from "@/components/AnimatedText"
import { useTheme } from "next-themes"
import ResponseLinksCard from "../../components/ResponseLinksCard"

// Function to clean markdown formatting from AI responses
const cleanMarkdown = (text: string): string => {
  return text
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*_]{3,}$/gm, '')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  image?: string
}

export default function SimploPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [chats, setChats] = useState<any[]>([])
  const [isLoadingChats, setIsLoadingChats] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false) // Start closed on mobile
  const [animatingMessages, setAnimatingMessages] = useState<Set<number>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  // Check if device is mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setSidebarOpen(window.innerWidth >= 768) // Auto-open sidebar on desktop
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Check authentication on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
          try {
            const payload = token.split('.')[1]
            const decoded = JSON.parse(atob(payload))
            if (decoded.exp && Date.now() < decoded.exp * 1000) {
              setIsAuthenticated(true)
              setUserId(decoded.userId || decoded.user?.id)
            } else {
              localStorage.removeItem('token')
              setIsAuthenticated(false)
            }
          } catch {
            localStorage.removeItem('token')
            setIsAuthenticated(false)
          }
        } else {
          setIsAuthenticated(false)
        }
      }
      setIsLoadingAuth(false)
    }

    checkAuth()
  }, [])

  // Load chats and create new chat when component mounts and user is authenticated
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    if (isAuthenticated && !isLoadingAuth) {
      fetchChats()
      
      const urlParams = new URLSearchParams(window.location.search)
      const chatIdFromUrl = urlParams.get('chatId')
      
      if (chatIdFromUrl) {
        loadExistingChat(chatIdFromUrl)
      } else if (!currentChatId) {
        createNewChat()
      }
    }
  }, [isAuthenticated, isLoadingAuth])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchChats = async () => {
    try {
      setIsLoadingChats(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/simplo-chats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setChats(data)
      }
    } catch (error) {
      console.error('Error fetching chats:', error)
    } finally {
      setIsLoadingChats(false)
    }
  }

  const loadExistingChat = async (chatId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/simplo/chats/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const chat = await response.json()
        setCurrentChatId(chat._id)
        setMessages(chat.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          image: msg.image || undefined
        })))
      } else {
        createNewChat()
      }
    } catch (error) {
      console.error('Error loading chat:', error)
      createNewChat()
    }
  }

  const createNewChat = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/simplo-chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'New Chat'
        })
      })
      
      if (response.ok) {
        const chat = await response.json()
        setCurrentChatId(chat._id)
        setMessages([])
        window.history.replaceState({}, '', '/simplo')
        fetchChats()
        window.dispatchEvent(new CustomEvent('simplo-chat-updated'))
      }
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }

  const handleChatSelect = async (chatId: string) => {
    if (chatId === currentChatId) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/simplo/chats/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const chat = await response.json()
        setCurrentChatId(chat._id)
        setMessages(chat.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          image: msg.image || undefined
        })))
        window.history.replaceState({}, '', `/simplo?chatId=${chatId}`)
        
        // Close sidebar on mobile after selecting chat
        if (isMobile) {
          setSidebarOpen(false)
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error)
    }
  }

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this chat?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/simplo/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        if (chatId === currentChatId) {
          createNewChat()
        }
        fetchChats()
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const formatChatTitle = (title: string) => {
    return title.length > 25 ? title.substring(0, 25) + '...' : title
  }

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
      const response = await fetch("/api/simplo-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
            image: msg.image,
          })),
          chatId: currentChatId,
          userId: userId,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(typeof err.error === "string" ? err.error : JSON.stringify(err.error, null, 2))
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setAnimatingMessages(prev => new Set([...prev, messages.length]))
      await fetchChats()
      window.dispatchEvent(new CustomEvent('simplo-chat-updated'))
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
      handleSendMessage()
    }
  }

  // Show loading state while checking authentication
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl mb-4 animate-pulse">
            <Bot className="h-8 w-8 text-[var(--card-foreground)]" />
          </div>
          <p className="text-[var(--muted-foreground)] font-medium">Loading Simplo...</p>
        </div>
      </div>
    )
  }

  // Show authentication required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-[var(--card)]/10 backdrop-blur-xl border-[#00F5D4]/30 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl mb-6">
              <Bot className="h-10 w-10 text-[var(--card-foreground)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--card-foreground)] mb-4">
              Welcome to Simplo
            </h2>
            <p className="text-[var(--muted-foreground)] mb-6 leading-relaxed">
              Your AI chess assistant is ready to help! Please sign in to start chatting.
            </p>
            <Button 
              onClick={() => window.location.href = '/login'} 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-[var(--card-foreground)] px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      {isMobile && (
        <div className={`md:hidden p-4 ${
          theme === 'light' 
            ? 'bg-[var(--card)] border-b border-[#E5E7EB]' 
            : 'bg-[var(--card)]/5 backdrop-blur-xl border-b border-[var(--border)]/10'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                theme === 'light' 
                  ? 'bg-gradient-to-r from-[#D97706] to-[#F59E0B]' 
                  : 'bg-gradient-to-br from-purple-500 to-blue-500'
              }`}>
                <Bot className="h-5 w-5 text-[var(--card-foreground)]" />
              </div>
              <span className={`text-lg font-bold ${
                theme === 'light' ? 'text-[#1A1A1A]' : 'text-[var(--accent-foreground)]'
              }`}>Simplo</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`${
                theme === 'light' 
                  ? 'text-[#1A1A1A] hover:bg-[#F3F4F6]' 
                  : 'text-[var(--accent-foreground)] hover:bg-[var(--card)]/10'
              }`}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-h-0 h-[calc(100vh-64px)]">
        {/* Sidebar - Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className={`absolute left-0 top-0 h-full w-80 border-r bg-[var(--card)] border-[var(--border)]`}>
              <div className="p-4 border-b border-[var(--border)]/10 flex items-center justify-between">
                <h2 className="font-bold text-[var(--card-foreground)]">Chats</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSidebarOpen(false)}
                  className="text-[var(--muted-foreground)] hover:text-[var(--card-foreground)] hover:bg-[var(--card)]/10 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-80px)]">
                {isLoadingChats ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-[var(--muted-foreground)] text-sm mt-2">Loading chats...</p>
                  </div>
                ) : chats.length === 0 ? (
                  <div className="p-4 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-[var(--muted-foreground)]" />
                    <p className="text-[var(--muted-foreground)] text-sm">No chats yet</p>
                    <Button
                      size="sm"
                      onClick={createNewChat}
                      className="mt-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-[var(--card-foreground)]"
                    >
                      Start Chat
                    </Button>
                  </div>
                ) : (
                  <div className="p-2">
                    {chats.map((chat) => (
                      <div
                        key={chat._id}
                        className={`p-3 rounded-xl cursor-pointer transition-all duration-200 mb-2 group ${
                          currentChatId === chat._id
                            ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30'
                            : 'hover:bg-[var(--card)]/5 border border-transparent'
                        }`}
                        onClick={() => handleChatSelect(chat._id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate text-sm text-[var(--card-foreground)]">
                              {formatChatTitle(chat.title)}
                            </h3>
                            <p className="text-xs text-[var(--muted-foreground)] truncate mt-1">
                              {chat.preview}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                              <span>{chat.messageCount} messages</span>
                              <span>•</span>
                              <span>{new Date(chat.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleDeleteChat(chat._id, e)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:bg-[var(--destructive)]/20 rounded-lg"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="absolute bottom-4 left-4 right-4">
                <Button
                  onClick={createNewChat}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-[var(--card-foreground)] rounded-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className={`hidden md:block ${sidebarOpen ? 'w-80' : 'w-20'} transition-all duration-300 flex flex-col min-h-0 bg-[var(--card)] border-r border-[var(--border)]`}>
          {/* Sidebar Header */}
          <div className={`p-4 flex items-center justify-between border-b border-[var(--border)]`}>
            {sidebarOpen && (
              <h2 className={`font-semibold text-[var(--card-foreground)]`}>Chats</h2>
            )}
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={createNewChat}
                className={`rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90`}
                title="New Chat"
              >
                <Plus className="h-4 w-4" />
                {sidebarOpen && <span className="ml-2">New</span>}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`rounded-lg text-[var(--muted-foreground)] hover:text-[var(--card-foreground)] hover:bg-[var(--card)]/10`}
                title={sidebarOpen ? "Collapse" : "Expand"}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1 min-h-0">
            {isLoadingChats ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-[var(--muted-foreground)] text-sm mt-2">Loading chats...</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-[var(--muted-foreground)]" />
                <p className="text-[var(--muted-foreground)] text-sm">No chats yet</p>
                <Button
                  size="sm"
                  onClick={createNewChat}
                  className="mt-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-[var(--card-foreground)]"
                >
                  Start Chat
                </Button>
              </div>
            ) : (
              <div className="p-2">
                {chats.map((chat) => (
                  <div
                    key={chat._id}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 mb-2 group ${
                      currentChatId === chat._id
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30'
                        : 'hover:bg-[var(--card)]/5 border border-transparent'
                    }`}
                    onClick={() => handleChatSelect(chat._id)}
                  >
                    <div className="flex items-start justify-between">
                      {sidebarOpen && (
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate text-sm text-[var(--card-foreground)]">
                            {formatChatTitle(chat.title)}
                          </h3>
                          <p className="text-xs text-[var(--muted-foreground)] truncate mt-1">
                            {chat.preview}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-[var(--muted-foreground)]">
                            <span>{chat.messageCount} messages</span>
                            <span>•</span>
                            <span>{new Date(chat.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                      {sidebarOpen && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleDeleteChat(chat._id, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:bg-[var(--destructive)]/20 rounded-lg"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-2 md:p-4 min-h-0">
            {/* Chat Header */}
            <div className="mb-4 md:mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg ${
                    theme === 'light' 
                      ? 'bg-gradient-to-r from-[#D97706] to-[#F59E0B]' 
                      : 'bg-gradient-to-br from-purple-500 to-blue-500'
                  }`}>
                    <Bot className="h-5 w-5 md:h-6 md:w-6 text-[var(--card-foreground)]" />
                  </div>
                  <div>
                    <h1 className={`text-lg md:text-2xl font-bold bg-gradient-to-r from-[#00F5D4] to-[#57CC99] bg-clip-text text-transparent`}>Simplo AI Assistant</h1>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] border border-[hsl(var(--border))]/40` }>
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Assistant
                      </Badge>
                    </div>
                  </div>
                </div>
                {messages.length > 0 && (
                  <Button
                    onClick={downloadChat}
                    variant="outline"
                    size="sm"
                    className={`text-xs border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--card)]/10 hover:text-[var(--card-foreground)]`}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Export Chat</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <Card className={`flex-1 min-h-0 shadow-2xl border bg-[var(--card)] border-[var(--border)]`}>
              <CardContent className="p-0 h-full min-h-0 flex flex-col">
                <ScrollArea className="flex-1 min-h-0 p-3 md:p-6 max-h-full">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-4 md:space-y-6 max-w-md px-4">
                        <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mx-auto shadow-2xl ${
                          theme === 'light' 
                            ? 'bg-gradient-to-r from-[#D97706] to-[#F59E0B] shadow-lg' 
                            : 'bg-gradient-to-br from-purple-500 to-blue-500'
                        }`}>
                          <MessageSquare className="h-8 w-8 md:h-12 md:w-12 text-[var(--card-foreground)] drop-shadow-sm" />
                        </div>
                        <div className="space-y-2 md:space-y-3">
                          <h3 className={`text-lg md:text-xl font-bold bg-gradient-to-r from-[#00F5D4] to-[#57CC99] bg-clip-text text-transparent`}>
                            Welcome to Simplo AI Assistant
                          </h3>
                          <p className={`leading-relaxed text-sm md:text-base ${
                            theme === 'light' ? 'text-[#666666]' : 'text-[var(--muted-foreground)]'
                          }`}>
                            I'm your chess learning assistant! Ask me about our bots, courses, puzzles, grandmasters, or any chess-related questions. I can also help with images and general queries.
                          </p>
                          <div className={`flex items-center justify-center space-x-2 text-xs md:text-sm ${
                            theme === 'light' ? 'text-[#666666]' : 'text-[var(--muted-foreground)]'
                          }`}>
                            <span>💡</span>
                            <span>Try asking: "What are the best opening moves for beginners?"</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 md:space-y-6">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-2 md:gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.role === "assistant" && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Bot className="h-4 w-4 md:h-5 md:w-5 text-[var(--card-foreground)]" />
                              </div>
                            </div>
                          )}
                          <div
                            className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-3 py-3 md:px-6 md:py-4 shadow-lg ${
                              message.role === "user"
                                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                                : "bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)]"
                            }`}
                          >
                            <div className="space-y-2 md:space-y-3">
                              {message.image && (
                                <div className="mb-3">
                                  <img 
                                    src={message.image} 
                                    alt="Uploaded image" 
                                    className="max-w-full h-auto rounded-lg max-h-48 md:max-h-64 object-cover shadow-lg"
                                  />
                                </div>
                              )}
                              {message.role === "assistant" ? (
                                <div className="space-y-2 md:space-y-3">
                                  {animatingMessages.has(index) ? (
                                    <AnimatedText 
                                      text={cleanMarkdown(message.content)} 
                                      speed={20}
                                      className="leading-relaxed text-[var(--card-foreground)] text-sm md:text-base"
                                      onComplete={() => {
                                        setAnimatingMessages(prev => {
                                          const newSet = new Set(prev)
                                          newSet.delete(index)
                                          return newSet
                                        })
                                      }}
                                    />
                                  ) : (
                                    cleanMarkdown(message.content).split('\n\n').map((paragraph, idx) => {
                                      if (!paragraph.trim()) return null;
                                      return (
                                        <p key={idx} className="leading-relaxed text-[var(--card-foreground)] text-sm md:text-base">
                                          {paragraph}
                                        </p>
                                      );
                                    })
                                  )}
                                  {/* Response Links Card */}
                                  <ResponseLinksCard content={message.content} theme={theme} />
                                </div>
                              ) : (
                                <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{message.content}</p>
                              )}
                            </div>
                            <p className={`text-xs mt-2 md:mt-3 text-[hsl(var(--muted-foreground))]`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {message.role === "user" && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                                <User className="h-4 w-4 md:h-5 md:w-5 text-[hsl(var(--card-foreground))]" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-2 md:gap-4 justify-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                              <Bot className="h-4 w-4 md:h-5 md:w-5 text-[var(--card-foreground)]" />
                            </div>
                          </div>
                          <div className="bg-[var(--card)]/10 backdrop-blur-xl rounded-2xl px-3 py-3 md:px-6 md:py-4 border border-[var(--border)]/20">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Input Area */}
                <div className={`p-3 md:p-6 border-t border-[hsl(var(--border))] bg-[hsl(var(--card))]`}>
                  {selectedImage && (
                    <div className="mb-3 md:mb-4 relative inline-block">
                      <img 
                        src={selectedImage} 
                        alt="Selected image" 
                        className="max-w-24 md:max-w-32 h-auto rounded-lg max-h-20 md:max-h-24 object-cover shadow-lg"
                      />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -top-1 -right-1 md:-top-2 md:-right-2 h-5 w-5 md:h-6 md:w-6 rounded-full shadow-lg"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2 md:gap-3">
                    <Input
                      ref={inputRef}
                      placeholder="Ask about chess bots, courses, puzzles, grandmasters, or anything chess-related..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className={`flex-1 h-10 md:h-12 rounded-xl transition-all duration-200 text-sm md:text-base border border-[hsl(var(--border))] bg-[hsl(var(--card))] focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--ring))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]`}
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
                      variant="outline"
                      size="icon"
                      className={`h-10 w-10 md:h-12 md:w-12 rounded-xl transition-all duration-200 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]/40 hover:text-[hsl(var(--foreground))]`}
                      title="Upload image"
                    >
                      <Image className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={(!input.trim() && !selectedImage) || isLoading} 
                      size="icon"
                      className={`h-10 w-10 md:h-12 md:w-12 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90`}
                    >
                      <Send className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}