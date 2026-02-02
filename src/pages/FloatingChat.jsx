import React, { useState, useRef } from 'react';
import { MessageCircle, X, Send, Mic, Image as ImageIcon, Pencil, Check, Square, Trash2, Play } from 'lucide-react';
import { toast } from "sonner";

export function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isRecording, setIsRecording] = useState(false);

    const fileInputRef = useRef(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const [chatHistory, setChatHistory] = useState([
        { id: 1, text: "Olá! Como podemos ajudar?", sender: 'admin', type: 'text' }
    ]);

    // --- FUNÇÃO PARA DELETAR QUALQUER ITEM ---
    const deleteMessage = (id) => {
        setChatHistory(prev => prev.filter(msg => msg.id !== id));
        toast.success("Item removido com sucesso!");
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
                const audioUrl = URL.createObjectURL(audioBlob);
                setChatHistory(prev => [...prev, { id: Date.now(), audio: audioUrl, sender: 'user', type: 'audio' }]);
            };
            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            toast.error("Erro ao acessar microfone.");
        }
    };

    const stopRecording = () => {
        mediaRecorder.current.stop();
        setIsRecording(false);
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    };

    const handleSend = () => {
        if (!message.trim()) return;
        if (editingId) {
            setChatHistory(chatHistory.map(msg => msg.id === editingId ? { ...msg, text: message, isEdited: true } : msg));
            setEditingId(null);
        } else {
            setChatHistory([...chatHistory, { id: Date.now(), text: message, sender: 'user', type: 'text' }]);
        }
        setMessage('');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            const imageUrl = URL.createObjectURL(file);
            setChatHistory([...chatHistory, { id: Date.now(), image: imageUrl, sender: 'user', type: 'image' }]);
        } else if (file) {
            toast.error("Imagem muito pesada (máx 5MB)");
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="bg-linaclyn-red text-white p-4 rounded-full shadow-lg">
                    <MessageCircle size={28} />
                </button>
            )}

            {isOpen && (
                <div className="bg-background w-[350px] h-[520px] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-linaclyn-red p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">LC</div>

                            <div>
                                <span className="font-bold text-sm block leading-none">Suporte LinaClyn</span>
                                <span className="text-[10px] opacity-80 italic">Responde rápido</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                    </div>

                    {/* Área de Mensagens */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/10">
                        {chatHistory.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm relative group ${msg.sender === 'user' ? 'bg-linaclyn-red text-white' : 'bg-card border border-border text-foreground'
                                    }`}>

                                    {/* TEXTO */}
                                    {msg.type === 'text' && <p>{msg.text} {msg.isEdited && <small className="opacity-50">(editada)</small>}</p>}

                                    {/* IMAGEM */}
                                    {msg.type === 'image' && <img src={msg.image} className="rounded-lg max-h-40 pointer-events-none" alt="Envio" />}

                                    {/* ÁUDIO */}
                                    {msg.type === 'audio' && (
                                        <div className="flex flex-col gap-2 min-w-[120px]">
                                            <audio src={msg.audio} controls className="w-full h-8 scale-90 origin-left invert dark:invert-0" />
                                        </div>
                                    )}

                                    {/* AÇÕES (Aparecem ao passar o mouse) */}

                                    {msg.sender === 'user' && msg.type === 'text' && (
                                        <div className="absolute -left-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                                            {/* Botão Deletar (Sempre disponível) */}
                                            <button
                                                onClick={() => deleteMessage(msg.id)}
                                                className="p-1.5 bg-secondary rounded-full text-muted-foreground hover:text-red-500 shadow-sm"
                                            >
                                                <Trash2 size={12} />
                                            </button>

                                            {/* Botão Editar (SÓ APARECE SE TIVER MENOS DE 10 MINUTOS) */}
                                            {Date.now() - msg.id < 10 * 60 * 1000 ? (
                                                <button
                                                    onClick={() => { setEditingId(msg.id); setMessage(msg.text); }}
                                                    className="p-1.5 bg-secondary rounded-full text-muted-foreground hover:text-linaclyn-red shadow-sm"
                                                    title="Editar mensagem"
                                                >
                                                    <Pencil size={12} />
                                                </button>
                                            ) : (
                                                /* Opcional: ícone de cadeado ou apenas não mostrar nada */
                                                <span className="p-1.5 opacity-30 cursor-not-allowed" title="Tempo de edição expirado">
                                                    <Pencil size={12} />
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-background border-t border-border">
                        <div className="flex items-center gap-2 bg-secondary rounded-2xl px-3 py-2">
                            {!isRecording && (
                                <button onClick={() => fileInputRef.current.click()} className="text-muted-foreground hover:text-linaclyn-red">
                                    <ImageIcon size={20} />
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </button>
                            )}

                            <input
                                type="text"
                                value={message}
                                disabled={isRecording}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={isRecording ? "Gravando..." : "Sua mensagem..."}
                                className="flex-1 bg-transparent border-none outline-none text-sm text-foreground"
                            />

                            {message.trim() ? (
                                <button onClick={handleSend} className="text-linaclyn-red"><Send size={20} /></button>
                            ) : (
                                <button onClick={isRecording ? stopRecording : startRecording} className={isRecording ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}>
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