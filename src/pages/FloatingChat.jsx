import React, { useState, useRef, useEffect } from 'react';
import {
    MessageCircle, X, Send, Mic, Image as ImageIcon,
    Trash2, Square, User, Phone, CheckCheck, Pencil, Undo2
} from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

export function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    // const [editingId, setEditingId] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [editingMsg, setEditingMsg] = useState(null); // Para controlar qual mensagem está sendo editada
    const { user } = useAuth();
    const { allChats, sendMessage, sendImageMessage, deleteMessage, editMessage, updateTypingStatus } = useChat();
    const [leadData, setLeadData] = useState({ nome: '', whatsapp: '' });
    const [hasIdentified, setHasIdentified] = useState(false);

    // Função para iniciar a edição
    const startEditing = (msg) => {
        setEditingMsg(msg);
        setMessage(msg.text); // Coloca o texto da mensagem no input
    };

    const handleLogoutChat = () => {
        localStorage.removeItem('chat_user_id');
        localStorage.removeItem('chat_user_name');
        setHasIdentified(false);
        setLeadData({ nome: '', whatsapp: '' });
        toast.success("Sessão encerrada.");
    };

    // 1. DEFINIÇÃO DO ID ÚNICO (Simplificada e Segura)
    // Prioridade: 1º UID do Firebase (se logado), 2º ID de Lead (se identificado)
    const savedId = localStorage.getItem('chat_user_id');
    const userId = user?.uid || savedId || (hasIdentified ? `lead_${leadData.whatsapp.replace(/\D/g, '')}` : null);

    //2. BUSCA O HISTÓRICO REAL DO FIREBASE
    //Se não houver histórico ainda, mostra a mensagem de boas - vindas padrão
    //USCA O HISTÓRICO REAL
    const chatData = (userId && allChats[userId]) ? allChats[userId] : null;
    // 2. Extraímos as mensagens. 
    // Se chatData for o novo formato {messages: []}, pegamos a array.
    // Se não existir nada ainda, deixamos a array vazia [].
    const messagesArray = chatData?.messages || (Array.isArray(chatData) ? chatData : []);

    // 3. Montamos o Histórico Final
    // Se houver mensagens no Firebase, usamos elas.
    // Se o chat estiver VAZIO (cliente novo), mostramos a mensagem de boas-vindas.
    const chatHistory = messagesArray.length > 0
        ? messagesArray
        : [{
            id: 'welcome',
            text: "Olá! Como podemos ajudar hoje?",
            sender: 'admin',
            type: 'text',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];

    const fileInputRef = useRef(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const scrollRef = useRef(null);

    // Auto-scroll sempre que o chatHistory mudar (mensagens novas do admin ou do cliente)
    // Adicione este useEffect para rastrear o que está chegando
    useEffect(() => {
        if (userId) {
            console.log("Histórico atual para o usuário", userId, ":", allChats[userId]);
        }
    }, [allChats, userId]);

    // 2. ESSE SERVE PARA A TELA DESCER SOZINHA (O efeito WhatsApp)
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]); // Ele "escuta" quando o histórico de mensagens muda

    // Use um useEffect para recuperar o ID do localStorage assim que o componente monta
    useEffect(() => {
        const saved = localStorage.getItem('chat_user_id');
        if (saved) setHasIdentified(true);
    }, []);



    const handleStartChat = async () => {
        if (leadData.nome.trim().length < 3 || leadData.whatsapp.length < 10) {
            toast.error("Preencha os dados corretamente.");
            return;
        }
        const whatsApenasNumeros = leadData.whatsapp.replace(/\D/g, '');
        const idGerado = `lead_${whatsApenasNumeros}`;

        localStorage.setItem('chat_user_id', idGerado);
        localStorage.setItem('chat_user_name', leadData.nome.trim());

        setHasIdentified(true);

        // Envia a primeira mensagem para criar o documento no Firestore
        try {
            await sendMessage(idGerado, {
                text: "Olá, gostaria de iniciar um atendimento.",
                sender: 'client',
                type: 'text'
            }, leadData.nome.trim());

            toast.success(`Bem-vindo, ${leadData.nome}!`);
        } catch (error) {
            console.error("Erro ao iniciar chat:", error);
        }
    };



    // --- 1. FUNÇÃO DE ENVIAR TEXTO ---
    // Modifique o seu handleSend para suportar edição:
    const handleSend = async () => {
        if (!message.trim() || !userId) return;

        if (editingMsg) {
            // Lógica de EDITAR
            try {
                await editMessage(userId, editingMsg.id, message);
                setEditingMsg(null);
                setMessage('');
                toast.success("Mensagem editada!");
            } catch (error) {
                toast.error("Erro ao editar.");
            }
        } else {
            // Lógica de ENVIAR (seu código atual...)
            const currentName = leadData.nome?.trim() || localStorage.getItem('chat_user_name') || user?.displayName || "Cliente";
            sendMessage(userId, {
                text: message,
                sender: 'client',
                senderName: currentName,
                type: 'text'
            }, currentName);
            setMessage('');
        }
    };


    // --- 2. FUNÇÃO DE ENVIAR IMAGEM (Refatorada para usar o Contexto) ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const currentName = leadData.nome?.trim() ||
            localStorage.getItem('chat_user_name') ||
            user?.displayName || "Cliente";

        try {
            // AQUI: Chama a função específica de imagem do contexto
            await sendImageMessage(userId, file, currentName);
            toast.success("Imagem enviada!");
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            toast.error(error.message); // Exibe o erro de 2MB se houver
        }
    };

    // --- 3. FUNÇÃO DE ENVIAR ÁUDIO (Dentro do onstop do MediaRecorder) ---
    // Ajuste apenas a parte do reader.onloadend dentro do seu startRecording existente:



    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);

                reader.onloadend = () => {
                    const currentName = leadData.nome?.trim() ||
                        localStorage.getItem('chat_user_name') ||
                        user?.displayName ||
                        "Cliente";

                    sendMessage(userId, {
                        audio: reader.result,
                        text: "🎤 Áudio",
                        sender: 'client',
                        senderName: currentName,
                        type: 'audio'
                    }, currentName);
                };
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Erro ao acessar microfone:", err);
            toast.error("Microfone não autorizado.");
        }
    };


    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
    };




    // Dentro do FloatingChat, logo após os seus outros hooks
    const isTypingRef = useRef(false);

    useEffect(() => {
        // Usamos 'userId' que é o ID que você já definiu na linha 44
        if (!userId) return;

        // Se o campo estiver vazio, limpa o status
        if (message.length === 0) {
            if (isTypingRef.current) {
                updateTypingStatus(userId, false, false); // isAdmin = false
                isTypingRef.current = false;
            }
            return;
        }

        // Se começou a digitar e ainda não avisou o Firebase
        if (!isTypingRef.current) {
            updateTypingStatus(userId, true, false); // isAdmin = false
            isTypingRef.current = true;
        }

        // Timer para limpar o status após 3 segundos de inatividade
        const timeout = setTimeout(() => {
            updateTypingStatus(userId, false, false);
            isTypingRef.current = false;
        }, 3000);

        return () => clearTimeout(timeout);
    }, [message, userId]); // Escuta a variável 'message' do seu input

    // Verificamos se o ADMIN está digitando para este usuário específico
    const isAdminTyping = chatData?.typingAdmin === true;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {isOpen && (
                <div className="pointer-events-auto bg-background w-[360px] h-[550px] rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300 mb-4">

                    {/* HEADER */}
                    <div className="bg-linaclyn-red p-5 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black text-sm border border-white/30">LC</div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-linaclyn-red rounded-full"></div>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm leading-tight">LinaClyn Suporte</h4>
                                <p className="text-[10px] text-white/80">Online agora</p>
                            </div>
                        </div>
                        <button onClick={handleLogoutChat} title="Sair do chat" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors mr-1">
                            <Trash2 size={16} />
                        </button>
                        <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {!user && !hasIdentified ? (
                        /* FORMULÁRIO DE IDENTIFICAÇÃO */
                        <div className="flex-1 p-8 flex flex-col justify-center bg-zinc-50 dark:bg-zinc-950 space-y-6">
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-linaclyn-red/10 text-linaclyn-red rounded-full flex items-center justify-center mx-auto mb-2">
                                    <MessageCircle size={32} />
                                </div>
                                <h3 className="font-black text-xl text-foreground">Inicie seu chat</h3>
                                <p className="text-sm text-muted-foreground">Como podemos te chamar?</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Seu Nome</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-linaclyn-red transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Ex: João Silva"
                                            className="w-full pl-10 pr-4 py-3 bg-background border rounded-2xl outline-none focus:ring-2 ring-linaclyn-red/20 focus:border-linaclyn-red transition-all"
                                            onChange={(e) => setLeadData({ ...leadData, nome: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">WhatsApp</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-linaclyn-red transition-colors" size={18} />
                                        <input
                                            type="tel"
                                            placeholder="(00) 00000-0000"
                                            className="w-full pl-10 pr-4 py-3 bg-background border rounded-2xl outline-none focus:ring-2 ring-linaclyn-red/20 focus:border-linaclyn-red transition-all"
                                            onChange={(e) => setLeadData({ ...leadData, whatsapp: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleStartChat} className="w-full bg-linaclyn-red text-white py-4 rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                                ENTRAR NO CHAT
                            </button>
                        </div>
                    ) : (
                        /* CHAT ATIVO - HISTÓRICO REAL */
                        <>
                            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                                {chatHistory.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                                        <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] shadow-sm relative group ${msg.sender === 'client'
                                            ? 'bg-linaclyn-red text-white rounded-tr-none'
                                            : 'bg-background border text-foreground rounded-tl-none'
                                            }`}>

                                            {/* TEXTO */}
                                            {msg.type === 'text' && (
                                                <p className="leading-relaxed font-medium whitespace-pre-wrap">
                                                    {msg.text}
                                                    {msg.isEdited && <span className="text-[9px] opacity-50 block mt-1">(editado)</span>}
                                                </p>
                                            )}

                                            {/* IMAGEM */}
                                            {msg.type === 'image' && (
                                                <img src={msg.image} className="rounded-lg max-h-60 w-full object-cover cursor-pointer" alt="Enviada" />
                                            )}

                                            {/* ÁUDIO */}
                                            {msg.type === 'audio' && (
                                                <audio src={msg.audio} controls className="w-48 h-8 brightness-95" />
                                            )}

                                            {/* --- BOTÕES DE AÇÃO (Aparecem no hover) --- */}
                                            {msg.sender === 'client' && (
                                                <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                                                    {/* Botão Deletar */}
                                                    <button
                                                        onClick={() => deleteMessage(userId, msg.id)}
                                                        className="p-1.5 bg-white border rounded-full text-red-500 hover:bg-red-50 shadow-sm"
                                                        title="Apagar"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>

                                                    {/* Botão Editar (Só aparece se for texto) */}
                                                    {msg.type === 'text' && (
                                                        <button
                                                            onClick={() => startEditing(msg)}
                                                            className="p-1.5 bg-white border rounded-full text-blue-500 hover:bg-blue-50 shadow-sm"
                                                            title="Editar"
                                                        >
                                                            <Pencil size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {/* TIMESTAMP E CHECK */}
                                            <div className={`text-[9px] mt-1 flex items-center gap-1 ${msg.sender === 'client' ? 'justify-end text-white/70' : 'text-muted-foreground'}`}>
                                                {msg.timestamp} {msg.sender === 'client' && <CheckCheck size={10} />}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* INDICADOR DE DIGITANDO */}
                                {isAdminTyping && (
                                    <div className="flex items-center gap-2 animate-pulse ml-2 mb-4">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-linaclyn-red rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-linaclyn-red rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1.5 h-1.5 bg-linaclyn-red rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                        <span className="text-[11px] font-bold text-linaclyn-red italic">
                                            Suporte LinaClyn está digitando...
                                        </span>
                                    </div>
                                )}
                            </div>


                            {/* INPUT DE MENSAGENS */}
                            <div className="p-4 bg-background border-t">
                                <div className={`flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-3 py-2 border-2 transition-all ${isRecording ? 'border-red-500' : 'border-transparent focus-within:border-linaclyn-red/50'}`}>

                                    {!isRecording && (
                                        <button onClick={() => fileInputRef.current.click()} className="text-muted-foreground hover:text-linaclyn-red transition-colors p-1">
                                            <ImageIcon size={20} />
                                            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                                        </button>
                                    )}

                                    <input
                                        type="text"
                                        value={message}
                                        disabled={isRecording}
                                        // MUDANÇA AQUI: O onChange só altera o estado. O useEffect cuida do resto!
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder={isRecording ? "Gravando áudio..." : "Escreva uma mensagem..."}
                                        className="flex-1 bg-transparent border-none outline-none text-sm py-1 placeholder:text-muted-foreground/60"
                                    />

                                    {message.trim() ? (
                                        <button onClick={handleSend} className="bg-linaclyn-red text-white p-2 rounded-xl hover:scale-105 transition-transform shadow-md">
                                            <Send size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={isRecording ? stopRecording : startRecording}
                                            className={`p-2 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-muted-foreground hover:bg-zinc-200'}`}
                                        >
                                            {isRecording ? <Square size={16} /> : <Mic size={20} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* BOTÃO FLUTUANTE PARA ABRIR/FECHAR */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto bg-linaclyn-red text-white p-5 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all group relative"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-zinc-950 rounded-full animate-bounce"></span>
                )}
            </button>
        </div>
    );
}