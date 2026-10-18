(() => {
  let catalogEntrancePlayed = false;
  let displayedLiveCount = 0;
  let liveCountTween = null;

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (error) {
      console.warn('Could not check reduced-motion preference.', error);
      return true;
    }
  }

  function getGsap() {
    return typeof window.gsap !== 'undefined' &&
      typeof window.gsap.fromTo === 'function'
      ? window.gsap
      : null;
  }

  function animateCatalogCards(cards) {
    try {
      const gsap = getGsap();
      if (!gsap || prefersReducedMotion() || catalogEntrancePlayed || !cards.length) {
        return;
      }

      catalogEntrancePlayed = true;
      gsap.fromTo(
        cards,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'transform,opacity'
        }
      );
    } catch (error) {
      console.warn('Could not animate the bus catalog entrance.', error);
    }
  }

  function animateDetailsPanel(panel) {
    try {
      const gsap = getGsap();
      if (!gsap || prefersReducedMotion() || !panel) {
        return;
      }

      gsap.fromTo(
        panel,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          clearProps: 'transform,opacity'
        }
      );
    } catch (error) {
      console.warn('Could not animate the bus details panel.', error);
    }
  }

  function animateShareSheet(panel) {
    try {
      const gsap = getGsap();
      if (!gsap || prefersReducedMotion() || !panel) {
        return;
      }

      gsap.fromTo(
        panel,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.28,
          ease: 'power2.out',
          clearProps: 'transform,opacity'
        }
      );
    } catch (error) {
      console.warn('Could not animate the share sheet.', error);
    }
  }

  function updateLiveCount(count) {
    try {
      const counter = document.getElementById('liveBusCounter');
      const target = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
      if (!counter) {
        return;
      }

      const render = (value) => {
        const rounded = Math.max(0, Math.round(value));
        const key = rounded === 1 ? 'liveBusCountOne' : 'liveBusCount';
        counter.textContent = typeof window.t === 'function'
          ? window.t(key, { count: rounded })
          : String(rounded);
      };

      const gsap = getGsap();
      if (
        !gsap ||
        typeof gsap.to !== 'function' ||
        prefersReducedMotion() ||
        (target === Math.round(displayedLiveCount) && !liveCountTween)
      ) {
        liveCountTween?.kill();
        liveCountTween = null;
        displayedLiveCount = target;
        render(target);
        return;
      }

      liveCountTween?.kill();
      const progress = { value: displayedLiveCount };
      liveCountTween = gsap.to(progress, {
        value: target,
        duration: 0.45,
        ease: 'power1.out',
        onUpdate: () => {
          displayedLiveCount = progress.value;
          render(progress.value);
        },
        onComplete: () => {
          displayedLiveCount = target;
          liveCountTween = null;
          render(target);
        }
      });
    } catch (error) {
      console.warn('Could not update the live bus counter.', error);
      liveCountTween = null;
      displayedLiveCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
      const counter = document.getElementById('liveBusCounter');
      if (counter) {
        counter.textContent = typeof window.t === 'function'
          ? window.t(displayedLiveCount === 1 ? 'liveBusCountOne' : 'liveBusCount', {
            count: displayedLiveCount
          })
          : String(displayedLiveCount);
      }
    }
  }

  function sharingStarted() {
    try {
      if (typeof window.confetti !== 'function' || prefersReducedMotion()) {
        return;
      }

      window.confetti({
        particleCount: 60,
        spread: 58,
        startVelocity: 24,
        ticks: 90,
        scalar: 0.75,
        origin: { y: 0.75 },
        disableForReducedMotion: true
      });
    } catch (error) {
      console.warn('Could not show the sharing celebration.', error);
    }
  }

  try {
    const dialog = document.getElementById('busShareSheet');
    const panel = dialog?.querySelector('.share-sheet__panel');
    if (dialog && panel && typeof MutationObserver === 'function') {
      const observer = new MutationObserver(() => {
        if (dialog.open) {
          animateShareSheet(panel);
        }
      });
      observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    }
  } catch (error) {
    console.warn('Could not attach share-sheet motion.', error);
  }

  window.UIMotion = {
    animateCatalogCards,
    animateDetailsPanel,
    updateLiveCount,
    sharingStarted
  };
  document.addEventListener('languagechange', () => {
    updateLiveCount(displayedLiveCount);
  });
  updateLiveCount(0);
})();
