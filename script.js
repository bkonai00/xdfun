// Minimal JS for mobile nav, improved form hooks, and small UI touches.
// Configured to use your Formspree endpoint (both contact and collab use the provided endpoint).
const FORM_ENDPOINT = {
  contact: "https://formspree.io/f/mregvbpn",
  collab:  "https://formspree.io/f/mregvbpn"
};

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      if (mainNav) mainNav.style.display = expanded ? "none" : "block";
    });
  }

  // Generic form submit function using FormData and Formspree
  async function postFormToEndpoint(formEl, endpoint, statusEl) {
    // Honeypot check: field named 'company' (hidden) — if filled, assume bot
    const honeypot = formEl.querySelector('input[name="company"]');
    if (honeypot && honeypot.value) {
      statusEl.textContent = "Submission rejected.";
      return;
    }

    // client-side validity
    if (!formEl.reportValidity()) return;

    const submitBtn = formEl.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const prevText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";

    statusEl.textContent = "Sending...";

    const formData = new FormData(formEl);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        statusEl.textContent = "Message sent — thank you!";
        formEl.reset();
      } else {
        const data = await res.json().catch(() => null);
        statusEl.textContent = data?.error || "Submission failed. Try again later.";
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Network error — please try again later.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = prevText;
    }
  }

  // Contact form handler
  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");
  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      postFormToEndpoint(contactForm, FORM_ENDPOINT.contact, contactStatus);
    });
  }

  // Collab form handler
  const collabForm = document.getElementById("collabForm");
  const collabStatus = document.getElementById("collabStatus");
  if (collabForm && collabStatus) {
    collabForm.addEventListener("submit", (e) => {
      e.preventDefault();
      postFormToEndpoint(collabForm, FORM_ENDPOINT.collab, collabStatus);
    });
  }

  // Add small animated glow to primary CTA buttons
  const accentButtons = document.querySelectorAll(".btn-accent");
  accentButtons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      btn.style.boxShadow = "0 10px 50px rgba(0,209,255,0.12), 0 0 28px rgba(255,31,75,0.06)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.boxShadow = "";
    });
  });
});