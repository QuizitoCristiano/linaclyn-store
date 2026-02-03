import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, Image as ImageIcon, Pencil, Trash2, Square } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

export function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const { user } = useAuth();
    const { allChats, sendMessage, deleteMessage } = useChat();

    const userId = user?.email || "anonimo";
    const chatHistory = allChats[userId] || [
        { id: 1, text: "Olá! Como podemos ajudar?", sender: 'admin', type: 'text', clientName: "Suporte" }
    ];

    const fileInputRef = useRef(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, isOpen]);

    const handleSend = () => {
        if (!message.trim()) return;
        if (editingId) {
            sendMessage(userId, { id: editingId, text: message, sender: 'user', type: 'text', isEdited: true }, user?.name);
            setEditingId(null);
        } else {
            sendMessage(userId, { text: message, sender: 'user', type: 'text' }, user?.name);
        }
        setMessage('');
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
                    sendMessage(userId, { audio: reader.result, sender: 'user', type: 'audio' }, user?.name);
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
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                sendMessage(userId, { image: reader.result, sender: 'user', type: 'image' }, user?.name);
            };
        } else if (file) {
            toast.error("Imagem muito pesada (máx 5MB)");
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="bg-linaclyn-red text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <MessageCircle size={28} />
                </button>
            )}

            {isOpen && (
                <div className="bg-background w-[350px] h-[520px] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-linaclyn-red p-4 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">LC</div>
                            <div>
                                <span className="font-bold text-sm block leading-none">Suporte LinaClyn</span>
                                <span className="text-[10px] opacity-80 italic">Online agora</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Área de Mensagens */}
                    <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/10">
                        {chatHistory.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm relative group shadow-sm ${msg.sender === 'user'
                                    ? 'bg-linaclyn-red text-white rounded-tr-none'
                                    : 'bg-card border border-border text-foreground rounded-tl-none'
                                    }`}>

                                    {/* Conteúdo da Mensagem */}
                                    {msg.type === 'text' && (
                                        <p className="leading-relaxed">
                                            {msg.text} {msg.isEdited && <small className="opacity-60 text-[9px] block">(editada)</small>}
                                        </p>
                                    )}

                                    {msg.type === 'image' && (
                                        <div className="overflow-hidden rounded-lg">
                                            <img src={msg.image} className="max-h-60 w-full object-cover" alt="Envio" />
                                        </div>
                                    )}

                                    {msg.type === 'audio' && (
                                        <div className="min-w-[210px] py-1">
                                            <audio src={msg.audio} controls className="w-full h-10" />
                                        </div>
                                    )}

                                    {/* Ações: Só aparecem para mensagens do usuário (Cliente) */}
                                    {msg.sender === 'user' && (
                                        <div className="absolute top-0 -left-14 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => deleteMessage(userId, msg.id)}
                                                className="p-1.5 bg-background border border-border rounded-full text-muted-foreground hover:text-red-500 shadow-sm"
                                                title="Apagar"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                            {msg.type === 'text' && (
                                                <button
                                                    onClick={() => { setEditingId(msg.id); setMessage(msg.text); }}
                                                    className="p-1.5 bg-background border border-border rounded-full text-muted-foreground hover:text-linaclyn-red shadow-sm"
                                                    title="Editar"
                                                >
                                                    <Pencil size={12} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer / Input */}
                    <div className="p-4 bg-background border-t border-border">
                        <div className="flex items-center gap-2 bg-secondary rounded-2xl px-3 py-2 border border-transparent focus-within:border-linaclyn-red transition-all shadow-inner">
                            {!isRecording && (
                                <button onClick={() => fileInputRef.current.click()} className="text-muted-foreground hover:text-linaclyn-red transition-colors">
                                    <ImageIcon size={20} />
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </button>
                            )}

                            <input
                                type="text"
                                value={message}
                                disabled={isRecording}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={isRecording ? "Gravando áudio..." : "Sua mensagem..."}
                                className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground/60"
                            />

                            {message.trim() ? (
                                <button onClick={handleSend} className="text-linaclyn-red hover:scale-110 transition-transform">
                                    <Send size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={`${isRecording ? 'text-red-500 animate-pulse' : 'text-muted-foreground hover:text-linaclyn-red'} transition-colors`}
                                >
                                    {isRecording ? <Square size={20} /> : <Mic size={20} />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}