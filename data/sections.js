/* Seções da home — edite aqui. A apresentação fica em home.js + styles.css.
   num       índice exibido no cabeçalho editorial
   accent    cor de acento (dessaturada de propósito)
   keywords  até 3 linhas do cabeçalho editorial ([] = sem palavras-chave)
   title     título vertical (painel fechado) e nome acessível
   href      destino do painel (null = painel não é link)
   img       fundo do painel (caminho a partir da raiz) ou null
   body      id do <template> com o conteúdo expandido em index.html
   fixed     true = painel aberto por padrão (apresentação)
   variant   classe extra opcional (ex.: "col--form")
   brands    true = mostra a faixa de marcas (window.BRANDS) no painel aberto
   locked    texto do cadeado (ex.: 'Em breve'); o painel deixa de ser link */
window.SECTIONS = [
  { num: '01', accent: '#e3b341', keywords: [],
    title: 'Quem sou eu', href: 'sobre/index.html', img: null, body: 'tpl-about', fixed: true },

  { num: '02', accent: '#5fd49a', keywords: ['Estratégia', 'Design', 'Resultados'],
    title: 'Cases de sucesso', href: null, /* sem hub: os 3 cases abrem inline no painel (tpl-cases) */
    img: 'cases/bpx/assets/jornada.webp', body: 'tpl-cases', variant: 'col--cases' },

  { num: '03', accent: '#eea25c', keywords: ['Exploração', 'Aprendizado', 'Ideias'],
    title: 'Outros projetos', href: 'cases/outros-projetos/index.html',
    img: 'cases/outros-projetos/assets/aba3-overlay.webp', body: 'tpl-outros', brands: true },

  { num: '04', accent: '#ec6a7f', keywords: ['Jogos', 'Experiências', 'Interação'],
    title: 'Game design', href: 'cases/game-design/index.html',
    img: 'cases/sao-braz/assets/aba4-games.webp', body: 'tpl-games', locked: 'Em breve' },

  { num: '05', accent: '#a98bf0', keywords: ['Conexões', 'Oportunidades', 'Novos desafios'],
    title: 'Vamos conversar?', href: null, img: null, body: 'tpl-contato', variant: 'col--form' }
];

/* Marcas da faixa (painel 03 e página Outros projetos). */
window.BRANDS = [
  ['dilis', 'Dilis'], ['pepsi', 'Pepsi'], ['redbull', 'Red Bull'], ['boticario', 'O Boticário'],
  ['oracle', 'Oracle'], ['americanas', 'Americanas'], ['sicredi', 'Sicredi'], ['midea', 'Midea'],
  ['brisanet', 'Brisanet'], ['condor', 'Condor'], ['spaten', 'Spaten'], ['maizena', 'Maizena'], ['saobraz', 'São Braz']
];
