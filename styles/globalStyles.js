import { StyleSheet, Dimensions, Platform, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

// Função para escalar fontes com base na largura da tela (responsividade)
const scaleFont = (size) => {
  const scale = width / 375; 
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const Styles = StyleSheet.create({
  // Container principal da tela
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E293B', // fundo escuro elegante
  },

  // Label acima de inputs
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 6,
    marginTop: 12,
  },

  // Input de formulário estilizado
  input: {
    backgroundColor: '#334155', // cinza escuro para melhor contraste
    color: '#F9FAFB', // texto quase branco
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // sombra no Android
  },

  // Botão padrão primário
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },

  // Botão customizado com azul diferente
  customButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },

  // Texto dentro do botão customizado
  customButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  // Texto de link (ex: "voltar" ou "esqueceu a senha")
  linkText: {
    color: '#4F46E5',
    marginTop: 16,
    fontWeight: '600',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },

  // Título de páginas
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E5E7EB',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Texto de informações de busca
  searchInfoText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },

  // Texto de ordem/filtro
  orderText: {
    fontSize: 16,
    color: '#3B82F6',
    marginBottom: 15,
    fontWeight: '600',
  },

  // Contador de eventos
  eventCount: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },

  // Texto com total de eventos
  totalEventsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  // Texto de cada item da lista
  listItemText: {
    color: '#E2E8F0',
    fontSize: 14,
  },

  // Botão para ordenar/filtro
  sortButton: {
    marginVertical: 10,
  },

  // Item padrão de lista (card)
  listItem: {
    flexDirection: 'column',
    backgroundColor: '#1F2937',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  // Item favorito com cor diferenciada
  listItemFavorite: {
    flexDirection: 'column',
    backgroundColor: '#1E40AF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  // Imagem no item da lista
  listItemImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#1F2937',
  },

  // Container do texto do item
  listItemTextContainer: {
    flex: 1,
    paddingRight: 15,
  },

  // Título do item
  listItemTitle: {
    color: '#E5E7EB',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  // Detalhes adicionais do item
  listItemDetails: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
    flexWrap: 'wrap',
  },

  // Descrição com fonte responsiva
  description: {
    fontSize: scaleFont(16),
    lineHeight: scaleFont(24),
    color: '#D1D5DB',
    marginBottom: 15,
  },

  // Texto de informações adicionais
  infoText: {
    fontSize: scaleFont(14),
    color: '#9CA3AF',
    marginBottom: 6,
  },

  // Número de participantes
  participantCount: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#F9FAFB',
    marginVertical: 15,
    textAlign: 'center',
  },

  // Imagem genérica
  image: {
    width: '100%',
    height: height * 0.3,
    borderRadius: 12,
    marginBottom: 15,
  },

  // Container para tela de loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },

  // Container para tela vazia
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },

  // Texto exibido quando não há dados
  emptyText: {
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },

  // Descrição dentro do item da lista
  listItemDescription: {
    color: '#D1D5DB',
    fontSize: scaleFont(14),
  },

  // Container do botão de remoção
  removeButtonContainer: {
    justifyContent: 'center',
  },

  // Botão de remoção (excluir)
  removeButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Texto do botão de remoção
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: scaleFont(14),
  },

  // Logo (imagem centralizada)
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    alignSelf: 'center',
  },

  // Fundo do modal
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Container do conteúdo do modal
  modalContainer: {
    width: "85%",
    backgroundColor: "#1A202C",
    borderRadius: 10,
    padding: 20,
  },

  // Conteúdo do scrollview
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },

  // Mapa estilizado
  map: {
    width: width - 40,
    height: 250,
    marginVertical: 20,
    borderRadius: 10,
  },

  // Texto genérico
  text: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
    color: '#F1F5F9',
  },

  // Botão para evento
  eventButton: {
    marginVertical: 10,
    width: '100%',
  },

  // Container de botões (alinhamento central)
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  // Variação azul de botão
  buttonBlue: {
    backgroundColor: '#2563EB',
  },

  // Variação vermelha de botão
  buttonRed: {
    backgroundColor: '#EF4444',
  },

  // Estilo genérico de texto de botão
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Estilo para header (navigation)
  headerStyle: {
    backgroundColor: '#121212',
    shadowColor: 'transparent',
    elevation: 0,
  },

  // Cor dos ícones/botões no header
  headerTintColor: '#E5E7EB',

  // Estilo do título do header
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 0.5,
  },

  // Estilo da TabBar (navegação inferior)
  tabBarStyle: {
    backgroundColor: '#1F2937',
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 15,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 8,
    elevation: 10,
  },

  // Cor para item ativo na TabBar
  tabBarActiveTintColor: '#60A5FA',

  // Cor para item inativo na TabBar
  tabBarInactiveTintColor: '#9CA3AF',

  // Estilo do texto da TabBar
  tabBarLabelStyle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
});


export const NavigationStyles = {
  // Estilo para o cabeçalho (header) da navegação
  headerStyle: {
    backgroundColor: '#121212', // Fundo escuro para combinar com o tema geral do app
    shadowColor: 'transparent', // Remove a sombra padrão do header para um visual mais limpo
    elevation: 0,               // Remove a elevação (sombra) no Android para manter a aparência flat
  },

  // Cor dos botões e ícones no header (ex: botão voltar)
  headerTintColor: '#E5E7EB',  // Texto claro, para garantir contraste e legibilidade

  // Estilo do título exibido no header
  headerTitleStyle: {
    fontWeight: '700',         // Negrito para dar destaque ao título
    fontSize: 20,              // Tamanho da fonte do título
    letterSpacing: 0.5,        // Espaçamento entre letras para melhor leitura e estética
  },

  // Estilo da barra de abas (tab bar) na navegação inferior
  tabBarStyle: {
    backgroundColor: '#1F2937', // Cor de fundo escura (cinza-escuro), para destacar o conteúdo e ícones
    borderTopWidth: 0,          // Remove a borda superior padrão para um visual mais limpo
    height: 65,                 // Altura da tab bar para dar espaço confortável para os ícones e labels
    paddingBottom: 15,          // Espaçamento inferior para evitar cortes e melhorar toque
    paddingTop: 10,             // Espaçamento superior para centralizar o conteúdo verticalmente
    shadowColor: '#000',        // Cor da sombra da tab bar
    shadowOpacity: 0.15,        // Transparência da sombra para não ficar muito forte
    shadowOffset: { width: 0, height: -3 }, // Direção e distância da sombra (para cima)
    shadowRadius: 8,            // Desfoque da sombra para suavizar
    elevation: 10,              // Elevação para sombra no Android, deixa a tab bar com destaque
  },

  // Cor do ícone e label ativo na tab bar
  tabBarActiveTintColor: '#60A5FA',  // Azul claro e vibrante para o item ativo

  // Cor do ícone e label inativo na tab bar
  tabBarInactiveTintColor: '#9CA3AF', // Cinza médio para itens inativos, mais discreto

  // Estilo do texto dos labels na tab bar
  tabBarLabelStyle: {
    fontSize: 13,             // Tamanho da fonte do label
    fontWeight: '600',        // Fonte semi-negrito para melhor leitura
    marginBottom: 4,          // Espaçamento inferior para separar do ícone
    textTransform: 'capitalize', // Capitaliza a primeira letra do texto (Ex: 'home' -> 'Home')
  },
};
