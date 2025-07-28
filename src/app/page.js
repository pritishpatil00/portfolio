'use client'
import styles from './page.module.scss'
import { useState, useEffect } from 'react';  
import { motion, AnimatePresence } from 'framer-motion';
import useMousePosition from './utils/useMousePosition';
import Image from 'next/image';

export default function Home() {

  const [isHovered, setIsHovered] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [showImages, setShowImages] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
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
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 }}
                className={styles.name}
              >PRITISH PATIL</motion.div>
              <motion.p
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.9 }}
              >GREAT</motion.p>
              <motion.p
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 1.0 }}
              >DESIGN</motion.p>
              <motion.p
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 1.1 }}
              >IS</motion.p>
              <motion.p
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 }}
              >INVISIBLE</motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className={styles.body}>
        <div className={styles.heroSection}>
          <div className={styles.content}>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 }}
              className={styles.name}
            >PRITISH PATIL</motion.div>
            <motion.p
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.9 }}
            >GOOD</motion.p>
            <motion.p
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 1.0 }}
            ><span>DESIGN</span></motion.p>
            <motion.p
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 1.1 }}
            >IS</motion.p>
            <motion.p
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 }}
            >SIMPLE</motion.p>
          </div>
        </div>
      </div>

      <div className={styles.caseStudy}>
        <div className={styles.caseStudyItem}>
          <p>Rectangle 1</p>
        </div>
        <div className={styles.caseStudyItem}>
          <p>Rectangle 2</p>
        </div>
        <div className={styles.caseStudyItem}>
          <p>Rectangle 3</p>
        </div>
      </div>

    </main>
  )
}