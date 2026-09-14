'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { LORE_CHAPTERS } from '../lore/content'
import styles from './LoreModal.module.scss'

const ease = [0.25, 0.46, 0.45, 0.94]

const META = [
  { label: 'Year', value: 'Present' },
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

  useEffect(() => {
    setMounted(true)
  }, [])

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
          className={styles.overlay}
          data-lenis-prevent
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <motion.div
            className={styles.sheet}
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
                onClick={onClose}
                aria-label="Close Lore Health preview"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M10 4H4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 4L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 20H20V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 20L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className={styles.scroll}>
              <div className={styles.col}>
                <div className={styles.hero}>
                  <div className={styles.mark} aria-hidden="true">L</div>
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
                    <div className={styles.orbit} aria-hidden="true">
                      <div className={styles.mediaOrb}>
                        <span className={styles.orbMint} />
                        <span className={styles.orbSky} />
                      </div>
                    </div>
                    <div className={styles.logoOrb} aria-hidden="true" />
                    <p className={styles.mediaCaption}>Interface withheld</p>
                  </div>
                </div>

                <section className={styles.split}>
                  <div className={styles.splitLead}>
                    <p className={styles.splitKicker}>The work</p>
                    <p className={styles.splitHead}>
                      An AI-powered health platform helping users manage psychological and physical stressors.
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
                      <Link key={item.href} href={item.href} className={styles.moreItem}>
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
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
