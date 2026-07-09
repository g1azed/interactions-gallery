import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// 원본: good-portfolio/js/index.js
// 캔버스 텍스트 배경 + MeshPhysicalMaterial(transmission)로 유리 굴절
// 변경점: 25MB HDR 대신 RoomEnvironment로 환경맵 생성 (결과 유사, 용량 0)
function makeTextTexture() {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.canvas.width = 2048;
  ctx.canvas.height = 2048;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 2048, 2048);
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 512px Helvetica';
  ctx.textAlign = 'center';
  ctx.fillText('Release', 1024, 768, 2048);
  ctx.fillText('Your', 1024, 1248, 2048);
  ctx.fillText('Power', 1024, 1728, 2048);
  return new THREE.CanvasTexture(ctx.canvas);
}

export default function GlassRefraction() {
  const holderRef = useRef(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45, holder.clientWidth / holder.clientHeight, 1, 100
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(holder.clientWidth, holder.clientHeight);
    holder.appendChild(renderer.domElement);

    // 환경맵 (HDR 파일 대체)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // 배경 텍스트 평면
    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.MeshBasicMaterial({ map: makeTextTexture() })
    );
    scene.add(bg);

    // 유리 머티리얼 (원본 파라미터 유지)
    const glassMat = new THREE.MeshPhysicalMaterial({
      thickness: 0.01,
      roughness: 0.15,
      transmission: 1,
      envMap,
      side: THREE.DoubleSide,
    });

    const pivot = new THREE.Object3D();
    scene.add(pivot);
    let mesh = null;

    // GLB 로드 (원본 good.glb), 실패 시 TorusKnot 폴백
    const addFallback = () => {
      mesh = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.9, 0.32, 200, 32),
        glassMat
      );
      pivot.add(mesh);
    };

    new GLTFLoader().load(
      `${import.meta.env.BASE_URL}good.glb`,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if (child.isMesh) child.material = glassMat;
        });
        model.position.set(-1, -0.5, 0);
        model.scale.set(100, 100, 100);
        pivot.add(model);
        mesh = model;
      },
      undefined,
      addFallback
    );

    // 마우스 패럴랙스
    let targetX = 0, targetY = 0;
    const onMouse = (e) => {
      const r = holder.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 0.6;
    };
    holder.addEventListener('mousemove', onMouse);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      pivot.rotation.y += (targetX - pivot.rotation.y) * 0.06;
      pivot.rotation.x += (targetY - pivot.rotation.x) * 0.06;
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
      holder.removeEventListener('mousemove', onMouse);
      pmrem.dispose();
      renderer.dispose();
      holder.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="three-wrap">
      <div className="three-canvas-holder" ref={holderRef} />
      <p className="three-hint">마우스를 움직여 보세요 — 유리가 뒤 텍스트를 굴절시킵니다</p>
    </div>
  );
}
