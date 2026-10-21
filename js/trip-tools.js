(() => {
  const fromInput = document.getElementById('tripFrom');
  const toInput = document.getElementById('tripTo');
  const suggestions = document.getElementById('tripStopSuggestions');
  const form = document.getElementById('tripPlannerForm');
  const swapButton = document.getElementById('swapTripStopsBtn');
  const directList = document.getElementById('tripPlannerResults');
  const transferList = document.getElementById('tripPlannerChanges');
  const message = document.getElementById('tripPlannerMessage');
  let catalog = [];

  function normalizeStopName(value) {
    return String(value || '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '');
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
    return stopMatchScore(candidate, query) < Infinity;
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
    return allStops.filter((stop, index) => (
      index === 0 ||
      normalizeStopName(stop) !== normalizeStopName(allStops[index - 1])
    ));
  }

  function findStopIndex(stops, query) {
    let best = null;
    stops.forEach((stop, index) => {
      const score = stopMatchScore(stop, query);
      if (Number.isFinite(score) && (!best || score < best.score)) {
        best = { index, score };
      }
    });
    return best?.index ?? -1;
  }

  function matchTrip(bus, from, to) {
    if (!normalizeStopName(from) || !normalizeStopName(to) ||
        normalizeStopName(from) === normalizeStopName(to)) {
      return null;
    }

    const stops = getBusStops(bus);
    const fromIndex = findStopIndex(stops, from);
    const toIndex = findStopIndex(stops, to);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
      return null;
    }

    return {
      stops,
      fromIndex,
      toIndex,
      stopsBetween: Math.max(0, Math.abs(toIndex - fromIndex) - 1),
      intermediateStops: stops.slice(
        Math.min(fromIndex, toIndex) + 1,
        Math.max(fromIndex, toIndex)
      ),
      direction: fromIndex < toIndex ? 'forward' : 'return',
      destination: fromIndex < toIndex
        ? stops[stops.length - 1]
        : stops[0]
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
            isStopMatch(changeStop, from) ||
            isStopMatch(changeStop, to)
          ) {
            return;
          }
          const matchingSecondIndex = secondStops.findIndex((secondStop) =>
            isStopMatch(changeStop, secondStop)
          );
          if (
            matchingSecondIndex < 0 ||
            matchingSecondIndex === toStopIndex
          ) {
            return;
          }
          const firstLegStops = Math.abs(changeIndex - fromStopIndex) - 1;
          const secondLegStops = Math.abs(toStopIndex - matchingSecondIndex) - 1;
          options.push({
            firstBus,
            secondBus,
            changeStop,
            totalStops: firstLegStops + secondLegStops,
            firstLegStops: firstStops.slice(
              Math.min(changeIndex, fromStopIndex) + 1,
              Math.max(changeIndex, fromStopIndex)
            ),
            secondLegStops: secondStops.slice(
              Math.min(matchingSecondIndex, toStopIndex) + 1,
              Math.max(matchingSecondIndex, toStopIndex)
            )
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
    return Array.from(unique.values()).slice(0, 8);
  }

  function createBusButton(bus, className = 'trip-result-bus') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.dataset.busNumber = bus.busNumber;
    button.textContent = bus.busNumber;
    button.setAttribute('aria-label', `${window.t('viewBusDetails')} ${bus.busNumber}`);
    return button;
  }

  function appendStopsDisclosure(parent, stops) {
    const disclosure = document.createElement('details');
    disclosure.className = 'trip-result-stops';
    const summary = document.createElement('summary');
    summary.textContent = window.t('viewStops', { count: stops.length });
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
    const heading = document.createElement('div');
    heading.className = 'trip-result-card__heading';
    heading.appendChild(createBusButton(bus));
    const route = document.createElement('span');
    route.className = 'trip-result-card__route';
    route.textContent = window.translateRoute?.(bus.routeName) || bus.routeName;
    heading.appendChild(route);
    item.appendChild(heading);
    const direction = document.createElement('p');
    direction.className = 'trip-result-card__direction';
    direction.textContent = trip.direction === 'forward'
      ? window.t('towardsDestination', {
        destination: window.translatePlace?.(trip.destination) || trip.destination
      })
      : window.t('returnDirection', {
        startingPoint: window.translatePlace?.(trip.destination) || trip.destination
      });
    item.appendChild(direction);
    const count = document.createElement('p');
    count.className = 'trip-result-card__count';
    count.textContent = window.t('stopsBetween', {
      count: trip.stopsBetween
    });
    item.appendChild(count);
    appendStopsDisclosure(item, trip.intermediateStops);
    return item;
  }

  function renderTransferResult(option) {
    const item = document.createElement('li');
    item.className = 'trip-result-card trip-result-card--transfer';
    const firstLeg = document.createElement('div');
    firstLeg.className = 'trip-transfer-leg';
    firstLeg.appendChild(createBusButton(option.firstBus));
    const firstRoute = document.createElement('span');
    firstRoute.textContent = window.translateRoute?.(option.firstBus.routeName) ||
      option.firstBus.routeName;
    firstLeg.appendChild(firstRoute);
    const change = document.createElement('p');
    change.className = 'trip-transfer-change';
    change.textContent = window.t('changeAtStop', {
      stop: window.translatePlace?.(option.changeStop) || option.changeStop
    });
    const secondLeg = document.createElement('div');
    secondLeg.className = 'trip-transfer-leg';
    secondLeg.appendChild(createBusButton(option.secondBus));
    const secondRoute = document.createElement('span');
    secondRoute.textContent = window.translateRoute?.(option.secondBus.routeName) ||
      option.secondBus.routeName;
    secondLeg.appendChild(secondRoute);
    const stops = document.createElement('p');
    stops.className = 'trip-result-card__count';
    stops.textContent = window.t('stopsBetween', {
      count: option.totalStops
    });
    item.append(firstLeg, change, secondLeg, stops);
    const intermediate = [...option.firstLegStops, ...option.secondLegStops];
    if (intermediate.length) {
      appendStopsDisclosure(item, intermediate);
    }
    return item;
  }

  function renderResults() {
    directList?.replaceChildren();
    transferList?.replaceChildren();
    if (message) {
      message.textContent = '';
    }
    const from = fromInput?.value || '';
    const to = toInput?.value || '';
    if (!normalizeStopName(from) || !normalizeStopName(to)) {
      if (message) {
        message.textContent = window.t('enterTripStops');
      }
      return;
    }
    const direct = catalog
      .map((bus) => ({ bus, trip: matchTrip(bus, from, to) }))
      .filter((entry) => entry.trip)
      .sort((first, second) =>
        first.trip.stopsBetween - second.trip.stopsBetween
      );
    const transfers = findOneChangeTrips(catalog, from, to);
    direct.forEach(({ bus, trip }) => {
      directList?.appendChild(renderDirectResult(bus, trip));
    });
    transfers.forEach((option) => {
      transferList?.appendChild(renderTransferResult(option));
    });
    if (!direct.length && !transfers.length && message) {
      message.textContent = window.t('noBusTryNearbyStop');
    } else if (!direct.length && message) {
      message.textContent = window.t('noDirectBusFound');
    }
  }

  function renderStopSuggestions() {
    if (!suggestions) {
      return;
    }
    const stopNames = new Map();
    catalog.forEach((bus) => {
      getBusStops(bus).forEach((stop) => {
        const key = normalizeStopName(stop);
        if (key && !stopNames.has(key)) {
          stopNames.set(key, stop);
        }
      });
    });
    suggestions.replaceChildren();
    Array.from(stopNames.values())
      .sort((first, second) => first.localeCompare(second))
      .forEach((stop) => {
        const option = document.createElement('option');
        option.value = stop;
        suggestions.appendChild(option);
      });
  }

  function setCatalog(buses) {
    catalog = Array.isArray(buses) ? buses : [];
    renderStopSuggestions();
    if (normalizeStopName(fromInput?.value) && normalizeStopName(toInput?.value)) {
      renderResults();
    }
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    renderResults();
  });
  swapButton?.addEventListener('click', () => {
    if (!fromInput || !toInput) {
      return;
    }
    const previousFrom = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = previousFrom;
    fromInput.focus();
    if (normalizeStopName(fromInput.value) && normalizeStopName(toInput.value)) {
      renderResults();
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
  transferList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-bus-number]');
    if (button) {
      window.dispatchEvent(new CustomEvent('tripbusselect', {
        detail: { busNumber: button.dataset.busNumber }
      }));
    }
  });
  window.addEventListener('languagechange', () => {
    renderStopSuggestions();
    if (normalizeStopName(fromInput?.value) && normalizeStopName(toInput?.value)) {
      renderResults();
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
