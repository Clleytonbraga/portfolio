/* Seções da home — edite aqui. A apresentação fica em home.js + styles.css.
   num       índice exibido no cabeçalho editorial
   accent    cor de acento (dessaturada de propósito)
   keywords  até 3 linhas do cabeçalho editorial ([] = sem palavras-chave)
   title     título vertical (painel fechado) e nome acessível
   href      destino do painel (null = painel expande inline, não é link)
   img       fundo do painel (caminho a partir da raiz) ou null
   body      id do <template> com o conteúdo expandido em index.html
   fixed     true = painel aberto por padrão (apresentação)
   variant   classe extra opcional (ex.: "col--form", "col--cases")

   Estrutura v2: 01 Quem sou eu · 02 Produto web · 03 Game design · 04 SaaS e apps · 05 Contato.
   As abas 02/03/04 expandem inline numa lista de cases (não têm página de hub).
   "Marcas atendidas" saiu da home → agora é a faixa no /sobre (Dilis incluída). */
window.SECTIONS = [
  { num: '01', accent: '#e3b341', keywords: [],
    title: 'Quem sou eu', href: 'sobre/index.html', img: null, body: 'tpl-about', fixed: true },

  { num: '02', accent: '#5fd49a', keywords: ['Estratégia', 'Design', 'Resultados'],
    title: 'Produto web', href: null, /* lista inline dos cases no painel (tpl-produto) */
    img: 'cases/bpx/assets/jornada.webp', body: 'tpl-cases', variant: 'col--cases' },

  { num: '03', accent: '#ec6a7f', keywords: ['Jogos', 'Experiências', 'Interação'],
    title: 'Game design', href: null,
    img: 'cases/sao-braz/assets/aba4-games.webp', body: 'tpl-games', variant: 'col--cases' },

  { num: '04', accent: '#eea25c', keywords: ['Ferramentas', 'Fluxos', 'Dados'],
    title: 'SaaS e apps', href: null,
    img: 'cases/outros-projetos/assets/aba3-overlay.webp', body: 'tpl-saas', variant: 'col--cases' },

  { num: '05', accent: '#a98bf0', keywords: ['Conexões', 'Oportunidades', 'Novos desafios'],
    title: 'Vamos conversar?', href: null, img: null, body: 'tpl-contato', variant: 'col--form' }
];
