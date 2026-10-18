(() => {
  const storageKey = 'apsrtc_active_share';
  let resumeDialog = null;
  let callbacks = null;

  function clearSession() {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Could not clear the saved sharing session.', error);
    }
  }

  function saveSession(session) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(session));
    } catch (error) {
      console.warn('Could not save the active sharing session.', error);
    }
  }

  async function endShareSession(busCode, busNumber) {
    try {
      if (!window.supabaseClient) {
        throw new Error('Supabase client is not available.');
      }

      let query = window.supabaseClient
        .from('bus_location_shares')
        .update({ expires_at: new Date().toISOString() });
      if (busCode) {
        query = query.eq('bus_code', busCode);
      } else {
        query = query.eq('bus_number', busNumber);
      }

      const { error } = await query;
      if (error) {
        throw error;
      }
    } catch (error) {
      console.warn('Could not end the sharing session in Supabase.', error);
    }
  }

  function dismissResumeDialog() {
    if (resumeDialog?.open) {
      resumeDialog.close();
    }
    resumeDialog?.remove();
    resumeDialog = null;
  }

  function createResumeDialog(session) {
    const dialog = document.createElement('dialog');
    dialog.setAttribute('aria-labelledby', 'resumeShareTitle');
    dialog.style.width = 'min(440px, calc(100% - 32px))';
    dialog.style.maxWidth = '440px';
    dialog.style.padding = '24px';
    dialog.style.border = '1px solid var(--border)';
    dialog.style.borderRadius = '18px';
    dialog.style.background = 'var(--card)';
    dialog.style.color = 'var(--text)';
    dialog.style.boxShadow = 'var(--shadow-card)';

    const title = document.createElement('h2');
    title.id = 'resumeShareTitle';
    title.dataset.i18n = 'savedSessionTitle';
    title.textContent = window.t?.('savedSessionTitle') || 'Continue sharing?';

    const message = document.createElement('p');
    message.dataset.i18n = 'savedSessionPrompt';
    message.dataset.i18nValues = JSON.stringify({ number: session.busNumber });
    message.textContent = window.t?.('savedSessionPrompt', {
      number: session.busNumber
    }) || `You were sharing Bus ${session.busNumber}. Do you want to continue?`;

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.flexWrap = 'wrap';
    actions.style.gap = '12px';
    actions.style.marginTop = '20px';

    const resumeButton = document.createElement('button');
    resumeButton.type = 'button';
    resumeButton.className = 'primary-button';
    resumeButton.dataset.i18n = 'resumeSharing';
    resumeButton.textContent = window.t?.('resumeSharing') || 'Resume sharing';

    const stopButton = document.createElement('button');
    stopButton.type = 'button';
    stopButton.className = 'secondary-button';
    stopButton.dataset.i18n = 'stopSharing';
    stopButton.textContent = window.t?.('stopSharing') || 'Stop sharing';

    resumeButton.addEventListener('click', async () => {
      dismissResumeDialog();
      try {
        await callbacks.onResume(session);
      } catch (error) {
        console.error('Could not resume the saved sharing session.', error);
      }
    });

    stopButton.addEventListener('click', async () => {
      dismissResumeDialog();
      await endShareSession(session.busCode, session.busNumber);
      clearSession();
      try {
        await callbacks.onStop(session);
      } catch (error) {
        console.error('Could not stop the saved sharing session.', error);
      }
    });

    actions.append(resumeButton, stopButton);
    dialog.append(title, message, actions);
    document.body.appendChild(dialog);
    dialog.showModal();
    resumeButton.focus();
    resumeDialog = dialog;
  }

  async function initialize(handlers) {
    callbacks = handlers;
    let session = null;
    try {
      session = JSON.parse(localStorage.getItem(storageKey) || 'null');
    } catch (error) {
      console.warn('Could not read the saved sharing session.', error);
      clearSession();
      return;
    }

    if (
      !session ||
      typeof session.busNumber !== 'string' ||
      !session.busNumber.trim()
    ) {
      if (session) {
        clearSession();
      }
      return;
    }

    const expiresAt = session.expiresAt
      ? new Date(session.expiresAt).getTime()
      : null;
    if (expiresAt !== null && (!Number.isFinite(expiresAt) || expiresAt <= Date.now())) {
      clearSession();
      await endShareSession(session.busCode, session.busNumber);
      return;
    }

    createResumeDialog(session);
  }

  window.SessionControl = {
    clearSession,
    saveSession,
    endShareSession,
    initialize
  };
})();
