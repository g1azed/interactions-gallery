import { useEffect, useRef, useState } from 'react';

// 원본: good-portfolio/index.html + css/index.css + js/carousel.js
// - .carousel-container: perspective 1200px
// - .carousel-wrapper: translateZ(910px) rotateY(30deg) rotateZ(6deg) — 링 안쪽 기울어진 시점
// - 셀 배치: rotateY(-40i) translateZ(360px) rotateY(180deg)
// - 휠: deltaY > 0 → -40°, 아니면 +40° (transition 1s ease-out)
const COUNT = 9;
const RADIUS = 360;
const CELL_ANGLE = 360 / COUNT; // 셀 배치 간격 40deg (링 유지용, 변경 금지)
const STEP = CELL_ANGLE / 8; // 휠당 회전량 20deg

export default function Cylinder3D() {
  const [angle, setAngle] = useState(0);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      setAngle((a) => (e.deltaY > 0 ? a - STEP : a + STEP));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="cy-stage" ref={wrapRef}>
      <div className="cy-container">
        <div className="cy-wrapper">
          <div className="cy-carousel" style={{ transform: `rotateY(${angle}deg)` }}>
            {Array.from({ length: COUNT }).map((_, i) => (
              <div
                key={i}
                className="cy-cell"
                style={{
                  transform: `rotateY(-${CELL_ANGLE * i}deg) translateZ(${RADIUS}px) rotateY(180deg)`,
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="cy-hint">휠을 굴리면 링이 {STEP}°씩 회전합니다</p>
    </div>
  );
}
