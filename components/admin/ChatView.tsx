import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChatConversation, ChatMessage } from '../../types';

// --- Icons ---
const SendIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const UserCircleIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-12 w-12"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChatBubbleLeftRightIcon: React.FC<{className?: string}> = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-16 h-16"}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a2.25 2.25 0 00-3.182 0l-3.72 3.72V17.25c0-1.136.847-2.1 1.98-2.193l3.72-3.72a2.25 2.25 0 003.182 0l3.72 3.72zm-20.25 0c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a2.25 2.25 0 00-3.182 0l-3.72 3.72V17.25c0-1.136.847-2.1 1.98-2.193l3.72-3.72a2.25 2.25 0 003.182 0l3.72 3.72z" /></svg>;
const ArrowRightIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>;

// --- Helper Functions ---
const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1 && names[0] && names[names.length - 1]) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name ? name.substring(0, 2) : 'ع';
};

const formatMessageTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatDateDivider = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'اليوم';
    if (date.toDateString() === yesterday.toDateString()) return 'الأمس';
    
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// --- Sub-components ---
const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isAdmin = message.sender === 'admin';
    return (
        <div className={`flex items-end gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                isAdmin 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}>
                <p className="text-sm leading-6">{message.text}</p>
                <div className={`text-xs mt-1 ${isAdmin ? 'text-blue-200 text-left' : 'text-gray-500 text-right'}`}>
                    {formatMessageTimestamp(message.timestamp)}
                </div>
            </div>
        </div>
    );
};

const DateDivider: React.FC<{ date: string }> = ({ date }) => (
    <div className="text-center my-4">
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{date}</span>
    </div>
);

const UserAvatar: React.FC<{ name: string }> = ({ name }) => (
    <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
        {getInitials(name)}
    </div>
);


interface ChatViewProps {
    conversations: ChatConversation[];
    messages: ChatMessage[];
    onSendMessage: (text: string, sender: 'admin', conversationId: string) => void;
    onMarkAsRead: (conversationId: string, reader: 'admin') => void;
}

const ChatView: React.FC<ChatViewProps> = ({ conversations, messages, onSendMessage, onMarkAsRead }) => {
    const [selectedConvoId, setSelectedConvoId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sortedConversations = useMemo(() => 
        [...conversations].sort((a, b) => b.lastTimestamp - a.lastTimestamp), 
        [conversations]
    );

    useEffect(() => {
        if (!isMobileView && !selectedConvoId && sortedConversations.length > 0) {
            const firstConvo = sortedConversations[0];
            setSelectedConvoId(firstConvo.id);
            if (firstConvo.unreadAdmin > 0) {
                onMarkAsRead(firstConvo.id, 'admin');
            }
        }
    }, [isMobileView, selectedConvoId, sortedConversations, onMarkAsRead]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedConvoId]);

    const handleSelectConvo = (convoId: string) => {
        setSelectedConvoId(convoId);
        const convo = conversations.find(c => c.id === convoId);
        if (convo && convo.unreadAdmin > 0) {
            onMarkAsRead(convoId, 'admin');
        }
    };
    
    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && selectedConvoId) {
            onSendMessage(newMessage.trim(), 'admin', selectedConvoId);
            setNewMessage('');
        }
    };

    const selectedMessages = useMemo(() => 
        messages.filter(m => m.conversationId === selectedConvoId),
        [messages, selectedConvoId]
    );

    const groupedMessages = useMemo(() => {
        const groups: (ChatMessage | { type: 'date'; date: string; timestamp: number })[] = [];
        let lastDate: string | null = null;
        
        selectedMessages.forEach(msg => {
            const msgDate = new Date(msg.timestamp).toDateString();
            if (msgDate !== lastDate) {
                groups.push({
                    type: 'date',
                    date: formatDateDivider(msg.timestamp),
                    timestamp: msg.timestamp,
                });
                lastDate = msgDate;
            }
            groups.push(msg);
        });
        return groups;
    }, [selectedMessages]);

    const selectedConversation = conversations.find(c => c.id === selectedConvoId);
    
    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-1 min-h-0">
                {/* Conversation List */}
                <aside className={`w-full md:w-1/3 min-w-[320px] border-l border-gray-200 flex flex-col ${selectedConvoId && isMobileView ? 'hidden' : 'flex'}`}>
                    <div className="p-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">صندوق الوارد</h2>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {sortedConversations.map(convo => (
                            <div 
                                key={convo.id}
                                onClick={() => handleSelectConvo(convo.id)}
                                className={`flex items-center p-4 border-b cursor-pointer transition-colors ${selectedConvoId === convo.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            >
                                <UserAvatar name={convo.userName} />
                                <div className="flex-grow mr-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className={`font-bold ${convo.unreadAdmin > 0 ? 'text-blue-600' : 'text-gray-800'}`}>{convo.userName}</h3>
                                        <p className="text-xs text-gray-400">{formatMessageTimestamp(convo.lastTimestamp)}</p>
                                    </div>
                                    <div className="flex justify-between items-start mt-1">
                                        <p className="text-sm text-gray-500 truncate w-48">{convo.lastMessage}</p>
                                        {convo.unreadAdmin > 0 && <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">{convo.unreadAdmin}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Chat Window */}
                <main className={`flex-1 flex flex-col ${!selectedConvoId ? (isMobileView ? 'hidden' : 'flex') : 'flex'}`}>
                    {selectedConversation ? (
                        <>
                            <div className="p-3 border-b flex items-center space-x-3 rtl:space-x-reverse shadow-sm">
                                {isMobileView && (
                                    <button
                                        onClick={() => setSelectedConvoId(null)}
                                        className="text-gray-600 hover:text-blue-600"
                                        aria-label="العودة للمحادثات"
                                    >
                                        <ArrowRightIcon />
                                    </button>
                                )}
                                <UserAvatar name={selectedConversation.userName} />
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">{selectedConversation.userName}</h2>
                                    {selectedConversation.isUserTyping && (
                                        <p className="text-xs text-green-500 animate-pulse">يكتب الآن...</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                                 <div className="space-y-4">
                                    {groupedMessages.map((item, index) => {
                                        if ('type' in item && item.type === 'date') {
                                            return <DateDivider key={item.timestamp} date={item.date} />;
                                        }
                                        return <MessageBubble key={(item as ChatMessage).id || index} message={item as ChatMessage} />;
                                    })}
                                </div>
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 bg-white border-t">
                                <form onSubmit={handleSend} className="flex items-center space-x-2 rtl:space-x-reverse">
                                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="اكتب ردك هنا..." className="w-full bg-gray-100 border-transparent rounded-full py-2.5 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                                    <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors" aria-label="إرسال"><SendIcon /></button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow hidden md:flex flex-col items-center justify-center text-center text-gray-400 bg-gray-50 p-4">
                            <ChatBubbleLeftRightIcon className="w-24 h-24 text-gray-300"/>
                            <h2 className="mt-4 text-xl font-semibold text-gray-600">ابدأ محادثة</h2>
                            <p className="max-w-xs mt-1 text-gray-500">اختر محادثة من القائمة على اليمين لعرض الرسائل هنا.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ChatView;
