/* Home: renderiza os painéis a partir de window.SECTIONS (data/sections.js). */
(function () {
  var root = document.querySelector('[data-sections]');
  if (!root || !window.SECTIONS) return;

  var LOCK = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  function marquee() {
    var list = window.BRANDS || [];
    var imgs = function (hidden) {
      return list.map(function (b) {
        return '<img src="assets/brands/' + b[0] + '.png" alt="' + (hidden ? '' : b[1]) + '"' + (hidden ? ' aria-hidden="true"' : '') + '>';
      }).join('');
    };
    var m = document.createElement('div');
    m.className = 'marquee';
    m.innerHTML = '<div class="marquee-track">' + imgs(false) + imgs(true) + '</div>';
    return m;
  }

  var ARROW = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ── Preenchimento direcional "água" (.case-row) ─────────────────────────────
     A "água" (vidro) entra pela borda onde o ponteiro chega; a frente é uma curva
     que faz barriga em direção ao cursor e reage à velocidade; na saída, escorre
     pela borda de saída sem snap. Dirigido por GSAP (se disponível) via clip-path.
     Sem GSAP / reduced-motion / teclado: estado imediato (preenche inteiro).       */
  var prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function crossFrac(anchor, rect, x, y) {
    var f = (anchor === 'left' || anchor === 'right')
      ? (y - rect.top) / rect.height
      : (x - rect.left) / rect.width;
    return Math.max(0, Math.min(1, f));
  }

  function initWaterFill(row) {
    var rf = document.createElement('span');
    rf.className = 'row-fill';
    rf.setAttribute('aria-hidden', 'true');
    row.insertBefore(rf, row.firstChild);

    var st = { p: 0, bulge: 0 };   // p = progresso 0..1; bulge = amplitude da curva (fração)
    var anchor = 'left', cross = 0.5, tween = null;
    var lastX = 0, lastY = 0, lastT = 0;

    function poly(pts) {   // pts: array de ['L', x, y] | ['M', x, y] | ['Q', cx, cy, x, y]
      return pts.map(function (s) { return s[0] + s.slice(1).join(' '); }).join(' ') + ' Z';
    }
    function buildPath(w, h) {
      var p = Math.max(0, Math.min(1, st.p));
      var amp = st.bulge * Math.sin(Math.PI * p);   // 0 nas pontas, máximo no meio → assenta plano
      var fx, fy;
      if (anchor === 'left')  { fx = p * w;     return poly([['M',0,0],['L',fx,0],['Q',fx + amp*w, cross*h, fx, h],['L',0,h]]); }
      if (anchor === 'right') { fx = w - p * w; return poly([['M',w,0],['L',fx,0],['Q',fx - amp*w, cross*h, fx, h],['L',w,h]]); }
      if (anchor === 'top')   { fy = p * h;     return poly([['M',0,0],['L',0,fy],['Q',cross*w, fy + amp*h, w, fy],['L',w,0]]); }
      fy = h - p * h;                           return poly([['M',0,h],['L',0,fy],['Q',cross*w, fy - amp*h, w, fy],['L',w,h]]);
    }
    function apply() {
      var r = row.getBoundingClientRect();
      var d = 'path("' + buildPath(r.width, r.height) + '")';
      rf.style.clipPath = d; rf.style.webkitClipPath = d;
    }
    function animate(target, dur, ease) {
      if (tween) { tween.kill(); tween = null; }
      if (!window.gsap || prefersReduce.matches) {   // estado imediato
        st.p = target; st.bulge = 0; apply(); rf.style.opacity = target > 0 ? 1 : 0; return;
      }
      rf.style.opacity = 1;
      tween = window.gsap.to(st, {
        p: target, duration: dur, ease: ease, onUpdate: apply,
        onComplete: function () { if (target === 0) rf.style.opacity = 0; }
      });
    }

    row.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'touch') return;        // no mobile não há hover → sem fill
      var r = row.getBoundingClientRect();
      anchor = 'left';                              // sempre enche da esquerda p/ direita
      cross = crossFrac(anchor, r, e.clientX, e.clientY);
      lastX = e.clientX; lastY = e.clientY; lastT = e.timeStamp; st.bulge = 0;
      rf.style.opacity = 1;
      animate(1, 0.55, 'power3.out');
    });
    row.addEventListener('pointermove', function (e) {
      var dt = Math.max(1, e.timeStamp - lastT);
      var sp = Math.hypot(e.clientX - lastX, e.clientY - lastY) / dt;   // px/ms
      lastX = e.clientX; lastY = e.clientY; lastT = e.timeStamp;
      cross = crossFrac(anchor, row.getBoundingClientRect(), e.clientX, e.clientY);
      st.bulge = Math.min(0.26, sp * 0.14);         // velocidade → curvatura
    });
    row.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'touch') return;
      var r = row.getBoundingClientRect();
      anchor = 'right';                              // escorre pra fora pela direita (lavada contínua L→R)
      cross = crossFrac(anchor, r, e.clientX, e.clientY);
      st.p = 1;
      animate(0, 0.5, 'power2.in');
    });
    row.addEventListener('focus', function () { if (tween) tween.kill(); st.p = 1; st.bulge = 0; apply(); rf.style.opacity = 1; });
    row.addEventListener('blur',  function () { if (tween) tween.kill(); st.p = 0; apply(); rf.style.opacity = 0; });
  }

  function sectionHeader(s) {
    var h = document.createElement('div');
    h.className = 'sec-head';
    h.innerHTML =
      '<span class="sec-num">' + s.num + '</span>' +
      '<span class="sec-line" aria-hidden="true"></span>' +
      (s.keywords && s.keywords.length
        ? '<span class="sec-kw">' + s.keywords.map(function (k) { return '<span>' + k + '</span>'; }).join('') + '</span>'
        : '');
    return h;
  }

  window.SECTIONS.forEach(function (s) {
    var link = s.href && !s.locked;
    var el = document.createElement(link ? 'a' : 'div');
    el.className = 'col' + (s.fixed ? ' fixed' : '') + (s.variant ? ' ' + s.variant : '') + (s.locked ? ' col--locked' : '');
    if (s.locked) {
      el.tabIndex = 0;
      el.setAttribute('aria-label', s.num + ' · ' + s.title + ' (' + s.locked + ')');
    } else if (link) {
      el.href = s.href;
      el.setAttribute('aria-label', s.num + ' · ' + s.title + (s.keywords && s.keywords.length ? ' — ' + s.keywords.join(', ') : ''));
    } else {
      el.tabIndex = 0;
    }
    el.style.setProperty('--accent', s.accent);
    el.style.setProperty('--img', s.img ? 'url("' + s.img + '")' : 'none');

    el.appendChild(sectionHeader(s));

    var label = document.createElement('span');
    label.className = 'col-label';
    label.textContent = s.title;
    el.appendChild(label);

    var tpl = document.getElementById(s.body);
    if (tpl) el.appendChild(tpl.content.cloneNode(true));
    var more = el.querySelector('.col-more');

    /* preenchimento direcional "água" nos itens internos do menu (.case-row) */
    el.querySelectorAll('.case-row').forEach(initWaterFill);
    if (more && s.brands) { more.classList.add('col-more--wide'); more.appendChild(marquee()); }
    if (more && s.locked) {
      var soon = document.createElement('span');
      soon.className = 'col-soon';
      soon.innerHTML = LOCK + ' ' + s.locked;
      more.appendChild(soon);
    }

    if (!s.fixed || s.href) {
      var go = document.createElement('span');
      go.className = 'col-go';
      go.setAttribute('aria-hidden', 'true');
      go.innerHTML = ARROW;
      el.appendChild(go);
    }
    root.appendChild(el);
  });
})();

/* Acordeão mobile (≤720px): tap expande a coluna e fecha as outras. Desktop usa hover/focus CSS. */
addEventListener('click', function (e) {
  if (e.target.closest('form')) return;
  if (innerWidth > 720) return;
  var col = e.target.closest('.col');
  if (!col || col.classList.contains('fixed')) return;
  if (e.target.closest('.col-go, .col-cta') && col.tagName === 'A' && col.classList.contains('open')) return;
  if (col.tagName === 'A') e.preventDefault();
  var wasOpen = col.classList.contains('open');
  document.querySelectorAll('.col.open').forEach(function (c) { c.classList.remove('open'); });
  if (!wasOpen) col.classList.add('open');
});

/* Form contato: 2 passos → mailto. */
(function () {
  var form = document.querySelector('.cta-form');
  if (!form) return;
  var steps = form.querySelectorAll('.fstep');
  var show = function (n) { steps.forEach(function (s) { s.hidden = +s.dataset.step !== n; }); };
  form.querySelector('.fnext').addEventListener('click', function () {
    var email = form.email;
    if (!email.checkValidity()) { email.reportValidity(); return; }
    show(2); form.msg.focus();
  });
  // PENDÊNCIA (Cleyton): contato tem de ENVIAR INLINE e cair numa PLANILHA — o visitante NÃO sai do site (nada de mailto).
  //   Criar form no Formspree (ou serviço c/ integração Google Sheets) e colar o ID abaixo.
  //   Hoje, com XXXXXXXX, todo envio falha (404) → mostra "não consegui enviar". Trocar o ID resolve.
  var CONTACT_ENDPOINT = 'https://formspree.io/f/XXXXXXXX';
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.msg.value.trim()) { form.msg.reportValidity(); return; }
    var btn = form.querySelector('.fsend');
    var err = form.querySelector('.ferr');
    if (err) err.hidden = true;
    btn.disabled = true; btn.textContent = 'Enviando…';
    fetch(CONTACT_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
      .then(function (r) { if (!r.ok) throw 0; show(3); form.reset(); })
      .catch(function () { btn.disabled = false; btn.textContent = 'Enviar mensagem →'; if (err) err.hidden = false; });
  });
})();
