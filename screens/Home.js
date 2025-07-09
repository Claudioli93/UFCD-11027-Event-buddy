// Importa React e os hooks
import React, { useState, useEffect } from "react";
// Importa componentes do React Native
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
// Firebase
import { database } from "../firebaseConfig";
// Navegação entre telas
import { useNavigation } from "@react-navigation/native";
// Estilos globais
import { Styles } from "../styles/globalStyles";
// Contexto de autenticação
import { useAuth } from "../context/AuthContext";

// Componente principal da página inicial
export default function Home() {
  // Estados principais
  const [events, setEvents] = useState([]); // Todos os eventos
  const [filteredEvents, setFilteredEvents] = useState([]); // Eventos filtrados
  const [favoriteIds, setFavoriteIds] = useState([]); // IDs de eventos favoritos

  // Filtros e ordenação
  const [searchText, setSearchText] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [sortAsc, setSortAsc] = useState(true); // Ordenação ascendente

  const navigation = useNavigation();
  const { user } = useAuth(); // Utilizador autenticado

  // Busca todos os eventos no banco de dados ao carregar
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await database.collection("events").get();
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(list);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  // Escuta em tempo real os favoritos do utilizador autenticado
  useEffect(() => {
    if (!user?.uid) return;

    const userRef = database.collection("users").doc(user.uid);
    const unsubscribe = userRef.onSnapshot((doc) => {
      const favorites = doc.exists ? doc.data().favorites || [] : [];
      setFavoriteIds(favorites);
    });

    return () => unsubscribe();
  }, [user]);

  // Aplica filtros e ordenação sempre que algum valor mudar
  useEffect(() => {
    let filtered = [...events];

    // Filtro por texto
    if (searchText.trim()) {
      filtered = filtered.filter(e =>
        (e.title || "").toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filtro por local
    if (filterLocation.trim()) {
      filtered = filtered.filter(e =>
        (e.location || "").toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    // Filtro por data
    if (filterDate.trim()) {
      filtered = filtered.filter(e =>
        (e.date || "").startsWith(filterDate)
      );
    }

    // Ordenação por data
    filtered.sort((a, b) => {
      return sortAsc
        ? (a.date || "").localeCompare(b.date || "")
        : (b.date || "").localeCompare(a.date || "");
    });

    setFilteredEvents(filtered);
  }, [events, searchText, filterLocation, filterDate, sortAsc]);

  // Verifica se o evento está nos favoritos do utilizador
  const isFavorite = (eventId) => favoriteIds.includes(eventId);

  // JSX do componente
  return (
    <View style={Styles.container}>
      {/* Filtros */}
      <TextInput
        placeholder="Pesquisar por nome"
        value={searchText}
        onChangeText={setSearchText}
        style={[Styles.input, { marginBottom: 12 }]}
        placeholderTextColor="#9CA3AF"
      />

      <TextInput
        placeholder="Pesquisar por local"
        value={filterLocation}
        onChangeText={setFilterLocation}
        style={[Styles.input, { marginBottom: 12 }]}
        placeholderTextColor="#9CA3AF"
      />

      <TextInput
        placeholder="Pesquisar por data (YYYY-MM-DD)"
        value={filterDate}
        onChangeText={setFilterDate}
        style={[Styles.input, { marginBottom: 12 }]}
        placeholderTextColor="#9CA3AF"
      />

      {/* Botão para alternar a ordenação */}
      <TouchableOpacity
        style={Styles.customButton}
        onPress={() => setSortAsc(!sortAsc)}
      >
        <Text style={Styles.customButtonText}>
          {sortAsc ? "⬆️ Ordenar por data" : "⬇️ Ordenar por data"}
        </Text>
      </TouchableOpacity>

      {/* Contador de eventos */}
      <Text style={Styles.eventCount}>
        Total de eventos: {filteredEvents.length}
      </Text>

      {/* Lista de eventos */}
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        style={{ marginTop: 15 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={Styles.listItem}
            onPress={() => navigation.navigate("EventDetails", { event: item })}
          >
            {/* Imagem do evento */}
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={Styles.listItemImage}
                resizeMode="cover"
              />
            ) : null}

            {/* Informações do evento */}
            <View style={Styles.listItemTextContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[Styles.listItemTitle, { textAlign: "center" }]}>
                    {item.title}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, marginLeft: 10 }}>
                  {isFavorite(item.id) ? "❤️" : "🤍"}
                </Text>
              </View>

              <Text style={[Styles.listItemDescription, { textAlign: "center" }]}>
                {item.description || "Sem descrição"}
              </Text>
              <Text style={[Styles.listItemText, { textAlign: "center" }]}>
                Local: {item.location || "N/A"}
              </Text>
              <Text style={[Styles.listItemText, { textAlign: "center" }]}>
                Data: {item.date || "N/A"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={Styles.emptyText}>Nenhum evento encontrado.</Text>
        }
      />
    </View>
  );
}
