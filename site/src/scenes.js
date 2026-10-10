// Cenas do palco (vídeos de fundo em public/videos/<nome>.webm|.mp4|.jpg).
// Cada seção declara a sua cena com data-scene="nome" e, opcional, data-scene-dim="0.0–0.9"
// (escurece o vídeo para dar contraste ao texto).
export const SCENES = {
  orbe:       { capitulo: 'Faísca',     desc: 'Orbe de luz âmbar respirando' },
  cidade:     { capitulo: 'Cidade',     desc: 'Mapa noturno de negócios acendendo' },
  feixes:     { capitulo: 'Feixes',     desc: 'Colunas de luz no ritmo das hastes do logo' },
  caustica:   { capitulo: 'Reflexo',    desc: 'Luz atravessando vidro e água (cáusticas)' },
  eclipse:    { capitulo: 'Eclipse',    desc: 'Esfera escura com coroa de luz girando' },
  crepusculo: { capitulo: 'Crepúsculo', desc: 'Horizonte em brasa com névoa volumétrica' },
};
export const sceneSrc = (name, ext) => `videos/${name}.${ext}`;
