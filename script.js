/**
 * Lógica interactiva en Vanilla JavaScript (Sin React)
 * Hogar Social de Berisso
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ============================================================
     1. SCROLL SUAVE (Smooth Scroll de 2 segundos)
     ============================================================ */
  function slowSmoothScroll(targetSelector, duration = 2000) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * easeInOutCubic);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }
    requestAnimationFrame(animation);
  }

  // Interceptar clicks en navegación
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      slowSmoothScroll(href);
      
      // Cerrar menú móvil si está abierto
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu.style.display !== 'none') {
        mobileMenu.style.display = 'none';
        document.getElementById('hamburger-btn').classList.remove('header__hamburger--open');
        document.getElementById('hamburger-btn').setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Interceptar botón del Hero
  const heroBtn = document.getElementById('hero-cta-principal');
  if (heroBtn) {
    heroBtn.addEventListener('click', () => slowSmoothScroll('#contacto'));
  }

  /* ============================================================
     1b. CARTELERA — Cerrar banner
     ============================================================ */
  const carteleraCloseBtn = document.getElementById('cartelera-close');
  const carteleraEl = document.getElementById('cartelera');
  if (carteleraCloseBtn && carteleraEl) {
    carteleraCloseBtn.addEventListener('click', () => {
      carteleraEl.style.display = 'none';
      // Ajustar el offset del header al cerrar la cartelera
      document.documentElement.style.setProperty('--cartelera-height', '0px');
    });
  }

  /* ============================================================
     2. MENÚ MÓVIL (Header)
     ============================================================ */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.style.display !== 'none';
      mobileMenu.style.display = isOpen ? 'none' : 'flex';
      hamburgerBtn.classList.toggle('header__hamburger--open', !isOpen);
      hamburgerBtn.setAttribute('aria-expanded', !isOpen);
    });
  }

  /* ============================================================
     3. HEADER AL HACER SCROLL (Logo y Fondo)
     ============================================================ */
  const header = document.getElementById('main-header');
  const logoImg = header.querySelector('.header__logo-img');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('header--scrolled');
      logoImg.src = 'assets/escudo.png';
      logoImg.classList.replace('header__logo-img--crece', 'header__logo-img--escudo');
    } else {
      header.classList.remove('header--scrolled');
      logoImg.src = 'assets/hogar-crece.png';
      logoImg.classList.replace('header__logo-img--escudo', 'header__logo-img--crece');
    }
  }, { passive: true });

  // Forzar estado inicial
  window.dispatchEvent(new Event('scroll'));

  /* ============================================================
     4. ROTADOR DE DISCIPLINAS (HubDisciplinas)
     ============================================================ */
  const grid = document.getElementById('disciplinas-grid');
  if (grid) {
    const cards = Array.from(grid.querySelectorAll('.disc-img-card'));
    let currentIndex = 0;
    let timer = null;

    function activarCard(index) {
      // Remover clase destacada de todos
      cards.forEach(c => {
        c.classList.remove('disc-img-card--featured');
        const timerBar = c.querySelector('.disc-img-card__timer-bar');
        if (timerBar) timerBar.remove();
      });

      // Mover la card activa al principio (como en React)
      const activa = cards[index];
      activa.classList.add('disc-img-card--featured');
      
      // Agregar barra de progreso
      const bar = document.createElement('div');
      bar.className = 'disc-img-card__timer-bar';
      bar.setAttribute('aria-hidden', 'true');
      activa.appendChild(bar);

      // Reordenar en el DOM
      grid.prepend(activa);
    }

    function iniciarRotacion() {
      clearInterval(timer);
      timer = setInterval(() => {
        currentIndex = (currentIndex + 1) % cards.length;
        activarCard(currentIndex);
      }, 15000);
    }

    // Interacciones de click en tarjetas
    cards.forEach((card, index) => {
      card.addEventListener('click', () => {
        if (!card.classList.contains('disc-img-card--featured')) {
          currentIndex = index;
          activarCard(currentIndex);
          iniciarRotacion();
        }
      });
    });

    iniciarRotacion();
  }

  /* ============================================================
     5. FORMULARIO DE CAPTACIÓN (WhatsApp)
     ============================================================ */
  const form = document.getElementById('formulario-captacion');
  const successBox = document.getElementById('form-success');
  const resetBtn = document.getElementById('form-reset-btn');
  const WA_NUMBER = '5492215651151';

  if (form) {
    const inputs = {
      nombre: form.querySelector('#form-nombre'),
      nacimiento: form.querySelector('#form-nacimiento'),
      telefono: form.querySelector('#form-telefono'),
      disciplina: form.querySelector('#form-disciplina')
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Limpiar errores previos
      Object.keys(inputs).forEach(key => {
        inputs[key].classList.remove('error');
        document.getElementById(`error-${key}`).style.display = 'none';
      });

      // Validar
      if (!inputs.nombre.value.trim()) {
        showError('nombre', 'Ingresá tu nombre completo.');
        isValid = false;
      }
      if (!inputs.nacimiento.value) {
        showError('nacimiento', 'Ingresá tu fecha de nacimiento.');
        isValid = false;
      }
      if (!inputs.telefono.value.trim()) {
        showError('telefono', 'Ingresá un número de contacto.');
        isValid = false;
      }
      if (!inputs.disciplina.value) {
        showError('disciplina', 'Seleccioná una disciplina.');
        isValid = false;
      }

      if (isValid) {
        // Formatear fecha
        const dateObj = new Date(inputs.nacimiento.value);
        // Ajuste zona horaria local
        dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
        const fechaFormat = dateObj.toLocaleDateString('es-AR');

        const msg = encodeURIComponent(
          `Hola, me gustaría asociarme al Club Hogar Social de Berisso.\n\n` +
          `Nombre: ${inputs.nombre.value}\n` +
          `Fecha de nacimiento: ${fechaFormat}\n` +
          `Disciplina de interés: ${inputs.disciplina.value}\n` +
          `Teléfono: ${inputs.telefono.value}\n\n` +
          `Aguardo indicaciones para completar la inscripción. Muchas gracias.`
        );
        window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
        
        form.style.display = 'none';
        successBox.style.display = 'flex';
      }
    });

    function showError(key, text) {
      inputs[key].classList.add('error');
      const errSpan = document.getElementById(`error-${key}`);
      errSpan.textContent = text;
      errSpan.style.display = 'block';
    }

    resetBtn.addEventListener('click', () => {
      form.reset();
      successBox.style.display = 'none';
      form.style.display = 'flex';
    });
  }

  /* ============================================================
     6. PORTAL SOCIO (WhatsApp Directo)
     ============================================================ */
  const btnCuota = document.getElementById('portal-btn-cuota');
  if (btnCuota) {
    btnCuota.addEventListener('click', () => {
      const nombreVal = document.getElementById('portal-nombre').value.trim() || '(sin indicar)';
      const dniVal = document.getElementById('portal-dni').value.trim() || '(sin indicar)';
      const msg = encodeURIComponent(
        `Hola! Quiero consultar el estado de mi cuota social.\n\nMi nombre es: ${nombreVal}\nMi DNI es: ${dniVal}\n\nMuchas gracias.`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
    });
  }

  /* ============================================================
     7. BOTONES GENÉRICOS DE CONSULTA DISCIPLINA
     ============================================================ */
  document.querySelectorAll('.disc-img-card__wa-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const discName = btn.getAttribute('data-disc');
      const msg = encodeURIComponent(
        `Hola! Estoy interesado/a en *${discName}* en el Club Hogar Social de Berisso.\n¿Podrían informarme sobre horarios, vacantes y cuotas? Muchas gracias.`
      );
      window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer');
    });
  });

});
