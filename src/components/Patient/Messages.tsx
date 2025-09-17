import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Users, Clock, Check, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/service/api';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  senderType: string;
  receiverType: string;
  isRead: boolean;
  createdAt: string;
  senderName: string;
  receiverName: string;
}

interface Conversation {
  participantId: string;
  participantName: string;
  participantType: string;
  lastMessage: Message | null;
  unreadCount: number;
}

interface MessagesProps {
  patientId: string;
}

const Messages: React.FC<MessagesProps> = ({ patientId: propPatientId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get patient ID from props or localStorage
  const patientId = propPatientId || localStorage.getItem("userId");

  useEffect(() => {
    if (patientId) {
      loadConversations();
      initializeSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [patientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    console.log('Initializing socket with patientId:', patientId);
    console.log('Token from localStorage:', localStorage.getItem('token'));
    
    const newSocket = io('http://localhost:3000', {
      auth: {
        token: localStorage.getItem('token'),
        userId: patientId
      }
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to messages socket');
      console.log('Socket ID:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    newSocket.on('new_message', (message: Message) => {
      console.log('Received new_message via WebSocket:', message);
      console.log('Current selectedConversation:', selectedConversation);
      console.log('Message senderId:', message.senderId);
      console.log('Message receiverId:', message.receiverId);
      
      if (selectedConversation && 
          (message.senderId === selectedConversation || message.receiverId === selectedConversation)) {
        console.log('Adding message to chat');
        setMessages(prev => [...prev, message]);
      } else {
        console.log('Message not for current conversation, ignoring');
      }
      
      // Update conversations list
      loadConversations();
    });

    newSocket.on('message_read', (data: { messageId: string; readAt: Date }) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === data.messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    setSocket(newSocket);
  };

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const response = await api.get(`/messages/conversations?userId=${patientId}&userType=patient`);
      console.log('API Response:', response.data);
      setConversations(response.data.data.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadMessages = async (participantId: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/messages/conversation?otherParticipantId=${participantId}`);
      console.log('Messages API Response:', response.data);
      setMessages(response.data.data.messages || []);
      
      // Mark messages as read
      const messages = response.data.data.messages || [];
      const unreadMessages = messages.filter((msg: Message) => 
        msg.receiverId === patientId && !msg.isRead
      );
      
      if (unreadMessages.length > 0) {
        await api.put('/messages/read-all', { senderId: participantId });
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !socket) return;

    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

    try {
      const messageData = {
        content: messageContent,
        receiverId: selectedConversation,
        senderType: 'patient',
        receiverType: 'doctor'
      };

      // Send via API to save to database
      const response = await api.post('/messages', messageData);
      console.log('Message sent via API:', response.data);

      // Add message to local state immediately for better UX
      const newMessage = {
        id: response.data.data.id,
        content: messageContent,
        senderId: patientId,
        receiverId: selectedConversation,
        senderType: 'patient',
        receiverType: 'doctor',
        isRead: false,
        createdAt: new Date(response.data.data.createdAt),
        updatedAt: new Date(response.data.data.updatedAt),
        senderName: response.data.data.senderName,
        receiverName: response.data.data.receiverName
      };
      
      setMessages(prev => [...prev, newMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Restore message if sending failed
      setNewMessage(messageContent);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!patientId) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p>Patient ID is required to access messages</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex-1 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[625px]">
          {/* Conversations List */}
          <Card className="bg-gray-800 border-gray-700 flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Doctors
              </CardTitle>
              <p className="text-gray-400 text-sm">Showing all doctors for testing</p>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto max-h-[500px]">
                {isLoadingConversations ? (
                  <div className="p-4 text-center text-gray-400">
                    <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
                    <p>Loading conversations...</p>
                  </div>
                ) : !conversations || conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.participantId}
                      className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
                        selectedConversation === conversation.participantId ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => {
                        setSelectedConversation(conversation.participantId);
                        loadMessages(conversation.participantId);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-green-500 text-white">
                            {getInitials(conversation.participantName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-medium truncate">
                                {conversation.participantName}
                              </h3>
                              <Badge className="bg-green-500 text-white text-xs">
                                Doctor
                              </Badge>
                            </div>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm truncate">
                            {conversation.lastMessage?.content || 'Start a conversation...'}
                          </p>
                          {conversation.lastMessage ? (
                            <p className="text-gray-500 text-xs">
                              {formatTime(conversation.lastMessage.createdAt)}
                            </p>
                          ) : (
                            <p className="text-gray-500 text-xs">
                              Click to start messaging
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Messages Area */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700 h-full flex flex-col">
              {selectedConversation ? (
                <>
                  <CardHeader className="border-b border-gray-700 flex-shrink-0">
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      {conversations.find(c => c.participantId === selectedConversation)?.participantName}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[437px]">
                      {isLoading ? (
                        <div className="text-center text-gray-400">
                          <Clock className="h-6 w-6 mx-auto mb-2 animate-spin" />
                          Loading messages...
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center text-gray-400">
                          <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                          <p>No messages yet. Start a conversation!</p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === patientId ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.senderId === patientId
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-700 text-white'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <span className="text-xs opacity-70">
                                  {formatTime(message.createdAt)}
                                </span>
                                {message.senderId === patientId && (
                                  <div className="ml-1">
                                    {message.isRead ? (
                                      <CheckCheck className="h-3 w-3 text-green-300" />
                                    ) : (
                                      <Check className="h-3 w-3 text-gray-400" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-gray-700 p-4 flex-shrink-0">
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
