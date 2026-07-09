import { useState } from 'react';

// 원본: hallym/js/more-view.js (cloneNode로 그리드 블록 복제)
// React에서는 DOM 복제 대신 반복 렌더 횟수를 state로 관리
const BASE = [
  ['소식 1', '#334155'], ['소식 2', '#475569'], ['소식 3', '#64748b'],
  ['소식 4', '#94a3b8'], ['소식 5', '#1e293b'], ['소식 6', '#0f172a'],
];

export default function MoreView() {
  const [blocks, setBlocks] = useState(1);

  return (
    <div className="scroll-area">
      <div className="mv-wrap">
        <div className="mv-grid">
          {Array.from({ length: blocks }).flatMap((_, b) =>
            BASE.map(([label, bg], i) => (
              <div
                key={`${b}-${i}`}
                className="mv-item"
                style={{ background: bg, animationDelay: `${i * 0.05}s` }}
              >
                {label} {b > 0 ? `(복제 ${b})` : ''}
              </div>
            ))
          )}
        </div>
        <button className="mv-btn" onClick={() => setBlocks((n) => n + 1)}>
          MORE VIEW +
        </button>
      </div>
    </div>
  );
}
