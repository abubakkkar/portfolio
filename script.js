/* ==========================================================================
   MUHAMMAD ABUBAKAR | PREMIUM PORTFOLIO CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initCustomCursor();
    initMobileNav();
    initScrollSpy();
    initContactForm();
    initSpotlightEffect();
    initScrollReveal();
});

/* ==========================================================================
   1. CUSTOM INTERACTIVE CURSOR WITH LERP SMOOTHING
   ========================================================================== */
function initCustomCursor() {
    const cursorRing = document.getElementById("magnetic-cursor");
    const cursorDot = document.getElementById("magnetic-cursor-dot");
    
    if (!cursorRing || !cursorDot) return;
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant position for inner core dot
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });
    
    // Easing loop for trailing ring
    function animateCursorRing() {
        const ease = 0.15; // Easing parameter (lower = slower lag)
        ringX += (mouseX - ringX) * ease;
        ringY += (mouseY - ringY) * ease;
        
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        
        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();
    
    // Expand cursor ring when hovering over interactive elements
    const interactiveElements = document.querySelectorAll(
        "a, button, .project-card, .skills-category-card, .highlight-card, .channel-link, input, textarea"
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            cursorRing.classList.add("cursor-magnetic-hover");
        });
        el.addEventListener("mouseleave", () => {
            cursorRing.classList.remove("cursor-magnetic-hover");
        });
    });
}

/* ==========================================================================
   2. MOBILE NAVIGATION HAMBURGER TRANSFORMATION
   ========================================================================== */
function initMobileNav() {
    const navToggle = document.getElementById("nav-toggle");
    const navLinksList = document.getElementById("nav-links");
    const links = document.querySelectorAll(".nav-link");

    if (!navToggle || !navLinksList) return;

    navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("active");
        navLinksList.classList.toggle("active");
    });

    links.forEach(link => {
        link.addEventListener("click", () => {
            navToggle.classList.remove("active");
            navLinksList.classList.remove("active");
        });
    });
}

/* ==========================================================================
   3. SCROLL SPY & LINK ACTIVE STATES
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll("section, header");
    const navLinks = document.querySelectorAll(".nav-link");

    const spyOptions = {
        root: null,
        rootMargin: "-30% 0px -50% 0px", // Focus in center area of viewport
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                
                // Track active section to trigger animations
                sections.forEach(s => s.classList.remove("active-section"));
                entry.target.classList.add("active-section");
                
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, spyOptions);

    sections.forEach(section => {
        spyObserver.observe(section);
    });
}

/* ==========================================================================
   4. CONTACT FORM SIMULATION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById("contact-form");
    const statusMsg = document.getElementById("form-status");

    if (!form || !statusMsg) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Simulating...</span><i class="fa-solid fa-spinner fa-spin"></i>`;
        statusMsg.textContent = "";
        statusMsg.className = "form-status";

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            statusMsg.textContent = "Packet dispatched successfully. Thank you for connecting!";
            statusMsg.className = "form-status success";

            form.reset();

            setTimeout(() => {
                statusMsg.textContent = "";
                statusMsg.className = "form-status";
            }, 6000);
        }, 1800);
    });
}

/* ==========================================================================
   5. MOUSE POSITION TRACKER FOR VERCEL SPOTLIGHT
   ========================================================================== */
function initSpotlightEffect() {
    const cards = document.querySelectorAll(".project-card, .skills-category-card, .highlight-card");
    
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });
}

/* ==========================================================================
   6. PROGRAMMATIC SCROLL REVEAL TRIGGERS
   ========================================================================== */
function initScrollReveal() {
    const revealTargets = document.querySelectorAll(
        ".section-header, .about-text, .highlight-card, .skills-category-card, .project-card, .timeline-item, .contact-info, .contact-form-card"
    );
    
    revealTargets.forEach(target => {
        target.classList.add("reveal-on-scroll");
    });
    
    const revealOptions = {
        root: null,
        rootMargin: "0px 0px -100px 0px", // Trigger when 100px inside screen height
        threshold: 0.05
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealTargets.forEach(target => {
        revealObserver.observe(target);
    });
}
