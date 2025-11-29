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
  initHeaderScroll();
  
  console.log('Site do casamento carregado com sucesso!');
});

// FUNÇÃO: CONTROLE DO MENU TRANSPARENTE AO SCROLLAR
function initHeaderScroll() {
  const header = document.querySelector('.header');
  const scrollThreshold = 100; // Quantidade de scroll para ativar a mudança

  function updateHeader() {
    if (window.pageYOffset > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Atualizar ao carregar e ao scrollar
  window.addEventListener('scroll', updateHeader);
  updateHeader(); // Chamar uma vez para verificar o estado inicial
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
    
    // Fechar menu ao clicar fora (mobile)
    document.addEventListener('click', function(event) {
      if (window.innerWidth <= 576 && 
          navMenu.classList.contains('active') &&
          !navMenu.contains(event.target) && 
          !navToggle.contains(event.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        body.classList.remove('no-scroll');
        navToggle.setAttribute('aria-expanded', 'false');
      }
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

// CONFIRMAÇÃO DE PRESENÇA - SISTEMA ATUALIZADO
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdch4ukCi-8SF6iUmCyNHvXnFyfL_GO5AgKw1tZyb6nWNsNUonwvECTgAxSQ2KKyl7/exec';

// Elementos da DOM
const buscarNomeInput = document.getElementById('buscarNome');
const resultadosBuscaDiv = document.getElementById('resultadosBusca');
const popup = document.getElementById('popupConfirmacao');
const nomeSelecionadoSpan = document.getElementById('nomeSelecionado');
const formConfirmacaoFinal = document.getElementById('formConfirmacaoFinal');
const btnCancelar = document.getElementById('btnCancelar');
const popupClose = document.getElementById('popupClose');
const mensagemRetornoDiv = document.getElementById('mensagemRetorno');
const statusMessageDiv = document.getElementById('statusMessage');

// Variáveis de controle
let listaDeNomes = [];
let timeoutBusca = null;

// Carregar lista de nomes ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    carregarListaDeNomes();
});

// Busca em tempo real com debounce
buscarNomeInput.addEventListener('input', function() {
    clearTimeout(timeoutBusca);
    const termo = this.value.trim();
    
    if (termo.length < 2) {
        resultadosBuscaDiv.style.display = 'none';
        resultadosBuscaDiv.innerHTML = '';
        return;
    }
    
    timeoutBusca = setTimeout(() => {
        buscarNomes(termo);
    }, 300);
});

// Fechar resultados ao clicar fora
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-box')) {
        resultadosBuscaDiv.style.display = 'none';
    }
});

// Função para carregar lista de nomes
function carregarListaDeNomes() {
    mostrarStatus('Carregando lista de convidados...', 'loading');
    
    fetch(SCRIPT_URL + '?action=getNomes')
        .then(response => {
            if (!response.ok) throw new Error('Erro na rede');
            return response.json();
        })
        .then(nomes => {
            listaDeNomes = nomes.filter(nome => nome && nome.trim() !== '');
            mostrarStatus(`${listaDeNomes.length} convidados encontrados`, 'success');
            setTimeout(() => ocultarStatus(), 3000);
        })
        .catch(error => {
            console.error('Erro ao carregar nomes:', error);
            mostrarStatus('Erro ao carregar lista. Tente recarregar a página.', 'error');
        });
}

// Função de busca
function buscarNomes(termo) {
    const termoLower = termo.toLowerCase();
    const resultados = listaDeNomes.filter(nome => 
        nome.toLowerCase().includes(termoLower)
    );

    resultadosBuscaDiv.innerHTML = '';
    
    if (resultados.length === 0) {
        resultadosBuscaDiv.innerHTML = `
            <div class="resultado-item no-results">
                Nenhum convidado encontrado com "${termo}"
            </div>
        `;
    } else {
        resultados.forEach(nome => {
            const div = document.createElement('div');
            div.className = 'resultado-item';
            div.innerHTML = `
                <span class="result-name">${nome}</span>
                <button class="btn-select" data-nome="${nome}">Sou eu</button>
            `;
            resultadosBuscaDiv.appendChild(div);
            
            // Adicionar evento ao botão
            div.querySelector('.btn-select').addEventListener('click', function() {
                const nomeConvidado = this.getAttribute('data-nome');
                abrirPopupConfirmacao(nomeConvidado);
            });
        });
    }
    
    resultadosBuscaDiv.style.display = 'block';
}

// Abrir popup de confirmação
function abrirPopupConfirmacao(nome) {
    nomeSelecionadoSpan.textContent = nome;
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Pré-preencher o campo de nome
    document.getElementById('nomeConfirmacao').value = nome;
    document.getElementById('nomeConfirmacao').focus();
    
    // Esconder resultados da busca
    resultadosBuscaDiv.style.display = 'none';
    buscarNomeInput.value = '';
}

// Fechar popup
function fecharPopup() {
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
    limparFormulario();
}

// Event listeners para fechar popup
btnCancelar.addEventListener('click', fecharPopup);
popupClose.addEventListener('click', fecharPopup);

// Fechar popup ao clicar fora do conteúdo
popup.addEventListener('click', function(e) {
    if (e.target === popup) {
        fecharPopup();
    }
});

// Processar confirmação final
formConfirmacaoFinal.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nomeBuscado = nomeSelecionadoSpan.textContent;
    const nomeConfirmacao = document.getElementById('nomeConfirmacao').value.trim();
    const documento = document.getElementById('documento').value.trim();
    const email = document.getElementById('emailConfirmacao').value.trim();
    
    // Validações
    if (nomeConfirmacao.toLowerCase() !== nomeBuscado.toLowerCase()) {
        exibirMensagem('O nome digitado não confere com o nome selecionado.', 'error');
        return;
    }
    
    if (!validarDocumento(documento)) {
        exibirMensagem('Por favor, digite um RG ou CPF válido.', 'error');
        return;
    }
    
    if (!validarEmail(email)) {
        exibirMensagem('Por favor, digite um e-mail válido.', 'error');
        return;
    }
    
    // Mostrar loading
    const btnSubmit = this.querySelector('.btn-primary');
    const btnText = btnSubmit.querySelector('.btn-text');
    const btnLoading = btnSubmit.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    btnSubmit.disabled = true;
    
    // Enviar dados
    const dados = {
        nomeBuscado: nomeBuscado,
        nomeConfirmacao: nomeConfirmacao,
        documento: documento,
        email: email
    };
    
    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(dados)
    })
    .then(response => response.text())
    .then(resultado => {
        if (resultado === 'Sucesso') {
            exibirMensagemConfirmacao('✅ Presença confirmada com sucesso! Obrigado por confirmar.', 'success');
            fecharPopup();
            // Remover nome da lista local
            listaDeNomes = listaDeNomes.filter(nome => nome !== nomeBuscado);
        } else {
            exibirMensagem('❌ Erro na confirmação. Tente novamente mais tarde.', 'error');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        exibirMensagem('❌ Erro de conexão. Verifique sua internet e tente novamente.', 'error');
    })
    .finally(() => {
        // Restaurar botão
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
        btnSubmit.disabled = false;
    });
});

// Funções auxiliares
function mostrarStatus(mensagem, tipo) {
    statusMessageDiv.textContent = mensagem;
    statusMessageDiv.className = `status-message ${tipo}`;
    statusMessageDiv.style.display = 'block';
}

function ocultarStatus() {
    statusMessageDiv.style.display = 'none';
}

function exibirMensagem(mensagem, tipo) {
    mensagemRetornoDiv.innerHTML = mensagem;
    mensagemRetornoDiv.className = `confirmation-message ${tipo}`;
    mensagemRetornoDiv.style.display = 'block';
    
    setTimeout(() => {
        mensagemRetornoDiv.style.display = 'none';
    }, 5000);
}

function exibirMensagemConfirmacao(mensagem, tipo) {
    mensagemRetornoDiv.innerHTML = `
        <div class="confirmation-success">
            <div class="success-icon">🎉</div>
            <div class="success-message">${mensagem}</div>
            <div class="success-details">Enviaremos todas as informações para o e-mail cadastrado.</div>
        </div>
    `;
    mensagemRetornoDiv.className = `confirmation-message ${tipo}`;
    mensagemRetornoDiv.style.display = 'block';
}

function limparFormulario() {
    formConfirmacaoFinal.reset();
    resultadosBuscaDiv.innerHTML = '';
    resultadosBuscaDiv.style.display = 'none';
}

function validarDocumento(documento) {
    // Remover caracteres não numéricos
    const docLimpo = documento.replace(/\D/g, '');
    return docLimpo.length >= 8; // RG ou CPF mínimo
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
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
