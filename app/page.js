'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Titulo, Linhas, Efeitos } from './efeitos';
import './efeitos.css';

const WHATSAPP =
  'https://wa.me/5511912883525?text=Ol%C3%A1%20Maru%C3%A3%2C%20vi%20seu%20portf%C3%B3lio!';

const MENU = [
  { href: '#topo', texto: 'Início' },
  { href: '#sobre', texto: 'Sobre' },
  { href: '#projetos', texto: 'Projetos' },
  { href: '#contato', texto: 'Contato' },
];

const FOCO = [
  {
    icone: 'social',
    titulo: 'Social media',
    texto: 'Estudo como levar o posicionamento de uma marca para as redes.',
  },
  {
    icone: 'alvo',
    titulo: 'Posicionamento',
    texto:
      'Aprendo a pensar além do vídeo bonito, olhando para o que a marca precisa comunicar.',
  },
  {
    icone: 'site',
    titulo: 'Sites',
    texto: 'Faço sites como algo à parte, ainda como projetos de estudo.',
    aparte: true,
  },
];

const PROJETOS = [
  {
    tag: 'Projeto próprio',
    titulo: 'Routine',
    texto: 'Sistema para organizar a vida em um só lugar: espiritual, financeira, hábitos e obrigações do dia a dia.',
    url: 'https://routine-app-seven-alpha.vercel.app/',
    img: '/projetos/routine.png',
    modo: 'logo',
  },
  {
    tag: 'Projeto próprio · versão beta',
    titulo: 'App de social media',
    texto: 'Primeira versão de um app pensado para a rotina de quem trabalha com redes sociais.',
    url: 'https://mth-sooty.vercel.app/login',
    img: '/projetos/mt.png',
    modo: 'logo',
  },
  {
    tag: 'Trabalho de escola',
    titulo: 'Landing page de imobiliária',
    texto: 'Página de apresentação para uma imobiliária, feita como trabalho escolar.',
    url: 'https://indexhtml-flax-mu.vercel.app/',
    img: '/projetos/linha.webp',
    modo: 'cover',
  },
];

function Icone({ nome }) {
  const props = { viewBox: '0 0 24 24', 'aria-hidden': 'true' };
  if (nome === 'social') {
    return (
      <svg {...props}>
        <path d="M5 4.5h14a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-7l-4 3.5v-3.5H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5z" />
        <path d="M12 13.4s-3-1.7-3-3.7a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2-3 3.7-3 3.7z" />
      </svg>
    );
  }
  if (nome === 'alvo') {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.8" />
        <circle cx="12" cy="12" r="1.2" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18" />
      <path d="M6.5 6.8h.01M9 6.8h.01" />
    </svg>
  );
}

export default function Home() {
  const videoRef = useRef(null);
  const kingRef = useRef(null);
  const imgRef = useRef(null);

  // Destaque do link da barra conforme a seção na tela
  useEffect(() => {
    const links = Array.from(document.querySelectorAll('.links a'));
    const ids = ['topo', 'foco', 'sobre', 'projetos', 'contato'];
    const mapa = {
      topo: '#topo',
      foco: '#topo',
      sobre: '#sobre',
      projetos: '#projetos',
      contato: '#contato',
    };
    let raf = 0;

    const atualizar = () => {
      raf = 0;
      const linha = window.innerHeight * 0.4;
      let atual = 'topo';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= linha) atual = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        atual = 'contato';
      }
      const alvo = mapa[atual];
      links.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === alvo));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(atualizar);
    };

    atualizar();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Animação do rei
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const video = videoRef.current;
    const king = kingRef.current;
    const img = imgRef.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const portrait = () => window.innerWidth < window.innerHeight;
    let started = false;

    // Posição do rei pequeno, no canto inferior DIREITO
    const corner = () => {
      const s = portrait() ? 0.6 : 0.34;
      const w = king.offsetWidth * s;
      const h = king.offsetHeight * s;
      return {
        x: window.innerWidth / 2 - w / 2 - (portrait() ? 10 : 32),
        y: window.innerHeight - 18 - h / 2 - window.innerHeight * 0.47,
        s,
      };
    };

    // Movimento do rei no scroll
    const ctx = gsap.context(() => {
      if (reduce) {
        king.style.position = 'absolute';
        return;
      }

      // 1) Hero -> canto inferior direito
      gsap.fromTo(
        king,
        { x: 0, y: 0, scale: 1 },
        {
          x: () => corner().x,
          y: () => corner().y,
          scale: () => corner().s,
          ease: 'none',
          scrollTrigger: {
            trigger: '#foco',
            start: 'top 95%',
            end: 'top 40%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );

      // 2) Canto -> lado direito, grande, no contato (no retrato fica no centro)
      gsap.fromTo(
        king,
        { x: () => corner().x, y: () => corner().y, scale: () => corner().s },
        {
          x: () => (portrait() ? 0 : window.innerWidth * 0.30),
          y: 0,
          scale: portrait() ? 1.35 : 1.05,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: '#contato',
            start: 'top 90%',
            end: 'top 15%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );

      // 3) Casa dourada embaixo do rei: aparece (fade, definido no CSS)
      //    assim que o rei começa a sair do hero e fica até o fim da página.
      //    Se a pessoa voltar pro topo, ela some de novo.
      ScrollTrigger.create({
        trigger: '#foco',
        start: 'top 95%',
        end: () => ScrollTrigger.maxScroll(window),
        onToggle: (self) => king.classList.toggle('saiu', self.isActive),
        onRefresh: (self) => king.classList.toggle('saiu', self.isActive),
      });
    });

    // Entrada do rei: logo depois que o nome aparece no vídeo
    const intro = () => {
      if (started) return;
      started = true;
      ctx.add(() => {
        gsap.fromTo(
          img,
          { opacity: 0, y: 36, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: reduce ? 0.01 : 1.1, ease: 'power2.out' }
        );
        if (!reduce) {
          gsap.to(img, {
            filter: 'drop-shadow(0 0 55px rgba(212,175,55,.6))',
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 1.1,
          });
        }
      });
    };

    const onTime = () => {
      if (video.currentTime > 1.0) intro();
    };
    video.muted = true;
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('ended', intro);
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
    const timer = setTimeout(intro, 2500);

    return () => {
      clearTimeout(timer);
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('ended', intro);
      ctx.revert();
      king.classList.remove('saiu');
    };
  }, []);

  return (
    <>
      <Efeitos />

      <nav className="nav" aria-label="Principal">
        <a className="brand" href="#topo">
          Maruã
        </a>
        <ul className="links">
          {MENU.map((m) => (
            <li key={m.href}>
              <a href={m.href}>{m.texto}</a>
            </li>
          ))}
        </ul>
        <a className="btn" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
          <span className="long">Chamar no </span>WhatsApp
        </a>
      </nav>

      <header className="hero" id="topo">
        <video
          ref={videoRef}
          src="/hero.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-label="Maruã"
        />
        <span className="cue" aria-hidden="true" />
      </header>

      <div className="king" ref={kingRef} aria-hidden="true">
        <span className="casa" />
        <img ref={imgRef} src="/rei.webp" alt="" width="800" height="1200" />
      </div>

      <main>
        <section className="s" id="foco">
          <Linhas d="0,38,42,100;0,64,22,100" />
          <div className="wrap">
            <div className="foco-intro">
              <p className="label">Meu foco</p>
              <Titulo>O que estou construindo</Titulo>
              <p className="lead">
                Estou no começo da carreira e aprendendo todo dia. Essas são as áreas em que
                estudo e pratico.
              </p>
              <a className="btn" href="#projetos">
                Ver meus projetos
              </a>
            </div>

            <div className="foco-grid" data-seq>
              {FOCO.map((f, i) => (
                <article
                  className={f.aparte ? 'foco-card aparte seq' : 'foco-card seq'}
                  style={{ '--i': i }}
                  key={f.titulo}
                >
                  <span className="ico">
                    <Icone nome={f.icone} />
                  </span>
                  <h3>{f.titulo}</h3>
                  <p>{f.texto}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="s" id="sobre">
          <Linhas d="100,0,62,100;100,26,80,100;70,0,100,58" />
          <div className="wrap">
            <Titulo>Sou o Maruã, tenho 20 anos e estou construindo minha carreira em social media.</Titulo>
            <p>
              Meu foco é ser um profissional que não pensa só em um vídeo legal, mas que leva o
              posicionamento certo de cada empresa para as redes e vai além das expectativas dos
              clientes.
            </p>
            <p className="side">Também trabalho com sites, como algo à parte.</p>
          </div>
        </section>

        <section className="s" id="projetos">
          <div className="wrap">
            <p className="label">Trabalhos</p>
            <Titulo>Projetos de estudo</Titulo>
            <p className="sub">O que já construí enquanto aprendo.</p>
            <div className="grid" data-seq>
              {PROJETOS.map((p, i) => (
                <a
                  className="tile seq"
                  style={{ '--i': i }}
                  key={p.titulo}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver projeto: ${p.titulo}`}
                >
                  <div className="media">
                    <img
                      className={p.modo === 'cover' ? 'cover' : 'logo'}
                      src={p.img}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div className="body">
                    <span className="tag">{p.tag}</span>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                    <span className="arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="s" id="contato">
          <Linhas d="0,40,18,100;0,70,10,100;100,38,82,100;100,68,90,100" />
          <Titulo>Vamos conversar?</Titulo>
          <div className="bottom">
            <a className="btn solid" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              Chamar no WhatsApp
            </a>
            <footer>© 2026 Maruã</footer>
          </div>
        </section>
      </main>
    </>
  );
}