(() => {
  const layers = new Map();
  const trackedDialogs = new WeakSet();
  const dialogCloseFromPopstate = new WeakSet();
  const dialogLayerNames = new WeakMap();
  const dialogStack = [];
  let layerOrder = 0;

  function getCurrentUrl() {
    return `${window.location.pathname}${window.location.search}${window.location.hash}`;
  }

  function pushLayer(layer) {
    if (!layer || window.history.state?.layer === layer) {
      return;
    }
    window.history.pushState(
      { ...window.history.state, layer },
      '',
      getCurrentUrl()
    );
  }

  function replaceLayer(layer, state = {}) {
    window.history.replaceState(
      { ...window.history.state, ...state, layer },
      '',
      getCurrentUrl()
    );
  }

  function closeLayer(layer, close) {
    if (window.history.state?.layer === layer && window.history.length > 1) {
      window.history.back();
      return true;
    }
    close?.();
    return false;
  }

  function closeStack(...stack) {
    if (
      !stack.length ||
      window.history.state?.layer !== stack[0] ||
      window.history.length <= stack.length
    ) {
      return false;
    }
    stack.forEach((name) => {
      const layer = layers.get(name);
      if (layer?.isOpen()) {
        layer.close();
      }
    });
    window.history.go(-stack.length);
    return true;
  }

  function registerLayer(layer, isOpen, close, priority = 0) {
    layers.set(layer, { isOpen, close, priority, order: layerOrder++ });
    return () => layers.delete(layer);
  }

  function trackDialog(dialog) {
    if (!(dialog instanceof HTMLDialogElement) || trackedDialogs.has(dialog)) {
      return;
    }
    trackedDialogs.add(dialog);
    const layer = `dialog:${dialog.id || `dialog-${layerOrder++}`}`;
    dialogLayerNames.set(dialog, layer);
    const observer = new MutationObserver(() => {
      if (dialog.open) {
        pushLayer(layer);
        const registeredLayer = layers.get(layer);
        if (registeredLayer) {
          registeredLayer.order = layerOrder++;
        }
        const previousIndex = dialogStack.indexOf(dialog);
        if (previousIndex >= 0) {
          dialogStack.splice(previousIndex, 1);
        }
        dialogStack.push(dialog);
      } else if (dialogCloseFromPopstate.has(dialog)) {
        dialogCloseFromPopstate.delete(dialog);
        const previousIndex = dialogStack.indexOf(dialog);
        if (previousIndex >= 0) {
          dialogStack.splice(previousIndex, 1);
        }
      } else {
        const previousIndex = dialogStack.indexOf(dialog);
        if (previousIndex >= 0) {
          dialogStack.splice(previousIndex, 1);
        }
        closeLayer(layer);
      }
    });
    observer.observe(dialog, {
      attributes: true,
      attributeFilter: ['open']
    });
    registerLayer(
      layer,
      () => dialog.open,
      () => {
        dialogCloseFromPopstate.add(dialog);
        dialog.close();
      },
      100
    );
    if (dialog.open) {
      pushLayer(layer);
      dialogStack.push(dialog);
    }
  }

  function findTopOpenDialog() {
    for (let index = dialogStack.length - 1; index >= 0; index -= 1) {
      if (dialogStack[index].open) {
        return dialogStack[index];
      }
    }
    return null;
  }

  function handlePopState(event) {
    const activeLayers = Array.from(layers.entries())
      .filter(([, layer]) => layer.priority > 100 && layer.isOpen())
      .sort((first, second) =>
        second[1].priority - first[1].priority ||
        second[1].order - first[1].order
      );
    const [nestedName, nestedLayer] = activeLayers[0] || [];
    if (nestedLayer && event.state?.layer !== nestedName) {
      nestedLayer.close();
      return;
    }

    const dialog = findTopOpenDialog();
    if (dialog) {
      const layer = layers.get(dialogLayerNames.get(dialog));
      const name = dialogLayerNames.get(dialog);
      if (layer && event.state?.layer !== name) {
        layer.close();
        return;
      }
    }

    const lowerLayers = Array.from(layers.entries())
      .filter(([, layer]) => layer.priority <= 100 && layer.isOpen())
      .sort((first, second) =>
        second[1].priority - first[1].priority ||
        second[1].order - first[1].order
      );
    const [name, layer] = lowerLayers[0] || [];
    if (layer && event.state?.layer !== name) {
      layer.close();
    }
  }

  document.querySelectorAll('dialog').forEach(trackDialog);
  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLDialogElement) {
          trackDialog(node);
        } else if (node instanceof Element) {
          node.querySelectorAll('dialog').forEach(trackDialog);
        }
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  if (!window.history.state?.appBackRoot) {
    window.history.pushState(
      { ...window.history.state, layer: 'tab:home', appBackRoot: true },
      '',
      getCurrentUrl()
    );
  }
  window.addEventListener('popstate', handlePopState);

  window.BackButton = Object.freeze({
    push: pushLayer,
    replace: replaceLayer,
    close: closeLayer,
    closeStack,
    register: registerLayer
  });
})();
