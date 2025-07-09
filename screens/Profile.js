import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext'; // Contexto de autenticação
import { auth, database } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Styles as styles } from '../styles/globalStyles';
import firebase from 'firebase';

export default function Profile() {
  const { user, logout } = useAuth(); // Utilizador autenticado e função de logout
  const navigation = useNavigation();

  // Estados para eventos e carregamento
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregamento dos dados do utilizador ao abrir a tela
  useEffect(() => {
    if (!user?.uid) {
      // Se não estiver autenticado, limpar os dados
      setFavoriteEvents([]);
      setParticipatedEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userRef = database.collection('users').doc(user.uid);

    // Ouve mudanças nos dados do utilizador no Firestore
    const unsubscribe = userRef.onSnapshot(async (userSnap) => {
      if (!userSnap.exists) {
        setFavoriteEvents([]);
        setParticipatedEvents([]);
        setLoading(false);
        return;
      }

      const { favorites = [], participations = [] } = userSnap.data();

      try {
        // Carrega os documentos dos eventos favoritos e participados
        const favoriteDocs = await Promise.all(
          favorites.map(id => database.collection('events').doc(id).get())
        );
        const participationDocs = await Promise.all(
          participations.map(id => database.collection('events').doc(id).get())
        );

        // Atualiza os estados com os eventos válidos
        setFavoriteEvents(
          favoriteDocs.filter(doc => doc.exists).map(doc => ({ id: doc.id, ...doc.data() }))
        );
        setParticipatedEvents(
          participationDocs.filter(doc => doc.exists).map(doc => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Remove o ouvinte ao desmontar o componente
  }, [user]);

  // Remover evento de favorito ou participação
  const handleRemoveEvent = async (eventId, type) => {
    if (!user?.uid) return;

    Alert.alert(
      'Confirmar remoção',
      type === 'favorite'
        ? 'Tem certeza que deseja remover este evento dos favoritos?'
        : 'Tem certeza que deseja cancelar sua participação neste evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const userRef = database.collection('users').doc(user.uid);
              const eventRef = database.collection('events').doc(eventId);

              if (type === 'favorite') {
                await userRef.update({
                  favorites: firebase.firestore.FieldValue.arrayRemove(eventId),
                });
              } else if (type === 'participation') {
                await userRef.update({
                  participations: firebase.firestore.FieldValue.arrayRemove(eventId),
                });
                await eventRef.update({
                  participants: firebase.firestore.FieldValue.arrayRemove(user.uid),
                });
              }
            } catch (error) {
              console.error('Erro ao remover o evento:', error);
              Alert.alert('Erro', 'Não foi possível remover o evento.');
            }
          },
        },
      ]
    );
  };

  // Renderização de um item da lista
  const renderItem = (item, type) => (
    <View
      style={{
        ...styles.listItem,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Tocar para ver detalhes do evento */}
      <TouchableOpacity
        onPress={() => navigation.navigate('EventDetails', { event: item })}
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
      >
        <Ionicons
          name={type === 'favorite' ? 'heart' : 'checkmark-circle'}
          size={20}
          color={type === 'favorite' ? '#EF4444' : '#4F46E5'}
          style={{ marginRight: 8 }}
        />
        <View>
          <Text style={styles.listItemTitle}>{item.title}</Text>
          <Text style={styles.listItemText} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botão para remover */}
      <TouchableOpacity
        onPress={() => handleRemoveEvent(item.id, type)}
        style={{ padding: 8 }}
      >
        <Ionicons name="trash" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  // Função para redefinir senha
  const handlePasswordReset = async () => {
    if (!user?.email) return Alert.alert('Erro', 'Utilizador não autenticado');
    try {
      await auth.sendPasswordResetEmail(user.email);
      Alert.alert('Sucesso', 'Email para redefinir a senha foi enviado!');
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      Alert.alert('Erro', error.message || 'Erro ao enviar o email de redefinição.');
    }
  };

  // Exibição de carregamento
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Ícone de perfil */}
      <Ionicons
        name="person-circle-outline"
        size={100}
        color="#4F46E5"
        style={{ marginBottom: 20, alignSelf: 'center' }}
      />

      {/* Email e UID do utilizador */}
      <Text style={{ ...styles.listItemTitle, textAlign: 'center' }}>
        {user?.email}
      </Text>
      <Text style={{ ...styles.listItemText, textAlign: 'center', marginBottom: 20 }}>
        UID: {user?.uid}
      </Text>

      {/* Lista de eventos participados */}
      <Text style={{ ...styles.eventCount, textAlign: 'center', marginBottom: 10 }}>
        Eventos em que vai participar
      </Text>
      {participatedEvents.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma participação encontrada.</Text>
      ) : (
        <FlatList
          data={participatedEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItem(item, 'participation')}
          style={{ width: '100%' }}
        />
      )}

      {/* Lista de eventos favoritos */}
      <Text style={{ ...styles.eventCount, textAlign: 'center', marginTop: 20, marginBottom: 10 }}>
        Eventos Favoritos
      </Text>
      {favoriteEvents.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum favorito encontrado.</Text>
      ) : (
        <FlatList
          data={favoriteEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItem(item, 'favorite')}
          style={{ width: '100%' }}
        />
      )}

      {/* Botão de redefinir senha */}
      <TouchableOpacity
        onPress={handlePasswordReset}
        style={{
          backgroundColor: '#4F46E5',
          paddingVertical: 14,
          borderRadius: 8,
          marginTop: 20,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
          Renovar Senha
        </Text>
      </TouchableOpacity>

      {/* Botão de logout */}
      <TouchableOpacity
        onPress={logout}
        style={{
          backgroundColor: '#EF4444',
          paddingVertical: 14,
          borderRadius: 8,
          marginTop: 10,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

