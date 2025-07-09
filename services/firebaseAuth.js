import firebase from "firebase";  
import { auth, database } from "../firebaseConfig";

/**
 * Regista um novo utilizador no Firebase Authentication
 * e cria um documento correspondente na base de dados Firestore.
 *
 * @param {string} email - Email do utilizador
 * @param {string} password - Palavra-passe
 * @returns {Promise<firebase.auth.UserCredential>} Dados do utilizador criado
 */
export const signUp = async (email, password) => {
  // Cria o utilizador na autenticação Firebase
  const userCredential = await auth.createUserWithEmailAndPassword(email, password);
  const user = userCredential.user;

  // Cria o documento no Firestore com o UID do utilizador
  await database.collection('users').doc(user.uid).set({
    favorites: [], // Lista de eventos favoritos (inicialmente vazia)
    participations: [], // Lista de eventos participados
    createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Data/hora da criação
  });

  return userCredential;
};

/**
 * Autentica um utilizador com email e palavra-passe.
 *
 * @param {string} email - Email do utilizador
 * @param {string} password - Palavra-passe
 * @returns {Promise<firebase.auth.UserCredential>} Dados do utilizador autenticado
 */
export const signIn = async (email, password) => {
  return await auth.signInWithEmailAndPassword(email, password);
};
