'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import useMousePosition from '../utils/useMousePosition'
import BottomBlur from './BottomBlur'
import LoreBody from './LoreBody'
import styles from './LoreModal.module.scss'

const ease = [0.25, 0.46, 0.45, 0.94]

export default function LoreModal({ open, onClose }) {
  const [mounted, setMounted] = useState(false)
  const overlayRef = useRef(null)
  const { x, y } = useMousePosition()
  const [finePointer, setFinePointer] = useState(false)
  const [onLink, setOnLink] = useState(false)
  const [onExit, setOnExit] = useState(false)
  const cursorW = onLink && !onExit ? 26 : 40
  const cursorH = onLink && !onExit ? 26 : 40

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
                <LoreBody titleId="lore-modal-title" />
              </div>
            </div>
            <BottomBlur contained />
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
              <svg className={styles.pageCursorX} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 3l8 8M11 3 3 11" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
