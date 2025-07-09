import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { signUp } from "../services/firebaseAuth";
import { Styles as styles } from '../styles/globalStyles';

export default function SignupScreen({ navigation }) {
  // Estados locais para os campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Função chamada ao pressionar "Registar"
  const handleSignUp = async () => {
    // Verifica se as passwords coincidem
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As palavras-passe não coincidem");
      return;
    }

    try {
      // Tenta criar o utilizador com Firebase
      await signUp(email, password);

      // Mostra sucesso e navega para a tela de login
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      console.log(error.message);
      Alert.alert("Erro", error.message); // Mostra erro ao utilizador
    }
  };

  return (
    <View style={styles.container}>
      {/* Campo de email */}
      <Text style={styles.label}>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Palavra-passe */}
      <Text style={styles.label}>Palavra-passe:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* Confirmação da palavra-passe */}
      <Text style={styles.label}>Confirmar palavra-passe:</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={[styles.input, { marginBottom: 20 }]}
      />

      {/* Botão de registo */}
      <Button title="Registar" onPress={handleSignUp} />
    </View>
  );
}
