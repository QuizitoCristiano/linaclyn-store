import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from "../services/config";
import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    updateDoc,
    arrayUnion,
    serverTimestamp,
    query
} from "firebase/firestore";

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [allChats, setAllChats] = useState({});

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            const isAdmin = user?.email === 'quizitocristiano10@gmail.com';

            if (isAdmin) {
                const q = query(collection(db, "chats"));
                return onSnapshot(q, (snapshot) => {
                    const chatsData = {};
                    snapshot.forEach((doc) => {
                        chatsData[doc.id] = { id: doc.id, ...doc.data() };
                    });
                    setAllChats(chatsData); // Admin recebe o mapa de todos os chats
                });
            } else {
                const leadId = localStorage.getItem('chat_user_id');
                const activeId = user?.uid || leadId;

                if (activeId) {
                    const docRef = doc(db, "chats", activeId);
                    return onSnapshot(docRef, (snapshot) => {
                        if (snapshot.exists()) {
                            // IMPORTANTE: Mantém o que já tinha e adiciona o novo/atualizado
                            setAllChats(prev => ({ ...prev, [activeId]: snapshot.data() }));
                        }
                    });
                }
            }
        });

        return () => unsubscribeAuth();
    }, []);

    // --- ENVIAR MENSAGEM ---
    const sendMessage = async (chatId, messageData, displayName) => {
        if (!chatId) return;

        // Se a mensagem já tiver um ID e for uma edição, redireciona para a função de editar
        if (messageData.id && messageData.isEdited) {
            return editMessage(chatId, messageData.id, messageData.text);
        }

        let finalName = "Visitante";
        if (displayName && displayName.trim() !== "") {
            finalName = displayName;
        } else if (auth.currentUser?.displayName) {
            finalName = auth.currentUser.displayName;
        } else {
            const savedName = localStorage.getItem('chat_user_name');
            if (savedName) finalName = savedName;
        }

        const chatRef = doc(db, "chats", chatId);

        const newMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: messageData.text || "",
            sender: messageData.sender,
            senderName: messageData.sender === 'admin' ? "Suporte LinaClyn" : finalName,
            type: messageData.type || 'text',
            image: messageData.image || null,
            audio: messageData.audio || null,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: new Date().toISOString()
        };

        try {
            await updateDoc(chatRef, {
                messages: arrayUnion(newMessage),
                lastUpdate: serverTimestamp(),
                clientName: finalName,
                userId: chatId
            });
        } catch (error) {
            await setDoc(chatRef, {
                messages: [newMessage],
                clientName: finalName,
                userId: chatId,
                lastUpdate: serverTimestamp()
            });
        }
    };

    // --- EDITAR MENSAGEM (Onde a mágica acontece) ---
    const editMessage = async (userId, messageId, newText) => {
        const chatData = allChats[userId];
        if (!chatData) return;

        // Criamos uma nova lista de mensagens alterando apenas a que tem o ID correto
        const updatedMessages = chatData.messages.map(msg => {
            if (msg.id === messageId) {
                return { ...msg, text: newText, isEdited: true };
            }
            return msg;
        });

        const chatRef = doc(db, "chats", userId);
        try {
            await updateDoc(chatRef, {
                messages: updatedMessages,
                lastUpdate: serverTimestamp()
            });
        } catch (error) {
            console.error("Erro ao editar mensagem:", error);
        }
    };

    // --- DELETAR MENSAGEM ---
    const deleteMessage = async (userId, messageId) => {
        const chatData = allChats[userId];
        const currentMessages = chatData?.messages || [];
        const updatedMessages = currentMessages.filter(m => m.id !== messageId);

        const chatRef = doc(db, "chats", userId);
        try {
            await updateDoc(chatRef, { messages: updatedMessages });
        } catch (error) {
            console.error("Erro ao deletar mensagem:", error);
        }
    };

    return (
        <ChatContext.Provider value={{ allChats, sendMessage, deleteMessage, editMessage }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);