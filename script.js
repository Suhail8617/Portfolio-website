// -------------------------------------------------------------
// script.js — FIXED VERSION (NO AUTO-HIDE / NO COLLAPSING)
// with FULL Visual Strategy Carousel Fix
// -------------------------------------------------------------

// --- Theme Toggle Logic (Unchanged) ---
const themeToggle = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const htmlElement = document.documentElement;

const moonIcon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
const sunIcon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>';

function applyTheme(theme) {
    if (theme === 'light') {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        if (themeToggleIcon) themeToggleIcon.innerHTML = sunIcon;
    } else {
        htmlElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        if (themeToggleIcon) themeToggleIcon.innerHTML = moonIcon;
    }
}

function toggleTheme() {
    const isDark = htmlElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
}

function loadTheme() {
    const saved = localStorage.getItem('theme');
    const defaultTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    applyTheme(saved || defaultTheme);
}

// -------------------------------------------------------------
// BAT ANIMATION (unchanged)
// -------------------------------------------------------------
const canvas = document.getElementById('bat-animation-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const bats = [];
const numBats = 30;
const batSize = 10;
let animationActive = true;
let animationFrameId;
let fadeStartTime = 0;
const animationDuration = 5000;
const fadeDuration = 3000;

function resizeCanvas() {
    const container = document.getElementById('hero-canvas-container');
    if (canvas && container) {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        initBats();
    }
}

class Bat {
    constructor() {
        const width = canvas ? canvas.width : window.innerWidth;
        const height = canvas ? canvas.height : window.innerHeight * 0.8;

        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.size = batSize + Math.random() * 5;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = - (1.5 + Math.random() * 1.5);
        this.opacity = 0.5 + Math.random() * 0.5;
        this.wingFlap = Math.random() * Math.PI * 2;
        this.wingSpeed = 0.2 + Math.random() * 0.15;
    }

    draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.atan2(this.speedY, this.speedX) + Math.PI / 2);

        ctx.fillStyle = `rgba(40, 40, 40, ${this.opacity})`;

        const s = this.size;
        const flap = Math.sin(this.wingFlap) * Math.PI / 6;

        ctx.beginPath();
        ctx.ellipse(0, 0, s / 4, s / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        const wingSpan = s * 2;
        const wingHeight = s * 0.8;

        ctx.beginPath();
        ctx.moveTo(0, s * 0.1);
        ctx.lineTo(-wingSpan * 0.2, -wingHeight * 0.5 + flap * 15);
        ctx.quadraticCurveTo(-wingSpan * 0.6, -wingHeight + flap * 30, -wingSpan, -wingHeight * 0.8);
        ctx.lineTo(-wingSpan * 0.4, -wingHeight * 0.2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, s * 0.1);
        ctx.lineTo(wingSpan * 0.2, -wingHeight * 0.5 + flap * 15);
        ctx.quadraticCurveTo(wingSpan * 0.6, -wingHeight + flap * 30, wingSpan, -wingHeight * 0.8);
        ctx.lineTo(wingSpan * 0.4, -wingHeight * 0.2);
        ctx.fill();

        ctx.restore();
    }

    update() {
        const width = canvas ? canvas.width : window.innerWidth;
        const height = canvas ? canvas.height : window.innerHeight * 0.8;

        this.x += this.speedX;
        this.y += this.speedY;
        this.wingFlap += this.wingSpeed;

        if (this.y < -this.size * 2 || this.x < -this.size * 2 || this.x > width + this.size * 2) {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 50;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = - (1.5 + Math.random() * 1.5);
        }
    }
}

function initBats() {
    if (!canvas || !ctx) return;
    bats.length = 0;
    for (let i = 0; i < numBats; i++) bats.push(new Bat());
}

function animateBats(timestamp) {
    if (!animationActive || !canvas || !ctx) {
        cancelAnimationFrame(animationFrameId);
        return;
    }

    if (!fadeStartTime) fadeStartTime = timestamp + animationDuration;

    let alpha = 1;
    const timeElapsed = timestamp - (fadeStartTime - animationDuration);

    if (timeElapsed > animationDuration) {
        const fadeProgress = (timestamp - fadeStartTime) / fadeDuration;
        alpha = Math.max(0, 1 - fadeProgress);
        if (alpha <= 0) {
            animationActive = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }
    }

    ctx.globalAlpha = alpha;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bats.forEach(b => { b.update(); b.draw(); });

    animationFrameId = requestAnimationFrame(animateBats);
}

// -------------------------------------------------------------
// PARALLAX / SCROLL LOGIC (unchanged)
// -------------------------------------------------------------
const owlContainer = document.getElementById('owl-container');
const parallaxStrength = 40;
const floatingParallaxStrength = 10;
let isParallaxActive = true;

function handleMouseMove(event) {
    if (!owlContainer || !isParallaxActive) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const clientX = event ? event.clientX : centerX;
    const clientY = event ? event.clientY : centerY;

    const normX = (clientX - centerX) / centerX;
    const normY = (clientY - centerY) / centerY;

    const moveX = -normX * parallaxStrength;
    const moveY = -normY * parallaxStrength;

    owlContainer.style.transform =
        `translate3d(-50%, -50%, 0) scale(1) translate3d(${moveX}px, ${moveY}px, 0)`;
}




function handleScrollAnimation() {
    if (!owlContainer) return;

    const trigger = document.getElementById('social-media-managing');
    const scrollY = window.scrollY;
    const point = trigger ? trigger.offsetTop - window.innerHeight / 4 : 500;

    if (scrollY > point && !owlContainer.classList.contains('owl-scroll-state')) {
        isParallaxActive = false;
        owlContainer.classList.add('owl-scroll-state');

        // Fully override transform
        owlContainer.style.transform = 'scale(0.2)';
    } 
    else if (scrollY <= point && owlContainer.classList.contains('owl-scroll-state')) {
        isParallaxActive = true;
        owlContainer.classList.remove('owl-scroll-state');

        // Restore parallax transform
        owlContainer.style.transform = 'translate3d(-50%, -50%, 0) scale(1)';
    }
}



// -------------------------------------------------------------
// Chaos-To-Order Text Animation
// -------------------------------------------------------------
function setupTextAnimation() {
    const lines = document.querySelectorAll('.animated-line');
    if (!lines.length) return;

    let totalDelay = 0;
    const letterDelay = 80;

    lines.forEach(line => {
        const text = line.textContent;
        const letters = text.split('');

        line.innerHTML = '';

        letters.forEach((letter, i) => {
            const span = document.createElement('span');
            span.className = 'letter-reveal';

            span.style.setProperty('--rand-x', (Math.random() * 2 - 1).toFixed(2));
            span.style.setProperty('--rand-y', (Math.random() * 2 - 1).toFixed(2));
            span.style.setProperty('--rand-z', (Math.random() * 1.5 + 0.5).toFixed(2));
            span.style.setProperty('--rand-rot', (Math.random() * 2 - 1).toFixed(2));

            span.innerHTML = letter === ' ' ? '&nbsp;' : letter;
            span.style.animationDelay = `${totalDelay + i * letterDelay}ms`;

            line.appendChild(span);
        });

        totalDelay += letters.length * letterDelay;
    });
}

// -------------------------------------------------------------
// Smooth Scroll
// -------------------------------------------------------------
function setupSmoothScroll() {
    const link = document.getElementById('social-media-link');
    const section = document.getElementById('social-media-managing');

    if (!link || !section) return;

    link.addEventListener('click', e => {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// -------------------------------------------------------------
// Carousel + Showcase Logic (unchanged except hiding removed)
// -------------------------------------------------------------
const showcaseSection = document.getElementById('product-showcase');
const phoneFrame = document.getElementById('phone-frame');
const screenContent = document.getElementById('screen-content');
const posterGallery = document.getElementById('poster-gallery');

function hideStoriesShowcase() { return; }
function hidePosterGallery() { return; }
function hideAllShowcases() { return; }

function scrollWithOffset(el, offset) {
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

function startProductCarousel() {
    if (!screenContent) return;

    if (window.productCarouselInterval) {
        clearInterval(window.productCarouselInterval);
        window.productCarouselInterval = null;
    }

    const width = 33.333;
    let slide = 0;

    const move = () => {
        slide = (slide + 1) % 3;
        screenContent.style.transform = `translateX(-${width * slide}%)`;
    };

    window.productCarouselInterval = setInterval(move, 3000);
    setTimeout(move, 700);
}

function triggerProductAnimation() {
    showcaseSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (!window.productCarouselInterval) startProductCarousel();
}

function triggerPosterGallery() {
    const heading = posterGallery.querySelector('h2');
    setTimeout(() => {
        scrollWithOffset(heading, 70);
    }, 200);
}

// -------------------------------------------------------------
// Phone Tab Logic
// -------------------------------------------------------------
const storiesTab = document.getElementById('stories-tab-trigger');
const postersTabPhone = document.getElementById('posters-tab-trigger-phone');

const updatePhoneHeader = active => {
    if (!storiesTab || !postersTabPhone) return;

    const inactive = ['text-stone-400', 'dark:text-stone-600', 'text-xs', 'cursor-pointer'];
    const activeClasses = ['text-stone-300', 'dark:text-stone-700', 'font-semibold', 'text-sm'];

    [storiesTab, postersTabPhone].forEach(btn =>
        btn.classList.remove(...inactive, ...activeClasses)
    );

    active.classList.add(...activeClasses);

    const other = active === storiesTab ? postersTabPhone : storiesTab;
    other.classList.add(...inactive);
};

const handleTabClick = (active, index) => {
    if (window.productCarouselInterval) {
        clearInterval(window.productCarouselInterval);
        window.productCarouselInterval = null;
    }
    updatePhoneHeader(active);
    screenContent.style.transform = `translateX(-${33.333 * index}%)`;
};

// -------------------------------------------------------------
// PIE CHART LOGIC
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('socialMediaChart');
    let chart;

    const initChart = () => {
        if (chart) chart.destroy();

        const isDark = htmlElement.classList.contains('dark');

        chart = new Chart(ctx, {
            type: 'pie',
            plugins: [ChartDataLabels],
            data: {
                labels: ['Instagram stories', 'Posters', 'Product'],
                datasets: [{
                    data: [33.3, 33.3, 33.4],
                    backgroundColor: [
                        'rgba(168,162,158,0.6)',
                        'rgba(41,37,36,0.6)',
                        'rgba(87,83,78,0.6)'
                    ],
                    borderColor: 'transparent'
                }]
            },
            options: {
                responsive: true,
                onClick: (e, elements, chartInstance) => {
                    if (!elements.length) return;
                    const label = chartInstance.data.labels[elements[0].index];

                    if (label === 'Instagram stories') triggerProductAnimation();
                    else if (label === 'Posters') triggerPosterGallery();
                    else if (label === 'Product') {
                        const productSection = document.getElementById("product-gallery");
                        if (productSection) {
                            productSection.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                    datalabels: {
                        color: isDark ? '#000' : '#fff',
                        font: { size: 14, weight: 'bold' },
                        formatter: (_, ctx) => ctx.chart.data.labels[ctx.dataIndex]
                    }
                }
            }
        });
    };

    initChart();
    themeToggle?.addEventListener('click', () => setTimeout(initChart, 300));

    if (storiesTab) {
        storiesTab.addEventListener('click', e => {
            e.preventDefault();
            triggerProductAnimation();
        });
    }

    if (postersTabPhone) {
        postersTabPhone.addEventListener('click', e => {
            e.preventDefault();
            handleTabClick(postersTabPhone, 1);
        });
    }

    updatePhoneHeader(storiesTab);
});

// -------------------------------------------------------------
// MODAL LOGIC (unchanged + navigation added)
// -------------------------------------------------------------
const modal = document.getElementById("image-modal");
const modalImage = document.getElementById("modal-image-content");
const closeModalButton = document.getElementById("close-modal");
const posterGrid = document.getElementById("poster-grid");
const productGrid = document.getElementById("product-grid");

const modalPrev = document.getElementById("modal-prev");
const modalNext = document.getElementById("modal-next");

let modalImages = [];
let currentIndex = 0;

function openModalAt(index) {
    if (!modal || !modalImage) return;
    currentIndex = index;
    modalImage.src = modalImages[currentIndex];

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modalImage.classList.remove("opacity-0", "scale-90");
        modalImage.classList.add("animate-modal-zoom");
    }, 10);
}

function closeModal() {
    modal.classList.add("opacity-0");
    modalImage.classList.add("opacity-0", "scale-90");

    setTimeout(() => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
        modalImage.src = "";
    }, 300);
}

function showNext() {
    currentIndex = (currentIndex + 1) % modalImages.length;
    openModalAt(currentIndex);
}

function showPrev() {
    currentIndex = (currentIndex - 1 + modalImages.length) % modalImages.length;
    openModalAt(currentIndex);
}

posterGrid?.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
        modalImages = [...posterGrid.querySelectorAll("img")].map(img => img.src);
        openModalAt(modalImages.indexOf(e.target.src));
    }
});

productGrid?.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
        modalImages = [...productGrid.querySelectorAll("img")].map(img => img.src);
        openModalAt(modalImages.indexOf(e.target.src));
    }
});

closeModalButton?.addEventListener("click", closeModal);
modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });

document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("flex")) return;

    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
});

modalNext?.addEventListener("click", showNext);
modalPrev?.addEventListener("click", showPrev);

// -------------------------------------------------------------
// ✅✅ VISUAL STRATEGY — PREMIUM CAROUSEL (FIXED VERSION)
// Visual Strategy — robust index-based carousel (FINAL FIXED VERSION)
// -----------------------------
// -----------------------------
// Visual Strategy — spacer-backed index carousel (fixes unreachable edges)
// Replace previous VS carousel block with this.
// -----------------------------
(function () {
    const vsScroll = document.getElementById("vs-scroll");
    const btnNext = document.getElementById("vs-next");
    const btnPrev = document.getElementById("vs-prev");
    if (!vsScroll) return;

    // spacer class names
    const LEFT_SPACER_CLASS = "vs-spacer-left";
    const RIGHT_SPACER_CLASS = "vs-spacer-right";

    // Slides & videos (will be updated by computeLayout)
    let slides = [];
    let videos = [];

    let currentIndex = 0;
    let isAnimating = false;
    let userScrollTimer = null;

    // Create spacers (or update widths if present)
    function ensureSpacers() {
        const containerW = vsScroll.clientWidth;
        slides = Array.from(vsScroll.children).filter(n =>
            !n.classList || (!n.classList.contains(LEFT_SPACER_CLASS) && !n.classList.contains(RIGHT_SPACER_CLASS))
        );

        if (!slides.length) return;

        // measure first and last slide widths
        const firstW = slides[0].offsetWidth;
        const lastW = slides[slides.length - 1].offsetWidth;

        // desired spacer sizes so first/last can be centered
        const leftWidth = Math.max(0, Math.round(containerW / 2 - firstW / 2));
        const rightWidth = Math.max(0, Math.round(containerW / 2 - lastW / 2));

        // remove existing spacers if any
        const existingLeft = vsScroll.querySelector(`:scope > .${LEFT_SPACER_CLASS}`);
        const existingRight = vsScroll.querySelector(`:scope > .${RIGHT_SPACER_CLASS}`);
        if (existingLeft) existingLeft.remove();
        if (existingRight) existingRight.remove();

        // create new spacer elements
        const leftSpacer = document.createElement("div");
        leftSpacer.className = LEFT_SPACER_CLASS;
        leftSpacer.style.flex = `0 0 ${leftWidth}px`;
        leftSpacer.style.width = `${leftWidth}px`;
        leftSpacer.style.height = "1px"; // invisible spacer
        leftSpacer.style.pointerEvents = "none";

        const rightSpacer = document.createElement("div");
        rightSpacer.className = RIGHT_SPACER_CLASS;
        rightSpacer.style.flex = `0 0 ${rightWidth}px`;
        rightSpacer.style.width = `${rightWidth}px`;
        rightSpacer.style.height = "1px";
        rightSpacer.style.pointerEvents = "none";

        // prepend leftSpacer and append rightSpacer
        vsScroll.prepend(leftSpacer);
        vsScroll.append(rightSpacer);
    }

    function computeLayout() {
        // Ensure spacers present & sized correctly before computing slides
        ensureSpacers();

        // Now slides are the children excluding spacers
        slides = Array.from(vsScroll.children).filter(n =>
            !n.classList || (!n.classList.contains(LEFT_SPACER_CLASS) && !n.classList.contains(RIGHT_SPACER_CLASS))
        );

        // videos inside slides
        videos = slides.map(s => s.querySelector("video")).filter(Boolean);

        // ensure slides have a predictable display style for offsetLeft to work
        slides.forEach(s => {
            s.style.flex = s.style.flex || "0 0 auto";
            s.style.scrollSnapAlign = s.style.scrollSnapAlign || "center";
        });
    }

    // Scroll to target index (centers the slide). Uses offsetLeft which now includes left spacer.
    function scrollToIndex(index) {
        if (!vsScroll || !slides.length) return;
        index = Math.max(0, Math.min(index, slides.length - 1));
        currentIndex = index;
        const slideEl = slides[index];
        if (!slideEl) return;

        const containerWidth = vsScroll.clientWidth;
        const slideLeft = slideEl.offsetLeft;
        const slideWidth = slideEl.offsetWidth;

        // Desired scrollLeft so the slide is centered
        let targetScrollLeft = Math.round(slideLeft - (containerWidth / 2 - slideWidth / 2));

        // Clamp to actual scroll bounds (now that spacers exist, first/last can be centered properly)
        const maxScroll = Math.max(0, vsScroll.scrollWidth - containerWidth);
        if (targetScrollLeft < 0) targetScrollLeft = 0;
        if (targetScrollLeft > maxScroll) targetScrollLeft = maxScroll;

        // If already near target, just update highlight
        if (Math.abs(vsScroll.scrollLeft - targetScrollLeft) < 3) {
            updateHighlight();
            return;
        }

        // Start programmatic scroll
        isAnimating = true;
        vsScroll.scrollTo({ left: targetScrollLeft, behavior: "smooth" });

        const clearAfter = 520; // conservative across browsers
        if (vsScroll._animTimeout) clearTimeout(vsScroll._animTimeout);
        vsScroll._animTimeout = setTimeout(() => {
            isAnimating = false;
            updateHighlight();
        }, clearAfter);
    }

    function updateHighlight() {
        if (!videos.length) return;

        // container center measured via scrollLeft (accounts for left spacer)
        const containerCenter = vsScroll.scrollLeft + vsScroll.clientWidth / 2;

        let best = 0;
        let bestDist = Infinity;

        slides.forEach((sl, i) => {
            const left = sl.offsetLeft;
            const width = sl.offsetWidth;
            const center = left + width / 2;
            const dist = Math.abs(center - containerCenter);
            if (dist < bestDist) {
                bestDist = dist;
                best = i;
            }
        });

        currentIndex = best;

        videos.forEach((v, i) => {
            v.classList.toggle("active", i === currentIndex);
            v.classList.toggle("inactive", i !== currentIndex);
            if (i === currentIndex) {
                v.play().catch(() => {});
            } else {
                try { v.pause(); } catch (e) {}
            }
        });
    }

    function goNext() {
        if (isAnimating || slides.length === 0) return;
        const nextIndex = Math.min(currentIndex + 1, slides.length - 1);
        scrollToIndex(nextIndex);
    }

    function goPrev() {
        if (isAnimating || slides.length === 0) return;
        const prevIndex = Math.max(currentIndex - 1, 0);
        scrollToIndex(prevIndex);
    }

    btnNext?.addEventListener("click", (e) => { e.preventDefault(); goNext(); });
    btnPrev?.addEventListener("click", (e) => { e.preventDefault(); goPrev(); });

    // Handle user scroll: debounce then snap to nearest index (with edge detection)
    vsScroll.addEventListener("scroll", () => {
        if (userScrollTimer) clearTimeout(userScrollTimer);
        userScrollTimer = setTimeout(() => {
            if (!isAnimating) {
                const containerCenter = vsScroll.scrollLeft + vsScroll.clientWidth / 2;
                const maxScroll = Math.max(0, vsScroll.scrollWidth - vsScroll.clientWidth);

                // If near left edge, snap to first
                if (vsScroll.scrollLeft <= 12) {
                    scrollToIndex(0);
                    return;
                }

                // If near right edge, snap to last
                if (Math.abs(vsScroll.scrollLeft - maxScroll) <= 12) {
                    scrollToIndex(slides.length - 1);
                    return;
                }

                // Otherwise find nearest slide center
                let best = 0, bestDist = Infinity;
                slides.forEach((sl, i) => {
                    const left = sl.offsetLeft;
                    const width = sl.offsetWidth;
                    const center = left + width / 2;
                    const dist = Math.abs(center - containerCenter);
                    if (dist < bestDist) { bestDist = dist; best = i; }
                });

                scrollToIndex(best);
            }
        }, 120);
    }, { passive: true });

    // Recompute on resize (and keep centered on same logical slide)
    function resizeHandler() {
        computeLayout();
        // small delay to allow reflow
        setTimeout(() => scrollToIndex(currentIndex), 140);
    }
    window.addEventListener("resize", resizeHandler);

    // Keyboard support
    vsScroll.setAttribute("tabindex", "0");
    vsScroll.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
        if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    });

    // init
    computeLayout();
    // slight delay to allow media to load / layout
    setTimeout(() => {
        scrollToIndex(0);
        updateHighlight();
    }, 350);
})();




// -------------------------------------------------------------
// PAGE INIT
// -------------------------------------------------------------
window.addEventListener('resize', resizeCanvas);

window.addEventListener('load', () => {
    loadTheme();
    themeToggle?.addEventListener('click', toggleTheme);

    const year = document.getElementById('current-year');
    if (year) year.textContent = new Date().getFullYear();

    if (canvas && ctx) {
        resizeCanvas();
        initBats();
        requestAnimationFrame(animateBats);
    }

    setupTextAnimation();

    const rightSide = document.getElementById('right-side-list');
    setTimeout(() => rightSide?.classList.remove('opacity-0'), 3200);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScrollAnimation);
    setupSmoothScroll();

    const productLink = document.getElementById('product-link');
    productLink?.addEventListener('click', e => {
        e.preventDefault();
        triggerProductAnimation();
    });

    handleScrollAnimation();

    if (vsScroll) {
        vsVideos = Array.from(vsScroll.querySelectorAll('video'));
        setTimeout(updateHighlight, 300);
    }
});
// Smooth scroll to sections
const visualStrategyLink = document.getElementById('visual-strategy-link');
const visualStrategySection = document.getElementById('visual-strategy');

visualStrategyLink?.addEventListener('click', e => {
    e.preventDefault();
    visualStrategySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const brandingLink = document.getElementById('branding-link');
const brandingSection = document.getElementById('branding');

brandingLink?.addEventListener('click', e => {
    e.preventDefault();
    brandingSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
