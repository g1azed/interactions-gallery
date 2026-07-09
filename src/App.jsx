import { useState, useEffect } from 'react';
import { DEMOS } from './demos.js';

export default function App() {
  const [activeId, setActiveId] = useState(
    () => window.location.hash.replace('#', '') || null
  );

  useEffect(() => {
    const onHash = () => setActiveId(window.location.hash.replace('#', '') || null);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const open = (id) => { window.location.hash = id; };
  const close = () => { window.location.hash = ''; };

  const active = DEMOS.find((d) => d.id === activeId);

  if (active) {
    const Demo = active.component;
    return (
      <div className="demo-page">
        <header className="demo-header">
          <button className="back-btn" onClick={close}>← 갤러리로</button>
          <div>
            <h2>{active.title}</h2>
            <p>{active.hint}</p>
          </div>
          <span className="src-badge">{active.source}</span>
        </header>
        <div className="demo-stage">
          <Demo />
        </div>
      </div>
    );
  }

  return (
    <div className="gallery">
      <header className="gallery-header">
        <p className="eyebrow">Vanilla JS → React Migration</p>
        <h1>Interactions Gallery</h1>
        <p className="sub">
          바닐라 자바스크립트로 만들었던 인터랙션 {DEMOS.length}종을 React 컴포넌트로
          마이그레이션한 모음입니다. 카드를 클릭하면 데모를 볼 수 있어요.
        </p>
      </header>
      <div className="card-grid">
        {DEMOS.map((d) => (
          <button key={d.id} className="card" onClick={() => open(d.id)}>
            <div className="card-thumb" style={{ background: d.thumb }}>
              <span className="card-emoji">{d.emoji}</span>
            </div>
            <div className="card-body">
              <div className="card-top">
                <h3>{d.title}</h3>
                <span className="src-badge">{d.source}</span>
              </div>
              <p>{d.desc}</p>
              <div className="tags">
                {d.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </button>
        ))}
      </div>
      <footer className="gallery-footer">
        원본: g1azed/hallym · g1azed/good-portfolio — jQuery/slick 의존성 제거, React hooks 기반으로 재작성
      </footer>
    </div>
  );
}
