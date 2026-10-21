(() => {
  const dialog = document.getElementById('busShareSheet');
  const closeButton = document.getElementById('shareSheetClose');
  const qrOption = document.getElementById('shareSheetQrOption');
  const moreOption = document.getElementById('shareSheetMoreOption');
  const qrPanel = document.getElementById('shareSheetQrPanel');
  const qrImage = document.getElementById('shareSheetQrImage');
  const qrDownload = document.getElementById('shareSheetQrDownload');
  const posterQrButton = document.getElementById('posterQrButton');
  const posterQrPanel = document.getElementById('posterQrPanel');
  const posterQrImage = document.getElementById('posterQrImage');
  const posterQrDownload = document.getElementById('posterQrDownload');
  const message = document.getElementById('shareSheetMessage');
  const optionButtons = dialog.querySelectorAll('[data-share-action]');
  let returnFocusTarget = null;
  let previousBodyOverflow = '';
  let currentLink = '';
  let currentShareText = '';
  const hasAppQuery = new URLSearchParams(window.location.search).get('app') === '1';
  let isNativeApp = false;
  if (window.Capacitor) {
    if (typeof window.Capacitor.isNativePlatform !== 'function') {
      isNativeApp = true;
    } else {
      try {
        isNativeApp = window.Capacitor.isNativePlatform();
      } catch (error) {
        console.warn('Could not detect the native app platform for QR downloads.', error);
        isNativeApp = true;
      }
    }
  }
  const canSaveQr = !hasAppQuery && !isNativeApp;
  qrDownload.hidden = !canSaveQr;
  posterQrDownload.hidden = !canSaveQr;

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

    if (!qrPanel.hidden) {
      window.BackButton?.replace('dialog:busShareSheet');
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
      message.textContent = window.t?.('linkCopied') || 'Link copied!';
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
        ? (window.t?.('linkCopied') || 'Link copied!')
        : (window.t?.('copyFailed') ||
          'Sorry, the link could not be copied. You can copy it from the address bar.');
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

      const dataUrl = createQrPngDataUrl(currentLink);
      qrImage.src = dataUrl;
      qrDownload.href = dataUrl;
      qrPanel.hidden = false;
      window.BackButton?.push('bus-share-qr');
      message.textContent = '';
    } catch (error) {
      console.error('Could not generate the bus-link QR code.', error);
      qrOption.hidden = true;
      qrPanel.hidden = true;
      window.BackButton?.close('bus-share-qr');
      message.textContent = window.t?.('qrUnavailable') ||
        'QR sharing is unavailable right now.';
    }
  }

  function createQrPngDataUrl(value) {
    const qrCode = window.qrcode(0, 'M');
    qrCode.addData(value);
    qrCode.make();
    const moduleCount = qrCode.getModuleCount();
    const quietZone = 4;
    const moduleSize = Math.max(4, Math.ceil(240 / (moduleCount + quietZone * 2)));
    const canvas = document.createElement('canvas');
    canvas.width = (moduleCount + quietZone * 2) * moduleSize;
    canvas.height = canvas.width;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas is unavailable for QR rendering.');
    }
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    for (let row = 0; row < moduleCount; row += 1) {
      for (let column = 0; column < moduleCount; column += 1) {
        if (qrCode.isDark(row, column)) {
          context.fillRect(
            (column + quietZone) * moduleSize,
            (row + quietZone) * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }
    return canvas.toDataURL('image/png');
  }

  function showPosterQr() {
    try {
      if (typeof window.qrcode !== 'function') {
        throw new Error('QR code library is unavailable.');
      }
      const dataUrl = createQrPngDataUrl('https://apsrtclive.vercel.app/');
      posterQrImage.src = dataUrl;
      posterQrDownload.href = dataUrl;
      posterQrPanel.hidden = false;
      window.BackButton?.push('poster-qr');
    } catch (error) {
      console.error('Could not generate the poster QR code.', error);
      posterQrPanel.hidden = true;
      window.BackButton?.close('poster-qr');
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
                message.textContent = window.t?.('sharingUnavailable') ||
                  'Sharing is unavailable right now.';
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
      message.textContent = window.t?.('invalidShareLink') ||
        'This bus link is not available to share.';
      return;
    }

    const parsedLink = new URL(validLink);
    const busCode = parsedLink.searchParams.get('bus');
    if (!busCode) {
      message.textContent = window.t?.('invalidShareLink') ||
        'This bus link is not available to share.';
      return;
    }
    currentLink = `https://apsrtclive.vercel.app/?bus=${encodeURIComponent(busCode)}`;
    const busTypeLabel = busType === 'ordinary'
      ? (window.t?.('ordinary') || 'Ordinary')
      : busType === 'metro_express'
        ? (window.t?.('metroExpress') || 'Metro Express')
        : null;
    currentShareText = `${window.t?.('trackBusLive', {
      number: String(busNumber || '').trim(),
      type: busTypeLabel ? ` (${busTypeLabel})` : ''
    }) || `Track Bus ${String(busNumber || '').trim()}${busTypeLabel ? ` (${busTypeLabel})` : ''} live on APSRTC Live`}`;
    returnFocusTarget = trigger;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    message.textContent = '';
    qrPanel.hidden = true;
    window.BackButton?.push('dialog:busShareSheet');
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
  posterQrButton?.addEventListener('click', () => {
    if (posterQrPanel.hidden) {
      showPosterQr();
    } else {
      posterQrPanel.hidden = true;
      window.BackButton?.close('poster-qr');
    }
  });

  window.BackButton?.register(
    'bus-share-qr',
    () => !qrPanel.hidden,
    () => {
      qrPanel.hidden = true;
    },
    120
  );
  window.BackButton?.register(
    'poster-qr',
    () => !posterQrPanel.hidden,
    () => {
      posterQrPanel.hidden = true;
    },
    120
  );

  window.openBusShareSheet = openBusShareSheet;
})();
