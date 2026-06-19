document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- Floating Anthem Button ---
    const musicBtn = document.getElementById('music-btn');
    const anthem = document.getElementById('anthem');
    const icon = musicBtn.querySelector('i');
    let isPlaying = false;

    // Set volume to a reasonable level so it doesn't blast ears
    anthem.volume = 0.3; 

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            anthem.pause();
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            musicBtn.classList.remove('playing');
        } else {
            // Error handling for autoplay policies
            anthem.play().then(() => {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                musicBtn.classList.add('playing');
            }).catch(error => {
                console.log("Audio playback was prevented by the browser. Interaction required first.");
            });
        }
        isPlaying = !isPlaying;
    });

    // --- Scroll Animations (Intersection Observer) ---
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

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));

    // --- Stats Counter Animation ---
    function runCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // The lower the slower

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

    // --- Smooth Scrolling for internal links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

});
