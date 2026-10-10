"""Trilha sonora do trailer Lumini — sintetizada do zero, só com numpy.

Gera brand/assets/trailer/lumini-trailer-audio.wav (48 kHz, estéreo, 40 s),
sincronizada com a timeline de brand/trailer.html.

Uso: python3 tools/trailer-audio.py
"""
import wave
from pathlib import Path

import numpy as np

SR = 48000
DUR = 40.0
N = int(SR * DUR)
t_all = np.arange(N) / SR
rng = np.random.default_rng(11)
OUT = Path(__file__).resolve().parent.parent / "brand/assets/trailer/lumini-trailer-audio.wav"


def hz(note):
    names = {"C": -9, "C#": -8, "D": -7, "D#": -6, "E": -5, "F": -4, "F#": -3, "G": -2, "G#": -1, "A": 0, "A#": 1, "B": 2}
    name, octave = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[name] + (octave - 4) * 12) / 12)


def place(buf, start, sig, gain=1.0, pan=0.0):
    """Soma um sinal mono no buffer estéreo a partir de `start` segundos."""
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i] * gain
    left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[0, i : i + len(sig)] += sig * left
    buf[1, i : i + len(sig)] += sig * right


def env_adsr(n, a, r, sustain=1.0):
    e = np.full(n, sustain)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, sustain, na) ** 1.5
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def fft_filter(x, lo=None, hi=None):
    """Filtro estático passa-banda suave via FFT."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if hi:
        m *= 1 / np.sqrt(1 + (f / hi) ** 4)
    if lo:
        m *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** 4)
    return np.fft.irfft(X * m, len(x))


def stft_lowpass(x, cutoff):
    """Passa-baixa variável no tempo (cutoff: array por amostra), via STFT com overlap-add."""
    B, H = 2048, 512
    win = np.hanning(B)
    out = np.zeros(len(x) + B)
    norm = np.zeros(len(x) + B)
    xp = np.concatenate([x, np.zeros(B)])
    f = np.fft.rfftfreq(B, 1 / SR)
    for s in range(0, len(x), H):
        fr = xp[s : s + B] * win
        c = cutoff[min(s + B // 2, len(cutoff) - 1)]
        m = 1 / np.sqrt(1 + (f / c) ** 4)
        out[s : s + B] += np.fft.irfft(np.fft.rfft(fr) * m, B) * win
        norm[s : s + B] += win**2
    return (out / np.maximum(norm, 1e-6))[: len(x)]


def tone(freq, dur, partials=6, detune=4.0, bright=1.5):
    """Nota de pad: harmônicos com coro (3 vozes levemente desafinadas)."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for c in (-detune, 0, detune):
        f0 = freq * 2 ** (c / 1200)
        ph = rng.uniform(0, 2 * np.pi)
        for k in range(1, partials + 1):
            s += np.sin(2 * np.pi * f0 * k * t + ph * k) / k**bright
    return s / 3


def pluck(freq, dur=1.6, decay=5.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * freq * 2 * t) * np.exp(-t * 9) + 0.12 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t * 14)
    att = np.minimum(1, t / 0.004)
    return s * np.exp(-t * decay) * att


def bell(freq, dur=2.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ratios = [(1, 1, 2.2), (2.76, 0.45, 4.0), (5.4, 0.25, 6.5), (8.93, 0.12, 9.0)]
    s = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * d) for r, a, d in ratios)
    return s * np.minimum(1, t / 0.002)


def kick(dur=0.6, f0=110, f1=42):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5)


def boom(dur=4.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 38 + 60 * np.exp(-t * 6)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.1)
    noise = fft_filter(rng.standard_normal(n), hi=900) * np.exp(-t * 3.5) * 0.5
    return sub + noise


def tick(dur=0.05, lo=6000):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return fft_filter(rng.standard_normal(n), lo=lo) * np.exp(-t * 90)


def riser(dur, f_start=300, f_end=9000):
    n = int(dur * SR)
    p = np.linspace(0, 1, n)
    noise = rng.standard_normal(n)
    cutoff = f_start * (f_end / f_start) ** (p**1.6)
    s = stft_lowpass(noise, cutoff) * p**2.2
    sweep = np.sin(2 * np.pi * np.cumsum(180 * 2 ** (p * 2.5)) / SR) * p**3 * 0.25
    return s + sweep


def reverb(x, seconds=3.2, mix=0.32):
    """Reverberação por convolução com resposta impulsiva sintética (decorrelacionada por canal)."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros_like(x)
    for ch in range(2):
        ir = rng.standard_normal(n) * np.exp(-t * 6.9 / seconds)
        ir = fft_filter(ir, hi=5200, lo=120)
        ir /= np.sqrt(np.sum(ir**2))
        L = len(x[ch]) + n
        nfft = 1 << (L - 1).bit_length()
        y = np.fft.irfft(np.fft.rfft(x[ch], nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x[ch])]
        out[ch] = x[ch] * (1 - mix) + y * mix * 1.8
    return out


pad = np.zeros((2, N))
fx = np.zeros((2, N))
dry = np.zeros((2, N))

# ---------------- PAD (acordes) ----------------
CHORDS = [
    (0.8, 13.6, ["D3", "A3", "C#4", "E4", "F#4"], 0.050, 2600),      # Faísca + Negócios
    (13.0, 18.6, ["B2", "F#3", "D4", "C#4"], 0.050, 900),            # No escuro
    (19.1, 23.9, ["G2", "D3", "F#3", "A3", "B3"], 0.050, 2200),      # Acender
    (23.4, 28.1, ["A2", "E3", "A3", "B3", "C#4", "E4"], 0.052, 3200),
    (30.6, 40.0, ["D2", "D3", "A3", "C#4", "E4", "F#4", "A4"], 0.060, 3800),  # Ignição e assinatura
]
for start, end, notes, g, cut in CHORDS:
    dur = end - start
    for k, nm in enumerate(notes):
        s = tone(hz(nm), dur)
        s = fft_filter(s, hi=cut)
        e = env_adsr(len(s), a=min(2.2, dur * 0.4), r=min(2.0, dur * 0.35))
        trem = 1 + 0.08 * np.sin(2 * np.pi * (0.13 + 0.03 * k) * np.arange(len(s)) / SR + k)
        place(pad, start, s * e * trem, gain=g, pan=(k / max(1, len(notes) - 1) - 0.5) * 0.7)
# drone grave de tensão na cena 3
dr = tone(hz("B1"), 5.6, partials=3)
place(pad, 13.0, fft_filter(dr, hi=400) * env_adsr(len(dr), 2.5, 1.2), gain=0.09)

# ---------------- CENA 1: a faísca ----------------
place(fx, 0.8, tick(0.03, lo=3000), gain=0.25)
place(fx, 0.8, bell(hz("D7"), 3.0), gain=0.05, pan=0.1)
place(fx, 0.82, pluck(hz("A5"), 2.5, decay=2.2), gain=0.08)

# ---------------- CENA 2: negócios acendendo ----------------
for tt, nm, pan in zip([5.2, 6.65, 8.15, 9.65, 11.15], ["D5", "F#5", "A5", "B5", "D6"], [-0.3, 0.3, -0.2, 0.25, 0]):
    place(fx, tt, pluck(hz(nm), 2.0, decay=3.2), gain=0.16, pan=pan)
    place(fx, tt, pluck(hz(nm) / 2, 1.5, decay=4.5), gain=0.06, pan=pan)
penta = ["D6", "E6", "F#6", "A6", "B6", "D7"]
for tt in np.sort(rng.uniform(6.2, 12.9, 46)):
    place(fx, tt, pluck(hz(rng.choice(penta)), 0.6, decay=9), gain=0.022 + 0.02 * rng.random(), pan=rng.uniform(-0.8, 0.8))
beat = 60 / 100
for k in range(int((12.9 - 5.0) / beat)):
    tt = 5.0 + k * beat
    place(dry, tt, kick(0.5, 90, 40), gain=0.20 * min(1, (tt - 4.8) / 2.5))

# ---------------- CENA 3: no escuro ----------------
down = ["B5", "A5", "F#5", "E5", "D5", "B4", "A4", "F#4"]
for k, tt in enumerate(np.sort(rng.uniform(13.7, 17.4, 8))):
    s = pluck(hz(down[k]), 0.9, decay=7)[::-1] * 0.6 + pluck(hz(down[k]), 0.9, decay=7)
    place(fx, tt, s, gain=0.05, pan=rng.uniform(-0.6, 0.6))
place(fx, 17.6, fft_filter(rng.standard_normal(int(0.8 * SR)), hi=400) * np.linspace(0.6, 0, int(0.8 * SR)) ** 2, gain=0.08)

# ---------------- CENA 4: acender ----------------
place(fx, 18.4, riser(0.8, 150, 3000), gain=0.10)
place(dry, 19.15, boom(4.0), gain=0.34)
place(fx, 19.15, bell(hz("D6"), 3), gain=0.05)
beat = 60 / 112
for k in range(int((26.5 - 22.4) / beat)):
    tt = 22.4 + k * beat
    place(dry, tt, kick(0.45, 120, 45), gain=0.24)
    place(dry, tt + beat / 2, tick(0.04, lo=7000), gain=0.05, pan=0.3)
    if k % 2 == 1:
        place(dry, tt, tick(0.12, lo=2500) * 0.6, gain=0.06, pan=-0.2)
for tt, nm in zip([22.5, 23.55, 24.6, 25.65], ["D5", "F#5", "A5", "D6"]):
    place(fx, tt, pluck(hz(nm), 1.8, decay=3.5), gain=0.15)
    place(fx, tt, pluck(hz(nm) * 1.5, 1.2, decay=6), gain=0.04)
for tt, nm in zip([26.6, 26.9, 27.2], ["A5", "B5", "D6"]):
    place(fx, tt, pluck(hz(nm), 0.8, decay=7), gain=0.17)
place(fx, 26.0, riser(2.05, 250, 12000), gain=0.16)

# ---------------- CENA 5: ignição ----------------
for k in range(11):
    place(dry, 28.4 + k * 0.09, tick(0.03, lo=4500), gain=0.06, pan=-0.6 + k * 0.12)
n = int(1.7 * SR)
tt_ = np.arange(n) / SR
gliss = np.sin(2 * np.pi * np.cumsum(hz("D3") * 2 ** (tt_ / 1.7 * 2)) / SR) * (tt_ / 1.7) ** 2
place(fx, 28.4, fft_filter(gliss, hi=2500), gain=0.07)
for tt, (nm, pan) in zip([30.1, 30.28], [("A6", -0.35), ("D7", 0.35)]):
    for off in (0, 0.09, 0.15):
        place(fx, tt + off, bell(hz(nm), 1.8 if off == 0.15 else 0.12), gain=0.06 if off < 0.15 else 0.10, pan=pan)
place(dry, 30.62, boom(5.0), gain=0.42)
cym = rng.standard_normal(int(3.5 * SR))
cym = fft_filter(cym, lo=4000) * np.exp(-np.arange(len(cym)) / SR * 1.6)
place(fx, 30.62, cym, gain=0.05)
place(fx, 31.1, bell(hz("F#6"), 3), gain=0.05, pan=0.2)

# ---------------- CENA 6: assinatura ----------------
place(fx, 35.2, bell(hz("D6"), 3.5), gain=0.07)
place(fx, 35.8, pluck(hz("A5"), 2.0, decay=2.5), gain=0.07, pan=-0.2)
place(dry, 36.6, kick(1.2, 70, 36), gain=0.22)
place(fx, 36.9, pluck(hz("F#5"), 2.0, decay=2.5), gain=0.06, pan=0.2)

# ---------------- mix ----------------
mix = reverb(pad + fx, 3.4, 0.34) + dry
fade = np.ones(N)
fade[-int(2.0 * SR):] = np.linspace(1, 0, int(2.0 * SR)) ** 1.5
fade[: int(0.05 * SR)] = np.linspace(0, 1, int(0.05 * SR))
mix *= fade
mix = np.tanh(mix * 1.4) / 1.4
mix /= np.max(np.abs(mix)) / 0.89

OUT.parent.mkdir(parents=True, exist_ok=True)
pcm = (mix.T * 32767).astype(np.int16)
with wave.open(str(OUT), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("ok:", OUT)
