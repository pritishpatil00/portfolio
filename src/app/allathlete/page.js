'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Lenis from 'lenis'
import BottomBlur from '../components/BottomBlur'
import LoopVideo from '../components/LoopVideo'
import useMousePosition from '../utils/useMousePosition'
import styles from './page.module.scss'

const ease = [0.25, 0.46, 0.45, 0.94]
const rise = {
  hidden: { y: 20 },
  show: { y: 0, transition: { duration: 0.75, ease } },
}

function BeforeAfter({ before, after, beforeAlt, afterAlt }) {
  const wrapRef = useRef(null)
  const [pos, setPos] = useState(52)
  const dragging = useRef(false)

  const setFromEvent = (clientX) => {
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const next = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(0, Math.min(100, next)))
  }

  useEffect(() => {
    const move = (e) => {
      if (!dragging.current) return
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      setFromEvent(x)
    }
    const up = () => { dragging.current = false }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('touchmove', move, { passive: true })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className={styles.beforeAfter}
      onPointerDown={(e) => {
        dragging.current = true
        setFromEvent(e.clientX)
      }}
    >
      <div className={styles.baStage}>
        <img src={after} alt={afterAlt} className={styles.baImg} draggable={false} />
        <div className={styles.baBefore} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={before} alt={beforeAlt} className={styles.baImg} draggable={false} />
        </div>
        <span className={styles.baLine} style={{ left: `${pos}%` }} />
      </div>
      <div className={styles.baHandle} style={{ left: `${pos}%` }}>
        <span className={styles.baKnob}>
          <span>Before</span>
          <span>After</span>
        </span>
      </div>
    </div>
  )
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

function ScrollingFeatures() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const yLeft = useTransform(scrollYProgress, [0, 1], [120, -160])
  const yRight = useTransform(scrollYProgress, [0, 1], [-80, 180])

  const left = [
    {
      src: '/images/allathlete/hifi-home.png',
      title: 'Home and consumption.',
      copy: 'A modular post structure replaced the competing visual hierarchy of the old feed, so athletes could scan highlights, metrics, and social proof in one rhythm, on web and in parity with mobile.',
    },
    {
      src: '/images/allathlete/hifi-profile.png',
      title: 'Profile and sports experience.',
      copy: 'Profile components were rebuilt to actually show sports data. Athletes who previously stalled on incomplete profiles could now present measurables, achievements, and film without fighting the layout.',
    },
    {
      src: '/images/allathlete/hifi-search.png',
      title: 'Player search and filtering.',
      copy: 'A master search with grouped filters let coaches isolate athletes by sport, position, and user generated metrics: the missing endpoint between AllAthlete’s coach network and the people on the platform.',
    },
    {
      src: '/images/allathlete/hifi-calendar.png',
      title: 'Training and calendar.',
      copy: 'Activity and training views gave the product a reason to return daily, not only at recruiting season, keeping the network warm for both athletes and the coaches watching them.',
    },
  ]

  const right = [
    '/images/allathlete/hifi-feed.png',
    '/images/allathlete/hifi-full.png',
    '/images/allathlete/hifi-search.png',
    '/images/allathlete/hifi-profile.png',
  ]

  return (
    <div ref={ref} className={styles.scrolling}>
      <motion.div className={styles.scrollCol} style={{ y: yLeft }}>
        {left.map((item) => (
          <div key={item.title} className={styles.scrollBlock}>
            <div className={styles.scrollShot}>
              <Image src={item.src} alt="" width={1400} height={900} sizes="(max-width: 900px) 90vw, 44vw" />
            </div>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </div>
        ))}
      </motion.div>
      <motion.div className={`${styles.scrollCol} ${styles.scrollColRight}`} style={{ y: yRight }}>
        {right.map((src) => (
          <div key={src} className={styles.scrollShotTall}>
            <Image src={src} alt="" width={1400} height={1600} sizes="(max-width: 900px) 90vw, 44vw" />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function AllAthleteCaseStudy() {
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
    window.setTimeout(() => router.push(href), 420)
  }

  const handleCaseStudiesClick = () => {
    goHome('/?skipLoading=true')
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
          <p data-cursor="link" onClick={handleCaseStudiesClick}>WORK</p>
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
            Redesigning AllAthlete as the destination for recruiting<span>.</span>
          </motion.h1>
        </div>
        <div className={styles.clip}>
          <motion.p className={styles.heroLead} variants={rise} initial="hidden" animate="show" transition={{ delay: 0.06, duration: 0.75, ease }}>
            AllAthlete is a social recruiting platform that consolidates sports data so high school athletes can get discovered, and college programs can find them.
          </motion.p>
        </div>
        <div className={styles.clip}>
          <motion.p className={styles.heroSub} variants={rise} initial="hidden" animate="show" transition={{ delay: 0.12, duration: 0.75, ease }}>
            First product designer on the team. Redesigned the web experience and brand for an existing base of athletes and coaches, then shipped the system that let that network actually connect.
          </motion.p>
        </div>
        <div className={styles.ctaWrap}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.75, ease }}
          >
            <a href="https://www.allathlete.com" target="_blank" rel="noreferrer" className={styles.liveSiteCta}>
              Visit live site
              <svg className={styles.liveSiteCtaArrow} width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.2 6h7.2M6.6 3.2 10 6 6.6 8.8" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      <div className={styles.heroMedia}>
        <div className={styles.heroFrame}>
            <LoopVideo
            src="/videos/allathlete-mobile.mp4"
            title="AllAthlete mobile product"
            className={styles.heroVideo}
            eager
          />
        </div>
      </div>

      <section className={styles.overview}>
        <div className={styles.detailCol}>
          <div className={styles.detail}>
            <h6>Company</h6>
            <p>AllAthlete</p>
          </div>
          <div className={styles.detail}>
            <h6>Role</h6>
            <p>Product Designer<br />1 of 2 designers</p>
          </div>
          <div className={styles.detail}>
            <h6>Year</h6>
            <p>Jun 2022 to Jun 2023</p>
          </div>
          <div className={styles.detail}>
            <h6>Tools</h6>
            <p>Figma, FigJam, Maze, Illustrator</p>
          </div>
          <div className={styles.detail}>
            <h6>Skills</h6>
            <p>Design systems, branding, user research, information architecture, UX/UI, usability testing</p>
          </div>
        </div>
        <div className={styles.objective}>
          <h6>Brief</h6>
          <p>
            Alongside distribution, AllAthlete needed an online experience that matched the mission: be the place athletes get recruited. The existing web product had a tangled information architecture that athletes and coaches could not consume. This was the chance to design a digital experience for the people already on the platform, and to give the product a brand that could hold them.
          </p>
          <p>
            The high level goal was a web platform (with mobile parity) that let athletes share sports data and achievements, then connect with coaches to start recruiting, with the least friction through the architecture we already had.
          </p>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statNum}>300k+</div>
          <h6>Users</h6>
          <p>Athletes, coaches, and fans on a platform that previously leaked conversion in the IA.</p>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>10k+</div>
          <h6>College visits created</h6>
          <p>The recruiting endpoint the product promised, now reachable through search and complete profiles.</p>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>8k+</div>
          <h6>Offers created</h6>
          <p>Proof that coaches could isolate and contact athletes once sport data was actually on the page.</p>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>50k+</div>
          <h6>Athletes and coaches</h6>
          <p>Scope of the web overhaul: the people using AllAthlete out of need, not because the product was clear.</p>
        </div>
      </section>

      <section className={styles.fullBleed}>
        <h6>The old site / the new site</h6>
        <BeforeAfter
          before="/images/allathlete/old-home.jpg"
          after="/images/allathlete/home.jpg"
          beforeAlt="AllAthlete home before the redesign"
          afterAlt="AllAthlete home after the redesign"
        />
      </section>

      <section className={styles.split}>
        <div>
          <h6>Website goals</h6>
          <h3>Make recruiting the path, not a scavenger hunt<span>.</span></h3>
        </div>
        <p>
          Design the prominent flows with the least friction through the established architecture. Ship a cohesive design system and brand. Prioritize the features that actually close the loop between athlete data and coach discovery, not a larger surface area.
        </p>
      </section>

      <section className={styles.pair}>
        <figure>
          <Image src="/images/allathlete/profile-v1.jpg" alt="Profile v1" width={1600} height={1000} sizes="(max-width: 900px) 100vw, 50vw" />
          <figcaption>Profile v1</figcaption>
        </figure>
        <figure>
          <Image src="/images/allathlete/programs-v1.jpg" alt="Programs v1" width={1600} height={1000} sizes="(max-width: 900px) 100vw, 50vw" />
          <figcaption>Programs v1</figcaption>
        </figure>
      </section>

      <section className={styles.narrative}>
        <h6>Audit</h6>
        <h3>Find out who was on the platform, and why recruiting never closed<span>.</span></h3>
        <p>
          I joined and audited top down. Direct user testing was not guaranteed, so the first job was to learn how people already related to AllAthlete, and what they hoped to get from it, from stakeholders, field notes, and the competitive set.
        </p>
        <p>
          Most users are high school athletes aiming to be recruited, skewed toward football, track, and basketball. AllAthlete’s supply of college coaches is the endpoint. The product failed that handshake: metrics were hard to consume, profiles were rarely complete, and coaches could not isolate qualified athletes or contact them.
        </p>
      </section>

      <section className={styles.narrative}>
        <h6>Mid fidelity</h6>
        <h3>Wireframes of the design solution<span>.</span></h3>
        <p>
          After the audit, the first screens locked structure before visual design. Home and profile were the two surfaces that had to carry sports data, social proof, and a path to coaches.
        </p>
      </section>

      <section className={styles.pair}>
        <figure>
          <Image src="/images/allathlete/wire-home.png" alt="Home feed mid fidelity wireframe" width={1600} height={2000} sizes="(max-width: 900px) 100vw, 50vw" />
          <figcaption>Home feed, mid fidelity</figcaption>
        </figure>
        <figure>
          <Image src="/images/allathlete/wire-profile.png" alt="Profile mid fidelity wireframe" width={1600} height={2000} sizes="(max-width: 900px) 100vw, 50vw" />
          <figcaption>Profile, mid fidelity</figcaption>
        </figure>
      </section>

      <section className={`${styles.narrative} ${styles.narrativeFaint}`}>
        <h6>Information architecture</h6>
        <p>
          Hudl showed that strong content drives engagement, but a social sports data product is still an unfamiliar idea because recruiting happens in many steps. Other databases are not user generated. AllAthlete’s advantage only works if athletes can actually upload data, if there is social proof to keep them there, and if coaches can filter that data without noise.
        </p>
        <p>
          Three questions drove the IA: make upload simple enough that profiles get finished; give younger athletes social currency so the network has density; make coach search an efficient cut on user generated sport metrics.
        </p>
      </section>

      <section className={styles.fullImage}>
        <Image src="/images/allathlete/wire-search.png" alt="Search and filter wireframe" width={2000} height={1400} sizes="100vw" />
        <p className={styles.caption}>Player search grouped with master filters, mid fidelity</p>
      </section>

      <section className={styles.narrative}>
        <h6>User personas</h6>
        <h3>Consumers of the platform<span>.</span></h3>
        <p>
          The product had to serve four existing people at once: the intermediate athlete who lives on the app to get scouted, the coach hunting a specific profile, the superstar building a brand, and the fan who keeps the social layer alive. Each persona named a distinct job so the IA could serve them without inheriting the others’ complexity.
        </p>
      </section>

      <section className={styles.personas}>
        {[
          [
            '/images/allathlete/persona-teo.png',
            'Teo the Intermediate',
            'Ambitious and on the platform often to increase his chances of getting scouted. Uses new features to give himself a leg up.',
            'Needs a connected, uplifting experience.',
          ],
          [
            '/images/allathlete/persona-nick.png',
            'Nick the Coach',
            'Scouting for the next big player he can recruit. Needs an effective way to find talented athletes.',
            'Needs an efficient, quick experience.',
          ],
          [
            '/images/allathlete/persona-jon.png',
            'Jon the Superstar',
            'A talented athlete aiming to grow his personal brand in preparation for the next step in his athletic journey.',
            'Needs a social, positive experience.',
          ],
          [
            '/images/allathlete/persona-jake.png',
            'Jake the Fan',
            'Loves to watch sports of every level and keep up with the latest results, trends, and upcoming players.',
            'Needs an informative, social experience.',
          ],
        ].map(([src, name, copy, need]) => (
          <article key={name}>
            <Image src={src} alt={name} width={320} height={320} sizes="(max-width: 700px) 40vw, 12vw" />
            <h6>{name}</h6>
            <p>{copy}</p>
            <p className={styles.personaNeed}>{need}</p>
          </article>
        ))}
      </section>

      <section className={styles.fullImage}>
        <Image src="/images/allathlete/wire-header.png" alt="Wireframe header system" width={2000} height={800} sizes="100vw" />
        <p className={styles.caption}>Header system in mid fidelity, before high fidelity</p>
      </section>

      <section className={styles.narrative}>
        <h6>Shipped screens</h6>
        <h3>Home, profile, search, and training as one recruiting system<span>.</span></h3>
        <p>
          Visual design locked layout, type, color, and interaction so engineering could build the coach-to-athlete loop without guessing across surfaces.
        </p>
      </section>

      <ScrollingFeatures />

      <section className={styles.stickyBand}>
        <aside className={styles.stickyCard}>
          <h4>Need a product designer<span>.</span></h4>
          <p>I can take a messy two sided recruiting product and make the path between athletes and coaches obvious.</p>
          <HoverFill href="/?skipLoading=true#about" className={`${styles.primary} ${styles.primaryStretch}`}>
            Let’s talk
          </HoverFill>
        </aside>
        <div className={styles.stickyCopy}>
          <h3>The AllAthlete web overhaul made recruiting data usable for the people already on the platform<span>.</span></h3>
          <p>
            Athletes could not finish or present a profile, and coaches could not find them. We rebuilt consumption around modular posts, rebuilt the profile around sports data, and put customizable filters next to search so AllAthlete’s coach relationships had somewhere to land.
          </p>
          <p>
            A design system and brand held the new IA together across web and mobile. Development resources were thin relative to the architecture, so the rate of learning outpaced the rate of shipping, which meant the system had to be specific, not exhaustive.
          </p>
          <blockquote>
            “Only a small proportion of athletes had completed their profile. The breakpoints were in upload, not in demand.”
          </blockquote>
          <h6>What landed</h6>
          <p>
            The redesigned web platform supported hundreds of thousands of users, 10,000+ college visits, and 8,000+ offers. Coaches could finally cut the directory; athletes had a reason to finish the page that represented them.
          </p>
        </div>
      </section>

      <section className={styles.narrative}>
        <h6>After the year</h6>
        <h3>The audit had to stand in for the tests we could not run yet<span>.</span></h3>
        <p>
          Being the first product designer on a small team means stakeholder interviews and field notes have to name the breakpoints before a test plan exists. Upload, social density, and coach filter were enough to refuse features that did not serve them.
        </p>
        <p>
          I also learned the cost of communication past the point of diminishing returns, and the cost of an architecture that outruns engineering. The useful response was a tighter system, a clearer brand, and flows that a limited build could actually finish.
        </p>
      </section>

      <section className={styles.more}>
        <h2>Other projects<span>.</span></h2>
        <div className={styles.moreGrid}>
          <Link href="/poppin" className={styles.moreItem}>
            <div className={styles.moreImg}>
              <Image src="/images/PoppinMockupTwo.jpg" alt="Poppin" width={1200} height={800} sizes="(max-width: 700px) 100vw, 50vw" />
              <span className={styles.moreCircle} />
            </div>
            <h3>Building a socially proofed ticketing network for live events.</h3>
            <p>Product lead at Poppin. Overhaul of 3.0 through seed.</p>
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
