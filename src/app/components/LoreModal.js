'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { LORE_CHAPTERS } from '../lore/content'
import styles from './LoreModal.module.scss'

const ease = [0.25, 0.46, 0.45, 0.94]

export default function LoreModal({ open, onClose }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease }}
        >
          <motion.div
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lore-modal-title"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.985 }}
            transition={{ duration: 0.38, ease }}
          >
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close Lore Health preview"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            <div className={styles.scroll}>
              <p className={styles.kicker}>Preview · Present</p>
              <h2 id="lore-modal-title" className={styles.title}>
                Lore Health<span>.</span>
              </h2>
              <p className={styles.lead}>
                An AI-powered health platform helping users manage psychological and physical stressors.
              </p>
              <p className={styles.sub}>
                Design engineer. Four focus areas from work in progress. A full case study will follow.
              </p>
              <div className={styles.frame}>
                <Image
                  src="/images/LoreHealthMockup.png"
                  alt="Lore Health on iPhone"
                  width={1600}
                  height={1200}
                  className={styles.img}
                  sizes="(max-width: 700px) 100vw, 1080px"
                  quality={80}
                />
              </div>
              {LORE_CHAPTERS.map((item) => (
                <article key={item.n} className={styles.chapter}>
                  <p className={styles.num}>{item.n}</p>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
