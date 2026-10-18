(() => {
  const dialog = document.getElementById('busShareSheet');
  const closeButton = document.getElementById('shareSheetClose');
  const qrOption = document.getElementById('shareSheetQrOption');
  const moreOption = document.getElementById('shareSheetMoreOption');
  const qrPanel = document.getElementById('shareSheetQrPanel');
  const qrImage = document.getElementById('shareSheetQrImage');
  const qrDownload = document.getElementById('shareSheetQrDownload');
  const message = document.getElementById('shareSheetMessage');
  const optionButtons = dialog.querySelectorAll('[data-share-action]');
  let returnFocusTarget = null;
  let previousBodyOverflow = '';
  let currentLink = '';
  let currentShareText = '';

  if (typeof navigator.share === 'function') {
    moreOption.hidden = false;
  }

  if (typeof window.qrcode === 'function') {
    qrOption.hidden = false;
  }

  function getValidShareLink(value) {
    try {
      const link = new URL(value, window.location.href);
      if (link.protocol !== 'http:' && link.protocol !== 'https:') {
        return null;
      }
      return link.toString();
    } catch (error) {
      console.error('Cannot share an invalid bus link.', error);
      return null;
    }
  }

  function getFocusableElements() {
    return Array.from(
      dialog.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
    ).filter((element) => (
      !element.closest('[hidden]') &&
      element.getClientRects().length > 0
    ));
  }

  function closeSheet() {
    if (!dialog.open) {
      return;
    }

    dialog.close();
    document.body.style.overflow = previousBodyOverflow;
    message.textContent = '';
    qrPanel.hidden = true;
    if (returnFocusTarget?.isConnected) {
      returnFocusTarget.focus();
    }
  }

  function openExternal(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function copyLink() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentLink);
      } else {
        throw new Error('Clipboard API is unavailable.');
      }
      message.textContent = window.t('linkCopied');
    } catch (clipboardError) {
      const textarea = document.createElement('textarea');
      textarea.value = currentLink;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      let copied = false;
      try {
        copied = document.execCommand('copy');
      } catch (fallbackError) {
        console.warn('Clipboard fallback failed.', fallbackError);
      }
      textarea.remove();
      message.textContent = copied
        ? window.t('linkCopied')
        : window.t('copyFailed');
      if (!copied) {
        console.warn('Clipboard API copy failed.', clipboardError);
      }
    }
  }

  function showQrCode() {
    try {
      if (typeof window.qrcode !== 'function') {
        throw new Error('QR code library is unavailable.');
      }

      const qrCode = window.qrcode(0, 'M');
      qrCode.addData(currentLink);
      qrCode.make();
      const svg = qrCode.createSvgTag(5, 4, window.t('qrCodeLabel'));
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      qrImage.src = dataUrl;
      qrDownload.href = dataUrl;
      qrPanel.hidden = false;
      message.textContent = '';
    } catch (error) {
      console.error('Could not generate the bus-link QR code.', error);
      qrOption.hidden = true;
      qrPanel.hidden = true;
      message.textContent = window.t('qrUnavailable');
    }
  }

  function handleShareAction(action) {
    const encodedLink = encodeURIComponent(currentLink);
    const encodedText = encodeURIComponent(currentShareText);
    const body = `${currentShareText}\n${currentLink}`;

    switch (action) {
      case 'copy':
        copyLink();
        break;
      case 'whatsapp':
        openExternal(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${currentShareText} ${currentLink}`)}`);
        break;
      case 'telegram':
        openExternal(`https://t.me/share/url?url=${encodedLink}&text=${encodedText}`);
        break;
      case 'x':
        openExternal(`https://twitter.com/intent/tweet?url=${encodedLink}&text=${encodedText}`);
        break;
      case 'email':
        openExternal(`mailto:?subject=${encodeURIComponent(currentShareText)}&body=${encodeURIComponent(body)}`);
        break;
      case 'messages':
        openExternal(`sms:?body=${encodeURIComponent(body)}`);
        break;
      case 'qr':
        showQrCode();
        break;
      case 'more':
        if (typeof navigator.share === 'function') {
          navigator.share({ title: 'APSRTC Live', text: currentShareText, url: currentLink })
            .then(() => closeSheet())
            .catch((error) => {
              if (error.name !== 'AbortError') {
                console.error('System share failed.', error);
                message.textContent = window.t('sharingUnavailable');
              }
            });
        }
        break;
      default:
        break;
    }
  }

  function openBusShareSheet({ url, busNumber, busType, trigger }) {
    const validLink = getValidShareLink(url);
    if (!validLink) {
      message.textContent = window.t('invalidShareLink');
      return;
    }

    currentLink = validLink;
    const busTypeLabel = busType === 'ordinary'
      ? window.t('ordinary')
      : busType === 'metro_express'
        ? window.t('metroExpress')
        : null;
    currentShareText = window.t('trackBusLive', {
      number: String(busNumber || '').trim(),
      type: busTypeLabel ? ` (${busTypeLabel})` : ''
    });
    returnFocusTarget = trigger;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    message.textContent = '';
    qrPanel.hidden = true;
    dialog.showModal();
    closeButton.focus();
  }

  closeButton.addEventListener('click', closeSheet);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      closeSheet();
    }
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeSheet();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = getFocusableElements();
    if (!focusableElements.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  optionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      handleShareAction(button.dataset.shareAction);
    });
  });

  window.openBusShareSheet = openBusShareSheet;
})();
