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

    const adminSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");
    const clientSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");

    // --- MONITORAMENTO EM TEMPO REAL ---
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

                    snapshot.docChanges().forEach((change) => {
                        const chatId = change.doc.id;
                        const data = change.doc.data();
                        const messages = data.messages || [];
                        const currentCount = messages.length;
                        const previousCount = lastMessageCountRef.current[chatId];

                        if (change.type === "modified" && previousCount !== undefined && currentCount > previousCount) {
                            const lastMsg = messages[messages.length - 1];
                            if (lastMsg?.sender === 'client') adminSound.play().catch(() => { });
                        }
                        lastMessageCountRef.current[chatId] = currentCount;
                    });
                    setAllChats(chatsData);
                });
            } else {
                const leadId = localStorage.getItem('chat_user_id');
                const activeId = user?.uid || leadId;

                if (activeId) {
                    const docRef = doc(db, "chats", activeId);
                    return onSnapshot(docRef, (snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.data();
                            const messages = data.messages || [];
                            const currentCount = messages.length;
                            const previousCount = lastMessageCountRef.current[activeId];

                            if (previousCount !== undefined && currentCount > previousCount) {
                                const lastMsg = messages[messages.length - 1];
                                if (lastMsg?.sender === 'admin') clientSound.play().catch(() => { });
                            }

                            lastMessageCountRef.current[activeId] = currentCount;
                            setAllChats(prev => ({ ...prev, [activeId]: { id: snapshot.id, ...data } }));
                        }
                    });
                }
            }
        });

        return () => unsubscribeAuth();
    }, []);

    // --- LÓGICA DE SEGURANÇA E MENSAGENS ---

    // 1. EDITAR MENSAGEM (Com validação de existência)
    const editMessage = async (userId, messageId, newText) => {
        if (!newText.trim()) return;
        const chatData = allChats[userId];
        if (!chatData?.messages) return;

        const updatedMessages = chatData.messages.map(msg =>
            msg.id === messageId ? { ...msg, text: newText, isEdited: true } : msg
        );

        try {
            await updateDoc(doc(db, "chats", userId), {
                messages: updatedMessages,
                lastUpdate: serverTimestamp()
            });
        } catch (error) {
            console.error("Erro na edição segura:", error);
            throw error;
        }
    };

    // 2. ENVIAR IMAGEM (Com trava de tamanho de 2MB)
    const sendImageMessage = async (userId, file, currentName, isAdmin = false) => {
        const MAX_SIZE = 2 * 1024 * 1024; // 2MB

        if (file.size > MAX_SIZE) {
            throw new Error("Imagem muito pesada! Limite de 2MB.");
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
                try {
                    await sendMessage(userId, {
                        image: reader.result,
                        sender: isAdmin ? 'admin' : 'client', // Flexível agora
                        senderName: currentName,
                        type: 'image',
                        text: "📷 Imagem"
                    }, currentName);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error("Erro ao processar imagem."));
        });
    };
    // 3. DELETAR MENSAGEM
    const deleteMessage = async (userId, messageId) => {
        const chatData = allChats[userId];
        if (!chatData?.messages) return;

        const updatedMessages = chatData.messages.filter(m => m.id !== messageId);
        try {
            await updateDoc(doc(db, "chats", userId), { messages: updatedMessages });
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    };

    // 4. STATUS DIGITANDO
    const updateTypingStatus = async (chatId, isTyping, isAdmin = false) => {
        if (!chatId) return;
        try {
            await updateDoc(doc(db, "chats", chatId), {
                [isAdmin ? 'typingAdmin' : 'typingClient']: isTyping
            });
        } catch (error) { /* Silencioso para não poluir console */ }
    };

    // 5. ENVIAR MENSAGEM (Base)
    // const sendMessage = async (chatId, messageData, displayName) => {
    //     if (!chatId) return;

    //     let finalName = displayName?.trim() || "Cliente";
    //     if (messageData.sender === 'admin') finalName = "Suporte LinaClyn";

    //     const newMessage = {
    //         id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    //         text: messageData.text || "",
    //         sender: messageData.sender,
    //         senderName: finalName,
    //         type: messageData.type || 'text',
    //         image: messageData.image || null,
    //         audio: messageData.audio || null,
    //         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //         createdAt: new Date().toISOString()
    //     };

    //     const chatRef = doc(db, "chats", chatId);
    //     const updateData = {
    //         messages: arrayUnion(newMessage),
    //         lastUpdate: serverTimestamp(),
    //         userId: chatId,
    //         ...(messageData.sender === 'client' && { clientName: finalName })
    //     };

    //     try {
    //         await updateDoc(chatRef, updateData);
    //     } catch (error) {
    //         await setDoc(chatRef, {
    //             ...updateData,
    //             messages: [newMessage],
    //             createdAt: serverTimestamp(),
    //             typingAdmin: false,
    //             typingClient: false
    //         });
    //     }
    // };

    const sendMessage = async (chatId, messageData, displayName) => {
        if (!chatId) return;

        let finalName = displayName?.trim() || "Cliente";
        if (messageData.sender === 'admin') finalName = "Suporte LinaClyn";

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
            // Tenta atualizar se o chat já existir
            await updateDoc(chatRef, {
                messages: arrayUnion(newMessage),
                lastUpdate: serverTimestamp(),
                userId: chatId,
                ...(messageData.sender === 'client' && { clientName: finalName })
            });
        } catch (error) {
            // Se o chat NÃO existir (erro cai aqui), criamos do zero.
            // IMPORTANTE: Aqui NÃO usamos arrayUnion, passamos o array [newMessage] direto.
            await setDoc(chatRef, {
                userId: chatId,
                clientName: messageData.sender === 'client' ? finalName : "Novo Cliente",
                messages: [newMessage], // Array simples, sem funções do Firebase
                lastUpdate: serverTimestamp(),
                createdAt: serverTimestamp(),
                typingAdmin: false,
                typingClient: false
            });
        }
    };

    return (
        <ChatContext.Provider value={{
            allChats,
            sendMessage,
            sendImageMessage,
            deleteMessage,
            editMessage,
            updateTypingStatus
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);