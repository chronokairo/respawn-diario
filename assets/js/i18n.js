// i18n.js - Suporte multilíngue para Respawn Diário
// Adicione traduções em formato de objeto. Suporte inicial: pt-BR, en-US

const translations = {
  'pt-BR': {
    'site.title': 'Respawn Diário',
    'site.tagline': 'Seu checkpoint gamer diário',
    'nav.home': 'Home',
    'nav.reviews': 'Reviews',
    'nav.news': 'Notícias',
    'nav.guides': 'Guias',
    'nav.contact': 'Contato',
    'nav.about': 'Sobre',
    'footer.rights': 'Todos os direitos reservados.',
    'footer.madeWith': 'Feito com',
    'footer.forCommunity': 'para a comunidade gamer',
    'form.name': 'Nome *',
    'form.email': 'Email *',
    'form.subject': 'Assunto *',
    'form.message': 'Mensagem *',
    'form.send': 'Enviar Mensagem',
    'form.privacy': 'Concordo com a Política de Privacidade *',
    'form.newsletter': 'Quero receber novidades do Respawn Diário por email',
    'form.success': 'Mensagem enviada com sucesso!',
    'form.error': 'Erro ao enviar mensagem. Tente novamente.',
    'newsletter.title': 'Não Perca Nenhum Checkpoint',
    'newsletter.subscribe': 'Inscrever-se',
    'profile.title': 'Meu Perfil',
    'profile.save': 'Salvar Configurações',
    'profile.reset': 'Restaurar Padrões',
    'profile.logout': 'Sair da Conta',
    'theme.dark': 'Dark Mode',
    'theme.light': 'Light Mode',
    'theme.auto': 'Auto',
    'theme.solarized': 'Solarized',
    'theme.dracula': 'Dracula',
    'theme.retro': 'Retro',
    // ...adicione mais conforme necessário
  },
  'en-US': {
    'site.title': 'Respawn Diário',
    'site.tagline': 'Your daily gamer checkpoint',
    'nav.home': 'Home',
    'nav.reviews': 'Reviews',
    'nav.news': 'News',
    'nav.guides': 'Guides',
    'nav.contact': 'Contact',
    'nav.about': 'About',
    'footer.rights': 'All rights reserved.',
    'footer.madeWith': 'Made with',
    'footer.forCommunity': 'for the gamer community',
    'form.name': 'Name *',
    'form.email': 'Email *',
    'form.subject': 'Subject *',
    'form.message': 'Message *',
    'form.send': 'Send Message',
    'form.privacy': 'I agree with the Privacy Policy *',
    'form.newsletter': 'I want to receive Respawn Diário news by email',
    'form.success': 'Message sent successfully!',
    'form.error': 'Error sending message. Try again.',
    'newsletter.title': 'Don\'t Miss Any Checkpoint',
    'newsletter.subscribe': 'Subscribe',
    'profile.title': 'My Profile',
    'profile.save': 'Save Settings',
    'profile.reset': 'Restore Defaults',
    'profile.logout': 'Log Out',
    'theme.dark': 'Dark Mode',
    'theme.light': 'Light Mode',
    'theme.auto': 'Auto',
    'theme.solarized': 'Solarized',
    'theme.dracula': 'Dracula',
    'theme.retro': 'Retro',
    // ...add more as needed
  }
};

let currentLang = localStorage.getItem('lang') || navigator.language || 'pt-BR';
if (!translations[currentLang]) currentLang = 'pt-BR';

function t(key) {
  return translations[currentLang][key] || translations['pt-BR'][key] || key;
}

function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    translatePage();
  }
}

function translatePage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t(key);
    } else {
      el.innerHTML = t(key);
    }
  });
}

document.addEventListener('DOMContentLoaded', translatePage);

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.t = t;
  window.setLanguage = setLanguage;
  window.translatePage = translatePage;
}
