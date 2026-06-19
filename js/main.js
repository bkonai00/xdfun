"use strict";

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       1. Preloader Logic (FAIL-SAFE VERSION)
    ========================================== */
    const preloader = document.getElementById('preloader');
    
    // Function to handle the fade out
    function removePreloader() {
        if (preloader && preloader.style.display !== 'none') {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }

    // Primary: Wait for all assets to load
    window.addEventListener('load', () => {
        setTimeout(removePreloader, 500); // 0.5s delay for smooth entry
    });

    // Fallback: If YouTube or an image hangs, force the preloader to close after 3 seconds
    setTimeout(removePreloader, 3000);

    /* ==========================================
       2. Custom Cursor tracking
    ========================================== */
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    // Only init if not on a touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        // Follower lerp animation
        setInterval(() => {
            posX += (mouseX - posX) / 6;
            posY += (mouseY - posY) / 6;
            follower.style.left = `${posX}px`;
            follower.style.top = `${posY}px`;
        }, 16);

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        // Add hover states to interactable elements
        const interactables = document.querySelectorAll('a, button, input, textarea, .universe-card');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    /* ==========================================
       3. Parallax Background Effect
    ========================================== */
    const bgCanvas = document.getElementById('bg-canvas');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        if(bgCanvas) bgCanvas.style.transform = `translate(${x}px, ${y}px)`;
    });

    /* ==========================================
       4. Typing Effect (Hero Section)
    ========================================== */
    const typedTextSpan = document.getElementById('typed-text');
    const words = ["Content Creator", "Pro Gamer", "Tech Enthusiast", "System Admin"];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentWord = words[wordIdx];
        if (isDeleting) {
            typedTextSpan.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typedTextSpan.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIdx === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }
        setTimeout(typeEffect, typeSpeed);
    }
    if (typedTextSpan) setTimeout(typeEffect, 1500);

    /* ==========================================
       5. Scroll Reveal & Header State
    ========================================== */
    const header = document.querySelector('.glass-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });
    
    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================
       6. Stats Counter
    ========================================== */
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const updateCount = () => {
                        const count = +counter.innerText.replace(/,/g, '');
                        const inc = target / 200; // Speed divider
                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc).toLocaleString();
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = target.toLocaleString() + '+';
                        }
                    };
                    updateCount();
                });
                observer.unobserve(entry.target); // Run once
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.getElementById('stats');
    if (statsSection) statsObserver.observe(statsSection);

    /* ==========================================
       7. Mobile Navigation Toggle
    ========================================== */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navList = document.querySelector('.nav-list');
    
    if(mobileToggle && navList) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navList.classList.toggle('active');
        });

        // Close when clicking a link
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navList.classList.remove('active');
            });
        });
    }

    /* ==========================================
       8. Audio Player Controller
    ========================================== */
    const musicBtn = document.getElementById('music-btn');
    const anthem = document.getElementById('anthem');
    
    if (musicBtn && anthem) {
        anthem.volume = 0.2; // Safe volume
        musicBtn.addEventListener('click', () => {
            if (anthem.paused) {
                anthem.play().then(() => {
                    musicBtn.classList.add('playing');
                }).catch(e => console.log("Audio play blocked by browser."));
            } else {
                anthem.pause();
                musicBtn.classList.remove('playing');
            }
        });
    }

    /* ==========================================
       9. AJAX Form Submission (Formspree)
    ========================================== */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> TRANSMITTING...';
            submitBtn.disabled = true;

            const data = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formFeedback.innerHTML = "<span class='neon-text'>Transmission Successful. Standby for reply.</span>";
                    contactForm.reset();
                } else {
                    formFeedback.innerHTML = "<span style='color: var(--neon-pink);'>Error in transmission protocols.</span>";
                }
            } catch (error) {
                formFeedback.innerHTML = "<span style='color: var(--neon-pink);'>Network failure. Try again.</span>";
            }

            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            setTimeout(() => { formFeedback.innerHTML = ''; }, 5000);
        });
    }

    /* Set footer year */
    document.getElementById('year').textContent = new Date().getFullYear();
});
