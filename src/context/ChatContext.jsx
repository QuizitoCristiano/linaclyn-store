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
                // --- VISÃO DO ADMINISTRADOR ---
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
                // --- VISÃO DO CLIENTE ---
                const leadId = localStorage.getItem('chat_user_id');
                const activeId = user?.uid || leadId;

                if (activeId) {
                    // 1. SINCRONIZAÇÃO DE NOME (Busca na coleção 'users' e limpa o "Cliente")
                    const syncName = async () => {
                        try {
                            const userDoc = await getDoc(doc(db, "users", activeId));
                            if (userDoc.exists()) {
                                const realName = userDoc.data().name || userDoc.data().displayName;
                                if (realName) {
                                    // Salva no LocalStorage para uso imediato
                                    localStorage.setItem('chat_user_name', realName);

                                    // Corrige o documento do chat no Firestore se estiver como "Cliente"
                                    const chatRef = doc(db, "chats", activeId);
                                    const chatSnap = await getDoc(chatRef);
                                    if (chatSnap.exists() && chatSnap.data().clientName === "Cliente") {
                                        await updateDoc(chatRef, { clientName: realName });
                                    }
                                }
                            }
                        } catch (err) {
                            console.error("Erro ao sincronizar nome:", err);
                        }
                    };

                    syncName();

                    // 2. ESCUTA DAS MENSAGENS EM TEMPO REAL
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

    // 1. EDITAR MENSAGEM (Com Validação de Integridade)
    const editMessage = async (userId, messageId, newText) => {
        if (!newText.trim()) return;

        const chatData = allChats[userId];
        if (!chatData?.messages) return;

        // Mapeia as mensagens e aplica a alteração apenas no ID correto
        const updatedMessages = chatData.messages.map(msg =>
            msg.id === messageId
                ? {
                    ...msg,
                    text: newText,
                    isEdited: true, // Aciona a flag de segurança de que o dado original mudou
                    editedAt: new Date().toISOString() // Registra o momento exato da alteração para auditoria
                }
                : msg
        );

        try {
            const chatRef = doc(db, "chats", userId);

            // Atualização atômica no Firestore
            await updateDoc(chatRef, {
                messages: updatedMessages,
                lastUpdate: serverTimestamp() // Marca a última atividade no documento
            });

            console.log(`Segurança: Mensagem ${messageId} editada e integrada com sucesso.`);
        } catch (error) {
            console.error("Erro crítico na integridade da edição:", error);
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

    //     try {
    //         // 1. GESTÃO DE NOME (Identidade Segura)
    //         let finalName = displayName?.trim();
    //         if (!finalName) finalName = localStorage.getItem('chat_user_name');

    //         if (messageData.sender === 'admin') {
    //             finalName = "Suporte LinaClyn";
    //         }

    //         const chatRef = doc(db, "chats", chatId);
    //         const chatSnap = await getDoc(chatRef);
    //         const chatData = chatSnap.exists() ? chatSnap.data() : null;

    //         // 2. TRAVA DE SEGURANÇA INTELIGENTE (Anti-Spam/DoS)
    //         if (chatData && messageData.isAutoResponse) {
    //             const messages = chatData.messages || [];
    //             const lastMsg = messages[messages.length - 1];
    //             if (lastMsg && lastMsg.isAutoResponse) {
    //                 console.warn("Segurança: Bloqueada resposta automática duplicada.");
    //                 return;
    //             }
    //         }

    //         // 3. ESTRUTURA DA MENSAGEM (Com Auditoria e Integridade)
    //         const newMessage = {
    //             id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    //             text: messageData.text || "",
    //             sender: messageData.sender,
    //             senderName: finalName || "Cliente",
    //             type: messageData.type || 'text',
    //             image: messageData.image || null,
    //             audio: messageData.audio || null,
    //             timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //             createdAt: new Date().toISOString(),

    //             // --- NOVAS FUNCIONALIDADES DE SEGURANÇA E ESTADO ---
    //             isAutoResponse: messageData.isAutoResponse || false, // Separação lógica de bot/humano
    //             isEdited: false, // Flag de integridade: inicia sempre como íntegra (falso)
    //             status: 'sent'   // Rastreabilidade: status inicial da transmissão
    //         };

    //         // 4. ATUALIZAÇÃO NO FIRESTORE (Persistência Segura)
    //         if (chatSnap.exists()) {
    //             await updateDoc(chatRef, {
    //                 messages: arrayUnion(newMessage),
    //                 lastUpdate: serverTimestamp(),
    //                 userId: chatId,
    //                 ...(messageData.sender === 'client' && { clientName: finalName })
    //             });
    //         } else {
    //             await setDoc(chatRef, {
    //                 userId: chatId,
    //                 clientName: finalName || "Cliente",
    //                 messages: [newMessage],
    //                 lastUpdate: serverTimestamp(),
    //                 createdAt: serverTimestamp(),
    //                 typingAdmin: false,
    //                 typingClient: false
    //             });
    //         }

    //     } catch (error) {
    //         // Log de erro protegido para análise de falhas
    //         console.error("Erro crítico no envio de mensagem:", error);
    //         throw error;
    //     }
    // };

    const sendMessage = async (chatId, messageData, displayName) => {
        if (!chatId) return;

        try {
            // 1. GESTÃO DE IDENTIDADE (Identidade Segura)
            let finalName = displayName?.trim();
            if (!finalName) finalName = localStorage.getItem('chat_user_name');

            if (messageData.sender === 'admin') {
                finalName = "Suporte LinaClyn";
            }

            const chatRef = doc(db, "chats", chatId);
            const chatSnap = await getDoc(chatRef);
            const chatData = chatSnap.exists() ? chatSnap.data() : null;

            // 2. CONTROLE DE FLUXO LÓGICO (Prevenção de DoS/Spam de Bot)
            if (chatData && messageData.isAutoResponse) {
                const messages = chatData.messages || [];
                const lastMsg = messages[messages.length - 1];
                if (lastMsg && lastMsg.isAutoResponse) {
                    console.warn("Segurança: Bloqueada resposta automática duplicada.");
                    return;
                }
            }

            // 3. ESTRUTURA DA MENSAGEM COM AUDITORIA (Integridade do Dado)
            const newMessage = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                text: messageData.text || "",
                sender: messageData.sender,
                senderName: finalName || "Cliente",
                type: messageData.type || 'text',
                image: messageData.image || null,
                audio: messageData.audio || null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                createdAt: new Date().toISOString(),

                // --- ATRIBUTOS DE SEGURANÇA E ESTADO ---
                isAutoResponse: messageData.isAutoResponse || false, // Identificação de origem lógica
                isEdited: false, // Flag de integridade original
                status: 'sent'   // Rastreabilidade de ciclo de vida
            };

            // 4. PERSISTÊNCIA SEGURA NO FIRESTORE
            if (chatSnap.exists()) {
                await updateDoc(chatRef, {
                    messages: arrayUnion(newMessage),
                    lastUpdate: serverTimestamp(),
                    userId: chatId,
                    ...(messageData.sender === 'client' && { clientName: finalName })
                });
            } else {
                await setDoc(chatRef, {
                    userId: chatId,
                    clientName: finalName || "Cliente",
                    messages: [newMessage],
                    lastUpdate: serverTimestamp(),
                    createdAt: serverTimestamp(),
                    typingAdmin: false,
                    typingClient: false
                });
            }

        } catch (error) {
            // Log de erro para análise forense/suporte técnica
            console.error("Erro crítico no envio de mensagem:", error);
            throw error;
        }
    };

    const isOfficeHours = () => {
        const agora = new Date();
        const horaAtual = agora.getHours();
        const minutoAtual = agora.getMinutes();
        const diaSemana = agora.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

        // Converte tudo para minutos para facilitar a comparação precisa
        const tempoAtual = horaAtual * 60 + minutoAtual;
        const abertura = 8 * 60; // 08:00
        const fechamentoSemana = 18 * 60; // 18:00
        const fechamentoSabado = 12 * 60;  // 12:00

        //Domingo: Fechado
        if (diaSemana === 0) {
            return false;
        };

        // Sábado: 08:00 às 12:00
        if (diaSemana === 6) {
            return tempoAtual >= abertura && tempoAtual < fechamentoSabado;
        };

        // Segunda a Sexta: 08:00 às 18:00
        return tempoAtual >= abertura && tempoAtual < fechamentoSemana;
    }




    return (
        <ChatContext.Provider value={{
            allChats,
            sendMessage,
            sendImageMessage,
            deleteMessage,
            editMessage,
            updateTypingStatus,
            isOfficeHours
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);