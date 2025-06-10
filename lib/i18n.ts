import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// English translations
const enTranslations = {
  common: {
    mplCommunity: "MPL Community",
    dashboard: "Dashboard",
    social: "Social",
    wallOfLove: "Wall of Love",
    inbox: "Inbox",
    announcements: "Announcements",
    surveys: "Surveys & Rewards",
    blog: "MPL Blog",
    channels: "Channels",
    socialLinks: "Social Links",
    user: "MPL User",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    systemTheme: "System Theme",
  },
  social: {
    title: "Social Media & Networks",
    subtitle: "Connect with the MPL community across various platforms",
    joinButton: "Join {{platform}}",
  },
  wallOfLove: {
    title: "Wall of Love",
    subtitle: "See what our community is saying about MPL",
    addYours: "Add Yours",
    shareExperience: "Share Your Experience",
    tellUs: "Tell us what you love about MPL. Your testimonial will be added to our Wall of Love.",
    name: "Name",
    location: "Location (Optional)",
    testimonial: "Your Testimonial",
    submit: "Submit",
    userTestimonial: "User Testimonial",
  },
  inbox: {
    title: "Announcements",
    subtitle: "Stay updated with the latest news and announcements",
    all: "All",
    important: "Important",
    updates: "Updates",
    games: "Games",
    features: "Features",
    markAsRead: "Mark as Read",
    noMessages: "No announcements found",
    tryChanging: "Try changing your search or filter criteria",
    searchPlaceholder: "Search announcements...",
  },
  surveys: {
    title: "Surveys & Rewards",
    subtitle: "Participate in surveys and earn rewards",
    takeSurvey: "Take Survey",
    completed: "Completed",
    multipleChoice: "Multiple Choice",
    poll: "Poll",
    shortAnswer: "Short Answer",
    question: "question",
    questions: "questions",
    tokens: "tokens",
  },
  blog: {
    title: "MPL Blog",
    subtitle: "Discover tips, stories, and updates from the MPL community",
    all: "All",
    gameTips: "Game Tips",
    userStories: "User Stories",
    promotions: "Promotions",
    readMore: "Read more",
    back: "Back",
    share: "Share",
  },
}

// Portuguese (Brazil) translations
const ptBRTranslations = {
  common: {
    mplCommunity: "Comunidade MPL",
    dashboard: "Painel",
    social: "Social",
    wallOfLove: "Mural de Amor",
    inbox: "Caixa de Entrada",
    announcements: "Anúncios",
    surveys: "Pesquisas e Recompensas",
    blog: "Blog MPL",
    channels: "Canais",
    socialLinks: "Links Sociais",
    user: "Usuário MPL",
    language: "Idioma",
    darkMode: "Modo Escuro",
    lightMode: "Modo Claro",
    systemTheme: "Tema do Sistema",
  },
  social: {
    title: "Mídias Sociais e Redes",
    subtitle: "Conecte-se com a comunidade MPL em várias plataformas",
    joinButton: "Junte-se ao {{platform}}",
  },
  wallOfLove: {
    title: "Mural de Amor",
    subtitle: "Veja o que nossa comunidade está dizendo sobre o MPL",
    addYours: "Adicione o Seu",
    shareExperience: "Compartilhe Sua Experiência",
    tellUs: "Conte-nos o que você ama sobre o MPL. Seu depoimento será adicionado ao nosso Mural de Amor.",
    name: "Nome",
    location: "Localização (Opcional)",
    testimonial: "Seu Depoimento",
    submit: "Enviar",
    userTestimonial: "Depoimento do Usuário",
  },
  inbox: {
    title: "Anúncios",
    subtitle: "Mantenha-se atualizado com as últimas notícias e anúncios",
    all: "Todos",
    important: "Importantes",
    updates: "Atualizações",
    games: "Jogos",
    features: "Recursos",
    markAsRead: "Marcar como Lido",
    noMessages: "Nenhum anúncio encontrado",
    tryChanging: "Tente alterar seus critérios de busca ou filtro",
    searchPlaceholder: "Buscar anúncios...",
  },
  surveys: {
    title: "Pesquisas e Recompensas",
    subtitle: "Participe de pesquisas e ganhe recompensas",
    takeSurvey: "Fazer Pesquisa",
    completed: "Concluído",
    multipleChoice: "Múltipla Escolha",
    poll: "Enquete",
    shortAnswer: "Resposta Curta",
    question: "pergunta",
    questions: "perguntas",
    tokens: "tokens",
  },
  blog: {
    title: "Blog MPL",
    subtitle: "Descubra dicas, histórias e atualizações da comunidade MPL",
    all: "Todos",
    gameTips: "Dicas de Jogos",
    userStories: "Histórias de Usuários",
    promotions: "Promoções",
    readMore: "Leia mais",
    back: "Voltar",
    share: "Compartilhar",
  },
}

// Initialize i18next
i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: enTranslations },
      "pt-BR": { translation: ptBRTranslations },
    },
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  })

export default i18n
