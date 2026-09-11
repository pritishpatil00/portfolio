'use client'
import styles from './page.module.scss'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

const NAV = [
  { id: 'context', label: 'Context' },
  { id: 'problem', label: 'Problem' },
  { id: 'research', label: 'Research' },
  { id: 'solution', label: 'Solution' },
  { id: 'impact', label: 'Impact' },
]

export default function PoppinCaseStudy() {
  const router = useRouter()
  const [navVisible, setNavVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('context')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const syncNav = useCallback(() => {
    const intro = document.getElementById('intro')
    if (intro) setNavVisible(intro.getBoundingClientRect().bottom <= 0)

    const line = window.innerHeight * 0.28
    let current = NAV[0].id
    for (const { id } of NAV) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top <= line) current = id
    }
    setActiveSection((prev) => (prev === current ? prev : current))
  }, [])

  useEffect(() => {
    syncNav()
    window.addEventListener('scroll', syncNav, { passive: true })
    window.addEventListener('resize', syncNav)
    return () => {
      window.removeEventListener('scroll', syncNav)
      window.removeEventListener('resize', syncNav)
    }
  }, [syncNav])

  const handleCaseStudiesClick = () => {
    router.push('/?skipLoading=true')
  }

  const scrollTo = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(id)
  }

  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <header className={styles.stickyHeader}>
        <div className={styles.headerName}>
          <Link href="/">
            <p>PRITISH PATIL</p>
          </Link>
        </div>
        <nav className={styles.headerNav}>
          <p onClick={handleCaseStudiesClick}>CASE STUDIES</p>
          <Link href="/?skipLoading=true#sandbox"><p>SANDBOX</p></Link>
          <Link href="/?skipLoading=true#about"><p>ABOUT</p></Link>
        </nav>
      </header>

      <nav
        className={`${styles.sectionNav} ${navVisible ? styles.sectionNavVisible : ''}`}
        aria-label="Section"
      >
        {NAV.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`${styles.sectionNavLink} ${activeSection === id ? styles.sectionNavLinkActive : ''}`}
            onClick={scrollTo(id)}
          >
            {label}
          </a>
        ))}
      </nav>

      <section id="intro" className={`${styles.section} ${styles.sectionHero}`}>
        <div className={styles.inner}>
          <p className={styles.lead}>
            Building a socially-proofed ticketing network for hyperlocal university events
          </p>
          <p className={styles.body}>
            Students wanted to go out — they just couldn’t see what was happening. I led research and design from 0 to 1 across iOS and web so hosts could convert, and attendees could find events through the people they already knew.
          </p>
          <div className={styles.meta}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Role</span>
              <span className={styles.metaValue}>Product Lead — Design & Research</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Time</span>
              <span className={styles.metaValue}>5 months, launched Sep 2023</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Team</span>
              <span className={styles.metaValue}>2 iOS, backend, front-end, design intern</span>
            </div>
          </div>
        </div>
        <figure className={`${styles.mediaFull} ${styles.framed}`}>
          <div className={styles.surface}>
            <Image
              src="/images/PoppinMockupTwo.jpg"
              alt="Poppin on iPhone"
              width={1920}
              height={1080}
              className={styles.asset}
              priority
              sizes="100vw"
              quality={80}
            />
          </div>
        </figure>
      </section>

      <section id="context" className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.heading}>Context</h2>
          <div className={styles.block}>
            <p className={styles.lead}>Demand was loud. Discovery wasn’t.</p>
            <p className={styles.body}>
              The MVP was a campus bulletin board. It bootstrapped 10,000 users in one network — proof that students would show up if they could find the event.
            </p>
          </div>
        </div>
      </section>

      <section id="problem" className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.heading}>Problem</h2>
          <div className={styles.block}>
            <p className={styles.lead}>Accessing the right event required too much work.</p>
            <p className={styles.body}>
              Students weren’t lacking options. They were missing a reason to commit — and the MVP leaked that commitment across browse, tickets, and purchase.
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.lead}>Existing tools weren’t built around friends.</p>
            <p className={styles.body}>
              Competitors offered personal event pages, open marketplaces, or host dashboards. None of them made “who else is going” the default path to a ticket.
            </p>
          </div>
          <figure className={`${styles.media} ${styles.mediaLarge} ${styles.framed}`}>
            <div className={styles.surface}>
              <Image
                src="/images/poppin/twoSided.png"
                alt="Attendee and host sides of the marketplace"
                width={1200}
                height={800}
                className={styles.asset}
              />
            </div>
            <figcaption className={styles.caption}>Two jobs: students find people, hosts find money and reach</figcaption>
          </figure>
        </div>
      </section>

      <section id="research" className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.heading}>Research</h2>
          <div className={styles.block}>
            <p className={styles.lead}>I talked to students on campus and hosts already throwing events</p>
            <p className={styles.body}>
              Interviews were as simple as walking university areas and asking how people hear about nights out — then mapping that against how hosts decide an event “worked.”
            </p>
          </div>
          <div className={styles.statGrid}>
            <div className={styles.stat}>
              <p className={styles.statValue}>Friends first</p>
              <p className={styles.statLabel}>How students decide to attend</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>Money + reach</p>
              <p className={styles.statLabel}>How hosts define success</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>10,000 users</p>
              <p className={styles.statLabel}>What the bulletin-board MVP already proved</p>
            </div>
          </div>
          <figure className={`${styles.media} ${styles.mediaLarge} ${styles.framed}`}>
            <div className={styles.surface}>
              <Image
                src="/images/poppin/spectrums.png"
                alt="Decision spectrums across the ticket journey"
                width={1400}
                height={900}
                className={styles.asset}
              />
            </div>
            <figcaption className={styles.caption}>Spectrums used to map when students commit — from awareness to loyalty</figcaption>
          </figure>
        </div>
      </section>

      <section id="solution" className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.heading}>Solution</h2>
          <div className={styles.block}>
            <p className={styles.lead}>Make the guest list the reason to buy.</p>
            <p className={styles.body}>
              Poppin’s wedge was network density: public signups that put friends on the event, so purchase is social, not speculative.
            </p>
          </div>

          <div className={styles.block}>
            <p className={styles.lead}>Join the network, then see who’s going</p>
            <p className={styles.body}>
              Traffic came from shares, web, and social. iOS was the moment a user entered campus context — friends visible on the same events.
            </p>
          </div>
          <figure className={`${styles.media} ${styles.mediaLarge} ${styles.framed}`}>
            <div className={styles.surface}>
              <Image
                src="/images/poppin/onboarding.png"
                alt="Onboarding into the Poppin campus network"
                width={1600}
                height={1000}
                className={styles.asset}
              />
            </div>
            <figcaption className={styles.caption}>Onboarding establishes network context before browse</figcaption>
          </figure>

          <div className={styles.block}>
            <p className={styles.lead}>Browse you can decide from in one pass</p>
            <p className={styles.body}>
              Early feedback showed missing disclosure. I rebuilt classification and event information so a student could choose without hunting.
            </p>
          </div>
          <figure className={`${styles.media} ${styles.mediaLarge} ${styles.framed}`}>
            <div className={styles.surface}>
              <Image
                src="/images/poppin/browsing.png"
                alt="Event browsing architecture"
                width={1600}
                height={1000}
                className={styles.asset}
              />
            </div>
            <figcaption className={styles.caption}>Browsing architecture — enough signal to commit</figcaption>
          </figure>
          <figure className={`${styles.media} ${styles.mediaLarge} ${styles.framed}`}>
            <div className={styles.surface}>
              <Image
                src="/images/poppin/partyDetails.jpg"
                alt="Event details and ticket purchase"
                width={1600}
                height={1000}
                className={styles.asset}
              />
            </div>
            <figcaption className={styles.caption}>Event page: who’s going, then buy</figcaption>
          </figure>

          <div className={styles.block}>
            <p className={styles.lead}>Host tooling that’s thin on purpose</p>
            <p className={styles.body}>
              Guest lists you can actually manage, and a small set of metrics across the event lifecycle. Web covered non-exclusive hosts, then pulled them onto mobile.
            </p>
          </div>
          <figure className={`${styles.media} ${styles.mediaLarge} ${styles.framed}`}>
            <div className={styles.surface}>
              <Image
                src="/images/poppin/hostTooling.png"
                alt="Host guest lists and metrics"
                width={1600}
                height={1000}
                className={styles.asset}
              />
            </div>
            <figcaption className={styles.caption}>Host tools: lists and observable metrics, not a dashboard for its own sake</figcaption>
          </figure>
        </div>
      </section>

      <section id="impact" className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.heading}>Impact</h2>
          <div className={styles.block}>
            <p className={styles.lead}>Shipped into a $2M seed across the UC network</p>
            <p className={styles.body}>
              After the fall launch: 100,000+ users, $2,000,000+ GMV, 60% weekly retention. Seed from 1984 Ventures, Progression Fund, Liquid2. PearX S’23.
            </p>
          </div>
          <div className={styles.statGrid}>
            <div className={styles.stat}>
              <p className={styles.statValue}>100K+ users</p>
              <p className={styles.statLabel}>Post-launch network</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>$2M+ seed</p>
              <p className={styles.statLabel}>Raised after UC launch</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>$2M+ GMV</p>
              <p className={styles.statLabel}>Tickets moved on the marketplace</p>
            </div>
            <div className={styles.stat}>
              <p className={styles.statValue}>60% weekly</p>
              <p className={styles.statLabel}>Retention after launch</p>
            </div>
          </div>
          <div className={styles.stack}>
            <div className={styles.block} data-number="1">
              <p className={styles.body}>Align the room before you add surface area.</p>
            </div>
            <div className={styles.block} data-number="2">
              <p className={styles.body}>Ship for the academic calendar; architect for the next ten campuses.</p>
            </div>
            <div className={styles.block} data-number="3">
              <p className={styles.body}>Density is a community problem before it is a feature problem.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  )
}
