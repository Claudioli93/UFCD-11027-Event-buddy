// Importa hooks do React
import React, { useEffect, useState } from 'react';
// Importa componentes do React Native
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
// Navegação entre telas
import { useNavigation } from '@react-navigation/native';
// Hook de autenticação
import { useAuth } from '../context/AuthContext';
// Importa o banco de dados do Firebase
import { database } from '../firebaseConfig';
// Estilos globais
import { Styles as styles } from '../styles/globalStyles';

// Componente para exibir os eventos favoritos do utilizador
export default function Favorites() {
  const { user } = useAuth(); // Obtém o utilizador autenticado
  const navigation = useNavigation(); // Hook para navegação

  // Estado para armazenar os eventos favoritos
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  // Estado de carregamento
  const [loading, setLoading] = useState(true);

  // useEffect para buscar os eventos favoritos do utilizador
  useEffect(() => {
    // Se não houver utilizador autenticado, define estado vazio
    if (!user?.uid) {
      setFavoriteEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Referência ao documento do utilizador no Firestore
    const userRef = database.collection('users').doc(user.uid);

    // Escuta em tempo real as mudanças no documento do utilizador
    const unsubscribe = userRef.onSnapshot(async (userSnap) => {
      if (!userSnap.exists) {
        setFavoriteEvents([]);
        setLoading(false);
        return;
      }

      // Obtém a lista de favoritos do utilizador
      const favorites = userSnap.data().favorites || [];

      if (favorites.length === 0) {
        setFavoriteEvents([]);
        setLoading(false);
        return;
      }

      try {
        // Busca todos os eventos favoritos no Firestore
        const eventPromises = favorites.map(eventId =>
          database.collection('events').doc(eventId).get()
        );

        const eventDocs = await Promise.all(eventPromises);

        // Filtra apenas os eventos válidos e mapeia para lista
        const eventsList = eventDocs
          .filter(doc => doc.exists)
          .map(doc => ({ id: doc.id, ...doc.data() }));

        setFavoriteEvents(eventsList);
      } catch (error) {
        console.error('Erro ao buscar eventos favoritos do utilizador:', error);
        setFavoriteEvents([]);
      } finally {
        setLoading(false);
      }
    });

    // Limpa o listener ao desmontar o componente
    return () => unsubscribe();
  }, [user]);

  // Exibe carregamento enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#1e293b', flex: 1 }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  // Exibe mensagem caso não haja favoritos
  if (favoriteEvents.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: '#1e293b', flex: 1 }]}>
        <Text style={styles.emptyText}>Nenhum evento favorito encontrado.</Text>
      </View>
    );
  }

  // Exibe a lista de eventos favoritos
  return (
    <View style={{ flex: 1, backgroundColor: '#1e293b' }}>
      <FlatList
        data={favoriteEvents} // Dados dos eventos
        keyExtractor={item => item.id} // Chave única por item
        contentContainerStyle={[styles.listContainer, { backgroundColor: '#1e293b' }]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate('EventDetails', { event: item })}
          >
            {/* Imagem do evento, se existir */}
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.listItemImage}
                resizeMode="cover"
              />
            ) : null}

            {/* Título e descrição do evento */}
            <View style={styles.listItemTextContainer}>
              <Text style={styles.listItemTitle}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.listItemDescription}>
                {item.description || 'Sem descrição'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
