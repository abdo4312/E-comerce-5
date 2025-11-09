import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';

interface ChatWindowProps {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isAdminTyping: boolean;
    onUserTyping: (isTyping: boolean) => void;
}

const SendIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

const MessageStatusIcon: React.FC<{ status?: 'sent' | 'delivered' | 'read' }> = ({ status }) => {
    if (!status) return null;

    const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );

    if (status === 'read') {
        return (
            <div className="relative w-5 h-4 text-blue-300">
                <CheckIcon className="absolute right-1" />
                <CheckIcon className="absolute right-0" />
            </div>
        );
    }
    
    if (status === 'delivered') {
        return (
            <div className="relative w-5 h-4 text-gray-400">
                <CheckIcon className="absolute right-1" />
                <CheckIcon className="absolute right-0" />
            </div>
        );
    }

    return null;
};

const AdminTypingIndicator: React.FC = () => (
    <div className="flex items-end gap-2 justify-start">
        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            ق
        </div>
        <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-orange-100 text-orange-900 rounded-bl-none">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                <span className="h-2 w-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-orange-400 rounded-full animate-bounce"></span>
            </div>
        </div>
    </div>
);


const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isAdminTyping, onUserTyping }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<number | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isAdminTyping]);

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        onUserTyping(true);

        typingTimeoutRef.current = window.setTimeout(() => {
            onUserTyping(false);
        }, 1500);
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                onUserTyping(false);
            }
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="w-80 h-96 sm:w-96 sm:h-[450px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden mb-4">
            {/* Header */}
            <div className="bg-orange-500 text-white p-4 flex-shrink-0">
                <h3 className="font-bold text-lg text-center">تواصل معنا</h3>
                <p className="text-sm text-center opacity-90">نسعد بالرد على استفساراتك</p>
            </div>
            
            {/* Messages */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'admin' && (
                                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                    ق
                                </div>
                            )}
                            <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                                msg.sender === 'user' 
                                ? 'bg-blue-100 text-gray-800 rounded-br-none' 
                                : 'bg-orange-100 text-orange-900 rounded-bl-none'
                            }`}>
                                <p className="text-sm">{msg.text}</p>
                                {msg.sender === 'user' && (
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className="text-xs text-gray-500 opacity-80">
                                            {new Date(msg.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit'})}
                                        </span>
                                        <MessageStatusIcon status={msg.status} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isAdminTyping && <AdminTypingIndicator />}
                </div>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-200 flex-shrink-0">
                <form onSubmit={handleSend} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder="اكتب رسالتك هنا..."
                        className="w-full bg-gray-100 border-transparent rounded-full py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button type="submit" className="text-orange-500 hover:text-orange-600 p-2 rounded-full transition-colors" aria-label="إرسال">
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;