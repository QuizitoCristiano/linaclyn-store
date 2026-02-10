import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth, db } from "../services/config";
import {
    collection,
    doc,
    getDoc,
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
    const lastMessageCountRef = useRef({});

    // Áudio de notificação
    const notificationSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");

    // --- EFEITO: MONITORAMENTO DE CHATS (Admin e Cliente) ---
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

                    // Lógica de Som de Notificação
                    snapshot.docChanges().forEach((change) => {
                        const chatId = change.doc.id;
                        const data = change.doc.data();
                        const messages = data.messages || [];
                        const currentCount = messages.length;
                        const previousCount = lastMessageCountRef.current[chatId];

                        if (change.type === "modified" && previousCount !== undefined && currentCount > previousCount) {
                            const lastMsg = messages[messages.length - 1];
                            if (lastMsg && lastMsg.sender !== 'admin') {
                                const msgTime = new Date(lastMsg.createdAt || new Date()).getTime();
                                const isRecent = (new Date().getTime() - msgTime) < 10000;
                                if (isRecent) notificationSound.play().catch(() => { });
                            }
                        }
                        lastMessageCountRef.current[chatId] = currentCount;
                    });
                    setAllChats(chatsData);
                });
            } else {
                // Lógica Cliente
                const leadId = localStorage.getItem('chat_user_id');
                const activeId = user?.uid || leadId;

                if (activeId) {
                    const docRef = doc(db, "chats", activeId);
                    return onSnapshot(docRef, (snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.data();
                            lastMessageCountRef.current[activeId] = (data.messages || []).length;
                            setAllChats(prev => ({
                                ...prev,
                                [activeId]: { id: snapshot.id, ...data }
                            }));
                        }
                    });
                }
            }
        });

        return () => unsubscribeAuth();
    }, []);

    // --- FUNÇÃO: EDITAR MENSAGEM ---
    const editMessage = async (userId, messageId, newText) => {
        const chatData = allChats[userId];
        if (!chatData) return;

        const updatedMessages = chatData.messages.map(msg =>
            msg.id === messageId ? { ...msg, text: newText, isEdited: true } : msg
        );

        try {
            await updateDoc(doc(db, "chats", userId), {
                messages: updatedMessages,
                lastUpdate: serverTimestamp()
            });
        } catch (error) {
            console.error("Erro ao editar:", error);
        }
    };

    // --- FUNÇÃO: DELETAR MENSAGEM ---
    const deleteMessage = async (userId, messageId) => {
        const chatData = allChats[userId];
        if (!chatData || !chatData.messages) return;

        const updatedMessages = chatData.messages.filter(m => m.id !== messageId);
        try {
            await updateDoc(doc(db, "chats", userId), { messages: updatedMessages });
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    // --- FUNÇÃO: STATUS DE DIGITANDO ---
    const updateTypingStatus = async (chatId, isTyping, isAdmin = false) => {
        if (!chatId) return;
        try {
            await updateDoc(doc(db, "chats", chatId), {
                [isAdmin ? 'typingAdmin' : 'typingClient']: isTyping
            });
        } catch (error) {
            console.error("Erro no typing status:", error);
        }
    };

    // --- FUNÇÃO: ENVIAR MENSAGEM (Com correção de Nome) ---
    const sendMessage = async (chatId, messageData, displayName) => {
        if (!chatId) return;

        // 1. Edição rápida
        if (messageData.id && messageData.isEdited) {
            return editMessage(chatId, messageData.id, messageData.text);
        }

        // 2. Determinação do Nome Real
        let finalName = "Cliente";
        if (messageData.sender === 'admin') {
            finalName = "Suporte LinaClyn";
        } else {
            finalName = displayName?.trim() ||
                localStorage.getItem('chat_user_name') ||
                auth.currentUser?.displayName ||
                "Cliente";

            // Busca profunda no Firestore se o nome ainda estiver genérico
            if (finalName === "Cliente") {
                try {
                    const userSnap = await getDoc(doc(db, "users", chatId));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        finalName = userData.name || userData.nome || userData.displayName || "Cliente";
                        localStorage.setItem('chat_user_name', finalName);
                    }
                } catch (err) {
                    console.error("Erro ao buscar nome real:", err);
                }
            }
        }

        // 3. Montagem da Mensagem
        const newMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text: messageData.text || "",
            sender: messageData.sender,
            senderName: finalName,
            type: messageData.type || 'text',
            image: messageData.image || null,
            audio: messageData.audio || null,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdAt: new Date().toISOString()
        };

        const chatRef = doc(db, "chats", chatId);

        try {
            // 4. Update (Forçando o clientName na capa do chat)
            const updateData = {
                messages: arrayUnion(newMessage),
                lastUpdate: serverTimestamp(),
                userId: chatId
            };

            if (messageData.sender === 'client') {
                updateData.clientName = finalName;
            }

            await updateDoc(chatRef, updateData);
        } catch (error) {
            // 5. Create (Se o chat não existir)
            await setDoc(chatRef, {
                userId: chatId,
                clientName: messageData.sender === 'client' ? finalName : "Novo Cliente",
                messages: [newMessage],
                lastUpdate: serverTimestamp(),
                createdAt: serverTimestamp(),
                typingAdmin: false,
                typingClient: false
            });
        }
    };

    return (
        <ChatContext.Provider value={{ allChats, sendMessage, deleteMessage, editMessage, updateTypingStatus }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);