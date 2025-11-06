// script.js

// --- Theme Toggle Logic (Unchanged) ---
const themeToggle = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const htmlElement = document.documentElement;

const moonIcon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
const sunIcon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>';

function applyTheme(theme) {
    if (theme === 'light') {
        htmlElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        if (themeToggleIcon) themeToggleIcon.innerHTML = sunIcon;
    } else { // 'dark'
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
    const savedTheme = localStorage.getItem('theme');
    const defaultTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    applyTheme(savedTheme || defaultTheme); 
}

// --- NEW: Mobile Check ---
// Helper function to check if we're on mobile (based on lg breakpoint)
function isMobile() {
    return window.innerWidth < 1024;
}


// --- Bat Animation Script ---
const canvas = document.getElementById('bat-animation-canvas');
const ctx = canvas ? canvas.getContext('2d') : null; 
const bats = [];
// UPDATED: Reduced number of bats on mobile
const numBats = isMobile() ? 15 : 30; // Fewer bats on mobile
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
        const size = this.size;
        const flapAngle = Math.sin(this.wingFlap) * Math.PI / 6; 
        ctx.beginPath();
        ctx.ellipse(0, 0, size / 4, size / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        const wingSpan = size * 2;
        const wingHeight = size * 0.8;
        ctx.beginPath();
        ctx.moveTo(0, size * 0.1); 
        ctx.lineTo(-wingSpan * 0.2, -wingHeight * 0.5 + flapAngle * 15); 
        ctx.quadraticCurveTo(-wingSpan * 0.6, -wingHeight + flapAngle * 30, -wingSpan, -wingHeight * 0.8); 
        ctx.lineTo(-wingSpan * 0.4, -wingHeight * 0.2); 
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, size * 0.1); 
        ctx.lineTo(wingSpan * 0.2, -wingHeight * 0.5 + flapAngle * 15); 
        ctx.quadraticCurveTo(wingSpan * 0.6, -wingHeight + flapAngle * 30, wingSpan, -wingHeight * 0.8); 
        ctx.lineTo(wingSpan * 0.4, -wingHeight * 0.2); 
        ctx.closePath();
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
    for (let i = 0; i < numBats; i++) {
        bats.push(new Bat());
    }
}

function animateBats(timestamp) {
    if (!animationActive || !canvas || !ctx) {
        cancelAnimationFrame(animationFrameId);
        return;
    }
    if (!fadeStartTime) {
        fadeStartTime = timestamp + animationDuration;
    }
    let currentAlpha = 1;
    const timeElapsed = timestamp - (fadeStartTime - animationDuration);
    if (timeElapsed > animationDuration) {
        const fadeProgress = (timestamp - fadeStartTime) / fadeDuration;
        currentAlpha = Math.max(0, 1 - fadeProgress); 
        if (currentAlpha <= 0) {
            animationActive = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            console.log("Bat animation stopped gracefully.");
            return;
        }
    }
    ctx.globalAlpha = currentAlpha;
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    bats.forEach(bat => {
        bat.update();
        bat.draw();
    });
    animationFrameId = requestAnimationFrame(animateBats);
}


// --- Image Parallax Logic (UPDATED) ---
const owlContainer = document.getElementById('owl-container');
const parallaxStrength = 40; 
const floatingParallaxStrength = 10; 
let isParallaxActive = true; 

function handleMouseMove(event) {
    // NEW: Stop parallax on mobile
    if (isMobile()) return; 

    if (!owlContainer) return;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const clientX = event ? event.clientX : centerX;
    const clientY = event ? event.clientY : centerY;
    const normalizedX = (clientX - centerX) / centerX;
    const normalizedY = (clientY - centerY) / centerY;
    const currentStrength = isParallaxActive ? parallaxStrength : floatingParallaxStrength;
    const moveX = -normalizedX * currentStrength;
    const moveY = -normalizedY * currentStrength;
    if (isParallaxActive) {
        owlContainer.style.transform = `translate3d(-50%, -50%, 0) scale(1) translate3d(${moveX}px, ${moveY}px, 0)`;
    } else {
        owlContainer.classList.add('owl-scroll-state');
        owlContainer.style.transform = `scale(0.2) translate3d(${moveX}px, ${moveY}px, 0)`;
    }
}


// --- Scroll Animation Logic (UPDATED) ---
function handleScrollAnimation() {
    // NEW: Stop this entire function on mobile
    // The CSS media query now handles the mobile layout
    if (isMobile()) return; 

    if (!owlContainer) return;
    const triggerSection = document.getElementById('social-media-managing'); 
    const scrollPosition = window.scrollY;
    let triggerPoint = 500; 
    if (triggerSection) {
        triggerPoint = triggerSection.offsetTop - window.innerHeight / 4; 
    }
    const isScrollStateActive = owlContainer.classList.contains('owl-scroll-state');
    if (scrollPosition > triggerPoint && !isScrollStateActive) {
        isParallaxActive = false; 
        handleMouseMove(null); 
    } else if (scrollPosition <= triggerPoint && isScrollStateActive) {
        owlContainer.classList.remove('owl-scroll-state');
        isParallaxActive = true; 
        handleMouseMove(null); 
    }
}


// --- Chaos to Order Text Animation Logic (Unchanged) ---
function setupTextAnimation() {
    const lines = document.querySelectorAll('.animated-line');
    if (!lines.length) return;
    let totalDelay = 0;
    const letterDelay = 80; 
    lines.forEach(line => {
        const text = line.textContent;
        const letters = text.split('');
        line.innerHTML = ''; 
        letters.forEach((letter, index) => {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'letter-reveal';
            const randX = (Math.random() * 2.0 - 1.0).toFixed(2); 
            const randY = (Math.random() * 2.0 - 1.0).toFixed(2); 
            const randZ = (Math.random() * 1.5 + 0.5).toFixed(2); 
            const randRot = (Math.random() * 2.0 - 1.0).toFixed(2); 
            letterSpan.style.setProperty('--rand-x', randX);
            letterSpan.style.setProperty('--rand-y', randY);
            letterSpan.style.setProperty('--rand-z', randZ);
            letterSpan.style.setProperty('--rand-rot', randRot);
            letterSpan.innerHTML = (letter === ' ') ? '&nbsp;' : letter;
            letterSpan.style.animationDelay = `${totalDelay + index * letterDelay}ms`;
            line.appendChild(letterSpan);
        });
        totalDelay += letters.length * letterDelay;
    });
}

// --- SCROLL TO SECTION LOGIC (Unchanged) ---
function setupSmoothScroll() {
    const socialMediaLink = document.getElementById('social-media-link');
    const targetSection = document.getElementById('social-media-managing');
    if (socialMediaLink && targetSection) {
        socialMediaLink.addEventListener('click', (e) => {
            e.preventDefault(); 
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start' 
            });
            console.log("Smooth scroll to Social Media Managing section initiated.");
        });
    }
}

// Global elements for easier access
const showcaseSection = document.getElementById('product-showcase');
const phoneFrame = document.getElementById('phone-frame'); 
const screenContent = document.getElementById('screen-content');
const posterGallery = document.getElementById('poster-gallery'); 


// --- Hide functions separated for selective closing ---
function hideStoriesShowcase() {
    if (showcaseSection) {
        showcaseSection.classList.remove('max-h-[1000px]', 'opacity-100');
        showcaseSection.classList.add('max-h-0', 'opacity-0');
    }
    if (phoneFrame) {
        phoneFrame.classList.add('scale-0');
        phoneFrame.classList.remove('scale-100');
    }
    if (window.productCarouselInterval) {
        clearInterval(window.productCarouselInterval);
        window.productCarouselInterval = null;
    }
    if (screenContent) {
        screenContent.style.transform = 'translateX(0%)';
    }
    // Also hide the poster gallery if it's part of the showcase
    hidePosterGallery();
}

function hidePosterGallery() {
    if (posterGallery) {
        posterGallery.classList.remove('max-h-[2000px]', 'opacity-100');
        posterGallery.classList.add('max-h-0', 'opacity-0');
    }
}
// --- HELPER FUNCTION FOR OFFSET SCROLLING ---
function scrollWithOffset(element, offset) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}
// Helper function to start the carousel
function startProductCarousel() {
    if (!screenContent) return;
    if (window.productCarouselInterval) {
        clearInterval(window.productCarouselInterval); 
        window.productCarouselInterval = null;
    }
    const slideWidth = 33.333; 
    const transitionDuration = 1000; 
    const slideDelay = 2000; 
    let currentSlide = 0; 
    const moveSlide = () => {
        currentSlide = (currentSlide + 1) % 3; // Loop 0, 1, 2, 0...
        screenContent.style.transform = `translateX(-${slideWidth * currentSlide}%)`;
    };
    window.productCarouselInterval = setInterval(moveSlide, slideDelay + transitionDuration);
    setTimeout(moveSlide, 700);
}
// 検 MODIFIED FUNCTION: triggerProductAnimation (Always shows and scrolls)
function triggerProductAnimation() {
    if (!showcaseSection || !phoneFrame) return;
    const isHidden = showcaseSection.classList.contains('max-h-0');
    if (isHidden) {
        hidePosterGallery(); // Hide posters when showing stories
        showcaseSection.classList.remove('max-h-0', 'opacity-0', 'overflow-hidden');
        showcaseSection.classList.add('max-h-[1000px]', 'opacity-100'); // Note: max-h might need to be bigger
        showcaseSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        setTimeout(() => {
            phoneFrame.classList.add('scale-100');
            phoneFrame.classList.remove('scale-0');
        }, 300);
        startProductCarousel();
        console.log("Product Showcase (Stories) revealed and scrolled to center.");
    } else {
        // If it's already open, just hide posters and scroll
        hidePosterGallery();
        showcaseSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        if (!window.productCarouselInterval) {
            startProductCarousel();
        }
        console.log("Product Showcase (Stories) already open, hiding posters and re-scrolling.");
    }
}
// 検 MODIFIED FUNCTION: TRIGGER POSTER GALLERY (Always shows and scrolls with offset)
function triggerPosterGallery() {
    if (!posterGallery || !showcaseSection) return;
    const isHidden = posterGallery.classList.contains('max-h-0');
    const posterHeading = posterGallery.querySelector('h2'); 
    
    // First, ensure the parent container is open
    const storiesIsHidden = showcaseSection.classList.contains('max-h-0');
    if (storiesIsHidden) {
         // Open parent showcase, but don't start carousel or hide posters
        showcaseSection.classList.remove('max-h-0', 'opacity-0', 'overflow-hidden');
        showcaseSection.classList.add('max-h-[1000px]', 'opacity-100'); // This max-h must be large enough for both
        
        // Scale up phone frame so it looks consistent
        setTimeout(() => {
            phoneFrame.classList.add('scale-100');
            phoneFrame.classList.remove('scale-0');
        }, 300);
    }

    // Now, reveal the poster gallery
    if (isHidden) {
        posterGallery.classList.remove('max-h-0', 'opacity-0', 'overflow-hidden');
        posterGallery.classList.add('max-h-[2000px]', 'opacity-100'); 
    }
    
    // Stop the stories carousel
    if (window.productCarouselInterval) {
        clearInterval(window.productCarouselInterval);
        window.productCarouselInterval = null;
    }

    // Adjust parent max-height to fit both
    showcaseSection.classList.remove('max-h-[1000px]');
    showcaseSection.classList.add('max-h-[3000px]'); // Needs to be large enough for phone + posters

    if (posterHeading) {
        const headerHeightOffset = 70; 
        setTimeout(() => {
            scrollWithOffset(posterHeading, headerHeightOffset);
        }, 300);
    } else {
         posterGallery.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    console.log("Poster Gallery already open or revealed, scrolling to heading with offset.");
}
// --- Tab Switching Logic (Unchanged) ---
const storiesTab = document.getElementById('stories-tab-trigger'); 
const postersTabPhone = document.getElementById('posters-tab-trigger-phone'); 
const updatePhoneHeader = (activeElement) => {
    if (!storiesTab || !postersTabPhone) return;
    const inactiveClasses = ['text-stone-400', 'dark:text-stone-600', 'text-xs', 'cursor-pointer'];
    const activeClasses = ['text-stone-300', 'dark:text-stone-700', 'font-semibold', 'text-sm', 'cursor-default'];
    [storiesTab, postersTabPhone].forEach(btn => {
        btn.classList.remove(...activeClasses, ...inactiveClasses);
    });
    activeElement.classList.add(...activeClasses);
    const otherElement = activeElement === storiesTab ? postersTabPhone : storiesTab;
    otherElement.classList.add(...inactiveClasses);
    if (activeElement === storiesTab) {
        storiesTab.textContent = 'Instagram Stories';
        postersTabPhone.textContent = 'Posters';
    } else {
        storiesTab.textContent = 'Instagram Stories'; 
        postersTabPhone.textContent = 'Posters';
    }
};
const handleTabClick = (activeElement, slideIndex) => {
    if (!screenContent) return;
    if (window.productCarouselInterval) {
        clearInterval(window.productCarouselInterval);
        window.productCarouselInterval = null;
    }
    updatePhoneHeader(activeElement);
    const slideWidth = 33.333; 
    screenContent.style.transform = `translateX(-${slideWidth * slideIndex}%)`;
    console.log(`Switched to slide index ${slideIndex} and stopped carousel.`);
};


// 検 PIE CHART INITIALIZATION WITH UPDATED CLICK HANDLER
document.addEventListener('DOMContentLoaded', function() {
    // --- NEW: Mobile Menu Logic ---
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('-translate-x-full');
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('-translate-x-full');
            });
        });
    }

    // --- PIE CHART LOGIC (Original) ---
    const ctx = document.getElementById('socialMediaChart');
    let socialMediaChart; 

    const initChart = () => {
        if (socialMediaChart) {
            socialMediaChart.destroy();
        }
        const isDarkMode = document.documentElement.classList.contains('dark');
        const colors = [
            'rgba(168, 162, 158, 0.6)', 
            'rgba(41, 37, 36, 0.6)',    
            'rgba(87, 83, 78, 0.6)'     
        ];
        const textColor = isDarkMode ? '#f5f5f4' : '#000000';
        const datalabelsColor = isDarkMode ? '#000000' : '#f5f5f4';

        socialMediaChart = new Chart(ctx, { 
            type: 'pie',
            plugins: [ChartDataLabels],
            data: {
                // FIX 3: Pie Chart Label
                labels: ['Instagram\nstories', 'Posters', 'Product'],
                datasets: [{
                    data: [33.3, 33.3, 33.4],
                    backgroundColor: colors,
                    borderColor: 'transparent',
                    hoverOffset: 40,
                }]
            },
            options: {
                responsive: true,
                onClick: (event, elements, chart) => { 
                    if (elements.length > 0) {
                        const firstElement = elements[0];
                        const label = chart.data.labels[firstElement.index];
                        // Use startsWith to account for the \n
                        if (label.startsWith('Instagram')) { 
                            triggerProductAnimation();
                        } else if (label === 'Posters') {
                            triggerPosterGallery(); 
                        }
                    }
                },
                plugins: {
                    tooltip: { enabled: false },
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Work Distribution',
                        color: textColor,
                        font: { size: 18, weight: 'bold' }
                    },
                    datalabels: {
                        color: datalabelsColor, 
                        textAlign: 'center',
                        font: { weight: 'bold', size: 14 },
                        formatter: (value, context) => {
                            return context.chart.data.labels[context.dataIndex];
                        }
                    }
                }
            }
        });
    };

    initChart();

    document.getElementById('theme-toggle').addEventListener('click', () => {
        setTimeout(initChart, 300); 
    });
    
    if (storiesTab) {
        storiesTab.addEventListener('click', (e) => {
             e.preventDefault();
            triggerProductAnimation();
        });
    }
    if (postersTabPhone) {
        postersTabPhone.addEventListener('click', (e) => {
             e.preventDefault();
            handleTabClick(postersTabPhone, 1);
        });
    }
    if (storiesTab) updatePhoneHeader(storiesTab); 
});


// 名ｸNEW MODAL/LIGHTBOX LOGIC (Unchanged)
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image-content');
const closeModalButton = document.getElementById('close-modal');
const posterGrid = document.getElementById('poster-grid');

function openModal(imageSrc) {
    if (!modal || !modalImage) return;
    modalImage.src = imageSrc;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => {
        modal.classList.remove('opacity-0'); 
        modalImage.classList.remove('opacity-0', 'scale-90');
        modalImage.classList.add('animate-modal-zoom'); 
    }, 10);
}
function closeModal() {
    if (!modal || !modalImage) return;
    modal.classList.add('opacity-0');
    modalImage.classList.add('opacity-0', 'scale-90');
    modalImage.classList.remove('animate-modal-zoom');
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        modalImage.src = ''; 
    }, 300); 
}
if (posterGrid) {
    posterGrid.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'IMG') {
            const imageSrc = target.src;
            openModal(imageSrc);
        }
    });
}
if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
}
if (modal) {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && modal.classList.contains('flex')) {
        closeModal();
    }
});
// 名ｸEND OF NEW MODAL/LIGHTBOX LOGIC


// --- Initialization on Load (Unchanged) ---
window.addEventListener('resize', resizeCanvas); 

window.addEventListener('load', () => {
    loadTheme();
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    if (canvas && ctx) {
        resizeCanvas();
        initBats();
        requestAnimationFrame(animateBats);
    }
    setupTextAnimation();
    const rightSideList = document.getElementById('right-side-list');
    const fadeDelay = 3200;
    if (rightSideList) {
        setTimeout(() => {
            rightSideList.classList.remove('opacity-0');
            console.log("Right-side list faded in.");
        }, fadeDelay);
    }
    
    // UPDATED: These listeners now call the mobile-aware functions
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('scroll', handleScrollAnimation);

    setupSmoothScroll();
    const productLink = document.getElementById('product-link');
    if (productLink) {
        productLink.addEventListener('click', (e) => {
            e.preventDefault();
            triggerProductAnimation();
        });
    }
    
    // Initial check (will be ignored on mobile by the function itself)
    handleScrollAnimation();
    console.log("Scroll animation and floating effect enabled.");
});
