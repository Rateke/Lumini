# Trailer Lumini · Roteiro

**Duração:** 40s · **Formatos:** 16:9 (1920×1080) e 9:16 (1080×1920) · **30 fps**
**Slogan:** Toda marca merece brilhar.

| Arquivo | Uso |
|---|---|
| `brand/assets/trailer/lumini-trailer-16x9.mp4` | YouTube, site, apresentações |
| `brand/assets/trailer/lumini-trailer-9x16.mp4` | Reels, TikTok, Shorts, Stories |
| `brand/trailer.html` | Versão interativa (toca no navegador; botão para alternar 16:9 / 9:16) |
| `brand/assets/trailer/lumini-trailer-audio.m4a` | Trilha original, sintetizada em código |

## Ideia

Cada negócio é uma luz numa cidade à noite. Quem não está na internet se apaga. A Lumini acende de novo, e a luz vira o logo.

## Cenas

| Tempo | Cena | Imagem | Texto na tela | Som |
|---|---|---|---|---|
| 00:00–00:05 | **01 · Faísca** | Escuridão. Um ponto de luz âmbar acende e respira no centro. | Todo negócio começa / com uma *faísca*. | Clique de faísca, sino agudo, pad em Ré maior entrando |
| 00:05–00:13 | **02 · Negócios** | A câmera se afasta: a faísca vira a primeira luz de um mapa noturno. Cada negócio citado acende com um anel de pulso; centenas de outras luzes vão acendendo. | A pizzaria da esquina. / A confeiteira de casa. / O personal trainer. / A loja do bairro. / A empresa com 500 funcionários. | Batida suave a 100 bpm, uma nota para cada negócio (Ré pentatônico subindo), brilhos agudos |
| 00:13–00:19 | **03 · No escuro** | As luzes piscam e se apagam uma a uma, até o escuro total. | Mas na internet, / quem não é visto / não é *lembrado*. | A batida para, o acorde escurece (Si menor), notas descendo, silêncio |
| 00:19–00:28 | **04 · Acender** | Feixes de luz sobem no ritmo das hastes do logo. Janelas de sites entram como um baralho: restaurante, autônoma, loja, empresa. | A Lumini acende / a sua *marca*. · Cardápio que abre *na hora*. · Agenda cheia, *sem esforço*. · A loja do bairro, *no Google*. · Portais que aguentam *o tranco*. · Rápidos. Bonitos. Feitos para *vender*. | Impacto grave nos feixes, groove a 112 bpm, notas a cada janela, subida (riser) até o corte |
| 00:28–00:35 | **05 · Ignição** | As hastes do logotipo sobem como feixes, os arcos se fecham, os dois pontos piscam e acendem. Clarão. | lumini · Toda marca merece *brilhar*. · Sites para restaurantes · autônomos · pequenas e grandes empresas | Tiques de filamento, glissando, dois sinos (os dois pontos), impacto grave e acorde final aberto |
| 00:35–00:40 | **06 · Assinatura** | O símbolo (a porta iluminada) aparece com brilho; assinatura horizontal embaixo. Fade para preto. | Vamos acender a *sua*? · Em breve · 2026 | Sino, nota grave final, fade |

## Notas de direção

- **Texto:** entra com “revelar pela luz” (desfoque 14px → 0, subida curta, curva *lume*) e sai com a curva *eclipse*.
- **HUD de cinema:** cantoneiras, timecode e nome da cena em Martian Mono, discretos; somem antes do logo.
- **Grão e vinheta** em todos os quadros, para textura de filme.
- **Os sites nas janelas são fictícios** (Forno & Brasa, Studio Ana, Empório Vila, Grupo Aurora) e servem só para mostrar a variedade de estilos que a Lumini entrega.

## Como editar e renderizar

1. Altere textos e tempos em `brand/trailer.html` (constantes `BIZ`, `DECK` e a função `seek`).
2. Trilha: `python3 tools/trailer-audio.py` (só precisa de numpy).
3. Vídeos: `node tools/render-trailer.mjs` (Playwright + ffmpeg). Use `--fmt 16x9` para um formato só, ou `--frames 3,12,30` para gerar quadros de teste.
