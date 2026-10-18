/**
 * New Joiner Welcome Guide - Singapore Office
 * Interactive script: checklist persistence, progress calculation, and accessible form validation.
 * Written in vanilla JavaScript with no external dependencies.
 */

// Run when the DOM content has loaded
document.addEventListener('DOMContentLoaded', () => {
  initChecklist();
  initHrForm();
  initNavScrollSpy();
});

/* ==========================================================================
   1. First-Week Checklist & LocalStorage Persistence
   ========================================================================== */
function initChecklist() {
  const STORAGE_KEY = 'sg_welcome_guide_checklist_v1';
  const checkboxes = document.querySelectorAll('.checklist-input');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressPercent = document.getElementById('progress-percent');
  const resetBtn = document.getElementById('reset-checklist-btn');
  const totalItems = checkboxes.length;

  if (totalItems === 0) return;

  // Retrieve saved state from browser localStorage
  function loadSavedState() {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const checkedIds = JSON.parse(savedData);
        checkboxes.forEach((cb) => {
          const isChecked = Boolean(checkedIds[cb.id]);
          cb.checked = isChecked;
          updateCardVisual(cb, isChecked);
        });
      }
    } catch (e) {
      // LocalStorage might be restricted or empty; gracefully fallback
      console.warn('Could not read checklist from localStorage:', e);
    }
    updateProgress();
  }

  // Save current checkboxes to localStorage
  function saveState() {
    const state = {};
    checkboxes.forEach((cb) => {
      state[cb.id] = cb.checked;
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save checklist to localStorage:', e);
    }
  }

  // Update card background and styling when checked
  function updateCardVisual(checkbox, isChecked) {
    const card = checkbox.closest('.checklist-card');
    if (!card) return;
    if (isChecked) {
      card.classList.add('is-checked');
      checkbox.setAttribute('aria-checked', 'true');
    } else {
      card.classList.remove('is-checked');
      checkbox.setAttribute('aria-checked', 'false');
    }
  }

  // Recalculate and update the progress bar and counter text
  function updateProgress() {
    let completedCount = 0;
    checkboxes.forEach((cb) => {
      if (cb.checked) completedCount += 1;
    });

    const percent = Math.round((completedCount / totalItems) * 100);

    // Update progress bar width and ARIA values
    if (progressFill) {
      progressFill.style.width = percent + '%';
      progressFill.setAttribute('aria-valuenow', completedCount);
      progressFill.setAttribute('aria-valuetext', `${completedCount} of ${totalItems} tasks completed`);
    }

    // Update text indicators (e.g. "3 of 8 done")
    if (progressText) {
      progressText.textContent = `${completedCount} of ${totalItems} done`;
    }

    if (progressPercent) {
      progressPercent.textContent = `${percent}%`;
    }
  }

  // Event listener for checking / unchecking items
  checkboxes.forEach((cb) => {
    cb.addEventListener('change', (e) => {
      updateCardVisual(e.target, e.target.checked);
      updateProgress();
      saveState();
    });

    // Support keyboard Enter or Space on the card
    const card = cb.closest('.checklist-card');
    if (card) {
      card.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          // If target isn't the input itself, toggle it
          if (e.target !== cb) {
            e.preventDefault();
            cb.checked = !cb.checked;
            cb.dispatchEvent(new Event('change'));
          }
        }
      });
    }
  });

  // Reset button logic
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (window.confirm('Would you like to reset your first-week checklist progress?')) {
        checkboxes.forEach((cb) => {
          cb.checked = false;
          updateCardVisual(cb, false);
        });
        updateProgress();
        saveState();
      }
    });
  }

  // Initial load
  loadSavedState();
}

/* ==========================================================================
   2. "Questions for HR" Form Validation & Thank-You Feedback
   ========================================================================== */
function initHrForm() {
  const form = document.getElementById('hr-question-form');
  const thankyouBox = document.getElementById('hr-thankyou-box');
  const sendAnotherBtn = document.getElementById('send-another-btn');
  const thankYouName = document.getElementById('thankyou-recipient-name');

  if (!form) return;

  const nameInput = document.getElementById('hr-name');
  const emailInput = document.getElementById('hr-email');
  const questionInput = document.getElementById('hr-question');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const questionError = document.getElementById('question-error');

  // Standard regular expression for verifying basic email address format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showError(inputEl, errorEl, message) {
    inputEl.classList.add('is-invalid');
    inputEl.setAttribute('aria-invalid', 'true');
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }

  function clearError(inputEl, errorEl) {
    inputEl.classList.remove('is-invalid');
    inputEl.removeAttribute('aria-invalid');
    errorEl.textContent = '';
    errorEl.classList.remove('show');
  }

  // Live validation on typing after user interacts
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length >= 2) {
      clearError(nameInput, nameError);
    }
  });

  emailInput.addEventListener('input', () => {
    if (emailRegex.test(emailInput.value.trim())) {
      clearError(emailInput, emailError);
    }
  });

  questionInput.addEventListener('input', () => {
    if (questionInput.value.trim().length >= 10) {
      clearError(questionInput, questionError);
    }
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Do not send data to any server

    let isValid = true;
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const questionVal = questionInput.value.trim();

    // 1. Validate Name
    if (nameVal.length < 2) {
      showError(nameInput, nameError, 'Please enter your name so HR knows who to reply to.');
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // 2. Validate Email
    if (!emailVal) {
      showError(emailInput, emailError, 'Please provide your email address.');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      showError(emailInput, emailError, 'Please enter a valid email format (e.g., yourname@company.com).');
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // 3. Validate Question (minimum 10 characters)
    if (questionVal.length < 10) {
      showError(
        questionInput,
        questionError,
        'Please enter a question with at least 10 characters so we can assist you thoroughly.'
      );
      isValid = false;
    } else {
      clearError(questionInput, questionError);
    }

    // If validation fails, focus the first invalid field
    if (!isValid) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    // Form is completely valid: Show friendly thank-you message (no external API calls)
    if (thankYouName) {
      thankYouName.textContent = nameVal;
    }

    form.reset();
    form.style.display = 'none';
    if (thankyouBox) {
      thankyouBox.classList.add('show');
      thankyouBox.setAttribute('tabindex', '-1');
      thankyouBox.focus();
    }
  });

  // Allow sending another question
  if (sendAnotherBtn && thankyouBox) {
    sendAnotherBtn.addEventListener('click', () => {
      thankyouBox.classList.remove('show');
      form.style.display = 'block';
      nameInput.focus();
    });
  }
}

/* ==========================================================================
   3. Sticky Navigation Active Indicator (ScrollSpy)
   ========================================================================== */
function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}
