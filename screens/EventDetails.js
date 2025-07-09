// Importa módulos e hooks do React
import React, { useEffect, useState } from 'react';
// Importa componentes do React Native
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
// Importa o mapa e seus componentes
import MapView, { Marker, UrlTile } from 'react-native-maps';
// Hook de autenticação do contexto
import { useAuth } from '../context/AuthContext';
// Importa o Firebase e a instância do banco de dados
import firebase, { database } from '../firebaseConfig';
// Importa estilos globais
import { Styles as styles } from '../styles/globalStyles';

// Obtém a largura da tela para ajustes responsivos
const screenWidth = Dimensions.get('window').width;

// Define a região padrão do mapa (Lisboa)
const LISBON_REGION = {
  latitude: 38.7223,
  longitude: -9.1393,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Componente principal para exibir os detalhes de um evento
export default function EventDetails({ route }) {
  // Obtém os dados do evento passados pela rota
  const { event } = route.params;
  // Obtém os dados do utilizador autenticado
  const { user } = useAuth();

  // Estados locais
  const [isFavorite, setIsFavorite] = useState(false); // Se o evento é favorito
  const [isParticipant, setIsParticipant] = useState(false); // Se o utilizador está participando
  const [participantCount, setParticipantCount] = useState(0); // Número de participantes

  // useEffect para buscar dados do evento e do utilizador
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid || !event?.id) return;

      const userRef = database.collection('users').doc(user.uid);
      const eventRef = database.collection('events').doc(event.id);

      const userSnap = await userRef.get();
      const eventSnap = await eventRef.get();

      if (userSnap.exists) {
        const data = userSnap.data();
        // Verifica se o evento está nos favoritos do utilizador
        setIsFavorite(
          Array.isArray(data.favorites) && data.favorites.includes(event.id)
        );
        // Verifica se o utilizador está participando do evento
        setIsParticipant(
          Array.isArray(data.participations) &&
            data.participations.includes(event.id)
        );
      }

      // Atualiza a contagem de participantes
      if (eventSnap.exists) {
        const eventData = eventSnap.data();
        const participants = Array.isArray(eventData.participants)
          ? eventData.participants.filter(
              (uid) => typeof uid === 'string' && uid.trim() !== ''
            )
          : [];
        setParticipantCount(participants.length);
      }
    };

    fetchData();
  }, [user, event]);

  // Alterna o estado de favorito do evento
  const toggleFavorite = async () => {
    if (!user?.uid) return;
    const userRef = database.collection('users').doc(user.uid);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      if (isFavorite) {
        await userRef.update({
          favorites: firebase.firestore.FieldValue.arrayRemove(event.id),
        });
        setIsFavorite(false);
      } else {
        await userRef.update({
          favorites: firebase.firestore.FieldValue.arrayUnion(event.id),
        });
        setIsFavorite(true);
      }
    }
  };

  // Alterna a participação do utilizador no evento
  const toggleParticipation = async () => {
    if (!user?.uid || !event?.id) return;

    const userRef = database.collection('users').doc(user.uid);
    const eventRef = database.collection('events').doc(event.id);
    const userSnap = await userRef.get();
    const eventSnap = await eventRef.get();

    if (userSnap.exists) {
      if (isParticipant) {
        await userRef.update({
          participations: firebase.firestore.FieldValue.arrayRemove(event.id),
        });
        await eventRef.update({
          participants: firebase.firestore.FieldValue.arrayRemove(user.uid),
        });
        setIsParticipant(false);
        setParticipantCount((prev) => Math.max(prev - 1, 0));
      } else {
        await userRef.update({
          participations: firebase.firestore.FieldValue.arrayUnion(event.id),
        });
        await eventRef.update({
          participants: firebase.firestore.FieldValue.arrayUnion(user.uid),
        });
        setIsParticipant(true);
        setParticipantCount((prev) => prev + 1);
      }
    }
  };

  // Renderiza a interface do componente
  return (
    <View style={{ flex: 1, backgroundColor: '#1E293B' }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Imagem do evento */}
        {event.imageUrl && (
          <Image source={{ uri: event.imageUrl }} style={styles.image} />
        )}

        {/* Informações do evento */}
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.text}>
          Local: {event.location || 'Não disponível'}
        </Text>
        <Text style={styles.text}>Data: {event.date}</Text>
        <Text style={styles.text}>Participantes: {participantCount}</Text>

        {/* Mapa com localização do evento */}
        <MapView
          style={styles.map}
          initialRegion={LISBON_REGION}
          scrollEnabled={true}
          zoomEnabled={true}
        >
          <UrlTile
            urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
            flipY={false}
          />
          <Marker
            coordinate={LISBON_REGION}
            title={event.location || 'Evento'}
          />
        </MapView>

        {/* Botões de ação: Participar e Favorito */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.customButton,
              isParticipant ? styles.buttonRed : styles.buttonBlue,
            ]}
            onPress={toggleParticipation}
          >
            <Text style={styles.buttonText}>
              {isParticipant ? 'Cancelar Participação' : 'Participar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.customButton,
              isFavorite ? styles.buttonRed : styles.buttonBlue,
            ]}
            onPress={toggleFavorite}
          >
            <Text style={styles.buttonText}>
              {isFavorite
                ? 'Remover dos Favoritos'
                : 'Adicionar aos Favoritos'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
