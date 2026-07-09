import { useState } from 'react';

// 원본: hallym/js/map.js
// 마커 호버 프리뷰 + 클릭 팝업 + 사이드 버튼 active 토글 연동
const BUILDINGS = [
  { id: 'lib', name: '중앙도서관', top: '30%', left: '38%' },
  { id: 'dorm', name: '기숙사', top: '55%', left: '62%' },
  { id: 'hall', name: '학생회관', top: '68%', left: '30%' },
  { id: 'gym', name: '체육관', top: '22%', left: '70%' },
];

export default function InteractiveMap() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null); // 팝업 대상
  const [activeBtn, setActiveBtn] = useState(null);

  const selectBuilding = (id) => {
    // 원본 로직: 이미 active면 해제, 아니면 active + 팝업 토글
    if (activeBtn === id) {
      setActiveBtn(null);
      setSelected(null);
    } else {
      setActiveBtn(id);
      setSelected(id);
    }
  };

  const sel = BUILDINGS.find((b) => b.id === selected);

  return (
    <div className="im-wrap">
      <div className="im-map">
        {/* 도로 장식 */}
        <div className="im-road" style={{ top: '45%', left: 0, right: 0, height: 10 }} />
        <div className="im-road" style={{ left: '50%', top: 0, bottom: 0, width: 10 }} />

        {BUILDINGS.map((b) => (
          <div
            key={b.id}
            className="im-marker"
            style={{ top: b.top, left: b.left }}
            onMouseEnter={() => setHovered(b.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => selectBuilding(b.id)}
          >
            <span>🏫</span>
          </div>
        ))}

        {BUILDINGS.map(
          (b) =>
            hovered === b.id && (
              <div key={b.id} className="im-hover-card" style={{ top: b.top, left: b.left }}>
                <div className="thumb" />
                <p>{b.name}</p>
                <small>클릭하면 상세 팝업이 열립니다</small>
              </div>
            )
        )}

        {sel && (
          <div className="im-popup-backdrop" onClick={() => { setSelected(null); setActiveBtn(null); }}>
            <div className="im-popup">
              <div className="thumb" />
              <h3>{sel.name}</h3>
              <p>원본에서는 건물 사진과 상세 정보가 표시됩니다. 배경을 클릭하면 닫힙니다.</p>
            </div>
          </div>
        )}
      </div>

      <aside className="im-aside">
        <h4>캠퍼스 건물</h4>
        {BUILDINGS.map((b) => (
          <button
            key={b.id}
            className={`im-aside-btn${activeBtn === b.id ? ' active' : ''}`}
            onClick={() => selectBuilding(b.id)}
          >
            {b.name}
          </button>
        ))}
      </aside>
    </div>
  );
}
