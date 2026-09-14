'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Lenis from 'lenis'
import BottomBlur from '../components/BottomBlur'
import LoreBody from '../components/LoreBody'
import useMousePosition from '../utils/useMousePosition'
import loreStyles from '../components/LoreModal.module.scss'
import styles from './page.module.scss'

const ease = [0.25, 0.46, 0.45, 0.94]

function HoverFill({ href, children, className, onClick }) {
  const inner = (
    <span className={styles.swap}>
      <span className={styles.hoverTop}>{children}</span>
      <span className={styles.hoverBottom}>{children}</span>
    </span>
  )
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
  const [showPage, setShowPage] = useState(false)
  const { x, y } = useMousePosition()
  const [onNavLink, setOnNavLink] = useState(false)
  const cursorSize = onNavLink ? 26 : 40

  useEffect(() => {
    if (window.matchMedia('(min-width: 701px)').matches) {
      router.replace('/?skipLoading=true&lore=1')
      return
    }
    setShowPage(true)
  }, [router])

  useEffect(() => {
    if (!showPage) return
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFinePointer(mq.matches)
    sync()
    mq.addEventListener('change', sync)
  }, [showPage])

  useEffect(() => {
    if (x == null || y == null) {
      setOnNavLink(false)
      return
    }
    const el = document.elementFromPoint(x - window.scrollX, y - window.scrollY)
    setOnNavLink(Boolean(el?.closest('[data-cursor="link"]')))
  }, [x, y])

  useEffect(() => {
    if (!showPage) return
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
  }, [showPage])

  if (!showPage) return null

  const goHome = (href = '/?skipLoading=true') => {
    setLeaving(true)
    window.setTimeout(() => router.push(href), 520)
  }

  return (
    <motion.main
      className={`${styles.page} ${loreStyles.asPage} ${finePointer ? styles.hideNativeCursor : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.52, ease }}
    >
      {finePointer && x != null && y != null && (
        <motion.div
          className={styles.pageCursor}
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

      <div className={loreStyles.col}>
        <div className={styles.clip} style={{ paddingTop: 28 }}>
          <HoverFill
            href="/?skipLoading=true"
            className={styles.backLink}
            onClick={(e) => { e.preventDefault(); goHome() }}
          >
            ‹ Back to Projects
          </HoverFill>
        </div>
        <LoreBody titleId="lore-page-title" />
      </div>
      <BottomBlur />
    </motion.main>
  )
}
