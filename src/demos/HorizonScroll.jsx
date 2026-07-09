import { useRef, useState } from 'react';

// 원본: hallym/js/horizon-scroll.js
// 세로 스크롤을 sticky 구간에서 가로 이동으로 변환 + 진행률 인디케이터
const PANELS = [
  ['NEWS 01', 'linear-gradient(135deg,#1c72f2,#60a5fa)'],
  ['NEWS 02', 'linear-gradient(135deg,#7c3aed,#a78bfa)'],
  ['NEWS 03', 'linear-gradient(135deg,#0891b2,#67e8f9)'],
  ['NEWS 04', 'linear-gradient(135deg,#16a34a,#86efac)'],
  ['NEWS 05', 'linear-gradient(135deg,#ea580c,#fdba74)'],
  ['NEWS 06', 'linear-gradient(135deg,#e11d48,#fda4af)'],
];

export default function HorizonScroll() {
  const scrollRef = useRef(null);
  const stickyWrapRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const onScroll = () => {
    const scroller = scrollRef.current;
    const wrap = stickyWrapRef.current;
    if (!scroller || !wrap) return;
    const start = wrap.offsetTop;
    const range = wrap.offsetHeight - scroller.clientHeight;
    const p = Math.min(1, Math.max(0, (scroller.scrollTop - start) / range));
    setProgress(p);
  };

  const trackShift = `translateX(calc(${-progress} * (100% - 84vw)))`;

  return (
    <div className="scroll-area" ref={scrollRef} onScroll={onScroll}>
      <div className="hs-intro">↓ 아래로 스크롤하면 가로로 이동합니다</div>

      <div className="hs-sticky-wrap" ref={stickyWrapRef} style={{ height: '400vh' }}>
        <div className="hs-sticky">
          <div className="hs-track" style={{ transform: trackShift }}>
            {PANELS.map(([label, bg]) => (
              <div key={label} className="hs-panel" style={{ background: bg }}>
                {label}
              </div>
            ))}
          </div>
          <div className="hs-indicator">
            <div
              className="hs-indicator-progress"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="hs-outro">가로 스크롤 구간 끝 — 다시 세로 스크롤</div>
    </div>
  );
}
