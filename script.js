/**
 * ALPS Landing Page Script
 * Future functionality to include:
 * 1. Mobile navigation toggle (hamburger menu logic).
 * 2. Form validation for the contact/inquiry section.
 * 3. Dynamic loading of service details or testimonials.
 * 4. Smooth scrolling for anchor links.
 */

console.log("ALPS script loaded successfully.");

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("main-header");

  const accordionSection = document.getElementById("what-makes-us-different");
  const accordionTabs = accordionSection
    ? accordionSection.querySelectorAll(".wmu-tab")
    : [];
  const accordionPanels = accordionSection
    ? accordionSection.querySelectorAll(".wmu-panel")
    : [];

  let defaultAccordionOpened = false;
  let defaultOpenTimeout = null;

  function closeAllAccordionTabs() {
    accordionTabs.forEach((t) => {
      t.classList.remove("is-open");
      t.setAttribute("aria-expanded", "false");
    });

    accordionPanels.forEach((panel) => {
      panel.classList.remove("active");
      panel.setAttribute("aria-hidden", "true");
    });
  }

  function openAccordionTab(tab) {
    if (!tab || !accordionPanels.length) return;

    const targetId = tab.getAttribute("data-panel");
    const targetPanel = accordionSection.querySelector("#" + targetId);

    // Close all first (so only 1 open at a time)
    closeAllAccordionTabs();

    // Open target
    tab.classList.add("is-open");
    tab.setAttribute("aria-expanded", "true");

    if (targetPanel) {
      targetPanel.classList.add("active");
      targetPanel.setAttribute("aria-hidden", "false");
    }
  }



  // ---- Reveal (consistent for all sections) ----
  const handleScroll = () => {
    // Header scroll state
    if (window.scrollY > 50) header?.classList.add("scrolled");
    else header?.classList.remove("scrolled");

    // Reveal elements
    const revealElements = document.querySelectorAll(".reveal");

    revealElements.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight * 0.85) {
        el.classList.add("active");
      }

      if (elementTop > windowHeight * 0.85 || window.scrollY < 20) {
        el.classList.remove("active");
      }
    });

    // --- Accordion-specific behavior ---

    if (accordionSection && accordionTabs.length > 0) {
      const rect = accordionSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 1) After tabs fade in, open default tab (first) with a delay
      if (!defaultAccordionOpened) {
        const allTabsRevealed = Array.from(accordionTabs).every((tab) =>
          tab.classList.contains("active")
        );

        if (allTabsRevealed) {
          defaultAccordionOpened = true;

          // Clear any previous timeout just in case
          clearTimeout(defaultOpenTimeout);

          // Reveal animation is 0.8s; add a small buffer
          defaultOpenTimeout = setTimeout(() => {
            const r = accordionSection.getBoundingClientRect();
            const h = window.innerHeight;

            // Make sure section is still in view before opening
            if (r.top < h && r.bottom > 0) {
              openAccordionTab(accordionTabs[0]);
            }
          }, 850);
        }
      } else {
        // 2) When leaving, close default tab BEFORE disappearing
        const leaving =
          rect.top > windowHeight * 0.85 || rect.bottom < 0;

        if (leaving) {
          closeAllAccordionTabs();  // triggers close animation via CSS
          defaultAccordionOpened = false;
          clearTimeout(defaultOpenTimeout);
        }
      }
    }
    if (!defaultAccordionOpened) {
    // Select only the tabs within this section
    const tabs = accordionSection.querySelectorAll(".wmu-tab.reveal");
    
    // Check if every individual tab has finished its reveal animation
    const allTabsRevealed = Array.from(tabs).every((tab) =>
        tab.classList.contains("active")
    );

    if (allTabsRevealed) {
        defaultAccordionOpened = true;
        clearTimeout(defaultOpenTimeout);

        // Increase delay to 1200ms to account for the staggered entrance
        defaultOpenTimeout = setTimeout(() => {
            const r = accordionSection.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) {
                openAccordionTab(accordionTabs[0]);
            }
        }, 1200); 
    }
}
  };
  
  


  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Initialize on load

  // Accordion click behavior: entire rectangle is clickable
  if (accordionTabs.length > 0) {
    accordionTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // If clicking an already open tab, keep it open (no toggle-to-close)
        if (!tab.classList.contains("is-open")) {
          openAccordionTab(tab);
        }
      });
    });
  }

  // ---- Video overlay ----
  const video = document.getElementById("alps-video");
  const overlay = document.getElementById("video-overlay");

  if (video && overlay) {
    video.volume = 0.5;

    overlay.addEventListener("click", () => {
      video.play();
      overlay.classList.add("hidden");
      video.setAttribute("controls", "controls");
    });
  }

  // ---- How It Works slider ----
  const slider = document.getElementById("howSlider");
  if (!slider) return; // no slider on page

  const track = slider.querySelector(".how-track");
  const slides = slider.querySelectorAll(".how-slide");
  if (!track || slides.length === 0) return;

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const goToSlide = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  // Set initial position (so you can confirm it’s wired)
  goToSlide(0);

  // Auto-slide every 15s
  let autoTimer = setInterval(() => goToSlide(index + 1), 15000);

  const resetAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goToSlide(index + 1), 15000);
  };

  // Swipe support (touch)
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    currentX = startX;
    isDragging = true;
  }, { passive: true });

  slider.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener("touchend", () => {
    if (!isDragging) return;
    const diff = startX - currentX;

    if (Math.abs(diff) > 50) {
      diff > 0 ? goToSlide(index + 1) : goToSlide(index - 1);
      resetAuto();
    }

    isDragging = false;
  });

  // Optional: swipe/drag support (mouse)
  slider.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    currentX = startX;
    isDragging = true;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    currentX = e.clientX;
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    const diff = startX - currentX;

    if (Math.abs(diff) > 60) {
      diff > 0 ? goToSlide(index + 1) : goToSlide(index - 1);
      resetAuto();
    }

    isDragging = false;
  });
});

