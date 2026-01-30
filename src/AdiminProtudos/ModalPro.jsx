import React, { useState, useEffect } from "react";
import { X, Upload, Save, DollarSign, Package, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export function ModalProduto({ isOpen, setIsOpen, produtoEdicao, aoSalvar }) {
    // ESTADOS DOS CAMPOS
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [descricao, setDescricao] = useState("");
    const [estoque, setEstoque] = useState(0); // Estado de estoque integrado
    const [imagem, setImagem] = useState(null);
    const [preview, setPreview] = useState(null);
    const [erro, setErro] = useState("");

    // Sincroniza os campos quando abre o modal
    useEffect(() => {
        if (isOpen) {
            if (produtoEdicao) {
                setNome(produtoEdicao.nome || "");
                setPreco(produtoEdicao.preco || "");
                setDescricao(produtoEdicao.descricao || "");
                setEstoque(produtoEdicao.estoque || 0);
                setPreview(produtoEdicao.img || null);
            } else {
                setNome("");
                setPreco("");
                setDescricao("");
                setEstoque(0);
                setPreview(null);
                setImagem(null);
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
            setErro("");
        }
    };

    const validarEEnviar = () => {
        // Validação básica: Nome, Preço e Imagem (A descrição está liberada!)
        if (!nome || !preco || (!preview && !imagem)) {
            setErro("Nome, Preço e Imagem são obrigatórios!");
            return;
        }

        const novoProduto = {
            id: produtoEdicao?.id || Date.now(),
            nome,
            preco: parseFloat(preco),
            descricao,
            estoque: parseInt(estoque) || 0,
            img: preview,
            status: parseInt(estoque) > 0 ? "Ativo" : "Sem Estoque"
        };

        aoSalvar(novoProduto);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[600px] bg-background border-border rounded-[2rem] p-0 overflow-hidden outline-none shadow-2xl">

                {/* Header */}
                <div className="bg-muted/50 p-8 border-b border-border">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
                            {produtoEdicao ? "Editar" : "Cadastrar"} <span className="text-linaclyn-red">Produto</span>
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">
                            Controle de estoque LinaClyn.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Alerta de Erro */}
                    {erro && (
                        <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-center gap-2 text-red-500 text-xs font-bold animate-pulse">
                            <AlertCircle className="w-4 h-4" />
                            {erro}
                        </div>
                    )}

                    {/* Imagem */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Imagem do Produto *</Label>
                        <div className={`relative h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center bg-muted/20 ${!preview && erro ? 'border-red-500' : 'border-border hover:border-linaclyn-red'}`}>
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
                            ) : (
                                <label htmlFor="file-upload-modal" className="cursor-pointer flex flex-col items-center gap-2">
                                    <Upload className="w-8 h-8 text-linaclyn-red" />
                                    <span className="text-[10px] font-black uppercase">Selecionar Foto</span>
                                </label>
                            )}
                            <input id="file-upload-modal" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </div>
                    </div>

                    {/* Nome e Preço */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome *</Label>
                            <Input value={nome} onChange={(e) => setNome(e.target.value)} className="bg-muted/30 border-border h-12 rounded-xl font-bold uppercase text-xs" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preço (R$) *</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} className="pl-10 bg-muted/30 border-border h-12 rounded-xl font-bold text-xs" />
                            </div>
                        </div>
                    </div>

                    {/* ESTOQUE - Campo que faltava */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Quantidade em Estoque *</Label>
                        <div className="relative">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="number"
                                value={estoque}
                                onChange={(e) => setEstoque(e.target.value)}
                                className="pl-10 bg-muted/30 border-border h-12 rounded-xl font-bold text-xs"
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Descrição Técnica</Label>
                        <Textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Descreva o produto..."
                            className="bg-muted/30 border-border rounded-xl min-h-[100px] text-xs font-medium focus:ring-linaclyn-red"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 bg-muted/20 border-t border-border flex gap-3">
                    <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1 h-12 rounded-xl font-black uppercase text-xs border-border">
                        Cancelar
                    </Button>
                    <Button onClick={validarEEnviar} className="flex-1 h-12 rounded-xl font-black uppercase text-xs bg-linaclyn-red hover:bg-red-700 text-white shadow-lg">
                        <Save className="w-4 h-4 mr-2" />
                        Confirmar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}