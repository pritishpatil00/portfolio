'use client'
import styles from './page.module.scss'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

export default function PoppinCaseStudy() {
  const router = useRouter()
  const [isSticky, setIsSticky] = useState(false)
  const menuRef = useRef(null)
  const containerRef = useRef(null)

  // Ensure page always loads at the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Handle sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      if (menuRef.current) {
        const menuTop = containerRef.current?.offsetTop || 0
        const scrollY = window.scrollY
        setIsSticky(scrollY > menuTop - 80)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
      <div className={styles.heroContent}>
        <p className={styles.projectYear}>POPPIN</p>
        <h1 className={styles.projectTitle}>Event discovery and ticketing for hyperlocal university networks</h1>
        <div className={styles.divider}></div>
        <div className={styles.infoRow}>
          <span className={styles.leftText}>User Research, UX/UI Design, Visual Design, Product Strategy</span>
          <span className={styles.rightText}>2023</span>
        </div>
      </div>
      
      {/* Full Width Hero Image */}
      <div className={styles.heroImageContainer}>
        <Image
          src="/images/PoppinMockupTwo.png"
          alt="Poppin Hero"
          width={1920}
          height={1080}
          className={styles.heroImage}
        />
      </div>

      {/* Navigation and Content Container */}
      <div ref={containerRef} className={styles.navigationContainer}>
        <div 
          ref={menuRef}
          className={`${styles.navigationMenu} ${isSticky ? styles.navigationMenuSticky : ''}`}
        >
          <p>INTRODUCTION</p>
          <p>CONTEXT</p>
          <p>PROBLEM</p>
          <p>RESEARCH</p>
          <p>SOLUTION</p>
          <p>DESIGN</p>
          <p>RESULTS</p>
        </div>
        
        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>INTRODUCTION</h2>
          <h3 className={styles.companyName}>Poppin</h3>
          <p className={styles.descriptionParagraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
          </p>
          <div className={styles.contentDivider}></div>
          <p className={styles.secondParagraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <div className={styles.contentDividerTwo}></div>
          <div className={styles.yearRow}>
            <span className={styles.yearLabel}>YEAR</span>
            <span className={styles.yearValue}>2023</span>
          </div>
          <div className={styles.contentDividerTwo}></div>
          <div className={styles.yearRow}>
            <span className={styles.yearLabel}>Role</span>
            <span className={styles.yearValue}>FOUNDING DESIGNER</span>
          </div>
          <div className={styles.contentDividerTwo}></div>
          <div className={styles.yearRow}>
            <span className={styles.yearLabel}>TEAM</span>
            <div className={styles.verticalRows}>
              <span className={styles.yearValue}>FOUNDING DESIGNER</span>
              <span className={styles.yearValue}>FOUNDING DESIGNER</span>
              <span className={styles.yearValue}>FOUNDING DESIGNER</span>
              <span className={styles.yearValue}>FOUNDING DESIGNER</span>
            </div>
          </div>
          <div className={styles.contentDividerTwo}></div>
        </div>
      </div>

    </motion.main>
  )
}