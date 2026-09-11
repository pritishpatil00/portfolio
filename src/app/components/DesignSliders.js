'use client'

import { useEffect, useRef } from 'react'
import styles from './DesignSliders.module.scss'

const ROWS = [
  { label: 'Product', left: -1.55, dir: 1 },
  { label: 'Interaction', left: -1.25, dir: -1 },
  { label: 'Visual', left: -1.6, dir: 1 },
]
const COPIES = 10
const TRAVEL = 1500

function wrap(n, w) {
  return ((n % w) + w) % w
}

function rangeFor(row, unitW, vw) {
  const w = Math.max(1, unitW)
  const phase = wrap(row.left * vw - 750 * row.dir, w)
  let fromX = -phase
  let toX = -phase - TRAVEL * row.dir
  const maxX = Math.max(fromX, toX)
  if (maxX > 0) {
    const bump = Math.ceil(maxX / w) * w
    fromX -= bump
    toX -= bump
  }
  return { from: fromX, to: toX }
}

export default function DesignSliders() {
  const trackRefs = useRef([])
  const anims = useRef([])

  useEffect(() => {
    let dead = false
    let onScroll = null
    let compositor = false

    const clearAnims = () => {
      anims.current.forEach((a) => a.cancel())
      anims.current = []
    }

    const ranges = () => {
      const vw = window.innerWidth
      return ROWS.map((row, i) => {
        const unit = trackRefs.current[i]?.firstElementChild
        return rangeFor(row, unit?.offsetWidth || 1, vw)
      })
    }

    const applyJs = (p) => {
      const xs = ranges()
      for (let i = 0; i < 3; i++) {
        const el = trackRefs.current[i]
        if (!el) continue
        const x = xs[i].from + (xs[i].to - xs[i].from) * p
        el.style.transform = `translate3d(${x}px,0,0)`
      }
    }

    const progress = () => {
      const el = document.scrollingElement || document.documentElement
      const limit = el.scrollHeight - window.innerHeight
      return limit > 0 ? el.scrollTop / limit : 0
    }

    const setup = async () => {
      await document.fonts.ready.catch(() => {})
      if (dead) return
      clearAnims()
      compositor = false

      const xs = ranges()
      const Timeline = typeof ScrollTimeline !== 'undefined' ? ScrollTimeline : null
      const cssSda =
        typeof CSS !== 'undefined' &&
        CSS.supports?.('animation-timeline', 'scroll(root)')

      trackRefs.current.forEach((el) => {
        el?.classList.remove(styles.sda)
      })

      if (Timeline) {
        const timeline = new Timeline({
          source: document.scrollingElement || document.documentElement,
          axis: 'block',
        })
        trackRefs.current.forEach((el, i) => {
          if (!el) return
          el.style.transform = ''
          anims.current.push(
            el.animate(
              [
                { transform: `translate3d(${xs[i].from}px,0,0)` },
                { transform: `translate3d(${xs[i].to}px,0,0)` },
              ],
              { fill: 'both', timeline }
            )
          )
        })
        compositor = true
        return
      }

      if (cssSda) {
        trackRefs.current.forEach((el, i) => {
          if (!el) return
          el.style.transform = ''
          el.style.setProperty('--from', `${xs[i].from}px`)
          el.style.setProperty('--to', `${xs[i].to}px`)
          el.classList.add(styles.sda)
        })
        compositor = true
        return
      }

      applyJs(progress())
    }

    setup()

    onScroll = () => {
      if (compositor) return
      applyJs(progress())
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', setup)

    return () => {
      dead = true
      clearAnims()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', setup)
    }
  }, [])

  return (
    <section id="design-sliders" className={styles.block} aria-hidden="true">
      <div className={styles.spacer} />
      {ROWS.map((row, i) => (
        <div key={row.label} className={styles.clip}>
          <div
            ref={(el) => { trackRefs.current[i] = el }}
            className={styles.track}
          >
            {Array.from({ length: COPIES }, (_, n) => (
              <div key={n} className={styles.unit}>
                <span>{row.label}</span>
                <span className={styles.design}> Design</span>
                <span className={styles.pill} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
