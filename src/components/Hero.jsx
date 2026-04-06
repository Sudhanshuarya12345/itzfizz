import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const textContainerRef = useRef(null);
  const metricCardRefs = useRef([]);
  const letterRefs = useRef([]);
  const finishLineRef = useRef(null);
  const hasCelebrated = useRef(false);

  const triggerFireworks = () => {
    if (hasCelebrated.current) return;
    hasCelebrated.current = true;

    // Safely create emojis if supported
    const boomShape = (typeof confetti.shapeFromText === 'function') ? confetti.shapeFromText({ text: '🥳', scalar: 2 }) : 'circle';
    const partyShape = (typeof confetti.shapeFromText === 'function') ? confetti.shapeFromText({ text: '🎉', scalar: 2 }) : 'square';

    // We target the center of the finish line area dynamically
    const finishWidth = finishLineRef.current ? finishLineRef.current.offsetWidth : 150;
    const xPos = (window.innerWidth - (finishWidth / 2)) / window.innerWidth;

    const baseConfig = {
      spread: 120,
      startVelocity: 45,
      zIndex: 100,
      colors: ['#45db7d', '#ffffff', '#fa7328']
    };

    // 1. Primary mixed burst with classic pieces and Emojis
    confetti({
      ...baseConfig,
      particleCount: 100,
      shapes: ['square', 'circle', boomShape, partyShape],
      origin: { x: xPos, y: 0.5 }
    });

    // 2. Secondary burst to act as "sparkles" (pure yellow/white stars)
    confetti({
      particleCount: 80,
      spread: 140,
      startVelocity: 35,
      shapes: ['star'],
      colors: ['#FFE400', '#FFBD00', '#FFF', '#FFCA6C'],
      origin: { x: xPos, y: 0.5 }
    });

    // 3. Optional side bursts for a fuller "boom" at one place
    confetti({
      ...baseConfig,
      particleCount: 50,
      spread: 80,
      shapes: ['circle', boomShape],
      origin: { x: xPos + 0.02, y: 0.4 }
    });

    confetti({
      ...baseConfig,
      particleCount: 50,
      spread: 80,
      shapes: ['square', partyShape],
      origin: { x: xPos - 0.02, y: 0.6 }
    });
  };

  useGSAP(() => {
    // Initial Load Animation
    const tl = gsap.timeline();
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );
    [0, 1, 2, 3].forEach((index) => {
      const card = metricCardRefs.current[index];
      if (!card) return;
      gsap.set(card, {
        autoAlpha: 0,
        y: index % 2 === 0 ? -18 : 18,
        scale: 0.96
      });
    });

    // Exact Car & Track animation with full section pinning
    gsap.to(carRef.current, {
      x: () => {
        const finishWidth = finishLineRef.current ? finishLineRef.current.offsetWidth : 150;
        return document.documentElement.clientWidth - finishWidth;
      },
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => "+=" + (window.innerHeight * 2), // Gives exactly 200vh of scroll scrub
        scrub: true,
        pin: true, // PIN THE ENTIRE SECTION so the page refuses to scroll down until completed
        invalidateOnRefresh: true,
        onLeave: () => triggerFireworks(),
        onEnterBack: () => { hasCelebrated.current = false; } // Reset so they can enjoy it again if they scroll up
      },
      onUpdate: function () {
        if (!carRef.current || !textContainerRef.current) return;

        const finishWidth = finishLineRef.current ? finishLineRef.current.offsetWidth : 150;
        const carX = gsap.getProperty(carRef.current, "x") + (finishWidth / 2);

        // Match the exact reveal logic for letters
        const valueRectLeft = textContainerRef.current.getBoundingClientRect().left;

        letterRefs.current.forEach((letter) => {
          if (!letter) return;
          const letterX = valueRectLeft + letter.offsetLeft;
          if (carX >= letterX) {
            letter.style.opacity = 1;
          } else {
            letter.style.opacity = 0;
          }
        });

        // Trail width exact logic
        if (trailRef.current) {
          gsap.set(trailRef.current, { width: carX });
        }

        if (metricCardRefs.current.length) {
          const thresholds = [0.2, 0.4, 0.6, 0.8];
          const preRevealWindow = 0.12;
          [0, 1, 2, 3].forEach((index) => {
            const card = metricCardRefs.current[index];
            if (!card) return;
            const threshold = thresholds[index];
            const start = Math.max(0, threshold - preRevealWindow);
            const progressInWindow = gsap.utils.clamp(0, 1, (this.progress() - start) / preRevealWindow);

            // Smoothstep interpolation for softer appear/disappear transitions.
            const t = progressInWindow * progressInWindow * (3 - 2 * progressInWindow);

            gsap.set(card, {
              autoAlpha: t,
              y: (index % 2 === 0 ? -18 : 18) * (1 - t),
              scale: 0.96 + (0.04 * t)
            });
          });
        }
      }
    });

  }, { scope: containerRef });

  return (
    // Instead of bleeding 200vh relative, we enforce screen-height and pin it
    <section
      ref={containerRef}
      className="w-full h-screen bg-[#d1d1d1] overflow-hidden text-[#111] font-sans flex flex-col items-center justify-center relative"
    >

      {/* Top alternate cards */}
      <div className="relative w-full h-[132px] sm:h-[165px] md:h-[190px] z-10 mb-5 md:mb-14">
        <div ref={(el) => { metricCardRefs.current[0] = el; }} className="absolute left-[27.2%] top-0 w-[clamp(120px,27vw,370px)] bg-[#2ECC71] rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center shadow-lg text-[#111] transition-transform hover:-translate-y-1">
          <span className="text-3xl sm:text-4xl md:text-[58px] md:leading-none font-bold">99%</span>
          <span className="text-[10px] sm:text-xs md:text-sm mt-3 font-semibold uppercase">Performance</span>
          <p className="text-[10px] sm:text-xs mt-2 text-center opacity-75">Optimum speed & setup</p>
        </div>

        <div ref={(el) => { metricCardRefs.current[2] = el; }} className="absolute left-[57.4%] top-0 w-[clamp(120px,27vw,370px)] bg-[#333] rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center shadow-lg text-white transition-transform hover:-translate-y-1">
          <span className="text-3xl sm:text-4xl md:text-[58px] md:leading-none font-bold">10x</span>
          <span className="text-[10px] sm:text-xs md:text-sm mt-3 font-semibold uppercase text-gray-300">Efficiency</span>
          <p className="text-[10px] sm:text-xs mt-2 text-center text-gray-400">Scale without limits</p>
        </div>
      </div>

      {/* The Exact Road (Elevated realism with interior shadow) */}
      <div className="relative w-full h-[90px] sm:h-[130px] md:h-[170px] lg:h-[220px] bg-[#1e1e1e] overflow-hidden flex items-center shadow-[inset_0_15px_25px_rgba(0,0,0,0.6)] border-y-[4px] border-[#333]">

        {/* Realistic Road Markings */}
        <div 
          className="absolute top-1/2 left-0 w-full h-[3px] sm:h-[6px] -translate-y-1/2 z-0 opacity-40 pointer-events-none"
          style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 30px, white 30px, white 70px)' }}
        ></div>

        {/* The Glowing Trail */}
        <div
          ref={trailRef}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#45db7d11] to-[#45db7d] w-0 z-10"
        />

        {/* The Finish Line Checkered Flag (z-20 forces it ABOVE green trail) */}
        <div
          ref={finishLineRef}
          className="absolute right-0 top-0 h-full w-[30px] sm:w-[45px] md:w-[60px] lg:w-[75px] bg-[length:30px_30px] sm:bg-[length:45px_45px] md:bg-[length:60px_60px] lg:bg-[length:75px_75px] z-20 border-l-[3px] border-white shadow-[-10px_0_20px_rgba(0,0,0,0.3)]"
          style={{
            backgroundImage: "conic-gradient(#ffffff 25%, #111111 0 50%, #ffffff 0 75%, #111111 0)"
          }}
        />

        {/* The Text Letters */}
        <div
          ref={textContainerRef}
          className="absolute left-0 right-[30px] sm:right-[45px] md:right-[60px] lg:right-[75px] top-0 bottom-0 z-20 flex justify-center items-center px-[1%] sm:px-[1.25%] md:px-[2%] lg:px-[2.75%] drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)]"
        >
          {"WELCOME ITZFIZZ".split('').map((char, index) => (
            <span
              key={index}
              ref={el => letterRefs.current[index] = el}
              className="text-white font-extrabold opacity-0 transition-opacity duration-75 whitespace-nowrap tracking-[0.058em] text-[clamp(38px,9vw,224px)]"
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>

        {/* The Car (Realistic drop shadow added) */}
        <img
          ref={carRef}
          src="https://paraschaturvedi.github.io/car-scroll-animation/McLaren%20720S%202022%20top%20view.png"
          alt="McLaren 720S Top View"
          className="absolute top-0 left-0 h-full z-30 transform-gpu drop-shadow-[-15px_10px_15px_rgba(0,0,0,0.7)]"
          onLoad={() => ScrollTrigger.refresh()}
        />

      </div>

      {/* Remaining cards stay below */}
      <div className="relative w-full h-[132px] sm:h-[165px] md:h-[190px] z-10 mt-8 md:mt-12">
        <div ref={(el) => { metricCardRefs.current[1] = el; }} className="absolute left-[42.2%] top-0 w-[clamp(120px,27vw,370px)] bg-[#6ac9ff] rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center shadow-lg text-[#111] transition-transform hover:-translate-y-1">
          <span className="text-3xl sm:text-4xl md:text-[58px] md:leading-none font-bold">24/7</span>
          <span className="text-[10px] sm:text-xs md:text-sm mt-3 font-semibold uppercase">Reliability</span>
          <p className="text-[10px] sm:text-xs mt-2 text-center opacity-75">Always strictly stable</p>
        </div>

        <div
          ref={(el) => { metricCardRefs.current[3] = el; }}
          className="absolute top-0 w-[clamp(120px,27vw,370px)] bg-[#fa7328] rounded-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center shadow-lg text-[#111] transition-transform hover:-translate-y-1"
          style={{ left: 'min(72.4%, calc(100% - clamp(120px, 27vw, 370px) - 16px))' }}
        >
          <span className="text-3xl sm:text-4xl md:text-[58px] md:leading-none font-bold">+300</span>
          <span className="text-[10px] sm:text-xs md:text-sm mt-3 font-semibold uppercase">Integrations</span>
          <p className="text-[10px] sm:text-xs mt-2 text-center opacity-75">Seamless network</p>
        </div>
      </div>

    </section>
  );
};

export default Hero;
