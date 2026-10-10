// Base das cenas de fundo: WebGL em tela cheia + ruído periódico (loop perfeito).
// Cada cena chama Scene({ fragment, loop }) e ganha window.seek(t), window.LOOP e window.ready.
// Pré-visualização: abra tools/scenes/<nome>.html no navegador (toca em tempo real).
// Captura: ?capture=1 (o renderizador chama seek(t) quadro a quadro).
//
// Uniforms disponíveis no fragment shader:
//   uRes (vec2, px)   uTime (s, 0..LOOP)   uPhase (0..1 no loop)   uLoop (s)
// Funções GLSL incluídas (todas periódicas no eixo z com período P → use z = uPhase * P):
//   float hash31(vec3)  float pnoise(vec3 p, float P)  float pfbm(vec3 p, float P, int oct)
//   vec2 rot(vec2, float)
// Paleta: NOITE, LUME, BRASA, HALO, LUZ, NUCLEO (vec3)
export const GLSL_LIB = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uPhase; uniform float uLoop;
#define TAU 6.28318530718
const vec3 NOITE = vec3(0.031,0.035,0.051);
const vec3 LUME  = vec3(1.0,0.71,0.278);
const vec3 BRASA = vec3(1.0,0.416,0.169);
const vec3 HALO  = vec3(1.0,0.89,0.69);
const vec3 LUZ   = vec3(0.949,0.937,0.91);
const vec3 NUCLEO= vec3(1.0,0.965,0.88);
float hash31(vec3 p){ p=fract(p*vec3(0.1031,0.1030,0.0973)); p+=dot(p,p.yxz+33.33); return fract((p.x+p.y)*p.z); }
float pnoise(vec3 p, float P){
  vec3 i=floor(p), f=fract(p); vec3 u=f*f*f*(f*(f*6.-15.)+10.);
  float z0=mod(i.z,P), z1=mod(i.z+1.,P);
  float a=hash31(vec3(i.xy,z0)), b=hash31(vec3(i.xy+vec2(1,0),z0)), c=hash31(vec3(i.xy+vec2(0,1),z0)), d=hash31(vec3(i.xy+vec2(1,1),z0));
  float e=hash31(vec3(i.xy,z1)), f1=hash31(vec3(i.xy+vec2(1,0),z1)), g=hash31(vec3(i.xy+vec2(0,1),z1)), h=hash31(vec3(i.xy+vec2(1,1),z1));
  return mix(mix(mix(a,b,u.x),mix(c,d,u.x),u.y), mix(mix(e,f1,u.x),mix(g,h,u.x),u.y), u.z);
}
float pfbm(vec3 p, float P, int oct){
  float v=0., a=.5;
  for(int k=0;k<8;k++){ if(k>=oct) break; v+=a*pnoise(p,P); p.xy=p.xy*2.03+vec2(1.7,9.2); p.z*=2.; P*=2.; a*=.5; }
  return v;
}
vec2 rot(vec2 p, float a){ float c=cos(a), s=sin(a); return vec2(c*p.x-s*p.y, s*p.x+c*p.y); }
`;

export function Scene({ fragment, loop = 10 }) {
  const Q = new URLSearchParams(location.search);
  const CAPTURE = Q.has('capture');
  const cv = document.createElement('canvas');
  document.body.appendChild(cv);
  Object.assign(document.body.style, { margin: 0, background: '#000', overflow: 'hidden' });
  Object.assign(cv.style, { width: '100vw', height: '100vh', display: 'block' });
  const gl = cv.getContext('webgl', { preserveDrawingBuffer: true, antialias: false, alpha: false });
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, GLSL_LIB + fragment));
  gl.linkProgram(pr); gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);
  const uRes = U('uRes'), uTime = U('uTime'), uPhase = U('uPhase'), uLoop = U('uLoop');
  const size = () => { const d = CAPTURE ? 1 : Math.min(devicePixelRatio || 1, 1.5); cv.width = innerWidth * d; cv.height = innerHeight * d; gl.viewport(0, 0, cv.width, cv.height); };
  size(); addEventListener('resize', size);
  const seek = t => {
    t = ((t % loop) + loop) % loop;
    gl.uniform2f(uRes, cv.width, cv.height); gl.uniform1f(uTime, t); gl.uniform1f(uPhase, t / loop); gl.uniform1f(uLoop, loop);
    gl.drawArrays(gl.TRIANGLES, 0, 3); gl.finish();
  };
  window.seek = seek; window.LOOP = loop; window.ready = Promise.resolve(true);
  if (!CAPTURE) { const t0 = performance.now(); const f = () => { seek((performance.now() - t0) / 1000); requestAnimationFrame(f); }; requestAnimationFrame(f); }
  else seek(0);
}
