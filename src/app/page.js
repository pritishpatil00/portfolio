'use client'
import styles from './page.module.scss'
import { useState, useEffect, useRef } from 'react';  
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from 'framer-motion';
import useMousePosition from './utils/useMousePosition';
import Image from 'next/image';
import Lenis from 'lenis';

export default function Home() {

  const [isHovered, setIsHovered] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [showImages, setShowImages] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [hoveredRect, setHoveredRect] = useState(null);
  const [dropdownStates, setDropdownStates] = useState({
    '0-role': true, // Role open by default for first case study
    '1-role': true, // Role open by default for second case study
    '2-role': true, // Role open by default for third case study  
    '3-role': true  // Role open by default for fourth case study
  });
  const { x, y } = useMousePosition();
  const size = isHovered ? 580 : isMenuHovered ? 240 : 40;

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

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, []);

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

  // Natural loading animation - starts slow, speeds up
  useEffect(() => {
    if (showImages) {
      const totalTime = images.length * 150 + 200; // Total sequence time
      const startTime = Date.now();
      
      const animateProgress = () => {
        const elapsed = Date.now() - startTime;
        const timeRatio = Math.min(elapsed / totalTime, 1);
        
        // Ease-in-out curve for natural loading feel
        const progress = timeRatio < 0.5 
          ? 2 * timeRatio * timeRatio 
          : 1 - Math.pow(-2 * timeRatio + 2, 3) / 2;
        
        setLoadingProgress(progress * 100);
        
        if (timeRatio < 1) {
          requestAnimationFrame(animateProgress);
        }
      };
      
      requestAnimationFrame(animateProgress);
    }
  }, [showImages, images.length]);

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
                width={0}
                height={0}
                sizes="100vh"
                style={{ 
                  width: 'auto',
                  height: '100%',
                  objectFit: 'contain'
                }}
                priority={currentImageIndex <= 5}
              />
          </div>
        )}
        <div className={styles.loadingBarContainer}>
          <div 
            className={styles.loadingBar}
            style={{ 
              width: `${loadingProgress}%`
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <motion.header 
        className={styles.stickyHeader}
      >
        <div className={styles.headerName}>
          <p onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>PRITISH PATIL</p>
        </div>
        <nav 
          className={styles.headerNav}
        >
          <p onClick={() => document.getElementById('case-studies').scrollIntoView({ behavior: 'smooth' })}>CASE STUDIES</p>
          <p>SANDBOX</p>
          <p>ABOUT</p>
        </nav>
      </motion.header>
      <motion.div 
        className={styles.mask}
        animate={{
          WebkitMaskPosition: `${x - (size/2)}px ${y - (size/2)}px`,
          WebkitMaskSize: `${size}px`,
        }}
        transition={{ type: "tween", ease: "backOut", duration:0.5}}
      >
        <div className={styles.heroSection}>
          <div onMouseEnter={() => {setIsHovered(true)}} onMouseLeave={() => {setIsHovered(false)}}>
            <div className={styles.content}>
              <div className={styles.wordContainer}>
                <motion.p
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.8 }}
                  className={styles.wordInner}
                >GREAT</motion.p>
              </div>
              <div className={styles.wordContainer}>
                <motion.p
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.95 }}
                  className={styles.wordInner}
                >DESIGN</motion.p>
              </div>
              <div className={styles.wordContainer}>
                <motion.p
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.1 }}
                  className={styles.wordInner}
                >IS</motion.p>
              </div>
              <div className={styles.wordContainer}>
                <motion.p
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.25 }}
                  className={styles.wordInner}
                >INVISIBLE</motion.p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className={styles.body}>
        <div className={styles.heroSection}>
          <div className={styles.content}>
            <div className={styles.wordContainer}>
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.8 }}
                className={styles.wordInner}
              >GOOD</motion.p>
            </div>
            <div className={styles.wordContainer}>
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.95 }}
                className={styles.wordInner}
              ><span>DESIGN</span></motion.p>
            </div>
            <div className={styles.wordContainer}>
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.1 }}
                className={styles.wordInner}
              >IS</motion.p>
            </div>
            <div className={styles.wordContainer}>
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.25 }}
                className={styles.wordInner}
              >SIMPLE</motion.p>
            </div>
          </div>
        </div>
      </div>

      <div id="case-studies" className={styles.caseStudiesContainer}>
        <div className={styles.caseStudy}>
          <div className={styles.caseStudyContent}>
            <p className={styles.caseStudyYear}>2023</p>
            <h3 className={styles.caseStudyTitle}>Poppin</h3>
            <p className={styles.caseStudyDescription}>
            I led the end to end design of an interactive web tool that aims to visualize the lunar orbital regions in space. 

            I lead the 0→1 conceptualization and designs, along with leading two ideation workshops, four user interviews, stakeholder presentations, and five shipped features in collaboration with fellow student engineers.            
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
                Lead Product Designer
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
                  <li>UX/UI Design</li>
                  <li>User Interviews</li>
                  <li>Contextual Inquiry</li>
                  <li>Usability Testing</li>
                  <li>Product Management</li>
                  <li>Front-End Development</li>
                </ul>
              </div>
            </div>

            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(0, 'timeline')}>
                <span className={styles.dropdownLabel}>Timeline</span>
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
                6 months (Jan 2024 - Jun 2024)
              </div>
            </div>
          </div>
          <div className={styles.caseStudyImageContainer}>
            <Image
              src="/images/PoppinMockupTwo.png"
              alt="Poppin Case Study"
              width={1600}
              height={900}
              className={styles.caseStudyImage}
            />
          </div>
        </div>

        <div className={styles.caseStudy}>
          <div className={styles.caseStudyContent}>
            <p className={styles.caseStudyYear}>2023</p>
            <h3 className={styles.caseStudyTitle}>AllAthlete</h3>
            <p className={styles.caseStudyDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
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
                Product Designer
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
                  <li>Wireframing</li>
                  <li>Prototyping</li>
                  <li>Visual Design</li>
                  <li>User Testing</li>
                </ul>
              </div>
            </div>

            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(1, 'timeline')}>
                <span className={styles.dropdownLabel}>Timeline</span>
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
                4 months (Mar 2023 - Jun 2023)
              </div>
            </div>
          </div>
          <div className={styles.caseStudyImageContainer}>
            <Image
              src="/images/AllAthleteMockup.png"
              alt="Case Study"
              width={1600}
              height={900}
              className={styles.caseStudyImage}
            />
          </div>
        </div>

        <div className={styles.caseStudy}>
          <div className={styles.caseStudyContent}>
            <p className={styles.caseStudyYear}>2025</p>
            <h3 className={styles.caseStudyTitle}>Crowdsurf</h3>
            <p className={styles.caseStudyDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
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
                Co-Founder & Lead Designer
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
                  <li>Product Strategy</li>
                  <li>Brand Design</li>
                  <li>Mobile App Design</li>
                  <li>Investor Presentations</li>
                  <li>Team Leadership</li>
                </ul>
              </div>
            </div>

            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(2, 'timeline')}>
                <span className={styles.dropdownLabel}>Timeline</span>
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
                8 months (Jan 2022 - Aug 2022)
              </div>
            </div>
          </div>
          <div className={styles.caseStudyImageContainer}>
            <Image
              src="/images/CrowdsurfMockupTwo.png"
              alt="Case Study"
              width={1600}
              height={900}
              className={styles.caseStudyImage}
            />
          </div>
        </div>

        <div className={styles.caseStudy}>
          <div className={styles.caseStudyContent}>
            <p className={styles.caseStudyYear}>2021</p>
            <h3 className={styles.caseStudyTitle}>Crowdsurf</h3>
            <p className={styles.caseStudyDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
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
                Founder & CEO
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
                  <li>Business Strategy</li>
                  <li>Pitch Deck Design</li>
                  <li>Product Vision</li>
                  <li>Investor Relations</li>
                  <li>Market Research</li>
                </ul>
              </div>
            </div>

            <div className={styles.dropdownSection}>
              <div className={styles.dropdownRow} onClick={() => toggleDropdown(3, 'timeline')}>
                <span className={styles.dropdownLabel}>Timeline</span>
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
                5 months (Sep 2021 - Jan 2022)
              </div>
            </div>
          </div>
          <div className={styles.caseStudyImageContainer}>
            <Image
              src="/images/CrowdsurfMockupTwo.png"
              alt="Case Study"
              width={1600}
              height={900}
              className={styles.caseStudyImage}
            />
          </div>
        </div>
      </div>
      
      <div style={{ height: '30vh' }}/>
      <Slider src="/images/CapsuleOne.png" left="-155%" progress={scrollYProgress} text="Product Design"/>
      <Slider src="/images/CapsuleOne.png" left="-125%" progress={scrollYProgress} reverse={true} text="Interaction Design"/>
      <Slider src="/images/CapsuleOne.png" left="-160%" progress={scrollYProgress} text="Visual Design"/>
      <div style={{ height: '200vh' }} />


    </main>
  )
}

const Slider = ({src, left, progress, reverse = false, text}) => {
  const x = useTransform(progress, [0, 1], reverse ? [750, -750] : [-750, 750]);
  
  return (
    <motion.div className={styles.slider} style={{left: left, x}}>
      <Phrase src={src} text={text}/>
      <Phrase src={src} text={text}/>
      <Phrase src={src} text={text}/>
      <Phrase src={src} text={text}/>
      <Phrase src={src} text={text}/>
    </motion.div>
  )
}

const Phrase = ({src, text}) => {
  return (
    <div className={styles.phrase}>
      <p className={styles.phraseText}>{text}</p>
      <span className={styles.phraseImage}>
        <Image
          style={{objectFit: "cover"}}
          src={src}
          alt="image"
          fill
        />
      </span>
    </div>
  )
}