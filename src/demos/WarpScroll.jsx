import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────
// 맵핑할 사진: 아래 import 경로만 바꾸면 됩니다.
// src/assets/ 에 이미지를 넣고 파일명만 교체하세요. (jpg/png/webp 모두 가능)
// 평면 크기는 사진의 가로세로 비율에 맞춰 자동으로 계산됩니다.
import warpPhoto from '../assets/warp-scroll_1.jpg';
// import warpPhoto from '../assets/warp-photo.jpg';
// ─────────────────────────────────────────────────────────────

// 원본: good-portfolio/js/warp.js (Three.js + GSAP ScrollTrigger)
// 스크롤 진행도에 따라 평면 → 원통형으로 버텍스 변형
// GSAP 의존성 제거: 컨테이너 스크롤 진행도를 직접 계산

// 사진 비율 → 평면 크기 계산 (뷰포트에 맞게 클램프)
const BASE_WIDTH = 8;   // 가로 기준 크기
const MAX_HEIGHT = 5;   // 세로 사진이 화면을 벗어나지 않도록 상한

export default function WarpScroll() {
  const holderRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const holder = holderRef.current;
    const scroller = scrollRef.current;
    if (!holder || !scroller) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b0b18');
    const camera = new THREE.PerspectiveCamera(
      50, holder.clientWidth / holder.clientHeight, 0.1, 100
    );
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(holder.clientWidth, holder.clientHeight);
    holder.appendChild(renderer.domElement);

    // 사진이 로드된 뒤 비율에 맞춰 지오메트리 생성
    let geometry = null;
    let material = null;
    let posAttr = null;
    let original = null;
    let vertexCount = 0;
    let planeWidth = BASE_WIDTH;

    let progress = 1;
    let current = 1;

    // 원본 transformPaper 로직 그대로 (width만 동적)
    function transformPaper(p) {
      if (!posAttr) return;
      const positions = posAttr.array;
      const radius = planeWidth / (2 * Math.PI);
      for (let i = 0; i < vertexCount; i++) {
        const idx = i * 3;
        const x = original[idx];
        const theta = (x / planeWidth) * Math.PI * 2 * p;
        positions[idx] = radius * Math.sin(theta) * p + x * (1 - p);
        positions[idx + 2] = radius * (1 - Math.cos(theta)) * p;
      }
      posAttr.needsUpdate = true;
    }

    const texture = new THREE.TextureLoader().load(warpPhoto, (tex) => {
      // 사진 원본 픽셀 비율로 평면 크기 자동 계산
      const aspect = tex.image.width / tex.image.height;
      planeWidth = BASE_WIDTH;
      let planeHeight = planeWidth / aspect;
      if (planeHeight > MAX_HEIGHT) {
        // 세로로 긴 사진: 높이를 기준으로 다시 계산
        planeHeight = MAX_HEIGHT;
        planeWidth = planeHeight * aspect;
      }

      geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 100, 20);
      material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const paper = new THREE.Mesh(geometry, material);
      paper.rotateY(Math.PI);
      scene.add(paper);

      posAttr = geometry.attributes.position;
      original = new Float32Array(posAttr.array);
      vertexCount = posAttr.count;

      transformPaper(current);
    });
    texture.colorSpace = THREE.SRGBColorSpace;

    const onScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      // 스크롤 내릴수록 1(말림) → 0(펼침)
      progress = 1 - (max > 0 ? scroller.scrollTop / max : 0);
    };
    scroller.addEventListener('scroll', onScroll);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      // 부드러운 보간 (scrub: 1 유사)
      current += (progress - current) * 0.08;
      transformPaper(current);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = holder.clientWidth / holder.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(holder.clientWidth, holder.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      scroller.removeEventListener('scroll', onScroll);
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      texture.dispose();
      renderer.dispose();
      holder.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="three-wrap">
      <div className="three-canvas-holder" ref={holderRef} />
      <div className="three-scroll" ref={scrollRef}>
        <div className="three-scroll-inner" />
      </div>
      <p className="three-hint">스크롤하면 사진이 펼쳐집니다</p>
    </div>
  );
}
