'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './HeroGridInvert.module.scss'

function gridFor(w, h) {
  if (w <= 900) return { cols: 6, rows: 10 }
  const target = 96
  return {
    cols: Math.min(16, Math.max(10, Math.round(w / target))),
    rows: Math.min(12, Math.max(8, Math.round(h / target))),
  }
}

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
    let timer = 0

    const measure = () => {
      if (!el.isConnected) return
      const r = el.getBoundingClientRect()
      if (r.width < 8 || r.height < 8) return
      setBox((prev) => {
        if (Math.abs(prev.w - r.width) < 4 && Math.abs(prev.h - r.height) < 4) return prev
        return { w: r.width, h: r.height }
      })
    }

    const sync = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(measure, 80)
    }

    measure()
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    window.addEventListener('resize', sync)
    window.visualViewport?.addEventListener('resize', sync)
    return () => {
      window.clearTimeout(timer)
      ro.disconnect()
      window.removeEventListener('resize', sync)
      window.visualViewport?.removeEventListener('resize', sync)
    }
  }, [])

  const ready = box.w >= 8 && box.h >= 8
  const { cols, rows } = ready ? gridFor(box.w, box.h) : { cols: 0, rows: 0 }
  const compact = box.w <= 900
  const oc = cols ? Math.max(0, Math.min(cols - 1, Math.round(origin.c * (cols - 1)))) : 0
  const or = rows ? Math.max(0, Math.min(rows - 1, Math.round(origin.r * (rows - 1)))) : 0
  const maxD = cols + rows
  const overlap = 2
  const cellW = cols ? box.w / cols : 0
  const cellH = rows ? box.h / rows : 0
  const step = compact ? 0.028 : 0.022

  const cells = []
  if (ready) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const d = Math.abs(c - oc) + Math.abs(r - or)
        const delay = (open ? d : maxD - d) * step
        const ox = open ? 0.5 : c < oc ? 1 : c > oc ? 0 : 0.5
        const oy = open ? 0.5 : r < or ? 1 : r > or ? 0 : 0.5
        const left = c * cellW - overlap
        const top = r * cellH - overlap
        cells.push(
          <div
            key={`${cols}x${rows}-${c}-${r}`}
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
            <InvertCopy
              width={box.w}
              height={box.h}
              left={-left}
              top={-top}
            />
          </div>
        )
      }
    }
  }

  return (
    <div ref={wrapRef} className={styles.layer}>
      <div className={styles.grid}>{cells}</div>
    </div>
  )
}
