'use client'
import styles from './Sandbox.module.scss'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import LoopVideo, { playAllLoopVideos, pauseAllLoopVideos } from './LoopVideo'

const PLACEHOLDER =
  'Placeholder copy. A short note on what this exploration was, the interaction, and what I was testing.'

const ITEMS = [
  { src: '/images/sandbox/crowdsurf.jpg', title: 'CrowdSurf' },
  { src: '/images/sandbox/edtech.png', title: 'EdTech Future' },
  { video: '/videos/metamask.mp4', title: 'Metamask RD' },
  { video: '/videos/rotating-wallet.mp4', title: 'Rotating Wallet' },
  { src: '/images/sandbox/og.jpg', title: 'OG' },
  { video: '/videos/looping-stack.mp4', title: 'Looping Stack Interaction' },
  { src: '/images/sandbox/program.jpg', title: 'ProGram' },
  { src: '/images/sandbox/hoodie.jpg', title: 'Subject' },
  { src: '/images/sandbox/hazard.jpg', title: 'Hazard' },
  { video: '/videos/cardview.mp4', title: 'CardView Interaction' },
  { src: '/images/sandbox/sath.jpg', title: 'SAATH' },
  { src: '/images/sandbox/navi.jpg', title: 'Navi' },
  { video: '/videos/tiktok-scroll.mp4', title: 'TikTokScroll' },
  { src: '/images/sandbox/ailanding.jpg', title: 'AI Landing' },
  { src: '/images/sandbox/oasis.jpg', title: 'Oasis' },
]

const flipSpring = { type: 'spring', stiffness: 170, damping: 22, mass: 0.85 }

function TileMedia({ item }) {
  if (item.video) {
    return <LoopVideo src={item.video} title={item.title} className={styles.tileVideo} />
  }

  return (
    <Image
      src={item.src}
      alt={item.title}
      width={item.wide ? 1800 : 1200}
      height={item.wide ? 800 : 1200}
      className={styles.tileImage}
      sizes={item.wide ? '100vw' : '(max-width: 900px) 50vw, 33vw'}
      quality={80}
    />
  )
}

function frontIsShowing(rotateY) {
  const n = typeof rotateY === 'number' ? rotateY : parseFloat(rotateY)
  if (Number.isNaN(n)) return true
  const a = ((n % 360) + 360) % 360
  return a < 90 || a > 270
}

function useFineHover() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFine(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return fine
}

function Tile({ item, isFlipped, onToggle, liftOnHover }) {
  const className = `${styles.tile} ${item.wide ? styles.wide : ''} ${isFlipped ? styles.flipped : ''}`
  const faceRef = useRef(null)

  const setVideoFace = (show) => {
    const video = faceRef.current?.querySelector('video')
    if (!video) return
    video.hidden = !show
    video.style.visibility = show ? 'visible' : 'hidden'
    video.style.opacity = show ? '1' : '0'
  }

  return (
    <motion.button
      type="button"
      className={className}
      onClick={onToggle}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? `Hide ${item.title}` : `About ${item.title}`}
      whileHover={liftOnHover && !isFlipped ? { y: -5 } : { y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    >
      <motion.div
        className={styles.flip}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={flipSpring}
        transformTemplate={({ rotateY }) => {
          const n = typeof rotateY === 'number' ? rotateY : parseFloat(rotateY)
          return !n || Math.abs(n) < 0.5 ? 'none' : `rotateY(${n}deg)`
        }}
        onUpdate={(latest) => {
          if (item.video) setVideoFace(frontIsShowing(latest.rotateY))
        }}
        onAnimationComplete={() => {
          if (!item.video) return
          setVideoFace(!isFlipped)
          if (!isFlipped) playAllLoopVideos()
        }}
      >
        <div ref={faceRef} className={styles.face}>
          <TileMedia item={item} />
        </div>
        <div className={styles.back}>
          <p className={styles.backTitle}>{item.title}</p>
          <p className={styles.backCopy}>{PLACEHOLDER}</p>
        </div>
      </motion.div>
    </motion.button>
  )
}

export default function Sandbox() {
  const [flipped, setFlipped] = useState(null)
  const liftOnHover = useFineHover()

  useEffect(() => {
    const section = document.getElementById('sandbox')
    if (!section) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) playAllLoopVideos()
        else pauseAllLoopVideos()
      },
      { rootMargin: '80px 0px', threshold: 0 }
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (flipped == null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setFlipped(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipped])

  return (
    <section id="sandbox" className={styles.sandbox}>
      <p className={styles.kicker}>Sandbox</p>

      <div className={styles.grid}>
        {ITEMS.map((entry, index) => (
          <Tile
            key={`${entry.title}-${entry.video || entry.src}`}
            item={entry}
            isFlipped={flipped === index}
            liftOnHover={liftOnHover}
            onToggle={() => setFlipped(flipped === index ? null : index)}
          />
        ))}
      </div>
    </section>
  )
}
