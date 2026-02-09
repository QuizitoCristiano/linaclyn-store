

// const finalizarPedido = async (metodo, stripeData = null) => {
//     if (cartItems.length === 0) return toast.error("Carrinho vazio!");
//     setLoading(true);

//     try {
//         const orderId = `LINA-${Date.now()}`;
//         const userId = user ? user.uid : formData.email.toLowerCase().trim();

//         // 1. LIMPEZA DE DADOS PARA O BANCO (Removendo máscaras)
//         const secureCustomerData = {
//             ...formData,
//             cpf: formData.cpf.replace(/\D/g, ""),
//             whatsapp: formData.whatsapp.replace(/\D/g, ""),
//             cep: formData.cep.replace(/\D/g, ""),
//         };

//         // 2. MONTAGEM DO OBJETO DO PEDIDO
//         const orderData = {
//             orderId,
//             userId,
//             customer: secureCustomerData,
//             items: cartItems,
//             total: totalFinal,
//             metodoPagamento: metodo,
//             // Aqui salvamos o Token da Stripe ou null se for PIX
//             stripePaymentToken: stripeData?.id || null,
//             status: metodo === 'PIX' ? 'aguardando_pagamento' : 'pago',
//             createdAt: serverTimestamp()
//         };

//         // 3. OPERAÇÕES NO FIREBASE (Atomicidade)
//         // Salva o pedido
//         await setDoc(doc(db, "orders", orderId), orderData);

//         // Atualiza/Cria o perfil do usuário com o endereço mais recente
//         await setDoc(doc(db, "users", userId), {
//             ...secureCustomerData,
//             lastOrder: orderId,
//             updatedAt: serverTimestamp()
//         }, { merge: true });

//         // 4. SUCESSO
//         setLastOrder(orderData);
//         setShowSuccess(true);
//         if (clearCart) clearCart();

//         toast.success(metodo === 'PIX' ? "PIX Gerado com Sucesso!" : "Pagamento Aprovado!");

//     } catch (error) {
//         console.error("Erro Crítico no Checkout:", error);
//         toast.error("Erro ao processar transação segura.");
//     } finally {
//         setLoading(false);
//     }
// };











// {
//     step === 'payment' && (
//         <div className="space-y-6 animate-in fade-in duration-500">
//             <Elements stripe={stripePromise}>
//                 {(() => {
//                     if (loading) {
//                         return (
//                             <div className="flex flex-col items-center justify-center p-12 space-y-4">
//                                 <ShieldCheck className="text-emerald-500 animate-pulse" size={48} />
//                                 <p className="font-black uppercase text-[10px] tracking-[0.2em] text-center dark:text-white">
//                                     Criptografando Transação...
//                                 </p>
//                             </div>
//                         );
//                     }

//                     if (!showCardForm && !showPixPayment) {
//                         return (
//                             <div className="space-y-6">
//                                 <div className="bg-zinc-100 dark:bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-white/5 text-center">
//                                     <p className="text-[10px] text-zinc-500 uppercase font-black mb-1 tracking-widest">Total com Entrega</p>
//                                     <h2 className="text-5xl font-black italic dark:text-white">R$ {totalFinal.toFixed(2)}</h2>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <button
//                                         onClick={() => setShowPixPayment(true)}
//                                         className="p-6 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center gap-2 shadow-xl"
//                                     >
//                                         <Zap size={20} /> PIX
//                                     </button>
//                                     <button
//                                         onClick={() => setShowCardForm(true)}
//                                         className="p-6 border-2 border-zinc-900 dark:border-white rounded-3xl font-black uppercase hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center gap-2 dark:text-white"
//                                     >
//                                         <CreditCard size={20} /> CARTÃO
//                                     </button>
//                                 </div>

//                                 <button onClick={prevStep} className="w-full text-[10px] font-black uppercase text-zinc-400 py-2">
//                                     <ChevronLeft size={12} className="inline mr-1" /> Voltar para entrega
//                                 </button>
//                             </div>
//                         );
//                     }

//                     if (showPixPayment) {
//                         return (
//                             <PixSecurePayment
//                                 total={totalFinal}
//                                 orderId={`LINA-${Date.now()}`}
//                                 inputStyle={inputStyle}
//                                 loading={loading}
//                                 onCancel={() => setShowPixPayment(false)}
//                                 onConfirm={() => finalizarPedido('PIX')}
//                             />
//                         );
//                     }

//                     if (showCardForm) {
//                         return (
//                             <CardSecureForm
//                                 total={totalFinal}
//                                 inputStyle={inputStyle}
//                                 loading={loading}
//                                 onCancel={() => setShowCardForm(false)}
//                                 onConfirm={(token) => finalizarPedido('CARTAO', token)}
//                             />
//                         );
//                     }
//                 })()}
//             </Elements>
//         </div>
//     )
// }