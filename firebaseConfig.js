// Importa o módulo principal do Firebase e os serviços de autenticação e Firestore
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

// Configuração do Firebase para conectar seu app com o projeto Firebase específico
const firebaseConfig = {
// Configuração do Firebase (deve ser criado pelo utilizador)

};

// Verifica se já existe uma instância do Firebase inicializada
// Evita inicializar múltiplas vezes quando o app recarrega
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig); // Inicializa o Firebase com a configuração
}

// Exporta a instância do serviço de autenticação para uso em outras partes do app
export const auth = firebase.auth();

// Exporta a instância do Firestore (banco de dados NoSQL) para manipular dados
export const database = firebase.firestore();

// Exporta o objeto firebase completo para outros usos, caso necessário
export default firebase;
