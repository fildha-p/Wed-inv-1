import { useEffect, useMemo, useRef, useState } from 'react';
import AnimatedInvite from './AnimatedInvite.jsx';

const CONFIG = {
  introStyle: 'envelope',
  particleCount: 10,
  musicPath: '/music.mp3',
  cardImage: '/card.jpg',
  envBg: '/env-bg.jpg',
  floralTop: '/floral-top.png',
  floralBottom: '/floral-bottom.png',
  waxSeal: '/wax-seal.png',
  inviteScript: "You're Invited!",
  openLabel: 'Click to open',
  couple: {
    bride: 'Dr Aiswarya',
    groom: 'Dr Anugrah',
    line: 'are getting married',
  },
  families: {
    bride: {
      parents: 'M. K. Sajeevan & Sumana Sajeevan',
      home: 'Manadiyil House, Thazhappilly',
    },
    groom: {
      parents: 'Dr Suresh Babu & Mrs Bindu Suresh Babu',
      home: 'Sonar, Pallikkunnu, Kannur',
    },
  },
  wedding: {
    dateLabel: 'Saturday, 5 September 2026',
    malayalamDate: '1202 Chingam 20',
    target: '2026-09-05T10:30:00+05:30',
    muhurtham: 'between 10:30 AM and 11:00 AM',
  },
  venue: {
    name: 'CIAL Convention Centre, Nedumbassery',
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=CIAL+Convention+Centre+Nedumbassery',
  },
  calendar: {
    googleUrl:
      'https://www.google.com/calendar/render?action=TEMPLATE&text=Aiswarya+%26+Anugrah+Wedding&dates=20260905T050000Z/20260905T053000Z&details=Muhurtham+10:30-11:00+AM&location=CIAL+Convention+Centre,+Nedumbassery',
    ics: {
      fileName: 'aiswarya-anugrah-wedding.ics',
      summary: 'Aiswarya & Anugrah Wedding',
      location: 'CIAL Convention Centre, Nedumbassery',
      dtStart: '20260905T103000',
      dtEnd: '20260905T110000',
      tzid: 'Asia/Kolkata',
    },
  },
  events: [{ title: 'Muhurtham', time: '10:30-11:00 AM' }],
  assets: {
    images: [
      '/couple-1.jpeg',
      '/couple-2.jpeg',
      '/couple-3.jpeg',
      '/couple-4.jpeg',
      '/couple-5.jpeg',
    ],
    music: '/music.mp3',
  },
  footerLine: 'With best compliments from Adith Sajeevan',
};

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

function ScriptAmpersand() {
  return (
    <span className="script-amp" aria-label="and">
      &
    </span>
  );
}

function Countdown() {
  const target = useMemo(() => new Date(CONFIG.wedding.target).getTime(), []);
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
          <span className="countdown-value">{String(value).padStart(2, '0')}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

function GalleryImage({ src, index }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={`gallery-frame ${failed ? 'image-fallback' : ''}`}>
      {!failed ? (
        <img
          src={src}
          alt={`Dr Aiswarya and Dr Anugrah ${index + 1}`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <LeafMark className="fallback-leaf" />
      )}
    </figure>
  );
}

function createIcsFile() {
  const { summary, location, dtStart, dtEnd, tzid } = CONFIG.calendar.ics;
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aiswarya Anugrah Wedding//Save The Date//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:aiswarya-anugrah-wedding-20260905@save-the-date`,
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
  link.download = CONFIG.calendar.ics.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function MusicControl() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowHint(false), 4200);
    return () => window.clearTimeout(timeout);
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setShowHint(false);

    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };

  return (
    <div className="music-dock" aria-label="Music controls">
      <audio ref={audioRef} src={CONFIG.assets.music} loop preload="none" />
      <span className={`music-hint ${showHint ? 'show' : ''}`}>tap for music</span>
      <button
        className="music-button"
        type="button"
        onClick={togglePlay}
        aria-label={playing ? 'Pause music' : 'Play music'}
        aria-pressed={playing}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 5h3v14H7V5Zm7 0h3v14h-3V5Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7L8 5Z" />
          </svg>
        )}
      </button>
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

function App() {
  return <AnimatedInvite config={CONFIG} />;
}

export default App;
