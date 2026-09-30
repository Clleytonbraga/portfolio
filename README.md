# Portfólio — Cleyton Braga

Site estático, sem build. Um case = uma pasta em `cases/`. Demo interativa = um `<iframe>`.

## Adicionar um case
1. `cp -r cases/_template cases/<slug>`
2. Preencher `cases/<slug>/index.html` (hero, contexto, processo, resultado).
3. Demo interativa — escolher uma:
   - **Widget real:** jogar o HTML standalone do widget em `cases/<slug>/demo/index.html`.
   - **Figma:** descomentar o bloco "OPÇÃO B" e colar o embed do protótipo.
   - **Redesign:** usar o bloco "Antes → Depois" (slider nativo, sem lib).
4. Imagens em `assets/`.
5. Adicionar um `<a class="card">` no `index.html` da raiz apontando pro case.

## Rodar local
`python3 -m http.server` → http://localhost:8000

## Deploy (Vercel)
Site estático, zero config. `vercel` na raiz, ou conectar o repo no painel.
Depois é só linkar cada URL no **Featured** do LinkedIn.

## Seções da home
Os 5 painéis da home são gerados a partir de `data/sections.js` (número, cor, palavras-chave, título, imagem, link).
O conteúdo expandido de cada painel fica num `<template id="tpl-…">` no `index.html`; a montagem é feita por `home.js`.
Estilo do cabeçalho editorial: bloco `.sec-head` em `styles.css`.
