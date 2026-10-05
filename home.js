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

  /* directional hover fill: detecta a borda de entrada/saída e desliza um preenchimento a partir dela */
  function edgeOf(el, e) {
    var r = el.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width - 0.5;
    var y = (e.clientY - r.top) / r.height - 0.5;
    return Math.abs(x) > Math.abs(y) ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'bottom' : 'top');
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

    /* directional hover fill nos itens internos do menu (.case-row) */
    el.querySelectorAll('.case-row').forEach(function (row) {
      var rf = document.createElement('span');
      rf.className = 'row-fill';
      rf.setAttribute('aria-hidden', 'true');
      row.insertBefore(rf, row.firstChild);
      row.addEventListener('mouseenter', function (e) { rf.dataset.dir = edgeOf(row, e); row.classList.add('fill-in'); });
      row.addEventListener('mouseleave', function (e) { rf.dataset.dir = edgeOf(row, e); row.classList.remove('fill-in'); });
    });
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
