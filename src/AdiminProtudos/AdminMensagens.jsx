import React, { useState, useRef, useEffect } from 'react';
import {
    Search, Send, User, ChevronLeft, MessageSquare,
    Image as ImageIcon, Trash2, Pencil, Mic, Square, Phone, Check
} from 'lucide-react';
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminMensagens() {
    const { allChats, sendMessage, deleteMessage, editMessage, updateTypingStatus, isOfficeHours } = useChat();
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [reply, setReply] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const inputRef = useRef(null); // Nova ref para o input de texto

    const fileInputRef = useRef(null);
    const scrollRef = useRef(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    // Auto-scroll para a última mensagem quando mudar o chat ou chegar mensagem nova
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [selectedUserId, allChats]);

    // 1. Crie uma referência para controlar se já avisamos o banco que estamos digitando
    const isTypingRef = useRef(false);

    useEffect(() => {
        if (!selectedUserId) return;

        // Se o campo estiver vazio e a gente estava com status "true", limpa na hora
        if (reply.length === 0) {
            if (isTypingRef.current) {
                updateTypingStatus(selectedUserId, false, true);
                isTypingRef.current = false;
            }
            return;
        }

        // Se o admin começou a digitar e ainda não avisamos o Firebase...
        if (!isTypingRef.current) {
            updateTypingStatus(selectedUserId, true, true);
            isTypingRef.current = true; // Marca que o banco já sabe que estamos digitando
        }

        // Timer para limpar o status se ficar 3 segundos sem apertar nenhuma tecla
        const timeout = setTimeout(() => {
            updateTypingStatus(selectedUserId, false, true);
            isTypingRef.current = false; // Reseta para a próxima vez que começar a digitar
        }, 3000);

        return () => clearTimeout(timeout);
    }, [reply, selectedUserId]);

    // Lista de contatos formatada
    // Lista de contatos formatada (Versão 2.0 - Inteligente e Segura)
    // const contactList = React.useMemo(() => {
    //     return Object.keys(allChats).map(uid => {
    //         const chatData = allChats[uid];
    //         const messages = Array.isArray(chatData) ? chatData : (chatData.messages || []);
    //         const lastMessage = messages[messages.length - 1];

    //         const clientName = chatData.clientName ||
    //             messages.find(m => m.senderName)?.senderName ||
    //             (uid.startsWith('lead_') ? "Visitante" : "Cliente");

    //         const lastUpdate = lastMessage?.timestamp?.toMillis?.() || lastMessage?.timestamp || 0;

    //         return {
    //             uid,
    //             name: clientName,
    //             lastMsg: lastMessage?.type === 'image' ? '📷 Foto' :
    //                 lastMessage?.type === 'audio' ? '🎤 Áudio' :
    //                     lastMessage?.text || "Nova conversa",
    //             time: lastMessage?.timestamp || "",
    //             isLead: uid.startsWith('lead_'),
    //             lastUpdateMillis: lastUpdate,
    //         };
    //     })
    //         .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    //         .sort((a, b) => b.lastUpdateMillis - a.lastUpdateMillis);
    // }, [allChats, searchTerm]);

    // Lista de contatos formatada (Versão Corrigida - Nome do Cliente sempre fixo)
    const contactList = React.useMemo(() => {
        return Object.keys(allChats).map(uid => {
            const chatData = allChats[uid];
            const messages = Array.isArray(chatData) ? chatData : (chatData.messages || []);
            const lastMessage = messages[messages.length - 1];

            // LOGICA DE NOME INFALÍVEL:
            // 1. Tenta pegar o nome salvo no chatData (se não for "Cliente")
            // 2. Se for "Cliente", tenta buscar no LocalStorage (caso o user esteja logado no navegador)
            // 3. Como fallback, usa o que estiver no messages (senderName) desde que não seja o suporte
            let displayName = chatData.clientName;


            // Se o nome for o do suporte ou "Cliente", vamos tentar limpar
            if (!displayName || displayName === "Cliente" || displayName === "Suporte LinaClyn" || displayName === "LinaClyn Suporte") {
                const lastMsgName = lastMessage?.senderName;

                // Só aceita o nome da mensagem se NÃO for do suporte
                if (lastMsgName && !["LinaClyn Suporte", "Suporte LinaClyn", "admin"].includes(lastMsgName)) {
                    displayName = lastMsgName;
                } else {
                    displayName = "Cliente";
                }
            }
            const lastUpdate = lastMessage?.timestamp?.toMillis?.() || lastMessage?.timestamp || 0;
            const respondedByAdmin = lastMessage?.sender === 'admin';

            return {
                uid,
                name: displayName,
                lastMsg: (respondedByAdmin ? "↪️ " : "") + (
                    lastMessage?.type === 'image' ? '📷 Foto' :
                        lastMessage?.type === 'audio' ? '🎤 Áudio' :
                            lastMessage?.text || "Nova conversa"
                ),
                time: lastMessage?.timestamp || "",
                lastUpdateMillis: lastUpdate,
            };
        })
            .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => b.lastUpdateMillis - a.lastUpdateMillis);
    }, [allChats, searchTerm]);
    // Pega os dados do contato selecionado para exibir no cabeçalho
    const selectedContact = contactList.find(c => c.uid === selectedUserId);

    // Adicione o "async" antes do ()
    const handleSend = async () => {
        if (!reply.trim() || !selectedUserId) return;

        const textToSend = reply;
        const currentEditingId = editingId;

        setReply('');
        setEditingId(null);
        isTypingRef.current = false;

        try {
            await updateTypingStatus(selectedUserId, false, true);
            if (currentEditingId) {
                await editMessage(selectedUserId, currentEditingId, textToSend);
            } else {
                const payload = { text: textToSend, sender: 'admin', type: 'text' };
                // MUDANÇA AQUI: Removemos o terceiro parâmetro "LinaClyn Suporte"
                await sendMessage(selectedUserId, payload);
            }
        } catch (err) {
            toast.error("Erro ao enviar mensagem");
        }
    };
    // ... states anteriores

    // MANTENHA ESTA (Lógica Visual)
    const canAction = (createdAt) => {
        if (!createdAt) return false;
        const msgDate = new Date(createdAt);
        const now = new Date();
        const diffInMinutes = (now - msgDate) / 1000 / 60;
        return diffInMinutes < 10;
    };

    // MANTENHA ESTA (Preparação para editar)
    const handleEdit = (msg) => {
        setReply(msg.text);
        setEditingId(msg.id);
        inputRef.current?.focus();
    };




    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && selectedUserId) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                sendMessage(selectedUserId, {
                    image: reader.result,
                    sender: 'admin',
                    type: 'image'
                });
            };
        }
    };

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
                    sendMessage(selectedUserId, {
                        audio: reader.result,
                        sender: 'admin',
                        type: 'audio'
                    });
                };
            };
            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) { toast.error("Erro no microfone"); }
    };

    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            mediaRecorder.current.stream.getTracks().forEach(t => t.stop());
        }
    };



    return (
        <div className="flex h-[calc(100vh-140px)] bg-card rounded-3xl overflow-hidden border border-border shadow-2xl font-sans">


            {/* LISTA DE CONVERSAS (LADO ESQUERDO) */}
            <div className={`${selectedUserId ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-border flex-col bg-background/60 backdrop-blur-xl`}>

                {/* HEADER DA LISTA COM STATUS DE EXPEDIENTE */}
                <div className="p-6 border-b border-border bg-card/30">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-black flex items-center gap-2">
                            <MessageSquare className="text-linaclyn-red" size={24} /> Chats
                        </h2>

                        {/* Badge de Status Dinâmico */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-500 ${isOfficeHours()
                            ? 'bg-green-500/10 border-green-500/20 text-green-500'
                            : 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isOfficeHours() ? 'bg-green-500 animate-pulse' : 'bg-zinc-500'}`}></span>
                            <span className="text-[9px] font-black uppercase tracking-widest">
                                {isOfficeHours() ? "Expediente" : "Offline"}
                            </span>
                        </div>
                    </div>

                    {/* BUSCA */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-secondary/50 rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none border border-transparent focus:border-linaclyn-red transition-all"
                        />
                    </div>
                </div>

                {/* LISTAGEM DE CONTATOS */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {contactList.length === 0 && (
                        <p className="p-6 text-center text-xs text-muted-foreground">Nenhuma conversa encontrada.</p>
                    )}
                    {contactList.map((contact) => (
                        <div
                            key={contact.uid}
                            onClick={() => setSelectedUserId(contact.uid)}
                            className={`p-4 flex items-center gap-3 cursor-pointer border-b border-border/10 transition-all ${selectedUserId === contact.uid
                                ? 'bg-linaclyn-red/10 border-l-4 border-l-linaclyn-red'
                                : 'hover:bg-muted/50'
                                }`}
                        >
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black shrink-0 ${contact.isLead ? 'bg-orange-500' : 'bg-linaclyn-red'
                                    }`}>
                                    {contact.name.charAt(0)}
                                </div>
                                {/* Indicador de Online do Cliente (Pode ser condicional também) */}
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm truncate">{contact.name}</span>
                                    <span className="text-[10px] text-muted-foreground">{contact.time}</span>
                                </div>
                                <p className="text-[11px] truncate text-muted-foreground italic">{contact.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ÁREA DO CHAT (LADO DIREITO) */}
            <div className={`${!selectedUserId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-background/30`}>
                {selectedUserId ? (
                    <>
                        {/* CABEÇALHO DO CHAT SELECIONADO */}
                        <div className="p-4 border-b border-border flex items-center justify-between bg-card/80 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedUserId(null)}>
                                    <ChevronLeft size={24} />
                                </Button>
                                <div>
                                    <span className="font-black text-base">{selectedContact?.name}</span>
                                    <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> ONLINE
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* HISTÓRICO DE MENSAGENS */}
                        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6">
                            {(allChats[selectedUserId]?.messages || []).map((msg) => {
                                const isMe = msg.sender === 'admin';
                                const timeValid = canAction(msg.createdAt);
                                const isText = msg.type === 'text';

                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] p-4 rounded-3xl relative group shadow-sm ${isMe ? 'bg-linaclyn-red text-white rounded-tr-none' : 'bg-zinc-800 text-white rounded-tl-none'
                                            }`}>

                                            {/* Conteúdo da Mensagem */}
                                            {msg.type === 'text' && <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
                                            {msg.type === 'image' && <img src={msg.image} className="max-h-80 rounded-xl" alt="Enviada" />}
                                            {msg.type === 'audio' && <audio src={msg.audio} controls className={`h-10 ${isMe ? 'invert' : ''}`} />}

                                            {/* Rodapé: Hora e etiqueta de editado */}
                                            <div className={`text-[9px] mt-2 font-bold ${isMe ? 'text-white/60 text-right' : 'text-zinc-400'}`}>
                                                {msg.timestamp} {msg.isEdited && <span className="ml-1 text-blue-300 italic">(editado)</span>}
                                            </div>

                                            {/* AÇÕES (BOTÕES AO PASSAR O MOUSE) */}
                                            <div className={`absolute ${isMe ? '-left-20' : '-right-20'} top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all`}>
                                                {isMe && isText && timeValid && (
                                                    <button
                                                        onClick={() => handleEdit(msg)}
                                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors"
                                                        title="Editar mensagem"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteMessage(selectedUserId, msg.id)}
                                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                                    title="Excluir mensagem"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>






                        {/* INDICADOR DE DIGITANDO (Letras bem pequenas) */}
                        {allChats[selectedUserId]?.typingClient && (
                            <div className="flex items-center gap-2 px-6 py-2 animate-pulse">
                                <div className="flex gap-1">
                                    <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce"></span>
                                    <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                                <span className="text-[10px] font-medium text-zinc-500 italic">
                                    O cliente está digitando...
                                </span>
                            </div>
                        )}

                        {/* ÁREA DE INPUT DE RESPOSTA */}
                        <div className="p-6 border-t border-border bg-card">

                            {/* STATUS DE EDIÇÃO - Aparece apenas se houver um editingId */}
                            {editingId && (
                                <div className="flex items-center justify-between mb-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <Pencil size={14} className="animate-pulse" />
                                        <span className="text-xs font-semibold">Alterando mensagem enviada...</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setReply('');
                                        }}
                                        className="text-[11px] bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1 rounded-full transition-colors font-bold uppercase tracking-wider"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-3 bg-secondary/80 rounded-2xl px-5 py-3 focus-within:ring-2 ring-linaclyn-red/20 transition-all">
                                <button onClick={() => fileInputRef.current.click()} className="text-muted-foreground hover:text-linaclyn-red transition-transform hover:scale-110">
                                    <ImageIcon size={22} />
                                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                                </button>

                                <input
                                    type="text"
                                    value={reply}
                                    // LIMPEZA AQUI: Apenas atualize o estado. 
                                    // O useEffect que você já tem no topo do arquivo cuida do Firebase.
                                    onChange={(e) => setReply(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={editingId ? "Escreva a nova versão..." : `Responder para ${selectedContact?.name}...`}
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-muted-foreground/50"
                                />

                                {reply.trim().length > 0 ? (
                                    <button
                                        onClick={handleSend}
                                        className={`${editingId ? 'bg-blue-500' : 'bg-linaclyn-red'} text-white p-2.5 rounded-xl hover:scale-110 shadow-lg transition-all flex items-center gap-2`}
                                    >
                                        {/* Muda o ícone se for edição ou envio novo */}
                                        {editingId ? <Check size={20} /> : <Send size={20} />}
                                    </button>
                                ) : (
                                    <button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        className={`p-2.5 rounded-xl transition-all ${isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-zinc-700 text-zinc-300'}`}
                                    >
                                        {isRecording ? <Square size={20} /> : <Mic size={20} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    /* TELA INICIAL QUANDO NENHUM CHAT ESTÁ SELECIONADO */
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-4 animate-bounce">
                            <MessageSquare size={40} className="text-linaclyn-red" />
                        </div>
                        <h3 className="text-xl font-black text-foreground">Central de Atendimento</h3>
                        <p className="text-muted-foreground text-sm">Selecione uma conversa ao lado para responder seus clientes em tempo real.</p>
                    </div>
                )}
            </div>
        </div>
    );
}