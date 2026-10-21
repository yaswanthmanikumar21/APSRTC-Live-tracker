(() => {
  const DEBUG_KEY = 'debug';
  const APP_VERSION = 'build 2026-10-21-a';
  const MAX_ENTRIES = 30;
  const params = new URLSearchParams(window.location.search);
  const startupWarnings = [];

  if (params.get(DEBUG_KEY) === '1') {
    try {
      window.localStorage.setItem(DEBUG_KEY, '1');
    } catch (error) {
      startupWarnings.push(['Could not save the debug panel preference.', error]);
    }
  }

  let enabled = false;
  try {
    enabled = params.get(DEBUG_KEY) === '1' ||
      window.localStorage.getItem(DEBUG_KEY) === '1';
  } catch (error) {
    startupWarnings.push(['Could not read the debug panel preference.', error]);
    enabled = params.get(DEBUG_KEY) === '1';
  }

  if (!enabled) {
    startupWarnings.forEach(([warning, error]) => console.warn(warning, error));
    return;
  }

  const logs = {
    error: [],
    rejection: [],
    consoleError: [],
    consoleWarn: [],
    history: []
  };

  function formatValue(value) {
    if (value instanceof Error) {
      return value.stack || `${value.name}: ${value.message}`;
    }
    if (typeof value === 'string') {
      return value;
    }
    try {
      const serialized = JSON.stringify(value);
      return serialized === undefined ? String(value) : serialized;
    } catch {
      return String(value);
    }
  }

  function getLocationFromStack(stack) {
    if (!stack) {
      return { file: 'unknown', line: 'unknown' };
    }
    const lines = stack.split('\n');
    const locationLine = lines.find((line) =>
      !line.includes('debug-panel.js') &&
      /(?:https?:\/\/|file:\/\/|\/|[A-Za-z]:\\).+:\d+(?::\d+)?/.test(line)
    );
    const match = locationLine?.match(/((?:https?:\/\/|file:\/\/|\/|[A-Za-z]:\\).+):(\d+)(?::\d+)?/);
    return match
      ? { file: match[1], line: match[2] }
      : { file: 'unknown', line: 'unknown' };
  }

  function addEntry(category, message, file = 'unknown', line = 'unknown') {
    const entries = logs[category];
    if (!entries) {
      return;
    }
    entries.push({
      time: new Date().toLocaleTimeString(),
      message: String(message),
      file: String(file || 'unknown'),
      line: String(line || 'unknown')
    });
    if (entries.length > MAX_ENTRIES) {
      entries.splice(0, entries.length - MAX_ENTRIES);
    }
    renderLogs();
  }

  const style = document.createElement('style');
  style.textContent = `
    #appDebugButton {
      position: fixed;
      z-index: 2147483000;
      right: 14px;
      bottom: max(14px, env(safe-area-inset-bottom));
      width: 44px;
      height: 44px;
      border: 1px solid rgba(34, 211, 160, .65);
      border-radius: 50%;
      background: #10221f;
      color: #fff;
      font-size: 22px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, .35);
      cursor: pointer;
    }
    #appDebugPanel {
      position: fixed;
      z-index: 2147483001;
      right: 12px;
      bottom: calc(max(14px, env(safe-area-inset-bottom)) + 54px);
      display: flex;
      flex-direction: column;
      width: min(440px, calc(100vw - 24px));
      max-height: 60vh;
      overflow: hidden;
      border: 1px solid rgba(34, 211, 160, .6);
      border-radius: 14px;
      background: #101817;
      color: #effaf6;
      box-shadow: 0 12px 36px rgba(0, 0, 0, .55);
      font: 13px/1.45 system-ui, sans-serif;
    }
    #appDebugPanel[hidden], #appDebugButton[hidden] {
      display: none !important;
    }
    #appDebugPanel * {
      box-sizing: border-box;
    }
    #appDebugPanel header, #appDebugPanel footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      padding: 10px;
      background: #172421;
    }
    #appDebugPanel header {
      justify-content: space-between;
    }
    #appDebugPanel header strong {
      color: #22d3a0;
      font-size: 14px;
    }
    #appDebugPanel footer button, #appDebugPanel header button {
      min-height: 32px;
      padding: 5px 9px;
      border: 1px solid #45645c;
      border-radius: 8px;
      background: #20332e;
      color: #fff;
      cursor: pointer;
    }
    #appDebugContent {
      overflow: auto;
      padding: 10px;
      user-select: text;
      -webkit-user-select: text;
      overflow-wrap: anywhere;
    }
    #appDebugContent h3 {
      margin: 12px 0 4px;
      color: #22d3a0;
      font-size: 13px;
    }
    #appDebugContent h3:first-child {
      margin-top: 0;
    }
    #appDebugContent pre {
      margin: 0;
      white-space: pre-wrap;
      font: inherit;
      user-select: text;
      -webkit-user-select: text;
    }
    #appDebugMessage {
      padding: 0 10px 8px;
      color: #a9c4ba;
    }
    @media (max-width: 480px) {
      #appDebugPanel {
        right: 8px;
        width: calc(100vw - 16px);
        max-height: 60vh;
      }
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.id = 'appDebugButton';
  button.type = 'button';
  button.textContent = '🐞';
  button.setAttribute('aria-label', 'Open debug panel');

  const panel = document.createElement('section');
  panel.id = 'appDebugPanel';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'Debug panel');

  const header = document.createElement('header');
  const title = document.createElement('strong');
  title.textContent = 'Debug panel';
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.textContent = 'Close';
  header.append(title, closeButton);

  const content = document.createElement('div');
  content.id = 'appDebugContent';
  const message = document.createElement('div');
  message.id = 'appDebugMessage';

  const footer = document.createElement('footer');
  const copyButton = document.createElement('button');
  copyButton.type = 'button';
  copyButton.textContent = 'Copy';
  const clearCacheButton = document.createElement('button');
  clearCacheButton.type = 'button';
  clearCacheButton.textContent = 'Clear site cache';
  const turnOffButton = document.createElement('button');
  turnOffButton.type = 'button';
  turnOffButton.textContent = 'Turn off';
  footer.append(copyButton, clearCacheButton, turnOffButton);
  panel.append(header, content, message, footer);
  document.body.append(button, panel);

  const staticOutput = document.createElement('pre');
  const logSections = new Map();
  for (const [category, heading] of [
    ['error', 'window.onerror'],
    ['rejection', 'unhandledrejection'],
    ['consoleError', 'console.error'],
    ['consoleWarn', 'console.warn'],
    ['history', 'History']
  ]) {
    const sectionHeading = document.createElement('h3');
    sectionHeading.textContent = heading;
    const sectionOutput = document.createElement('pre');
    logSections.set(category, sectionOutput);
    content.append(sectionHeading, sectionOutput);
  }

  async function refreshStatus() {
    const lines = [
      `App version: ${APP_VERSION}`,
      `Capacitor: ${window.Capacitor ? 'present' : 'not present'}`,
      `Current URL: ${window.location.href}`
    ];
    if (!('serviceWorker' in navigator)) {
      lines.push('Service worker: unsupported');
    } else {
      const controller = navigator.serviceWorker.controller;
      const registrations = await navigator.serviceWorker.getRegistrations();
      const states = registrations.map((registration) => {
        const worker = registration.active ||
          registration.waiting ||
          registration.installing;
        return worker?.state || 'registered';
      });
      lines.push(
        `Service worker: ${controller ? 'controlled' : 'not controlling'}; ` +
        `${registrations.length} registration(s)${states.length ? ` (${states.join(', ')})` : ''}`
      );
    }
    if ('caches' in window) {
      const cacheNames = await window.caches.keys();
      lines.push(`Cache names: ${cacheNames.length ? cacheNames.join(', ') : '(none)'}`);
    } else {
      lines.push('Cache names: Cache API unsupported');
    }
    staticOutput.textContent = lines.join('\n');
  }

  function renderLogs() {
    for (const [category, output] of logSections) {
      output.textContent = logs[category].length
        ? logs[category].map((entry) =>
          `[${entry.time}] ${entry.message} (${entry.file}:${entry.line})`
        ).join('\n')
        : '(none)';
    }
  }

  content.prepend(staticOutput);
  button.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) {
      message.textContent = '';
      refreshStatus().catch((error) => {
        addEntry('consoleError', `Could not read service worker/cache status: ${formatValue(error)}`);
      });
    }
  });
  closeButton.addEventListener('click', () => {
    panel.hidden = true;
  });
  copyButton.addEventListener('click', async () => {
    const output = [
      staticOutput.textContent,
      ...Array.from(logSections, ([category, section]) =>
        `${category}:\n${section.textContent}`
      )
    ].join('\n\n');
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(output);
      } else {
        throw new Error('Clipboard API is unavailable.');
      }
      message.textContent = 'Debug information copied.';
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = output;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      let copied = false;
      try {
        copied = document.execCommand('copy');
      } catch (fallbackError) {
        addEntry('consoleError', `Clipboard fallback failed: ${formatValue(fallbackError)}`);
      }
      textarea.remove();
      if (copied) {
        message.textContent = 'Debug information copied.';
      } else {
        addEntry('consoleError', `Could not copy debug information: ${formatValue(error)}`);
        message.textContent = 'Copy failed. Select and copy the panel text.';
      }
    }
  });
  clearCacheButton.addEventListener('click', async () => {
    clearCacheButton.disabled = true;
    message.textContent = 'Clearing service workers and caches...';
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }
      if ('caches' in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
      }
      window.location.reload();
    } catch (error) {
      addEntry('consoleError', `Could not clear site cache: ${formatValue(error)}`);
      message.textContent = 'Could not clear all site data. See console.error.';
      clearCacheButton.disabled = false;
    }
  });
  turnOffButton.addEventListener('click', () => {
    try {
      window.localStorage.removeItem(DEBUG_KEY);
    } catch (error) {
      console.warn('Could not remove the debug panel preference.', error);
    }
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete(DEBUG_KEY);
    window.history.replaceState(
      window.history.state,
      '',
      `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
    );
    button.remove();
    panel.remove();
    style.remove();
  });

  function stackLocation() {
    return getLocationFromStack(new Error().stack);
  }

  const previousOnError = window.onerror;
  window.onerror = function onDebugPanelError(messageText, source, line, column, error) {
    const location = source
      ? { file: source, line: line || 'unknown' }
      : getLocationFromStack(error?.stack);
    addEntry('error', formatValue(messageText), location.file, location.line);
    if (typeof previousOnError === 'function') {
      return previousOnError.call(this, messageText, source, line, column, error);
    }
    return false;
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const location = getLocationFromStack(reason?.stack);
    addEntry('rejection', formatValue(reason), location.file, location.line);
  });

  for (const [methodName, category] of [
    ['error', 'consoleError'],
    ['warn', 'consoleWarn']
  ]) {
    const originalMethod = console[methodName].bind(console);
    console[methodName] = (...args) => {
      const location = stackLocation();
      addEntry(
        category,
        args.map(formatValue).join(' '),
        location.file,
        location.line
      );
      originalMethod(...args);
    };
  }
  startupWarnings.forEach(([warning, error]) => console.warn(warning, error));

  const originalPushState = window.history.pushState;
  window.history.pushState = function debugPushState(state, titleText, url) {
    const result = originalPushState.call(this, state, titleText, url);
    const layer = state && typeof state === 'object' ? state.layer : undefined;
    addEntry('history', `pushState layer: ${layer || '(none)'}`, window.location.href, '—');
    return result;
  };
  window.addEventListener('popstate', (event) => {
    addEntry(
      'history',
      `popstate layer: ${event.state?.layer || '(none)'}`,
      window.location.href,
      '—'
    );
  });

  renderLogs();
  refreshStatus().catch((error) => {
    addEntry('consoleError', `Could not read service worker/cache status: ${formatValue(error)}`);
  });
})();
