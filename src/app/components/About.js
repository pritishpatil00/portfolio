'use client'
import styles from './About.module.scss'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

const PHOTOS = [
  {
    src: '/images/about/polson.jpg',
    title: 'Polson Pier',
    place: 'Toronto, Canada',
    x: -18,
    y: -8,
    rotate: -9,
    z: 2,
  },
  {
    src: '/images/about/cows-p.jpg',
    title: 'Cows',
    place: 'Cornwall Park, Auckland, NZ',
    x: 16,
    y: -14,
    rotate: 7,
    z: 3,
  },
  {
    src: '/images/about/patagonia.jpg',
    title: 'Patagonia',
    place: 'El Calafate, Argentina',
    x: -8,
    y: 16,
    rotate: 5,
    z: 1,
  },
  {
    src: '/images/about/ucla.jpg',
    title: 'UCLA',
    place: 'Los Angeles, California',
    x: 22,
    y: 14,
    rotate: -4,
    z: 4,
  },
  {
    src: '/images/about/london.jpg',
    title: 'London',
    place: 'Kings Cross, United Kingdom',
    x: -26,
    y: 4,
    rotate: 8,
    z: 5,
  },
  {
    src: '/images/about/boat-p.jpg',
    title: 'Boat',
    place: 'Lake Union, Seattle WA',
    x: 6,
    y: -22,
    rotate: -7,
    z: 6,
  },
]

const PRINCIPLES = [
  'Product Strategy',
  'Information Architecture',
  'User Research',
  'UX Design',
  'Product Management',
  'Visual Design',
  'Interaction Design',
  'Design Systems',
  'Rapid Prototyping',
]

const TOOLS = [
  'Figma',
  'SwiftUI',
  'React',
  'TypeScript',
  'HTML/CSS',
  'Interaction Development',
  'Mixpanel',
  'Linear',
  'Adobe CC',
  'ProtoPie',
  'Origami Studio',
  'Spline',
  'Play',
]

const EXPERIENCE = [
  {
    company: 'Lore Health',
    role: 'Design Engineer',
    dates: 'Sep 2025 — Present',
    place: 'Los Angeles',
  },
  {
    company: 'Crew',
    role: 'Design Engineer',
    dates: 'Jun 2024 — Sep 2025',
    place: 'Los Angeles',
  },
  {
    company: 'Poppin',
    role: 'Product Designer',
    dates: 'Jun 2023 — Jun 2024',
    place: 'Palo Alto',
    href: '/poppin',
  },
  {
    company: 'AllAthlete',
    role: 'Product Designer',
    dates: 'Jun 2022 — Jun 2023',
    place: 'Los Angeles',
    href: '/allathlete',
  },
]

function PhotoCard({ photo, index, mx, my, hovered, setHovered }) {
  const x = useTransform(mx, (v) => v * (36 + index * 20))
  const y = useTransform(my, (v) => v * (24 + index * 16))
  const isHot = hovered === index

  return (
    <motion.figure
      className={styles.card}
      style={{
        x,
        y,
        left: `calc(50% + ${photo.x}%)`,
        top: `calc(50% + ${photo.y}%)`,
        rotate: photo.rotate,
        zIndex: isHot ? 20 : photo.z,
      }}
      whileHover={{ scale: 1.07, rotate: 0, zIndex: 20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
    >
      <div className={styles.cardFrame}>
        <Image
          src={photo.src}
          alt={`${photo.title}, ${photo.place}`}
          width={720}
          height={900}
          className={styles.cardImage}
          sizes="(max-width: 700px) 70vw, 360px"
          quality={80}
        />
        <figcaption className={`${styles.cardCaption} ${isHot ? styles.cardCaptionOn : ''}`}>
          <span>{photo.title}</span>
          <span>{photo.place}</span>
        </figcaption>
      </div>
    </motion.figure>
  )
}

export default function About() {
  const stageRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 90, damping: 18, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 90, damping: 18, mass: 0.5 })
  const [hovered, setHovered] = useState(null)

  const handleMove = (e) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(null)
  }

  return (
    <section id="about" className={styles.about}>
      <div className={`${styles.section} ${styles.hero}`}>
        <div className={styles.inner}>
          <p className={styles.kicker}>About</p>
          <p className={styles.lead}>
            Product designer originally from Ann Arbor, currently in Southern California.
          </p>
          <div className={styles.heroCopy}>
            <p className={styles.body}>
              I care about design, psychology, and technology, and the ways they lock together into experiences that actually hit a goal.
            </p>
            <p className={styles.body}>
              Driven by high impact work. I like running cross functional teams, setting product strategy, and shipping the interface myself.
            </p>
            <p className={styles.body}>
              Off hours: Smash Ultimate brackets, skating a new neighborhood, or Chelsea F.C.
            </p>
            <p className={styles.buildLine}>
              <span>Build</span>
              HTML/CSS · SwiftUI · React · TypeScript · Interaction Development
            </p>
          </div>
        </div>
      </div>

      <div className={styles.photoSection}>
        <div
          ref={stageRef}
          className={styles.stage}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          {PHOTOS.map((photo, i) => (
            <PhotoCard
              key={photo.title}
              photo={photo}
              index={i}
              mx={springX}
              my={springY}
              hovered={hovered}
              setHovered={setHovered}
            />
          ))}
        </div>
        <p className={styles.photoHint}>Move around — photos from places that stuck</p>
      </div>

      <div className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.heading}>Experience</h2>
          <div className={styles.list}>
            {EXPERIENCE.map((job) => {
              const title = (
                <span className={styles.jobCompany}>{job.company}</span>
              )
              return (
                <div key={job.company} className={styles.row}>
                  <span className={styles.rowLabel}>{job.dates}</span>
                  <div className={styles.rowBody}>
                    {job.href ? <Link href={job.href}>{title}</Link> : title}
                    <span className={styles.rowMeta}>{job.role}</span>
                    <span className={styles.rowMeta}>{job.place}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.heading}>Education</h2>
          <div className={styles.list}>
            <div className={styles.row}>
              <span className={styles.rowLabel}>2018 — 2022</span>
              <div className={styles.rowBody}>
                <span className={styles.jobCompany}>UCLA</span>
                <span className={styles.rowMeta}>B.S. Cognitive Science, Computing</span>
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>2018</span>
              <div className={styles.rowBody}>
                <span className={styles.jobCompany}>Michigan Academy of Emergency Services</span>
                <span className={styles.rowMeta}>EMT-Basic</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.marqueeSection} aria-hidden="true">
        <div className={styles.marquee}>
          <div className={styles.marqueeTrack}>
            {[...PRINCIPLES, ...PRINCIPLES].map((item, i) => (
              <span key={`${item}-${i}`}>{item}</span>
            ))}
          </div>
        </div>
        <div className={`${styles.marquee} ${styles.marqueeReverse}`}>
          <div className={styles.marqueeTrack}>
            {[...TOOLS, ...TOOLS].map((item, i) => (
              <span key={`${item}-${i}`}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.inner}>
          <h2 className={styles.heading}>Now</h2>
          <div className={styles.nowGrid}>
            <div className={styles.nowCol}>
              <p className={styles.nowLabel}>Currently reading</p>
              <a href="https://andrewchen.com/wp-content/uploads/2022/01/ColdStartProb_9780062969743_AS0928_cc20_Final.pdf" target="_blank" rel="noreferrer">The Cold Start Problem</a>
              <a href="https://www.amazon.com/Articulating-Design-Decisions-Communicate-Stakeholders-ebook/dp/B08FVV7PDN" target="_blank" rel="noreferrer">Articulating Design Decisions</a>
              <a href="https://readings.design/PDF/thinkingwithtype_ellenlupton.pdf" target="_blank" rel="noreferrer">Thinking with Type</a>
            </div>
            <div className={styles.nowCol}>
              <p className={styles.nowLabel}>Contact</p>
              <a href="https://www.linkedin.com/in/pritish-patil/" target="_blank" rel="noreferrer">LinkedIn</a>
              <span>Email</span>
              <span>Instagram</span>
            </div>
            <div className={styles.nowCol}>
              <p className={styles.nowLabel}>What I’m up to</p>
              <span>Learning pickleball</span>
              <span>Supporting Chelsea F.C.</span>
              <span>Practicing Carrom</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
