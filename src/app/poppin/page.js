'use client'

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
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

const SIDE_NAV = [
  { id: 'intro', label: 'Intro' },
  { id: 'research', label: 'Research' },
  { id: 'structure', label: 'Structure' },
  { id: 'solutions', label: 'Solutions' },
]

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

function ScrollingFeatures() {
  const items = [
    {
      n: '01',
      src: '/images/poppin/onboarding.png',
      title: 'Onboarding into the local network',
      copy: 'Traffic came from shares, web, and social. The iOS app was the moment a user entered the network, so people on the same events became visible before browse.',
    },
    {
      n: '02',
      src: '/images/poppin/browsing.png',
      title: 'Browse you can decide from',
      copy: 'Early feedback showed missing disclosure. I rebuilt classification and event information so a buyer could choose in one pass, without hunting.',
    },
    {
      n: '03',
      src: '/images/poppin/hostTooling.png',
      title: 'Host tooling that is thin on purpose',
      copy: 'Guest lists you can actually manage, and a small set of metrics across the event lifecycle. Web covered independent hosts, then pulled them onto mobile.',
    },
    {
      n: '04',
      src: '/images/poppin/eventInfo.png',
      title: 'Event information',
      copy: 'The event page put the guest list ahead of generic details, so purchase followed people instead of a listing. Classification and disclosure lived here so a buyer did not have to leave the page to decide.',
    },
  ]

  return (
    <div className={styles.solutions}>
      <div className={styles.solutionsRule} aria-hidden="true" />
      {items.map((item) => (
        <article key={item.n} className={styles.solution}>
          <header className={styles.solutionHead}>
            <p className={styles.solutionNum}>{item.n}</p>
            <h4>{item.title}</h4>
            <p className={styles.solutionCopy}>{item.copy}</p>
          </header>
          <div className={styles.solutionShot}>
            <Image src={item.src} alt="" width={1600} height={1140} sizes="(max-width: 900px) 100vw, 88vw" />
          </div>
        </article>
      ))}
    </div>
  )
}

export default function PoppinCaseStudy() {
  const router = useRouter()
  const [leaving, setLeaving] = useState(false)
  const [finePointer, setFinePointer] = useState(false)
  const { clientX, clientY } = useMousePosition()
  const [onNavLink, setOnNavLink] = useState(false)
  const [activeSection, setActiveSection] = useState('intro')
  const lenisRef = useRef(null)
  const heroTitleRef = useRef(null)
  const [navTop, setNavTop] = useState(null)
  const cursorSize = onNavLink ? 26 : 40

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFinePointer(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (clientX == null || clientY == null) {
      setOnNavLink(false)
      return
    }
    const el = document.elementFromPoint(clientX, clientY)
    setOnNavLink(Boolean(el?.closest('[data-cursor="link"]')))
  }, [clientX, clientY])

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
      lenisRef.current = lenis
      lenis.on('scroll', () => {
        const ids = SIDE_NAV.map((item) => item.id)
        const mark = 140
        let current = ids[0]
        for (const id of ids) {
          const el = document.getElementById(id)
          if (!el) continue
          if (el.getBoundingClientRect().top <= mark) current = id
        }
        setActiveSection((prev) => (prev === current ? prev : current))
      })
      raf = requestAnimationFrame(loop)
    })

    const fadeOut = () => setLeaving(true)
    window.addEventListener('popstate', fadeOut)
    window.addEventListener('pagehide', fadeOut)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      try { lenis?.destroy() } catch {}
      lenisRef.current = null
      window.removeEventListener('popstate', fadeOut)
      window.removeEventListener('pagehide', fadeOut)
    }
  }, [])

  useEffect(() => {
    const ids = SIDE_NAV.map((item) => item.id)
    const update = () => {
      const mark = 140
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= mark) current = id
      }
      setActiveSection((prev) => (prev === current ? prev : current))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
    }
  }, [])

  useLayoutEffect(() => {
    const layoutTop = (el) => {
      let y = 0
      let node = el
      while (node) {
        y += node.offsetTop
        node = node.offsetParent
      }
      return y
    }
    const sync = () => {
      const title = heroTitleRef.current
      if (!title) return
      const top = layoutTop(title)
      setNavTop((prev) => (prev != null && Math.abs(prev - top) < 0.5 ? prev : top))
    }
    sync()
    document.fonts?.ready?.then(sync)
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = window.scrollY + el.getBoundingClientRect().top - 56
    if (lenisRef.current) lenisRef.current.scrollTo(top)
    else window.scrollTo({ top, behavior: 'smooth' })
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
      {finePointer && clientX != null && clientY != null && (
        <motion.div
          className={`${styles.pageCursor} ${onNavLink ? styles.pageCursorLink : ''}`}
          animate={{
            x: clientX - cursorSize / 2,
            y: clientY - cursorSize / 2,
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
          <Link href="/?skipLoading=true#hero" data-cursor="link" onClick={(e) => { e.preventDefault(); try { sessionStorage.removeItem('homeScroll') } catch {}; goHome('/?skipLoading=true#hero') }}><p>PRITISH PATIL</p></Link>
        </div>
        <nav className={styles.headerNav}>
          <p data-cursor="link" onClick={() => goHome('/?skipLoading=true')}>WORK</p>
          <Link href="/?skipLoading=true#sandbox" data-cursor="link"><p>SANDBOX</p></Link>
          <Link href="/?skipLoading=true#about" data-cursor="link"><p>ABOUT</p></Link>
        </nav>
      </header>

      <div className={styles.sideNav} style={navTop != null ? { top: navTop } : undefined}>
        <motion.nav
          aria-label="Case study sections"
          variants={rise}
          initial="hidden"
          animate="show"
        >
          {SIDE_NAV.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              data-cursor="link"
              className={activeSection === id ? styles.sideNavActive : ''}
              onClick={() => scrollToSection(id)}
            >
              {label}
            </button>
          ))}
        </motion.nav>
      </div>

      <section id="intro" className={`${styles.hero} ${styles.sectionAnchor}`}>
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
          <div ref={heroTitleRef} className={styles.heroTitleLock}>
          <motion.h1 variants={rise} initial="hidden" animate="show">
            <span className={styles.heroLine}>Building a socially proofed</span>
            <br />
            <span className={styles.heroLine}>ticketing network for live events</span>
            <span className={styles.heroDot}>.</span>
          </motion.h1>
          </div>
        </div>
        <div className={styles.clip}>
          <motion.p className={styles.heroLead} variants={rise} initial="hidden" animate="show" transition={{ delay: 0.06, duration: 0.75, ease }}>
            Poppin is a ticketing platform that makes local events discoverable through the people already going.
          </motion.p>
        </div>
        <div className={styles.clip}>
          <motion.p className={styles.heroSub} variants={rise} initial="hidden" animate="show" transition={{ delay: 0.12, duration: 0.75, ease }}>
            Product designer. Directed design and branding across iOS and web so hosts could convert, and buyers could decide from social proof.
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
            <p>Product Designer</p>
          </div>
          <div className={styles.detail}>
            <h6>Year</h6>
            <p>2023</p>
          </div>
          <div className={styles.detail}>
            <h6>Tools</h6>
            <p>Figma, SwiftUI, ProtoPie</p>
          </div>
          <div className={styles.detail}>
            <h6>Contributions</h6>
            <ul className={styles.contribList}>
              <li>User Research</li>
              <li>UX/UI Design</li>
              <li>Visual Design</li>
              <li>Front End Development</li>
            </ul>
          </div>
        </div>
        <div className={styles.objective}>
          <h6>Brief</h6>
          <p>
            Demand was already there. People could not see what was happening nearby. 10,000 users in a single market showed a network would form if events were findable.
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
        <h6>Product goals</h6>
        <h3>Make the guest list the reason to buy<span>.</span></h3>
        <p>
          Accessing the right event required too much work. Buyers were not lacking options. They were missing a reason to commit, and the MVP leaked that commitment across browse, tickets, and purchase. Existing tools offered personal event pages, open marketplaces, or host dashboards. None of them made “who else is going” the default path to a ticket.
        </p>
      </section>

      <section className={styles.fullImage}>
        <Image src="/images/poppin/competitive.png" alt="Competitive market map" width={2000} height={1400} sizes="100vw" />
        <p className={styles.caption}>Competitors sold pages, tickets, or tooling. None sold the friends list</p>
      </section>

      <section id="research" className={`${styles.narrative} ${styles.fieldwork} ${styles.sectionAnchor}`}>
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

      <section className={styles.fullImage}>
        <Image src="/images/poppin/situations.png" alt="Commitment situations" width={2000} height={1400} sizes="100vw" />
        <p className={styles.caption}>Contexts where a buyer actually commits</p>
      </section>

      <section className={styles.fullImage}>
        <Image src="/images/poppin/cases.png" alt="Decision cases" width={2000} height={1400} sizes="100vw" />
        <p className={styles.caption}>Cases that shaped browse, tickets, and purchase</p>
      </section>

      <section id="structure" className={`${styles.narrative} ${styles.narrativeFaint} ${styles.sectionAnchor}`}>
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

      <section className={`${styles.narrative} ${styles.copyToImage}`}>
        <h6>Host tooling</h6>
        <h3>Defining success<span>.</span></h3>
        <p>
          Hosts already run events. Success for them is revenue and awareness, not a dashboard. The product needed a small set of numbers they would actually check across the event lifecycle, so they could see whether Poppin was reaching the right people.
        </p>
      </section>

      <section className={styles.fullImage}>
        <Image src="/images/poppin/metrics.png" alt="Host metrics" width={2000} height={1400} sizes="100vw" />
        <p className={styles.caption}>Base metrics hosts could actually use across the event lifecycle</p>
      </section>

      <section id="solutions" className={`${styles.narrative} ${styles.solutionsHead} ${styles.sectionAnchor}`}>
        <h6>Solutions</h6>
        <h3 className={styles.solutionsTitle}>Onboarding, browse, and hosting as one path to purchase<span>.</span></h3>
        <p>
          Buyers were missing a reason to commit, and hosts could not turn events they already ran into a network. These screens close that loop: put someone into local context, let them decide from who else is going, and give hosts a few numbers they would actually check.
        </p>
      </section>

      <ScrollingFeatures />

      <section className={styles.more}>
        <h2>Other projects<span>.</span></h2>
        <div className={styles.moreGrid}>
          <Link href="/allathlete" className={styles.moreItem}>
            <div className={styles.moreImg}>
              <Image src="/images/AllAthleteMockup.jpg" alt="AllAthlete" width={1200} height={800} sizes="(max-width: 700px) 100vw, 50vw" />
            </div>
            <h3>Redesigning AllAthlete as the destination for recruiting.</h3>
            <p>Product designer at AllAthlete.</p>
          </Link>
          <Link
            href="/lore"
            className={styles.moreItem}
            onClick={(e) => {
              if (window.matchMedia('(max-width: 700px)').matches) return
              e.preventDefault()
              goHome('/?skipLoading=true&lore=1')
            }}
          >
            <div className={styles.moreImg}>
              <Image src="/images/LoreHealthMockup.png" alt="Lore Health" width={1200} height={900} sizes="(max-width: 700px) 100vw, 50vw" />
            </div>
            <h3>An AI-powered health platform for psychological and physical stressors.</h3>
            <p>Design engineer at Lore Health.</p>
          </Link>
        </div>
      </section>

      <footer className={styles.pageFooter}>
        <HoverFill href="https://www.linkedin.com/in/pritish-patil/" className={styles.footerTouch} external>
          Get in Touch
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
