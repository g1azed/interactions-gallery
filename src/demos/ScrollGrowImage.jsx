import { useRef, useState } from 'react';

// 원본: hallym/vision.html (인라인 GSAP + ScrollTrigger + Lenis)
// 1) .scrolling_img_Wrap: width 85vw / height 85vh / y+300 → 100% / 100% / y0 (스크롤 500px 스크럽)
// 2) .t-black: 이미지 상단이 뷰포트 35% 지점에 오면 clip-path inset(0 0 0)→(0 0 100%) (100px 스크럽)
//    → 검정 텍스트가 아래에서 위로 잘려나가며, 뒤에 겹쳐둔 흰색 복사본이 이미지 위로 드러남 (색 반전 효과)
// GSAP 의존성 제거: 컨테이너 스크롤 진행도로 동일 계산

const clamp = (v) => Math.min(1, Math.max(0, v));

function VisionText({ white }) {
  return (
    <div className={white ? 'sg-t-white' : 'sg-t-black'}>
      <p className="sg-sub18">VISION 2030+</p>
      <h2 className="sg-main80">VISION 2030+</h2>
      <p className="sg-sub18">
        한림의 40년 과거를 돌아보면서 무엇이 중요한지, 무엇을 해야 하는지 알게 되었습니다.<br />
        우리는 변할 것 입니다. 새로운 계획은 변화를 주도할 것입니다. 움직이는 곳에 새로운 기회가 <br />
        만들어지고, 변화하는 곳에 창조와 혁신이 깃들 것입니다. <br />
      </p>
    </div>
  );
}

export default function ScrollGrowImage() {
  const scrollRef = useRef(null);
  const imgWrapRef = useRef(null);
  const [state, setState] = useState({ p1: 0, p2: 0 });

  const onScroll = () => {
    const el = scrollRef.current;
    const wrap = imgWrapRef.current;
    if (!el || !wrap) return;

    // 1) 이미지 확장: start "top top", end "+=500"
    const p1 = clamp(el.scrollTop / 500);

    // 2) 텍스트 클립: start "top 35%", end "+=100"
    const contTop = el.getBoundingClientRect().top;
    const relTop = wrap.getBoundingClientRect().top - contTop;
    const p2 = clamp((el.clientHeight * 0.35 - relTop) / 100);

    setState({ p1, p2 });
  };

  const { p1, p2 } = state;
  const ch = scrollRef.current?.clientHeight ?? 800;

  return (
    <div className="scroll-area sg-wrap" ref={scrollRef} onScroll={onScroll}>
      <section className="sg-section1">
        {/* sticky 텍스트: 검정(위) + 흰색(아래) 복사본 겹침 */}
        <div className="sg-sticky-text">
          <div style={{ position: 'relative' }}>
            <div style={{ clipPath: `inset(0 0 ${p2 * 100}%)`, position: 'relative', zIndex: 2 }}>
              <VisionText />
            </div>
            <VisionText white />
          </div>
        </div>

        {/* scrolling_img_Wrap */}
        <div
          className="sg-img-wrap"
          ref={imgWrapRef}
          style={{
            width: `${85 + 15 * p1}%`,
            height: `${(0.85 + 0.15 * p1) * ch}px`,
            transform: `translateY(${300 * (1 - p1)}px)`,
          }}
        >
          <img src={`${import.meta.env.BASE_URL}visionscroll.png`} alt="VISION 2030+" />
        </div>
      </section>

      {/* vision_section_2 */}
      <section className="sg-section2">
        <p className="sg-sub32">
          한림대학은 '풍부한 인간성과 창조적 지성을 지닌 인재를 양성하고,<br />
          학술 및 문화의 진흥을 도모' 함으로써 '개인의 성장, 사회의 발전, <br />
          국가의 번영, 인류의 행복에 기여함'을 실현하기 위해 매진했습니다.
        </p>
      </section>
    </div>
  );
}
