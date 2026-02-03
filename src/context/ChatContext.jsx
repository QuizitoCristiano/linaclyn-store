import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [allChats, setAllChats] = useState(() => {
        const saved = localStorage.getItem('linaclyn_chats');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('linaclyn_chats', JSON.stringify(allChats));
    }, [allChats]);

    const sendMessage = (userId, messageData, clientName = "Cliente") => {
        setAllChats(prev => {
            const userChat = prev[userId] || [];
            const newMessage = {
                ...messageData,
                id: Date.now(),
                clientName,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            return { ...prev, [userId]: [...userChat, newMessage] };
        });
    };

    const deleteMessage = (userId, messageId) => {
        setAllChats(prev => {
            const userChat = prev[userId] || [];
            return { ...prev, [userId]: userChat.filter(m => m.id !== messageId) };
        });
    };

    return (
        <ChatContext.Provider value={{ allChats, sendMessage, deleteMessage }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);