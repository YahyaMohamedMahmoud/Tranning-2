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

gsap.registerPlugin(ScrollTrigger);

// الـ timeline الرئيسية
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".slides",
    start: "top top",
    end: "bottom+=100% top",
    scrub: 1,
    pin: true,
    anticipatePin: 1,
  },
});

// =====================================
// 1) SLIDER 1 OUT (3D FLIP)
// =====================================

tl.to(
  ".slider-1",
  {
    rotateX: 25,
    rotateY: 8,
    scale: 0.9,
    opacity: 0,
    transformOrigin: "center top",
    ease: "none",
    duration: 1,
  },
  0
);

// =====================================
// 2) SLIDER 2 ENTER + SHOW
// =====================================

// نخليه يظهر أول ما يبدأ دوره
tl.to(
  ".slider-2",
  {
    opacity: 1,
    duration: 0.1,
    ease: "none",
  },
  0
);

// الأنيميشن الأساسي بتاع دخوله
tl.fromTo(
  ".slider-2",
  { yPercent: 100 },
  {
    yPercent: 0,
    ease: "none",
    duration: 1,
  },
  0
);

// =====================================
// 3) SLIDER 2 OUT (3D FLIP)
// =====================================

tl.to(
  ".slider-2",
  {
    rotateX: 25,
    rotateY: 8,
    scale: 0.9,
    opacity: 0,
    transformOrigin: "center top",
    ease: "none",
    duration: 1,
  },
  1
);

// =====================================
// 4) SLIDER 3 ENTER + SHOW
// =====================================

// يظهر لحظة بداية دخوله
tl.to(
  ".slider-3",
  {
    opacity: 1,
    duration: 0.1,
    ease: "none",
  },
  1
);

// دخوله من تحت
tl.fromTo(
  ".slider-3",
  { yPercent: 100 },
  {
    yPercent: 0,
    ease: "none",
    duration: 1,
  },
  1
);








gsap.registerPlugin(ScrollTrigger);

const imgs = gsap.utils.toArray(".lf-img");
const total = imgs.length;

// نصف قطر الدائرة في البداية (أكبر من الشاشة)
const startRadius = 700;
const endRadius = 0;

// مواضع البداية لكل صورة (من جميع الاتجاهات)
const startPositions = [
  { angle: 0, distance: startRadius },      // يمين
  { angle: -Math.PI / 2, distance: startRadius }, // فوق
  { angle: Math.PI, distance: startRadius },     // شمال
  { angle: Math.PI / 2, distance: startRadius },  // تحت
  { angle: Math.PI / 4, distance: startRadius },  // يمين فوق
  { angle: -Math.PI / 4, distance: startRadius }, // يمين تحت
  { angle: 3 * Math.PI / 4, distance: startRadius } // شمال فوق
];

// ضبط الصور في مواقعها الأولية
imgs.forEach((img, i) => {
  const pos = startPositions[i];
  const x = Math.cos(pos.angle) * pos.distance;
  const y = Math.sin(pos.angle) * pos.distance;
  
  gsap.set(img, {
    x: x,
    y: y,
    scale: i < 2 ? 0.3 : 0, // أول صورتين يبدأوا بحجم صغير
    opacity: 0, // كل الصور تبدأ مخفية
    zIndex: total - i // الـ z-index مظبوط من البداية
  });
});

// Timeline للـ Scroll
const tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".lifestyle",
    start: "top top",
    end: "bottom+=400% top", // زودت المسافة علشان يبقى أبطأ
    scrub: 2.5, // زودت الـ scrub علشان يبقى أكثر سلاسة
    pin: true,
    anticipatePin: 1
  }
});

imgs.forEach((img, i) => {
  const startDelay = i * 0.4; // زودت الـ delay شوية
  const pos = startPositions[i];
  
  // أول صورتين: zoom in effect + fade in
  if (i < 2) {
    tl2.to(img, {
      scale: 1,
      opacity: 1,
      duration: 2.2, // زودت المدة
      ease: "power2.out"
    }, startDelay);
  } else {
    // باقي الصور: fade in بشكل تدريجي
    tl2.to(img, {
      opacity: 1,
      duration: 2, // زودت المدة
      ease: "power2.out"
    }, startDelay);
    
    tl2.to(img, {
      scale: 1,
      duration: 2,
      ease: "power2.out"
    }, startDelay);
  }
  
  // المسار الدائري مع تضييق تدريجي
  tl2.to(img, {
    duration: 4, // زودت المدة للحركة الدائرية
    ease: "power1.inOut",
    onUpdate: function() {
      const progress = this.progress();
      
      // الزاوية تدور حوالين المركز
      const rotationAmount = Math.PI * 1.2; // مقدار الدوران
      const currentAngle = pos.angle + (progress * rotationAmount);
      
      // نصف القطر يضيق تدريجياً للمركز
      const currentRadius = pos.distance * (1 - progress);
      
      const newX = Math.cos(currentAngle) * currentRadius;
      const newY = Math.sin(currentAngle) * currentRadius;
      
      gsap.set(img, {
        x: newX,
        y: newY
      });
    }
  }, startDelay + 0.5);
});

// في النهاية: الصور تثبت في المركز بشكل أكثر سلاسة
tl2.to(imgs, {
  x: 0,
  y: 0,
  duration: 2, // زودت المدة
  ease: "power1.out", // غيرت الـ ease علشان يبقى أكثر سلاسة
  stagger: 0.08 // زودت الـ stagger
}, "-=1.5");

// تأكد إن كل الصور في المركز تماماً
tl2.set(imgs, {
  x: 0,
  y: 0
});



