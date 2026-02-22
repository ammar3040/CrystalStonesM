import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, X, Loader2, Clock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import socket from '../../lib/socket';
import { useAuth } from '../../context/AuthContext';

const ChatPopup = () => {
    const { isLoggedIn, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const queryClient = useQueryClient();
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    // 1. Get Chat ID (Initialize Chat)
    const { data: chatData, isLoading: isChatLoading, isError: isChatError } = useQuery({
        queryKey: ['chat-id'],
        queryFn: async () => {
            const { data } = await api.get('/api/chat/help-center');
            return data;
        },
        enabled: isOpen && isLoggedIn,
        retry: 1,
    });

    const chatId = chatData?.chat?._id;

    // 2. Get Messages History
    const { data: messagesData, isLoading: isMessagesLoading } = useQuery({
        queryKey: ['messages', chatId],
        queryFn: async () => {
            const { data } = await api.get(`/api/chat/${chatId}/messages`);
            return data;
        },
        enabled: !!chatId,
    });

    const messages = messagesData?.messages || [];

    // 3. Socket Connection & Subscription
    useEffect(() => {
        if (!chatId) return;

        socket.connect();
        socket.emit('JOIN_ROOM', { chatId });

        const handleNewMessage = (payload) => {
            if (payload.chatId === chatId) {
                queryClient.setQueryData(['messages', chatId], (old) => {
                    const oldMessages = old?.messages || [];
                    return { ...old, messages: [...oldMessages, payload.message] };
                });
            }
        };

        socket.on('NEW_MESSAGE', handleNewMessage);

        return () => {
            socket.emit('LEAVE_ROOM', { chatId });
            socket.off('NEW_MESSAGE', handleNewMessage);
            socket.disconnect();
        };
    }, [chatId, queryClient]);

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    // Auto-focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, chatId]);

    // 4. Send Message Mutation
    const sendMessageMutation = useMutation({
        mutationFn: async (text) => {
            // Optimistically add user's own message to the cache
            const optimisticMsg = {
                _id: `temp-${Date.now()}`,
                content: text,
                sender: { role: 'user', Uname: 'You' },
                chat: chatId,
                createdAt: new Date().toISOString(),
            };
            queryClient.setQueryData(['messages', chatId], (old) => {
                const oldMessages = old?.messages || [];
                return { ...old, messages: [...oldMessages, optimisticMsg] };
            });

            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    resolve({ status: 'sent_without_ack' });
                }, 3000);

                socket.emit('NEW_MESSAGE', { chatId, message: text }, (ack) => {
                    clearTimeout(timeout);
                    if (ack && ack.error) {
                        reject(new Error(ack.error));
                    } else if (ack && ack.status === 'rate_limit') {
                        reject(new Error('Rate limit exceeded. Please wait.'));
                    } else {
                        resolve(ack);
                    }
                });
            });
        },
        onMutate: () => {
            setMessage('');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to send message');
        }
    });

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim() || !chatId) return;
        sendMessageMutation.mutate(message);
    };

    // Listen for custom toggle event from WhatsApp button
    useEffect(() => {
        const toggleChat = () => setIsOpen(prev => !prev);
        window.addEventListener('TOGGLE_CHAT', toggleChat);
        return () => window.removeEventListener('TOGGLE_CHAT', toggleChat);
    }, []);

    // Determine if message is from current user (not admin)
    const isUserMessage = (msg) => {
        if (msg.sender && typeof msg.sender === 'object') {
            return msg.sender.role !== 'admin';
        }
        return msg.sender === 'user';
    };

    // Format timestamp
    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    // Group messages by date
    const getDateLabel = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-6 sm:right-10 z-[100] font-sans">
            <div
                className="bg-white w-[340px] sm:w-[380px] h-[520px] max-h-[80vh] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden border border-gray-200/50"
                style={{ animation: 'chatSlideUp 0.3s ease-out' }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 text-white flex justify-between items-center relative overflow-hidden">
                    {/* Subtle pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-black text-sm border border-white/30">
                            CS
                        </div>
                        <div>
                            <h3 className="font-bold text-sm leading-none m-0 flex items-center gap-1.5">
                                Crystal Stones Mart
                                <ShieldCheck size={14} className="text-white/80" />
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                                <p className="text-[10px] opacity-90 mb-0 font-medium">typically replies in 5 min</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="hover:bg-white/20 rounded-xl p-1.5 transition-colors relative z-10"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-amber-50/30 to-gray-50/50">
                    {!isLoggedIn ? (
                        /* Login prompt */
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck size={28} className="text-amber-500" />
                            </div>
                            <h4 className="font-bold text-gray-900 text-base mb-1">Login Required</h4>
                            <p className="text-gray-500 text-sm leading-relaxed mb-5">
                                Please sign in to start a conversation with our support team.
                            </p>
                            <button
                                onClick={() => { setIsOpen(false); window.location.href = '/SignInPage'; }}
                                className="px-8 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
                            >
                                Sign In Now
                            </button>
                        </div>
                    ) : isChatLoading || isMessagesLoading ? (
                        <div className="flex flex-col justify-center items-center h-full gap-3">
                            <Loader2 className="animate-spin text-amber-500" size={28} />
                            <p className="text-gray-400 text-xs font-medium">Connecting...</p>
                        </div>
                    ) : isChatError ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-3">
                                <X size={24} className="text-red-400" />
                            </div>
                            <p className="text-gray-500 text-sm font-medium">Could not connect to chat.</p>
                            <p className="text-gray-400 text-xs mt-1">Please try again later.</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <p className="text-2xl mb-2">👋</p>
                            <p className="text-gray-800 font-bold text-sm">Welcome!</p>
                            <p className="text-gray-400 text-xs mt-1">How can we help you today?</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, i) => {
                                const fromUser = isUserMessage(msg);
                                const showDateLabel = i === 0 ||
                                    getDateLabel(msg.createdAt) !== getDateLabel(messages[i - 1]?.createdAt);

                                return (
                                    <React.Fragment key={msg._id || i}>
                                        {/* Date separator */}
                                        {showDateLabel && (
                                            <div className="flex items-center justify-center py-2">
                                                <span className="text-[10px] font-bold text-gray-400 bg-white/80 px-3 py-1 rounded-full shadow-sm border border-gray-100">
                                                    {getDateLabel(msg.createdAt)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Message bubble */}
                                        <div className={`flex ${fromUser ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[78%] ${fromUser ? 'items-end' : 'items-start'} flex flex-col`}>
                                                {/* Sender label for admin messages */}
                                                {!fromUser && (i === 0 || isUserMessage(messages[i - 1])) && (
                                                    <span className="text-[10px] font-bold text-amber-600 mb-1 ml-1 flex items-center gap-1">
                                                        <ShieldCheck size={10} />
                                                        {msg.sender?.Uname || 'Support'}
                                                    </span>
                                                )}

                                                <div
                                                    className={`px-3.5 py-2.5 text-sm leading-relaxed ${fromUser
                                                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl rounded-tr-md shadow-sm shadow-amber-500/20'
                                                        : 'bg-white text-gray-800 rounded-2xl rounded-tl-md shadow-sm border border-gray-100'
                                                        }`}
                                                >
                                                    {msg.content || msg.text}
                                                </div>

                                                {/* Timestamp */}
                                                <div className={`flex items-center gap-1 mt-0.5 ${fromUser ? 'justify-end mr-1' : 'justify-start ml-1'}`}>
                                                    <Clock size={9} className="text-gray-300" />
                                                    <span className="text-[9px] text-gray-400">{formatTime(msg.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </>
                    )}
                </div>

                {/* Input Area — Only show when logged in */}
                {isLoggedIn && (
                    <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white flex gap-2 items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:bg-white transition-all border border-gray-100"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || !chatId || sendMessageMutation.isPending}
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-2.5 rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-amber-500/20 active:scale-95"
                        >
                            {sendMessageMutation.isPending ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Send size={18} />
                            )}
                        </button>
                    </form>
                )}
            </div>

            {/* Animation keyframes */}
            <style>{`
                @keyframes chatSlideUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ChatPopup;
