import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";

// Função para SALVAR um gasto
export const addExpense = async (description, value, category) => {
  try {
    const docRef = await addDoc(collection(db, "expenses"), {
      description,
      value: parseFloat(value),
      category,
      date: serverTimestamp(),
      month: new Date().getMonth() + 1, // Ex: 2 para Fevereiro
      year: new Date().getFullYear(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Erro ao salvar gasto:", error);
    return { success: false, error };
  }
};

// Função para BUSCAR gastos do mês atual (Sua Planilha Mensal)
export const getMonthlyExpenses = async () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const q = query(
    collection(db, "expenses"),
    where("month", "==", currentMonth),
    where("year", "==", currentYear),
    orderBy("date", "desc"),
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
