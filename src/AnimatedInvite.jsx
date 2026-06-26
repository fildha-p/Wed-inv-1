import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

function LeafMark({ className = '', ariaHidden = true }) {
  return (
    <svg
      className={className}
      width="78"
      height="42"
      viewBox="0 0 78 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaHidden}
    >
      <path
        d="M39 35C39 19 29 9 15 7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M39 35C39 19 49 9 63 7"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M15 7C23 2 29 4 31 12C23 14 18 12 15 7Z" fill="currentColor" />
      <path d="M63 7C55 2 49 4 47 12C55 14 60 12 63 7Z" fill="currentColor" />
      <path d="M29 19C35 16 39 18 40 24C34 25 31 23 29 19Z" fill="currentColor" />
      <path d="M49 19C43 16 39 18 38 24C44 25 47 23 49 19Z" fill="currentColor" />
    </svg>
  );
}

function AnimatedAmpersand() {
  return (
    <svg
      className="script-amp-svg"
      viewBox="0 0 120 120"
      role="img"
      aria-label="and"
      focusable="false"
    >
      <text x="60" y="82" textAnchor="middle">
        &
      </text>
    </svg>
  );
}

function ActionIcon({ type }) {
  if (type === 'map') {
    return (
      <svg className="action-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 21s6-5.35 6-11a6 6 0 1 0-12 0c0 5.65 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    );
  }

  if (type === 'download') {
    return (
      <svg className="action-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 4v10m0 0 4-4m-4 4-4-4" />
        <path d="M5 18.5h14" />
      </svg>
    );
  }

  return (
    <svg className="action-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="5" y="6" width="14" height="13" rx="2" />
      <path d="M8 4v4m8-4v4M5 10h14" />
    </svg>
  );
}

function WaxSeal({ broken = false }) {
  return (
    <span className={`wax-seal ${broken ? 'is-broken' : ''}`}>
      <LeafMark className="seal-leaf" />
      <span>A <span className="seal-amp">&</span> A</span>
      <span className="seal-crack" aria-hidden="true" />
    </span>
  );
}

function Section({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.classList.add('is-visible');
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          observer.unobserve(node);
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`reveal section ${className}`}>
      {children}
    </section>
  );
}

function AmbientParticles({ config, reducedMotion }) {
  const layerRef = useRef(null);
  const particles = useMemo(() => {
    const count = Math.min(config.particleCount, 12);
    return Array.from({ length: count }, (_, index) => ({
      id: index,
      left: 4 + ((index * 23) % 92),
      delay: -(index * 1.7),
      duration: 18 + (index % 5) * 4,
      size: 12 + (index % 4) * 4,
      depth: 0.25 + (index % 4) * 0.18,
    }));
  }, [config.particleCount]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const layer = layerRef.current;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (layer) layer.style.setProperty('--particle-scroll', `${window.scrollY * 0.08}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="particle-layer" ref={layerRef} aria-hidden="true">
      {particles.map((particle) => (
        <span
          className="particle"
          key={particle.id}
          style={{
            '--left': `${particle.left}%`,
            '--delay': `${particle.delay}s`,
            '--duration': `${particle.duration}s`,
            '--size': `${particle.size}px`,
            '--depth': particle.depth,
          }}
        />
      ))}
    </div>
  );
}

function OpeningLeafFall({ active, reducedMotion }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        left: 6 + ((index * 19) % 88),
        delay: -(index * 0.95),
        duration: 11.5 + (index % 6) * 1.15,
        size: 12 + (index % 4) * 3,
        drift: (index % 2 === 0 ? 1 : -1) * (18 + (index % 6) * 8),
        rotate: (index % 2 === 0 ? 1 : -1) * (220 + index * 19),
      })),
    [],
  );

  if (!active || reducedMotion) return null;

  return (
    <div className="opening-leaf-fall" aria-hidden="true">
      {leaves.map((leaf) => (
        <span
          className="opening-leaf"
          key={leaf.id}
          style={{
            '--left': `${leaf.left}%`,
            '--delay': `${leaf.delay}s`,
            '--duration': `${leaf.duration}s`,
            '--size': `${leaf.size}px`,
            '--drift': `${leaf.drift}px`,
            '--rotate': `${leaf.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

function OpeningLeafPop({ active, reducedMotion }) {
  const burstLeaves = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 26;
        const distance = 120 + (index % 5) * 32;
        return {
          id: index,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 80,
          delay: (index % 6) * 0.025,
          size: 9 + (index % 5) * 3,
          rotate: (index % 2 === 0 ? 1 : -1) * (160 + index * 23),
        };
      }),
    [],
  );

  if (!active || reducedMotion) return null;

  return (
    <div className="opening-leaf-pop" aria-hidden="true">
      {burstLeaves.map((leaf) => (
        <span
          className="pop-leaf"
          key={leaf.id}
          style={{
            '--pop-x': `${leaf.x}px`,
            '--pop-y': `${leaf.y}px`,
            '--delay': `${leaf.delay}s`,
            '--size': `${leaf.size}px`,
            '--rotate': `${leaf.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

function IntroOverlay({ config, reducedMotion, onOpen }) {
  const [prelude, setPrelude] = useState(true);
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);
  const introStyle = config.introStyle === 'envelope' ? 'envelope' : 'curtain';

  useEffect(() => {
    if (reducedMotion || gone || !prelude) return undefined;
    const timer = window.setTimeout(() => setPrelude(false), 650);
    return () => window.clearTimeout(timer);
  }, [gone, prelude, reducedMotion]);

  if (gone) return null;

  if (prelude && !reducedMotion) {
    return (
      <div className="intro-prelude" aria-label="Save the date">
        <LeafMark className="intro-prelude-leaf" />
        <span>Save the date</span>
      </div>
    );
  }

  const open = async () => {
    if (opening) return;
    setOpening(true);
    await onOpen();
    window.setTimeout(() => setGone(true), reducedMotion ? 180 : introStyle === 'envelope' ? 2100 : 1380);
  };

  if (introStyle === 'envelope') {
    return (
      <div
        className={`intro intro-envelope premium-envelope-intro ${opening ? 'is-opening' : ''}`}
        style={{ '--env-bg': `url(${config.envBg})` }}
      >
        <button className="premium-envelope-button" type="button" onClick={open} aria-label={config.openLabel}>
          <span className="premium-envelope" aria-hidden="true">
            <span className="premium-envelope-back" />
            <span className="premium-envelope-left" />
            <span className="premium-envelope-right" />
            <span className="premium-envelope-bottom" />
            <span className="premium-inner-card">
              <img src={config.cardImage} alt="" loading="eager" />
            </span>
            <span className="premium-invite-script">
              <span>{config.inviteScript.split(' ').slice(0, 1).join(' ')}</span>
              <span>{config.inviteScript.split(' ').slice(1).join(' ')}</span>
            </span>
            <span className="premium-envelope-flap" />
            <span className="premium-envelope-body" />
            <img className="premium-floral premium-floral-top" src={config.floralTop} alt="" loading="eager" />
            <img className="premium-floral premium-floral-bottom" src={config.floralBottom} alt="" loading="eager" />
            <span className="premium-wax-wrap">
              <img className="premium-wax-seal" src={config.waxSeal} alt="" loading="eager" />
            </span>
          </span>
          <span className="premium-open-label">{config.openLabel}</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`intro intro-curtain ${opening ? 'is-opening' : ''}`}>
      <div className="curtain-panel curtain-left" />
      <div className="curtain-panel curtain-right" />
      <button className="curtain-seal-button" type="button" onClick={open}>
        <WaxSeal />
        <span>Open invitation</span>
      </button>
    </div>
  );
}

function PrintedCardStage({ config, active, reducedMotion }) {
  const cardRef = useRef(null);
  const [dismissed, setDismissed] = useState(false);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!active || reducedMotion) return undefined;
    const onScroll = () => {
      if (window.scrollY > 18) setDismissed(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [active, reducedMotion]);

  useEffect(() => {
    if (!active || reducedMotion || dismissed) return undefined;
    const card = cardRef.current;
    if (!card) return undefined;

    let frame = 0;
    const setTilt = (x, y) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        card.style.setProperty('--tilt-x', `${y}deg`);
        card.style.setProperty('--tilt-y', `${x}deg`);
        frame = 0;
      });
    };

    const onPointerMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -9;
      setTilt(x, y);
    };
    const onPointerLeave = () => setTilt(0, 0);
    const onDeviceTilt = (event) => {
      if (event.gamma == null || event.beta == null) return;
      setTilt(Math.max(-5, Math.min(5, event.gamma / 4)), Math.max(-5, Math.min(5, event.beta / -8)));
    };

    card.addEventListener('pointermove', onPointerMove);
    card.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('deviceorientation', onDeviceTilt);
    return () => {
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('deviceorientation', onDeviceTilt);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [active, dismissed, reducedMotion]);

  if (!active || reducedMotion) return null;

  return (
    <div className={`printed-card-stage ${dismissed ? 'is-dissolving' : ''}`} aria-hidden={dismissed}>
      <div className="printed-card-wrap" ref={cardRef}>
        {!missing ? (
          <img
            className="printed-card"
            src={config.cardImage}
            alt="Printed wedding invitation card"
            onError={() => setMissing(true)}
          />
        ) : (
          <div className="printed-card card-fallback">
            <LeafMark className="fallback-leaf" />
            <p>
              {config.couple.bride} <span className="inline-script">&</span> {config.couple.groom}
            </p>
          </div>
        )}
      </div>
      <p className="card-scroll-cue">scroll</p>
    </div>
  );
}

function DateReveal({ config }) {
  const [revealed, setRevealed] = useState(false);
  const [hintActive, setHintActive] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const dragStartRef = useRef(null);
  const sparkles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        id: index,
        sx: `${-36 + ((index * 17) % 73)}px`,
        sy: `${40 + ((index * 13) % 51)}px`,
        sd: `${(index % 6) * 0.08}s`,
        sdur: `${0.9 + (index % 5) * 0.16}s`,
        ssize: `${4 + (index % 6)}px`,
      })),
    [],
  );

  const beginDrag = (event) => {
    setHintActive(true);
    dragStartRef.current = event.clientX;
  };

  const moveDrag = (event) => {
    if (dragStartRef.current == null || revealed) return;
    if (Math.abs(event.clientX - dragStartRef.current) > 38) {
      setRevealed(true);
      setCardOpen(true);
      dragStartRef.current = null;
    }
  };

  const endDrag = () => {
    setHintActive(false);
    dragStartRef.current = null;
  };

  const revealDate = () => {
    setRevealed(true);
    setCardOpen(true);
  };

  const closeCard = () => setCardOpen(false);

  useEffect(() => {
    if (!cardOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setCardOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cardOpen]);

  return (
    <>
      <button
        className={`date-reveal ${revealed ? 'is-revealed' : ''} ${hintActive && !revealed ? 'is-hint-active' : ''}`}
        type="button"
        onClick={revealDate}
        onPointerEnter={() => !revealed && setHintActive(true)}
        onPointerLeave={() => setHintActive(false)}
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        aria-expanded={revealed}
        aria-label="Reveal wedding date"
      >
        <span className="thread-reveal-front" aria-hidden={revealed}>
          <span className="gold-thread" />
          <span className="thread-charm">
            <LeafMark className="thread-leaf" />
          </span>
          <span className="thread-sparkles" aria-hidden="true">
            {sparkles.map((sparkle) => (
              <span
                className="thread-spark"
                key={sparkle.id}
                style={{
                  '--sx': sparkle.sx,
                  '--sy': sparkle.sy,
                  '--sd': sparkle.sd,
                  '--sdur': sparkle.sdur,
                  '--ssize': sparkle.ssize,
                }}
              />
            ))}
          </span>
          <span className="thread-label">Pull or tap the golden thread</span>
        </span>
        <span className="date-ribbon">
          <span>{config.wedding.dateLabel}</span>
          <span>{config.wedding.malayalamDate}</span>
        </span>
      </button>
      {cardOpen &&
        createPortal(
          <div
            className="date-card-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Wedding date"
            onClick={closeCard}
          >
            <div className="date-card" onClick={(event) => event.stopPropagation()}>
              <button className="date-card-close" type="button" onClick={closeCard} aria-label="Close">
                &times;
              </button>
              <span className="date-card-leaf" aria-hidden="true">
                <LeafMark />
              </span>
              <p className="date-card-eyebrow">Save the Date</p>
              <p className="date-card-main">{config.wedding.dateLabel}</p>
              <p className="date-card-sub">{config.wedding.malayalamDate}</p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function OdometerNumber({ value }) {
  const text = String(value).padStart(2, '0');
  return (
    <span className="odometer" aria-label={text}>
      {text.split('').map((digit, index) => (
        <span className="odometer-digit" key={`${index}-${digit}`}>
          {digit}
        </span>
      ))}
    </span>
  );
}

function Countdown({ config }) {
  const target = useMemo(() => new Date(config.wedding.target).getTime(), [config.wedding.target]);
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining(Math.max(0, target - Date.now()));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (remaining <= 0) {
    return <p className="today-message">Today's the day</p>;
  }

  return (
    <div className="countdown-grid" aria-label="Live countdown to the wedding">
      {[
        ['days', days],
        ['hours', hours],
        ['minutes', minutes],
        ['seconds', seconds],
      ].map(([label, value]) => (
        <div className="countdown-item" key={label}>
          <span className="countdown-value">
            <OdometerNumber value={value} />
          </span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

function PhotoDateStrip({ config }) {
  const photos = [config.assets.images[0], config.assets.images[1], config.assets.images[2]];
  return (
    <div className="photo-date-strip" aria-hidden="true">
      {photos.map((photo, index) => (
        <div className={`photo-date-panel panel-${index}`} key={photo}>
          <img src={photo} alt="" loading={index === 0 ? 'eager' : 'lazy'} />
        </div>
      ))}
    </div>
  );
}

function Timeline({ config }) {
  const timelineRef = useRef(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timeline.style.setProperty('--timeline-progress', '1');
      timeline.querySelectorAll('.timeline-entry').forEach((entry) => entry.classList.add('is-lit'));
      return undefined;
    }

    let frame = 0;
    const updateLine = () => {
      frame = 0;
      const rect = timeline.getBoundingClientRect();
      const viewport = window.innerHeight || document.documentElement.clientHeight;
      const progress = Math.min(1, Math.max(0, (viewport * 0.78 - rect.top) / Math.max(rect.height, 1)));
      timeline.style.setProperty('--timeline-progress', String(progress));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateLine);
    };
    const entryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-lit');
        });
      },
      { threshold: 0.45 },
    );

    timeline.querySelectorAll('.timeline-entry').forEach((entry) => entryObserver.observe(entry));
    updateLine();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      entryObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="timeline" ref={timelineRef} aria-label="Event timeline">
      {config.events.map((event) => (
        <article className="timeline-entry" key={`${event.title}-${event.time}`}>
          <span className="timeline-dot" aria-hidden="true">
            <LeafMark className="timeline-dot-leaf" />
          </span>
          <span className="timeline-title">{event.title}</span>
          <strong>{event.time}</strong>
        </article>
      ))}
    </div>
  );
}

function createIcsFile(config) {
  const { summary, location, dtStart, dtEnd, tzid } = config.calendar.ics;
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aiswarya Anugrah Wedding//Save The Date//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:aiswarya-anugrah-wedding-20260905@save-the-date',
    `DTSTAMP:${now}`,
    `DTSTART;TZID=${tzid}:${dtStart}`,
    `DTEND;TZID=${tzid}:${dtEnd}`,
    `SUMMARY:${summary}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([body], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = config.calendar.ics.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function MusicControl({ audioRef, playing, muted, setMuted }) {
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <div className={`music-dock ${playing ? 'is-playing' : ''}`} aria-label="Music controls">
      <button
        className="music-button music-button-small"
        type="button"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute music' : 'Mute music'}
        aria-pressed={muted}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4Zm12.7 3 2.6-2.6-1.4-1.4-2.6 2.6-2.6-2.6-1.4 1.4 2.6 2.6-2.6 2.6 1.4 1.4 2.6-2.6 2.6 2.6 1.4-1.4-2.6-2.6Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4Zm12.5 3a4 4 0 0 0-2-3.46v6.92a4 4 0 0 0 2-3.46Zm-2-8.47v2.06A7 7 0 0 1 18 12a7 7 0 0 1-3.5 6.06v2.06A9 9 0 0 0 20 12a9 9 0 0 0-5.5-8.47Z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function playEnvelopeOpenSound({ muted }) {
  if (muted || typeof window === 'undefined') return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  try {
    const audioContext = new AudioContext();
    const now = audioContext.currentTime;
    const master = audioContext.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.28, now + 0.035);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
    master.connect(audioContext.destination);

    const bufferSize = Math.floor(audioContext.sampleRate * 0.62);
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const rustle = audioContext.createBufferSource();
    rustle.buffer = noiseBuffer;
    const rustleFilter = audioContext.createBiquadFilter();
    rustleFilter.type = 'bandpass';
    rustleFilter.frequency.setValueAtTime(1250, now);
    rustleFilter.frequency.exponentialRampToValueAtTime(3400, now + 0.48);
    rustleFilter.Q.setValueAtTime(0.8, now);
    const rustleGain = audioContext.createGain();
    rustleGain.gain.setValueAtTime(0.0001, now);
    rustleGain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    rustleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);
    rustle.connect(rustleFilter).connect(rustleGain).connect(master);
    rustle.start(now);
    rustle.stop(now + 0.64);

    [659.25, 880].forEach((frequency, index) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now + 0.18 + index * 0.08);
      gain.gain.setValueAtTime(0.0001, now + 0.16 + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08 / (index + 1), now + 0.24 + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.05 + index * 0.08);
      osc.connect(gain).connect(master);
      osc.start(now + 0.16 + index * 0.08);
      osc.stop(now + 1.12 + index * 0.08);
    });

    window.setTimeout(() => audioContext.close(), 1400);
  } catch {
    // The invite still opens even if a browser refuses Web Audio.
  }
}

export default function AnimatedInvite({ config }) {
  const reducedMotion = usePrefersReducedMotion();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [opened, setOpened] = useState(false);
  const [leafFall, setLeafFall] = useState(false);
  const [leafPop, setLeafPop] = useState(false);

  const openInvitation = async () => {
    if (!reducedMotion) {
      playEnvelopeOpenSound({ muted });
    }

    if (!reducedMotion) {
      setLeafPop(true);
      setLeafFall(true);
      window.setTimeout(() => setLeafPop(false), 1800);
    }

    const audio = audioRef.current;
    if (audio) {
      try {
        audio.muted = muted;
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
    window.setTimeout(
      () => setOpened(true),
      reducedMotion ? 120 : config.introStyle === 'envelope' ? 1900 : 1180,
    );
  };

  return (
    <main>
      <audio
        ref={audioRef}
        src={config.musicPath}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <AmbientParticles config={config} reducedMotion={reducedMotion} />
      <IntroOverlay config={config} reducedMotion={reducedMotion} onOpen={openInvitation} />
      <OpeningLeafPop active={leafPop} reducedMotion={reducedMotion} />
      <OpeningLeafFall active={leafFall || opened} reducedMotion={reducedMotion} />
      <PrintedCardStage config={config} active={opened} reducedMotion={reducedMotion} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-photo" aria-hidden="true">
          <img src={config.assets.images[0]} alt="" />
        </div>
        <div className="hero-content">
          <LeafMark className="monogram" />
          <h1 id="hero-title">
            <span className="name-word">{config.couple.bride}</span>
            <AnimatedAmpersand />
            <span className="name-word">{config.couple.groom}</span>
          </h1>
          <p className="hero-line">{config.couple.line}</p>
          <DateReveal config={config} />
          <p className="hero-venue">{config.venue.name}</p>
        </div>
        <p className="scroll-cue">scroll</p>
      </section>

      <Section className="countdown-section">
        <div className="section-heading">
          <LeafMark className="section-leaf" />
          <h2>Live countdown to the wedding</h2>
        </div>
        <PhotoDateStrip config={config} />
        <Countdown config={config} />
      </Section>

      <Section className="timeline-section">
        <div className="section-heading">
          <LeafMark className="section-leaf" />
          <h2>Event timeline</h2>
        </div>
        <Timeline config={config} />
      </Section>

      <Section className="location-section">
        <div className="section-heading">
          <LeafMark className="section-leaf" />
          <h2>Location</h2>
        </div>
        <p className="venue-name">{config.venue.name}</p>
        <a className="gold-button" href={config.venue.mapUrl} target="_blank" rel="noreferrer">
          <ActionIcon type="map" />
          <span>View on map</span>
        </a>
      </Section>

      <Section className="calendar-section">
        <div className="section-heading">
          <LeafMark className="section-leaf" />
          <h2>Add to calendar</h2>
        </div>
        <div className="button-row">
          <a className="gold-button" href={config.calendar.googleUrl} target="_blank" rel="noreferrer">
            <ActionIcon type="calendar" />
            <span>Google Calendar</span>
          </a>
          <button className="gold-button" type="button" onClick={() => createIcsFile(config)}>
            <ActionIcon type="download" />
            <span>Download .ics</span>
          </button>
        </div>
      </Section>

      <footer className="footer">
        <LeafMark className="footer-leaf" />
        <div className="family-grid">
          <div>
            <p>{config.families.bride.parents}</p>
            <p>{config.families.bride.home}</p>
          </div>
          <div>
            <p>{config.families.groom.parents}</p>
            <p>{config.families.groom.home}</p>
          </div>
        </div>
        <p className="compliments">{config.footerLine}</p>
        <a className="signature-link" href="https://www.instagram.com/vow.ra" target="_blank" rel="noreferrer">
          An Invitation by @vow.ra
        </a>
      </footer>

      <MusicControl
        audioRef={audioRef}
        playing={playing}
        muted={muted}
        setPlaying={setPlaying}
        setMuted={setMuted}
      />
    </main>
  );
}
