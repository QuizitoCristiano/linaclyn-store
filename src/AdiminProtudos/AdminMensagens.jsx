import React, { useState, useRef, useEffect } from 'react';
import {
    Search, Send, User, ChevronLeft, MessageSquare,
    Image as ImageIcon, Trash2, Pencil, Mic, Square, Phone
} from 'lucide-react';
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminMensagens() {
    const { allChats, sendMessage, deleteMessage } = useChat();
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [reply, setReply] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

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


    // Lista de contatos formatada
    const contactList = Object.keys(allChats).map(uid => {
        const history = allChats[uid];
        const lastMessage = history[history.length - 1];

        // 1. Procura o nome dentro de qualquer mensagem do histórico (senderName)
        // 2. Se for o Ricardo (pelo UID dele), o sistema vai achar o nome que ele usou ao logar
        const clientName = history.find(m => m.senderName)?.senderName ||
            history.find(m => m.clientName)?.clientName ||
            (uid.startsWith('lead_') ? "Visitante" : "Cliente");

        return {
            uid: uid,
            name: clientName, // Aqui agora vai aparecer "Ricardo" corretamente
            lastMsg: lastMessage?.type === 'image' ? '📷 Foto' : lastMessage?.type === 'audio' ? '🎤 Áudio' : lastMessage?.text,
            time: lastMessage?.timestamp || "",
            isLead: uid.startsWith('lead_'),
        };
    }).filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));


    // Pega os dados do contato selecionado para exibir no cabeçalho
    const selectedContact = contactList.find(c => c.uid === selectedUserId);

    const handleSend = () => {
        if (!reply.trim() || !selectedUserId) return;

        const payload = {
            text: reply,
            sender: 'admin', // Identificador essencial
            type: 'text',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAdmin: true // Adicione isso para facilitar a regra de estilo no cliente
        };

        if (editingId) {
            // Use "LinaClyn Suporte" para bater com o cabeçalho que você já tem
            sendMessage(selectedUserId, { ...payload, id: editingId, isEdited: true }, "LinaClyn Suporte");
            setEditingId(null);
        } else {
            sendMessage(selectedUserId, payload, "LinaClyn Suporte");
        }
        setReply('');
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
                }, "Suporte LinaClyn");
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
                    }, "Suporte LinaClyn");
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
                <div className="p-6 border-b border-border bg-card/30">
                    <h2 className="text-xl font-black flex items-center gap-2 mb-4">
                        <MessageSquare className="text-linaclyn-red" size={24} /> Chats
                    </h2>
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

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {contactList.length === 0 && (
                        <p className="p-6 text-center text-xs text-muted-foreground">Nenhuma conversa encontrada.</p>
                    )}
                    {contactList.map((contact) => (
                        <div
                            key={contact.uid}
                            onClick={() => setSelectedUserId(contact.uid)}
                            className={`p-4 flex items-center gap-3 cursor-pointer border-b border-border/10 transition-all ${selectedUserId === contact.uid ? 'bg-linaclyn-red/10 border-l-4 border-l-linaclyn-red' : 'hover:bg-muted/50'}`}
                        >
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black shrink-0 ${contact.isLead ? 'bg-orange-500' : 'bg-linaclyn-red'}`}>
                                    {contact.name.charAt(0)}
                                </div>
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
                        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-zinc-50/50 dark:bg-zinc-950/20">
                            {allChats[selectedUserId]?.map((msg) => {
                                const isMe = msg.sender === 'admin';
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] p-4 rounded-3xl relative group shadow-sm transition-all ${isMe
                                            ? 'bg-linaclyn-red text-white rounded-tr-none'
                                            : 'bg-zinc-800 text-white rounded-tl-none border border-white/5'
                                            }`}>

                                            {msg.type === 'text' && <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>}
                                            {msg.type === 'image' && <img src={msg.image} className="max-h-80 rounded-xl" alt="Mídia enviada" />}
                                            {msg.type === 'audio' && <audio src={msg.audio} controls className={`h-10 ${isMe ? 'invert' : ''}`} />}

                                            <div className={`text-[9px] mt-2 font-bold ${isMe ? 'text-white/60 text-right' : 'text-zinc-400'}`}>
                                                {msg.timestamp} {msg.isEdited && "(editado)"}
                                            </div>

                                            {/* Botão de deletar para o admin */}
                                            <button
                                                onClick={() => deleteMessage(selectedUserId, msg.id)}
                                                className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ÁREA DE INPUT DE RESPOSTA */}
                        <div className="p-6 border-t border-border bg-card">
                            <div className="flex items-center gap-3 bg-secondary/80 rounded-2xl px-5 py-3 focus-within:ring-2 ring-linaclyn-red/20 transition-all">
                                <button onClick={() => fileInputRef.current.click()} className="text-muted-foreground hover:text-linaclyn-red transition-transform hover:scale-110">
                                    <ImageIcon size={22} />
                                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                                </button>

                                <input
                                    type="text"
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={`Responder para ${selectedContact?.name}...`}
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium"
                                />

                                {reply.trim().length > 0 ? (
                                    <button onClick={handleSend} className="bg-linaclyn-red text-white p-2.5 rounded-xl hover:scale-110 shadow-lg transition-all">
                                        <Send size={20} />
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