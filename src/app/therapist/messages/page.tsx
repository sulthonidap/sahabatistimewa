'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  MessageSquare,
  Send,
  Search,
  Filter,
  User,
  Clock,
  Check,
  CheckCheck,
  MoreVertical,
  Paperclip,
  Smile,
  Phone,
  Video,
  Mail,
  Archive,
  Trash2,
  Star,
  StarOff
} from 'lucide-react'
import { mockChildren, mockUsers } from '@/data/mock-data'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  isRead: boolean
  type: 'text' | 'image' | 'file'
  attachments?: string[]
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantRole: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
  avatar?: string
}

export default function TherapistMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [messageText, setMessageText] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const therapistId = '3' // Mock therapist ID

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: '1',
      participantId: '1',
      participantName: 'Ibu Sarah Wijaya',
      participantRole: 'Parent',
      lastMessage: 'Bagaimana progress Ahmad hari ini?',
      lastMessageTime: new Date('2024-08-19T14:30:00'),
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      participantId: '2',
      participantName: 'Bapak Nurhaliza',
      participantRole: 'Parent',
      lastMessage: 'Terima kasih atas laporan terapi Siti',
      lastMessageTime: new Date('2024-08-19T12:15:00'),
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      participantId: '4',
      participantName: 'Dr. Budi Santoso',
      participantRole: 'Psychologist',
      lastMessage: 'Mari kita diskusikan kasus Ahmad',
      lastMessageTime: new Date('2024-08-19T10:45:00'),
      unreadCount: 1,
      isOnline: true
    },
    {
      id: '4',
      participantId: '5',
      participantName: 'Ibu Rina Putri',
      participantRole: 'Parent',
      lastMessage: 'Kapan jadwal terapi berikutnya?',
      lastMessageTime: new Date('2024-08-18T16:20:00'),
      unreadCount: 0,
      isOnline: false
    }
  ]

  // Mock messages
  const messages: Message[] = [
    {
      id: '1',
      senderId: '1',
      receiverId: '3',
      content: 'Selamat pagi, bagaimana progress Ahmad hari ini?',
      timestamp: new Date('2024-08-19T14:30:00'),
      isRead: true,
      type: 'text'
    },
    {
      id: '2',
      senderId: '3',
      receiverId: '1',
      content: 'Selamat pagi Ibu Sarah. Ahmad menunjukkan kemajuan yang baik dalam sesi terapi hari ini. Kemampuan motorik halusnya sudah meningkat.',
      timestamp: new Date('2024-08-19T14:32:00'),
      isRead: true,
      type: 'text'
    },
    {
      id: '3',
      senderId: '1',
      receiverId: '3',
      content: 'Wah bagus sekali! Apakah ada latihan khusus yang bisa dilakukan di rumah?',
      timestamp: new Date('2024-08-19T14:35:00'),
      isRead: false,
      type: 'text'
    },
    {
      id: '4',
      senderId: '1',
      receiverId: '3',
      content: 'Saya sudah mengirim foto latihan yang Ahmad lakukan kemarin',
      timestamp: new Date('2024-08-19T14:36:00'),
      isRead: false,
      type: 'text'
    }
  ]

  // Filter conversations
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.participantName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || conversation.participantRole.toLowerCase() === filterRole.toLowerCase()
    return matchesSearch && matchesRole
  })

  // Get current conversation
  const currentConversation = conversations.find(c => c.id === selectedConversation)
  const currentMessages = selectedConversation ? messages.filter(m => 
    (m.senderId === selectedConversation && m.receiverId === therapistId) ||
    (m.senderId === therapistId && m.receiverId === selectedConversation)
  ) : []

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      // In a real app, this would send the message to the server
      console.log('Sending message:', messageText)
      setMessageText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Baru saja'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} jam yang lalu`
    } else {
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short' 
      })
    }
  }

  const getUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="therapist" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesan</h1>
            <p className="text-gray-600">Komunikasi dengan orang tua dan tim terapi</p>
          </div>

          {/* Messages Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Percakapan</CardTitle>
                      <CardDescription>
                        {getUnreadCount()} pesan belum dibaca
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Search and Filter */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Cari percakapan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter peran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="parent">Orang Tua</SelectItem>
                        <SelectItem value="psychologist">Psikolog</SelectItem>
                        <SelectItem value="therapist">Terapis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="space-y-1 max-h-[calc(100vh-350px)] overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Tidak ada percakapan ditemukan</p>
                      </div>
                    ) : (
                      filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-4 cursor-pointer transition-colors ${
                            selectedConversation === conversation.id
                              ? 'bg-purple-50 border-r-2 border-purple-500'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedConversation(conversation.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-purple-600" />
                              </div>
                              {conversation.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {conversation.participantName}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {formatTime(conversation.lastMessageTime)}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600 truncate">
                                  {conversation.lastMessage}
                                </p>
                                {conversation.unreadCount > 0 && (
                                  <span className="ml-2 bg-purple-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                    {conversation.unreadCount}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400">
                                  {conversation.participantRole}
                                </span>
                                {conversation.isOnline && (
                                  <span className="text-xs text-green-600">Online</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg h-full flex flex-col">
                {selectedConversation && currentConversation ? (
                  <>
                    {/* Chat Header */}
                    <CardHeader className="border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-purple-600" />
                            </div>
                            {currentConversation.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {currentConversation.participantName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {currentConversation.participantRole}
                              {currentConversation.isOnline && (
                                <span className="ml-2 text-green-600">• Online</span>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Video className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Messages */}
                    <CardContent className="flex-1 p-0 overflow-hidden">
                      <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {currentMessages.length === 0 ? (
                            <div className="text-center py-8">
                              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500">Belum ada pesan</p>
                              <p className="text-sm text-gray-400">Mulai percakapan dengan mengirim pesan</p>
                            </div>
                          ) : (
                            currentMessages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.senderId === therapistId ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                    message.senderId === therapistId
                                      ? 'bg-purple-500 text-white'
                                      : 'bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <div className={`flex items-center justify-between mt-1 text-xs ${
                                    message.senderId === therapistId ? 'text-purple-100' : 'text-gray-500'
                                  }`}>
                                    <span>{message.timestamp.toLocaleTimeString('id-ID', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}</span>
                                    {message.senderId === therapistId && (
                                      <span>
                                        {message.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Message Input */}
                        <div className="border-t border-gray-200 p-4">
                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <Textarea
                                placeholder="Ketik pesan..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                rows={1}
                                className="resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Paperclip className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Smile className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={handleSendMessage}
                                disabled={!messageText.trim()}
                                className="bg-purple-500 hover:bg-purple-600 text-white"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Pilih Percakapan
                      </h3>
                      <p className="text-gray-500">
                        Pilih percakapan dari daftar untuk mulai mengirim pesan
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Aksi Cepat</CardTitle>
              <CardDescription>Fitur-fitur untuk komunikasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">Panggilan Suara</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Video className="w-5 h-5" />
                  <span className="text-sm">Video Call</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">Kirim Email</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Archive className="w-5 h-5" />
                  <span className="text-sm">Arsip Pesan</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
