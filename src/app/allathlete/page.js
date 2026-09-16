'use client'

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
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

const SYSTEM_SHOTS = [
  { src: '/images/Buttons and Controls.jpg', alt: 'Buttons and controls', caption: 'Buttons and controls' },
  { src: '/images/Navigation.jpg', alt: 'Navigation components', caption: 'Navigation' },
  { src: '/images/Cards.jpg', alt: 'Cards and list items', caption: 'Cards' },
  { src: '/images/Inputs and fields.jpg', alt: 'Inputs and fields', caption: 'Inputs and fields' },
]

const SIDE_NAV = [
  { id: 'intro', label: 'Intro' },
  { id: 'research', label: 'Research' },
  { id: 'structure', label: 'Structure' },
  { id: 'solutions', label: 'Solutions' },
]

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
  const items = [
    {
      n: '01',
      src: '/images/AllAthleteNew.jpg',
      title: 'Home and consumption',
      copy: 'A modular post structure replaced the competing visual hierarchy of the old feed, so athletes could scan highlights, metrics, and social proof in one rhythm.',
    },
    {
      n: '02',
      stack: [
        '/images/PostingOne.jpg',
        '/images/PostingTwo.jpg',
        '/images/PostingThree.jpg',
      ],
      title: 'Posting and Metrics',
      copy: 'Create a post, tag skills on the film, and give coaches metrics they can search.',
    },
    {
      n: '03',
      src: '/images/AllAthleteProfile.jpg',
      title: 'Profile and sports experience',
      copy: 'Profile components were rebuilt to actually show sports data. Athletes who previously stalled on incomplete profiles could now present measurables, achievements, and film without fighting the layout.',
    },
    {
      n: '04',
      src: '/images/AllAthleteFilters.jpg',
      title: 'Player search and filtering',
      copy: 'A master search with grouped filters let coaches isolate athletes by sport, position, and user generated metrics: the missing endpoint between AllAthlete’s coach network and the people on the platform.',
    },
    {
      n: '05',
      src: '/images/allathlete/hifi-calendar.png',
      title: 'Training and calendar',
      copy: 'Activity and training views gave the product a reason to return daily, not only at recruiting season, keeping the network warm for both athletes and the coaches watching them.',
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
            {(item.stack || [item.src]).map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={1600}
                height={1140}
                sizes="(max-width: 900px) 100vw, 88vw"
              />
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

export default function AllAthleteCaseStudy() {
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
          <p data-cursor="link" onClick={handleCaseStudiesClick}>WORK</p>
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
            Redesigning AllAthlete as the destination for recruiting<span>.</span>
          </motion.h1>
          </div>
        </div>
        <div className={styles.clip}>
          <motion.p className={styles.heroLead} variants={rise} initial="hidden" animate="show" transition={{ delay: 0.06, duration: 0.75, ease }}>
            AllAthlete is a social recruiting platform that consolidates sports data so high school athletes can get discovered, and college programs can find them.
          </motion.p>
        </div>
        <div className={styles.clip}>
          <motion.p className={styles.heroSub} variants={rise} initial="hidden" animate="show" transition={{ delay: 0.12, duration: 0.75, ease }}>
            Redesigned the experience and brand for an existing base of athletes and coaches, then shipped the system that let that network actually connect.
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
            src="/videos/allathlete.mp4"
            title="AllAthlete product"
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
            <p>Product Designer</p>
          </div>
          <div className={styles.detail}>
            <h6>Year</h6>
            <p>2022</p>
          </div>
          <div className={styles.detail}>
            <h6>Tools</h6>
            <p>Figma, ProtoPie, Illustrator</p>
          </div>
          <div className={styles.detail}>
            <h6>Contributions</h6>
            <ul className={styles.contribList}>
              <li>Design System</li>
              <li>User Research</li>
              <li>UX/UI Design</li>
              <li>Usability Testing</li>
            </ul>
          </div>
        </div>
        <div className={styles.objective}>
          <h6>Brief</h6>
          <p>
            Alongside distribution, AllAthlete needed an experience that matched the mission: be the place athletes get recruited. The existing product had a tangled information architecture that athletes and coaches could not consume. This was the chance to design for the people already on the platform, and to give the product a brand that could hold them.
          </p>
          <p>
            The high level goal was a product that let athletes share sports data and achievements, then connect with coaches to start recruiting, with the least friction through the architecture we already had.
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
          <p>Scope of the overhaul: the people using AllAthlete out of need, not because the product was clear.</p>
        </div>
      </section>

      <section className={styles.fullBleed}>
        <h6>The old site / the new site</h6>
        <BeforeAfter
          before="/images/allathlete/old-home.jpg"
          after="/images/AllAthleteNew.jpg"
          beforeAlt="AllAthlete home before the redesign"
          afterAlt="AllAthlete home after the redesign"
        />
      </section>

      <section className={styles.split}>
        <div>
          <h6>Product goals</h6>
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

      <section id="research" className={`${styles.narrative} ${styles.sectionAnchor}`}>
        <h6>Audit</h6>
        <h3>Find out who was on the platform, and why recruiting never closed<span>.</span></h3>
        <p>
          I talked with athletes and coaches already on AllAthlete to learn who they were, what they needed from recruiting, and where the product dropped them.
        </p>
      </section>

      <section className={styles.auditResearch} aria-label="Audit metrics and user research">
        <div className={styles.auditMetrics}>
          <article>
            <p className={styles.auditNum}>15%</p>
            <div className={styles.auditCopy}>
              <h6>Profile completion</h6>
              <p>Athletes rarely finished a profile, so coaches had nothing to recruit against.</p>
            </div>
          </article>
          <article>
            <p className={styles.auditNum}>5%</p>
            <div className={styles.auditCopy}>
              <h6>Coach search success</h6>
              <p>Almost no coaches could find a qualified player, or contact them in product.</p>
            </div>
          </article>
          <article>
            <p className={styles.auditNum}>&lt;2</p>
            <div className={styles.auditCopy}>
              <h6>Avg. connections</h6>
              <p>The graph was too thin for social proof, or for coaches to judge a recruit.</p>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.narrative}>
        <h6>User personas</h6>
        <h3>Consumers of the platform<span>.</span></h3>
        <p>
          Interviews kept landing on the same four people. Each one named a distinct job so the IA could serve them without inheriting the others’ complexity.
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

      <section id="structure" className={`${styles.narrative} ${styles.sectionAnchor}`}>
        <h6>Mid fidelity</h6>
        <h3>Establishing Structure<span>.</span></h3>
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

      <section className={styles.fullImage}>
        <Image src="/images/allathlete/wire-header.png" alt="Wireframe header system" width={2000} height={800} sizes="100vw" />
        <p className={styles.caption}>Header system in mid fidelity, before high fidelity</p>
      </section>

      <section className={styles.narrative}>
        <h6>Design system</h6>
        <h3>A component library engineering could ship without guessing<span>.</span></h3>
        <p>
          Visual design locked type, color, and interaction into a shared set of parts. The system stayed specific to the recruiting loop, not exhaustive, so a thin build could still stay consistent across home, profile, search, and training.
        </p>
      </section>

      <section className={styles.systemGrid}>
        {SYSTEM_SHOTS.map(({ src, alt, caption }) => (
          <figure key={caption}>
            <Image src={src} alt={alt} width={1600} height={1200} sizes="(max-width: 900px) 100vw, 50vw" />
            <figcaption>{caption}</figcaption>
          </figure>
        ))}
      </section>

      <section id="solutions" className={`${styles.narrative} ${styles.sectionAnchor}`}>
        <h6>Solutions</h6>
        <h3 className={styles.solutionsTitle}>Home, profile, search, and training as one recruiting system<span>.</span></h3>
        <p>
          Visual design locked layout, type, color, and interaction so engineering could build the coach-to-athlete loop without guessing across surfaces.
        </p>
      </section>

      <ScrollingFeatures />

      <section className={styles.more}>
        <h2>Other projects<span>.</span></h2>
        <div className={styles.moreGrid}>
          <Link href="/poppin" className={styles.moreItem}>
            <div className={styles.moreImg}>
              <Image src="/images/PoppinMockupTwo.jpg" alt="Poppin" width={1200} height={800} sizes="(max-width: 700px) 100vw, 50vw" />
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
        </div>
      </footer>
      <BottomBlur />
    </motion.main>
  )
}
