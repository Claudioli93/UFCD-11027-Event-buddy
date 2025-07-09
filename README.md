# 11027_event-buddy

## Funcionalidades

- Autenticação de utilizadores (login, registo)
- Área de administração para gestão de eventos (inserir, editar, eliminar)
- Listagem e pesquisa de eventos
- Sistema de favoritos e reservas de participação em eventos
- Visualização de detalhes do evento (incluindo mapa)
- Proteção de rotas para utilizadores autenticados
- Redefinição de senha por email

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento de aplicações móveis multiplataforma (Android e iOS) usando JavaScript.
- **Firebase Authentication**: Serviço para autenticação de utilizadores, permitindo login, registo e recuperação de senha.
- **Firestore**: Base de dados NoSQL em tempo real, utilizada para armazenar e sincronizar dados dos eventos e utilizadores.
- **Expo**: Plataforma que facilita o desenvolvimento, teste e publicação de apps React Native.
- **react-native-maps**: Biblioteca para integração de mapas e localização na aplicação.
- **Context API**: Ferramenta do React para gestão global do estado de autenticação e dados do utilizador.
- **Styled Components/StyleSheet**: Soluções para estilização dos componentes da interface.

## Como Executar

1. Clone o repositório e instale as dependências com `npm install` ou `yarn`.
2. Configure o arquivo `firebaseConfig.js` com as credenciais do seu projeto Firebase.
3. Execute o projeto com `npx expo start` ou `expo start`.
4. A aplicação pode ser testada em emulador Android/iOS ou dispositivo físico via Expo Go.

## Estrutura Principal dos Ficheiros

- `screens/`: Telas principais da aplicação (`Home.js`, `Login.js`, `Register.js`, `Profile.js`, `EventDetails.js`, `Favorites.js`)
- `context/AuthContext.js`: Contexto global de autenticação do utilizador
- `services/firebaseAuth.js`: Funções de autenticação e registo de utilizadores
- `styles/globalStyles.js`: Estilos globais da aplicação
- `assets/`: Imagens e ícones utilizados
- `firebaseConfig.js`: Configuração do Firebase (deve ser criado pelo utilizador)

## Créditos

- Projeto desenvolvido na UFCD - 11027 - Desenvolvimento de aplicações móveis (plataforma iOS).
- Utiliza Firebase, Expo, React Native e bibliotecas open-source para garantir uma solução moderna.