document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. Mobile Hamburger Menu
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ==========================================
    // 2. Floating Anthem Button (Audio Player)
    // ==========================================
    const musicBtn = document.getElementById('music-btn');
    const anthem = document.getElementById('anthem');
    
    if (musicBtn && anthem) {
        const icon = musicBtn.querySelector('i');
        let isPlaying = false;
        
        // Set volume to a reasonable level
        anthem.volume = 0.3; 

        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                anthem.pause();
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                musicBtn.classList.remove('playing');
                musicBtn.setAttribute('aria-pressed', 'false');
            } else {
                anthem.play().then(() => {
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                    musicBtn.classList.add('playing');
                    musicBtn.setAttribute('aria-pressed', 'true');
                }).catch(error => {
                    console.error("Audio playback prevented by browser policy:", error);
                    alert("Please interact with the page first to allow audio playback.");
                });
            }
            isPlaying = !isPlaying;
        });
    }

    // ==========================================
    // 3. Scroll Animations & Observers
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                // Trigger stats counter if it's the stats section
                if (entry.target.id === 'stats' && !entry.target.classList.contains('counted')) {
                    runCounters();
                    entry.target.classList.add('counted');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

    // ==========================================
    // 4. Stats Counter Animation
    // ==========================================
    function runCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; 

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/,/g, '');
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc).toLocaleString();
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target.toLocaleString() + (target > 1000 ? '+' : '');
                }
            };
            updateCount();
        });
    }

    // ==========================================
    // 5. Formspree AJAX Submission
    // ==========================================
    const form = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const submitBtn = document.getElementById("form-submit-btn");

    if (form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault(); // Stop standard redirect
            
            // UI Loading State
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            formStatus.style.display = "none";

            const data = new FormData(event.target);

            try {
                const response = await fetch(event.target.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.style.display = "block";
                    formStatus.style.backgroundColor = "rgba(0, 255, 170, 0.1)"; // Neon green tint
                    formStatus.style.color = "#00ffaa";
                    formStatus.style.border = "1px solid #00ffaa";
                    formStatus.innerHTML = "Message transmitted successfully! I will get back to you soon.";
                    form.reset();
                } else {
                    const responseData = await response.json();
                    formStatus.style.display = "block";
                    formStatus.style.backgroundColor = "rgba(255, 0, 85, 0.1)"; // Neon red tint
                    formStatus.style.color = "#ff0055";
                    formStatus.style.border = "1px solid #ff0055";
                    
                    if (Object.hasOwn(responseData, 'errors')) {
                        formStatus.innerHTML = responseData["errors"].map(error => error["message"]).join(", ");
                    } else {
                        formStatus.innerHTML = "Oops! There was a problem transmitting your message.";
                    }
                }
            } catch (error) {
                formStatus.style.display = "block";
                formStatus.style.backgroundColor = "rgba(255, 0, 85, 0.1)";
                formStatus.style.color = "#ff0055";
                formStatus.style.border = "1px solid #ff0055";
                formStatus.innerHTML = "Oops! A network error occurred.";
            }

            // Reset Button State
            submitBtn.innerHTML = 'Transmit Message <i class="fa-solid fa-paper-plane"></i>';
            submitBtn.disabled = false;
        });
    }

    // ==========================================
    // 6. FAQ Accordion Logic
    // ==========================================
    const accordions = document.querySelectorAll('.accordion-header');
    
    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            } else {
                // Auto-close other panels
                accordions.forEach(otherAcc => {
                    if (otherAcc !== this) {
                        otherAcc.classList.remove('active');
                        otherAcc.setAttribute('aria-expanded', 'false');
                        otherAcc.nextElementSibling.style.maxHeight = null;
                        const otherIcon = otherAcc.querySelector('i');
                        otherIcon.classList.remove('fa-minus');
                        otherIcon.classList.add('fa-plus');
                    }
                });
                panel.style.maxHeight = panel.scrollHeight + "px";
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });

    // ==========================================
    // 7. Utilities (Preloader, Year, Smooth Scroll)
    // ==========================================
    
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // Remove preloader on load
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

});
