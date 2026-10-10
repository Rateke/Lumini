# Lumini — Manual de Identidade Visual · v1.0

> **Toda marca merece brilhar.**

Este documento é a versão em texto do manual. A versão completa, interativa e com todas as animações funcionando está em [`brand/index.html`](../brand/index.html). O trailer está em [`brand/trailer.html`](../brand/trailer.html) e o vídeo renderizado em `brand/assets/trailer/`.

Fundadores: **Fernando Rateke** e **Cauã Canova** · Outubro de 2026

---

## 1. Essência

### O que a Lumini faz
Criamos sites para todo tamanho de negócio: o cardápio digital da pizzaria, o portfólio do personal trainer, o site da loja do bairro e o portal da empresa com 500 funcionários.

### A ideia central: luz
*Lumini* vem de *lumen*, a unidade de medida da luz. Um negócio sem presença online está no escuro: existe, mas ninguém vê. Nosso trabalho é acender a luz.

Toda a identidade nasce dessa metáfora:

| Elemento | Como a luz aparece |
|---|---|
| Logo | Os dois pontos dos “i” são duas luzes acesas, uma para cada fundador |
| Símbolo | Uma porta (o arco do “n”) com uma luz dentro. O site é a porta do negócio; a Lumini acende a luz |
| Cores | Um fundo de noite com luzes quentes, nomeadas pela temperatura em Kelvin |
| Movimento | As coisas não “aparecem”: elas **acendem** |

### Propósito
Fazer qualquer negócio, de qualquer tamanho, ser visto e lembrado na internet.

### Missão
Entregar sites bonitos, rápidos e que vendem, com atendimento próximo e preço justo para cada tamanho de negócio.

### Visão
Ser a referência brasileira em sites com cara de premiação para negócios reais.

### Valores
1. **Clareza:** falamos simples, entregamos no prazo e mostramos o processo.
2. **Capricho:** cada pixel e cada milissegundo de animação importam.
3. **Proximidade:** o cliente fala com quem faz o site.
4. **Resultado:** um site bonito que não vende não está pronto.

### Para quem
| Público | O que precisa | Como falamos |
|---|---|---|
| Restaurantes e food service | Cardápio digital, reservas, delivery, Google Maps | Apetite, fotos, rapidez no celular |
| Autônomos e profissionais liberais | Portfólio, agenda, botão de WhatsApp | Credibilidade e confiança |
| Pequenas empresas | Site institucional, catálogo, SEO local | Profissionalismo acessível |
| Médias e grandes empresas | Portais, e-commerce, sistemas sob medida, performance | Escala, segurança e dados |

### Personalidade
- **Luminosa, nunca ofuscante:** confiante sem arrogância.
- **Técnica, nunca fria:** dominamos código, mas falamos português.
- **Premium, nunca elitista:** o mesmo capricho para a pizzaria e para a multinacional.
- **Cinematográfica:** movimento com intenção, como uma boa abertura de filme.

---

## 2. Slogans e linhas de apoio

| Uso | Texto |
|---|---|
| **Slogan principal** | Toda marca merece brilhar. |
| Assinatura curta | Acendemos marcas. |
| Manifesto (1 linha) | Seu site é a porta do seu negócio. A gente acende a luz. |
| Abrangência | Do cardápio ao corporativo. |
| CTA | Vamos acender a sua marca? |
| Trailer | Na internet, quem não é visto não é lembrado. |

**Nomes sugeridos para os planos** (pela intensidade da luz):
- **Faísca:** página única para autônomos e lançamentos.
- **Lanterna:** site completo para restaurantes e pequenas empresas.
- **Farol:** projetos sob medida, e-commerce e grandes empresas.

---

## 3. Logo

### Construção
O logotipo é desenhado, não digitado. Todas as letras de *l·u·m·i·n·i* são feitas só de **hastes e arcos**:

- Unidade: **altura-x = 100u**
- Traço: **24u**, pontas retas
- Arcos: semicírculos perfeitos com **raio 38u** no eixo do traço
- Ascendente do “l”: **150u**
- Pontos: círculos de **raio 15u**, centro a **132u** da linha de base
- Ritmo: **58u** entre letras e **76u** dentro da letra (o diâmetro do arco). Esse compasso de colunas vira padrão gráfico (os “feixes”)

O **símbolo** é o arco do “n” (porta) com o ponto de luz no **centro exato do arco**, de modo que luz e porta são concêntricas.

### Versões (arquivos em `brand/assets/logo/`)
| Arquivo | Uso |
|---|---|
| `lumini-logotipo.svg` | Principal, sobre fundo Noite |
| `lumini-logotipo-sem-brilho.svg` | Tamanhos pequenos (o glow some abaixo de 120px) |
| `lumini-logotipo-dia.svg` | Sobre fundos claros (pontos em Brasa) |
| `lumini-logotipo-mono-claro.svg` / `-mono-escuro.svg` | Uma cor: gravação, carimbo, bordado |
| `lumini-assinatura-horizontal.svg` | Símbolo + logotipo: cabeçalhos, assinaturas |
| `lumini-assinatura-vertical.svg` | Capas, redes sociais, materiais quadrados |
| `lumini-simbolo.svg` | Avatar, favicon, marca d'água |
| `lumini-app-icon.svg` / `favicon.svg` | Ícone de app e aba do navegador |

Para regenerar os SVGs a partir da geometria: `node tools/build-logos.mjs`.

### Área de proteção
Mantenha livre ao redor do logo uma margem igual à **altura-x (100u)**. Nada entra nessa área.

### Tamanho mínimo
- Logotipo: **72px** de largura em tela, **18mm** impresso.
- Símbolo: **16px** em tela (favicon), **5mm** impresso.

### Não faça
1. Não distorça nem incline.
2. Não troque a cor das hastes por âmbar (a luz está só nos pontos).
3. Não aplique sobre fotos agitadas sem um véu escuro.
4. Não adicione sombra, contorno ou efeito 3D.
5. Não reescreva “lumini” com outra fonte.
6. Não use em caixa-alta (“LUMINI”) como logo. Em texto corrido, escreva “Lumini”.

---

## 4. Cores

A paleta é organizada como **luz sobre a noite**. As cores quentes são nomeadas pela temperatura de cor (Kelvin), igual à luz real.

| Token | HEX | Papel | Contraste sobre Noite |
|---|---|---|---|
| `--lu-noite` | `#08090D` | Fundo principal | — |
| `--lu-carvao` | `#0F1117` | Superfícies | — |
| `--lu-grafite` | `#171A22` | Superfícies elevadas | — |
| `--lu-linha` | `#262A35` | Bordas | — |
| `--lu-nevoa` | `#8E93A0` | Texto secundário | 6.5:1 AA |
| `--lu-luz` | `#F2EFE8` | Texto principal | 17.3:1 AAA |
| `--lu-halo` · 3500 K | `#FFE3B0` | Realces | 16.0:1 |
| `--lu-lume` · 2700 K | `#FFB547` | **Cor da marca**, CTAs | 11.3:1 |
| `--lu-brasa` · 1900 K | `#FF6A2B` | Acento quente, hover | 7.0:1 |
| `--lu-cobre` | `#B4460F` | Acento em fundo claro | 4.8:1 sobre Luz |
| `--lu-pedra` | `#5B5F6B` | Texto 2º em fundo claro | 5.5:1 sobre Luz |

**Proporção:** 70% Noite · 20% Luz · 7% Lume · 3% Brasa. A luz só funciona porque é rara.

**Gradientes:** *Ignição* (radial, núcleo branco → âmbar → brasa → noite), *Halo* (luz vindo de cima), *Feixe* (vertical, para as colunas de luz) e *Crepúsculo* (fundo de seções de fechamento).

**Modo Dia:** fundo Luz, texto Noite, acento Cobre. Use em propostas, contratos, documentos e e-mails.

---

## 5. Tipografia

| Papel | Família | Uso |
|---|---|---|
| Display | **Funnel Display** 300–800 | Títulos grandes. As “ink traps” em funil canalizam a luz |
| Texto | **Funnel Sans** 300–700 | Corpo, UI, botões |
| Acento | **Instrument Serif** *itálico* | 1–2 palavras de emoção por título (“*brilhar*”) |
| Utilitário | **Martian Mono** 300–500 | Rótulos, números, metadados, em caixa-alta com espaçamento +0.12em |

Todas são gratuitas (Google Fonts, licença OFL).

**Regras:**
- Títulos display: entrelinha 0.92, espaçamento -0.04em, peso 300 para frases longas e 700 para impacto.
- Nunca mais de **um** acento serifado por título.
- Corpo: 16–22px, entrelinha 1.6, no máximo ~65 caracteres por linha.
- Rótulos mono: 11px, caixa-alta, cor Névoa.

**Escala:** Mega 64→208 · D1 48→120 · D2 36→72 · H1 30→48 · H2 24→34 · H3 22 · Lead 18→22 · Corpo 16 · Small 14 · Label 11 (valores fluidos em `tokens.css`).

---

## 6. Grid, espaço e forma

- **Grid:** 12 colunas · margem lateral `clamp(16px, 4vw, 48px)` · largura máxima 1440px · calha 24px.
- **Espaço:** base 4 → 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.
- **Raios:** 0 (blocos editoriais e imagens grandes), 6 (inputs), 14 (cards), pílula (botões e chips).
- **Breakpoints:** 480 · 768 · 1024 · 1280 · 1440.
- Seções respiram: no mínimo 128px entre seções no desktop e 64px no celular.

---

## 7. Iconografia

- Grade 24×24, área útil 20×20, **traço 1.5px**, pontas retas e cantos arredondados de 2px.
- Cada ícone pode ter **um** ponto de luz em Lume (o “i” da marca).
- Nunca preencha ícones; nunca use emojis como ícones.

---

## 8. Imagem, textura e 3D

- **Fotografia:** luz quente e natural, de preferência em ambientes noturnos ou de fim de tarde. Pessoas reais trabalhando (mãos, balcões, cozinhas). Nada de banco de imagens genérico.
- **Grão:** uma camada sutil de ruído (3–5% de opacidade) sobre o fundo Noite para dar textura cinematográfica.
- **Orbes:** esferas de luz com gradiente *Ignição*, sempre desfocadas nas bordas.
- **Feixes:** colunas verticais de luz no ritmo de 58u do logotipo.
- **3D (WebGL/three.js):** materiais emissivos e vidro com refração. A luz sempre é quente, o ambiente sempre é escuro.

---

## 9. Movimento

### Princípios
1. **Acender, não aparecer.** Entradas combinam desfoque → nitidez + subida curta + opacidade. A luz “liga”.
2. **Uma coisa brilha por vez.** Só um elemento em destaque animado por tela.
3. **Inércia suave.** Rolagem suave (Lenis, lerp 0.1) e nada para de forma brusca.
4. **O cursor é uma fonte de luz.** Ele ilumina o que está por perto.
5. **Respeite quem prefere menos movimento.** `prefers-reduced-motion` desliga tudo que não for essencial.

### Curvas
| Nome | Bezier | Uso |
|---|---|---|
| `lume` | (0.16, 1, 0.3, 1) | Entradas, revelações |
| `eclipse` | (0.76, 0, 0.24, 1) | Transições de página, cortinas |
| `faisca` | (0.34, 1.56, 0.64, 1) | Micro-interações (leve overshoot) |
| `brisa` | (0.45, 0, 0.55, 1) | Loops, respiração de orbes |

### Durações
Instante 120ms · Rápido 240ms · Base 480ms · Lento 900ms · Cena 1400ms · Stagger 60ms.

### Assinaturas de movimento
| Nome | Descrição |
|---|---|
| **Ignição** | O logo liga como uma lâmpada: as hastes sobem como feixes, os pontos piscam 2× e acendem |
| **Revelar pela luz** | Linhas de título sobem de uma máscara com blur 12px → 0 |
| **Pré-carregamento** | Contador 000→100 em mono + orbe crescendo; o orbe voa até o ponto do “i” |
| **Eclipse** | Transição de página: um círculo de noite cobre a tela a partir do clique e outro de luz revela a nova página |
| **Cursor-lanterna** | Ponto de 8px + halo de 240px que ilumina o grão do fundo; cresce sobre links, vira “Ver” sobre projetos |
| **Botão Acender** | No hover, a luz cresce a partir do ponto do botão até preencher tudo |
| **Botão magnético** | CTAs seguem o cursor a até 30% da distância |
| **Letreiro** | Faixa com serviços que acelera com a velocidade da rolagem |
| **Holofote** | Cards de projeto com um brilho radial que segue o mouse |

**Stack sugerida para o site:** Next.js ou Astro · GSAP + ScrollTrigger + SplitText · Lenis · three.js / OGL para WebGL · Barba.js ou View Transitions API.

---

## 10. Voz e tom

Falamos como um amigo que entende muito de internet.

| Fazemos | Evitamos |
|---|---|
| “Seu cardápio no celular do cliente em 1 segundo.” | “Soluções digitais disruptivas e escaláveis.” |
| “A gente cuida do domínio, da hospedagem e do Google.” | “Gerenciamos toda a infraestrutura de DNS e SEO on-page.” |
| “Pronto em 15 dias.” | “Prazo a combinar.” |
| Frases curtas. Verbos de luz: acender, brilhar, iluminar, aparecer. | Jargão, inglês desnecessário, promessas vagas. |

**Glossário de marca:** *acender* (lançar um site), *brilhar* (ter resultado), *faísca* (ideia inicial), *farol* (projeto grande).

---

## 11. Aplicações

O brand book mostra: herói do site (desktop e celular), posts e story do Instagram, cartões de visita (frente e verso), assinatura de e-mail, favicon e ícones de app e capa de proposta (Modo Dia).

---

## 12. Trailer

Roteiro completo em [`docs/trailer-roteiro.md`](trailer-roteiro.md). Versões em 16:9 (YouTube, site) e 9:16 (Reels, TikTok, Shorts) em `brand/assets/trailer/`.
