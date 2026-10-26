'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Titulo, Linhas, Efeitos } from './efeitos';
import { Interativo, CenaProjetos } from './interativo';
import './efeitos.css';
import './interativo.css';

const WHATSAPP =
  'https://wa.me/5511912883525?text=Ol%C3%A1%20Maru%C3%A3%2C%20vi%20seu%20portf%C3%B3lio!';

const MENU = [
  { href: '#topo', texto: 'Início' },
  { href: '#sobre', texto: 'Sobre' },
  { href: '#projetos', texto: 'Projetos' },
  { href: '#contato', texto: 'Contato' },
];

// Textos da faixa que rola (troque pelos seus, se tiver outros)
const FAIXA = [
  'Estratégia',
  'Posicionamento',
  'Constância',
  'Criatividade',
  'Identidade',
  'Distribuição',
];

const FOCO = [
  {
    icone: 'site',
    titulo: 'Sistemas com IA',
    texto: 'Eu decido o problema, o que entra e o que fica de fora. A IA ajuda a construir.',
  },
  {
    icone: 'social',
    titulo: 'Social media',
    texto: 'Estudo estratégia de perfil: o que postar, em qual formato, quantas vezes e em quais dias. Meu objetivo é entrar na área.',
  },
  {
    icone: 'alvo',
    titulo: 'Ferramentas próprias',
    texto: 'Quando a ferramenta não existe do jeito que preciso, eu crio uma. Foi assim que nasceram o MT e o Routine.',
  },
];

const PROJETOS = [
  {
    tag: 'Próprio · beta · feito com IA',
    titulo: 'MT',
    texto: 'A ferramenta que estou criando pra jogar esse jogo. Sistema de gestão para agências de social media: clientes, calendário editorial, funil de produção, financeiro e equipes. Em beta, com APIs a caminho.',
    url: 'https://mth-sooty.vercel.app/login',
    img: '/projetos/mt.png',
    modo: 'logo',
  },
  {
    tag: 'Próprio · feito com IA',
    titulo: 'Routine',
    texto: 'Criei porque precisava organizar minha rotina e queria algo meu, sem depender do Notion. Junta espiritual, financeiro, hábitos e obrigações do dia num só lugar.',
    url: 'https://routine-app-seven-alpha.vercel.app/',
    img: '/projetos/routine.png',
    modo: 'logo',
  },
  {
    tag: 'Estudo de layout',
    titulo: 'Linha Imóveis',
    texto: 'Landing page fictícia de uma imobiliária, feita pra testar um site mais estruturado e bonito, num nicho fora da minha área.',
    url: 'https://indexhtml-flax-mu.vercel.app/',
    img: '/projetos/linha.webp',
    modo: 'cover',
  },
];

// Sequência das peças (o último passo é o rei fixo do site)
// glifo = desenho provisório, aparece enquanto a imagem da pasta public/pecas não existir
const PECAS = [
  {
    nome: 'Peão',
    glifo: '\u265F\uFE0E',
    img: '/pecas/peao.webp',
    sw: 48,
    titulo: 'Um passo por vez',
    frase: 'Constância: uma marca se constrói postando todo dia, uma casa de cada vez.',
  },
  {
    nome: 'Bispo',
    glifo: '\u265D\uFE0E',
    img: '/pecas/bispo.webp',
    sw: 52,
    titulo: 'O ângulo certo',
    frase: 'Posicionamento: olhar a marca por um ângulo que ninguém olhou.',
  },
  {
    nome: 'Cavalo',
    glifo: '\u265E\uFE0E',
    img: '/pecas/cavalo.webp',
    sw: 50,
    titulo: 'O lance inesperado',
    frase: 'Criatividade: a ideia fora do óbvio que salta a concorrência e chama atenção.',
  },
  {
    nome: 'Torre',
    glifo: '\u265C\uFE0E',
    img: '/pecas/torre.webp',
    sw: 54,
    titulo: 'Base sólida',
    frase: 'Identidade e linha editorial: a estrutura que sustenta o perfil.',
  },
  {
    nome: 'Rainha',
    glifo: '\u265B\uFE0E',
    img: '/pecas/rainha.webp',
    sw: 60,
    titulo: 'Alcance total',
    frase: 'Distribuição: estar onde o público está.',
  },
  {
    nome: 'Rei',
    rei: true,
    sw: 55,
    titulo: 'A marca em jogo',
    frase: 'A estratégia inteira existe para proteger a marca e fazê-la vencer.',
  },
];

// Título do Sobre: versão neutra (a versão dourada aparece dentro da lente)
const FRASE_SOBRE = [
  ['Social media é decidir o que a marca diz,', false],
  ['para quem e em qual momento.', true],
];

const FRASE_CONTATO = [
  ['Vamos', false],
  ['conversar?', true],
];

// Ícones simples dos cards de foco
function Icone({ nome }) {
  const props = {
    viewBox: '0 0 24 24',
    width: 24,
    height: 24,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  };
  if (nome === 'site') {
    return (
      <svg {...props}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 14l-2 2 2 2M16 14l2 2-2 2" />
      </svg>
    );
  }
  if (nome === 'social') {
    return (
      <svg {...props}>
        <path d="M4 5h16v11H9l-5 4z" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.8" />
    </svg>
  );
}

function Frase({ partes, classe }) {
  const palavras = [];
  partes.forEach(([texto, it]) => {
    texto.split(' ').forEach((w) => palavras.push({ w, it }));
  });
  const completo = partes.map((p) => p[0]).join(' ');
  return (
    <h2 className={classe ? `rv ${classe}` : 'rv'} aria-label={completo}>
      {palavras.map((p, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span className={p.it ? 'it' : undefined} style={{ '--i': i }}>
              {p.w}
            </span>
          </span>
          {i < palavras.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </h2>
  );
}

function ListaProjetos() {
  const [ativo, setAtivo] = useState(0);
  const prevRef = useRef(null);
  const mover = useRef({});

  useEffect(() => {
    const el = prevRef.current;
    if (!el) return;
    mover.current.x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    mover.current.y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
  }, []);

  const seguir = (e) => {
    if (mover.current.x) mover.current.x(e.clientX + 32);
    if (mover.current.y) mover.current.y(e.clientY - 110);
  };
  const entrar = (i) => {
    setAtivo(i);
    prevRef.current.classList.add('on');
  };
  const sair = () => prevRef.current.classList.remove('on');

  return (
    <div className="lista" data-seq onMouseMove={seguir} onMouseLeave={sair}>
      {PROJETOS.map((p, i) => (
        <a
          className="linha-proj seq"
          style={{ '--i': i }}
          key={p.titulo}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Ver projeto: ${p.titulo}`}
          onMouseEnter={() => entrar(i)}
        >
          <span className="num">{`0${i + 1}`}</span>
          <span className="corpo">
            <h3>{p.titulo}</h3>
            <p>{p.texto}</p>
          </span>
          <span className="tag">{p.tag}</span>
          <span className="arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>
      ))}
      <div className="prev" ref={prevRef} aria-hidden="true">
        {PROJETOS.map((p, i) => (
          <img
            key={p.titulo}
            className={`${p.modo === 'cover' ? 'cover' : 'logo'}${i === ativo ? ' on' : ''}`}
            src={p.img}
            alt=""
          />
        ))}
      </div>
    </div>
  );
}

// Sequência das peças: só o desenho da tela. Quem troca os passos é o useEffect do Home.
function Sequencia() {
  return (
    <section
      className="pecas"
      id="pecas"
      style={{ '--n': PECAS.length }}
      aria-label="Cada peça do xadrez, uma ideia de social media"
    >
      <div className="pecas-palco">
        <div className="peca-box chao-box" aria-hidden="true">
          <span className="chao">
            <span className="piscina" />
            <span className="sombra" />
          </span>
        </div>
        {PECAS.map((p, i) => (
          <article className="passo" data-i={i} key={p.nome}>
            <div className="peca-box">
              {p.rei ? (
                <>
                  <div className="peca peca-rei">
                    <span className="refl" aria-hidden="true">
                      <span className="peca-giro">
                        <img className="refl-img" src="/rei.webp" alt="" width="800" height="1200" />
                      </span>
                    </span>
                  </div>
                  <img
                    className="peca-rei-fixo"
                    src="/rei.webp"
                    alt=""
                    width="800"
                    height="1200"
                    loading="lazy"
                  />
                </>
              ) : (
                <div className="peca">
                  <span className="refl" aria-hidden="true">
                    <span className="peca-giro">
                      <img className="refl-img" src={p.img} alt="" width="800" height="1200" />
                    </span>
                  </span>
                  <span className="peca-giro">
                    <span className="peca-glifo" aria-hidden="true">
                      {p.glifo}
                    </span>
                    <img className="peca-img" src={p.img} alt="" width="800" height="1200" />
                    <span
                      className="peca-brilho"
                      style={{ '--mask': `url(${p.img})` }}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              )}
            </div>
            <div className="peca-texto">
              <p className="label">{`0${i + 1} · ${p.nome}`}</p>
              <h2>{p.titulo}</h2>
              <p className="frase">{p.frase}</p>
            </div>
          </article>
        ))}
        <ol className="pecas-indice" aria-hidden="true">
          {PECAS.map((p, i) => (
            <li key={p.nome} className={i === 0 ? 'on' : undefined}>
              <b>{`0${i + 1}`}</b> {p.nome}
            </li>
          ))}
        </ol>
        <p className="pecas-dica" aria-hidden="true">
          Role para continuar
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  const kingRef = useRef(null);
  const imgRef = useRef(null);

  // Destaque do link da barra conforme a seção na tela
  useEffect(() => {
    const links = Array.from(document.querySelectorAll('.links a'));
    const ids = ['topo', 'sobre', 'foco', 'projetos', 'contato'];
    const mapa = {
      topo: '#topo',
      sobre: '#sobre',
      foco: '#sobre',
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

  // Sequência das peças + animação do rei
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const king = kingRef.current;
    const img = imgRef.current;
    const pecas = document.getElementById('pecas');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const portrait = () => window.innerWidth < window.innerHeight;

    // Imagens das peças: se o arquivo existir, ele substitui o desenho provisório
    const limparImgs = [];
    const imgsPecas = pecas ? Array.from(pecas.querySelectorAll('.peca-img')) : [];
    imgsPecas.forEach((el) => {
      const pronta = () => {
        const alvo = el.closest('.peca');
        if (alvo) alvo.classList.add('tem-img');
      };
      if (el.complete && el.naturalWidth > 0) {
        pronta();
      } else {
        el.addEventListener('load', pronta);
        limparImgs.push(() => el.removeEventListener('load', pronta));
      }
    });

    // Pausa as animações da sequência quando ela está fora da tela
    let io = null;
    if (pecas && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        ([e]) => pecas.classList.toggle('visivel', e.isIntersecting),
        { rootMargin: '100px' }
      );
      io.observe(pecas);
    }

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

    // ----- Sequência: o giro acompanha o scroll -----
    const passos = pecas ? Array.from(pecas.querySelectorAll('.passo')) : [];
    const pontos = pecas ? Array.from(pecas.querySelectorAll('.pecas-indice li')) : [];
    const N = passos.length;
    const SW = PECAS.map((p) => p.sw);

    // HOLD = quanto tempo a peça fica parada de frente (0 a 0.5). Maior = fica mais tempo parada.
    const HOLD = 0.18;
    const suave = (k) => {
      const c = Math.min(1, Math.max(0, k));
      return c * c * (3 - 2 * c);
    };
    const angulo = (d) => {
      const a = Math.abs(d);
      if (a <= HOLD) return 0;
      return Math.sign(d) * 90 * suave((a - HOLD) / (0.5 - HOLD));
    };

    // O rei fixo só aparece no último passo
    let reiVisivel = false;
    let brilho = null;
    const mostrarRei = (sim) => {
      if (sim === reiVisivel) return;
      reiVisivel = sim;
      king.classList.toggle('rei-vis', sim);
      gsap.set(img, { opacity: sim ? 1 : 0, y: 0, scale: 1 });
      if (sim && !brilho) {
        brilho = gsap.to(img, {
          filter: 'drop-shadow(0 0 55px rgba(212,175,55,.6))',
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
      if (brilho) brilho.paused(!sim);
    };

    const proxy = { pos: 0 };
    const desenhar = () => {
      const pos = proxy.pos;
      for (let i = 0; i < N; i++) {
        const d = pos - i;
        const ad = Math.abs(d);
        const ang = angulo(d);
        const el = passos[i];
        // luz que atravessa a peça: aparece enquanto ela gira
        const dc = Math.max(-0.5, Math.min(0.5, d));
        const bo = suave((ad - 0.05) / 0.25) * (1 - suave((ad - 0.38) / 0.12));

        el.style.setProperty('--ang', `${ang.toFixed(2)}deg`);
        el.style.setProperty('--sc', (1 - (0.1 * Math.abs(ang)) / 90).toFixed(3));
        el.style.setProperty('--vis', ad < 0.5 ? '1' : '0');
        el.style.setProperty('--o', (1 - suave((ad - 0.18) / 0.2)).toFixed(3));
        el.style.setProperty('--ty', `${(-dc * 90).toFixed(1)}px`);
        el.style.setProperty('--br', (50 - 100 * dc).toFixed(1));
        el.style.setProperty('--bo', bo.toFixed(3));

        if (i === N - 1) {
          king.style.setProperty('--reiy', `${ang.toFixed(2)}deg`);
          king.style.setProperty('--br', (50 - 100 * dc).toFixed(1));
          king.style.setProperty('--bo', bo.toFixed(3));
          mostrarRei(pos > N - 1.5);
        }
      }
      // sombra no chão: a largura vai de uma peça para a outra sem pular
      const a = Math.min(N - 1, Math.max(0, Math.floor(pos)));
      const b = Math.min(N - 1, a + 1);
      const sw = SW[a] + (SW[b] - SW[a]) * suave(pos - a);
      pecas.style.setProperty('--sw', `${sw.toFixed(1)}%`);

      const perto = Math.round(pos);
      pontos.forEach((li, i) => li.classList.toggle('on', i === perto));
    };

    // progresso do scroll (0 a 1) -> posição na sequência (0 a N-1); os últimos 8% seguram o rei parado
    const irPara = (progress, imediato) => {
      const pos = Math.min(N - 1, (progress * (N - 1)) / 0.92);
      if (imediato) {
        gsap.killTweensOf(proxy);
        proxy.pos = pos;
        desenhar();
      } else {
        gsap.to(proxy, { pos, duration: 0.35, ease: 'power3.out', overwrite: true, onUpdate: desenhar });
      }
    };

    // ----- Inclinação com o mouse (só computador) -----
    const mouse = { x: 0, y: 0 };
    const aplicarMouse = () => {
      const sx = mouse.x.toFixed(3);
      const sy = mouse.y.toFixed(3);
      pecas.style.setProperty('--mx', sx);
      pecas.style.setProperty('--my', sy);
      king.style.setProperty('--mx', sx);
    };
    const moverMouse = (e) => {
      if (!pecas.classList.contains('visivel')) return;
      gsap.to(mouse, {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
        duration: 0.7,
        ease: 'power3.out',
        overwrite: true,
        onUpdate: aplicarMouse,
      });
    };
    const foraMouse = () =>
      gsap.to(mouse, { x: 0, y: 0, duration: 0.9, ease: 'power3.out', overwrite: true, onUpdate: aplicarMouse });
    if (pecas && fino && !reduce) {
      window.addEventListener('pointermove', moverMouse, { passive: true });
      document.addEventListener('pointerleave', foraMouse);
    }

    // Movimento do rei no scroll
    const ctx = gsap.context(() => {
      // Movimento reduzido: o CSS esconde o rei fixo e a lista mostra o rei
      if (reduce) return;

      // O rei começa escondido (entra girando no último passo da sequência)
      gsap.set(img, { opacity: 0, y: 0, scale: 1 });
      king.classList.add('seq-on');

      // Sequência: o scroll gira e troca a peça
      if (pecas && N) {
        desenhar();
        ScrollTrigger.create({
          trigger: pecas,
          start: 'top top',
          end: 'bottom bottom',
          invalidateOnRefresh: true,
          onUpdate: (self) => irPara(self.progress, false),
          onRefresh: (self) => irPara(self.progress, true),
          onLeave: () => irPara(1, false),
          onLeaveBack: () => irPara(0, false),
        });

        // Quando o rei começa a sair pro canto, a sombra e o reflexo do chão somem
        gsap.fromTo(
          pecas,
          { '--rf': 1 },
          {
            '--rf': 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '#foco',
              start: 'top 100%',
              end: 'top 86%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // 1) Sequência -> canto inferior direito (mesmos números de antes, gatilho: #foco)
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

      // 1b) Inclinação: o rei começa inclinado pra direita e se endireita no caminho do canto
      gsap.fromTo(
        king,
        { '--pecagiro': () => (portrait() ? '8deg' : '16deg'), '--pf': 1 },
        {
          '--pecagiro': '0deg',
          '--pf': 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '#foco',
            start: 'top 95%',
            end: 'top 40%',
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => king.classList.toggle('seq-on', self.progress < 1),
            onRefresh: (self) => king.classList.toggle('seq-on', self.progress < 1),
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

      // 3) Casa dourada embaixo do rei: aparece quando o rei começa a sair da sequência
      ScrollTrigger.create({
        trigger: '#foco',
        start: 'top 95%',
        end: () => ScrollTrigger.maxScroll(window),
        onToggle: (self) => king.classList.toggle('saiu', self.isActive),
        onRefresh: (self) => king.classList.toggle('saiu', self.isActive),
      });
    });

    return () => {
      if (io) io.disconnect();
      limparImgs.forEach((f) => f());
      window.removeEventListener('pointermove', moverMouse);
      document.removeEventListener('pointerleave', foraMouse);
      gsap.killTweensOf(mouse);
      ctx.revert();
      gsap.killTweensOf(proxy);
      gsap.killTweensOf(img);
      if (brilho) brilho.kill();
      gsap.set(img, { clearProps: 'opacity,transform,filter' });
      passos.forEach((el) =>
        ['--ang', '--sc', '--vis', '--o', '--ty', '--br', '--bo'].forEach((k) =>
          el.style.removeProperty(k)
        )
      );
      if (pecas) ['--mx', '--my', '--sw', '--rf'].forEach((k) => pecas.style.removeProperty(k));
      king.classList.remove('saiu', 'seq-on', 'rei-vis');
      ['--pecagiro', '--pf', '--reiy', '--br', '--bo', '--mx'].forEach((k) =>
        king.style.removeProperty(k)
      );
    };
  }, []);

  return (
    <>
      <Efeitos />
      <Interativo />

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

      <div className="king" ref={kingRef} aria-hidden="true">
        <span className="casa" />
        <span className="rei-giro">
          <img ref={imgRef} src="/rei.webp" alt="" width="800" height="1200" />
          <span className="rei-brilho" />
        </span>
        <span className="rei-ouro">
          <span className="rei-giro">
            <img src="/rei.webp" alt="" width="800" height="1200" />
          </span>
        </span>
      </div>

      <main id="topo">
        <section className="s" id="sobre">
          <Linhas d="100,0,62,100;100,26,80,100;70,0,100,58" />
          <div className="wrap">
            <div className="sobre-textos" data-seq>
              <p className="seq fade" style={{ '--i': 0 }}>
                Sou o Maruã, tenho 20 anos e quero construir minha carreira em social media, com
                foco na parte estratégica do perfil: o que postar, em qual formato, quantas vezes e
                em quais dias. Gosto de xadrez porque tudo tem um porquê, e vejo o mesmo aqui: cada
                post, vídeo, card ou story tem uma estratégia por trás.
              </p>
              <p className="side seq fade" style={{ '--i': 1 }}>
                Ainda estou estudando a área. No caminho, crio sistemas com IA, decidindo cada passo.
              </p>
            </div>
            <div className="lente">
              <div className="lente-pilha">
                <Frase partes={FRASE_SOBRE} classe="lente-base" />
                <div className="lente-ouro" aria-hidden="true">
                  <h2>
                    Social media é um jogo de posicionamento e estratégia,{' '}
                    <span className="it">ganha quem conhece e entende melhor as jogadas do seu publico e dos seus oponentes.</span>
                  </h2>
                </div>
              </div>
              <span className="lente-moldura" aria-hidden="true" />
            </div>
            <p className="dica">Passe o quadrado sobre o texto</p>
          </div>
        </section>

        <Sequencia />

        <section className="s" id="foco">
          <Linhas d="0,38,42,100;0,64,22,100" />
          <div className="wrap">
            <div className="foco-intro">
              <p className="ponte">Antes de postar, eu penso a jogada.</p>
              <p className="label">Meu foco</p>
              <Titulo>O que estou construindo</Titulo>
              <p className="lead">
                Quero entrar em social media e estudo a parte estratégica todo dia. Enquanto
                isso, crio sistemas com IA pra resolver problemas reais.
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

        <div className="faixa" aria-hidden="true">
          <div className="trilho">
            {[0, 1].map((k) => (
              <div className="metade" key={k}>
                {[...FAIXA, ...FAIXA, ...FAIXA].map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="s" id="projetos">
          <div className="wrap">
            <p className="label">Trabalhos</p>
            <Titulo>Jogadas que já fiz</Titulo>
            <p className="sub">Sistemas que criei com IA pra resolver problemas reais.</p>
            <CenaProjetos projetos={PROJETOS} />
          </div>
        </section>

        <section className="s" id="contato">
          <Linhas d="0,40,18,100;0,70,10,100;100,38,82,100;100,68,90,100" />
          <div className="contato-topo">
            <p className="status">
              <i aria-hidden="true" /> Aberto a conversas
            </p>
            <Frase partes={FRASE_CONTATO} />
          </div>
          <div className="bottom">
            <p className="contato-sub">Quer trocar ideia sobre social media ou sobre um projeto? Me chama.</p>
            <a className="btn solid" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              Chamar no WhatsApp <span aria-hidden="true">→</span>
            </a>
            <p className="lance">Fim de partida, começo de conversa.</p>
            <footer>© 2026 Maruã</footer>
          </div>
        </section>
      </main>
    </>
  );
}