'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Efeitos interativos novos. Não mexe no hero nem na animação do rei.
export function Interativo() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const limpar = [];

    // 1) LENTE do Sobre: um quadrado segue o mouse e revela a versão dourada do título
    const lente = document.querySelector('.lente');
    if (lente) {
      if (!fino) {
        // Celular/touch: sem lente, mostra direto a versão dourada
        lente.classList.add('toque');
      } else {
        const pos = { x: 0, y: 0 };
        const aplicar = () => {
          lente.style.setProperty('--lx', `${pos.x}px`);
          lente.style.setProperty('--ly', `${pos.y}px`);
        };
        const ponto = (e) => {
          const r = lente.getBoundingClientRect();
          return { x: e.clientX - r.left, y: e.clientY - r.top };
        };
        const entrar = (e) => {
          const p = ponto(e);
          pos.x = p.x;
          pos.y = p.y;
          aplicar();
          lente.classList.add('on');
        };
        const mover = (e) => {
          const p = ponto(e);
          gsap.to(pos, {
            x: p.x,
            y: p.y,
            duration: reduce ? 0 : 0.35,
            ease: 'power3.out',
            overwrite: true,
            onUpdate: aplicar,
          });
        };
        const sair = () => lente.classList.remove('on');

        lente.addEventListener('pointerenter', entrar);
        lente.addEventListener('pointermove', mover);
        lente.addEventListener('pointerleave', sair);
        limpar.push(() => {
          lente.removeEventListener('pointerenter', entrar);
          lente.removeEventListener('pointermove', mover);
          lente.removeEventListener('pointerleave', sair);
          gsap.killTweensOf(pos);
          lente.classList.remove('on', 'toque');
        });
      }
    }

    // 2) CARDS com PESO: o ponto tocado afunda e o card inclina "para trás" naquela ponta
    if (fino && !reduce) {
      document.querySelectorAll('.foco-card').forEach((card) => {
        card.classList.add('peso');

        const mover = (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(card, {
            rotateX: -py * 14,
            rotateY: px * 14,
            z: -26,
            scale: 0.985,
            transformPerspective: 800,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        };
        const sair = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            z: 0,
            scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        };

        card.addEventListener('pointermove', mover);
        card.addEventListener('pointerleave', sair);
        limpar.push(() => {
          card.removeEventListener('pointermove', mover);
          card.removeEventListener('pointerleave', sair);
          gsap.killTweensOf(card);
          gsap.set(card, { clearProps: 'transform' });
          card.classList.remove('peso');
        });
      });
    }

    // 3) CENÁRIO: o piso muda de ângulo com o scroll
    const piso = document.querySelector('.tabuleiro');
    const foco = document.getElementById('foco');
    const projetos = document.getElementById('projetos');
    const contato = document.getElementById('contato');
    if (piso && foco && projetos && contato && !reduce) {
      let raf = 0;
      const doc = (el) => el.getBoundingClientRect().top + window.scrollY;
      const atualizar = () => {
        raf = 0;
        const H = window.innerHeight;
        const y = window.scrollY + H * 0.5;
        const yF = doc(foco);
        const yP = doc(projetos);
        const yPf = yP + projetos.offsetHeight;
        const yC = doc(contato);
        const pts = [[0, 60], [yF, 60], [yP, 18], [yPf - H * 0.5, 18], [yC, 60]];
        let tilt = 60;
        for (let i = 0; i < pts.length - 1; i++) {
          const [x0, t0] = pts[i];
          const [x1, t1] = pts[i + 1];
          if (y >= x0 && y <= x1) {
            let k = x1 === x0 ? 1 : (y - x0) / (x1 - x0);
            k = k * k * (3 - 2 * k);
            tilt = t0 + (t1 - t0) * k;
            break;
          }
        }
        piso.style.setProperty('--tilt', `${tilt.toFixed(1)}deg`);
        piso.style.setProperty('--alt', `${(50 + (60 - tilt) * 0.6).toFixed(1)}vh`);
        document.documentElement.style.setProperty('--feixe', (0.4 + ((tilt - 18) / 42) * 0.6).toFixed(2));
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(atualizar);
      };
      atualizar();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      limpar.push(() => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        piso.style.removeProperty('--tilt');
        piso.style.removeProperty('--alt');
        document.documentElement.style.removeProperty('--feixe');
      });
    }

    // 4) CENÁRIO: poeira flutuando na luz (só com mouse, e se o movimento não estiver reduzido)
    const cv = document.querySelector('.poeira');
    if (cv && fino && !reduce) {
      const c2 = cv.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const N = 100;
      const ps = [];
      const mouse = { x: -999, y: -999 };
      let W = 0;
      let H = 0;
      let rafP = 0;
      let last = 0;

      const medir = () => {
        W = window.innerWidth;
        H = window.innerHeight;
        cv.width = W * dpr;
        cv.height = H * dpr;
        c2.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      const nova = (inicio) => ({
        x: Math.random() * W,
        y: inicio ? Math.random() * H : H + 10,
        r: 0.9 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 6,
        vy: -(8 + Math.random() * 18),
        a: 0.25 + Math.random() * 0.45,
        f: Math.random() * 6,
        ox: 0,
        oy: 0,
      });
      const quadro = (t) => {
        rafP = requestAnimationFrame(quadro);
        const dt = Math.min((t - last) / 1000, 0.05);
        last = t;
        c2.clearRect(0, 0, W, H);
        const cx = W / 2;
        const amorte = Math.exp(-3 * dt);
        for (const p of ps) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 16900 && d2 > 1) {
            const d = Math.sqrt(d2);
            const f = (130 - d) / 130;
            p.ox += (dx / d) * f * 900 * dt;
            p.oy += (dy / d) * f * 900 * dt;
          }
          p.ox *= amorte;
          p.oy *= amorte;
          p.x += (p.vx + p.ox) * dt;
          p.y += (p.vy + p.oy) * dt;
          p.f += dt * 1.2;
          if (p.y < -10 || p.x < -10 || p.x > W + 10) Object.assign(p, nova(false));
          const feixe = 0.55 + 0.45 * Math.exp(-Math.pow((p.x - cx) / (W * 0.28), 2));
          const alfa = p.a * (0.7 + 0.3 * Math.sin(p.f)) * feixe;
          c2.fillStyle = `rgba(255,255,255,${alfa.toFixed(3)})`;
          c2.beginPath();
          c2.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          c2.fill();
        }
      };
      const iniciar = () => {
        if (rafP) return;
        last = performance.now();
        rafP = requestAnimationFrame(quadro);
      };
      const parar = () => {
        if (rafP) cancelAnimationFrame(rafP);
        rafP = 0;
      };
      const visib = () => (document.hidden ? parar() : iniciar());
      const mexer = (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };
      const fora = () => {
        mouse.x = -999;
        mouse.y = -999;
      };

      medir();
      for (let i = 0; i < N; i++) ps.push(nova(true));
      iniciar();
      window.addEventListener('resize', medir);
      window.addEventListener('pointermove', mexer, { passive: true });
      document.addEventListener('pointerleave', fora);
      document.addEventListener('visibilitychange', visib);
      limpar.push(() => {
        parar();
        window.removeEventListener('resize', medir);
        window.removeEventListener('pointermove', mexer);
        document.removeEventListener('pointerleave', fora);
        document.removeEventListener('visibilitychange', visib);
        c2.clearRect(0, 0, W, H);
      });
    }

    // 5) CONTATO: rei inclinado (só aqui) + lente dourada sobre o rei
    const rei = document.querySelector('.king');
    const ouro = document.querySelector('.rei-ouro');
    const moldura = document.querySelector('.lente-rei');
    const secContato = document.getElementById('contato');
    if (rei && secContato && !reduce) {
      const LW = 240; // tamanho do quadrado da lente (px na tela)
      let prog = 0;
      let rafR = 0;
      let ativa = false;
      const pos = { x: 0, y: 0 };

      const desenhar = () => {
        if (!ouro || !moldura) return;
        const r = rei.getBoundingClientRect();
        const w = rei.offsetWidth;
        const h = rei.offsetHeight;
        const s = r.width / w || 1;
        const lx = (pos.x - r.left) / s;
        const ly = (pos.y - r.top) / s;
        const m = LW / s / 2;
        ouro.style.clipPath = `inset(${ly - m}px ${w - (lx + m)}px ${h - (ly + m)}px ${lx - m}px)`;
        moldura.style.transform = `translate(${pos.x - LW / 2}px,${pos.y - LW / 2}px)`;
      };
      const desligar = () => {
        if (!ativa) return;
        ativa = false;
        gsap.ticker.remove(desenhar);
        rei.classList.remove('lente-on');
        if (moldura) moldura.classList.remove('on');
      };
      const ligar = () => {
        if (ativa) return;
        ativa = true;
        desenhar();
        gsap.ticker.add(desenhar);
        rei.classList.add('lente-on');
        if (moldura) moldura.classList.add('on');
      };

      // inclinação: acompanha o mesmo trecho de scroll em que o rei vai para o lado do contato
      const girar = () => {
        rafR = 0;
        const H = window.innerHeight;
        const topo = secContato.getBoundingClientRect().top;
        let p = (H * 0.9 - topo) / (H * 0.75);
        p = Math.min(1, Math.max(0, p));
        p = p * p * (3 - 2 * p);
        prog = p;
        const ang = window.innerWidth < window.innerHeight ? -8 : -16;
        rei.style.setProperty('--giro', `${(p * ang).toFixed(2)}deg`);
        rei.style.setProperty('--flut', p.toFixed(2));
        rei.classList.toggle('inclinado', p > 0.02);
        if (p <= 0.6) desligar();
      };
      const onScrollR = () => {
        if (!rafR) rafR = requestAnimationFrame(girar);
      };

      const mexerR = (e) => {
        if (!fino || !ouro || !moldura) return;
        const r = rei.getBoundingClientRect();
        const m = 120;
        const dentro =
          prog > 0.6 &&
          e.clientX > r.left - m &&
          e.clientX < r.right + m &&
          e.clientY > r.top - m &&
          e.clientY < r.bottom + m;
        if (!dentro) {
          desligar();
          return;
        }
        if (!ativa) {
          pos.x = e.clientX;
          pos.y = e.clientY;
          ligar();
        }
        gsap.to(pos, { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power3.out', overwrite: true });
      };
      const foraR = () => desligar();

      girar();
      window.addEventListener('scroll', onScrollR, { passive: true });
      window.addEventListener('resize', onScrollR);
      window.addEventListener('pointermove', mexerR, { passive: true });
      document.addEventListener('pointerleave', foraR);
      limpar.push(() => {
        if (rafR) cancelAnimationFrame(rafR);
        window.removeEventListener('scroll', onScrollR);
        window.removeEventListener('resize', onScrollR);
        window.removeEventListener('pointermove', mexerR);
        document.removeEventListener('pointerleave', foraR);
        desligar();
        gsap.killTweensOf(pos);
        rei.style.removeProperty('--giro');
        rei.style.removeProperty('--flut');
        rei.classList.remove('inclinado', 'lente-on');
      });
    }

    return () => limpar.forEach((fn) => fn());
  }, []);

  return (
    <>
      <div className="feixe" aria-hidden="true" />
      <span className="lente-rei" aria-hidden="true" />
      <canvas
        className="poeira"
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

// Cena dos projetos: telas flutuando, ligadas por fios; o scroll leva a "câmera" de uma para outra
export function CenaProjetos({ projetos }) {
  const cenaRef = useRef(null);
  const mundoRef = useRef(null);
  const indiceRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    gsap.registerPlugin(ScrollTrigger);

    const cena = cenaRef.current;
    const mundo = mundoRef.current;
    const nos = Array.from(mundo.querySelectorAll('.no'));
    const itens = Array.from(indiceRef.current.querySelectorAll('li'));
    const svg = mundo.querySelector('.fios');
    const NS = 'http://www.w3.org/2000/svg';
    const N = nos.length;
    let pos = [];
    let ativo = -1;

    const criar = (tag, attrs) => {
      const e = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      svg.appendChild(e);
      return e;
    };

    const marcar = (i) => {
      if (i === ativo) return;
      ativo = i;
      nos.forEach((n, k) => n.classList.toggle('ativo', k === i));
      itens.forEach((li, k) => li.classList.toggle('on', k === i));
      svg.querySelectorAll('[data-a]').forEach((el) => {
        el.classList.toggle('on', Number(el.dataset.a) === i || Number(el.dataset.b) === i);
      });
    };

    const montar = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const passo = W < 700 ? W * 0.95 : W * 0.62;
      const dy = [0, -0.14, 0.12, -0.1];
      pos = nos.map((_, i) => ({ x: i * passo, y: dy[i % 4] * H }));
      nos.forEach((n, i) => {
        n.style.left = `${pos[i].x}px`;
        n.style.top = `${pos[i].y}px`;
      });

      svg.replaceChildren();

      // fios curvos entre um projeto e o próximo
      for (let i = 0; i < N - 1; i++) {
        const a = pos[i];
        const b = pos[i + 1];
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2 + (i % 2 ? 130 : -130);
        const p = criar('path', {
          d: `M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`,
          class: 'fio',
        });
        p.dataset.a = i;
        p.dataset.b = i + 1;
      }

      // pontos soltos ao redor de cada projeto, ligados a ele
      pos.forEach((p, i) => {
        for (let k = 0; k < 5; k++) {
          const ang = i * 1.7 + k * 1.25 + 0.6;
          const r = (W < 700 ? 190 : 320) + ((k * 83 + i * 41) % 160);
          const x = p.x + Math.cos(ang) * r * 1.5;
          const y = p.y + Math.sin(ang) * r * 0.8;
          const l = criar('line', { x1: p.x, y1: p.y, x2: x, y2: y, class: 'fio fino' });
          l.dataset.a = i;
          const c = criar('circle', { cx: x, cy: y, r: 2 + (k % 2), class: 'ponto' });
          c.dataset.a = i;
        }
      });
    };

    montar();
    marcar(0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cena,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => marcar(Math.round(self.progress * (N - 1))),
      },
    });
    tl.set(mundo, { x: () => -pos[0].x, y: () => -pos[0].y });
    tl.to({}, { duration: 0.4 });
    for (let i = 1; i < N; i++) {
      tl.to(mundo, { x: () => -pos[i].x, y: () => -pos[i].y, duration: 1, ease: 'power2.inOut' });
      tl.to({}, { duration: 0.4 });
    }

    // anima só quando a cena está na tela
    const io = new IntersectionObserver(
      ([e]) => cena.classList.toggle('visivel', e.isIntersecting),
      { rootMargin: '100px' }
    );
    io.observe(cena);

    let t = 0;
    const aoRedimensionar = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const i = ativo;
        ativo = -1;
        montar();
        marcar(i < 0 ? 0 : i);
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener('resize', aoRedimensionar);

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', aoRedimensionar);
      io.disconnect();
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
      svg.replaceChildren();
      gsap.set(mundo, { clearProps: 'transform' });
      nos.forEach((n) => {
        n.style.left = '';
        n.style.top = '';
        n.classList.remove('ativo');
      });
    };
  }, []);

  return (
    <div className="cena" ref={cenaRef} style={{ '--n': projetos.length }}>
      <div className="cena-palco">
        <div className="mundo" ref={mundoRef}>
          <svg className="fios" aria-hidden="true" />
          {projetos.map((p, i) => (
            <a
              className="no"
              key={p.titulo}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--ry': `${i % 2 ? 12 : -12}deg`, animationDelay: `${-i * 1.7}s` }}
              aria-label={`Ver projeto: ${p.titulo}`}
            >
              <div className="media">
                <img className={p.modo === 'cover' ? 'cover' : 'logo'} src={p.img} alt="" />
              </div>
              <div className="no-texto">
                <span className="tag">{p.tag}</span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
                <span className="no-link">
                  Abrir projeto <span aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
        <ol className="cena-indice" ref={indiceRef} aria-hidden="true">
          {projetos.map((p, i) => (
            <li key={p.titulo}>
              <b>{`0${i + 1}`}</b> {p.titulo}
            </li>
          ))}
        </ol>
        <p className="cena-dica" aria-hidden="true">
          Role para navegar
        </p>
      </div>
    </div>
  );
}