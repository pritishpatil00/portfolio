'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LORE_CHAPTERS } from '../lore/content'
import useMousePosition from '../utils/useMousePosition'
import styles from './LoreModal.module.scss'

const ease = [0.25, 0.46, 0.45, 0.94]

const META = [
  { label: 'Year', value: '2025 to Present' },
  { label: 'Role', value: 'Design Engineer' },
  { label: 'Org', value: 'Lore Health' },
  { label: 'Status', value: 'Ongoing' },
]

const MORE = [
  {
    href: '/allathlete',
    src: '/images/AllAthleteMockup.jpg',
    title: 'AllAthlete',
    year: '2022',
    blurb: 'Redesigning AllAthlete as the destination for recruiting.',
  },
  {
    href: '/poppin',
    src: '/images/PoppinMockupTwo.jpg',
    title: 'Poppin',
    year: '2023',
    blurb: 'Building a socially proofed ticketing network for live events.',
  },
]

export default function LoreModal({ open, onClose }) {
  const [mounted, setMounted] = useState(false)
  const overlayRef = useRef(null)
  const { x, y } = useMousePosition()
  const [finePointer, setFinePointer] = useState(false)
  const [onLink, setOnLink] = useState(false)
  const [onExit, setOnExit] = useState(false)
  const cursorW = onExit ? 88 : onLink ? 26 : 40
  const cursorH = onExit ? 40 : onLink ? 26 : 40

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFinePointer(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!open || x == null || y == null) {
      setOnLink(false)
      setOnExit(false)
      return
    }
    const el = document.elementFromPoint(x - window.scrollX, y - window.scrollY)
    const overSheet = Boolean(el?.closest('[data-lore-sheet]'))
    setOnExit(!overSheet)
    setOnLink(overSheet && Boolean(el?.closest('[data-cursor="link"]')))
  }, [open, x, y])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useLayoutEffect(() => {
    if (!open) return
    const el = overlayRef.current
    if (!el) return
    const isolate = (e) => e.stopPropagation()
    el.addEventListener('wheel', isolate)
    el.addEventListener('touchmove', isolate, { passive: true })
    return () => {
      el.removeEventListener('wheel', isolate)
      el.removeEventListener('touchmove', isolate)
    }
  }, [open])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className={`${styles.overlay} ${finePointer ? styles.hideNativeCursor : ''}`}
          data-lenis-prevent
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <motion.div
            className={styles.sheet}
            data-lore-sheet
            role="dialog"
            aria-modal="true"
            aria-labelledby="lore-modal-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease }}
          >
            <div className={styles.topFade} aria-hidden="true" />
            <div className={styles.closeBar}>
              <button
                type="button"
                className={styles.close}
                data-cursor="link"
                onClick={onClose}
                aria-label="Close Lore Health preview"
              >
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 3l8 8M11 3 3 11" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className={styles.scroll}>
              <div className={styles.col}>
                <div className={styles.hero}>
                  <img
                    className={styles.mark}
                    src="/images/Lore.svg"
                    alt=""
                    aria-hidden="true"
                  />
                  <h2 id="lore-modal-title" className={styles.title}>Lore Health</h2>
                  <div className={styles.meta}>
                    {META.map((item) => (
                      <div key={item.label} className={styles.metaItem}>
                        <p className={styles.metaLabel}>{item.label}</p>
                        <p className={styles.metaValue}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className={styles.rule} role="separator" />
                  <div className={styles.media}>
                    <div className={styles.logoOrb}>
                      <img src="/images/Lore.svg" alt="" />
                    </div>
                  </div>
                </div>

                <section className={styles.split}>
                  <div className={styles.splitLead}>
                    <p className={styles.splitKicker}>The Mission</p>
                    <p className={styles.splitHead}>
                      Lore Health’s mission is to build people’s resilience and reasoning capacity through AI-guided conversation — helping users navigate real pressures (work, money, relationships) by strengthening how they think, not by handing them a fixed program.
                    </p>
                  </div>
                  <div className={styles.splitBody}>
                    <p>
                      Four things I owned: onboarding across channels, explorations and conversations, the design system, and the customer lifetime. The screens themselves are not here. In this industry, they shouldn’t be.
                    </p>
                  </div>
                </section>

                {LORE_CHAPTERS.map((item) => (
                  <div key={item.n}>
                    <div className={styles.ruleBlock}><div className={styles.rule} /></div>
                    <section className={styles.split}>
                      <div className={styles.splitLead}>
                        <p className={styles.splitKicker}>{item.n}</p>
                        <p className={styles.splitHead}>{item.title}</p>
                      </div>
                      <div className={styles.splitBody}>
                        <p>{item.copy}</p>
                      </div>
                    </section>
                  </div>
                ))}

                <div className={styles.noteWrap}>
                  <div className={styles.seal}>
                    <div className={styles.chart} aria-hidden="true">
                      <div className={styles.chartHead}>
                        <span>Session record</span>
                        <span>Sealed</span>
                      </div>
                      <div className={styles.chartRow}>
                        <span>Onboarding</span>
                        <b />
                      </div>
                      <div className={styles.chartRow}>
                        <span>Exploration</span>
                        <b className={styles.chartBarMid} />
                      </div>
                      <div className={styles.chartRow}>
                        <span>Conversation</span>
                        <b className={styles.chartBarLong} />
                      </div>
                      <div className={styles.chartRow}>
                        <span>Lifetime</span>
                        <b className={styles.chartBarShort} />
                      </div>
                      <p className={styles.chartFoot}>Redacted for the people it was made for.</p>
                    </div>
                    <div className={styles.sealCopy}>
                      <p className={styles.splitKicker}>Protected</p>
                      <p className={styles.noteTitle}>The solutions stay in the room.</p>
                      <p className={styles.noteCopy}>
                        Lore is a regulated health product. The flows, surfaces, and system I shipped are under NDA, and they sit next to information that is treated like a medical record. I can talk about the problems I owned. I cannot publish the answers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className={styles.more}>
                  <p className={styles.moreLabel}>Also check out...</p>
                  <div className={styles.moreGrid}>
                    {MORE.map((item) => (
                      <Link key={item.href} href={item.href} className={styles.moreItem} data-cursor="link">
                        <div className={styles.moreImg}>
                          <Image
                            src={item.src}
                            alt={item.title}
                            width={1200}
                            height={650}
                            sizes="(max-width: 700px) 100vw, 360px"
                          />
                        </div>
                        <p className={styles.moreTitle}>
                          {item.title} <span>• {item.year}</span>
                        </p>
                        <p className={styles.moreBlurb}>{item.blurb}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {finePointer && x != null && y != null && (
            <motion.div
              className={`${styles.pageCursor} ${onLink ? styles.pageCursorLink : ''} ${onExit ? styles.pageCursorExit : ''}`}
              animate={{
                x: x - window.scrollX - cursorW / 2,
                y: y - window.scrollY - cursorH / 2,
                width: cursorW,
                height: cursorH,
              }}
              transition={{
                x: { type: 'tween', ease: 'backOut', duration: 0.5 },
                y: { type: 'tween', ease: 'backOut', duration: 0.5 },
                width: { type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.28 },
                height: { type: 'tween', ease: [0.25, 0.46, 0.45, 0.94], duration: 0.28 },
              }}
            >
              <span className={styles.pageCursorDot} aria-hidden="true" />
              <span className={styles.pageCursorLabel}>Exit</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
