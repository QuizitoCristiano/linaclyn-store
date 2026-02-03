import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, User, ChevronLeft, MessageSquare, Image as ImageIcon, Trash2, Pencil, Mic, Square } from 'lucide-react';
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

    // Auto-scroll para a última mensagem ao trocar de chat ou receber nova msg
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedUserId, allChats]);

    // Lista de contatos filtrada e formatada
    const contactList = Object.keys(allChats).map(uid => {
        const history = allChats[uid];
        const lastMessage = history[history.length - 1];
        return {
            uid: uid,
            name: lastMessage?.clientName || "Cliente",
            lastMsg: lastMessage?.type === 'image' ? '📷 Foto' : lastMessage?.type === 'audio' ? '🎤 Áudio' : lastMessage?.text,
            time: lastMessage?.timestamp || "",
        };
    }).filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // --- LÓGICA DE TEMPO (ESTRATÉGIA 10 MINUTOS) ---
    const canEdit = (timestamp) => {
        if (!timestamp) return false;
        const [hours, minutes] = timestamp.split(':').map(Number);
        const now = new Date();
        const msgTime = new Date();
        msgTime.setHours(hours, minutes, 0);

        const diffInMinutes = (now - msgTime) / (1000 * 60);
        return diffInMinutes >= 0 && diffInMinutes < 10;
    };

    // --- AÇÕES DE ENVIO ---
    const handleSend = () => {
        if (!reply.trim() || !selectedUserId) return;

        if (editingId) {
            sendMessage(selectedUserId, { id: editingId, text: reply, sender: 'admin', type: 'text', isEdited: true }, "Suporte LinaClyn");
            setEditingId(null);
            toast.success("Mensagem editada");
        } else {
            sendMessage(selectedUserId, { text: reply, sender: 'admin', type: 'text' }, "Suporte LinaClyn");
        }
        setReply('');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && selectedUserId) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                sendMessage(selectedUserId, { image: reader.result, sender: 'admin', type: 'image' }, "Suporte LinaClyn");
            };
        }
    };

    // --- LÓGICA DE ÁUDIO ---
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
                    sendMessage(selectedUserId, { audio: reader.result, sender: 'admin', type: 'audio' }, "Suporte LinaClyn");
                };
            };
            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            toast.error("Erro ao acessar microfone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            mediaRecorder.current.stream.getTracks().forEach(t => t.stop());
        }
    };

    return (
        <div className="flex h-[calc(100vh-140px)] bg-card rounded-2xl overflow-hidden border border-border shadow-xl font-sans">

            {/* BARRA LATERAL */}
            <div className={`${selectedUserId ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-border flex-col bg-background/40`}>
                <div className="p-4 border-b border-border bg-card/50">
                    <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-foreground">
                        <MessageSquare className="text-linaclyn-red" size={20} /> Atendimento
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-secondary rounded-lg py-2 pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-linaclyn-red transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {contactList.map((contact) => (
                        <div
                            key={contact.uid}
                            onClick={() => setSelectedUserId(contact.uid)}
                            className={`p-4 flex items-center gap-3 cursor-pointer border-b border-border/30 transition-all ${selectedUserId === contact.uid ? 'bg-muted border-l-4 border-l-linaclyn-red' : 'hover:bg-muted/30'}`}
                        >
                            <div className="w-10 h-10 bg-linaclyn-red/10 rounded-full flex items-center justify-center text-linaclyn-red font-bold uppercase">
                                {contact.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold truncate">{contact.name}</span>
                                    <span className="text-muted-foreground">{contact.time}</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground truncate">{contact.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ÁREA CENTRAL DO CHAT */}
            <div className={`${!selectedUserId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-background`}>
                {selectedUserId ? (
                    <>
                        {/* Header */}
                        <div className="p-3 border-b border-border flex items-center justify-between bg-card/50">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedUserId(null)}>
                                    <ChevronLeft size={20} />
                                </Button>
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm">{contactList.find(c => c.uid === selectedUserId)?.name}</span>
                                    <span className="text-[10px] text-green-500 font-medium">Ativo agora</span>
                                </div>
                            </div>
                        </div>

                        {/* Corpo das Mensagens */}
                        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/5">
                            {allChats[selectedUserId]?.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl relative group shadow-sm ${msg.sender === 'admin' ? 'bg-linaclyn-red text-white rounded-tr-none' : 'bg-secondary text-foreground rounded-tl-none'
                                        }`}>

                                        {msg.type === 'text' && (
                                            <p className="text-sm leading-relaxed">
                                                {msg.text}
                                                {msg.isEdited && <small className="opacity-60 text-[9px] block italic mt-1">(editada)</small>}
                                            </p>
                                        )}

                                        {msg.type === 'image' && (
                                            <img src={msg.image} className="rounded-lg max-h-72 w-full object-contain cursor-pointer"
                                                alt="Mídia" onClick={() => window.open(msg.image, '_blank')} />
                                        )}

                                        {msg.type === 'audio' && (
                                            <div className="min-w-[220px] py-1">
                                                <audio src={msg.audio} controls className={`w-full h-10 ${msg.sender === 'admin' ? 'brightness-125' : ''}`} />
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between gap-4 mt-1">
                                            <span className="text-[9px] opacity-60 uppercase">{msg.timestamp}</span>
                                        </div>

                                        {/* Ações Flutuantes */}
                                        <div className={`absolute top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ${msg.sender === 'admin' ? '-left-16' : '-right-10'}`}>
                                            <button onClick={() => deleteMessage(selectedUserId, msg.id)} className="p-1.5 bg-background border rounded-full text-muted-foreground hover:text-red-500 shadow-md">
                                                <Trash2 size={12} />
                                            </button>
                                            {msg.sender === 'admin' && msg.type === 'text' && canEdit(msg.timestamp) && (
                                                <button onClick={() => { setEditingId(msg.id); setReply(msg.text); }} className="p-1.5 bg-background border rounded-full text-muted-foreground hover:text-blue-500 shadow-md">
                                                    <Pencil size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input de Mensagem Inteligente */}
                        <div className="p-4 border-t border-border bg-card">
                            {editingId && (
                                <div className="flex justify-between items-center mb-2 px-2">
                                    <span className="text-[10px] text-linaclyn-red font-bold animate-pulse">MODO EDIÇÃO ATIVO</span>
                                    <button onClick={() => { setEditingId(null); setReply(''); }} className="text-[10px] underline hover:text-linaclyn-red">Cancelar</button>
                                </div>
                            )}
                            <div className={`flex items-center gap-2 bg-secondary rounded-xl px-4 py-2 border-2 transition-all ${editingId ? 'border-blue-400 bg-blue-50/5' : 'border-transparent focus-within:border-linaclyn-red'}`}>

                                {!isRecording && (
                                    <button onClick={() => fileInputRef.current.click()} className="text-muted-foreground hover:text-linaclyn-red transition-colors">
                                        <ImageIcon size={20} />
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </button>
                                )}

                                <input
                                    type="text"
                                    value={reply}
                                    disabled={isRecording}
                                    onChange={(e) => setReply(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={isRecording ? "Gravando áudio..." : "Escreva uma resposta..."}
                                    className="flex-1 bg-transparent border-none outline-none text-sm py-1 placeholder:text-muted-foreground/50"
                                />

                                {reply.trim() ? (
                                    <button onClick={handleSend} className="bg-linaclyn-red text-white p-2 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-md">
                                        <Send size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        className={`p-2 rounded-lg transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-muted text-muted-foreground hover:text-linaclyn-red'}`}
                                    >
                                        {isRecording ? <Square size={18} /> : <Mic size={18} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 opacity-40">
                        <MessageSquare size={64} className="mb-4" />
                        <p className="font-medium">Selecione um atendimento para gerenciar mídias e mensagens.</p>
                    </div>
                )}
            </div>
        </div>
    );
}