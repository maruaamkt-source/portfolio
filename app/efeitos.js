'use client';

import { Fragment, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const NS = 'http://www.w3.org/2000/svg';

// Título que sobe de dentro de uma máscara, palavra por palavra
export function Titulo({ as: Tag = 'h2', children }) {
  const texto = String(children);
  const palavras = texto.split(' ');
  return (
    <Tag className="rv" aria-label={texto}>
      {palavras.map((p, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span style={{ '--i': i }}>{p}</span>
          </span>
          {i < palavras.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}

// Linhas diagonais douradas. "d" são segmentos em % da seção: "x1,y1,x2,y2;x1,y1,x2,y2"
export function Linhas({ d }) {
  return <svg className="linhas" data-l={d} aria-hidden="true" />;
}

// Todos os efeitos de página. Não mexe na animação do rei.
export function Efeitos() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const limpar = [];

    // Roda fn quando o elemento entra na tela (ou já, se já passou)
    const quando = (el, fn, start = 0.88) => {
      if (reduce || el.getBoundingClientRect().top < window.innerHeight * start) {
        fn();
        return;
      }
      ScrollTrigger.create({
        trigger: el,
        start: `top ${start * 100}%`,
        once: true,
        onEnter: fn,
      });
    };

    const ctx = gsap.context(() => {
      // 1) Títulos revelados em máscara
      document.querySelectorAll('.rv').forEach((el) => {
        quando(el, () => el.classList.add('in'));
      });

      // 6) Cards e tiles entram em sequência
      document.querySelectorAll('[data-seq]').forEach((box) => {
        const itens = box.querySelectorAll('.seq');
        quando(box, () => itens.forEach((i) => i.classList.add('in')), 0.85);
      });

      // 2) Linhas douradas que se desenham com o scroll
      document.querySelectorAll('.linhas').forEach((svg) => {
        const sec = svg.parentElement;
        const segs = svg.dataset.l.split(';').map((s) => s.split(',').map(Number));
        const linhas = segs.map(() => {
          const l = document.createElementNS(NS, 'line');
          svg.appendChild(l);
          return l;
        });
        const st = { p: reduce ? 1 : 0 };

        const pintar = () => {
          linhas.forEach((l) => {
            l.style.strokeDashoffset = String(l._len * (1 - st.p));
          });
        };
        const medir = () => {
          const w = sec.offsetWidth;
          const h = sec.offsetHeight;
          svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
          segs.forEach(([x1, y1, x2, y2], i) => {
            const l = linhas[i];
            const ax = (x1 * w) / 100;
            const ay = (y1 * h) / 100;
            const bx = (x2 * w) / 100;
            const by = (y2 * h) / 100;
            l.setAttribute('x1', ax);
            l.setAttribute('y1', ay);
            l.setAttribute('x2', bx);
            l.setAttribute('y2', by);
            l._len = Math.hypot(bx - ax, by - ay);
            l.style.strokeDasharray = String(l._len);
          });
          pintar();
        };

        medir();
        ScrollTrigger.addEventListener('refresh', medir);
        limpar.push(() => {
          ScrollTrigger.removeEventListener('refresh', medir);
          svg.replaceChildren();
        });

        if (!reduce) {
          gsap.to(st, {
            p: 1,
            ease: 'none',
            onUpdate: pintar,
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              end: 'top 25%',
              scrub: 0.8,
            },
          });
        }
      });

      // 4) Piso de tabuleiro com parallax (anda devagar com o scroll)
      const piso = document.querySelector('.tabuleiro i');
      if (piso && !reduce) {
        const pos = { y: 0 };
        gsap.to(pos, {
          y: -520,
          ease: 'none',
          onUpdate: () => {
            piso.style.backgroundPosition = `0 ${pos.y}px`;
          },
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });
        limpar.push(() => {
          piso.style.backgroundPosition = '';
        });
      }
    });

    // 3) Brilho que segue o mouse nos cards e tiles (e inclinação nos tiles)
    if (fino) {
      document.querySelectorAll('.foco-card, .tile').forEach((el) => {
        const inclina = !reduce && el.classList.contains('tile');
        const mover = (e) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y}px`);
          if (inclina) {
            const px = x / r.width - 0.5;
            const py = y / r.height - 0.5;
            el.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
          }
        };
        const sair = () => {
          if (inclina) el.style.transform = '';
        };
        el.addEventListener('pointermove', mover);
        el.addEventListener('pointerleave', sair);
        limpar.push(() => {
          el.removeEventListener('pointermove', mover);
          el.removeEventListener('pointerleave', sair);
          el.style.transform = '';
        });
      });
    }

    // 5) Casa marcada embaixo do rei quando ele "pousa" (só lê a posição do scroll)
    const rei = document.querySelector('.king');
    const foco = document.getElementById('foco');
    const contato = document.getElementById('contato');
    if (rei && foco && contato && !reduce) {
      let raf = 0;
      const atualizar = () => {
        raf = 0;
        const H = window.innerHeight;
        const f = foco.getBoundingClientRect().top;
        const c = contato.getBoundingClientRect().top;
        const pousado = (f <= H * 0.4 && c >= H * 0.9) || c <= H * 0.15;
        rei.classList.toggle('pousou', pousado);
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
        rei.classList.remove('pousou');
      });
    }

    return () => {
      limpar.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <div className="tabuleiro" aria-hidden="true">
      <i />
    </div>
  );
}