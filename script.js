// script.js

// --- Theme Toggle Logic (Unchanged) ---
const themeToggle = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const htmlElement = document.documentElement;

// Icons for theme change (Sun and Moon SVGs)
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


// --- Bat Animation Script (Unchanged) ---
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

        const size = this.size;
        const flapAngle = Math.sin(this.wingFlap) * Math.PI / 6; 

        // Body (subtle oval)
        ctx.beginPath();
        ctx.ellipse(0, 0, size / 4, size / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wings 
        const wingSpan = size * 2;
        const wingHeight = size * 0.8;

        // Left wing
        ctx.beginPath();
        ctx.moveTo(0, size * 0.1); 
        ctx.lineTo(-wingSpan * 0.2, -wingHeight * 0.5 + flapAngle * 15); 
        ctx.quadraticCurveTo(-wingSpan * 0.6, -wingHeight + flapAngle * 30, -wingSpan, -wingHeight * 0.8); 
        ctx.lineTo(-wingSpan * 0.4, -wingHeight * 0.2); 
        ctx.closePath();
        ctx.fill();

        // Right wing
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


// --- Image Parallax Logic (Unchanged) ---
const owlContainer = document.getElementById('owl-container');
const parallaxStrength = 40; 
const floatingParallaxStrength = 10; 

let isParallaxActive = true; 

function handleMouseMove(event) {
    if (!owlContainer) return;

    // Get the center of the viewport
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Use dummy coordinates if event object is not provided (e.g., when called by scroll handler)
    const clientX = event ? event.clientX : centerX;
    const clientY = event ? event.clientY : centerY;

    // Calculate normalized position (-1 to 1) relative to center
    const normalizedX = (clientX - centerX) / centerX;
    const normalizedY = (clientY - centerY) / centerY;
    
    // Determine which strength to use
    const currentStrength = isParallaxActive ? parallaxStrength : floatingParallaxStrength;
    
    // Calculate translation amount
    const moveX = -normalizedX * currentStrength;
    const moveY = -normalizedY * currentStrength;

    // Apply the translation
    if (isParallaxActive) {
        // State 1: Centered on Hero Section (Strong Parallax)
        owlContainer.style.transform = `translate3d(-50%, -50%, 0) scale(1) translate3d(${moveX}px, ${moveY}px, 0)`;
    } else {
        // State 2: Pinned to Corner (Floating Icon)
        owlContainer.classList.add('owl-scroll-state');
        owlContainer.style.transform = `scale(0.2) translate3d(${moveX}px, ${moveY}px, 0)`;
    }
}


// --- Scroll Animation Logic (Unchanged) ---
function handleScrollAnimation() {
    if (!owlContainer) return;
    
    // UPDATED: Use the Social Media section as the trigger point
    const triggerSection = document.getElementById('social-media-managing'); 
    const scrollPosition = window.scrollY;
    
    let triggerPoint = 500; // Default fallback 
    
    if (triggerSection) {
        // The image should shrink/move when the hero section is scrolled past 
        // and the top of the social media section comes into view.
        triggerPoint = triggerSection.offsetTop - window.innerHeight / 4; 
    }
    
    // Check if the state is about to change
    const isScrollStateActive = owlContainer.classList.contains('owl-scroll-state');

    if (scrollPosition > triggerPoint && !isScrollStateActive) {
        // State is transitioning to 'pinned' 
        isParallaxActive = false; 
        
        handleMouseMove(null); 
        
    } else if (scrollPosition <= triggerPoint && isScrollStateActive) {
        // State is transitioning back to 'large' 
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
            
            // Scroll smoothly to the target section
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
    
    // Stop the carousel when hiding
    if (window.productCarouselInterval) {
        clearInterval(window.productCarouselInterval);
        window.productCarouselInterval = null;
    }
    if (screenContent) {
          // Reset slide position when closing
        screenContent.style.transform = 'translateX(0%)';
    }
}

function hidePosterGallery() {
    if (posterGallery) {
        posterGallery.classList.remove('max-h-[2000px]', 'opacity-100');
        posterGallery.classList.add('max-h-0', 'opacity-0');
    }
}

function hideAllShowcases() {
    hideStoriesShowcase();
    hidePosterGallery();
}


// --- HELPER FUNCTION FOR OFFSET SCROLLING ---
/**
 * Scrolls to an element with a fixed pixel offset, accounting for a fixed header.
 * @param {HTMLElement} element The element to scroll to.
 * @param {number} offset The pixel height of the fixed header.
 */
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
        clearInterval(window.productCarouselInterval); // Clear existing interval if running
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
    
    // Start the first move after a short delay
    setTimeout(moveSlide, 700);
}


// 🌟 MODIFIED FUNCTION: triggerProductAnimation (Always shows and scrolls)
function triggerProductAnimation() {
    if (!showcaseSection || !phoneFrame) return;

    const isHidden = showcaseSection.classList.contains('max-h-0');

    if (isHidden) {
        // --- REVEAL LOGIC (First Click) ---
        hidePosterGallery();

        showcaseSection.classList.remove('max-h-0', 'opacity-0', 'overflow-hidden');
        showcaseSection.classList.add('max-h-[1000px]', 'opacity-100');
        
        // Scroll to the section
        showcaseSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Scale the phone frame up
        setTimeout(() => {
            phoneFrame.classList.add('scale-100');
            phoneFrame.classList.remove('scale-0');
        }, 300);
        
        startProductCarousel();
        
        console.log("Product Showcase (Stories) revealed and scrolled to center.");

    } else {
        // --- SCROLL LOGIC (Second Click or subsequent clicks) ---
        showcaseSection.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        if (!window.productCarouselInterval) {
            startProductCarousel();
        }
        
        console.log("Product Showcase (Stories) already open, re-scrolling to center.");
    }
}


// 🌟 MODIFIED FUNCTION: TRIGGER POSTER GALLERY (Always shows and scrolls with offset)
function triggerPosterGallery() {
    if (!posterGallery || !showcaseSection) return;

    const isHidden = posterGallery.classList.contains('max-h-0');
    
    // Get the specific heading for scrolling target
    const posterHeading = posterGallery.querySelector('h2'); 
    
    // If hidden, reveal it first
    if (isHidden) {
        // 1. Ensure the Stories showcase is OPEN (if closed, open it first)
        const storiesIsHidden = showcaseSection.classList.contains('max-h-0');
        if (storiesIsHidden) {
             triggerProductAnimation(); 
        }

        // 2. Make the Gallery section visible
        posterGallery.classList.remove('max-h-0', 'opacity-0', 'overflow-hidden');
        posterGallery.classList.add('max-h-[2000px]', 'opacity-100'); 
    }
    
    // 3. Always scroll smoothly to the HEADING with a FIXED OFFSET (for both first and subsequent clicks)
    if (posterHeading) {
        // !!! IMPORTANT: ADJUST THIS VALUE to match the height of your fixed navigation header !!!
        const headerHeightOffset = 70; 

        // Wait briefly for the reveal transition to start before scrolling
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
const storiesTab = document.getElementById('stories-tab-trigger'); // Main title button
const postersTabPhone = document.getElementById('posters-tab-trigger-phone'); // Second button


/**
 * Updates the text and switches the active styles for the tabs inside the phone.
 */
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
    
    // Logic for setting the visible text
    if (activeElement === storiesTab) {
        storiesTab.textContent = 'Instagram Stories';
        postersTabPhone.textContent = 'Posters';
    } else {
        storiesTab.textContent = 'Instagram Stories'; // Note: Main button text stays constant
        postersTabPhone.textContent = 'Posters';
    }
};

/**
 * Handles the manual click on a tab/button inside the phone mockup.
 */
const handleTabClick = (activeElement, slideIndex) => {
    if (!screenContent) return;

    // 1. Stop the automatic carousel if it's running
    if (window.productCarouselInterval) {
        clearInterval(window.productCarouselInterval);
        window.productCarouselInterval = null;
    }
    
    // 2. Update the header and tab styles
    updatePhoneHeader(activeElement);

    // 3. Manually set the slide position
    const slideWidth = 33.333; 
    screenContent.style.transform = `translateX(-${slideWidth * slideIndex}%)`;
    console.log(`Switched to slide index ${slideIndex} and stopped carousel.`);
};


// 🌟 PIE CHART INITIALIZATION WITH UPDATED CLICK HANDLER
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('socialMediaChart');
    let socialMediaChart; 

    const initChart = () => {
        // Destroy existing chart instance if it exists
        if (socialMediaChart) {
            socialMediaChart.destroy();
        }

        const isDarkMode = document.documentElement.classList.contains('dark');
        
        // Define colors and border based on theme
        const colors = [
            'rgba(168, 162, 158, 0.6)', // Instagram stories (stone-400/600)
            'rgba(41, 37, 36, 0.6)',    // Posters (stone-800/darkBrown)
            'rgba(87, 83, 78, 0.6)'     // Product (stone-600/800)
        ];
        const textColor = isDarkMode ? '#f5f5f4' : '#000000';
        const datalabelsColor = isDarkMode ? '#000000' : '#f5f5f4';

        socialMediaChart = new Chart(ctx, { 
            type: 'pie',
            plugins: [ChartDataLabels],
            data: {
                labels: ['Instagram stories', 'Posters', 'Product'],
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
                        
                        // 1. Handle Instagram Stories Click
                        if (label === 'Instagram stories') { 
                            triggerProductAnimation();
                        // 2. Handle Posters Click
                        } else if (label === 'Posters') {
                            triggerPosterGallery(); // Uses the updated function
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: false
                    },
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: 'Work Distribution',
                        color: textColor,
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    },
                    datalabels: {
                        color: datalabelsColor, 
                        textAlign: 'center',
                        font: {
                            weight: 'bold',
                            size: 14
                        },
                        formatter: (value, context) => {
                            return context.chart.data.labels[context.dataIndex];
                        }
                    }
                }
            }
        });
    };

    // Initialize the chart
    initChart();

    // Re-render chart on theme change
    document.getElementById('theme-toggle').addEventListener('click', () => {
        // Wait a moment for the theme class to be applied before re-initializing
        setTimeout(initChart, 300); 
    });
    
    // --- Updated Tab Change Event Listeners (Use handleTabClick) ---
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
    
    // Set initial active state (default to STORIES as the first slide)
    if (storiesTab) updatePhoneHeader(storiesTab); 
});


// 🖼️ NEW MODAL/LIGHTBOX LOGIC
const modal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image-content');
const closeModalButton = document.getElementById('close-modal');
const posterGrid = document.getElementById('poster-grid');

/**
 * Opens the modal, sets the image source, and applies the zoom-in animation.
 * @param {string} imageSrc The URL of the image to display.
 */
function openModal(imageSrc) {
    if (!modal || !modalImage) return;

    modalImage.src = imageSrc;
    
    // 1. Show the modal container (Opacity 0)
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // 2. Delay the opacity transition and zoom animation
    setTimeout(() => {
        // Fade in the background
        modal.classList.remove('opacity-0'); 
        
        // Zoom in the image (this class is defined in the inline Tailwind config)
        modalImage.classList.remove('opacity-0', 'scale-90');
        modalImage.classList.add('animate-modal-zoom'); 
    }, 10);
}

/**
 * Closes the modal with a fade-out effect.
 */
function closeModal() {
    if (!modal || !modalImage) return;

    // 1. Start the fade-out/zoom-out transition
    modal.classList.add('opacity-0');
    modalImage.classList.add('opacity-0', 'scale-90');
    modalImage.classList.remove('animate-modal-zoom');

    // 2. Hide the modal completely after the transition is finished (300ms)
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        modalImage.src = ''; // Clear the image source
    }, 300); 
}

// 3. Add Event Listeners for the Poster Grid
if (posterGrid) {
    posterGrid.addEventListener('click', (event) => {
        const target = event.target;
        // Check if the clicked element is an image with the correct tag
        if (target.tagName === 'IMG') {
            const imageSrc = target.src;
            openModal(imageSrc);
        }
    });
}

// 4. Event listener for the close button
if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
}

// 5. Event listener for clicking the background overlay
if (modal) {
    modal.addEventListener('click', (event) => {
        // Close if the click target is the modal background itself
        if (event.target === modal) {
            closeModal();
        }
    });
}

// 6. Close on Escape key press
document.addEventListener('keydown', (event) => {
    // Check if the modal is currently visible (has the 'flex' class)
    if (event.key === 'Escape' && modal && modal.classList.contains('flex')) {
        closeModal();
    }
});
// 🖼️ END OF NEW MODAL/LIGHTBOX LOGIC


// --- Initialization on Load (Unchanged) ---
window.addEventListener('resize', resizeCanvas); 

window.addEventListener('load', () => {
    // 1. Load theme preference
    loadTheme();
    
    // 2. Add event listener for theme toggle
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    // 3. Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 4. Bat animation setup
    if (canvas && ctx) {
        resizeCanvas();
        initBats();
        requestAnimationFrame(animateBats);
    }
    
    // 5. Run the new text animation
    setupTextAnimation();

    // 6. Delayed Fade-In for Right-Side Skills List
    const rightSideList = document.getElementById('right-side-list');
    const fadeDelay = 3200;
    
    if (rightSideList) {
        setTimeout(() => {
            rightSideList.classList.remove('opacity-0');
            console.log("Right-side list faded in.");
        }, fadeDelay);
    }
    
    // 7. Add Parallax mouse movement listener
    document.addEventListener('mousemove', handleMouseMove);
    
    // 8. Add Scroll Animation listener
    document.addEventListener('scroll', handleScrollAnimation);

    // 9. Setup smooth scroll for Social Media link
    setupSmoothScroll();
    
    // 10. Add click listener to the 'Logo designing' link (which toggles the STORIES showcase)
    const productLink = document.getElementById('product-link');
    if (productLink) {
        productLink.addEventListener('click', (e) => {
            e.preventDefault();
            triggerProductAnimation();
        });
    }
    
    // 11. Initial check in case the user loads the page scrolled down
    handleScrollAnimation();
    console.log("Scroll animation and floating effect enabled.");
});