'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Lenis from 'lenis'
import BottomBlur from '../components/BottomBlur'
import useMousePosition from '../utils/useMousePosition'
import styles from './page.module.scss'

const ease = [0.25, 0.46, 0.45, 0.94]
const rise = {
  hidden: { y: 20 },
  show: { y: 0, transition: { duration: 0.75, ease } },
}

function HoverFill({ href, children, className, external, onClick }) {
  const inner = (
    <span className={styles.swap}>
      <span className={styles.hoverTop}>{children}</span>
      <span className={styles.hoverBottom}>{children}</span>
    </span>
  )
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} onClick={onClick}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {inner}
    </Link>
  )
}

function HifiFeatures() {
  const items = [
    {
      src: '/images/poppin/onboarding.png',
      title: 'Onboarding into the local network.',
      copy: 'Traffic came from shares, web, and social. The iOS app was the moment a user entered the network, so people on the same events became visible before browse.',
    },
    {
      src: '/images/poppin/browsing.png',
      title: 'Browse you can decide from.',
      copy: 'Early feedback showed missing disclosure. I rebuilt classification and event information so a buyer could choose in one pass, without hunting.',
    },
    {
      src: '/images/poppin/hostTooling.png',
      title: 'Host tooling that is thin on purpose.',
      copy: 'Guest lists you can actually manage, and a small set of metrics across the event lifecycle. Web covered independent hosts, then pulled them onto mobile.',
    },
  ]

  return (
    <div className={styles.hifiStack}>
      {items.map((item) => (
        <div key={item.title} className={styles.scrollBlock}>
          <div className={styles.scrollShot}>
            <Image src={item.src} alt="" width={1600} height={1000} sizes="(max-width: 900px) 92vw, 88vw" />
          </div>
          <h3>{item.title}</h3>
          <p>{item.copy}</p>
        </div>
      ))}
    </div>
  )
}

export default function PoppinCaseStudy() {
  const router = useRouter()
  const [leaving, setLeaving] = useState(false)
  const [finePointer, setFinePointer] = useState(false)
  const { x, y } = useMousePosition()
  const [onNavLink, setOnNavLink] = useState(false)
  const cursorSize = onNavLink ? 26 : 40

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFinePointer(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (x == null || y == null) {
      setOnNavLink(false)
      return
    }
    const el = document.elementFromPoint(x - window.scrollX, y - window.scrollY)
    setOnNavLink(Boolean(el?.closest('[data-cursor="link"]')))
  }, [x, y])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    let alive = true
    let raf = 0
    let lenis = null

    const loop = (t) => {
      if (!alive || !lenis) return
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(() => {
      if (!alive) return
      lenis = new Lenis()
      raf = requestAnimationFrame(loop)
    })

    const fadeOut = () => setLeaving(true)
    window.addEventListener('popstate', fadeOut)
    window.addEventListener('pagehide', fadeOut)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      try { lenis?.destroy() } catch {}
      window.removeEventListener('popstate', fadeOut)
      window.removeEventListener('pagehide', fadeOut)
    }
  }, [])

  const goHome = (href = '/?skipLoading=true') => {
    setLeaving(true)
    window.setTimeout(() => router.push(href), 520)
  }

  return (
    <motion.main
      className={`${styles.page} ${finePointer ? styles.hideNativeCursor : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.52, ease }}
    >
      {finePointer && x != null && y != null && (
        <motion.div
          className={`${styles.pageCursor} ${onNavLink ? styles.pageCursorLink : ''}`}
          animate={{
            x: x - window.scrollX - cursorSize / 2,
            y: y - window.scrollY - cursorSize / 2,
            width: cursorSize,
            height: cursorSize,
          }}
          transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
        >
          <span className={styles.pageCursorDot} aria-hidden="true" />
        </motion.div>
      )}
      <header className={styles.stickyHeader}>
        <div className={styles.headerName}>
          <Link href="/" data-cursor="link" onClick={(e) => { e.preventDefault(); goHome('/?skipLoading=true') }}><p>PRITISH PATIL</p></Link>
        </div>
        <nav className={styles.headerNav}>
          <p data-cursor="link" onClick={() => goHome('/?skipLoading=true')}>WORK</p>
          <Link href="/?skipLoading=true#sandbox" data-cursor="link"><p>SANDBOX</p></Link>
          <Link href="/?skipLoading=true#about" data-cursor="link"><p>ABOUT</p></Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.clip}>
          <motion.div initial="hidden" animate="show">
            <HoverFill
              href="/?skipLoading=true"
              className={styles.backLink}
              onClick={(e) => { e.preventDefault(); goHome() }}
            >
              ‹ Back to Projects
            </HoverFill>
          </motion.div>
        </div>
        <div className={styles.clip}>
          <motion.h1 variants={rise} initial="hidden" animate="show">
            Building a socially proofed ticketing network for live events<span>.</span>
          </motion.h1>
        </div>
        <div className={styles.clip}>
          <motion.p className={styles.heroLead} variants={rise} initial="hidden" animate="show" transition={{ delay: 0.06, duration: 0.75, ease }}>
            Poppin is a ticketing platform that makes local events discoverable through the people already going.
          </motion.p>
        </div>
        <div className={styles.clip}>
          <motion.p className={styles.heroSub} variants={rise} initial="hidden" animate="show" transition={{ delay: 0.12, duration: 0.75, ease }}>
            Product lead. Directed design and branding across iOS and web so hosts could convert, and buyers could decide from social proof.
          </motion.p>
        </div>
      </section>

      <div className={styles.heroMedia}>
        <div className={styles.heroFrame}>
          <Image
            src="/images/PoppinMockupTwo.jpg"
            alt="Poppin on iPhone"
            width={1920}
            height={1080}
            className={styles.heroImg}
            priority
            sizes="100vw"
            quality={80}
          />
        </div>
      </div>

      <section className={styles.overview}>
        <div className={styles.detailCol}>
          <div className={styles.detail}>
            <h6>Company</h6>
            <p>Poppin</p>
          </div>
          <div className={styles.detail}>
            <h6>Role</h6>
            <p>Product Lead<br />Design and research</p>
          </div>
          <div className={styles.detail}>
            <h6>Year</h6>
            <p>2023</p>
          </div>
          <div className={styles.detail}>
            <h6>Team</h6>
            <p>2 iOS, backend, frontend, design</p>
          </div>
          <div className={styles.detail}>
            <h6>Skills</h6>
            <p>Product design, user research, information architecture, visual design, product management</p>
          </div>
        </div>
        <div className={styles.objective}>
          <h6>Mandate</h6>
          <p>
            Demand was already there. People could not see what was happening nearby. The MVP proved a network would form if events were findable: 10,000 users in a single market.
          </p>
          <p>
            The job was to take that demand to scale: a new iOS app, a web experience for independent hosts, and a backend that could hold a multi-market network, without adding surface the team could not ship.
          </p>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statNum}>100k+</div>
          <h6>Users</h6>
          <p>Network across California markets.</p>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>$2M+</div>
          <h6>Round raised</h6>
          <p>1984 Ventures, Progression Fund, Liquid2. PearX.</p>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>$2M+</div>
          <h6>GMV</h6>
          <p>Tickets moved on the marketplace once the guest list became the path to purchase.</p>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>60%</div>
          <h6>Weekly retention</h6>
          <p>Buyers returning because the network had density, not because we added more screens.</p>
        </div>
      </section>

      <section className={styles.split}>
        <div>
          <h6>Product goals</h6>
          <h3>Make the guest list the reason to buy<span>.</span></h3>
        </div>
        <p>
          Accessing the right event required too much work. Buyers were not lacking options. They were missing a reason to commit, and the MVP leaked that commitment across browse, tickets, and purchase. Existing tools offered personal event pages, open marketplaces, or host dashboards. None of them made “who else is going” the default path to a ticket.
        </p>
      </section>

      <section className={styles.fullImage}>
        <Image src="/images/poppin/competitive.png" alt="Competitive market map" width={2000} height={1400} sizes="100vw" />
        <p className={styles.caption}>Competitors sold pages, tickets, or tooling. None sold the friends list</p>
      </section>

      <section className={styles.narrative}>
        <h6>Fieldwork</h6>
        <h3>Friends first. Then everything else<span>.</span></h3>
        <p>
          Interviews mapped how people hear about events against how hosts decide an event worked. People decide which events to attend based on who else is going, prior to considering other factors.
        </p>
        <p>
          Hosts’ two main goals are revenue and awareness. The event was likely to happen with or without Poppin. The product had to onboard groups that already run events, and help them reach the right people in a network they did not have to build from scratch.
        </p>
      </section>

      <section className={styles.fullImage}>
        <Image src="/images/poppin/spectrums.png" alt="Decision spectrums across the ticket journey" width={2000} height={1400} sizes="100vw" />
        <p className={styles.caption}>Spectrums used to map when buyers commit, from awareness to loyalty</p>
      </section>

      <section className={styles.pair}>
        <figure>
          <Image src="/images/poppin/situations.png" alt="Commitment situations" width={1600} height={1000} sizes="(max-width: 900px) 100vw, 50vw" />
          <figcaption>Contexts where a buyer actually commits</figcaption>
        </figure>
        <figure>
          <Image src="/images/poppin/cases.png" alt="Decision cases" width={1600} height={1000} sizes="(max-width: 900px) 100vw, 50vw" />
          <figcaption>Cases that shaped browse, tickets, and purchase</figcaption>
        </figure>
      </section>

      <section className={`${styles.narrative} ${styles.narrativeFaint}`}>
        <h6>Strategy</h6>
        <p>
          Scope had to be decided against value, usability, feasibility, and business viability, so the room could agree on what not to build. We needed a new iOS app, a web experience for independent hosts, and a rewritten backend for scale.
        </p>
        <p>
          Poppin’s wedge was first-mover density in hyperlocal networks. That relies less on a predefined private event and more on public signups, so a buyer can decide from what their people are already doing.
        </p>
      </section>

      <section className={styles.fullImage}>
        <Image src="/images/poppin/roadmap.png" alt="Design roadmap" width={2000} height={1400} sizes="100vw" />
        <p className={styles.caption}>Design roadmap for scale</p>
      </section>

      <section className={styles.narrative}>
        <h6>Principles</h6>
        <h3>Social proof, then clarity<span>.</span></h3>
        <p>
          The goal was a seamless path from selecting an event to completing a ticket purchase. Maximize the number of friends on the guest list so buying is motivated by people, then keep browse to purchase obvious enough that the motivation does not leak.
        </p>
      </section>

      <section className={styles.principles}>
        <article>
          <Image src="/images/poppin/connectivity.png" alt="" width={96} height={96} />
          <h3>Connectivity</h3>
          <p>Use social validation and proof to increase ticket transaction rate.</p>
        </article>
        <article>
          <Image src="/images/poppin/simplicity.png" alt="" width={96} height={96} />
          <h3>Simplicity</h3>
          <p>Clarity from browse to purchase, so a buyer is not hunting for the details.</p>
        </article>
      </section>

      <section className={styles.fullImage}>
        <Image src="/images/poppin/metrics.png" alt="Host metrics" width={2000} height={1400} sizes="100vw" />
        <p className={styles.caption}>Base metrics hosts could actually use across the event lifecycle</p>
      </section>

      <section className={styles.narrative}>
        <h6>Product surfaces</h6>
        <h3>Onboarding, browse, and host tools that could actually ship<span>.</span></h3>
        <p>
          These were the screens required for discovery and conversion, without extra surface the team could not deliver.
        </p>
      </section>

      <HifiFeatures />

      <section className={styles.fullImage}>
        <Image src="/images/poppin/eventInfo.png" alt="Event information architecture" width={2000} height={1400} sizes="100vw" />
        <p className={styles.caption}>Event information, rebuilt so purchase could follow the guest list</p>
      </section>

      <section className={styles.stickyBand}>
        <aside className={styles.stickyCard}>
          <h4>Building a marketplace next<span>.</span></h4>
          <p>I can take a two sided marketplace and make the path from discovery to purchase obvious, without adding surface area.</p>
          <HoverFill href="/?skipLoading=true#about" className={`${styles.primary} ${styles.primaryStretch}`}>
            Start a conversation
          </HoverFill>
        </aside>
        <div className={styles.stickyCopy}>
          <h3>Poppin made live events discoverable through the people already going<span>.</span></h3>
          <p>
            People could not see what was happening, and hosts could not turn existing events into a network. We rebuilt onboarding around local context, rebuilt browse around disclosure, and put the guest list on the event page so purchase had a reason.
          </p>
          <p>
            Scope constraints meant the system had to be specific. Web covered independent hosts. Mobile held the social layer. The metrics were few enough that hosts would actually look at them.
          </p>
          <blockquote>
            “People decide which events to attend based on who else is going, prior to considering other factors.”
          </blockquote>
          <h6>Outcome</h6>
          <p>
            100,000+ users, $2,000,000+ GMV, 60% weekly retention, and a $2,000,000 round.
          </p>
        </div>
      </section>

      <section className={styles.narrative}>
        <h6>What held</h6>
        <h3>Density is a network problem before it is a feature problem<span>.</span></h3>
        <p>
          Align the room before you add surface area. Architect for the next market, not a larger interface.
        </p>
        <p>
          A constrained build punishes extra screens. The useful response was a clearer guest list, and flows the team could actually finish.
        </p>
      </section>

      <section className={styles.more}>
        <h2>Continue<span>.</span></h2>
        <div className={styles.moreGrid}>
          <Link href="/allathlete" className={styles.moreItem}>
            <div className={styles.moreImg}>
              <Image src="/images/AllAthleteMockup.jpg" alt="AllAthlete" width={1200} height={800} sizes="(max-width: 700px) 100vw, 50vw" />
              <span className={styles.moreCircle} />
            </div>
            <h3>Redesigning AllAthlete as the destination for recruiting.</h3>
            <p>Product designer at AllAthlete.</p>
          </Link>
          <Link href="/lore" className={styles.moreItem}>
            <div className={styles.moreImg}>
              <Image src="/images/LoreHealthMockup.png" alt="Lore Health" width={1200} height={900} sizes="(max-width: 700px) 100vw, 50vw" />
              <span className={styles.moreCircle} />
            </div>
            <h3>An AI-powered health platform for psychological and physical stressors.</h3>
            <p>Design engineer at Lore Health.</p>
          </Link>
        </div>
      </section>

      <footer className={styles.pageFooter}>
        <HoverFill href="https://www.linkedin.com/in/pritish-patil/" className={styles.footerTouch} external>
          Let’s get in touch
        </HoverFill>
        <div className={styles.footerLinks}>
          <a href="https://www.linkedin.com/in/pritish-patil/" target="_blank" rel="noreferrer">LinkedIn</a>
          <Link href="/?skipLoading=true" onClick={(e) => { e.preventDefault(); goHome() }}>Work</Link>
        </div>
      </footer>
      <BottomBlur />
    </motion.main>
  )
}
