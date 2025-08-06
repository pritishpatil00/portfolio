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

      {/* Navigation Container */}
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
      </div>

    </motion.main>
  )
}