import React, { useState } from 'react';
import { ChatConversation, ChatMessage } from '../../types';
import ChatWindow from './ChatWindow';

interface ChatWidgetProps {
    userId: string;
    conversation: ChatConversation | undefined;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    onMarkAsRead: () => void;
    onUserTyping: (isTyping: boolean) => void;
    onOpenChat: () => void;
}

const ChatIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const CloseIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

const ChatWidget: React.FC<ChatWidgetProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        if (!isOpen) { // On opening the chat
            props.onOpenChat();
            if (props.conversation && props.conversation.unreadUser > 0) {
                props.onMarkAsRead();
            }
        }
        setIsOpen(prev => !prev);
    };

    const unreadCount = props.conversation?.unreadUser || 0;

    return (
        <div className="fixed bottom-5 right-5 z-50">
             <style>{`
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-chat-window { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
            
            {isOpen && (
                <div className="animate-chat-window origin-bottom-right">
                    <ChatWindow
                        messages={props.messages}
                        onSendMessage={props.onSendMessage}
                        isAdminTyping={props.conversation?.isAdminTyping || false}
                        onUserTyping={props.onUserTyping}
                    />
                </div>
            )}
            
            <button 
                onClick={toggleChat}
                className="bg-orange-500 rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                aria-label={isOpen ? 'إغلاق المحادثة' : `فتح المحادثة (${unreadCount} رسالة جديدة)`}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
                {!isOpen && unreadCount > 0 && (
                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
};

export default ChatWidget;