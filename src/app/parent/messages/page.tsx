'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  User,
  Clock,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  SendHorizontal
} from 'lucide-react'
import { getChildrenByParentId } from '@/data/mock-data'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  content: string
  timestamp: Date
  isRead: boolean
  isFromParent: boolean
}

interface Contact {
  id: string
  name: string
  role: string
  avatar: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
}

export default function ParentMessagesPage() {
  const [selectedChild, setSelectedChild] = useState('1')
  const [selectedContact, setSelectedContact] = useState('1')
  const [messageText, setMessageText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const parentId = '2' // Mock parent ID
  
  const children = getChildrenByParentId(parentId)
  const currentChild = children.find(child => child.id === selectedChild)

  // Mock contacts (therapists and psychologists)
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Dr. Budi Santoso',
      role: 'Terapis',
      avatar: '/api/mock-avatars/therapist-1.jpg',
      lastMessage: 'Bagaimana perkembangan Ahmad hari ini?',
      lastMessageTime: new Date('2024-08-19T14:30:00'),
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Dr. Ani Pratiwi',
      role: 'Psikolog',
      avatar: '/api/mock-avatars/psychologist-1.jpg',
      lastMessage: 'Laporan sesi terakhir sudah saya review',
      lastMessageTime: new Date('2024-08-19T10:15:00'),
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      name: 'Dr. Rina Kartika',
      role: 'Terapis',
      avatar: '/api/mock-avatars/therapist-2.jpg',
      lastMessage: 'Jadwal sesi berikutnya sudah diatur',
      lastMessageTime: new Date('2024-08-18T16:45:00'),
      unreadCount: 1,
      isOnline: true
    }
  ]

  // Mock messages
  const messages: Message[] = [
    {
      id: '1',
      senderId: '1',
      senderName: 'Dr. Budi Santoso',
      senderRole: 'Terapis',
      content: 'Selamat pagi, Bu Sari. Bagaimana perkembangan Ahmad hari ini?',
      timestamp: new Date('2024-08-19T14:30:00'),
      isRead: true,
      isFromParent: false
    },
    {
      id: '2',
      senderId: 'parent',
      senderName: 'Sari Wijaya',
      senderRole: 'Orang Tua',
      content: 'Selamat pagi, Dok. Ahmad sudah mengerjakan tugas yang diberikan kemarin. Dia terlihat lebih fokus sekarang.',
      timestamp: new Date('2024-08-19T14:32:00'),
      isRead: true,
      isFromParent: true
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'Dr. Budi Santoso',
      senderRole: 'Terapis',
      content: 'Bagus sekali! Itu menunjukkan kemajuan yang signifikan. Apakah ada kesulitan dalam mengerjakan tugas tersebut?',
      timestamp: new Date('2024-08-19T14:35:00'),
      isRead: false,
      isFromParent: false
    },
    {
      id: '4',
      senderId: '1',
      senderName: 'Dr. Budi Santoso',
      senderRole: 'Terapis',
      content: 'Untuk sesi berikutnya, saya akan memberikan latihan yang sedikit lebih menantang.',
      timestamp: new Date('2024-08-19T14:36:00'),
      isRead: false,
      isFromParent: false
    }
  ]

  const currentContact = contacts.find(contact => contact.id === selectedContact)
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message via API
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
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Kemarin'
    } else {
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole="parent" />
      
      <div className="lg:ml-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesan</h1>
            <p className="text-gray-600">Komunikasi dengan terapis dan psikolog anak Anda</p>
          </div>

          {/* Child Selector */}
          {children.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Anak
              </label>
              <div className="flex flex-wrap gap-2">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child.id)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedChild === child.id
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {child.name} ({child.age} tahun)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Contacts List */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg h-full">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Kontak</CardTitle>
                      <CardDescription>Terapis dan psikolog</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Search */}
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Cari kontak..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 hover:border-purple-400 transition-colors"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {filteredContacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => setSelectedContact(contact.id)}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedContact === contact.id
                            ? 'bg-purple-50 border-r-2 border-purple-500'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium">
                              {contact.name.charAt(0)}
                            </div>
                            {contact.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900 truncate">{contact.name}</h4>
                              <span className="text-xs text-gray-500">{formatTime(contact.lastMessageTime)}</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{contact.role}</p>
                            <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                          </div>
                          
                          {contact.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-medium">{contact.unreadCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg h-full flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium">
                          {currentContact?.name.charAt(0)}
                        </div>
                        {currentContact?.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{currentContact?.name}</h3>
                        <p className="text-sm text-gray-600">{currentContact?.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromParent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isFromParent
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium opacity-75">
                            {message.senderName}
                          </span>
                          <span className="text-xs opacity-75">
                            {message.timestamp.toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        {message.isFromParent && (
                          <div className="flex justify-end mt-1">
                            {message.isRead ? (
                              <CheckCheck className="w-3 h-3 opacity-75" />
                            ) : (
                              <Check className="w-3 h-3 opacity-75" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ketik pesan..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500 resize-none"
                        rows={1}
                        style={{ minHeight: '40px', maxHeight: '120px' }}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      <SendHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Aksi Cepat</CardTitle>
              <CardDescription>Fitur komunikasi tambahan</CardDescription>
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
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm">Kirim Foto</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Paperclip className="w-5 h-5" />
                  <span className="text-sm">Kirim File</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
