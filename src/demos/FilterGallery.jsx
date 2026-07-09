import { useMemo, useState } from 'react';

// 원본: good-portfolio/js/detail/{filter,gallery,list,galleryloadMore,listMoreView,layout}.js
// 6개 모듈(필터/갤러리/리스트/더보기/레이아웃 전환)을 하나의 컴포넌트로 통합
const CATEGORIES = ['전체', '이커머스', '금융', '교육', '기업·브랜드', '공공기관', '기타'];

const GRADS = [
  'linear-gradient(135deg,#65a30d,#d9f99d)', 'linear-gradient(135deg,#1c72f2,#bfdbfe)',
  'linear-gradient(135deg,#7c3aed,#ddd6fe)', 'linear-gradient(135deg,#e11d48,#fecdd3)',
  'linear-gradient(135deg,#0d9488,#99f6e4)', 'linear-gradient(135deg,#ca8a04,#fef08a)',
];

// 원본 projects.js 데이터 이관
const PROJECTS = [
  { title: 'EQL Renewal Project', firm: '한섬', category: '이커머스', year: '2023', award: true },
  { title: 'KONJIAM 비대면 서비스', firm: 'KONJIAM', category: '기업·브랜드', year: '2023', award: true },
  { title: 'THE HANDSOME.COM Renewal', firm: '한섬', category: '교육', year: '2023', award: false },
  { title: 'EWHA University Renewal', firm: '이화여자대학교', category: '교육', year: '2023', award: false },
  { title: 'RAWQUEST: 라이온코리아', firm: '라이온코리아', category: '기업·브랜드', year: '2023', award: false },
  { title: 'TWIN Restaurant', firm: '대한민국 정부', category: '금융', year: '2023', award: false },
  { title: '2022 커머스 리뉴얼', firm: '한섬', category: '이커머스', year: '2022', award: true },
  { title: '2022 브랜드 사이트', firm: 'KONJIAM', category: '기업·브랜드', year: '2022', award: true },
  { title: '2022 교육 플랫폼', firm: '한섬', category: '교육', year: '2022', award: false },
  { title: '2022 대학 리뉴얼', firm: '이화여자대학교', category: '교육', year: '2022', award: false },
  { title: '2022 기업 홍보관', firm: '라이온코리아', category: '기업·브랜드', year: '2022', award: false },
  { title: '2021 커머스 구축', firm: '한섬', category: '이커머스', year: '2021', award: true },
  { title: '2021 브랜드 리뉴얼', firm: 'KONJIAM', category: '기업·브랜드', year: '2021', award: true },
  { title: '2021 LMS 구축', firm: '한섬', category: '교육', year: '2021', award: false },
  { title: '2021 대학 홈페이지', firm: '이화여자대학교', category: '교육', year: '2021', award: false },
  { title: '공공 데이터 포털', firm: '대한민국 정부', category: '공공기관', year: '2021', award: false },
  { title: '금융 대시보드', firm: 'TWIN', category: '금융', year: '2021', award: false },
  { title: '사내 인트라넷', firm: '라이온코리아', category: '기타', year: '2021', award: false },
];

const PAGE = 6;

export default function FilterGallery() {
  const [category, setCategory] = useState('전체');
  const [layout, setLayout] = useState('gallery'); // 'gallery' | 'list'
  const [visible, setVisible] = useState(PAGE);

  const filtered = useMemo(() => {
    const list = category === '전체'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === category);
    // 원본: 연도 내림차순 정렬
    return [...list].sort((a, b) => b.year - a.year);
  }, [category]);

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  const changeCategory = (c) => {
    setCategory(c);
    setVisible(PAGE); // 원본: categoryChanged 이벤트 시 초기화
  };

  return (
    <div className="scroll-area">
      <div className="fg-wrap">
        <div className="fg-toolbar">
          <div className="fg-filters">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`fg-filter${category === c ? ' active' : ''}`}
                onClick={() => changeCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="fg-layouts">
            <button
              className={`fg-layout-btn${layout === 'gallery' ? ' on' : ''}`}
              onClick={() => setLayout('gallery')}
              title="갤러리 보기"
            >
              ▦
            </button>
            <button
              className={`fg-layout-btn${layout === 'list' ? ' on' : ''}`}
              onClick={() => setLayout('list')}
              title="리스트 보기"
            >
              ☰
            </button>
          </div>
        </div>

        {shown.length === 0 && <p className="fg-empty">해당 카테고리에 프로젝트가 없습니다.</p>}

        {layout === 'gallery' ? (
          <div className="fg-gal">
            {shown.map((p, i) => (
              <div key={p.title + i} className="fg-gal-item">
                <div className="fg-gal-img" style={{ background: GRADS[i % GRADS.length] }}>
                  <div className="fg-gal-hover">VIEW PROJECT →</div>
                </div>
                <div className="fg-gal-text">
                  <p className="t">{p.title}</p>
                  <p className="c">{p.category} · {p.year}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {shown.map((p, i) => (
              <div key={p.title + i} className="fg-list-row">
                <span className="y">{p.year}</span>
                <span className="t">{p.title}</span>
                <span className="f">{p.firm}</span>
                <span className="cat">{p.category}</span>
                <span className="fg-award">{p.award ? '🏆' : ''}</span>
              </div>
            ))}
          </div>
        )}

        {hasMore && (
          <button className="fg-more" onClick={() => setVisible((v) => v + PAGE)}>
            MORE VIEW ({filtered.length - visible})
          </button>
        )}
      </div>
    </div>
  );
}
