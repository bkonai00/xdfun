// ==========================
// XDFUN Official Website JS
// ==========================

// Typing Effect

const typingElement = document.getElementById("typing");

const words = [
  "Content Creator",
  "Gamer",
  "Tech Enthusiast",
  "Livestreamer",
  "Community Builder"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {

  const currentWord = words[wordIndex];

  if (!deleting) {

    typingElement.textContent =
      currentWord.substring(0, charIndex + 1);

    charIndex++;

    if (charIndex === currentWord.length) {
      deleting = true;
      setTimeout(typeEffect, 1500);
      return;
    }

  } else {

    typingElement.textContent =
      currentWord.substring(0, charIndex - 1);

    charIndex--;

    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }

  }

  setTimeout(typeEffect, deleting ? 50 : 100);

}

typeEffect();


// ==========================
// Anthem Player
// ==========================

const anthem =
document.getElementById("anthem");

const musicBtn =
document.getElementById("musicBtn");

let isPlaying = false;

musicBtn.addEventListener("click",()=>{

    if(!isPlaying){

        anthem.play();

        musicBtn.innerHTML =
        '<i class="fas fa-pause"></i>';

        isPlaying = true;

    }else{

        anthem.pause();

        musicBtn.innerHTML =
        '<i class="fas fa-play"></i>';

        isPlaying = false;

    }

});


// ==========================
// Scroll Reveal
// ==========================

const reveals =
  document.querySelectorAll(
    "section, .card, .timeline div"
  );

function revealElements() {

  const windowHeight = window.innerHeight;

  reveals.forEach((element) => {

    const top =
      element.getBoundingClientRect().top;

    if (top < windowHeight - 120) {
      element.classList.add("active");
    }

  });

}

reveals.forEach((el) => {
  el.classList.add("reveal");
});

window.addEventListener("scroll", revealElements);

revealElements();


// ==========================
// Navbar Background
// ==========================

const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {

  if (window.scrollY > 80) {

    nav.style.background =
      "rgba(5,8,22,.92)";

    nav.style.boxShadow =
      "0 10px 30px rgba(0,0,0,.25)";

  } else {

    nav.style.background =
      "rgba(5,8,22,.65)";

    nav.style.boxShadow =
      "none";

  }

});


// ==========================
// Floating Particles
// ==========================

const particleContainer =
  document.getElementById("particles");

for (let i = 0; i < 80; i++) {

  const particle =
    document.createElement("span");

  const size =
    Math.random() * 4 + 1;

  particle.style.position = "absolute";

  particle.style.width =
    size + "px";

  particle.style.height =
    size + "px";

  particle.style.borderRadius =
    "50%";

  particle.style.background =
    Math.random() > 0.5
      ? "#29b6ff"
      : "#ff3b3b";

  particle.style.left =
    Math.random() * 100 + "%";

  particle.style.top =
    Math.random() * 100 + "%";

  particle.style.opacity =
    Math.random();

  particle.style.animation =
    `floatParticle ${
      Math.random() * 20 + 10
    }s linear infinite`;

  particleContainer.appendChild(
    particle
  );

}


// ==========================
// Mouse Parallax Hero
// ==========================

const heroImage =
  document.querySelector(".hero-image img");

document.addEventListener(
  "mousemove",
  (e) => {

    const x =
      (window.innerWidth / 2 - e.pageX)
      / 40;

    const y =
      (window.innerHeight / 2 - e.pageY)
      / 40;

    heroImage.style.transform =
      `translate(${x}px, ${y}px)`;

  }
);


// ==========================
// Smooth Active Nav Link
// ==========================

const navLinks =
  document.querySelectorAll(
    ".nav-links a"
  );

window.addEventListener(
  "scroll",
  () => {

    let current = "";

    document
      .querySelectorAll("section")
      .forEach((section) => {

        const sectionTop =
          section.offsetTop - 150;

        if (
          scrollY >= sectionTop
        ) {
          current = section.id;
        }

      });

    navLinks.forEach((link) => {

      link.classList.remove(
        "active-link"
      );

      if (
        link.href.includes(
          current
        )
      ) {

        link.classList.add(
          "active-link"
        );

      }

    });

  }
);


// ==========================
// Form Success Message
// ==========================

const form =
  document.querySelector("form");

if (form) {

  form.addEventListener(
    "submit",
    () => {

      setTimeout(() => {

        alert(
          "Thanks for reaching out to XDFUN!"
        );

      }, 1000);

    }
  );

}


// ==========================
// Dynamic Copyright Year
// ==========================

const footerText =
  document.querySelector(
    "footer p"
  );

if (footerText) {

  footerText.innerHTML =
    `© ${new Date().getFullYear()} XDFUN. All Rights Reserved.`;

}


// ==========================
// Console Signature
// ==========================

console.log(`
██████╗ ██████╗ ███████╗██╗   ██╗███╗   ██╗
██╔══██╗██╔══██╗██╔════╝██║   ██║████╗  ██║
██████╔╝██████╔╝█████╗  ██║   ██║██╔██╗ ██║
██╔═══╝ ██╔══██╗██╔══╝  ██║   ██║██║╚██╗██║
██║     ██║  ██║███████╗╚██████╔╝██║ ╚████║
╚═╝     ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝

Official XDFUN Website
Built for Bikram Konai
`);
