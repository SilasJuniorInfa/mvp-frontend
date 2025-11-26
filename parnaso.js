/* parnaso.js — versão final solicitada:
   - Alerts (addAlert)
   - tópicos Conservação / Clima / Mapa re-adicionados
   - quick-links para descer direto até Conservação, Clima e Mapa
   - carrosséis alimentados pelo HTML
   - galeria final compila imagens presentes nos tópicos
*/

document.addEventListener('DOMContentLoaded', () => {
  // inserir ano
  const anoEl = document.getElementById('ano');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  // gerar botões de tópicos automaticamente
  const topicsContainer = document.getElementById('topics-carousel');
  if (topicsContainer) {
    document.querySelectorAll('main section[id]').forEach(sec => {
      const id = sec.id;
      if (['galeria-final','fontes'].includes(id)) return;
      const titleEl = sec.querySelector('.card-title');
      const title = titleEl ? titleEl.textContent : id;
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = title;
      btn.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      topicsContainer.appendChild(btn);
    });
  }

  // quick-links (botões diretos) funcionalidade
  document.querySelectorAll('.quick-links [data-scrollto]').forEach(btn => {
    const target = btn.getAttribute('data-scrollto');
    btn.addEventListener('click', () => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Inicializar carrosséis e compilar galeria
  const carousels = document.querySelectorAll('.carousel');
  const galleryCollection = document.getElementById('gallery-collection');

  carousels.forEach(carousel => {
    const slides = Array.from(carousel.querySelectorAll('.slide'));
    const descEl = carousel.querySelector('.img-desc');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');

    if (!slides.length) {
      if (descEl) descEl.textContent = 'Nenhuma imagem disponível.';
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    let current = 0;

    function show(n) {
      current = ((n % slides.length) + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === current));
      const cur = slides[current];
      const desc = cur.dataset.desc || (cur.querySelector('figcaption') && cur.querySelector('figcaption').textContent) || (cur.querySelector('img') && cur.querySelector('img').alt) || '';
      if (descEl) descEl.textContent = desc;

      // destacar thumbs se houver
      const thumbs = carousel.querySelectorAll('.thumb');
      thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => show(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => show(current + 1));

    // thumbs e adicionar imagens à galeria final
    const thumbRow = document.createElement('div');
    thumbRow.className = 'thumb-row';
    slides.forEach((s, i) => {
      const imgEl = s.querySelector('img');
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      const thumbImg = document.createElement('img');
      thumbImg.src = imgEl ? imgEl.src : '';
      thumbImg.alt = imgEl ? imgEl.alt : '';
      thumb.appendChild(thumbImg);
      thumb.addEventListener('click', () => show(i));
      thumbRow.appendChild(thumb);

      // adicionar à galeria final (se ainda não foi adicionada)
      if (galleryCollection && imgEl && imgEl.src) {
        // evitar duplicatas: checar se já existe um img com mesmo src
        const exists = Array.from(galleryCollection.querySelectorAll('img')).some(g => g.src === imgEl.src);
        if (!exists) {
          const galleryItem = document.createElement('div');
          galleryItem.className = 'gallery-item';
          const galleryImg = document.createElement('img');
          galleryImg.src = imgEl.src;
          galleryImg.alt = imgEl.alt || '';
          galleryImg.addEventListener('click', () => window.open(galleryImg.src, '_blank'));
          galleryItem.appendChild(galleryImg);
          galleryCollection.appendChild(galleryItem);
        }
      }
    });
    carousel.appendChild(thumbRow);

    // teclado: quando o carousel tem foco, setas navegam
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    });

    // mostrar primeiro slide
    show(0);
  });

  // botão subir no final
  const scrollTopBottom = document.getElementById('scroll-top-bottom');
  if (scrollTopBottom) scrollTopBottom.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // toggle tema
  const themeBottom = document.getElementById('toggle-theme-bottom');
  if (themeBottom) themeBottom.addEventListener('click', () => document.body.classList.toggle('dark-theme'));

  // função pública para criar avisos rapidamente (use no console ou integrando com UI)
  window.addAlert = (type, text) => {
    const area = document.getElementById('alerts-area');
    if (!area) return;
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `<div class="alert-text">${text}</div>`;
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-alert';
    closeBtn.innerText = '✕';
    closeBtn.addEventListener('click', () => alert.remove());
    alert.appendChild(closeBtn);
    area.prepend(alert);
  };

  // Exemplos iniciais de alert (remova se não quiser)
  addAlert('danger', 'Trilha X interditada até nova ordem devido a deslizamento — evite a área.');
  addAlert('warning', 'Chuvas intensas previstas: risco de trombas d\'água em pontos baixos.');
  addAlert('info', 'Sede administrativa aberta — verifique horário de atendimento.');

  // addAlert helper usado internamente (para os exemplos)
  function addAlert(type, text) {
    const area = document.getElementById('alerts-area');
    if (!area) return;
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `<div class="alert-text">${text}</div>`;
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-alert';
    closeBtn.innerText = '✕';
    closeBtn.addEventListener('click', () => alert.remove());
    alert.appendChild(closeBtn);
    area.prepend(alert);
  }

});
