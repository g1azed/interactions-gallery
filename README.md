# Interactions Gallery — Vanilla JS → React

바닐라 자바스크립트로 만들었던 인터랙션들(g1azed/hallym, g1azed/good-portfolio)을 React로 마이그레이션해 하나의 갤러리 SPA로 모은 프로젝트입니다.

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

## 포함된 인터랙션 (12종)

| 데모 | 원본 | 비고 |
|---|---|---|
| 가로 스크롤 섹션 | hallym/horizon-scroll.js | sticky + 진행률 인디케이터 |
| 스크롤 텍스트 리빌 | hallym/horizon-text.js | jQuery 제거, 진행도 기반 보간으로 개선 |
| 스크롤 이미지 확장 | hallym/scrollingImg.js | 40%→100% 확대 + 색상 반전 |
| 센터모드 캐러셀 | hallym/top-carousel.js | slick 제거, React state로 재구현 |
| 드래그 캐러셀 | hallym/bottom-carousel.js | slick 제거, Pointer Events + 스냅 |
| More View 복제 | hallym/more-view.js | cloneNode → state 기반 렌더 |
| 인터랙티브 맵 | hallym/map.js | 호버 프리뷰 + 팝업 + 사이드 버튼 연동 |
| 3D 원통 캐러셀 | good-portfolio/carousel.js | CSS 3D transform + 휠 회전 |
| 커서 추적 호버 이미지 | good-portfolio/detail/listMouseHover.js | mousemove 추적 |
| 필터+갤러리/리스트 전환 | good-portfolio/detail/* 6개 모듈 | 하나의 컴포넌트로 통합 |
| 종이 말림 스크롤 | good-portfolio/warp.js | Three.js 버텍스 변형, GSAP 제거 |
| 유리 굴절 3D | good-portfolio/index.js | Three.js transmission, 25MB HDR → RoomEnvironment 대체 |

## 마이그레이션 노트

- **jQuery / slick 제거**: 캐러셀류는 전부 React state + CSS transition으로 재구현
- **DOM 직접 조작 → 선언적 렌더링**: cloneNode, innerHTML 조작을 state 기반으로 전환
- **전역 스크롤 → 컨테이너 스크롤**: 각 데모가 독립된 스크롤 영역을 가져 한 페이지에서 공존 가능
- **무거운 에셋 대체**: 원본 이미지/영상(100MB+)은 그라디언트·캔버스 텍스처로 대체. `public/good.glb`(20KB)만 원본 유지
- **라우팅**: 해시 기반(#demo-id)이라 별도 라우터 의존성 없음

## 구조

```
src/
├── main.jsx          # 엔트리
├── App.jsx           # 갤러리 + 데모 뷰어 (해시 라우팅)
├── demos.js          # 데모 레지스트리 (메타데이터)
├── index.css         # 전체 스타일
└── demos/            # 인터랙션 컴포넌트 12개
```
