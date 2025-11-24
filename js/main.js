gsap.registerPlugin(ScrollTrigger);

const frameCount = 548;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

const container = document.querySelector(".videos-frames");
container.innerHTML = "";
container.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const currentFrame = (index) =>
  `videoframes-imgs/frame_${String(index).padStart(4, "0")}.webp`;

const images = [];
const frame = { index: 1 };

// ==============================
// تحميل الصور
// ==============================
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

images[1].onload = () => render();

// ==============================
// hero-text الرئيسي
// ==============================
const mainHero = document.querySelector(".hero-text");
gsap.set(mainHero, {
  top: "43%",
  left: "50%",
  xPercent: -50,
  yPercent: -50,
  opacity: 1,
  position: "absolute",
  textAlign: "center",
});

// ==============================
// hero-text2/3/4 مع h2 stagger حسب الفريمات
// ==============================
const textBlocks = [
  { selector: ".hero-text2", start: 50, end: 200 },
  { selector: ".hero-text3", start: 201, end: 350 },
  { selector: ".hero-text4", start: 351, end: 548 },
];

textBlocks.forEach((block) => {
  const el = document.querySelector(block.selector);
  if (!el) return;
  const h2s = el.querySelectorAll("h2");
  gsap.set(el, { overflow: "hidden" });
  gsap.set(h2s, { y: 60, opacity: 0 });
});

// ==============================
// تحديث النصوص حسب الفريم الحالي
// ==============================
function updateHeroText() {
  // ==============================
  // main hero-text يتحرك تدريجيًا مع الفريمات
  // ==============================
  const mainStart = 1;
  const mainEnd = 100;
  if (frame.index < mainStart) {
    mainHero.style.opacity = 0;
    mainHero.style.transform = "translate(-50%, 60px)";
  } else if (frame.index <= mainEnd) {
    const p = (frame.index - mainStart) / (mainEnd - mainStart);
    mainHero.style.opacity = 1 - p;
    mainHero.style.transform = `translate(-50%, ${-p * window.innerHeight}px)`;
  } else {
    mainHero.style.opacity = 0;
    mainHero.style.transform = `translate(-50%, -100vh)`;
  }

  // ==============================
  // باقي النصوص (h2) مع stagger ظهور واختفاء
  // ==============================
  textBlocks.forEach((block) => {
    const el = document.querySelector(block.selector);
    if (!el) return;
    const h2s = el.querySelectorAll("h2");
    const totalFrames = block.end - block.start;
    const frameProgress = (frame.index - block.start) / totalFrames;

    h2s.forEach((h2, i) => {
      const stagger = 0.15;

      const startAppear = i * stagger;
      const endAppear = startAppear + stagger;

      const startDisappear = 1 - stagger * (h2s.length - i);
      const endDisappear = startDisappear + stagger;

      if (frame.index < block.start) {
        h2.style.opacity = 0;
        h2.style.transform = `translateY(60px)`;
      } else if (frame.index > block.end) {
        h2.style.opacity = 0;
        h2.style.transform = `translateY(-60px)`;
      } else {
        // ظهور تدريجي
        if (frameProgress >= startAppear && frameProgress <= endAppear) {
          const p = (frameProgress - startAppear) / stagger;
          h2.style.opacity = p;
          h2.style.transform = `translateY(${60 * (1 - p)}px)`;
        }
        // اختفاء تدريجي (الأولى تختفي أولًا)
        else if (
          frameProgress >= startDisappear &&
          frameProgress <= endDisappear
        ) {
          const p = (frameProgress - startDisappear) / stagger;
          h2.style.opacity = 1 - p;
          h2.style.transform = `translateY(${-60 * p}px)`;
        }
        // الوضع الطبيعي أثناء البين
        else if (frameProgress > endAppear && frameProgress < startDisappear) {
          h2.style.opacity = 1;
          h2.style.transform = `translateY(0px)`;
        }
      }
    });
  });
}

// ==============================
// render الصور
// ==============================
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = images[frame.index];
  const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
  const x = canvas.width / 2 - (img.width * scale) / 2;
  const y = canvas.height / 2 - (img.height * scale) / 2;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

  updateHeroText();
}

// ==============================
// ScrollTrigger للفريمات مع تأخير الصور
// ==============================
const imageDelay = 50;

gsap.to(frame, {
  index: frameCount - 1,
  snap: "index",
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom+=9000 top",
    scrub: 1.5,
    pin: true,
  },
  onUpdate: () => {
    setTimeout(render, imageDelay);
  },
});






// ==============================
// Slider animations
// ==============================




// gsap.registerPlugin(ScrollTrigger);

// // الـ timeline الرئيسية
// const tl = gsap.timeline({
//   scrollTrigger: {
//     trigger: ".slides",
//     start: "top top",
//     end: "bottom+=100% top",
//     scrub: 1,
//     pin: true,
//     anticipatePin: 1,
//   }
// });

// // =====================================
// // 1) SLIDER 1 OUT (3D FLIP)
// // =====================================

// tl.to(".slider-1", {
//   rotateX: 25,
//   rotateY: 8,
//   scale: 0.9,
//   opacity: 0,
//   transformOrigin: "center top",
//   ease: "none",
//   duration: 1
// }, 0);


// // =====================================
// // 2) SLIDER 2 ENTER + SHOW
// // =====================================

// // نخليه يظهر أول ما يبدأ دوره
// tl.to(".slider-2", {
//   opacity: 1,
//   duration: 0.1,
//   ease: "none"
// }, 0);

// // الأنيميشن الأساسي بتاع دخوله
// tl.fromTo(".slider-2", 
//   { yPercent: 100 },
//   { 
//     yPercent: 0,
//     ease: "none",
//     duration: 1
//   }, 0
// );


// // =====================================
// // 3) SLIDER 2 OUT (3D FLIP)
// // =====================================

// tl.to(".slider-2", {
//   rotateX: 25,
//   rotateY: 8,
//   scale: 0.9,
//   opacity: 0,
//   transformOrigin: "center top",
//   ease: "none",
//   duration: 1
// }, 1);


// // =====================================
// // 4) SLIDER 3 ENTER + SHOW
// // =====================================

// // يظهر لحظة بداية دخوله
// tl.to(".slider-3", {
//   opacity: 1,
//   duration: 0.1,
//   ease: "none"
// }, 1);

// // دخوله من تحت
// tl.fromTo(".slider-3",
//   { yPercent: 100 },
//   {
//     yPercent: 0,
//     ease: "none",
//     duration: 1
//   }, 1
// );
