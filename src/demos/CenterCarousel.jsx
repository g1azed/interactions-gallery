import { useEffect, useRef, useState } from 'react';

// 원본: hallym/js/top-carousel.js (slick centerMode + autoplay)
// slick 제거, React state 기반 재구현
const SLIDES = [
  ['캠퍼스 전경', 'linear-gradient(135deg,#7c3aed,#c4b5fd)'],
  ['도서관', 'linear-gradient(135deg,#1c72f2,#93c5fd)'],
  ['기숙사', 'linear-gradient(135deg,#0d9488,#5eead4)'],
  ['대운동장', 'linear-gradient(135deg,#ca8a04,#fde047)'],
  ['학생회관', 'linear-gradient(135deg,#dc2626,#fca5a5)'],
];

const SLIDE_W = 380 + 24; // width + gap

export default function CenterCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const viewportRef = useRef(null);
  const [vw, setVw] = useState(0);

  useEffect(() => {
    const measure = () => setVw(viewportRef.current?.clientWidth ?? 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // autoplay (원본 autoplaySpeed: 2000)
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 2000);
    return () => clearInterval(t);
  }, [paused]);

  const offset = vw / 2 - SLIDE_W / 2 - idx * SLIDE_W + 12;

  return (
    <div
      className="cc-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="cc-viewport" ref={viewportRef}>
        <div className="cc-track" style={{ transform: `translateX(${offset}px)` }}>
          {SLIDES.map(([label, bg], i) => (
            <div
              key={label}
              className={`cc-slide${i === idx ? ' center' : ''}`}
              style={{ background: bg }}
            >
              {String(i + 1).padStart(2, '0')}
              <div className="cc-caption">{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="cc-controls">
        <button
          className="cc-arrow"
          onClick={() => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
          aria-label="이전"
        >
          ←
        </button>
        <div className="cc-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`cc-dot${i === idx ? ' on' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`${i + 1}번 슬라이드`}
            />
          ))}
        </div>
        <button
          className="cc-arrow"
          onClick={() => setIdx((i) => (i + 1) % SLIDES.length)}
          aria-label="다음"
        >
          →
        </button>
      </div>
    </div>
  );
}
