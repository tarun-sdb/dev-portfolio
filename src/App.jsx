import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isMobile = () => window.innerWidth < 768

const go = (sel) => {
  if (window.__lenis) window.__lenis.scrollTo(sel, { duration: 1.4 })
  else document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' })
}

/* ------------------------------ data ------------------------------ */

const CHAPTERS = [
  {
    id: 'payu',
    num: '01',
    title: 'PAYU',
    meta: 'PayU Innovations · Bengaluru — Data Engineer Intern · Jan 2026–present',
    cmd: 'routing.aa_router --mvp --prod',
    lines: [
      { t: '> routing.aa_router --mvp --prod', c: 'cyan' },
      { t: '[✓] Account Aggregator Router — MVP, owned end-to-end', c: 'green' },
      { t: '[✓] smart decision-tree routing engine', c: 'green' },
      { t: '[✓] traffic balanced dynamically across multiple AAs', c: 'green' },
      { t: 'routing latency   ▸ −35%', c: 'cyan' },
      { t: 'P99 response     ▸ −95%', c: 'cyan' },
      { t: '  sync logging → async batch-sync on OpenSearch', c: 'dim' },
      { t: 'availability     ▸ 99.95%', c: 'cyan' },
      { t: '  EKS/ECS liveness+readiness probe tuning', c: 'dim' },
    ],
  },
  {
    id: 'codem',
    num: '02',
    title: 'CODEM',
    meta: 'codem.com · Bengaluru — Full Stack Dev Intern · Sep–Oct 2025',
    cmd: 'delivery.platform --cache=5m',
    lines: [
      { t: '> delivery.platform --cache=5m', c: 'cyan' },
      { t: '[✓] local food delivery platform — 10K weekly users', c: 'green' },
      { t: '[✓] caching layer @5-min intervals', c: 'green' },
      { t: '  killed full-table scans · db read load ▸ −40%', c: 'dim' },
      { t: '[✓] transactional cart validation', c: 'green' },
      { t: '  out-of-stock + closed restaurants fail gracefully', c: 'dim' },
      { t: '[✓] auto fallback recommenders by category', c: 'green' },
      { t: '  conversion + retention held through outages', c: 'dim' },
      { t: 'REST API rework (Node.js) · latency ▸ −25%', c: 'cyan' },
    ],
  },
  {
    id: 'projects',
    num: '03',
    title: 'KEY PROJECTS',
    meta: 'research + experiments · 2025',
    cmd: 'traffic.optimize --hybrid=PSO+GA',
    lines: [
      { t: '> traffic.optimize --hybrid=PSO+GA', c: 'cyan' },
      { t: '[✓] low-carbon urban routing', c: 'green' },
      { t: '  Bangalore · Mumbai real road networks', c: 'dim' },
      { t: '  CO2 emissions ▸ −47% vs shortest-path', c: 'cyan' },
      { t: '> tamil_htr --model=CRNN', c: 'cyan' },
      { t: '[✓] CNN + BiLSTM handwritten text recognition', c: 'green' },
      { t: '  CER ▸ 0.7% · WER ▸ 8.6%', c: 'cyan' },
    ],
  },
  {
    id: 'achieve',
    num: '04',
    title: 'ACHIEVEMENTS',
    meta: 'signal, not noise',
    cmd: 'achievements --list',
    lines: [
      { t: '> achievements --list', c: 'cyan' },
      { t: '[✓] RedBus hackathon — top 50 of thousands (RMSE 342.6)', c: 'green' },
      { t: '[✓] Microsoft Azure Administrator · AZ-104', c: 'green' },
      { t: '[✓] AWS Certified Cloud Practitioner', c: 'green' },
      { t: '[✓] Stanford Code in Place 2025', c: 'green' },
      { t: '[✓] test.io — 114 bugs reported · 40 accepted', c: 'green' },
    ],
  },
]

const WHOAMI = [
  { t: '> whoami', c: 'cyan' },
  { t: 'Data Platform Engineer @ PayU', c: 'plain' },
  { t: 'ex codem.com · test.io', c: 'dim' },
  { t: 'BTech CS @ VIT · GPA 7.86/10', c: 'dim' },
  { t: '> skills --list', c: 'cyan' },
  { t: 'Python · Django · SQL · React · Node', c: 'frost' },
  { t: 'AWS · ELK · Jenkins · RAG · MCP', c: 'frost' },
]

const CONTACT_LINES = [
  { t: '> contact --hire', c: 'cyan' },
  { t: 'tarunsridarshan.b@gmail.com', c: 'cyan', href: 'mailto:tarunsridarshan.b@gmail.com' },
  { t: 'github.com/tarun-sdb', c: 'cyan', href: 'https://github.com/tarun-sdb' },
  { t: 'linkedin.com/in/tarun-sri-darshan-balachandran', c: 'cyan', href: 'https://linkedin.com/in/tarun-sri-darshan-balachandran' },
  { t: '[✓] status: open — data / backend / infra roles', c: 'green' },
  { t: 'Bengaluru, India', c: 'dim' },
]

/* --------------------------- Terminal --------------------------- */

function Terminal({ ch, cmd, lines, mode = 'scrub', sectionRef }) {
  const wrapRef = useRef(null)
  const lineRefs = useRef([])
  const dotRefs = useRef([])

  useEffect(() => {
    const els = lineRefs.current
    const dots = dotRefs.current
    const n = els.length
    const setState = (idx) => {
      els.forEach((el, i) => {
        const done = i < idx
        el.classList.toggle('u', !done)
        el.classList.toggle('t-active', i === idx && idx < n)
      })
      dots.forEach((d, i) => d.classList.toggle('on', i < idx))
    }

    if (reduced() || mode === 'static') {
      els.forEach((el) => el.classList.remove('u'))
      return
    }

    if (mode === 'scrub' && sectionRef?.current && !isMobile()) {
      // GSAP pin on the whole section — terminal frozen center-screen once
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => '+=' + window.innerHeight,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        pinSpacing: true,
        onUpdate: (self) => {
          const idx = Math.floor(self.progress * (n + 1))
          setState(Math.min(idx, n))
        },
      })
      return () => st.kill()
    }

    // mobile or plain-scroll mode: play once on enter
    let idx = 0
    let raf
    const tick = () => {
      idx += 1
      setState(idx)
      if (idx < els.length) raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          raf = requestAnimationFrame(tick)
          io.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    io.observe(wrapRef.current)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [mode])

  return (
    <div ref={wrapRef} className="w-full max-w-6xl mx-auto">
      {ch && (
          <header className="font-mono text-[11px] md:text-xs tracking-[0.3em] uppercase text-zinc-600 mb-6 md:mb-8 flex items-center gap-3">
            <span className="text-neon">{ch.num}</span>
            <span className="text-zinc-300">{ch.title}</span>
            <span className="hidden sm:block h-px flex-1 bg-white/10" />
            <span className="normal-case tracking-normal text-zinc-500 hidden md:block">{ch.meta}</span>
          </header>
        )}
        <div className="flex items-start gap-5">
          <div className="flex-1 min-w-0">
            <div className="terminal-card rounded-[1.75rem] p-1.5 bg-white/[0.04] ring-1 ring-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
        <div className="rounded-[calc(1.75rem-0.375rem)] bg-[#0a0a0a] ring-1 ring-white/5 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3f3f46]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3f3f46]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#3f3f46]" />
            <span className="ml-3 font-mono text-[10px] tracking-widest text-zinc-600 truncate">
              tarun-sdb — {cmd}
            </span>
          </div>
          <div className="terminal-scroll px-5 py-5 md:px-8 md:py-7 font-mono text-[12px] md:text-[15px] leading-[1.9] max-h-[58dvh] overflow-y-auto">
            {lines.map((l, i) => (
              <div key={i}>
                {l.href ? (
                  <a
                    ref={(el) => (lineRefs.current[i] = el)}
                    href={l.href}
                    target={l.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noreferrer"
                    className={`term-line u ${tCls(l.c)} block hover:underline`}
                  >
                    {l.t}
                  </a>
                ) : (
                  <div
                    ref={(el) => (lineRefs.current[i] = el)}
                    className={`term-line u ${tCls(l.c)} block`}
                  >
                    {l.t}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
      {/* per-line progress dots */}
      <div className="hidden md:flex flex-col items-center gap-2.5 pt-3">
        {lines.map((_, i) => (
          <span
            key={i}
            ref={(el) => (dotRefs.current[i] = el)}
            className="w-[3px] h-3 rounded-full bg-white/15 transition-colors duration-300"
          />
        ))}
      </div>
      </div>
    </div>
  )
}

const tCls = (c) =>
  c === 'green' ? 't-green' : c === 'cyan' ? 't-cyan' : c === 'frost' ? 't-frost' : c === 'dim' ? 't-dim' : 't-plain'

/* ------------------------------ page ------------------------------ */

function Hero() {
  return (
    <section className="relative z-10 min-h-[100dvh] flex flex-col justify-center px-5 md:px-10 max-w-6xl mx-auto">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-mono text-xs md:text-sm text-neon tracking-[0.25em] uppercase mb-6"
      >
        &gt; whoami --verbose
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(2.6rem,9vw,7.5rem)] text-white"
      >
        TARUN
        <br />
        <span className="text-neon">SRI DARSHAN</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-6 font-mono text-sm md:text-base text-zinc-500"
      >
        data platform engineer @ payu · python · playwright · jenkins · aws · elk
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-3 text-xl md:text-3xl text-zinc-200 max-w-xl leading-snug"
      >
        Latency is a feature. <span className="text-neon">I delete it.</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-10 flex flex-wrap items-center gap-4"
      >
        <button
          onClick={() => go('#payu')}
          className="group rounded-full bg-neon px-7 py-3.5 font-mono text-sm font-semibold text-ink transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:brightness-110 active:scale-[0.98]"
        >
          view work <span className="inline-block transition-transform duration-500 group-hover:translate-y-0.5">↓</span>
        </button>
        <button
          onClick={() => go('#contact')}
          className="rounded-full px-7 py-3.5 font-mono text-sm text-zinc-300 ring-1 ring-white/15 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-neon/60 hover:text-neon active:scale-[0.98]"
        >
          say hi
        </button>
      </motion.div>

      {/* telemetry strip — real numbers only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 ring-1 ring-white/10 rounded-2xl overflow-hidden"
      >
        {[
          ['P99 response', '−95%'],
          ['routing latency', '−35%'],
          ['availability', '99.95%'],
          ['weekly users', '10K+'],
        ].map(([k, v]) => (
          <div key={k} className="bg-ink/90 px-5 py-4">
            <p className="font-mono text-lg md:text-2xl text-neon">{v}</p>
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-600 mt-1">{k}</p>
          </div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="mt-8 font-mono text-[11px] text-zinc-600 animate-pulse text-center md:text-left"
      >
        [ scroll — the log opens ]
      </motion.p>
    </section>
  )
}

function Chapter({ ch }) {
  const sectionRef = useRef(null)
  return (
    <section
      ref={sectionRef}
      id={ch.id}
      className="relative z-10 h-dvh flex items-center justify-center px-5 md:px-10 bg-ink"
    >
      <Terminal ch={ch} cmd={ch.cmd} lines={ch.lines} mode="scrub" sectionRef={sectionRef} />
    </section>
  )
}

function About() {
  const chips = ['Python', 'Django', 'SQL', 'React', 'Node.js', 'Playwright', 'Jenkins', 'AWS', 'ELK', 'RAG', 'MCP', 'k6']
  return (
    <section id="about" className="relative z-10 min-h-screen py-28 px-5 md:px-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 md:gap-20 items-start">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon mb-6">about</p>
          <Terminal cmd="whoami" lines={WHOAMI} mode="once" />
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
            I make data systems that <span className="text-neon">survive peak</span>.
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-5">
            Data Platform Engineer at PayU, building the Account Aggregator Router MVP end-to-end. Before that I shipped a
            food-delivery platform serving 10,000+ weekly users, rewrote its REST layer for −25% latency, and caught
            114 bugs as a freelancer — 40 of them fixed by clients. The 30+ RPS load tests? I run them on my own code
            first.
          </p>
          <p className="text-zinc-400 leading-relaxed mb-8">
            I research what I build: hybrid PSO-GA metaheuristics for low-carbon routing, CRNNs for Tamil handwriting.
            RAG, MCP, and distributed infra are where I live now.
          </p>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <span
                key={c}
                className="font-mono text-[11px] md:text-xs text-zinc-400 ring-1 ring-white/10 rounded-full px-3 py-1.5 bg-white/[0.03]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="relative z-10 min-h-screen flex flex-col justify-center py-28 px-5 md:px-10">
      <div className="max-w-6xl mx-auto w-full">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-neon mb-6">contact</p>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-10">
          Let's run it <span className="text-neon">in production</span>.
        </h2>
        <Terminal cmd="contact --hire" lines={CONTACT_LINES} mode="static" />
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="mailto:tarunsridarshan.b@gmail.com"
            className="group rounded-full bg-neon px-8 py-4 font-mono text-sm font-semibold text-ink transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:brightness-110 active:scale-[0.98]"
          >
            start the conversation
            <span className="inline-block ml-2 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>
          <a
            href="https://github.com/tarun-sdb"
            target="_blank"
            rel="noreferrer"
            className="rounded-full px-8 py-4 font-mono text-sm text-zinc-300 ring-1 ring-white/15 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-neon/60 hover:text-neon active:scale-[0.98]"
          >
            github ↗
          </a>
        </div>
      </div>
    </section>
  )
}

function Nav() {
  return (
    <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <div className="flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md ring-1 ring-white/10 p-1.5 font-mono text-xs">
        <span className="px-3 text-neon">tarun-sdb</span>
        <span className="h-4 w-px bg-white/10" />
        {[
          ['work', '#payu'],
          ['about', '#about'],
          ['contact', '#contact'],
        ].map(([label, sel]) => (
          <button
            key={sel}
            onClick={() => go(sel)}
            className="px-3 py-1.5 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            {label}
          </button>
        ))}
        <a
          href="https://github.com/tarun-sdb"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-full text-zinc-400 hover:text-white transition-colors"
          aria-label="GitHub"
        >
          gh↗
        </a>
      </div>
    </nav>
  )
}

function Dots() {
  return (
    <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
      {CHAPTERS.map((ch) => (
        <button
          key={ch.id}
          onClick={() => go(`#${ch.id}`)}
          className="group flex items-center gap-2"
          aria-label={ch.title}
        >
          <span className="font-mono text-[10px] text-zinc-600 group-hover:text-neon transition-colors">{ch.num}</span>
          <span className="w-2 h-2 rounded-full ring-1 ring-white/20 group-hover:bg-neon group-hover:ring-neon bg-transparent transition-all" />
        </button>
      ))}
    </div>
  )
}

export default function App() {
  useEffect(() => {
    if (reduced()) return

    const lenis = new Lenis({ lerp: 0.08 })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const bar = document.querySelector('.scroll-progress')
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress})`
      },
    })
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  return (
    <div className="relative">
      {/* ambient */}
      <div className="grid-lines" />
      <div className="grain" />
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="glow-orb absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-neon/10 blur-[120px]" />
        <div
          className="glow-orb absolute top-1/3 -right-52 w-[34rem] h-[34rem] rounded-full bg-frost/10 blur-[120px]"
          style={{ animationDelay: '-5s' }}
        />
      </div>
      <div className="scroll-progress fixed top-0 left-0 right-0 h-[2px] bg-neon z-50" />

      <Nav />
      <Dots />
      <main className="relative z-10">
        <Hero />
        {CHAPTERS.map((ch) => (
          <Chapter key={ch.id} ch={ch} />
        ))}
        <About />
        <Contact />
      </main>
      <footer className="relative z-10 py-10 text-center font-mono text-[11px] text-zinc-600 border-t border-white/5">
        © 2026 tarun-sdb · GSAP + Lenis + React · all numbers above are real, from the log.
      </footer>
    </div>
  )
}