/* ==========================================================================
   MUHAMMAD ABUBAKAR | PREMIUM PORTFOLIO CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initScrollReset();
    initBackToTop();
    initCustomCursor();
    initMobileNav();
    initScrollSpy();
    initContactForm();
    initSpotlightEffect();
    initScrollReveal();
    initProfileHub();
});

/* ========================================================================== 
   0. FORCE PAGE TO START AT THE TOP ON LOAD/RELOAD
   ========================================================================== */
function initScrollReset() {
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    const scrollToTop = () => window.scrollTo(0, 0);

    window.addEventListener("load", scrollToTop, { once: true });
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            scrollToTop();
        }
    });
}

/* ==========================================================================
   1. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
    const button = document.getElementById("scroll-to-top");

    if (!button) return;

    const toggleVisibility = () => {
        button.classList.toggle("visible", window.scrollY > 400);
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ==========================================================================
   2. CUSTOM INTERACTIVE CURSOR WITH GPU TRANSFORM LERP SMOOTHING
   ========================================================================== */
function initCustomCursor() {
    const cursorRing = document.getElementById("magnetic-cursor");
    const cursorDot = document.getElementById("magnetic-cursor-dot");
    
    if (!cursorRing || !cursorDot) return;

    const isTouchLikeDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouchLikeDevice) {
        cursorRing.hidden = true;
        cursorDot.hidden = true;
        return;
    }
    
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isCursorActive = false;
    
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isCursorActive) {
            isCursorActive = true;
            ringX = mouseX;
            ringY = mouseY;
            cursorRing.classList.add("visible");
            cursorDot.classList.add("visible");
        }
        
        // Instant GPU position for inner core dot
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });
    
    document.addEventListener("mouseleave", () => {
        cursorRing.classList.remove("visible");
        cursorDot.classList.remove("visible");
        isCursorActive = false;
    });

    document.addEventListener("mouseenter", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        ringX = mouseX;
        ringY = mouseY;
        cursorRing.classList.add("visible");
        cursorDot.classList.add("visible");
        isCursorActive = true;
    });
    
    // Easing loop for trailing ring (GPU-accelerated translate3d)
    function animateCursorRing() {
        if (isCursorActive) {
            const ease = 0.18; // Smooth lag factor
            ringX += (mouseX - ringX) * ease;
            ringY += (mouseY - ringY) * ease;
            
            cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
        }
        
        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();
    
    // Expand cursor ring using Event Delegation (covers dynamically created elements)
    const interactiveSelector = "a, button, .project-card, .skills-category-card, .highlight-card, .channel-link, input, textarea, .btn, .nav-link, .suggested-btn, .chatbot-trigger, .chatbot-close-btn, .chatbot-send-btn, .project-view-btn, .modal-tab";
    
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest(interactiveSelector)) {
            cursorRing.classList.add("cursor-magnetic-hover");
        }
    });
    
    document.addEventListener("mouseout", (e) => {
        if (e.target.closest(interactiveSelector)) {
            cursorRing.classList.remove("cursor-magnetic-hover");
        }
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
                    if (link.getAttribute("href") === `${id}`) {
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

/* ==========================================================================
   7. PROFILE HUB & PDF EXPORT / JSON IMPORT SYSTEM
   ========================================================================== */
const DEFAULT_PROFILE = {
  "name": "Muhammad Abubakar",
  "title": "Software Engineer",
  "tagline": "Building scalable, reliable, and intelligent software systems.",
  "location": "Lahore, Pakistan",
  "bio": "I am a Software Engineer passionate about software development and problem-solving. I enjoy learning new technologies, developing real-world projects, and continuously improving my programming and software engineering skills. Currently, I am focused on strengthening my full-stack development expertise and contributing to innovative software solutions.",
  "about": "Software Engineer specializing in C#, .NET, Python, and backend system design.",
  "skills": {
    "Programming Languages": ["C#", "Python", "JavaScript", "TypeScript"],
    "Frontend Development": ["HTML5", "CSS3", "React", "Responsive Design"],
    "Frameworks & Backend": [".NET", "Node.js", "Django", "ASP.NET"],
    "Databases": ["Microsoft SQL Server", "PostgreSQL", "MySQL", "SQLite"],
    "AI Tools": ["ChatGPT", "Claude Code", "Gemini", "Prompt Engineering", "AntiGravity", "Copilot", "OpenAI API"],
    "APIs & Authentication": ["RESTful APIs", "OpenAPI", "Swagger", "API Integration", "API Keys"],
    "Development & Version Control": ["Git", "GitHub", "Visual Studio", "VS Code"],
    "Cloud & DevOps": ["Google Cloud", "Supabase", "Docker", "CI/CD", "GitHub Actions", "Linux"],
    "UI/UX & Platforms": ["Figma", "Canva", "WordPress"]
  },
  "projects": [
    {
      "title": "AirWrite",
      "badge": "AI Stack",
      "description": "A full-stack web application that allows users to write in the air using hand gestures. Utilizes computer vision techniques for gesture recognition and translates them into text input.",
      "technologies": ["ASP.NET & Node.js", "C#", "TypeScript", "Supabase"],
      "live_url": "https://airwrite-ai.ai.studio/",
      "github_url": "https://github.com/abubakkkar/airwrite"
    },
    {
      "title": "BrainSpark Quiz System",
      "badge": "Full Stack",
      "description": "A full-stack adaptive exam simulator containing detailed tab monitoring routines to prevent exam tab cheating, role delegation metrics, and detailed question query filters.",
      "technologies": ["ASP.NET", "C#", "SQL Server"],
      "live_url": null,
      "github_url": "https://github.com/abubakkkar/OnlineQuizSystem"
    },
    {
      "title": "ShopIt (E-Commerce)",
      "badge": "Full Stack",
      "description": "A clean, server-side rendered Django commerce layout featuring multi-user roles, transactional integrity models, session storage controls, and interactive admin metrics.",
      "technologies": ["Python", "Django", "SQLite"],
      "live_url": null,
      "github_url": "https://github.com/abubakkkar/shopit"
    },
    {
      "title": "Youtube MP3 Downloader",
      "badge": "Downloader",
      "description": "A lightweight C# application that leverages yt-dlp and FFmpeg to download YouTube videos in MP3 format. Features a simple GUI, download progress tracking, and error handling for invalid URLs.",
      "technologies": ["C#", ".NET", "yt-dlp & FFmpeg"],
      "live_url": null,
      "github_url": "https://github.com/abubakkkar/YoutubeToMP3Downloader"
    },
    {
      "title": "Hunza Din Restaurant",
      "badge": "UI Design",
      "description": "A custom single-page restaurant dashboard. Incorporates dynamic catalog updates, local shopping cart models, and structural table booking verification forms.",
      "technologies": ["HTML5", "CSS Grid", "Vanilla JS"],
      "live_url": "https://hunzadin.netlify.app/",
      "github_url": "https://github.com/abubakkkar/hunzadin"
    },
    {
      "title": "Apexify Company Web",
      "badge": "UI Design",
      "description": "A commercial company landing page developed during my engineering internship. Fully responsive layouts with subtle animations and grid structures.",
      "technologies": ["HTML5", "CSS Variables", "Responsive UI"],
      "live_url": "https://apexify.vercel.app",
      "github_url": "https://github.com/abubakkkar/ApexcifyTechnologys_Website"
    },
    {
      "title": "CashIt (Banking System)",
      "badge": "Simulation",
      "description": "A secure ledger-based transaction simulator. Features simulated user logins, account balance update locks, and ledger transaction log audits.",
      "technologies": ["HTML CSS", "JavaScript", "JSON Storage"],
      "live_url": "https://cashit-banking.netlify.app/",
      "github_url": "https://github.com/abubakkkar/cashit"
    }
  ],
  "experience": [
    {
      "title": "Co-Founder",
      "organization": "Slang",
      "period": "Aug 2026 - Present",
      "link": "https://slang-intro.vercel.app/"
    },
    {
      "title": "Frontend Developer",
      "organization": "FlyRank AI",
      "period": "July 2026 - Present",
      "link": "https://flyrank.ai/"
    }
  ],
  "education": [
    {
      "degree": "BS Software Engineering",
      "institution": "University of Engineering and Technology Lahore",
      "period": "2025 - Present",
      "link": "https://uet.edu.pk/"
    },
    {
      "degree": "Intermediate",
      "institution": "Government College University Lahore",
      "period": "2023 - 2025",
      "link": "https://gcu.edu.pk/"
    },
    {
      "degree": "Matriculation",
      "institution": "St. Anthony's High School Lahore",
      "period": "2021 - 2023",
      "link": "https://stanthonys.edu.pk/"
    }
  ],
  "contact": {
    "public_email": "muhammadabubakar85033@gmail.com",
    "linkedin": "https://www.linkedin.com/in/muhammad-abubakar-84944337a/",
    "github": "https://github.com/abubakkkar"
  }
};

let currentProfile = { ...DEFAULT_PROFILE };

function getStoredProfile() {
    try {
        const saved = localStorage.getItem("user_profile_data");
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.warn("Could not parse saved profile from localStorage:", e);
    }
    return DEFAULT_PROFILE;
}

function initProfileHub() {
    currentProfile = getStoredProfile();

    // DOM Elements
    const modal = document.getElementById("profile-modal");
    const closeBtn = document.getElementById("modal-close");
    const toast = document.getElementById("modal-toast");
    const jsonTextarea = document.getElementById("json-textarea");
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("json-file-input");
    
    const navDownloadPdf = document.getElementById("nav-download-pdf");
    const navImportBtn = document.getElementById("nav-import-profile");
    const heroDownloadPdf = document.getElementById("hero-download-pdf");
    const heroImportBtn = document.getElementById("hero-import-profile");
    
    const modalDownloadPdf = document.getElementById("modal-download-pdf");
    const modalDownloadJson = document.getElementById("modal-download-json");
    const btnApplyJson = document.getElementById("btn-apply-json");
    const btnResetProfile = document.getElementById("btn-reset-profile");
    const tabs = document.querySelectorAll(".modal-tab");

    // Helper to open Modal
    const openModal = (tabName = "import-tab") => {
        if (!modal) return;
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        switchTab(tabName);
        if (jsonTextarea && !jsonTextarea.value) {
            jsonTextarea.value = JSON.stringify(currentProfile, null, 2);
        }
    };

    // Helper to close Modal
    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        if (toast) {
            toast.className = "modal-toast";
            toast.textContent = "";
        }
    };

    // Helper to switch tabs
    const switchTab = (tabId) => {
        tabs.forEach(t => {
            if (t.dataset.tab === tabId) {
                t.classList.add("active");
            } else {
                t.classList.remove("active");
            }
        });
        document.querySelectorAll(".modal-tab-content").forEach(content => {
            if (content.id === tabId) {
                content.classList.add("active");
            } else {
                content.classList.remove("active");
            }
        });
    };

    // Toast feedback
    const showToast = (msg, isSuccess = true) => {
        if (!toast) return;
        toast.textContent = msg;
        toast.className = `modal-toast ${isSuccess ? "success" : "error"}`;
        setTimeout(() => {
            if (toast) {
                toast.className = "modal-toast";
                toast.textContent = "";
            }
        }, 5000);
    };

    // Event Listeners for Open Modal
    if (navImportBtn) navImportBtn.addEventListener("click", () => openModal("import-tab"));
    if (heroImportBtn) heroImportBtn.addEventListener("click", () => openModal("import-tab"));

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Tabs listener
    tabs.forEach(t => {
        t.addEventListener("click", () => switchTab(t.dataset.tab));
    });

    // PDF Download / Open Triggers
    const triggerPdfDownload = () => {
        generatePDFResume(currentProfile, (success) => {
            if (success) {
                showToast("Opening CV in a new tab...", true);
            } else {
                showToast("Failed to open CV. Please try again.", false);
            }
        });
    };

    if (navDownloadPdf) navDownloadPdf.addEventListener("click", triggerPdfDownload);
    if (heroDownloadPdf) heroDownloadPdf.addEventListener("click", triggerPdfDownload);
    if (modalDownloadPdf) modalDownloadPdf.addEventListener("click", triggerPdfDownload);

    // JSON Download Trigger
    if (modalDownloadJson) {
        modalDownloadJson.addEventListener("click", () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentProfile, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `${(currentProfile.name || 'abubakar').toLowerCase().replace(/\s+/g, '_')}_profile.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            showToast("Profile JSON exported successfully!", true);
        });
    }

    // Drag & Drop File Upload
    if (dropZone && fileInput) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files.length > 0) {
                readJsonFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                readJsonFile(e.target.files[0]);
            }
        });
    }

    function readJsonFile(file) {
        if (!file.name.endsWith('.json')) {
            showToast("Please select a valid .json file.", false);
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                jsonTextarea.value = JSON.stringify(parsed, null, 2);
                showToast("JSON file loaded into editor! Click 'Import & Apply' to save.", true);
            } catch (err) {
                showToast("Error parsing JSON file: Invalid JSON structure.", false);
            }
        };
        reader.readAsText(file);
    }

    // Apply JSON
    if (btnApplyJson) {
        btnApplyJson.addEventListener("click", () => {
            try {
                const rawText = jsonTextarea.value.trim();
                if (!rawText) {
                    showToast("JSON input is empty. Paste or upload JSON data first.", false);
                    return;
                }
                const newProfile = JSON.parse(rawText);

                if (!newProfile.name) {
                    showToast("Profile JSON must contain at least a 'name' field.", false);
                    return;
                }

                currentProfile = { ...DEFAULT_PROFILE, ...newProfile };
                localStorage.setItem("user_profile_data", JSON.stringify(currentProfile));
                updateDOMWithProfile(currentProfile);
                showToast("Profile imported and applied successfully!", true);
            } catch (err) {
                showToast("Invalid JSON string! Please check your formatting.", false);
            }
        });
    }

    // Reset Profile
    if (btnResetProfile) {
        btnResetProfile.addEventListener("click", () => {
            localStorage.removeItem("user_profile_data");
            currentProfile = { ...DEFAULT_PROFILE };
            if (jsonTextarea) {
                jsonTextarea.value = JSON.stringify(DEFAULT_PROFILE, null, 2);
            }
            updateDOMWithProfile(DEFAULT_PROFILE);
            showToast("Profile reset to original default state!", true);
        });
    }

    // Initial DOM update if custom profile stored
    if (localStorage.getItem("user_profile_data")) {
        updateDOMWithProfile(currentProfile);
    }
}

/* Dynamic DOM Update */
function updateDOMWithProfile(profile) {
    if (!profile) return;

    // Hero
    const heroTitle = document.querySelector(".hero-title");
    const heroSubtitle = document.querySelector(".hero-subtitle");
    const heroTagline = document.querySelector(".hero-tagline");
    const heroDesc = document.querySelector(".hero-desc");

    if (heroTitle && profile.name) heroTitle.textContent = profile.name;
    if (heroSubtitle && profile.title) heroSubtitle.textContent = profile.title;
    if (heroTagline && profile.tagline) heroTagline.textContent = profile.tagline;
    if (heroDesc && (profile.about || profile.bio)) heroDesc.textContent = profile.about || profile.bio;

    // About
    const aboutText = document.querySelector(".highlight-info p");
    if (aboutText && profile.bio) aboutText.textContent = profile.bio;

    // Skills Matrix
    const skillsGrid = document.querySelector(".skills-grid");
    if (skillsGrid && profile.skills && typeof profile.skills === 'object') {
        const categoryIcons = {
            "programming_languages": "fa-code",
            "Programming Languages": "fa-code",
            "frontend_development": "fa-display",
            "Frontend Development": "fa-display",
            "frameworks_and_backend": "fa-layer-group",
            "Frameworks & Backend": "fa-layer-group",
            "databases": "fa-database",
            "Databases": "fa-database",
            "ai_tools": "fa-brain",
            "AI Tools": "fa-brain",
            "apis_and_authentication": "fa-plug",
            "APIs & Authentication": "fa-plug",
            "development_and_version_control": "fa-code-branch",
            "Development & Version Control": "fa-code-branch",
            "cloud_and_devops": "fa-cloud",
            "Cloud & DevOps": "fa-cloud",
            "ui_ux_and_platforms": "fa-pen-ruler",
            "UI/UX & Platforms": "fa-pen-ruler"
        };

        let skillsHtml = "";
        for (const [key, skillList] of Object.entries(profile.skills)) {
            if (!Array.isArray(skillList) || skillList.length === 0) continue;
            const formatTitle = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
            const iconClass = categoryIcons[key] || categoryIcons[formatTitle] || "fa-gear";

            const chipsHtml = skillList.map(skill => `<span class="skill-chip">${skill}</span>`).join("\n");

            skillsHtml += `
                <div class="skills-category-card">
                    <h4 class="category-title">
                        <i class="fa-solid ${iconClass}"></i>
                        ${formatTitle}
                    </h4>
                    <div class="skill-chips">
                        ${chipsHtml}
                    </div>
                </div>
            `;
        }
        if (skillsHtml) skillsGrid.innerHTML = skillsHtml;
    }

    // Projects Grid
    const projectsGrid = document.querySelector(".projects-grid");
    if (projectsGrid && Array.isArray(profile.projects)) {
        const projectsHtml = profile.projects.map(proj => {
            const liveBtn = proj.live_url ? `
                <a href="${proj.live_url}" target="_blank" class="project-view-btn">
                    View Project <i class="fa-solid fa-arrow-right"></i>
                </a>` : '';
            const gitBtn = proj.github_url ? `
                <a href="${proj.github_url}" target="_blank" class="project-view-btn">
                    View Code <i class="fa-solid fa-arrow-right"></i>
                </a>` : '';

            const techTags = Array.isArray(proj.technologies) ? proj.technologies.map(t => `<span>${t}</span>`).join('') : '';

            return `
                <div class="project-card">
                    <div class="project-card-header">
                        <span class="project-badge">${proj.badge || 'Project'}</span>
                        ${liveBtn}
                        ${gitBtn}
                    </div>
                    <h4 class="project-card-title">${proj.title}</h4>
                    <p class="project-card-desc">${proj.description}</p>
                    <div class="project-tech-tags">${techTags}</div>
                </div>
            `;
        }).join('');
        if (projectsHtml) projectsGrid.innerHTML = projectsHtml;
    }

    // Re-initialize Spotlight hover effect
    if (typeof initSpotlightEffect === 'function') {
        initSpotlightEffect();
    }
}

/* PDF Generator Function */
function generatePDFResume(profile, callback) {
    if (!window.html2pdf) {
        alert("PDF generator library is still loading. Please try again in a moment.");
        if (callback) callback(false);
        return;
    }

    // Ensure PDF template element exists
    let pdfContainer = document.getElementById("pdf-export-container");
    if (!pdfContainer) {
        pdfContainer = document.createElement("div");
        pdfContainer.id = "pdf-export-container";
        document.body.appendChild(pdfContainer);
    }

    const skillsSummary = [];
    if (profile.skills) {
        for (const [cat, list] of Object.entries(profile.skills)) {
            if (Array.isArray(list)) {
                const catName = cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                skillsSummary.push(`<div><div class="pdf-skill-cat">${catName}</div><div class="pdf-skill-tags">${list.join(', ')}</div></div>`);
            }
        }
    }

    const experienceHtml = Array.isArray(profile.experience) ? profile.experience.map(exp => `
        <div class="pdf-item">
            <div class="pdf-item-header">
                <span>${exp.title} &bull; ${exp.organization}</span>
                <span>${exp.period || ''}</span>
            </div>
        </div>
    `).join('') : '';

    const projectsHtml = Array.isArray(profile.projects) ? profile.projects.slice(0, 5).map(p => `
        <div class="pdf-item">
            <div class="pdf-item-header">
                <span>${p.title} (${p.badge || 'Project'})</span>
            </div>
            <div class="pdf-text">${p.description}</div>
            <div class="pdf-skill-tags">Tech: ${Array.isArray(p.technologies) ? p.technologies.join(', ') : ''}</div>
        </div>
    `).join('') : '';

    const educationHtml = Array.isArray(profile.education) ? profile.education.map(edu => `
        <div class="pdf-item">
            <div class="pdf-item-header">
                <span>${edu.degree} &bull; ${edu.institution}</span>
                <span>${edu.period || ''}</span>
            </div>
        </div>
    `).join('') : '';

    const contactEmail = profile.contact?.public_email || 'muhammadabubakar85033@gmail.com';
    const contactLinkedin = profile.contact?.linkedin || 'https://www.linkedin.com/in/muhammad-abubakar-84944337a/';
    const contactGithub = profile.contact?.github || 'https://github.com/abubakkkar';
    const location = profile.location || 'Lahore, Pakistan';

    pdfContainer.innerHTML = `
        <div class="pdf-header">
            <div class="pdf-name">${profile.name}</div>
            <div class="pdf-title">${profile.title}</div>
            <div class="pdf-contact-row">
                <span><i class="fa-solid fa-envelope"></i> ${contactEmail}</span>
                <span><i class="fa-solid fa-location-dot"></i> ${location}</span>
                <span><i class="fa-brands fa-linkedin"></i> LinkedIn</span>
                <span><i class="fa-brands fa-github"></i> GitHub</span>
            </div>
        </div>

        <div class="pdf-section">
            <div class="pdf-section-title">Professional Summary</div>
            <div class="pdf-text">${profile.bio || profile.about || profile.tagline}</div>
        </div>

        <div class="pdf-section">
            <div class="pdf-section-title">Technical Expertise</div>
            <div class="pdf-skills-grid">
                ${skillsSummary.join('')}
            </div>
        </div>

        ${experienceHtml ? `
        <div class="pdf-section">
            <div class="pdf-section-title">Work Experience</div>
            ${experienceHtml}
        </div>` : ''}

        ${projectsHtml ? `
        <div class="pdf-section">
            <div class="pdf-section-title">Key Projects</div>
            ${projectsHtml}
        </div>` : ''}

        ${educationHtml ? `
        <div class="pdf-section">
            <div class="pdf-section-title">Education</div>
            ${educationHtml}
        </div>` : ''}
    `;

    window.open("data/cvupdated.pdf", "_blank");
    if (callback) callback(true);
}

