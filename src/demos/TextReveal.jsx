import { useRef, useState } from 'react';

// 원본: hallym/main.html + css/main.css + js/horizon-text.js + js/horizon-scroll.js
// - 배경 비디오: scale(0.3)→1 스케일업, brightness(40%)
// - "All New Hallym": 글자별 h1, 위에서 clip-path 드롭인 (2s~2.45s 스태거)
// - 스크롤 시 가로 이동 + allnew는 왼쪽으로 클립아웃, "대학의 미래를 열다"가
//   글자별 다른 transition(1.3s~2.3s)으로 오른쪽에서 스윕 인
// - 하단 인디케이터 바(가로 진행률) + SCROLL/Right/Scroll Down 텍스트

// [글자, 인트로 애니메이션 딜레이(s)] — 원본 nth-child 딜레이 그대로
const ALLNEW = [
  ['A', 2], ['l', 2.1], ['l', 2.15], [' ', null],
  ['N', 2.2], ['e', 2.24], ['w', 2.25], [' ', null],
  ['H', 2.3], ['a', 2.32], ['l', 2.33], ['l', 2.35], ['y', 2.4], ['m', 2.45],
];

// [글자, transition duration(s)] — 원본 nth-child 트랜지션 그대로
const HALLYM = [
  ['대', 1.3], ['학', 1.5], ['의', 1.7], [' ', 2],
  ['미', 2.1], ['래', 2.3], ['를', 2.3], [' ', 2.3],
  ['열', 2.3], ['다', 2.3],
];

export default function TextReveal() {
  const scrollRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  const onScroll = () => {
    const el = scrollRef.current;
    if (el) setScrollTop(el.scrollTop);
  };

  // 원본 horizon-text.js 임계값 그대로
  const allnewOut = scrollTop >= 800;
  const hallymIn = scrollTop > 833;

  // 가로 스크롤: 스크롤량만큼 좌측 이동, 한 화면 폭까지 (horizon-scroll.js 역할)
  const vw = scrollRef.current?.clientWidth ?? 1920;
  const shift = Math.min(scrollTop, vw);
  const progress = (shift / vw) * 100;

  return (
    <div className="scroll-area tr-wrap" ref={scrollRef} onScroll={onScroll}>
      <div style={{ height: '400vh', position: 'relative' }}>
        <div className="tr-sticky">
          {/* bg_video: scale-up 애니메이션 + brightness(40%) */}
          <div className="tr-bg-video">
            <video autoPlay loop muted playsInline>
              <source src={`${import.meta.env.BASE_URL}main_video.mp4`} type="video/mp4" />
            </video>
          </div>

          {/* horizon_container: 두 개의 100% 패널이 가로로 이동 */}
          <div
            className="tr-horizon"
            style={{ transform: `translateX(${-shift}px)` }}
          >
            <div className="tr-list">
              {ALLNEW.map(([ch, delay], i) => (
                <h1
                  key={i}
                  className="tr-allnew"
                  onAnimationEnd={i === ALLNEW.length - 1 ? () => setIntroDone(true) : undefined}
                  style={{
                    animation:
                      delay !== null && !introDone
                        ? `tr-allnew-in 1.3s ${delay}s 1 forwards`
                        : 'none',
                    opacity: delay === null ? 0 : introDone ? 1 : undefined,
                    transition: 'all 2.1s ease-in-out',
                    transform: allnewOut ? 'translateX(-200px)' : 'translateX(0)',
                    clipPath: allnewOut
                      ? 'inset(-100% 0% -100% 100%)'
                      : 'inset(-100% 0% -100% 0%)',
                  }}
                >
                  {ch}
                </h1>
              ))}
            </div>

            <div className="tr-list">
              {HALLYM.map(([ch, dur], i) => (
                <h1
                  key={i}
                  className="tr-hallym"
                  style={{
                    transition: `all ${dur}s ease-in-out`,
                    transform: hallymIn ? 'translateX(0)' : 'translateX(200px)',
                    clipPath: hallymIn
                      ? 'inset(-100% 0% -100% 0%)'
                      : 'inset(-100% 0% -100% 100%)',
                  }}
                >
                  {ch}
                </h1>
              ))}
            </div>
          </div>

          {/* indicator_bar_wrap */}
          <div
            className="tr-indicator-wrap"
            style={{ visibility: progress >= 99.5 && scrollTop > vw + 200 ? 'hidden' : 'visible' }}
          >
            <div className="tr-indicator-bar">
              <div className="tr-indicator-progress" style={{ width: `${progress}%` }} />
            </div>
            <div className="tr-indicator-text">
              <p>SCROLL</p>
              <p>Right</p>
              <p>Scroll Down</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
