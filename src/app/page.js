'use client'
import styles from './page.module.scss'
import { useState, useEffect } from 'react';  
import { motion, AnimatePresence } from 'framer-motion';
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
  const { x, y } = useMousePosition();
  const size = isHovered ? 464 : isMenuHovered ? 240 : 40;

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
      <motion.div 
        className={styles.blueCircle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "linear", delay: 0.3 }}
      ></motion.div>
      <motion.div 
        className={styles.sectionRoutes} 
        onMouseEnter={() => {setIsMenuHovered(true)}} 
        onMouseLeave={() => {setIsMenuHovered(false)}}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "linear", delay: 0.3 }}
        >
        <p>CASE STUDIES</p>
        <p>ABOUT</p>
        <p>SANDBOX</p>
      </motion.div>
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
              <div className={styles.nameContainer}>
                <motion.p
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.95 }}
                  className={styles.nameInner}
                >PRITISH PATIL</motion.p>
              </div>
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
            <div className={styles.nameContainer}>
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.95 }}
                className={styles.nameInner}
              >PRITISH PATIL</motion.p>
            </div>
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

      <div className= {styles.imageGrid}>
        <div className={styles.imageRow}>

          <div className={styles.imageItem}>
            <Image
              src="/images/PoppinHeroThree.png"
              alt="Crew Hero"
              width={1200}
              height={675}
            />
            <h3 className={styles.imageTitle}>Bootstrapping a hyperlocal ticketing marketplace to 75,000 users</h3>
            <p className={styles.imageDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>          </div>

          <div className={styles.imageItem}>
            <Image
              src="/images/AllAthleteHero.png"
              alt="Crowdsurf Hero"
              width={1200}
              height={675}
            />
            <h3 className={styles.imageTitle}>Connecting high school athletes with college programs</h3>
            <p className={styles.imageDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
        </div>

        <div className={styles.imageRow}>
          <div className={styles.imageItem}>
            <Image
              src="/images/CrewHero.png"
              alt="Crew Hero"
              width={1200}
              height={675}
            />
            <h3 className={styles.imageTitle}>Raising $200,000 to explore group photo-messaging</h3>
            <p className={styles.imageDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>          </div>

          <div className={styles.imageItem}>
            <Image
              src="/images/CrowdsurfHero.png"
              alt="All Athlete Hero"
              width={1200}
              height={675}
            />
            <h3 className={styles.imageTitle}>Pitching Sequoia: Crowdsurf</h3>
            <p className={styles.imageDescription}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>          </div>
        </div>
      </div>
      
      <div className='h-[100vh]'/>
      <div className='h-[100vh]'/>


    </main>
  )
}