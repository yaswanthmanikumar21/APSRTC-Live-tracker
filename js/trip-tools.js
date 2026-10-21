(() => {
  const fromInput = document.getElementById('tripFrom');
  const toInput = document.getElementById('tripTo');
  const suggestions = document.getElementById('tripStopSuggestions');
  const form = document.getElementById('tripPlannerForm');
  const swapButton = document.getElementById('swapTripStopsBtn');
  const directList = document.getElementById('tripPlannerResults');
  const message = document.getElementById('tripPlannerMessage');
  const searchButton = document.getElementById('tripSearchBtn');
  const stopHints = document.getElementById('tripStopHints');
  let catalog = [];
  let stopAliases = new Map();
  let canonicalStopNames = [];
  let liveBusNumbers = new Set();
  let resultsRequestId = 0;

  function normalizeStopName(value) {
    return String(value || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '');
  }

  function normalizeBusNumber(value) {
    return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function editDistance(first, second) {
    const previous = Array.from(
      { length: second.length + 1 },
      (_, index) => index
    );
    for (let row = 1; row <= first.length; row += 1) {
      let diagonal = previous[0];
      previous[0] = row;
      for (let column = 1; column <= second.length; column += 1) {
        const above = previous[column];
        previous[column] = Math.min(
          previous[column] + 1,
          previous[column - 1] + 1,
          diagonal + (first[row - 1] === second[column - 1] ? 0 : 1)
        );
        diagonal = above;
      }
    }
    return previous[second.length];
  }

  function stopMatchScore(candidate, query) {
    const normalizedCandidate = normalizeStopName(candidate);
    const normalizedQuery = normalizeStopName(query);
    if (!normalizedCandidate || !normalizedQuery) {
      return Infinity;
    }
    if (normalizedCandidate === normalizedQuery) {
      return 0;
    }
    const shortestLength = Math.min(
      normalizedCandidate.length,
      normalizedQuery.length
    );
    if (
      shortestLength >= 3 &&
      (
        normalizedCandidate.includes(normalizedQuery) ||
        normalizedQuery.includes(normalizedCandidate)
      )
    ) {
      return 1;
    }
    if (Math.min(normalizedCandidate.length, normalizedQuery.length) < 5) {
      return Infinity;
    }
    const distance = editDistance(normalizedCandidate, normalizedQuery);
    const longest = Math.max(
      normalizedCandidate.length,
      normalizedQuery.length
    );
    return distance <= Math.max(1, Math.floor(longest * 0.18))
      ? 2 + distance / longest
      : Infinity;
  }

  function isStopMatch(candidate, query) {
    const canonicalCandidate = canonicalStop(candidate);
    return Boolean(
      canonicalCandidate && canonicalCandidate === canonicalStop(query)
    );
  }

  function rebuildStopAliases() {
    stopAliases = new Map();
    canonicalStopNames = [];
    catalog.forEach((bus) => {
      getBusStops(bus).forEach((stop) => {
        const normalized = normalizeStopName(stop);
        if (!normalized || stopAliases.has(normalized)) {
          return;
        }
        const alias = canonicalStopNames.find((knownStop) => {
          const known = normalizeStopName(knownStop);
          return Math.min(known.length, normalized.length) >= 9 &&
            known.slice(0, 6) === normalized.slice(0, 6) &&
            editDistance(known, normalized) <= 1;
        });
        if (alias) {
          stopAliases.set(normalized, alias);
          return;
        }
        canonicalStopNames.push(stop);
        stopAliases.set(normalized, stop);
      });
    });
  }

  function canonicalStop(value) {
    return stopAliases.get(normalizeStopName(value)) || null;
  }

  function getBusStops(bus) {
    const stops = Array.isArray(bus?.stops)
      ? bus.stops
      : typeof bus?.stops === 'string'
        ? bus.stops.split(',')
        : [];
    const allStops = [
      bus?.starting_point ?? bus?.startingPoint,
      ...stops,
      bus?.destination
    ]
      .map((stop) => String(stop || '').trim().replace(/\s+/g, ' '))
      .filter(Boolean);
    return allStops.filter((stop, index) => {
      if (index === 0) {
        return true;
      }
      const current = canonicalStop(stop) || normalizeStopName(stop);
      const previous = canonicalStop(allStops[index - 1]) ||
        normalizeStopName(allStops[index - 1]);
      return current !== previous;
    });
  }

  function findStopIndex(stops, query) {
    const requestedStop = canonicalStop(query);
    if (!requestedStop) {
      return -1;
    }
    return stops.findIndex((stop) => canonicalStop(stop) === requestedStop);
  }

  function matchTrip(bus, from, to) {
    const canonicalFrom = canonicalStop(from);
    const canonicalTo = canonicalStop(to);
    if (!canonicalFrom || !canonicalTo || canonicalFrom === canonicalTo) {
      return null;
    }

    const stops = getBusStops(bus);
    const fromIndex = findStopIndex(stops, from);
    const toIndex = findStopIndex(stops, to);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
      return null;
    }
    const directionStep = toIndex > fromIndex ? 1 : -1;
    const stopsBetween = Math.abs(toIndex - fromIndex) - 1;

    return {
      stops,
      fromIndex,
      toIndex,
      stopsBetween,
      intermediateStops: Array.from(
        { length: stopsBetween },
        (_, index) => stops[fromIndex + directionStep * (index + 1)]
      ),
      direction: fromIndex < toIndex ? 'forward' : 'return',
      destination: fromIndex < toIndex
        ? stops[stops.length - 1]
        : stops[0],
      boardingStop: stops[fromIndex],
      exitStop: stops[toIndex]
    };
  }

  function findOneChangeTrips(buses, from, to) {
    const options = [];
    buses.forEach((firstBus, firstIndex) => {
      const firstStops = getBusStops(firstBus);
      const fromStopIndex = findStopIndex(firstStops, from);
      if (fromStopIndex < 0) {
        return;
      }
      buses.forEach((secondBus, secondIndex) => {
        if (firstIndex === secondIndex) {
          return;
        }
        const secondStops = getBusStops(secondBus);
        const toStopIndex = findStopIndex(secondStops, to);
        if (toStopIndex < 0) {
          return;
        }
        firstStops.forEach((changeStop, changeIndex) => {
          if (
            changeIndex === fromStopIndex ||
            canonicalStop(changeStop) === canonicalStop(from) ||
            canonicalStop(changeStop) === canonicalStop(to)
          ) {
            return;
          }
          const matchingSecondIndex = secondStops.findIndex((secondStop) =>
            canonicalStop(changeStop) === canonicalStop(secondStop)
          );
          if (
            matchingSecondIndex < 0 ||
            matchingSecondIndex === toStopIndex
          ) {
            return;
          }
          const firstDirection = changeIndex > fromStopIndex ? 1 : -1;
          const secondDirection = toStopIndex > matchingSecondIndex ? 1 : -1;
          const firstLegStops = Math.abs(changeIndex - fromStopIndex) - 1;
          const secondLegStops = Math.abs(toStopIndex - matchingSecondIndex) - 1;
          options.push({
            firstBus,
            secondBus,
            changeStop,
            totalStops: firstLegStops + 1 + secondLegStops,
            firstLegStops: Array.from(
              { length: firstLegStops },
              (_, index) => firstStops[fromStopIndex + firstDirection * (index + 1)]
            ),
            secondLegStops: Array.from(
              { length: secondLegStops },
              (_, index) => secondStops[matchingSecondIndex + secondDirection * (index + 1)]
            ),
            boardingStop: firstStops[fromStopIndex],
            exitStop: secondStops[toStopIndex]
          });
        });
      });
    });
    const unique = new Map();
    options.sort((first, second) => first.totalStops - second.totalStops);
    options.forEach((option) => {
      const key = [
        option.firstBus.busNumber,
        option.changeStop,
        option.secondBus.busNumber
      ].map(normalizeStopName).join('|');
      if (!unique.has(key)) {
        unique.set(key, option);
      }
    });
    return Array.from(unique.values());
  }

  function createBusButton(bus, className = 'trip-result-bus') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.dataset.busNumber = bus.busNumber;
    button.textContent = String(bus.busNumber || '');
    button.setAttribute('aria-label', `${window.t('viewBusDetails')} ${bus.busNumber}`);
    return button;
  }

  function appendLiveBadge(parent, bus) {
    if (!liveBusNumbers.has(normalizeBusNumber(bus.busNumber))) {
      return;
    }
    const badge = document.createElement('span');
    badge.className = 'trip-result-live-badge';
    badge.textContent = window.t('liveNow');
    parent.appendChild(badge);
  }

  function appendBusHeading(parent, bus, label = null) {
    const heading = document.createElement('div');
    heading.className = 'trip-result-card__heading';
    if (label) {
      const legLabel = document.createElement('span');
      legLabel.className = 'trip-result-card__leg-label';
      legLabel.textContent = window.t(label);
      heading.appendChild(legLabel);
    }
    heading.appendChild(createBusButton(bus));
    appendLiveBadge(heading, bus);
    const route = document.createElement('span');
    route.className = 'trip-result-card__route';
    route.textContent = window.translateRoute?.(bus.routeName) ||
      String(bus.routeName || '');
    heading.appendChild(route);
    parent.appendChild(heading);
  }

  function formatStopCount(count) {
    return window.t(count === 1 ? 'stopCount' : 'stopsCount', { count });
  }

  function appendTripDetails(parent, trip, bus = null) {
    const details = document.createElement('div');
    details.className = 'trip-result-card__details';
    const direction = document.createElement('p');
    direction.className = 'trip-result-card__direction';
    direction.textContent = trip.direction === 'forward'
      ? window.t('towardsDestination', {
        destination: window.translatePlace?.(trip.destination) || trip.destination
      })
      : window.t('returnDirectionShort');
    const boarding = document.createElement('p');
    boarding.textContent = window.t('boardingStop', {
      stop: window.translatePlace?.(trip.boardingStop) || trip.boardingStop
    });
    const exit = document.createElement('p');
    exit.textContent = window.t('exitStop', {
      stop: window.translatePlace?.(trip.exitStop) || trip.exitStop
    });
    const count = document.createElement('p');
    count.className = 'trip-result-card__count';
    count.textContent = formatStopCount(trip.stopsBetween);
    details.append(direction, boarding, exit, count);
    if (bus) {
      details.dataset.busNumber = bus.busNumber;
    }
    parent.appendChild(details);
  }

  function appendStopsDisclosure(parent, stops) {
    const disclosure = document.createElement('details');
    disclosure.className = 'trip-result-stops';
    const summary = document.createElement('summary');
    summary.textContent = window.t('showTripStops');
    disclosure.appendChild(summary);
    const list = document.createElement('ul');
    stops.forEach((stop) => {
      const item = document.createElement('li');
      item.textContent = window.translatePlace?.(stop) || stop;
      list.appendChild(item);
    });
    disclosure.appendChild(list);
    parent.appendChild(disclosure);
  }

  function renderDirectResult(bus, trip) {
    const item = document.createElement('li');
    item.className = 'trip-result-card';
    appendBusHeading(item, bus);
    appendTripDetails(item, trip, bus);
    appendStopsDisclosure(item, trip.intermediateStops);
    return item;
  }

  function renderTransferResult(option) {
    const item = document.createElement('li');
    item.className = 'trip-result-card trip-result-card--transfer';
    const changeBadge = document.createElement('span');
    changeBadge.className = 'trip-result-change-badge';
    changeBadge.textContent = window.t('oneChangeBadge');
    item.appendChild(changeBadge);
    appendBusHeading(item, option.firstBus, 'busALabel');
    const change = document.createElement('p');
    change.className = 'trip-transfer-change';
    change.textContent = window.t('changeAtStop', {
      stop: window.translatePlace?.(option.changeStop) || option.changeStop
    });
    item.appendChild(change);
    appendBusHeading(item, option.secondBus, 'busBLabel');
    appendTripDetails(item, {
      direction: 'forward',
      destination: option.exitStop,
      boardingStop: option.boardingStop,
      exitStop: option.exitStop,
      stopsBetween: option.totalStops
    });
    appendStopsDisclosure(item, [
      ...option.firstLegStops,
      option.changeStop,
      ...option.secondLegStops
    ]);
    return item;
  }

  function findNearbyStops(query, limit = 4) {
    return canonicalStopNames
      .map((stop) => ({ stop, score: stopMatchScore(stop, query) }))
      .filter((entry) => Number.isFinite(entry.score))
      .sort((first, second) =>
        first.score - second.score || first.stop.localeCompare(second.stop)
      )
      .slice(0, limit)
      .map((entry) => entry.stop);
  }

  function addHintGroup(parent, heading, stops, target) {
    if (!stops.length) {
      return;
    }
    const group = document.createElement('div');
    group.className = 'trip-stop-hints__group';
    const label = document.createElement('p');
    label.textContent = heading;
    group.appendChild(label);
    const options = document.createElement('div');
    options.className = 'trip-stop-hints__options';
    stops.forEach((stop) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'trip-stop-hint';
      button.dataset.stopTarget = target;
      button.dataset.stopValue = stop;
      button.textContent = window.translatePlace?.(stop) || stop;
      options.appendChild(button);
    });
    group.appendChild(options);
    parent.appendChild(group);
  }

  function updateStopValidation() {
    const fromValue = fromInput?.value || '';
    const toValue = toInput?.value || '';
    const fromValid = Boolean(canonicalStop(fromValue));
    const toValid = Boolean(canonicalStop(toValue));
    if (searchButton) {
      searchButton.disabled = !fromValid || !toValid ||
        canonicalStop(fromValue) === canonicalStop(toValue);
    }
    if (stopHints) {
      stopHints.replaceChildren();
      if (fromValue.trim() && !fromValid) {
        addHintGroup(
          stopHints,
          window.t('didYouMeanFrom'),
          findNearbyStops(fromValue),
          'from'
        );
      }
      if (toValue.trim() && !toValid) {
        addHintGroup(
          stopHints,
          window.t('didYouMeanTo'),
          findNearbyStops(toValue),
          'to'
        );
      }
    }
    return fromValid && toValid &&
      canonicalStop(fromValue) !== canonicalStop(toValue);
  }

  function renderNearbySuggestions(from, to) {
    if (!stopHints) {
      return;
    }
    const options = new Map();
    [[from, 'from'], [to, 'to']].forEach(([query, target]) => {
      findNearbyStops(query, 4).forEach((stop) => {
        if (
          canonicalStop(stop) !== canonicalStop(from) &&
          canonicalStop(stop) !== canonicalStop(to)
        ) {
          const key = `${target}|${normalizeStopName(stop)}`;
          if (!options.has(key)) {
            options.set(key, { stop, target });
          }
        }
      });
    });
    stopHints.replaceChildren();
    const group = document.createElement('div');
    group.className = 'trip-stop-hints__group';
    const label = document.createElement('p');
    label.textContent = window.t('nearbyStops');
    group.appendChild(label);
    const buttons = document.createElement('div');
    buttons.className = 'trip-stop-hints__options';
    Array.from(options.values()).slice(0, 3).forEach(({ stop, target }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'trip-stop-hint';
      button.dataset.stopTarget = target;
      button.dataset.stopValue = stop;
      button.textContent = `${window.t(target === 'from' ? 'from' : 'to')}: ${
        window.translatePlace?.(stop) || stop
      }`;
      buttons.appendChild(button);
    });
    if (buttons.childElementCount) {
      group.appendChild(buttons);
      stopHints.appendChild(group);
    }
  }

  async function refreshLiveBusNumbers() {
    if (typeof window.busTypeHelpers?.getActiveBusLocationShares !== 'function') {
      liveBusNumbers = new Set();
      return;
    }
    try {
      const sessions = await window.busTypeHelpers.getActiveBusLocationShares();
      liveBusNumbers = new Set(
        (Array.isArray(sessions) ? sessions : [])
          .map((session) => normalizeBusNumber(session?.bus_number))
          .filter(Boolean)
      );
    } catch (error) {
      console.warn('Could not refresh live badges for trip results.', error);
      liveBusNumbers = new Set();
    }
  }

  async function renderResults() {
    const requestId = ++resultsRequestId;
    directList?.replaceChildren();
    if (message) message.textContent = '';
    const from = fromInput?.value || '';
    const to = toInput?.value || '';
    if (!updateStopValidation()) {
      return;
    }
    await refreshLiveBusNumbers();
    if (
      requestId !== resultsRequestId ||
      from !== (fromInput?.value || '') ||
      to !== (toInput?.value || '')
    ) {
      return;
    }
    const direct = catalog
      .map((bus) => ({ bus, trip: matchTrip(bus, from, to) }))
      .filter((entry) => entry.trip)
      .sort((first, second) =>
        first.trip.stopsBetween - second.trip.stopsBetween
      );
    const transfers = findOneChangeTrips(catalog, from, to);
    const resultEntries = [
      ...direct.map(({ bus, trip }) => ({ type: 'direct', bus, trip })),
      ...transfers.map((option) => ({ type: 'transfer', option }))
    ].slice(0, 15);
    resultEntries.forEach((entry) => {
      const card = entry.type === 'direct'
        ? renderDirectResult(entry.bus, entry.trip)
        : renderTransferResult(entry.option);
      directList?.appendChild(card);
    });
    if (!resultEntries.length) {
      if (message) message.textContent = window.t('noBusTryNearbyStop');
      renderNearbySuggestions(from, to);
    } else {
      stopHints?.replaceChildren();
    }
  }

  function renderStopSuggestions() {
    if (!suggestions) {
      return;
    }
    suggestions.replaceChildren();
    canonicalStopNames
      .sort((first, second) => first.localeCompare(second))
      .forEach((stop) => {
        const option = document.createElement('option');
        option.value = stop;
        suggestions.appendChild(option);
      });
  }

  function setCatalog(buses) {
    catalog = Array.isArray(buses) ? buses : [];
    rebuildStopAliases();
    renderStopSuggestions();
    updateStopValidation();
    if (canonicalStop(fromInput?.value) && canonicalStop(toInput?.value)) {
      void renderResults();
    }
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    void renderResults();
  });
  [fromInput, toInput].forEach((input) => {
    input?.addEventListener('input', () => {
      resultsRequestId += 1;
      updateStopValidation();
      directList?.replaceChildren();
      if (message) message.textContent = '';
    });
  });
  swapButton?.addEventListener('click', () => {
    if (!fromInput || !toInput) {
      return;
    }
    const previousFrom = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = previousFrom;
    fromInput.focus();
    updateStopValidation();
    if (canonicalStop(fromInput.value) && canonicalStop(toInput.value)) {
      void renderResults();
    }
  });
  directList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-bus-number]');
    if (button) {
      window.dispatchEvent(new CustomEvent('tripbusselect', {
        detail: { busNumber: button.dataset.busNumber }
      }));
    }
  });
  stopHints?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-stop-value]');
    if (!button) {
      return;
    }
    const input = button.dataset.stopTarget === 'to' ? toInput : fromInput;
    if (input) {
      input.value = button.dataset.stopValue;
      updateStopValidation();
      input.focus();
    }
  });
  window.addEventListener('languagechange', () => {
    renderStopSuggestions();
    updateStopValidation();
    if (canonicalStop(fromInput?.value) && canonicalStop(toInput?.value)) {
      void renderResults();
    }
  });

  async function getLastSeenBusShare(busNumber, busCode = null) {
    if (!window.supabaseClient || !busNumber) {
      return {
        data: null,
        error: new Error('Supabase client and bus number are required.')
      };
    }

    let query = window.supabaseClient
      .from('bus_location_shares')
      .select('updated_at')
      .eq('bus_number', busNumber)
      .order('updated_at', { ascending: false })
      .limit(1);
    if (busCode) {
      query = query.eq('bus_code', busCode);
    }
    const { data, error } = await query;
    if (error) {
      return { data: null, error };
    }
    return {
      data: Array.isArray(data) ? data[0] || null : data || null,
      error: null
    };
  }

  window.TripTools = Object.freeze({
    normalizeStopName,
    getBusStops,
    isStopMatch,
    matchTrip,
    findOneChangeTrips,
    setCatalog,
    renderResults,
    getLastSeenBusShare
  });
})();
