'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './HeroGridInvert.module.scss'

const COLS = 6
const ROWS = 10

function InvertCopy({ width, height, left, top }) {
  return (
    <div
      className={styles.copy}
      style={{ width, height, left, top }}
    >
      <div className={styles.word}>
        <p>GOOD</p>
      </div>
      <div className={styles.word}>
        <p>DESIGN</p>
      </div>
      <div className={styles.word}>
        <p>IS</p>
      </div>
      <div className={styles.word}>
        <p>INVISIBLE</p>
      </div>
      <div className={styles.skillsWrap}>
        <p className={styles.skills}>
          Design engineer. Product, interaction, and the interface.
        </p>
      </div>
      <span className={styles.signifier}>
        <span className={styles.signifierRing} />
        <span className={styles.signifierRing} />
      </span>
    </div>
  )
}

export default function HeroGridInvert({ open, origin }) {
  const wrapRef = useRef(null)
  const [box, setBox] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const sync = () => {
      const r = el.getBoundingClientRect()
      setBox({ w: r.width, h: r.height })
    }

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    window.addEventListener('resize', sync)
    window.visualViewport?.addEventListener('resize', sync)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', sync)
      window.visualViewport?.removeEventListener('resize', sync)
    }
  }, [])

  const oc = Math.max(0, Math.min(COLS - 1, Math.round(origin.c * (COLS - 1))))
  const or = Math.max(0, Math.min(ROWS - 1, Math.round(origin.r * (ROWS - 1))))
  const maxD = COLS + ROWS
  const overlap = 2
  const cellW = box.w / COLS
  const cellH = box.h / ROWS

  const cells = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const d = Math.abs(c - oc) + Math.abs(r - or)
      const delay = (open ? d : maxD - d) * 0.028
      const ox = open ? 0.5 : c < oc ? 1 : c > oc ? 0 : 0.5
      const oy = open ? 0.5 : r < or ? 1 : r > or ? 0 : 0.5
      const left = c * cellW - overlap
      const top = r * cellH - overlap
      cells.push(
        <div
          key={`${c}-${r}`}
          className={styles.cell}
          style={{
            left,
            top,
            width: cellW + overlap * 2,
            height: cellH + overlap * 2,
            '--hero-s': open ? 1 : 0,
            '--hero-ox': ox,
            '--hero-oy': oy,
            transitionDelay: `${delay}s`,
          }}
        >
          {box.w > 0 && (
            <InvertCopy
              width={box.w}
              height={box.h}
              left={-left}
              top={-top}
            />
          )}
        </div>
      )
    }
  }

  return (
    <div ref={wrapRef} className={styles.layer}>
      <div className={styles.grid}>{cells}</div>
    </div>
  )
}
