# Lumini

> **Toda marca merece brilhar.**

A Lumini cria sites para restaurantes, autônomos, pequenas e grandes empresas.
Fundadores: **Fernando Rateke** e **Cauã Canova**.

Este repositório guarda a **identidade visual** da marca, base para o futuro site, e os **projetos** feitos com ela.

## Projetos

| Projeto | O que é |
|---|---|
| [`projetos/museu-das-conchas/`](projetos/museu-das-conchas/) | Site conceito do **Museu das Conchas Itapirubá** (Imbituba, SC): um mergulho do topo ao abismo e de volta à praia, com oceano em WebGL, 12 conchas 3D geradas por código, horário ao vivo, calculadora de ingressos, agendamento de escolas e um guia da marca do museu. Detalhes e fontes em [`docs/museu-das-conchas.md`](docs/museu-das-conchas.md). |

## O que tem aqui

| Caminho | Conteúdo |
|---|---|
| [`brand/index.html`](brand/index.html) | **Brand book interativo:** essência, logo, cores, tipografia, grid, ícones, texturas, componentes de UI, movimento (com demos ao vivo), voz, aplicações e trailer |
| [`brand/trailer.html`](brand/trailer.html) | Trailer de lançamento (40s) tocando ao vivo no navegador |
| `brand/assets/trailer/` | Trailer renderizado em MP4 (16:9 e 9:16), pôsteres e trilha original |
| `brand/assets/logo/` | 13 SVGs: logotipo, assinaturas horizontal e vertical, símbolo, favicon e ícone de app (noite, dia e mono) |
| [`brand/tokens/tokens.css`](brand/tokens/tokens.css) · [`tokens.json`](brand/tokens/tokens.json) | Design tokens prontos para o código do site |
| [`docs/identidade-visual.md`](docs/identidade-visual.md) | Manual em texto (estratégia, regras e especificações) |
| [`docs/trailer-roteiro.md`](docs/trailer-roteiro.md) | Roteiro cena a cena do trailer |
| `tools/` | Scripts que geram os logos, a trilha e os vídeos |

## Ver localmente

Abra `brand/index.html` no navegador, ou sirva a pasta:

```bash
npx serve brand
```

As fontes vêm do Google Fonts: Funnel Display, Funnel Sans, Instrument Serif e Martian Mono (todas OFL, gratuitas).

Para ver o site do museu: `npx serve projetos/museu-das-conchas` (ele usa módulos ES, então precisa de servidor).

## Regenerar os arquivos

```bash
node tools/build-logos.mjs        # SVGs do logo, a partir da geometria
python3 tools/trailer-audio.py    # trilha do trailer (numpy)
node tools/render-trailer.mjs     # MP4 16:9 e 9:16 (Playwright + ffmpeg)
```

## A identidade em uma linha

Luz sobre a noite: um logotipo desenhado só com hastes e arcos, dois pontos de luz âmbar (um para cada fundador) e uma porta iluminada como símbolo, porque o site é a porta do negócio e a Lumini acende a luz.
