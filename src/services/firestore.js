// <-- (Funções para salvar mensagens e gastos)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBkCN8KA-vErrUuAZU-TFqYL7WmuyAsznk",
  authDomain: "linaclyn-store.firebaseapp.com",
  projectId: "linaclyn-store",
  storageBucket: "linaclyn-store.firebasestorage.app",
  messagingSenderId: "1067933587019",
  appId: "1:1067933587019:web:795e5c99e7b8f11f0a5fce",
  measurementId: "G-F901Y75NQQ",
};

// 1. Inicializa o Firebase apenas UMA vez
const app = initializeApp(firebaseConfig);

// 2. Exporta os serviços com 'export' para o resto do sistema
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
