// SCRIPTS.JS - Funcionalidades do site do casamento
// INSTRUÇÃO: Para alterar datas, endpoints ou conteúdo, edite as constantes abaixo

// CONFIGURAÇÕES PRINCIPAIS - EDITAR AQUI
// =========================================

// DATA DO CASAMENTO - INSTRUÇÃO: Altere para a data do seu evento
const EVENT_DATE = new Date('2026-11-28T16:00:00'); // Formato: AAAA-MM-DDTHH:MM:SS

// ENDPOINT DO FORMULÁRIO RSVP - INSTRUÇÃO: Substitua pela URL do seu endpoint
const RSVP_ENDPOINT = 'https://exemplo.com/api/rsvp'; // URL do backend para receber os RSVPs

// CONTEÚDO DA SEÇÃO "NOSSA HISTÓRIA" - INSTRUÇÃO: Adicione/remova itens conforme necessário
const historyItems = [
  {
    date: 'Junho 2018',
    title: 'Nosso Primeiro Encontro',
    description: 'Nos conhecemos durante uma conferência de trabalho em São Paulo. Foi amor à primeira vista!',
    media: {
      type: 'image', // 'image' ou 'video'
      src: 'assets/historia-1.jpg', // Caminho da imagem
      alt: 'Maria e João em seu primeiro encontro' // Texto alternativo para acessibilidade
    }
  },
  {
    date: 'Dezembro 2020',
    title: 'Primeira Viagem Juntos',
    description: 'Passamos o Réveillon em uma praia paradisíaca. Foi quando soubemos que queríamos passar nossas vidas juntos.',
    media: {
      type: 'image',
      src: 'assets/historia-2.jpg',
      alt: 'Maria e João na praia durante o Réveillon'
    }
  },
  {
    date: 'Março 2023',
    title: 'O Pedido',
    description: 'João pediu Maria em casamento durante um pôr do sol inesquecível na Praia do Rosa.',
    media: {
      type: 'video',
      src: 'https://www.youtube.com/embed/VIDEO_ID', // ID do vídeo do YouTube
      alt: 'Vídeo do pedido de casamento'
    }
  },
  {
    date: 'Novembro 2026',
    title: 'Nosso Grande Dia',
    description: 'Estamos ansiosos para compartilhar este momento especial com todos que amamos!',
    media: {
      type: 'image',
      src: 'assets/historia-3.jpg',
      alt: 'Maria e João no dia do casamento'
    }
  }
];

// =========================================
// FIM DAS CONFIGURAÇÕES EDITÁVEIS

// INICIALIZAÇÃO DO SITE
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar todas as funcionalidades
  initNavigation();
  initCountdown();
  initHistorySection();
  initRSVPForm();
  initBackToTop();
  initSmoothScroll();
  
  console.log('Site do casamento carregado com sucesso!');
});

// FUNÇÃO: NAVEGAÇÃO RESPONSIVA
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', navToggle.classList.contains('active'));
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// FUNÇÃO: CONTADOR REGRESSIVO
function initCountdown() {
  const daysElement = document.getElementById('days');
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');
  
  // Verificar se o contador existe na página
  if (!daysElement) return;
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = EVENT_DATE.getTime() - now;
    
    // Se a data já passou
    if (distance < 0) {
      document.querySelector('.countdown-container').innerHTML = 
        '<div class="countdown-finished"><h3>Hoje é o nosso dia!</h3></div>';
      return;
    }
    
    // Calcular dias, horas, minutos e segundos
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Atualizar elementos HTML
    daysElement.textContent = String(days).padStart(2, '0');
    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
  }
  
  // Atualizar imediatamente e a cada segundo
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// FUNÇÃO: CARREGAR SEÇÃO "NOSSA HISTÓRIA"
function initHistorySection() {
  const historyContainer = document.getElementById('history-container');
  
  if (!historyContainer || !historyItems.length) return;
  
  // Gerar HTML para cada item da história
  const historyHTML = historyItems.map(item => `
    <div class="history-item">
      <div class="history-media">
        ${item.media.type === 'image' 
          ? `<img src="${item.media.src}" alt="${item.media.alt}" loading="lazy">`
          : `<iframe src="${item.media.src}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="${item.media.alt}"></iframe>`
        }
      </div>
      <div class="history-content">
        <span class="history-date">${item.date}</span>
        <h3 class="history-title">${item.title}</h3>
        <p>${item.description}</p>
      </div>
    </div>
  `).join('');
  
  // Inserir HTML no container
  historyContainer.innerHTML = historyHTML;
}

// FUNÇÃO: FORMULÁRIO RSVP
function initRSVPForm() {
  const rsvpForm = document.getElementById('rsvp-form');
  const formMessage = document.getElementById('form-message');
  
  if (!rsvpForm) return;
  
  rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Coletar dados do formulário
    const formData = new FormData(rsvpForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      guests: formData.get('guests'),
      attendance: formData.get('attendance'),
      message: formData.get('message') || ''
    };
    
    // Validação básica
    if (!data.name || !data.email || !data.guests || !data.attendance) {
      showFormMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }
    
    // Enviar dados (simulação - substituir por fetch real)
    submitRSVP(data);
  });
  
  // Função para enviar dados do RSVP
  function submitRSVP(data) {
    // SIMULAÇÃO DE ENVIO - INSTRUÇÃO: Substitua pelo código real de envio
    
    // Exemplo com fetch (descomente e configure o endpoint):
    /*
    fetch(RSVP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na resposta do servidor');
      }
      return response.json();
    })
    .then(result => {
      showFormMessage('Obrigado por confirmar sua presença! Entraremos em contato em breve.', 'success');
      rsvpForm.reset();
    })
    .catch(error => {
      console.error('Erro:', error);
      showFormMessage('Desculpe, ocorreu um erro. Tente novamente mais tarde.', 'error');
    });
    */
    
    // SIMULAÇÃO (REMOVER QUANDO IMPLEMENTAR O ENDPOINT REAL)
    setTimeout(() => {
      showFormMessage('Obrigado por confirmar sua presença! Entraremos em contato em breve.', 'success');
      rsvpForm.reset();
    }, 1000);
  }
  
  // Função para exibir mensagens do formulário
  function showFormMessage(message, type) {
    if (!formMessage) return;
    
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Rolagem suave para a mensagem
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Ocultar mensagem após 5 segundos (apenas para sucesso)
    if (type === 'success') {
      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 5000);
    }
  }
}

// FUNÇÃO: BOTÃO "VOLTAR AO TOPO"
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (!backToTopBtn) return;
  
  // Mostrar/ocultar botão baseado na rolagem
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.visibility = 'visible';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.visibility = 'hidden';
    }
  });
  
  // Rolagem suave ao topo
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// FUNÇÃO: ROLAGEM SUAVE PARA ÂNCORAS
function initSmoothScroll() {
  // Selecionar todos os links que começam com #
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Pular se for apenas "#" ou link vazio
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        // Calcular posição considerando o header fixo
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// FUNÇÃO: CARREGAMENTO OTIMIZADO DE IMAGENS
// Esta função pode ser usada para carregar imagens críticas de forma otimizada
function loadCriticalImages() {
  // INSTRUÇÃO: Adicione aqui as imagens que devem ser carregadas prioritariamente
  const criticalImages = [
    'assets/Logo-Casamento.jpg',
    'assets/bg-casal.jpg'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// INICIALIZAR CARREGAMENTO DE IMAGENS CRÍTICAS
loadCriticalImages();
