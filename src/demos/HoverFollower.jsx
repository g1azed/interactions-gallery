import { useState } from 'react';

// 원본: good-portfolio/js/detail/listMouseHover.js
// 리스트 행 위에서 커서를 따라다니는 프리뷰 이미지
const ROWS = [
  ['EQL Renewal Project', '이커머스 · 2023', 'linear-gradient(135deg,#be185d,#f9a8d4)'],
  ['KONJIAM 비대면 서비스', '기업·브랜드 · 2023', 'linear-gradient(135deg,#1c72f2,#93c5fd)'],
  ['THE HANDSOME.COM Renewal', '교육 · 2023', 'linear-gradient(135deg,#16a34a,#86efac)'],
  ['EWHA University Renewal', '교육 · 2023', 'linear-gradient(135deg,#7c3aed,#c4b5fd)'],
  ['RAWQUEST 라이온코리아', '기업·브랜드 · 2023', 'linear-gradient(135deg,#ea580c,#fdba74)'],
];

export default function HoverFollower() {
  const [hover, setHover] = useState(null); // { idx, x, y }

  const onMove = (idx) => (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHover({ idx, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="scroll-area">
      <div className="hf-wrap">
        {ROWS.map(([title, meta, bg], i) => (
          <div
            key={title}
            className="hf-row"
            onMouseMove={onMove(i)}
            onMouseLeave={() => setHover(null)}
          >
            <h3>{title}</h3>
            <span className="meta">{meta}</span>
            {hover?.idx === i && (
              <div
                className="hf-preview"
                style={{
                  background: bg,
                  left: hover.x - 90,
                  top: hover.y - 60,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
