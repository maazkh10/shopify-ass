
/* =========================================================
   REVIEWS MODAL
   ========================================================= */

function initReviewsModal() {
  const openButtons = document.querySelectorAll(
    "[data-reviews-open]"
  );

  openButtons.forEach((button) => {
    if (button.dataset.reviewsInitialized === "true") {
      return;
    }

    button.dataset.reviewsInitialized = "true";

    button.addEventListener("click", () => {
      const sectionId = button.dataset.reviewsOpen;

      const modal = document.getElementById(
        `ReviewsModal-${sectionId}`
      );

      if (!modal) return;

      modal.hidden = false;
      document.body.classList.add("reviews-modal-open");

      const closeButton = modal.querySelector(
        "[data-reviews-close]"
      );

      if (closeButton) {
        closeButton.focus();
      }
    });
  });

  const closeButtons = document.querySelectorAll(
    "[data-reviews-close]"
  );

  closeButtons.forEach((button) => {
    if (button.dataset.reviewsInitialized === "true") {
      return;
    }

    button.dataset.reviewsInitialized = "true";

    button.addEventListener("click", () => {
      const modal = button.closest(
        ".test-1-reviews-modal"
      );

      if (!modal) return;

      modal.hidden = true;
      document.body.classList.remove(
        "reviews-modal-open"
      );

      const sectionId = modal.id.replace(
        "ReviewsModal-",
        ""
      );

      const trigger = document.querySelector(
        `[data-reviews-open="${sectionId}"]`
      );

      if (trigger) {
        trigger.focus();
      }
    });
  });
}

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key !== "Escape") return;

    const openModal = document.querySelector(
      ".test-1-reviews-modal:not([hidden])"
    );

    if (!openModal) return;

    const closeButton = openModal.querySelector(
      "[data-reviews-close]"
    );

    if (closeButton) {
      closeButton.click();
    }
  }
);

document.addEventListener(
  "DOMContentLoaded",
  initReviewsModal
);










document.addEventListener("DOMContentLoaded", () => {
  const countdowns = document.querySelectorAll("[data-countdown]");

  countdowns.forEach((countdown) => {
    const target = new Date(
      countdown.dataset.countdown
    ).getTime();

    const days = countdown.querySelector("[data-days]");
    const hours = countdown.querySelector("[data-hours]");
    const minutes = countdown.querySelector("[data-minutes]");
    const seconds = countdown.querySelector("[data-seconds]");

    const finishedMessage = countdown.querySelector(
      "[data-countdown-finished]"
    );

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function updateCountdown() {
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        days.textContent = "00";
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";

        if (finishedMessage) {
          finishedMessage.hidden = false;
        }

        return true;
      }

      const totalSeconds = Math.floor(difference / 1000);

      const remainingDays = Math.floor(
        totalSeconds / 86400
      );

      const remainingHours = Math.floor(
        (totalSeconds % 86400) / 3600
      );

      const remainingMinutes = Math.floor(
        (totalSeconds % 3600) / 60
      );

      const remainingSeconds =
        totalSeconds % 60;

      days.textContent = pad(remainingDays);
      hours.textContent = pad(remainingHours);
      minutes.textContent = pad(remainingMinutes);
      seconds.textContent = pad(remainingSeconds);

      return false;
    }

    updateCountdown();

    const interval = setInterval(() => {
      const finished = updateCountdown();

      if (finished) {
        clearInterval(interval);
      }
    }, 1000);
  });
});






