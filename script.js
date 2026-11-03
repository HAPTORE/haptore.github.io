// Marca que o JS está ativo (habilita animações de revelação)
document.documentElement.classList.add('js');

// Ano no rodapé
document.getElementById('ano').textContent = new Date().getFullYear();

// Anos de experiência calculados a partir do ano de início
document.querySelectorAll('[data-desde]').forEach(function (el) {
  var anos = new Date().getFullYear() - Number(el.dataset.desde);
  el.textContent = anos + '+';
});

// Tema claro/escuro ("dia" e "noite" na casa)
(function () {
  var raiz = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)');

  function temaAtual() {
    return raiz.getAttribute('data-theme') || (prefereEscuro.matches ? 'dark' : 'light');
  }
  function atualizaMeta() {
    meta.setAttribute('content', temaAtual() === 'dark' ? '#1d1612' : '#f6efe4');
  }

  document.getElementById('tema').addEventListener('click', function () {
    var novo = temaAtual() === 'dark' ? 'light' : 'dark';
    raiz.setAttribute('data-theme', novo);
    raiz.removeAttribute('data-tema-origem');
    try { localStorage.setItem('tema', novo); } catch (e) {}
    atualizaMeta();
  });

  // Tema pelo horário: reavalia a cada minuto para virar a noite às 18h
  setInterval(function () {
    if (raiz.getAttribute('data-tema-origem') !== 'horario') return;
    var h = new Date().getHours();
    raiz.setAttribute('data-theme', h >= 18 || h < 6 ? 'dark' : 'light');
    atualizaMeta();
  }, 60000);

  // Acompanha mudanças no tema do navegador
  if (prefereEscuro.addEventListener) prefereEscuro.addEventListener('change', atualizaMeta);
  atualizaMeta();
})();

// Revela elementos ao rolar
(function () {
  var itens = document.querySelectorAll('.revela');
  if (!('IntersectionObserver' in window)) {
    itens.forEach(function (el) { el.classList.add('visivel'); });
    return;
  }
  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visivel');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  itens.forEach(function (el) { obs.observe(el); });
})();

// Destaca o cômodo atual no menu
(function () {
  var links = document.querySelectorAll('.topo nav a');
  if (!('IntersectionObserver' in window)) return;
  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) {
        a.classList.toggle('ativo', a.getAttribute('href') === '#' + e.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { obs.observe(s); });
})();
