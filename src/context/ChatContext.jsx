import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from "../services/config";
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
    // allChats armazenará todos os documentos da coleção 'chats'
    const [allChats, setAllChats] = useState({});

    // --- 1. ESCUTA EM TEMPO REAL ---
    // Este useEffect garante que qualquer mudança no banco apareça instantaneamente para todos

    useEffect(() => {
        // Escuta a coleção inteira para capturar mudanças em qualquer chat
        const q = query(collection(db, "chats"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatsData = {};
            snapshot.forEach((doc) => {
                console.log("Documento recebido:", doc.id); // Verifique se o ID que chega é o que o cliente usa
                chatsData[doc.id] = doc.data().messages || [];
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

    const sendMessage = async (chatId, messageData, displayName) => {
        if (!chatId) {
            console.error("Erro: chatId não fornecido!");
            return;
        }

        // Garante que o nome nunca seja uma string vazia no Firestore
        const validName = (displayName && displayName.trim() !== "") ? displayName : "Visitante";
        const chatRef = doc(db, "chats", chatId);

        const newMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: messageData.text || "",
            sender: messageData.sender, // 'admin' ou 'client'
            senderName: messageData.sender === 'admin' ? "Suporte LinaClyn" : validName,
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
                clientName: validName, // Atualiza para não ficar vazio
                userId: chatId
            });
        } catch (error) {
            // Se o documento não existir (primeira mensagem), cria ele completo
            await setDoc(chatRef, {
                messages: [newMessage],
                clientName: validName,
                userId: chatId,
                lastUpdate: serverTimestamp()
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