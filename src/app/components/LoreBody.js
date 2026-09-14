import Image from 'next/image'
import Link from 'next/link'
import { LORE_CHAPTERS } from '../lore/content'
import styles from './LoreModal.module.scss'

const META = [
  { label: 'Year', value: '2025 to Present' },
  { label: 'Role', value: 'Design Engineer' },
  { label: 'Org', value: 'Lore Health' },
  { label: 'Status', value: 'Ongoing' },
]

const MORE = [
  {
    href: '/allathlete',
    src: '/images/AllAthleteMockup.jpg',
    title: 'AllAthlete',
    year: '2022',
    blurb: 'Redesigning AllAthlete as the destination for recruiting.',
  },
  {
    href: '/poppin',
    src: '/images/PoppinMockupTwo.jpg',
    title: 'Poppin',
    year: '2023',
    blurb: 'Building a socially proofed ticketing network for live events.',
  },
]

export default function LoreBody({ titleId = 'lore-title' }) {
  return (
    <>
      <div className={styles.hero}>
        <img
          className={styles.mark}
          src="/images/Lore.svg"
          alt=""
          aria-hidden="true"
        />
        <h2 id={titleId} className={styles.title}>Lore Health</h2>
        <div className={styles.meta}>
          {META.map((item) => (
            <div key={item.label} className={styles.metaItem}>
              <p className={styles.metaLabel}>{item.label}</p>
              <p className={styles.metaValue}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className={styles.rule} role="separator" />
        <div className={styles.media}>
          <div className={styles.mediaGlow} aria-hidden="true">
            <div className={styles.glowTrack}>
              <span className={styles.glowMint} />
              <span className={styles.glowSage} />
            </div>
            <div className={`${styles.glowTrack} ${styles.glowTrackAlt}`}>
              <span className={styles.glowRim} />
            </div>
          </div>
          <div className={styles.logoOrb}>
            <img src="/images/Lore.svg" alt="" />
          </div>
        </div>
      </div>

      <section className={styles.split}>
        <div className={styles.splitLead}>
          <p className={styles.splitKicker}>The Mission</p>
          <p className={styles.splitHead}>
            Lore Health’s mission is to build people’s resilience and reasoning capacity through AI-guided conversation — helping users navigate real pressures (work, money, relationships) by strengthening how they think, not by handing them a fixed program.
          </p>
        </div>
        <div className={styles.splitBody}>
          <p>
            Four things I owned: onboarding across channels, explorations and conversations, the design system, and the customer lifetime. The screens themselves are not here. In this industry, they shouldn’t be.
          </p>
        </div>
      </section>

      {LORE_CHAPTERS.map((item) => (
        <div key={item.n}>
          <div className={styles.ruleBlock}><div className={styles.rule} /></div>
          <section className={styles.split}>
            <div className={styles.splitLead}>
              <p className={styles.splitKicker}>{item.n}</p>
              <p className={styles.splitHead}>{item.title}</p>
            </div>
            <div className={styles.splitBody}>
              <p>{item.copy}</p>
            </div>
          </section>
        </div>
      ))}

      <div className={styles.noteWrap}>
        <div className={styles.seal}>
          <div className={styles.chart} aria-hidden="true">
            <div className={styles.chartHead}>
              <span>Session record</span>
              <span>Sealed</span>
            </div>
            <div className={styles.chartRow}>
              <span>Onboarding</span>
              <b />
            </div>
            <div className={styles.chartRow}>
              <span>Exploration</span>
              <b className={styles.chartBarMid} />
            </div>
            <div className={styles.chartRow}>
              <span>Conversation</span>
              <b className={styles.chartBarLong} />
            </div>
            <div className={styles.chartRow}>
              <span>Lifetime</span>
              <b className={styles.chartBarShort} />
            </div>
            <p className={styles.chartFoot}>Redacted for the people it was made for.</p>
          </div>
          <div className={styles.sealCopy}>
            <p className={styles.splitKicker}>Protected</p>
            <p className={styles.noteTitle}>The solutions stay in the room.</p>
            <p className={styles.noteCopy}>
              Lore is a regulated health product. The flows, surfaces, and system I shipped are under NDA, and they sit next to information that is treated like a medical record. I can talk about the problems I owned. I cannot publish the answers.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.more}>
        <p className={styles.moreLabel}>Also check out...</p>
        <div className={styles.moreGrid}>
          {MORE.map((item) => (
            <Link key={item.href} href={item.href} className={styles.moreItem} data-cursor="link">
              <div className={styles.moreImg}>
                <Image
                  src={item.src}
                  alt={item.title}
                  width={1200}
                  height={650}
                  sizes="(max-width: 700px) 100vw, 360px"
                />
              </div>
              <p className={styles.moreTitle}>
                {item.title} <span>• {item.year}</span>
              </p>
              <p className={styles.moreBlurb}>{item.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
