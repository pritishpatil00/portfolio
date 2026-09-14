'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Lenis from 'lenis'
import BottomBlur from '../components/BottomBlur'
import useMousePosition from '../utils/useMousePosition'
import { LORE_CHAPTERS } from './content'
import styles from './page.module.scss'

const ease = [0.25, 0.46, 0.45, 0.94]
const rise = {
  hidden: { y: 20 },
  show: { y: 0, transition: { duration: 0.75, ease } },
}

function HoverFill({ href, children, className, external, onClick }) {
  const inner = (
    <span className={styles.swap}>
      <span className={styles.hoverTop}>{children}</span>
      <span className={styles.hoverBottom}>{children}</span>
    </span>
  )
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} onClick={onClick}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {inner}
    </Link>
  )
}

export default function LorePreview() {
  const router = useRouter()
  const [leaving, setLeaving] = useState(false)
  const [finePointer, setFinePointer] = useState(false)
  const { x, y } = useMousePosition()
  const [onNavLink, setOnNavLink] = useState(false)
  const cursorSize = onNavLink ? 26 : 40

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFinePointer(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (x == null || y == null) {
      setOnNavLink(false)
      return
    }
    const el = document.elementFromPoint(x - window.scrollX, y - window.scrollY)
    setOnNavLink(Boolean(el?.closest('[data-cursor="link"]')))
  }, [x, y])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    let alive = true
    let raf = 0
    let lenis = null

    const loop = (t) => {
      if (!alive || !lenis) return
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(() => {
      if (!alive) return
      lenis = new Lenis()
      raf = requestAnimationFrame(loop)
    })

    const fadeOut = () => setLeaving(true)
    window.addEventListener('popstate', fadeOut)
    window.addEventListener('pagehide', fadeOut)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      try { lenis?.destroy() } catch {}
      window.removeEventListener('popstate', fadeOut)
      window.removeEventListener('pagehide', fadeOut)
    }
  }, [])

  const goHome = (href = '/?skipLoading=true') => {
    setLeaving(true)
    window.setTimeout(() => router.push(href), 520)
  }

  return (
    <motion.main
      className={`${styles.page} ${finePointer ? styles.hideNativeCursor : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.52, ease }}
    >
      {finePointer && x != null && y != null && (
        <motion.div
          className={`${styles.pageCursor} ${onNavLink ? styles.pageCursorLink : ''}`}
          animate={{
            x: x - window.scrollX - cursorSize / 2,
            y: y - window.scrollY - cursorSize / 2,
            width: cursorSize,
            height: cursorSize,
          }}
          transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
        >
          <span className={styles.pageCursorDot} aria-hidden="true" />
        </motion.div>
      )}
      <header className={styles.stickyHeader}>
        <div className={styles.headerName}>
          <Link href="/" data-cursor="link" onClick={(e) => { e.preventDefault(); goHome('/?skipLoading=true') }}><p>PRITISH PATIL</p></Link>
        </div>
        <nav className={styles.headerNav}>
          <p data-cursor="link" onClick={() => goHome('/?skipLoading=true')}>WORK</p>
          <Link href="/?skipLoading=true#sandbox" data-cursor="link"><p>SANDBOX</p></Link>
          <Link href="/?skipLoading=true#about" data-cursor="link"><p>ABOUT</p></Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.clip}>
          <motion.div initial="hidden" animate="show">
            <HoverFill
              href="/?skipLoading=true"
              className={styles.backLink}
              onClick={(e) => { e.preventDefault(); goHome() }}
            >
              ‹ Back to Projects
            </HoverFill>
          </motion.div>
        </div>
        <p className={styles.kicker}>Preview · Present</p>
        <div className={styles.clip}>
          <motion.h1 variants={rise} initial="hidden" animate="show">
            Lore Health<span>.</span>
          </motion.h1>
        </div>
        <div className={styles.clip}>
          <motion.p className={styles.heroLead} variants={rise} initial="hidden" animate="show" transition={{ delay: 0.06, duration: 0.75, ease }}>
            An AI-powered health platform helping users manage psychological and physical stressors.
          </motion.p>
        </div>
        <div className={styles.clip}>
          <motion.p className={styles.heroSub} variants={rise} initial="hidden" animate="show" transition={{ delay: 0.12, duration: 0.75, ease }}>
            Design engineer. Four focus areas from work in progress. A full case study will follow.
          </motion.p>
        </div>
      </section>

      <div className={styles.heroMedia}>
        <div className={styles.heroFrame}>
          <Image
            src="/images/LoreHealthMockup.png"
            alt="Lore Health on iPhone"
            width={3200}
            height={2400}
            className={styles.heroImg}
            priority
            sizes="100vw"
            quality={80}
          />
        </div>
      </div>

      <section className={styles.intro}>
        <h6>The work</h6>
        <h2>What I owned, without the full writeup<span>.</span></h2>
        <p>
          This is a preview of the problems, the surfaces, and the system. Not the research archive.
        </p>
      </section>

      <section className={styles.chapters}>
        {LORE_CHAPTERS.map((item) => (
          <article key={item.n} className={styles.chapter}>
            <p className={styles.chapterNum}>{item.n}</p>
            <div className={styles.chapterBody}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.more}>
        <h2>Other projects<span>.</span></h2>
        <div className={styles.moreGrid}>
          <Link href="/allathlete" className={styles.moreItem}>
            <div className={styles.moreImg}>
              <Image src="/images/AllAthleteMockup.jpg" alt="AllAthlete" width={1200} height={800} sizes="(max-width: 700px) 100vw, 50vw" />
              <span className={styles.moreCircle} />
            </div>
            <h3>Redesigning AllAthlete as the destination for recruiting.</h3>
            <p>Product designer at AllAthlete.</p>
          </Link>
          <Link href="/poppin" className={styles.moreItem}>
            <div className={styles.moreImg}>
              <Image src="/images/PoppinMockupTwo.jpg" alt="Poppin" width={1200} height={800} sizes="(max-width: 700px) 100vw, 50vw" />
              <span className={styles.moreCircle} />
            </div>
            <h3>Building a socially proofed ticketing network for live events.</h3>
            <p>Product lead at Poppin.</p>
          </Link>
        </div>
      </section>

      <footer className={styles.pageFooter}>
        <HoverFill href="https://www.linkedin.com/in/pritish-patil/" className={styles.footerTouch} external>
          Let’s get in touch
        </HoverFill>
        <div className={styles.footerLinks}>
          <a href="https://www.linkedin.com/in/pritish-patil/" target="_blank" rel="noreferrer">LinkedIn</a>
          <Link href="/?skipLoading=true" onClick={(e) => { e.preventDefault(); goHome() }}>Work</Link>
        </div>
      </footer>
      <BottomBlur />
    </motion.main>
  )
}
