'use client'
import styles from './page.module.scss'
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';  
import { motion } from 'framer-motion';
import useMousePosition from './utils/useMousePosition';
import Image from 'next/image';
import Lenis from 'lenis';
import Link from 'next/link';
import Sandbox from './components/Sandbox';
import About from './components/About';
import HeroGridInvert from './components/HeroGridInvert';
import DesignSliders from './components/DesignSliders';
import BottomBlur from './components/BottomBlur';

export default function Page() {
  return (
    <Suspense fallback={<main className={styles.main} />}>
      <Home />
    </Suspense>
  )
}

function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const skipLoading = searchParams.get('skipLoading') === 'true'

  const [isHovered, setIsHovered] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredRect, setHoveredRect] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({
    '0-role': true, // Role open by default for first case study
    '1-role': true, // Role open by default for second case study
    '2-role': true, // Role open by default for third case study  
    '3-role': true  // Role open by default for fourth case study
  });
  const { x, y } = useMousePosition();
  const [finePointer, setFinePointer] = useState(null);
  const [view, setView] = useState({ w: 1440, h: 900 });
  const [pastHero, setPastHero] = useState(false);
  const [gridOrigin, setGridOrigin] = useState({ c: 0.35, r: 0.78 });
  const isFine = finePointer === true;
  const isTouch = finePointer === false;
  const [onClickable, setOnClickable] = useState(false);
  const cursorSize = onClickable ? 56 : 40;
  const lenisRef = useRef(null)
  const heroTouched = useRef(false)
  const [homeReady, setHomeReady] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      return sessionStorage.getItem('homeScroll') == null
        && !window.location.search.includes('skipLoading=true')
    } catch {
      return true
    }
  })

  const saveHomeScroll = () => {
    const y = lenisRef.current?.scroll ?? window.scrollY
    try {
      sessionStorage.setItem('homeScroll', String(Math.round(y)))
    } catch {}
  }

  const handlePoppinNavigation = (e) => {
    e.preventDefault()
    saveHomeScroll()
    setIsNavigating(true)
    
    // Stop Lenis smooth scroll immediately
    if (lenisRef.current) {
      lenisRef.current.stop()
    }
    
    setTimeout(() => {
      router.push('/poppin')
    }, 400) // Wait for fade out animation
  }

  const handleAllAthleteNavigation = (e) => {
    e.preventDefault()
    saveHomeScroll()
    setIsNavigating(true)
    if (lenisRef.current) {
      lenisRef.current.stop()
    }
    setTimeout(() => {
      router.push('/allathlete')
    }, 520)
  }

  const toggleDropdown = (caseStudyIndex, dropdownType) => {
    const newKey = `${caseStudyIndex}-${dropdownType}`;
    setDropdownStates(prev => {
      const newState = {};
      // Copy existing state for other case studies
      Object.keys(prev).forEach(key => {
        if (!key.startsWith(`${caseStudyIndex}-`)) {
          newState[key] = prev[key];
        }
      });
      
      // If clicking the currently open dropdown, close it
      if (prev[newKey]) {
        newState[newKey] = false;
      } else {
        // Close all dropdowns for this case study and open the clicked one
        Object.keys(prev).forEach(key => {
          if (key.startsWith(`${caseStudyIndex}-`)) {
            newState[key] = false;
          }
        });
        newState[newKey] = true;
      }
      
      return newState;
    });
  };

  const images = [
    '/images/Hazard.png',
    '/images/Crew.png',
    '/images/Noise.png',
    '/images/Arena.png',
    '/images/Learn4Life.png',
    '/images/Trees.png',
    '/images/Gum.png',
    '/images/OG.png',
    '/images/SAATH.png',
    '/images/Subject.png',
    '/images/Atombeam.png',
    '/images/Crowdsurf.png', 
  ];

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

    const lenis = new Lenis()
    lenisRef.current = lenis

    let rafId = 0
    let alive = true
    function raf(time) {
      if (!alive) return
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, []);

  // Decide the intro after mount so server and client HTML match
  useEffect(() => {
    const isInitialEntry = !sessionStorage.getItem('hasVisited')
    sessionStorage.setItem('hasVisited', 'true')

    if (isInitialEntry && !skipLoading) {
      setShowImages(true)
    }

    setIntroReady(true)
  }, [skipLoading]);

  useEffect(() => {
    if (!introReady || showImages) return

    let cancelled = false
    const finish = () => {
      if (!cancelled) setHomeReady(true)
    }

    const hash = window.location.hash.replace('#', '')
    if (hash === 'about' || hash === 'sandbox') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'instant' })
      finish()
      return
    }

    let y = 0
    try {
      const raw = sessionStorage.getItem('homeScroll')
      if (raw != null) {
        y = parseInt(raw, 10)
        sessionStorage.removeItem('homeScroll')
      }
    } catch {}

    const apply = () => {
      if (cancelled) return
      const lenis = lenisRef.current
      lenis?.resize?.()
      if (Number.isFinite(y) && y > 8) {
        lenis?.scrollTo(y, { immediate: true })
        window.scrollTo(0, y)
      } else if (skipLoading) {
        document.getElementById('case-studies')?.scrollIntoView({ behavior: 'instant' })
      }
      requestAnimationFrame(finish)
    }

    const id = requestAnimationFrame(() => requestAnimationFrame(apply))
    return () => {
      cancelled = true
      cancelAnimationFrame(id)
    }
  }, [introReady, showImages, skipLoading]);

  useEffect(() => {
    if (!introReady || showImages) return
    const studies = document.getElementById('case-studies')
    if (!studies) return

    const update = () => {
      const next = studies.getBoundingClientRect().top <= 56
      setPastHero((prev) => (prev === next ? prev : next))
    }
    update()

    const lenis = lenisRef.current
    lenis?.on('scroll', update)
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      lenis?.off('scroll', update)
      window.removeEventListener('scroll', update)
    }
  }, [introReady, showImages]);

  useEffect(() => {
    if (!introReady || showImages || skipLoading) return
    const desktop = window.matchMedia('(min-width: 701px)').matches
    const id = window.setTimeout(() => {
      if (heroTouched.current) return
      setIsHovered(true)
    }, desktop ? 3100 : 2750)

    return () => window.clearTimeout(id)
  }, [introReady, showImages, skipLoading]);

  useEffect(() => {
    if (!introReady || showImages) return
    lenisRef.current?.resize?.()
  }, [introReady, showImages]);


  useEffect(() => {
    if (showImages && currentImageIndex < images.length) {
      const timer = setTimeout(() => {
        setCurrentImageIndex(prev => prev + 1);
      }, 150); // Fast transition between images
      return () => clearTimeout(timer);
    } else if (currentImageIndex >= images.length) {
      const timer = setTimeout(() => {
        setShowImages(false);
      }, 400); // Brief pause before showing landing page
      return () => clearTimeout(timer);
    }
  }, [currentImageIndex, showImages, images.length]);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const syncPointer = () => setFinePointer(mq.matches)
    const syncView = () => setView({ w: window.innerWidth, h: window.innerHeight })
    syncPointer()
    syncView()
    mq.addEventListener('change', syncPointer)
    window.addEventListener('resize', syncView)
    return () => {
      mq.removeEventListener('change', syncPointer)
      window.removeEventListener('resize', syncView)
    }
  }, [])

  useEffect(() => {
    if (x == null || y == null) {
      setOnClickable(false)
      return
    }

    const el = document.elementFromPoint(x - window.scrollX, y - window.scrollY)
    if (!el) {
      setOnClickable(false)
      return
    }

    const hit = el.closest(
      'a, button, [role="button"], header p, [class*="dropdownRow"], [class*="hit"]'
    )
    setOnClickable(Boolean(hit))
  }, [x, y]);

  const loadingDurationMs = images.length * 150 + 200;

  if (!introReady) {
    return <main className={styles.main} />;
  }

  if (showImages) {
    return (
      <main className={styles.main}>
        {currentImageIndex > 0 && (
          <div
            key={currentImageIndex - 1}
            className={styles.imageContainer}
          >
              <Image
                src={images[currentImageIndex - 1]}
                alt={`Design work ${currentImageIndex}`}
                fill
                sizes="(max-width: 900px) 84vw, min(90vw, 50vh)"
                style={{ objectFit: 'contain' }}
                quality={75}
                priority={currentImageIndex <= 5}
              />
          </div>
        )}
        <div className={styles.loadingBarContainer}>
          <div
            className={styles.loadingBar}
            style={{ animationDuration: `${loadingDurationMs}ms` }}
          />
        </div>
      </main>
    );
  }

  return (
    <motion.main 
      className={`${styles.main} ${y != null && y >= window.innerHeight ? styles.hideNativeCursor : ''}`}
      initial={false}
      animate={{ opacity: isNavigating || !homeReady ? 0 : 1 }}
      transition={{ duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.header 
        className={`${styles.stickyHeader} ${(isTouch || isFine) && isHovered && !pastHero ? styles.stickyHeaderInverted : ''}`}
      >
        <div className={styles.headerName}>
          <p onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>PRITISH PATIL</p>
        </div>
        <nav 
          className={styles.headerNav}
        >
          <p onClick={() => document.getElementById('case-studies').scrollIntoView({ behavior: 'smooth' })}>CASE STUDIES</p>
          <p onClick={() => document.getElementById('sandbox').scrollIntoView({ behavior: 'smooth' })}>SANDBOX</p>
          <p onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>ABOUT</p>
        </nav>
      </motion.header>
      {isFine && x != null && y != null && (
        <motion.div
          className={`${styles.pageCursor} ${onClickable ? styles.pageCursorOn : ''}`}
          animate={{
            x: x - window.scrollX - cursorSize / 2,
            y: y - window.scrollY - cursorSize / 2,
            width: cursorSize,
            height: cursorSize,
            opacity: y < window.innerHeight ? 0 : 1,
          }}
          transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
        />
      )}
      <div className={styles.body}>
        <div
          className={styles.heroSection}
          onClick={(e) => {
            heroTouched.current = true
            const rect = e.currentTarget.getBoundingClientRect()
            setGridOrigin({
              c: (e.clientX - rect.left) / rect.width,
              r: (e.clientY - rect.top) / rect.height,
            })
            setIsHovered((open) => !open)
          }}
          role="button"
          aria-label={isHovered ? 'Hide headline' : 'Reveal headline'}
        >
          <HeroGridInvert open={isHovered} origin={gridOrigin} />
          <div className={styles.heroHit}>
            <div className={styles.wordContainer}>
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.8 }}
                className={styles.wordInner}
              >PRITISH</motion.p>
            </div>
            <div className={styles.wordContainer}>
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.95 }}
                className={styles.wordInner}
              ><span>PATIL</span></motion.p>
            </div>
            <div className={styles.heroMeta}>
            <div className={styles.heroSkillsWrap}>
              <motion.p
                className={`${styles.heroSkills} ${styles.wordInner}`}
                initial={isFine ? { y: '100%', opacity: 0 } : { y: '100%' }}
                animate={isFine ? { y: '0%', opacity: 1 } : { y: '0%' }}
                transition={isFine
                  ? { duration: 1.15, ease: [0.16, 1, 0.3, 1], delay: 1.22 }
                  : { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.1 }
                }
              >
                Design engineer. Product, interaction, and the interface.
              </motion.p>
            </div>
            <motion.span
              className={styles.heroSignifier}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 2 }}
            />
            </div>
          </div>
        </div>
      </div>

      <div id="case-studies" className={styles.caseStudiesContainer}>
        <div className={styles.caseStudy}>
          <div className={styles.caseStudyContent}>
            <p className={styles.caseStudyYear}>2022</p>
            <h3 className={styles.caseStudyTitle}>AllAthlete</h3>
            <p className={styles.caseStudyDescription}>
              As the first product designer on the product team, my job was 
              <br /><br />
              Participated in PearX's S'23 accelerator and raised a $2,000,000+ seed round backed by 1984Ventures, ProgressionFund, and Liquid2.
            </p>
            
            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(0, 'role')}>
                <span className={styles.dropdownLabel}>Role</span>
                <div className={styles.dropdownIcon}>
                  {dropdownStates['0-role'] ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={`${styles.dropdownContent} ${dropdownStates['0-role'] ? styles.open : ''}`}>
                Product Designer I
              </div>
            </div>

            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(0, 'contributions')}>
                <span className={styles.dropdownLabel}>Contributions</span>
                <div className={styles.dropdownIcon}>
                  {dropdownStates['0-contributions'] ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={`${styles.dropdownContent} ${dropdownStates['0-contributions'] ? `${styles.open} ${styles.contributionsDropdown}` : ''}`}>
                <ul className={styles.contributionsList}>
                  <li>Design System</li>
                  <li>User Research</li>
                  <li>UX/UI Design</li>
                  <li>Usability Testing</li>
                </ul>
              </div>
            </div>

            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(0, 'timeline')}>
                <span className={styles.dropdownLabel}>Outcomes</span>
                <div className={styles.dropdownIcon}>
                  {dropdownStates['0-timeline'] ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={`${styles.dropdownContent} ${dropdownStates['0-timeline'] ? styles.open : ''}`}>
              <ul className={styles.contributionsList}>
                  <li>300,000+ Users</li>
                  <li>10,000+ College Visits Created</li>
                  <li>8,000+ Offers Created</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.caseStudyImageContainer}>
            <Link href="/allathlete" onClick={handleAllAthleteNavigation}>
              <Image
                src="/images/AllAthleteMockup.jpg"
                alt="Case Study"
                width={1600}
                height={900}
                className={styles.caseStudyImage}
                style={{ cursor: 'pointer' }}
                sizes="(max-width: 900px) 100vw, 75vw"
                quality={80}
                priority
              />
            </Link>
          </div>
        </div>
      </div>
      
        <div className={styles.caseStudy}>
          <div className={styles.caseStudyContent}>
            <p className={styles.caseStudyYear}>2025</p>
            <h3 className={styles.caseStudyTitle}>Crowdsurf</h3>
            <p className={styles.caseStudyDescription}>
              A social music discovery concept app created to transform isolated music listening into a shared social experience. 
              <br /><br />
              Backed by iHeartRadio.
            </p>
            
            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(1, 'role')}>
                <span className={styles.dropdownLabel}>Role</span>
                <div className={styles.dropdownIcon}>
                  {dropdownStates['1-role'] ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={`${styles.dropdownContent} ${dropdownStates['1-role'] ? styles.open : ''}`}>
                Founder and Product Lead
              </div>
            </div>

            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(1, 'contributions')}>
                <span className={styles.dropdownLabel}>Contributions</span>
                <div className={styles.dropdownIcon}>
                  {dropdownStates['1-contributions'] ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={`${styles.dropdownContent} ${dropdownStates['1-contributions'] ? `${styles.open} ${styles.contributionsDropdown}` : ''}`}>
                <ul className={styles.contributionsList}>
                  <li>User Research</li>
                  <li>UX/UI Design</li>
                  <li>Product Strategy</li>
                  <li>Front End Development</li>
                  <li>Usability Testing</li>
                </ul>
              </div>
            </div>

            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(1, 'timeline')}>
                <span className={styles.dropdownLabel}>Outcomes</span>
                <div className={styles.dropdownIcon}>
                  {dropdownStates['1-timeline'] ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={`${styles.dropdownContent} ${dropdownStates['1-timeline'] ? styles.open : ''}`}>
                This project is ongoing
              </div>
            </div>
          </div>
          <div className={styles.caseStudyImageContainer}>
            <Image
              src="/images/CrowdSurfMockupTwo.jpg"
              alt="Poppin Case Study"
              width={1600}
              height={900}
              className={styles.caseStudyImage}
              sizes="(max-width: 900px) 100vw, 75vw"
              quality={80}
            />
          </div>
        </div>

        <div className={styles.caseStudy}>
          <div className={styles.caseStudyContent}>
            <p className={styles.caseStudyYear}>2024</p>
            <h3 className={styles.caseStudyTitle}>Crew</h3>
            <p className={styles.caseStudyDescription}>
              A photo messaging platform for groups designed to foster habitual daily interactions.
              <br /><br />
              Backed by Unshackled Ventures.
            </p>
            
            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(2, 'role')}>
                <span className={styles.dropdownLabel}>Role</span>
                <div className={styles.dropdownIcon}>
                  {dropdownStates['2-role'] ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={`${styles.dropdownContent} ${dropdownStates['2-role'] ? styles.open : ''}`}>
                Founding Designer
              </div>
            </div>

            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(2, 'contributions')}>
                <span className={styles.dropdownLabel}>Contributions</span>
                <div className={styles.dropdownIcon}>
                  {dropdownStates['2-contributions'] ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={`${styles.dropdownContent} ${dropdownStates['2-contributions'] ? `${styles.open} ${styles.contributionsDropdown}` : ''}`}>
                <ul className={styles.contributionsList}>
                  <li>User Research</li>
                  <li>UX/UI Design</li>
                  <li>Visual Design</li>
                  <li>Design Systems</li>
                  <li>Usability Testing</li>
                </ul>
              </div>
            </div>

            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(2, 'timeline')}>
                <span className={styles.dropdownLabel}>Outcomes</span>
                <div className={styles.dropdownIcon}>
                  {dropdownStates['2-timeline'] ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={`${styles.dropdownContent} ${dropdownStates['2-timeline'] ? styles.open : ''}`}>
                <ul className={styles.contributionsList}>
                  <li>300,000+ photos and videos sent</li>
                  <li>2500+ users</li>
                  <li>Sub 2 second photo + video sending</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.caseStudyImageContainer}>
            <Image
              src="/images/CrewMockupFinal.jpg"
              alt="Case Study"
              width={1600}
              height={900}
              className={styles.caseStudyImage}
              sizes="(max-width: 900px) 100vw, 75vw"
              quality={80}
            />
          </div>
        </div>

        <div className={styles.caseStudy}>
          <div className={styles.caseStudyContent}>
            <p className={styles.caseStudyYear}>2023</p>
            <h3 className={styles.caseStudyTitle}>Poppin</h3>
            <p className={styles.caseStudyDescription}>
              A hyperlocal ticketing marketplace enabling social event discovery. I led the 0→1 design and conceptualization from MVP to v3. Managed a team of four designers.
              <br /><br />
              Participated in PearX's S'23 accelerator and raised a $2,000,000+ seed round backed by 1984Ventures, ProgressionFund, and Liquid2.
            </p>
            
            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(3, 'role')}>
                <span className={styles.dropdownLabel}>Role</span>
                <div className={styles.dropdownIcon}>
                  {dropdownStates['3-role'] ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={`${styles.dropdownContent} ${dropdownStates['3-role'] ? styles.open : ''}`}>
                Founding Designer and Product Lead
              </div>
            </div>

            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(3, 'contributions')}>
                <span className={styles.dropdownLabel}>Contributions</span>
                <div className={styles.dropdownIcon}>
                  {dropdownStates['3-contributions'] ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={`${styles.dropdownContent} ${dropdownStates['3-contributions'] ? `${styles.open} ${styles.contributionsDropdown}` : ''}`}>
                <ul className={styles.contributionsList}>
                  <li>User Research</li>
                  <li>UX/UI Design</li>
                  <li>Visual Design</li>
                  <li>Engineer Collaboration</li>
                  <li>Front End Development</li>
                </ul>
              </div>
            </div>

            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(3, 'timeline')}>
                <span className={styles.dropdownLabel}>Outcomes</span>
                <div className={styles.dropdownIcon}>
                  {dropdownStates['3-timeline'] ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3V13M3 8H13" stroke="#ffffff" strokeWidth="1"/>
                    </svg>
                  )}
                </div>
              </div>
              <div className={`${styles.dropdownContent} ${dropdownStates['3-timeline'] ? styles.open : ''}`}>
                <ul className={styles.contributionsList}>
                  <li>$2,000,000+ GMV</li>
                  <li>75,000+ Users</li>
                  <li>60% Weekly Retention</li>
                  <li>Seed Round</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.caseStudyImageContainer}>
            <Link href="/poppin" onClick={handlePoppinNavigation}>
              <Image
                src="/images/PoppinMockupTwo.jpg"
                alt="Case Study"
                width={1600}
                height={900}
                className={styles.caseStudyImage}
                style={{ cursor: 'pointer' }}
                sizes="(max-width: 900px) 100vw, 75vw"
                quality={80}
              />
            </Link>
          </div>
        </div>

      <DesignSliders />
      <Sandbox />
      <About />
      <BottomBlur />

    </motion.main>
  )
}