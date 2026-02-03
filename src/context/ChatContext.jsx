import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from "../services/config";
import {
    collection,
    doc,
    onSnapshot,
    setDoc,
    updateDoc,
    arrayUnion,
    serverTimestamp
} from "firebase/firestore";

const ChatContext = createContext();

export function ChatProvider({ children }) {
    // allChats armazenará todos os documentos da coleção 'chats'
    const [allChats, setAllChats] = useState({});

    // --- 1. ESCUTA EM TEMPO REAL ---
    // Este useEffect garante que qualquer mudança no banco apareça instantaneamente para todos
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
            const chatsData = {};
            snapshot.forEach((documento) => {
                // Mapeia os dados: a chave é o ID do usuário (ou lead_) e o valor são as mensagens
                chatsData[documento.id] = documento.data().messages || [];
            });
            setAllChats(chatsData);
        });

        return () => unsubscribe();
    }, []);

    // --- 2. ENVIAR MENSAGEM (ESPELHADA) ---
    /**
     * @param {string} userId - O ID do cliente (essencial para que ambos vejam a mesma conversa)
     * @param {object} messageData - Conteúdo (text, type, sender, image, audio)
     * @param {string} clientName - Nome para exibição no cabeçalho do Admin
     */
    const sendMessage = async (userId, messageData, clientName = "Cliente") => {
        if (!userId) return;

        const chatRef = doc(db, "chats", userId);

        const newMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID Único
            text: messageData.text || "",
            image: messageData.image || null,
            audio: messageData.audio || null,
            type: messageData.type, // 'text', 'image' ou 'audio'
            sender: messageData.sender, // 'admin' ou 'client'
            clientName: clientName, // Salvo em cada msg para o Admin saber quem enviou
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: new Date().toISOString()
        };

        try {
            // Tenta adicionar a mensagem ao array existente
            await updateDoc(chatRef, {
                messages: arrayUnion(newMessage),
                lastUpdate: serverTimestamp(),
                clientName: clientName,
                lastSender: messageData.sender
            });
        } catch (error) {
            // Se o documento não existir (primeira mensagem do cliente), cria ele
            await setDoc(chatRef, {
                messages: [newMessage],
                clientName: clientName,
                userId: userId,
                lastUpdate: serverTimestamp(),
                lastSender: messageData.sender
            });
        }
    };

    // --- 3. DELETAR MENSAGEM ---
    const deleteMessage = async (userId, messageId) => {
        const currentMessages = allChats[userId] || [];
        const updatedMessages = currentMessages.filter(m => m.id !== messageId);

        const chatRef = doc(db, "chats", userId);
        try {
            await updateDoc(chatRef, { messages: updatedMessages });
        } catch (error) {
            console.error("Erro ao deletar mensagem:", error);
        }
    };

    return (
        <ChatContext.Provider value={{ allChats, sendMessage, deleteMessage }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);