'use client'

import { useEffect, useRef } from 'react'

const players = new Map()

function arm(el) {
  if (!el) return
  el.muted = true
  el.defaultMuted = true
  el.volume = 0
  el.playsInline = true
  el.setAttribute('muted', '')
  el.setAttribute('playsinline', '')
  el.setAttribute('webkit-playsinline', '')
}

function playEl(el) {
  if (!el) return
  arm(el)
  const run = el.play()
  if (run) run.catch(() => {})
}

function playVisible() {
  players.forEach((state, el) => {
    if (state.inView) playEl(el)
  })
}

export function pauseAllLoopVideos() {
  players.forEach((_, el) => {
    el.pause()
  })
}

export function playAllLoopVideos() {
  playVisible()
}

if (typeof window !== 'undefined') {
  const kick = () => playVisible()
  window.addEventListener('pointerdown', kick, { capture: true, passive: true })
  window.addEventListener('touchstart', kick, { capture: true, passive: true })
  window.addEventListener('click', kick, { capture: true })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') playVisible()
  })
}

export default function LoopVideo({ src, title, className, eager = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    arm(el)
    const state = { inView: eager, retries: 0 }
    players.set(el, state)

    const tryPlay = () => {
      if (state.inView) playEl(el)
    }

    const onError = () => {
      if (state.retries >= 2) return
      state.retries += 1
      const next = src + (src.includes('?') ? '&' : '?') + 'r=' + state.retries
      el.src = next
      el.load()
      tryPlay()
    }

    el.addEventListener('canplay', tryPlay)
    el.addEventListener('loadeddata', tryPlay)
    el.addEventListener('playing', tryPlay)
    el.addEventListener('stalled', tryPlay)
    el.addEventListener('suspend', tryPlay)
    el.addEventListener('error', onError)

    const io = new IntersectionObserver(
      ([entry]) => {
        state.inView = entry.isIntersecting
        if (entry.isIntersecting) {
          if (el.preload !== 'auto') el.preload = 'auto'
          tryPlay()
        } else {
          el.pause()
        }
      },
      { rootMargin: '120px 0px', threshold: 0.01 }
    )
    io.observe(el)

    if (eager) tryPlay()

    return () => {
      players.delete(el)
      io.disconnect()
      el.removeEventListener('canplay', tryPlay)
      el.removeEventListener('loadeddata', tryPlay)
      el.removeEventListener('playing', tryPlay)
      el.removeEventListener('stalled', tryPlay)
      el.removeEventListener('suspend', tryPlay)
      el.removeEventListener('error', onError)
      el.pause()
    }
  }, [src, eager])

  return (
    <video
      ref={(el) => {
        ref.current = el
        arm(el)
      }}
      className={className}
      src={src}
      title={title}
      muted
      defaultMuted
      autoPlay
      loop
      playsInline
      preload={eager ? 'auto' : 'metadata'}
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
    />
  )
}
