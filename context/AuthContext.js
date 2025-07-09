// Importa as dependências necessárias do React
import React, { createContext, useContext, useEffect, useState } from 'react';
// Importa a instância de configuração do Firebase
import firebase from '../firebaseConfig';

// Cria um contexto para autenticação
const AuthContext = createContext();

// Componente provedor do contexto de autenticação
export function AuthProvider({ children }) {
  // Estado para armazenar o utilizador autenticado
  const [user, setUser] = useState(null);
  // Estado para controlar o carregamento inicial
  const [loading, setLoading] = useState(true);

  // Hook de efeito para observar mudanças na autenticação
  useEffect(() => {
    // Escuta mudanças no estado de autenticação do Firebase
    const unsubscribe = firebase.auth().onAuthStateChanged(currentUser => {
      // Atualiza o estado com o utilizador atual (ou null se deslogado)
      setUser(currentUser);
      // Indica que o carregamento terminou
      setLoading(false);
    });

    // Remove o ouvinte quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  // Função para fazer logout do utilizador
  const logout = () => {
    firebase.auth().signOut()
      .then(() => {
        console.log('utilizador deslogado com sucesso');
      })
      .catch(error => {
        console.error('Erro ao deslogar:', error);
      });
  };

  // Retorna o provedor do contexto com os valores disponíveis
  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {/* Renderiza os filhos apenas quando não estiver mais carregando */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acessar o contexto de autenticação
export function useAuth() {
  return useContext(AuthContext);
}
