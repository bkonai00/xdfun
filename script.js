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

  /* ======= Audio player logic ======= */
  const audio = document.getElementById("siteAudio");
  const audioToggle = document.getElementById("audioToggle");
  const audioIcon = document.getElementById("audioIcon");
  const audioProgress = document.getElementById("audioProgress");
  const audioMute = document.getElementById("audioMute");

  // Only initialize if the elements exist
  if (audio && audioToggle && audioProgress) {
    // Restore saved state (position + playing + volume) from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("site-audio-state") || "{}");
      if (saved.time && !isNaN(saved.time)) {
        // set currentTime after metadata loaded
        audio.addEventListener("loadedmetadata", () => {
          if (saved.time < audio.duration) audio.currentTime = saved.time;
        }, { once: true });
      }
      if (saved.volume !== undefined) audio.volume = saved.volume;
      if (saved.muted !== undefined) audio.muted = saved.muted;
      if (saved.playing) {
        // Autoplay is blocked in many browsers; only start if user already initiated in this session
        // We try to resume but it may be blocked. User must click to play in many cases.
        const playAttempt = audio.play();
        if (playAttempt && playAttempt.catch) {
          playAttempt.catch(() => {
            // Cannot autoplay — leave paused; UI will reflect paused state.
            updateAudioUI();
          });
        }
      }
    } catch (e) {
      console.warn("Audio restore failed", e);
    }

    // Update UI helper
    function updateAudioUI() {
      const playing = !audio.paused && !audio.ended;
      audioToggle.setAttribute("aria-pressed", String(playing));
      if (playing) {
        audioToggle.classList.add("playing");
        audioIcon.textContent = "⏸";
      } else {
        audioToggle.classList.remove("playing");
        audioIcon.textContent = "▶";
      }
      audioMute.setAttribute("aria-pressed", String(audio.muted));
      audioMute.textContent = audio.muted ? "🔇" : "🔊";
    }

    // Play / Pause toggle
    audioToggle.addEventListener("click", async () => {
      try {
        if (audio.paused) {
          await audio.play();
        } else {
          audio.pause();
        }
      } catch (err) {
        console.error("Audio play failed", err);
      }
      updateAudioUI();
    });

    // Mute toggle
    if (audioMute) {
      audioMute.addEventListener("click", () => {
        audio.muted = !audio.muted;
        updateAudioUI();
        saveAudioState();
      });
    }

    // Update progress as audio plays
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        audioProgress.value = String(percent);
      }
    });

    // Seek when user changes the range
    audioProgress.addEventListener("input", (e) => {
      if (!audio.duration) return;
      const val = Number(audioProgress.value);
      audio.currentTime = (val / 100) * audio.duration;
    });

    // Save state periodically (and on pause/unload)
    function saveAudioState() {
      const state = {
        time: audio.currentTime,
        playing: !audio.paused && !audio.ended,
        volume: audio.volume,
        muted: audio.muted
      };
      try { localStorage.setItem("site-audio-state", JSON.stringify(state)); } catch (e) { /* ignore */ }
    }
    setInterval(saveAudioState, 2000);
    audio.addEventListener("pause", saveAudioState);
    audio.addEventListener("ended", saveAudioState);
    window.addEventListener("beforeunload", saveAudioState);

    // Volume keyboard shortcuts: press m to mute/unmute while focused on body
    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "m") {
        audio.muted = !audio.muted;
        updateAudioUI();
        saveAudioState();
      }
      if (e.key === " " && document.activeElement === document.body) {
        // Spacebar toggles play/pause when not focused on an input
        e.preventDefault();
        if (audio.paused) audio.play(); else audio.pause();
        updateAudioUI();
        saveAudioState();
      }
    });

    // Update UI on events
    audio.addEventListener("play", updateAudioUI);
    audio.addEventListener("pause", updateAudioUI);
    audio.addEventListener("volumechange", updateAudioUI);

    // Initialize UI
    updateAudioUI();
  }
  /* ======= End audio player logic ======= */
});