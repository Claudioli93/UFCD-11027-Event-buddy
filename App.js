import { Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './context/AuthContext';

import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import Home from './screens/Home';
import EventDetails from './screens/EventDetails';
import Favorites from './screens/Favorites';
import Profile from './screens/Profile';

import { NavigationStyles } from './styles/globalStyles';

// Criação do Stack Navigator para navegação em pilha (telas empilhadas)
const Stack = createStackNavigator();
// Criação do Tab Navigator para navegação por abas na parte inferior
const Tab = createBottomTabNavigator();

// Stack de navegação da Home e detalhes do evento
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Aplica os estilos personalizados do header
        headerStyle: NavigationStyles.headerStyle,
        headerTintColor: NavigationStyles.headerTintColor,
        headerTitleStyle: NavigationStyles.headerTitleStyle,
      }}
    >
      {/* Tela principal Home */}
      <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{ title: 'Início' }} 
      />
      {/* Tela de detalhes do evento */}
      <Stack.Screen
        name="EventDetails"
        component={EventDetails}
        options={{ title: 'Detalhes do Evento', headerBackTitleVisible: false }}
      />
    </Stack.Navigator>
  );
}

// Navegação por abas principal do app após login
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Define o ícone da aba com base na rota
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'HomeStack') {
            return <Ionicons name="home-outline" size={size} color={color} />;
          } else if (route.name === 'Favorites') {
            return <MaterialIcons name="favorite-border" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <FontAwesome name="user-o" size={size} color={color} />;
          }
          return null;
        },
        // Cores e estilos das abas
        tabBarActiveTintColor: NavigationStyles.tabBarActiveTintColor,   // Cor do ícone e label ativo
        tabBarInactiveTintColor: NavigationStyles.tabBarInactiveTintColor, // Cor dos itens inativos
        tabBarLabelStyle: NavigationStyles.tabBarLabelStyle,             // Estilo do texto da aba
        headerShown: false,                                               // Não mostrar header nas abas (usa o stack)
        tabBarStyle: {
          ...NavigationStyles.tabBarStyle,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,                  // Ajuste para safe area no iOS
          height: 60,                                                    // Altura fixa da tab bar
        },
      })}
    >
      {/* Aba da Home com stack interno */}
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStack} 
        options={{ title: 'Home' }} 
      />
      {/* Aba de Favoritos */}
      <Tab.Screen 
        name="Favorites" 
        component={Favorites} 
        options={{ title: 'Favoritos' }} 
      />
      {/* Aba do Perfil */}
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{ title: 'Perfil' }} 
      />
    </Tab.Navigator>
  );
}

// Stack de autenticação (login e registro)
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Aplica os estilos do header para as telas de login e registro
        headerStyle: NavigationStyles.headerStyle,
        headerTintColor: NavigationStyles.headerTintColor,
        headerTitleStyle: NavigationStyles.headerTitleStyle,
      }}
    >
      {/* Tela de login */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Entrar' }} 
      />
      {/* Tela de registro */}
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: 'Registrar' }} 
      />
    </Stack.Navigator>
  );
}

// Componente que decide qual navegação usar baseado no estado de autenticação
function Routes() {
  const { user } = useAuth(); // Recupera o usuário logado do contexto

  return (
    // SafeAreaProvider garante suporte para áreas seguras (notch, bordas arredondadas)
    <SafeAreaProvider>
      {/* SafeAreaView aplica o espaçamento interno correto para essas áreas */}
      <SafeAreaView style={{ flex: 1 }}>
        {/* NavigationContainer gerencia a navegação do app */}
        <NavigationContainer>
          {/* Se o usuário estiver autenticado, mostra as abas, senão a stack de login */}
          {user ? <AppTabs /> : <AuthStack />}
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Componente principal do app, envolve tudo com o provedor de autenticação
export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
