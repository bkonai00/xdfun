// ===============================
// MOBILE MENU
// ===============================

const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");

if (hamburger && navbar) {

    hamburger.addEventListener("click", () => {

        navbar.classList.toggle("active");
        hamburger.classList.toggle("active");

    });

    document.querySelectorAll(".navbar a").forEach(link => {

        link.addEventListener("click", () => {

            navbar.classList.remove("active");
            hamburger.classList.remove("active");

        });

    });

}

// ===============================
// FAQ ACCORDION
// ===============================

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        faqItems.forEach(other => {

            if (other !== item) {
                other.classList.remove("active");
            }

        });

        item.classList.toggle("active");

    });

});

// ===============================
// MUSIC PLAYER
// ===============================

const musicBtn = document.getElementById("musicToggle");
const anthem = document.getElementById("anthem");

let isPlaying = false;

if (musicBtn && anthem) {

    musicBtn.addEventListener("click", () => {

        if (isPlaying) {

            anthem.pause();

            musicBtn.innerHTML =
                '<i class="fas fa-music"></i>';

            localStorage.setItem("xdfun_music", "paused");

            isPlaying = false;

        } else {

            anthem.play();

            musicBtn.innerHTML =
                '<i class="fas fa-pause"></i>';

            localStorage.setItem("xdfun_music", "playing");

            isPlaying = true;

        }

    });

}

// ===============================
// RESTORE MUSIC STATE
// ===============================

window.addEventListener("load", () => {

    const musicState =
        localStorage.getItem("xdfun_music");

    if (musicState === "playing") {

        anthem.play().catch(() => {});

        musicBtn.innerHTML =
            '<i class="fas fa-pause"></i>';

        isPlaying = true;

    }

});

// ===============================
// COUNTER ANIMATION
// ===============================

const counters =
    document.querySelectorAll(".counter");

const counterObserver =
    new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const counter = entry.target;

                const target =
                    parseInt(counter.dataset.target);

                let current = 0;

                const increment =
                    Math.ceil(target / 100);

                const updateCounter = () => {

                    current += increment;

                    if (current >= target) {

                        counter.textContent = target;

                    } else {

                        counter.textContent = current;

                        requestAnimationFrame(updateCounter);

                    }

                };

                updateCounter();

                counterObserver.unobserve(counter);

            }

        });

    }, {
        threshold: 0.5
    });

counters.forEach(counter => {

    counterObserver.observe(counter);

});

// ===============================
// SCROLL REVEAL
// ===============================

const revealElements = document.querySelectorAll(
    ".content-card, .playlist-card, .achievement-card, .stat-card, .timeline-item, .testimonial-card, .brand-box, .faq-item"
);

revealElements.forEach(el => {

    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition =
        "all 0.8s ease";

});

const revealObserver =
    new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform =
                    "translateY(0)";

            }

        });

    }, {
        threshold: 0.15
    });

revealElements.forEach(el => {

    revealObserver.observe(el);

});

// ===============================
// HEADER SCROLL EFFECT
// ===============================

const header =
    document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.style.background =
            "rgba(5,8,22,.95)";

        header.style.boxShadow =
            "0 10px 30px rgba(0,0,0,.3)";

    } else {

        header.style.background =
            "rgba(5,8,22,.75)";

        header.style.boxShadow =
            "none";

    }

});

// ===============================
// ACTIVE NAV LINK
// ===============================

const sections =
    document.querySelectorAll("section");

const navLinks =
    document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.offsetHeight;

        if (
            pageYOffset >= sectionTop &&
            pageYOffset <
            sectionTop + sectionHeight
        ) {
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active-link");

        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {
            link.classList.add("active-link");
        }

    });

});

// ===============================
// CURRENT YEAR
// ===============================

const yearElement =
    document.getElementById("year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}

// ===============================
// PARALLAX EFFECT
// ===============================

window.addEventListener("mousemove", e => {

    const glowRing =
        document.querySelector(".glow-ring");

    if (!glowRing) return;

    const x =
        (window.innerWidth / 2 - e.clientX) / 40;

    const y =
        (window.innerHeight / 2 - e.clientY) / 40;

    glowRing.style.transform =
        `translate(${x}px, ${y}px)`;

});

// ===============================
// PRELOADER (OPTIONAL)
// ===============================

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});

// ===============================
// CONSOLE MESSAGE
// ===============================

console.log(`
=================================
XDFUN OFFICIAL WEBSITE
Content Creator • Gamer • Tech
=================================
`);
