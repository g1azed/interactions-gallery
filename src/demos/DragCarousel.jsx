import { useRef, useState } from 'react';

// 원본: hallym/js/bottom-carousel.js (slick draggable + swipeToSlide)
// Pointer Events 기반 드래그 캐러셀로 재구현 (스냅 포함)
const CELLS = [
  ['공지사항', '#f97316'], ['학사일정', '#fb923c'], ['장학안내', '#fdba74'],
  ['입학정보', '#ea580c'], ['취업지원', '#c2410c'], ['국제교류', '#9a3412'],
];

const CELL_W = 300 + 20;

export default function DragCarousel() {
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ startX: 0, baseX: 0, moved: false });
  const viewportRef = useRef(null);

  const maxDrag = () => {
    const vw = viewportRef.current?.clientWidth ?? 0;
    return Math.max(0, CELLS.length * CELL_W - vw + 60);
  };

  const clamp = (v) => Math.min(0, Math.max(-maxDrag(), v));

  const onPointerDown = (e) => {
    setDragging(true);
    drag.current = { startX: e.clientX, baseX: x, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    setX(clamp(drag.current.baseX + dx));
  };

  const onPointerUp = () => {
    setDragging(false);
    // 셀 단위 스냅 (slick의 swipeToSlide 유사)
    setX((cur) => clamp(Math.round(cur / CELL_W) * CELL_W));
  };

  return (
    <div className="dc-wrap">
      <div
        className={`dc-viewport${dragging ? ' dragging' : ''}`}
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="dc-track"
          style={{
            transform: `translateX(${x}px)`,
            transition: dragging ? 'none' : 'transform 0.4s cubic-bezier(.22,1,.36,1)',
          }}
        >
          {CELLS.map(([label, bg]) => (
            <div key={label} className="dc-cell" style={{ background: bg }}>
              {label}
            </div>
          ))}
        </div>
      </div>
      <p className="dc-hint">← 드래그해서 넘겨보세요 (놓으면 셀 단위로 스냅) →</p>
    </div>
  );
}
