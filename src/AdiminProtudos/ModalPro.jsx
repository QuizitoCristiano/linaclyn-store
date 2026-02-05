import React, { useState, useEffect } from "react";
import { Upload, Save, DollarSign, Package, AlertCircle, Star, Tag, X, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";

export function ModalProduto({ isOpen, setIsOpen, produtoEdicao, aoSalvar }) {
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [categoria, setCategoria] = useState("GERAL"); // <-- NOVO ESTADO
    const [descricao, setDescricao] = useState("");
    const [estoque, setEstoque] = useState(0);
    const [destaque, setDestaque] = useState(false);
    const [promocao, setPromocao] = useState(false);
    const [preview, setPreview] = useState(null);
    const [imagem, setImagem] = useState(null);
    const [erro, setErro] = useState("");

    const LIMIT_NOME = 50;
    const LIMIT_DESC = 500;

    useEffect(() => {
        if (isOpen) {
            if (produtoEdicao) {
                setNome(produtoEdicao.nome || "");
                setPreco(produtoEdicao.preco || "");
                setCategoria(produtoEdicao.categoria || "GERAL"); // Seta categoria na edição
                setDescricao(produtoEdicao.descricao || "");
                setEstoque(produtoEdicao.estoque || 0);
                setDestaque(produtoEdicao.destaque || false);
                setPromocao(produtoEdicao.promocao || false);
                setPreview(produtoEdicao.img || null);
            } else {
                setNome(""); setPreco(""); setDescricao(""); setCategoria("GERAL");
                setEstoque(0); setDestaque(false); setPromocao(false);
                setPreview(null); setImagem(null);
            }
            setErro("");
        }
    }, [isOpen, produtoEdicao]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const validarEEnviar = () => {
        if (!nome || !preco || !categoria || (!preview && !imagem)) {
            setErro("Campos obrigatórios ausentes (Nome, Preço, Categoria e Imagem)!");
            return;
        }

        const dadosFinalizados = {
            nome: nome.trim(),
            preco: parseFloat(preco),
            categoria: categoria.trim().toUpperCase(), // Garante que salva em maiúsculo
            descricao: descricao.trim(),
            estoque: parseInt(estoque) || 0,
            destaque,
            promocao,
            img: preview,
            status: parseInt(estoque) > 0 ? "Ativo" : "Sem Estoque"
        };

        // Se for edição, mantém o ID original. Se for novo, NÃO envia ID (Firebase cria sozinho)
        if (produtoEdicao?.id) {
            dadosFinalizados.id = produtoEdicao.id;
        }

        aoSalvar(dadosFinalizados);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] w-[95vw] bg-background border-border rounded-[2.5rem] p-0 overflow-hidden outline-none shadow-2xl text-foreground">

                <div className="bg-muted/50 p-6 md:p-8 border-b border-border">
                    <DialogHeader>
                        <DialogTitle className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">
                            {produtoEdicao ? "Editar" : "Cadastrar"} <span className="text-red-600">Produto</span>
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium uppercase text-[9px] tracking-[0.2em]">
                            Linaclyn Performance System • 2026
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {erro && (
                        <div className="bg-red-600/10 border border-red-600/50 p-4 rounded-2xl flex items-center gap-2 text-red-600 text-[10px] font-black uppercase">
                            <AlertCircle className="w-4 h-4" /> {erro}
                        </div>
                    )}

                    {/* IMAGEM */}
                    <div className="space-y-3">
                        <Label className="text-[9px] font-black text-muted-foreground uppercase ml-2 italic tracking-widest">Mídia do Produto *</Label>
                        <div className="relative h-48 md:h-56 rounded-[2rem] border-2 border-dashed border-border bg-muted/30 flex items-center justify-center group hover:border-red-600/50 transition-all overflow-hidden">
                            {preview ? (
                                <>
                                    <img src={preview} alt="Preview" className="h-full w-full object-contain p-4" />
                                    <button onClick={() => { setPreview(null); setImagem(null); }} className="absolute top-3 right-3 bg-red-600 p-2 rounded-full text-white"><X className="w-3 h-3" /></button>
                                </>
                            ) : (
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
                                    <Upload className="w-6 h-6 text-red-600" />
                                    <span className="text-[9px] font-black uppercase">Adicionar Foto</span>
                                </label>
                            )}
                            <input id="file-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </div>
                    </div>

                    {/* SWITCHES */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`flex items-center justify-between p-4 rounded-[1.2rem] border ${destaque ? 'bg-yellow-500/10 border-yellow-500/40' : 'bg-muted/40 border-border'}`}>
                            <div className="flex items-center gap-2">
                                <Star className={`w-4 h-4 ${destaque ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                                <span className="text-[10px] font-black uppercase">Destaque</span>
                            </div>
                            <Switch checked={destaque} onCheckedChange={setDestaque} />
                        </div>
                        <div className={`flex items-center justify-between p-4 rounded-[1.2rem] border ${promocao ? 'bg-green-500/10 border-green-500/40' : 'bg-muted/40 border-border'}`}>
                            <div className="flex items-center gap-2">
                                <Tag className={`w-4 h-4 ${promocao ? 'text-green-500 fill-green-500' : 'text-muted-foreground'}`} />
                                <span className="text-[10px] font-black uppercase">Oferta</span>
                            </div>
                            <Switch checked={promocao} onCheckedChange={setPromocao} />
                        </div>
                    </div>

                    {/* CAMPOS DE TEXTO */}
                    <div className="space-y-4">
                        {/* NOME */}
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black text-muted-foreground uppercase italic tracking-widest">Nome do Produto</Label>
                            <Input value={nome} onChange={(e) => setNome(e.target.value.slice(0, LIMIT_NOME))} placeholder="NOME DO PRODUTO" className="bg-muted border-border h-11 rounded-xl uppercase text-[11px]" />
                        </div>

                        {/* CATEGORIA (AQUI ESTAVA O SEGREDO!) */}
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black text-muted-foreground uppercase italic tracking-widest">Categoria</Label>
                            <div className="relative">
                                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                <Input value={categoria} onChange={(e) => setCategoria(e.target.value.toUpperCase())} placeholder="EX: SPORT, ACESSÓRIOS, ESTILO" className="pl-9 bg-muted border-border h-11 rounded-xl text-[11px]" />
                            </div>
                        </div>

                        {/* PREÇO E ESTOQUE */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black text-muted-foreground uppercase italic tracking-widest">Preço</Label>
                                <Input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="0.00" className="bg-muted border-border h-11 rounded-xl text-[11px]" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] font-black text-muted-foreground uppercase italic tracking-widest">Estoque</Label>
                                <Input type="number" value={estoque} onChange={(e) => setEstoque(e.target.value)} className="bg-muted border-border h-11 rounded-xl text-[11px]" />
                            </div>
                        </div>

                        {/* DESCRIÇÃO */}
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black text-muted-foreground uppercase italic tracking-widest">Descrição Técnica</Label>
                            <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value.slice(0, LIMIT_DESC))} placeholder="Detalhes do produto..." className="bg-muted border-border rounded-2xl min-h-[100px] text-[11px] resize-none" />
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8 bg-muted/50 border-t border-border flex gap-3">
                    <Button variant="ghost" onClick={() => setIsOpen(false)} className="flex-1 h-12 rounded-xl font-black uppercase text-[9px]">Cancelar</Button>
                    <Button onClick={validarEEnviar} className="flex-1 h-12 rounded-xl font-black uppercase text-[9px] bg-red-600 hover:bg-red-700 text-white shadow-lg">
                        <Save className="w-3 h-3 mr-2" /> Salvar Alterações
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}