"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Clock, Trash2, Edit3, Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface ChatPreview {
  _id: string
  title: string
  createdAt: string
  updatedAt: string
  messageCount: number
  preview: string
}

export default function SimploChatHistory() {
  const [chats, setChats] = useState<ChatPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchChats()
    
    // Listen for chat updates from other components
    const handleChatUpdate = () => {
      fetchChats()
    }
    
    window.addEventListener('simplo-chat-updated', handleChatUpdate)
    
    return () => {
      window.removeEventListener('simplo-chat-updated', handleChatUpdate)
    }
  }, [])

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

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
      setLoading(false)
    }
  }

  const handleEditTitle = async (chatId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/simplo-chats/${chatId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: editingTitle })
      })

      if (response.ok) {
        setChats(prev => prev.map(chat => 
          chat._id === chatId ? { ...chat, title: editingTitle } : chat
        ))
        setEditingChatId(null)
        setEditingTitle("")
      }
    } catch (error) {
      console.error('Error updating chat title:', error)
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return

    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/simplo-chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setChats(prev => prev.filter(chat => chat._id !== chatId))
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Simplo Chats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[var(--secondary-text)]">
            Loading chats...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Simplo Chats
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchChats}
            className="text-[var(--accent)] hover:bg-[var(--shadow)]"
          >
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chats.length === 0 ? (
          <div className="text-center py-8 text-[var(--secondary-text)]">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No chats yet</p>
            <Button 
              onClick={() => router.push('/simplo')}
              className="mt-4"
            >
              Start Your First Chat
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  className="p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--shadow)] transition-colors cursor-pointer"
                  onClick={() => router.push(`/simplo?chatId=${chat._id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {editingChatId === chat._id ? (
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded px-2 py-1 text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && handleEditTitle(chat._id)}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleEditTitle(chat._id)}
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-[var(--primary-text)] truncate">
                            {chat.title}
                          </h3>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingChatId(chat._id)
                              setEditingTitle(chat.title)
                            }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      
                      <p className="text-sm text-[var(--secondary-text)] mb-2 line-clamp-2">
                        {chat.preview}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-[var(--secondary-text)]">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {chat.messageCount} messages
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(chat.updatedAt)}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteChat(chat._id)
                      }}
                      className="text-red-500 hover:text-[var(--destructive)] hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
} 