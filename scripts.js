// SCRIPTS.JS - Funcionalidades do site do casamento
// INSTRUÇÃO: Para alterar datas, endpoints ou conteúdo, edite as constantes abaixo

// CONFIGURAÇÕES PRINCIPAIS - EDITAR AQUI
// =========================================

// DATA DO CASAMENTO - INSTRUÇÃO: Altere para a data do seu evento
const EVENT_DATE = new Date('2026-11-28T17:00:00'); // Formato: AAAA-MM-DDTHH:MM:SS

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
  initHeaderScroll(); // NOVA FUNÇÃO ATUALIZADA
  initMobileMenuClose(); // NOVA FUNÇÃO
  initCountdown();
  initHistorySection();
  initRSVPForm();
  initBackToTop();
  initSmoothScroll();
  
  console.log('Site do casamento carregado com sucesso!');
});

/**
 * FUNÇÃO: CONTROLE DO HEADER TRANSPARENTE/SÓLIDO
 * Nova versão - mais robusta e com melhor performance
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  const scrollThreshold = 50; // Menor threshold para resposta mais rápida
  let lastScrollY = window.pageYOffset;
  let ticking = false;

  // Verificar estado inicial
  function checkHeaderState() {
    const currentScrollY = window.pageYOffset;
    
    if (currentScrollY > scrollThreshold) {
      // Scrolled - header sólido
      header.classList.remove('header--transparent');
      header.classList.add('header--solid');
    } else {
      // Topo - header transparente
      header.classList.remove('header--solid');
      header.classList.add('header--transparent');
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  }

  // Otimização de performance com requestAnimationFrame
  function updateHeader() {
    if (!ticking) {
      requestAnimationFrame(checkHeaderState);
      ticking = true;
    }
  }

  // Event listeners
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader, { passive: true });
  window.addEventListener('load', updateHeader);

  // Estado inicial
  updateHeader();
}

/**
 * FUNÇÃO: FECHAR MENU MOBILE AO CLICAR FORA
 */
function initMobileMenuClose() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const body = document.body;

  // Verificar se estamos em mobile
  function isMobile() {
    return window.innerWidth <= 576;
  }

  document.addEventListener('click', function(event) {
    if (!isMobile()) return;
    
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnToggle = navToggle.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      body.classList.remove('no-scroll');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Também fechar menu ao redimensionar para desktop
  window.addEventListener('resize', function() {
    if (!isMobile() && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      body.classList.remove('no-scroll');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// FUNÇÃO: NAVEGAÇÃO RESPONSIVA MELHORADA
function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const header = document.querySelector('.header');
  const body = document.body;
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      body.classList.toggle('no-scroll'); // Impede scroll quando menu está aberto
      navToggle.setAttribute('aria-expanded', navToggle.classList.contains('active'));
    });
    
    // Fechar menu ao clicar em um link (mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 576) { // Apenas no mobile
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          body.classList.remove('no-scroll');
          navToggle.setAttribute('aria-expanded', 'false');
        }
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

// CONFIRMAÇÃO DE PRESENÇA - VERSÃO CORRIGIDA
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyOeTvVrZvdWUCCp5jDS04yiRXXL8kmQaYBPalNFgPZSJ46dMnlzRmz16qVv-hYP-E0/exec';

class ConfirmacaoPresenca {
  constructor() {
    this.listaDeNomes = [];
    this.listaCarregada = false;
    this.timeoutBusca = null;
    
    this.inicializar();
  }
  
  inicializar() {
    console.log('🎯 Inicializando sistema de confirmação...');
    this.carregarElementos();
    this.configurarEventos();
    this.carregarListaDeNomes();
  }
  
  carregarElementos() {
    this.buscarNomeInput = document.getElementById('buscarNome');
    this.resultadosBuscaDiv = document.getElementById('resultadosBusca');
    this.popup = document.getElementById('popupConfirmacao');
    this.nomeSelecionadoSpan = document.getElementById('nomeSelecionado');
    this.formConfirmacaoFinal = document.getElementById('formConfirmacaoFinal');
    this.btnCancelar = document.getElementById('btnCancelar');
    this.popupClose = document.getElementById('popupClose');
    this.mensagemRetornoDiv = document.getElementById('mensagemRetorno');
  }
  
  configurarEventos() {
    // Busca em tempo real
    this.buscarNomeInput.addEventListener('input', (e) => {
      this.handleBuscaInput(e.target.value);
    });
    
    // Fechar resultados ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box')) {
        this.esconderResultados();
      }
    });
    
    // Popup events
    this.btnCancelar.addEventListener('click', () => this.fecharPopup());
    this.popupClose.addEventListener('click', () => this.fecharPopup());
    
    this.popup.addEventListener('click', (e) => {
      if (e.target === this.popup) {
        this.fecharPopup();
      }
    });
    
    // Form submission
    this.formConfirmacaoFinal.addEventListener('submit', (e) => {
      e.preventDefault();
      this.processarConfirmacao();
    });
  }
  
  async carregarListaDeNomes() {
    console.log('📥 Carregando lista de convidados...');
    
    try {
      // Usando text/plain para evitar problemas de CORS
      const response = await fetch(SCRIPT_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const text = await response.text();
      const result = JSON.parse(text);
      
      if (result.success) {
        this.listaDeNomes = result.data;
        this.listaCarregada = true;
        console.log(`✅ ${this.listaDeNomes.length} convidados carregados com sucesso`);
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar lista:', error);
      this.exibirMensagem('Erro ao carregar lista de convidados. Tente recarregar a página.', 'error');
      
      // Tentar novamente após 5 segundos
      setTimeout(() => this.carregarListaDeNomes(), 5000);
    }
  }
  
  handleBuscaInput(termo) {
    clearTimeout(this.timeoutBusca);
    
    const termoLimpo = termo.trim();
    
    if (termoLimpo.length < 2) {
      this.esconderResultados();
      return;
    }
    
    if (!this.listaCarregada) {
      this.mostrarResultados([], '⌛ Carregando lista de convidados...');
      return;
    }
    
    this.timeoutBusca = setTimeout(() => {
      this.executarBusca(termoLimpo);
    }, 300);
  }
  
  executarBusca(termo) {
    const termoLower = termo.toLowerCase();
    const resultados = this.listaDeNomes.filter(nome => 
      nome.toLowerCase().includes(termoLower)
    );
    
    console.log(`🔍 Busca por "${termo}": ${resultados.length} resultados`);
    
    if (resultados.length === 0) {
      this.mostrarResultados([], `Nenhum convidado encontrado com "${termo}"`);
    } else {
      this.mostrarResultados(resultados);
    }
  }
  
  mostrarResultados(resultados, mensagemVazia = null) {
    this.resultadosBuscaDiv.innerHTML = '';
    
    if (mensagemVazia) {
      this.resultadosBuscaDiv.innerHTML = `
        <div class="resultado-item no-results">${mensagemVazia}</div>
      `;
    } else {
      resultados.forEach(nome => {
        const div = document.createElement('div');
        div.className = 'resultado-item';
        div.innerHTML = `
          <span class="result-name">${nome}</span>
          <button class="btn-select" data-nome="${nome}">Sou eu</button>
        `;
        
        div.querySelector('.btn-select').addEventListener('click', () => {
          this.abrirPopupConfirmacao(nome);
        });
        
        this.resultadosBuscaDiv.appendChild(div);
      });
    }
    
    this.resultadosBuscaDiv.style.display = 'block';
  }
  
  esconderResultados() {
    this.resultadosBuscaDiv.style.display = 'none';
  }
  
  abrirPopupConfirmacao(nome) {
    console.log(`👤 Abrindo popup para: ${nome}`);
    
    this.nomeSelecionadoSpan.textContent = nome;
    this.popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Pré-preencher o campo de nome
    document.getElementById('nomeConfirmacao').value = nome;
    document.getElementById('nomeConfirmacao').focus();
    
    this.esconderResultados();
    this.buscarNomeInput.value = '';
  }
  
  fecharPopup() {
    this.popup.style.display = 'none';
    document.body.style.overflow = 'auto';
    this.limparFormulario();
  }
  
  async processarConfirmacao() {
    const nomeBuscado = this.nomeSelecionadoSpan.textContent;
    const nomeConfirmacao = document.getElementById('nomeConfirmacao').value.trim();
    const email = document.getElementById('emailConfirmacao').value.trim();
    
    console.log('📤 Enviando confirmação:', { nomeBuscado, nomeConfirmacao, email });
    
    // Validações (SEM CPF)
    if (!this.validarConfirmacao(nomeBuscado, nomeConfirmacao, email)) {
        return;
    }
    
    this.mostrarLoading(true);
    
    try {
        const resultado = await this.enviarConfirmacao({
            nomeBuscado,
            nomeConfirmacao,
            email // ENVIA APENAS NOME E EMAIL
        });
        
        this.processarRespostaConfirmacao(resultado, nomeBuscado);
        
    } catch (error) {
        console.error('❌ Erro na confirmação:', error);
        this.exibirMensagem('❌ Erro de conexão. Tente novamente.', 'error');
    } finally {
        this.mostrarLoading(false);
    }
}
  
  validarConfirmacao(nomeBuscado, nomeConfirmacao, email) {
    if (nomeConfirmacao.toLowerCase() !== nomeBuscado.toLowerCase()) {
        this.exibirMensagem('O nome digitado não confere com o nome selecionado.', 'error');
        return false;
    }
    
    if (!this.validarEmail(email)) {
        this.exibirMensagem('Por favor, digite um e-mail válido.', 'error');
        return false;
    }
    
    return true;
}
  
  async enviarConfirmacao(dados) {
    // Usando text/plain para evitar problemas de CORS
    const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(dados)
    });
    
    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const text = await response.text();
    return JSON.parse(text);
}
  
  processarRespostaConfirmacao(resultado, nomeBuscado) {
    if (resultado.success) {
      this.exibirMensagemConfirmacao('✅ Presença confirmada com sucesso! Obrigado por confirmar.');
      this.fecharPopup();
      
      // Remover nome da lista local
      this.listaDeNomes = this.listaDeNomes.filter(nome => nome !== nomeBuscado);
      
    } else {
      let mensagemErro = '❌ Erro na confirmação. Tente novamente.';
      
      if (resultado.error === 'JA_CONFIRMADO') {
        mensagemErro = '❌ Este convidado já foi confirmado anteriormente.';
      } else if (resultado.error === 'NAO_ENCONTRADO') {
        mensagemErro = '❌ Nome não encontrado na lista de convidados.';
      }
      
      this.exibirMensagem(mensagemErro, 'error');
    }
  }
  
  mostrarLoading(mostrar) {
    const btnSubmit = this.formConfirmacaoFinal.querySelector('.btn-primary');
    const btnText = btnSubmit.querySelector('.btn-text');
    const btnLoading = btnSubmit.querySelector('.btn-loading');
    
    if (mostrar) {
      btnText.style.display = 'none';
      btnLoading.style.display = 'flex';
      btnSubmit.disabled = true;
    } else {
      btnText.style.display = 'block';
      btnLoading.style.display = 'none';
      btnSubmit.disabled = false;
    }
  }
  
  exibirMensagem(mensagem, tipo) {
    this.mensagemRetornoDiv.innerHTML = mensagem;
    this.mensagemRetornoDiv.className = `confirmation-message ${tipo}`;
    this.mensagemRetornoDiv.style.display = 'block';
    
    setTimeout(() => {
      this.mensagemRetornoDiv.style.display = 'none';
    }, 5000);
  }
  
  exibirMensagemConfirmacao(mensagem) {
    this.mensagemRetornoDiv.innerHTML = `
      <div class="confirmation-success">
        <div class="success-icon">🎉</div>
        <div class="success-message">${mensagem}</div>
        <div class="success-details">Enviaremos todas as informações para o e-mail cadastrado.</div>
      </div>
    `;
    this.mensagemRetornoDiv.className = 'confirmation-message success';
    this.mensagemRetornoDiv.style.display = 'block';
  }
  
  limparFormulario() {
    this.formConfirmacaoFinal.reset();
    this.esconderResultados();
  }
  
  validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

// Inicializar o sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  new ConfirmacaoPresenca();
});

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
function loadCriticalImages() {
  // INSTRUÇÃO: Adicione aqui as imagens que devem ser carregadas prioritariamente
  const criticalImages = [
    'assets/logo-branco.png',
    'assets/logo-verde.png',
    'assets/bg-casal.jpg'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// INICIALIZAR CARREGAMENTO DE IMAGENS CRÍTICAS
loadCriticalImages();

// FUNÇÃO: PREVENIR SCROLL QUANDO MENU ESTÁ ABERTO (MOBILE)
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    body.no-scroll {
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
});
