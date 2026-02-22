import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, MessageSquare, Send, Loader2, User, Clock } from 'lucide-react';
import api from '../../../lib/api';
import socket from '../../../lib/socket';

const AdminChatTab = () => {
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const queryClient = useQueryClient();
    const scrollRef = useRef(null);

    // 1. Get all chats
    const { data: chatsData, isLoading: isChatsLoading } = useQuery({
        queryKey: ['admin-chats'],
        queryFn: async () => {
            const { data } = await api.get('chat/admin/chats');
            return data; // { success, chats: [...], totalCount, ... }
        }
    });

    const chats = chatsData?.chats || [];

    // 2. Get messages for selected chat
    const { data: messagesData, isLoading: isMessagesLoading } = useQuery({
        queryKey: ['messages', selectedChatId],
        queryFn: async () => {
            const { data } = await api.get(`chat/${selectedChatId}/messages`);
            return data; // { success, messages: [...] }
        },
        enabled: !!selectedChatId,
    });

    const messages = messagesData?.messages || [];

    // 3. Socket Connection
    useEffect(() => {
        socket.connect();

        const handleNewMessage = (payload) => {
            // Update message list if it's the active chat
            queryClient.setQueryData(['messages', payload.chatId], (old) => {
                const oldMessages = old?.messages || [];
                return { ...old, messages: [...oldMessages, payload.message] };
            });

            // Also update the chat list to show recent message/alert
            queryClient.invalidateQueries({ queryKey: ['admin-chats'] });
        };

        socket.on('NEW_MESSAGE', handleNewMessage);
        socket.on('NEW_MESSAGE_ALERT', () => {
            queryClient.invalidateQueries({ queryKey: ['admin-chats'] });
        });

        return () => {
            socket.off('NEW_MESSAGE');
            socket.off('NEW_MESSAGE_ALERT');
            socket.disconnect();
        };
    }, [queryClient]);

    // Join/Leave rooms when changing selection
    useEffect(() => {
        if (selectedChatId) {
            socket.emit('JOIN_ROOM', { chatId: selectedChatId });
        }
        return () => {
            if (selectedChatId) {
                socket.emit('LEAVE_ROOM', { chatId: selectedChatId });
            }
        };
    }, [selectedChatId]);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, selectedChatId]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedChatId) return;

        const text = messageText.trim();

        // Optimistically add the message to the local cache so admin sees it immediately
        const optimisticMsg = {
            _id: `temp-${Date.now()}`,
            content: text,
            sender: { role: 'admin', Uname: 'You' },
            chat: selectedChatId,
            createdAt: new Date().toISOString(),
        };
        queryClient.setQueryData(['messages', selectedChatId], (old) => {
            const oldMessages = old?.messages || [];
            return { ...old, messages: [...oldMessages, optimisticMsg] };
        });

        socket.emit('NEW_MESSAGE', { chatId: selectedChatId, message: text });
        setMessageText('');
    };

    const filteredChats = chats.filter(chat =>
        chat.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Determine if a message is from admin
    const isAdminMessage = (msg) => {
        if (msg.sender && typeof msg.sender === 'object') {
            return msg.sender.role === 'admin';
        }
        return msg.sender === 'admin';
    };

    return (
        <div className="h-[calc(100vh-140px)] flex bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-200">
            {/* Sidebar: Chat List */}
            <div className="w-80 border-r border-zinc-100 flex flex-col bg-zinc-50/50">
                <div className="p-4 border-b border-zinc-100 bg-white">
                    <h2 className="text-lg font-black text-zinc-900 mb-4 flex items-center gap-2">
                        <MessageSquare size={20} className="text-indigo-600" />
                        Messages
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isChatsLoading ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-300" /></div>
                    ) : filteredChats.length === 0 ? (
                        <div className="text-center py-10 px-4">
                            <p className="text-zinc-400 text-sm">No conversations found</p>
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <button
                                key={chat._id}
                                onClick={() => setSelectedChatId(chat._id)}
                                className={`w-full p-4 flex gap-3 text-left hover:bg-white transition-colors border-b border-zinc-100 relative ${selectedChatId === chat._id ? 'bg-white border-l-4 border-l-indigo-600' : ''
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center flex-shrink-0">
                                    <User size={20} className="text-zinc-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-sm text-zinc-900 truncate">{chat.userName || 'Guest User'}</h3>
                                        <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                                            {chat.lastMessage?.createdAt
                                                ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : chat.updatedAt
                                                    ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                    : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 truncate">
                                        {chat.lastMessage
                                            ? `${chat.lastMessage.senderName || ''}: ${chat.lastMessage.content || ''}`
                                            : 'No messages yet'}
                                    </p>
                                </div>
                                {chat.unreadCount > 0 && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main: Chat View */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedChatId ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                    <User size={18} className="text-zinc-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-zinc-900">
                                        {chats.find(c => c._id === selectedChatId)?.userName || 'User'}
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active Now</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/30">
                            {isMessagesLoading ? (
                                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-300" /></div>
                            ) : (
                                messages.map((msg, i) => (
                                    <div key={msg._id || i} className={`flex ${isAdminMessage(msg) ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] group`}>
                                            <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isAdminMessage(msg)
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-white text-zinc-950 rounded-tl-none border border-zinc-100'
                                                }`}>
                                                {msg.content || msg.text}
                                            </div>
                                            <div className={`text-[10px] mt-1 text-zinc-400 flex items-center gap-1 ${isAdminMessage(msg) ? 'justify-end' : 'justify-start'}`}>
                                                <Clock size={10} />
                                                {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 border-t border-zinc-100 bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Reply to user..."
                                    className="flex-1 bg-zinc-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageText.trim()}
                                    className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                            <MessageSquare size={40} className="text-zinc-200" />
                        </div>
                        <h3 className="text-xl font-black text-zinc-900 mb-2">Your Inbox</h3>
                        <p className="text-zinc-500 max-w-xs">Select a conversation from the list to start replying to your customers.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatTab;
