const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const images = document.querySelectorAll("img[data-fallback]");

document.getElementById("year").textContent = new Date().getFullYear();

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 32);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.16
});

revealItems.forEach((item) => observer.observe(item));

const setImageFallback = (image) => {
  if (image.dataset.fallbackApplied === "true") {
    return;
  }

  image.dataset.fallbackApplied = "true";
  const label = image.dataset.fallback || "图片待替换";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#dcecf4"/>
          <stop offset="52%" stop-color="#eef8f6"/>
          <stop offset="100%" stop-color="#cce8ea"/>
        </linearGradient>
        <linearGradient id="line" x1="0" x2="1">
          <stop offset="0%" stop-color="#0c6fb7" stop-opacity="0"/>
          <stop offset="50%" stop-color="#20b8c7" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="#3aa76d" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)"/>
      <path d="M-80 540 C 180 360, 330 680, 590 470 S 980 250, 1290 390" fill="none" stroke="url(#line)" stroke-width="8"/>
      <path d="M-80 300 C 190 140, 360 420, 620 250 S 990 90, 1280 220" fill="none" stroke="url(#line)" stroke-width="4"/>
      <circle cx="850" cy="250" r="92" fill="none" stroke="#20b8c7" stroke-opacity="0.28" stroke-width="2"/>
      <circle cx="910" cy="330" r="10" fill="#0c6fb7" fill-opacity="0.55"/>
      <circle cx="790" cy="310" r="8" fill="#3aa76d" fill-opacity="0.55"/>
      <text x="600" y="405" text-anchor="middle" font-size="54" font-family="Arial, sans-serif" font-weight="700" fill="#102033">${label}</text>
      <text x="600" y="470" text-anchor="middle" font-size="28" font-family="Arial, sans-serif" fill="#607083">请将照片放入 images 文件夹并使用对应文件名</text>
    </svg>
  `;

  image.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

images.forEach((image) => {
  image.addEventListener("error", () => {
    setImageFallback(image);
  }, { once: true });

  if (image.complete && image.naturalWidth === 0) {
    setImageFallback(image);
  }
});
