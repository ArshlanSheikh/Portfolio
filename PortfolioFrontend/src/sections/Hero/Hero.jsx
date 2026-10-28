import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Code2, 
  GitBranch, 
  Link2, 
  Mail, 
  Download, 
  Terminal, 
  Layers, 
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import fallbackPortrait from '../../assets/hero-cutout.png';
import portfolioService from '../../services/portfolioService.js';
import styles from './Hero.module.css';

function Hero() {
  const [profile, setProfile] = useState(null);
  const [portraitSrc, setPortraitSrc] = useState(fallbackPortrait);
  const [isLoaded, setIsLoaded] = useState(false);

  // References for parallax layers (0 React re-renders during mouse movement)
  const heroRef = useRef(null);
  const spotlightRef = useRef(null);
  const bgGlowRef = useRef(null);
  const backdropTextRef = useRef(null);
  const portraitLayerRef = useRef(null);
  const chipsLayerRef = useRef(null);
  const copyLayerRef = useRef(null);
  const primaryBtnRef = useRef(null);

  // Target and current interpolated coordinates
  const mouseCoords = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const animFrameId = useRef(null);
  const isHovered = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const res = await portfolioService.getPublicProfile();
        if (isMounted && res?.data?.profile) {
          setProfile(res.data.profile);
          if (res.data.profile.avatar) {
            setPortraitSrc(res.data.profile.avatar);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch public profile for hero:', err);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  // Parallax animation loop using requestAnimationFrame and linear interpolation (lerp)
  const updateParallax = useCallback(() => {
    const coords = mouseCoords.current;
    
    // Lerp smoothing factor
    const ease = 0.075;
    coords.currentX += (coords.targetX - coords.currentX) * ease;
    coords.currentY += (coords.targetY - coords.currentY) * ease;

    const x = coords.currentX;
    const y = coords.currentY;

    // Layer 0: Background glow (very subtle, opposite drift)
    if (bgGlowRef.current) {
      bgGlowRef.current.style.transform = `translate3d(${-x * 12}px, ${-y * 12}px, 0)`;
    }

    // Layer 1: Giant backdrop typography (moderate depth)
    if (backdropTextRef.current) {
      backdropTextRef.current.style.transform = `translate3d(${x * 18}px, ${y * 14}px, 0)`;
    }

    // Layer 2: Main portrait with 3D tilt & gentle translation
    if (portraitLayerRef.current) {
      const tiltX = -y * 5;
      const tiltY = x * 6;
      portraitLayerRef.current.style.transform = `translate3d(${x * 24}px, ${y * 20}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }

    // Layer 3: Floating interactive tech chips (strongest parallax for pronounced depth)
    if (chipsLayerRef.current) {
      chipsLayerRef.current.style.transform = `translate3d(${x * 38}px, ${y * 32}px, 0)`;
    }

    // Layer 4: Foreground copy (very subtle, stabilized for readability)
    if (copyLayerRef.current) {
      copyLayerRef.current.style.transform = `translate3d(${x * 8}px, ${y * 6}px, 0)`;
    }

    // Continue loop as long as there is noticeable motion or hero is hovered
    const delta = Math.abs(coords.targetX - coords.currentX) + Math.abs(coords.targetY - coords.currentY);
    if (isHovered.current || delta > 0.001) {
      animFrameId.current = requestAnimationFrame(updateParallax);
    } else {
      animFrameId.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    if (!animFrameId.current) {
      animFrameId.current = requestAnimationFrame(updateParallax);
    }
  }, [updateParallax]);

  // Pointer movement handler
  const handlePointerMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const normX = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width) * 2 - 1));
    const normY = Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height) * 2 - 1));

    mouseCoords.current.targetX = normX;
    mouseCoords.current.targetY = normY;

    // Magnetic attraction for primary CTA button
    if (primaryBtnRef.current) {
      const btnRect = primaryBtnRef.current.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;
      const dist = Math.hypot(clientX - btnCenterX, clientY - btnCenterY);

      if (dist < 140) {
        const pullX = (clientX - btnCenterX) * 0.22;
        const pullY = (clientY - btnCenterY) * 0.22;
        primaryBtnRef.current.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
      } else {
        primaryBtnRef.current.style.transform = `translate3d(0, 0, 0)`;
      }
    }

    if (spotlightRef.current) {
      const spotX = clientX - rect.left;
      const spotY = clientY - rect.top;
      spotlightRef.current.style.setProperty('--spotlight-x', `${spotX}px`);
      spotlightRef.current.style.setProperty('--spotlight-y', `${spotY}px`);
    }

    isHovered.current = true;
    startLoop();
  };

  const handlePointerLeave = () => {
    isHovered.current = false;
    mouseCoords.current.targetX = 0;
    mouseCoords.current.targetY = 0;
    if (primaryBtnRef.current) {
      primaryBtnRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
    startLoop();
  };

  // Device orientation tilt for mobile devices
  useEffect(() => {
    const handleDeviceOrientation = (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (e.gamma === null || e.beta === null) return;
      
      const gamma = Math.max(-30, Math.min(30, e.gamma));
      const beta = Math.max(-30, Math.min(30, e.beta - 40));

      mouseCoords.current.targetX = gamma / 30;
      mouseCoords.current.targetY = beta / 30;
      startLoop();
    };

    if (window.DeviceOrientationEvent && !window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [startLoop]);

  const name = profile?.fullName || 'Arshlan Sheikh';
  const role = profile?.title || 'Full Stack Web Developer';
  const bio = profile?.bio || 'Engineering resilient web applications from high-fidelity interfaces down to scalable backend architectures. Specialized in modern React systems, Node/Express microservices, and optimized databases.';
  const availability = profile?.availabilityStatus || 'Available for Projects';
  const availabilityNote = profile?.availabilityNote || 'Open to full-time roles & high-impact contracts';

  const github = profile?.socialLinks?.find((s) => s.platform.toLowerCase() === 'github')?.url || 'https://github.com/ArshlanSheikh';
  const linkedin = profile?.socialLinks?.find((s) => s.platform.toLowerCase() === 'linkedin')?.url || 'https://www.linkedin.com/in/arshlan-sheikh-b27114236';
  const email = profile?.email || 'arshlans29@gmail.com';
  const resumeUrl = profile?.resumeUrl || '/resume';

  return (
    <section 
      ref={heroRef}
      className={`${styles.hero} ${isLoaded ? styles.loaded : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-label="Hero Section"
    >
      {/* Dynamic Cursor Spotlight Light */}
      <div ref={spotlightRef} className={styles.spotlight} aria-hidden="true" />

      {/* Atmospheric Background Layers (Layer 0) */}
      <div className={styles.ambientCanvas} aria-hidden="true">
        <div ref={bgGlowRef} className={styles.glowCluster}>
          <div className={styles.primaryBloom} />
          <div className={styles.secondaryBloom} />
          <div className={styles.cyberGrid} />
        </div>
        <div className={styles.filmNoise} />
      </div>

      {/* Distant Layered Editorial Backdrop (Layer 1) */}
      <div ref={backdropTextRef} className={styles.backdropLayer} aria-hidden="true">
        <div className={styles.giantWatermark}>
          <span>ARSHLAN</span>
          <span>SHEIKH</span>
        </div>
        <div className={styles.techTelemetry}>
          <span className={styles.telemetryItem}>LOC: 28.6139° N / 77.2090° E</span>
          <span className={styles.telemetryItem}>ENV: PRODUCTION / MERN</span>
          <span className={styles.telemetryItem}>STATUS: ALL SYSTEMS NOMINAL</span>
        </div>
      </div>

      {/* Main Inner Container */}
      <div className={styles.inner}>
        {/* Left Column: Bold Editorial Typography & CTA (Layer 4) */}
        <div ref={copyLayerRef} className={styles.copy}>
          <div className={styles.kickerBadge}>
            <span className={styles.kickerDot} />
            <span className={styles.kickerText}>FULL STACK DEVELOPER</span>
            <span className={styles.kickerDivider} />
            <span className={styles.kickerSub}>MERN ARCHITECT</span>
          </div>

          <h1 className={styles.headline}>
            <span className={styles.headlineWord}>Engineering</span>
            <span className={styles.headlineWord}>
              <span className={styles.gradientAccent}>Scalable Systems</span>
            </span>
            <span className={styles.headlineWord}>& Expressive UX.</span>
          </h1>

          <div className={styles.rolePlate}>
            <Terminal size={14} className={styles.roleIcon} />
            <span className={styles.roleText}>{role}</span>
            <span className={styles.rolePipe}>|</span>
            <span className={styles.roleLocation}>New Delhi, India</span>
          </div>

          <p className={styles.intro}>{bio}</p>

          <div className={styles.actions}>
            <a ref={primaryBtnRef} className={styles.primaryCta} href="#projects">
              <span>Explore My Work</span>
              <span className={styles.ctaIconWrapper}>
                <ArrowDownRight size={17} />
              </span>
            </a>
            <Link className={styles.secondaryCta} to="/contact">
              <span>Get In Touch</span>
              <ArrowUpRight size={16} />
            </Link>
            {resumeUrl && (
              <a 
                className={styles.resumeCta} 
                href={resumeUrl} 
                target="_blank" 
                rel="noreferrer"
                title="Download Arshlan's Resume"
              >
                <Download size={15} />
                <span>Resume</span>
              </a>
            )}
          </div>

          <div className={styles.socialDock}>
            <span className={styles.dockLabel}>CONNECT //</span>
            <a href={github} target="_blank" rel="noreferrer" className={styles.dockLink} title="GitHub Profile">
              <GitBranch size={15} />
              <span>GitHub</span>
            </a>
            <a href={linkedin} target="_blank" rel="noreferrer" className={styles.dockLink} title="LinkedIn Profile">
              <Link2 size={15} />
              <span>LinkedIn</span>
            </a>
            <a href={`mailto:${email}`} className={styles.dockLink} title="Send Email">
              <Mail size={15} />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Right Column: Hero Centerpiece Portrait with Atmospheric Depth (Layer 2 & 3) */}
        <div className={styles.visualStage}>
          {/* Main Portrait with 3D Parallax & Custom Rim Light (Layer 2) */}
          <div ref={portraitLayerRef} className={styles.portraitComposition}>
            <div className={styles.portraitAura} aria-hidden="true" />
            <div className={styles.portraitFrame}>
              <img
                className={styles.portraitImage}
                src={portraitSrc}
                alt={`Cinematic portrait of ${name}`}
                loading="eager"
                onError={() => {
                  if (portraitSrc !== fallbackPortrait) {
                    setPortraitSrc(fallbackPortrait);
                  }
                }}
              />
              <div className={styles.portraitFloorFade} aria-hidden="true" />
            </div>
          </div>

          {/* Floating Interactive Glassmorphism Badges (Layer 3) */}
          <div ref={chipsLayerRef} className={styles.floatingChips}>
            {/* Chip 1: Architecture node */}
            <div className={`${styles.techBadge} ${styles.badgeTopLeft}`}>
              <div className={styles.badgeGlow} />
              <div className={styles.badgeHeader}>
                <Code2 size={15} className={styles.badgeIcon} />
                <span className={styles.badgeTitle}>FULL STACK ARCHITECTURE</span>
                <span className={styles.badgeLiveDot} />
              </div>
              <p className={styles.badgeBody}>
                Production-grade MERN architectures with clean API contracts.
              </p>
              <div className={styles.tagMatrix}>
                <span>React 19</span>
                <span>Node.js</span>
                <span>Express</span>
                <span>MongoDB</span>
              </div>
            </div>

            {/* Chip 2: Live availability status */}
            <div className={`${styles.statusPill} ${styles.badgeBottomRight}`}>
              <span className={styles.statusRadar}>
                <span className={styles.statusPulse} />
                <span className={styles.statusCore} />
              </span>
              <div className={styles.statusInfo}>
                <strong className={styles.statusTitle}>{availability}</strong>
                <span className={styles.statusNote}>{availabilityNote}</span>
              </div>
            </div>

            {/* Chip 3: Technology focus indicator */}
            <div className={`${styles.metricBadge} ${styles.badgeMidRight}`}>
              <Layers size={14} className={styles.metricIcon} />
              <div>
                <span className={styles.metricNumber}>100%</span>
                <span className={styles.metricLabel}>Full Stack Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Footer Bar */}
      <div className={styles.heroFoot}>
        <div className={styles.footMeta}>
          <span className={styles.footIndex}>01 / 05</span>
          <span className={styles.footDivider}>•</span>
          <span className={styles.footDesc}>DEVELOPER PORTFOLIO</span>
        </div>
        <a href="#projects" className={styles.scrollIndicator} aria-label="Scroll down to projects">
          <span className={styles.scrollText}>SCROLL TO EXPLORE</span>
          <span className={styles.scrollArrow}>
            <ChevronDown size={14} />
          </span>
        </a>
      </div>
    </section>
  );
}

export default Hero;
