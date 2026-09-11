'use client'

import { useEffect, useRef } from 'react'

const players = new Set()

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
  arm(el)
  const run = el.play()
  if (run) run.catch(() => {})
}

export function pauseAllLoopVideos() {
  players.forEach((el) => {
    el.pause()
  })
}

export function playAllLoopVideos() {
  players.forEach(playEl)
}

if (typeof window !== 'undefined') {
  const kick = () => playAllLoopVideos()
  window.addEventListener('pointerdown', kick, { capture: true, passive: true })
  window.addEventListener('touchstart', kick, { capture: true, passive: true })
  window.addEventListener('click', kick, { capture: true })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') playAllLoopVideos()
  })
}

export default function LoopVideo({ src, title, className }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    arm(el)
    players.add(el)
    playEl(el)

    const onReady = () => playEl(el)
    el.addEventListener('canplay', onReady)
    el.addEventListener('loadeddata', onReady)
    el.addEventListener('playing', onReady)

    return () => {
      players.delete(el)
      el.removeEventListener('canplay', onReady)
      el.removeEventListener('loadeddata', onReady)
      el.removeEventListener('playing', onReady)
    }
  }, [src])

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
      preload="auto"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
    />
  )
}
