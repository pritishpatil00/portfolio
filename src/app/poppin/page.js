'use client'
import styles from './page.module.scss'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PoppinCaseStudy() {
  const router = useRouter()

  // Ensure page always loads at the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleCaseStudiesClick = () => {
    router.push('/?skipLoading=true')
  }

  return (
    <motion.main 
      className={styles.main}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Header */}
      <motion.header className={styles.stickyHeader}>
        <div className={styles.headerName}>
          <Link href="/">
            <p>PRITISH PATIL</p>
          </Link>
        </div>
        <nav className={styles.headerNav}>
          <p onClick={handleCaseStudiesClick}>CASE STUDIES</p>
          <p>SANDBOX</p>
          <p>ABOUT</p>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <p className={styles.projectYear}>2023</p>
          <h1 className={styles.projectTitle}>Poppin</h1>
          <p className={styles.projectSubtitle}>
            A hyperlocal ticketing marketplace enabling social event discovery
          </p>
        </div>
      </div>

      {/* Project Overview */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.overviewGrid}>
            <div className={styles.overviewText}>
              <h2>Overview</h2>
              <p>
                Poppin was a hyperlocal ticketing marketplace that enabled social event discovery. 
                I led the 0→1 design and conceptualization from MVP to v3, managing a team of four designers.
              </p>
              <p>
                We participated in PearX's S'23 accelerator and raised a $2,000,000+ seed round 
                backed by 1984Ventures, ProgressionFund, and Liquid2.
              </p>
            </div>
            <div className={styles.overviewDetails}>
              <div className={styles.detailItem}>
                <h4>Role</h4>
                <p>Founding Designer and Product Lead</p>
              </div>
              <div className={styles.detailItem}>
                <h4>Team</h4>
                <p>4 Designers, 6 Engineers</p>
              </div>
              <div className={styles.detailItem}>
                <h4>Timeline</h4>
                <p>18 months</p>
              </div>
              <div className={styles.detailItem}>
                <h4>Platform</h4>
                <p>iOS, Android, Web</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className={styles.imageSection}>
        <div className={styles.heroImage}>
          <Image
            src="/images/PoppinMockupTwo.png"
            alt="Poppin App Interface"
            width={1600}
            height={900}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </section>

      {/* Problem Statement */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>The Problem</h2>
          <p className={styles.largeText}>
            Event discovery was fragmented across multiple platforms, making it difficult for users 
            to find relevant local events and for event organizers to reach their target audience effectively.
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>The Solution</h2>
          <p className={styles.largeText}>
            We created a unified platform that combined event discovery, social features, and seamless 
            ticketing to help users find and attend events with their friends.
          </p>
        </div>
      </section>

      {/* Results */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Results</h2>
          <div className={styles.resultsGrid}>
            <div className={styles.resultItem}>
              <h3>$2M+</h3>
              <p>Gross Merchandise Value</p>
            </div>
            <div className={styles.resultItem}>
              <h3>75,000+</h3>
              <p>Total Users</p>
            </div>
            <div className={styles.resultItem}>
              <h3>60%</h3>
              <p>Weekly Retention</p>
            </div>
            <div className={styles.resultItem}>
              <h3>Seed Round</h3>
              <p>Successfully Raised</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div style={{ height: '10vh' }} />
    </motion.main>
  )
}