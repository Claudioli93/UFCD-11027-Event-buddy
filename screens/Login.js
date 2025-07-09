// Importações essenciais
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Modal,
} from "react-native";

import { signIn } from "../services/firebaseAuth"; // Função personalizada de login
import { useAuth } from "../context/AuthContext"; // Contexto do utilizador autenticado
import { auth } from "../firebaseConfig"; // Firebase auth direto
import { Styles } from "../styles/globalStyles"; // Estilos globais

// Logo da aplicação
const logo = require("../assets/logo.png");

// Componente da tela de login
export default function LoginScreen({ navigation }) {
  // Campos de entrada
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetModalVisible, setResetModalVisible] = useState(false); // Controle do modal de redefinição
  const [resetEmail, setResetEmail] = useState(""); // Email para redefinir senha
  const { user } = useAuth(); // Utilizador autenticado

  // Função de login
  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  // Envia email de redefinição de senha
  const handlePasswordReset = async () => {
    if (!resetEmail) {
      Alert.alert("Erro", "Digite seu email para redefinir a senha");
      return;
    }

    try {
      await auth.sendPasswordResetEmail(resetEmail);
      setResetModalVisible(false);
      Alert.alert("Sucesso", "Email de redefinição enviado!");
      setResetEmail("");
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  // Tela principal
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={Styles.container}
    >
      {/* Logo */}
      <Image source={logo} style={Styles.logo} resizeMode="contain" />

      {/* Campo de email */}
      <Text style={Styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={Styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Digite seu email"
        placeholderTextColor="#A0AEC0"
      />

      {/* Campo de senha */}
      <Text style={Styles.label}>Senha</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={Styles.input}
        autoCapitalize="none"
        placeholder="Digite sua senha"
        placeholderTextColor="#A0AEC0"
      />

      {/* Botão de login */}
      <TouchableOpacity style={Styles.button} onPress={handleLogin}>
        <Text style={Styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Link para registro */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={Styles.linkText}>Não tem conta? Registre-se</Text>
      </TouchableOpacity>

      {/* Link para redefinir senha */}
      <TouchableOpacity
        onPress={() => setResetModalVisible(true)}
        style={{ marginTop: 20 }}
      >
        <Text style={{ ...Styles.linkText, textAlign: "center" }}>
          Esqueci minha senha
        </Text>
      </TouchableOpacity>

      {/* Modal de redefinição de senha */}
      <Modal
        transparent
        visible={resetModalVisible}
        animationType="slide"
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={Styles.modalBackground}>
          <View style={Styles.modalContainer}>
            <Text style={Styles.label}>Digite seu email</Text>
            <TextInput
              value={resetEmail}
              onChangeText={setResetEmail}
              style={Styles.input}
              placeholder="Email"
              placeholderTextColor="#A0AEC0"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={Styles.button} onPress={handlePasswordReset}>
              <Text style={Styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setResetModalVisible(false)}>
              <Text
                style={{
                  ...Styles.linkText,
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
