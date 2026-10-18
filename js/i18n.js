(() => {
  // A native Telugu speaker should review these translations.
  const dictionary = {
    en: {
      sharingDisclaimerTitle: 'A quick note about location sharing',
      homeLabel: 'APSRTC Live home',
      more: 'More',
      shareMyBusLocation: 'Share my bus location',
      closeDetails: 'Close details',
      closeMenu: 'Close menu',
      toggleDarkMode: 'Toggle dark mode',
      disclaimerOptional: 'Location sharing is optional and starts only when you tap “I’m on this bus”.',
      disclaimerPermission: 'Your browser may ask you to allow location access; you may need to enable it in your browser settings.',
      disclaimerRiding: 'Please share only when you are genuinely riding that bus so the information stays trustworthy.',
      disclaimerStop: 'Remember to stop sharing, or let it expire automatically, when your ride is done.',
      disclaimerPrivacy: 'Your location is not linked to your identity and is used only to show live bus positions to other riders.',
      disclaimerAccuracy: 'Accuracy depends on your device’s GPS and network. We do our best, but cannot guarantee perfect accuracy.',
      disclaimerBackground: 'For the best experience, keep this tab open while sharing your location. Switching apps may pause updates.',
      disclaimerThanks: 'Thank you for helping fellow riders. Your contribution makes it easier for everyone to travel with confidence.',
      okayGotIt: 'OK, got it',
      loadingApp: 'Loading APSRTC Live...',
      connectionError: 'We’re having trouble connecting right now. Please try again in a moment.',
      eyebrow: 'Crowdsourced bus visibility',
      tagline: 'Know where your bus is.',
      liveBusCount: '{count} buses live now',
      liveBusCountOne: '{count} bus live now',
      loadingCatalog: 'Loading bus catalog...',
      noBusRecords: 'No bus records were returned from Supabase.',
      loadedBusCatalog: 'Loaded {count} buses from the live catalog.',
      busNumberLabel: 'Bus number',
      busNumberPlaceholder: 'Enter bus number',
      findBus: 'Find Bus',
      useMyLocation: '📍 Use my location',
      addNewBus: 'Add new bus',
      recent: 'Recent:',
      recentSearches: 'Recently searched buses',
      sampleBusNumber: '28',
      sampleRoute: 'RK Beach - Simhachalam',
      sampleStartingPoint: 'RK Beach',
      sampleDestination: 'Simhachalam',
      sampleStops: 'RK Beach, Waltair, Siripuram',
      addBusHeading: 'Add a new bus',
      busNumberRequired: 'Bus number *',
      routeRequired: 'Route *',
      startingPointRequired: 'Starting point *',
      destinationRequired: 'Destination *',
      stopsCommaSeparated: 'Stops (comma-separated)',
      createBus: 'Create bus',
      back: 'Back',
      busDetails: 'Bus details',
      share: '🔗 Share',
      activeBusesOnRoute: 'Active buses on this route',
      busInformation: 'Bus information',
      detailsTab: 'Details',
      liveStatus: 'Live Status',
      capacity: 'Capacity',
      busNumber: 'Bus number',
      route: 'Route',
      startingPoint: 'Starting point',
      destination: 'Destination',
      stops: 'Stops',
      trackingStatus: 'Tracking status',
      busSession: 'Bus session',
      reportIssue: '🚩 Report an issue',
      speed: 'Speed',
      movement: 'Movement',
      calculating: 'Calculating...',
      waitingMovement: 'Waiting for movement data.',
      busMoving: 'Bus is moving',
      busNotMoving: 'Bus is not moving',
      busStationary: 'Bus appears stationary',
      lastMovedSeconds: 'Last moved: {seconds} seconds ago',
      lastMovement: 'Last movement',
      locationOutdated: '⚠️ Location may be outdated',
      mapLocation: 'Bus map location',
      capacityNotReported: 'Capacity: Not reported yet',
      reportCapacity: 'Report bus capacity',
      empty: '🟢 Empty',
      halfFull: '🟡 Half Full',
      full: '🔴 Full',
      chooseBusType: 'Choose the bus type before sharing',
      ordinary: 'Ordinary',
      metroExpress: 'Metro Express',
      chooseRidingType: 'Choose the type you are riding.',
      onThisBus: '📍 I’m on this bus',
      sharingTime: 'Sharing time',
      fifteenMinutes: '15 minutes',
      thirtyMinutes: '30 minutes',
      oneHour: '1 hour',
      untilIStop: 'Until I stop',
      custom: 'Custom',
      customMinutes: 'Custom sharing duration in minutes',
      minutes: 'Minutes',
      gpsNote: 'GPS updates depend on your device and may take 15–60 seconds between updates.',
      stopSharing: 'Stop Sharing',
      locationSharing: 'Location sharing',
      sharingInactive: 'Location sharing is inactive.',
      sharingReminder: '📱 Keep this tab open while sharing for the best results. Switching apps may pause your updates.',
      technicalDetails: 'Show technical details',
      latitude: 'Latitude:',
      longitude: 'Longitude:',
      lastLocationUpdate: 'Last location update:',
      gpsWaiting: 'GPS debug: waiting to start.',
      searchPrompt: 'Search for a bus number to view live route details.',
      searchResults: 'Search results',
      availableBuses: 'Available buses',
      shareThisBus: 'Share this bus',
      closeShareSheet: 'Close share sheet',
      shareOptions: 'Share options',
      copyLink: 'Copy Link',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      xSocial: 'X',
      email: 'Email',
      messages: 'Messages',
      shareViaQr: 'Share via QR',
      moreOptions: 'More options',
      trackBusLive: 'Track Bus {number}{type} live on APSRTC Live',
      qrCodeLabel: 'Bus link QR code',
      qrCodeAlt: 'QR code for this bus link',
      downloadQr: 'Download QR',
      about: 'About',
      aboutText: 'APSRTC Live is a free community bus tracker for Visakhapatnam. It is not officially affiliated with APSRTC.',
      howItWorks: 'How it works',
      howItWorksText: 'Search for your bus to see its live location when someone shares it. If you are riding, tap “I’m on this bus” to help others.',
      privacy: 'Privacy',
      privacyText: 'Location is shared only when a user chooses to share. It expires automatically and is not linked to personal identity.',
      disclaimer: 'Disclaimer',
      disclaimerText: 'This community tool depends on rider participation. Location may not always be available or accurate.',
      contact: 'Contact',
      siteInformation: 'Site information',
      contactText: 'Report issues or send feedback to',
      footerCredits: 'Share sheet inspired by VengeanceUI. QR by qrcode-generator (MIT).',
      installApp: 'Install app',
      iosInstallHint: 'Tap Share, then Add to Home Screen',
      dismiss: 'Dismiss',
      dismissInstallHint: 'Dismiss install hint',
      noLiveTracking: '⚪ No live tracking',
      liveNow: 'Live now',
      liveStatusUnavailable: 'Live status unavailable',
      noBusesAvailable: 'No buses available right now.',
      routeLabel: 'Route: {route}',
      activeBusesRoute: 'Active buses on route {number}',
      chooseSpecificBus: 'Select a specific bus to track.',
      sessionLookupUnavailable: 'Live session lookup is unavailable right now.',
      routeSessionLoadFailed: 'Could not load active buses for this route.',
      distanceKmAway: '{distance} km away',
      updated: 'Updated {time}',
      updatedJustNow: 'Updated just now',
      liveLocationUpdated: 'Live bus location found. Updated {time}',
      liveUpdatedJustNow: 'Live bus location found. Updated just now',
      nearbyActiveBuses: 'Nearby active buses',
      noNearbyBuses: 'No buses found nearby right now. Try searching by bus number instead, or check back later.',
      noActiveBuses: 'No active buses right now.',
      nearbyTitle: 'Nearby active buses',
      busNotFound: 'Bus not found.',
      noStops: 'No stops available.',
      enterBusNumber: 'Please enter a bus number to continue.',
      searchChoice: 'Choose a bus matching “{query}”.',
      busesFound: '{count} buses found. Select one to view details.',
      showBusDetails: 'Showing details for bus {number}.',
      selectedBusDetails: 'Showing details for bus {number}.',
      busNotFoundForDetails: 'The shared bus route could not be found.',
      liveLocationUnavailable: 'Live location lookup is unavailable right now.',
      noLiveLocation: 'No live location available for this bus.',
      liveLocationLoadFailed: 'Could not load the live location right now.',
      liveLocationUpdatedPrefix: 'Live bus location found. Updated ',
      staleLocationWarning: '⚠️ This bus location has not updated recently and may not be accurate. The rider may have closed the app or lost connection.',
      sharingStopped: 'Sharing stopped',
      locationSharingStopped: 'Location sharing stopped.',
      unableToGetLocation: 'Unable to get your location.',
      locationPermissionDenied: 'Location permission denied.',
      locationUnavailable: 'Location unavailable.',
      locationRequestTimedOut: 'Location request timed out.',
      sharingActive: 'Location sharing is active',
      requestingLocation: 'Requesting your location...',
      openAppSettings: 'Open app settings',
      busTypeRequired: 'Please choose a bus type before starting to share.',
      chooseRidingTypeHint: 'Choose the type you are riding.',
      thankYouShare: 'Thank you for helping fellow riders!',
      keepAppOpen: 'Keep this app open in your recent apps while sharing. Swiping it away stops sharing.',
      invalidDuration: 'Enter a whole number of minutes between 1 and {maximum}.',
      customDurationOption: '{minutes} minutes (Custom)',
      selectBusFirst: 'Select a specific bus first.',
      selectActiveSessionCapacity: 'Select an active bus session before reporting capacity.',
      selectedRoute: 'selected route',
      shareConfirmationThanks: '🙌 Thank you for helping fellow riders! Your live location will help others find Bus {number}.',
      shareConfirmationAppreciation: 'We appreciate your help and trust. 💙',
      shareConfirmationType: 'Bus type: {type}',
      shareConfirmationSession: 'Sharing session: {code} - {route}',
      shareConfirmationAsk: 'Would you like to start sharing?',
      capacitySaving: 'Saving capacity...',
      capacityUpdated: 'Capacity updated.',
      capacityUpdateFailed: 'Could not update capacity. Please try again.',
      locationNotAvailable: 'Location is not available in this browser.',
      locationUnsupported: 'Location sharing is not supported by this browser.',
      lookingNearby: 'Looking for nearby buses...',
      nearbyLoaded: 'Nearby buses loaded.',
      nearbyFailed: 'Could not find nearby buses right now.',
      viewerLocationFailed: 'Could not get your location to find nearby buses.',
      addBusInstructions: 'Fill in the bus details and submit to add a new bus.',
      supabaseUnavailable: 'Cannot connect to Supabase right now.',
      requiredBusFields: 'Bus number, route, starting point, and destination are required.',
      addingBus: 'Adding bus...',
      busAdded: 'Bus {number} added successfully.',
      couldNotAddBus: 'Could not add the bus. Please try again.',
      savedSessionTitle: 'Continue sharing?',
      savedSessionPrompt: 'You were sharing Bus {number}. Do you want to continue?',
      resumeSharing: 'Resume sharing',
      remainingSessionTime: 'Remaining session time',
      sharingExpired: 'That sharing session has expired.',
      couldNotReconnect: 'Could not reconnect to the bus. Please try again.',
      couldNotResume: 'Could not resume sharing. Please try again.',
      linkCopied: 'Link copied!',
      copyFailed: 'Sorry, the link could not be copied. You can copy it from the address bar.',
      qrUnavailable: 'QR sharing is unavailable right now.',
      sharingUnavailable: 'Sharing is unavailable right now.',
      invalidShareLink: 'This bus link is not available to share.',
      couldNotLoadSharedLink: 'The shared bus link could not be loaded.',
      sharedSessionNotFound: 'The shared bus session could not be found.',
      sharedSessionShown: 'Showing shared bus session {code}.',
      connectionProblem: 'Could not load that bus right now.',
      notAvailable: 'Not available',
      justNow: 'just now',
      secondsAgo: '{count} seconds ago',
      secondAgo: '{count} second ago',
      minutesAgo: '{count} minutes ago',
      minuteAgo: '{count} minute ago',
      hoursAgo: '{count} hours ago',
      hourAgo: '{count} hour ago',
      daysAgo: '{count} days ago',
      dayAgo: '{count} day ago',
      myLocation: 'My Location',
      liveBusLocation: '🚌 Live Bus Location',
      shareSaveFailed: 'Location sharing is active, but the latest position could not be saved.',
      nativeTrackingError: 'Native tracking encountered an error.',
      nativeLocationPermission: 'Allow location access “All the time” in app settings to share while the screen is locked.',
      catalogCardAria: 'Search bus {number}. {status}.',
      recentBusAria: 'Search bus {number}.',
      active: 'Active',
      inactive: 'Inactive',
      changeLanguage: 'Change language: English',
      privacyLink: 'Privacy and how it works',
      privacyTitle: 'Privacy and how it works | APSRTC Live',
      privacyHeading: 'Privacy and how it works',
      privacyIntro: 'APSRTC Live is a free, crowdsourced bus tracker. Information comes from riders and is not official APSRTC information.',
      privacyHowTitle: 'How it works',
      privacyHowText: 'A rider can choose to share their bus’s location while they are on the bus. Other people can then see the shared location on the map.',
      privacyCollectedTitle: 'Information used while sharing',
      privacyCollectedText: 'Only when someone shares, we collect the bus number, a session code, the bus type, latitude and longitude, and the time of the latest location update. Riders can also submit a capacity report: empty, half-full, or full.',
      privacySessionText: 'Location sharing starts only after the rider taps to start, and continues only while sharing is on. Each session stores the latest position, replacing it with each update. The last position from a finished session may remain stored until old records are cleared.',
      privacyNotCollectedTitle: 'Information we do not collect',
      privacyNotCollectedText: 'We do not collect your name, email address, phone number, or account details. There are no ads.',
      privacyStorageTitle: 'Storage and use',
      privacyStorageText: 'Shared data is stored with Supabase. We do not sell it or share it for advertising.',
      privacyDeviceText: 'Your device stores your theme, language, recent searches, last selected bus type, and active sharing session in localStorage.',
      privacyAccuracyTitle: 'Accuracy and safety',
      privacyAccuracyText: 'Location accuracy is not guaranteed. Do not rely on APSRTC Live for urgent travel or safety decisions.',
      privacyTeluguSummaryTitle: 'Summary',
      privacyTeluguSummaryText: 'APSRTC Live is a free bus tracker with location shared by riders. Bus details and location are stored only when a rider starts sharing. We do not collect names, phone numbers, email addresses, or account details. Location accuracy is not guaranteed; do not rely on it for urgent travel.',
      privacyContactTitle: 'Contact',
      privacyContactText: 'Questions or feedback?',
      privacyLastUpdated: 'Last updated:',
      privacyBack: 'Back to APSRTC Live',
      busPageTitle: 'Bus {number} - APSRTC Live',
      issueSubject: 'APSRTC Live issue',
      issueWithBus: 'Issue with Bus {number}',
      siteDescription: 'APSRTC Live is a free, crowdsourced bus tracker for Visakhapatnam with rider-submitted real-time GPS locations.',
      gpsStatusWaiting: 'waiting',
      gpsStopped: 'stopped',
      gpsCallbackReceived: 'callback received',
      gpsWatcherStarted: 'GPS watcher started',
      gpsLocationError: 'geolocation error',
      unknownStatus: 'unknown',
      none: 'none',
      waiting: 'waiting',
      waitingForCallback: 'waiting for callback',
      debugTimestamp: '{value}',
      gpsWatcherLabel: 'GPS watcher: {status}',
      lastCallbackLabel: 'Last callback: {time}',
      latestCoordinates: 'Latest lat/lng: {latitude}, {longitude}',
      errorLabel: 'Error: {error}',
      gpsWaitingMessage: 'GPS debug: waiting to start.',
      nativeSourceRegisterPlugin: 'Native tracking: using registerPlugin',
      nativeSourceCapacitorPlugins: 'Native tracking: using Capacitor.Plugins',
      nativePluginMissing: 'Native tracking: plugin not found, using browser GPS',
    },
    te: {
      sharingDisclaimerTitle: 'స్థానాన్ని పంచుకోవడం గురించి చిన్న గమనిక',
      homeLabel: 'APSRTC Live హోమ్',
      more: 'మరిన్ని',
      shareMyBusLocation: 'నా బస్సు స్థానాన్ని షేర్ చేయండి',
      closeDetails: 'వివరాలు మూసివేయండి',
      closeMenu: 'మెనూను మూసివేయండి',
      toggleDarkMode: 'డార్క్ మోడ్ మార్చండి',
      disclaimerOptional: 'స్థానాన్ని పంచుకోవడం మీ ఇష్టం. “నేను ఈ బస్సులో ఉన్నాను” నొక్కినప్పుడే ఇది మొదలవుతుంది.',
      disclaimerPermission: 'మీ స్థానం కోసం అనుమతి అడగవచ్చు. అవసరమైతే బ్రౌజర్ సెట్టింగ్స్‌లో అనుమతించండి.',
      disclaimerRiding: 'మీరు నిజంగా ఆ బస్సులో ప్రయాణిస్తున్నప్పుడే వివరాలు పంచుకోండి. అప్పుడు సమాచారం నమ్మదగినదిగా ఉంటుంది.',
      disclaimerStop: 'ప్రయాణం పూర్తయ్యాక షేరింగ్ ఆపండి లేదా సమయం ముగిసే వరకు వేచి ఉండండి.',
      disclaimerPrivacy: 'మీ స్థానం మీ వ్యక్తిగత వివరాలకు జత చేయబడదు. ఇతర ప్రయాణికులకు బస్సు స్థానం చూపించడానికే ఉపయోగిస్తాం.',
      disclaimerAccuracy: 'స్థాన ఖచ్చితత్వం మీ ఫోన్ GPS, నెట్‌వర్క్‌పై ఆధారపడి ఉంటుంది. సాధ్యమైనంత మెరుగైన సమాచారం అందిస్తాం.',
      disclaimerBackground: 'మంచి ఫలితాల కోసం షేర్ చేస్తున్నప్పుడు ఈ పేజీని తెరిచి ఉంచండి. మరో యాప్‌కు మారితే అప్‌డేట్లు ఆగవచ్చు.',
      disclaimerThanks: 'ఇతర ప్రయాణికులకు సహాయం చేస్తున్నందుకు ధన్యవాదాలు. మీ సహకారంతో అందరి ప్రయాణం సులభమవుతుంది.',
      okayGotIt: 'సరే',
      loadingApp: 'APSRTC Live లోడ్ అవుతోంది...',
      connectionError: 'కనెక్షన్‌లో సమస్య ఉంది. కొద్దిసేపటి తర్వాత మళ్లీ ప్రయత్నించండి.',
      eyebrow: 'ప్రయాణికులు పంచుకునే బస్సు సమాచారం',
      tagline: 'మీ బస్సు ఎక్కడుందో తెలుసుకోండి.',
      liveBusCount: 'ప్రస్తుతం {count} బస్సులు లైవ్‌లో ఉన్నాయి',
      liveBusCountOne: 'ప్రస్తుతం {count} బస్సు లైవ్‌లో ఉంది',
      loadingCatalog: 'బస్సుల జాబితా లోడ్ అవుతోంది...',
      noBusRecords: 'Supabase నుంచి బస్సుల వివరాలు రాలేదు.',
      loadedBusCatalog: 'లైవ్ జాబితా నుంచి {count} బస్సులు లోడ్ అయ్యాయి.',
      busNumberLabel: 'బస్సు నంబర్',
      busNumberPlaceholder: 'బస్సు నంబర్ నమోదు చేయండి',
      findBus: 'బస్సును వెతకండి',
      useMyLocation: '📍 నా స్థానాన్ని ఉపయోగించండి',
      addNewBus: 'కొత్త బస్సు జోడించండి',
      recent: 'ఇటీవల:',
      recentSearches: 'ఇటీవల వెతికిన బస్సులు',
      sampleBusNumber: '28',
      sampleRoute: 'ఆర్‌కే బీచ్ - సింహాచలం',
      sampleStartingPoint: 'ఆర్‌కే బీచ్',
      sampleDestination: 'సింహాచలం',
      sampleStops: 'ఆర్‌కే బీచ్, వాల్తేరు, సిరిపురం',
      addBusHeading: 'కొత్త బస్సు జోడించండి',
      busNumberRequired: 'బస్సు నంబర్ *',
      routeRequired: 'రూట్ *',
      startingPointRequired: 'ప్రారంభ స్థలం *',
      destinationRequired: 'గమ్యస్థానం *',
      stopsCommaSeparated: 'స్టాప్‌లు (కామాతో వేరు చేయండి)',
      createBus: 'బస్సును జోడించండి',
      back: 'వెనక్కి',
      busDetails: 'బస్సు వివరాలు',
      share: '🔗 షేర్ చేయండి',
      activeBusesOnRoute: 'ఈ రూట్‌లో లైవ్ బస్సులు',
      busInformation: 'బస్సు సమాచారం',
      detailsTab: 'వివరాలు',
      liveStatus: 'లైవ్ స్థితి',
      capacity: 'రద్దీ',
      busNumber: 'బస్సు నంబర్',
      route: 'రూట్',
      startingPoint: 'ప్రారంభ స్థలం',
      destination: 'గమ్యస్థానం',
      stops: 'స్టాప్‌లు',
      trackingStatus: 'ట్రాకింగ్ స్థితి',
      busSession: 'బస్సు సెషన్',
      reportIssue: '🚩 సమస్యను తెలియజేయండి',
      speed: 'వేగం',
      movement: 'కదలిక',
      calculating: 'లెక్కిస్తోంది...',
      waitingMovement: 'కదలిక వివరాల కోసం వేచి ఉంది.',
      busMoving: 'బస్సు కదులుతోంది',
      busNotMoving: 'బస్సు కదలడం లేదు',
      busStationary: 'బస్సు ఆగి ఉన్నట్లు కనిపిస్తోంది',
      lastMovedSeconds: 'చివరిగా కదిలింది: {seconds} సెకన్ల క్రితం',
      lastMovement: 'చివరి కదలిక',
      locationOutdated: '⚠️ స్థానం పాతది కావచ్చు',
      mapLocation: 'బస్సు మ్యాప్ స్థానం',
      capacityNotReported: 'రద్దీ: ఇంకా సమాచారం లేదు',
      reportCapacity: 'బస్సు రద్దీని తెలియజేయండి',
      empty: '🟢 ఖాళీ',
      halfFull: '🟡 సగం నిండింది',
      full: '🔴 నిండింది',
      chooseBusType: 'షేర్ చేయడానికి ముందు బస్సు రకాన్ని ఎంచుకోండి',
      ordinary: 'సాధారణ',
      metroExpress: 'మెట్రో ఎక్స్‌ప్రెస్',
      chooseRidingType: 'మీరు ప్రయాణిస్తున్న బస్సు రకాన్ని ఎంచుకోండి.',
      onThisBus: '📍 నేను ఈ బస్సులో ఉన్నాను',
      sharingTime: 'షేర్ చేసే సమయం',
      fifteenMinutes: '15 నిమిషాలు',
      thirtyMinutes: '30 నిమిషాలు',
      oneHour: '1 గంట',
      untilIStop: 'నేను ఆపే వరకు',
      custom: 'ఇతర సమయం',
      customMinutes: 'షేరింగ్ సమయం నిమిషాల్లో',
      minutes: 'నిమిషాలు',
      gpsNote: 'మీ ఫోన్‌ను బట్టి GPS అప్‌డేట్‌కు 15–60 సెకన్లు పట్టవచ్చు.',
      stopSharing: 'షేరింగ్ ఆపండి',
      locationSharing: 'స్థాన షేరింగ్',
      sharingInactive: 'స్థాన షేరింగ్ ఆఫ్‌లో ఉంది.',
      sharingReminder: '📱 షేర్ చేస్తున్నప్పుడు ఈ పేజీని తెరిచి ఉంచండి. మరో యాప్‌కు మారితే అప్‌డేట్లు ఆగవచ్చు.',
      technicalDetails: 'సాంకేతిక వివరాలు చూడండి',
      latitude: 'అక్షాంశం:',
      longitude: 'రేఖాంశం:',
      lastLocationUpdate: 'చివరి స్థాన అప్‌డేట్:',
      gpsWaiting: 'GPS వివరాలు: ప్రారంభం కోసం వేచి ఉంది.',
      searchPrompt: 'లైవ్ రూట్ వివరాల కోసం బస్సు నంబర్ వెతకండి.',
      searchResults: 'వెతుకులాట ఫలితాలు',
      availableBuses: 'అందుబాటులో ఉన్న బస్సులు',
      shareThisBus: 'ఈ బస్సును షేర్ చేయండి',
      closeShareSheet: 'షేర్ విండో మూసివేయండి',
      shareOptions: 'షేర్ ఎంపికలు',
      copyLink: 'లింక్ కాపీ చేయండి',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      xSocial: 'X',
      email: 'ఈమెయిల్',
      messages: 'సందేశాలు',
      shareViaQr: 'QR ద్వారా షేర్ చేయండి',
      moreOptions: 'మరిన్ని ఎంపికలు',
      trackBusLive: 'APSRTC Liveలో {number}{type} బస్సును లైవ్‌లో ట్రాక్ చేయండి',
      qrCodeLabel: 'బస్సు లింక్ QR కోడ్',
      qrCodeAlt: 'ఈ బస్సు లింక్ QR కోడ్',
      downloadQr: 'QR డౌన్‌లోడ్',
      about: 'మా గురించి',
      aboutText: 'APSRTC Live విశాఖపట్నం కోసం ప్రయాణికుల సహకారంతో నడిచే ఉచిత బస్సు ట్రాకర్. ఇది APSRTC అధికారిక సేవ కాదు.',
      howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
      howItWorksText: 'ఎవరైనా బస్సు స్థానాన్ని షేర్ చేస్తే వెతికి చూడండి. మీరు బస్సులో ఉంటే “నేను ఈ బస్సులో ఉన్నాను” నొక్కి ఇతరులకు సహాయం చేయండి.',
      privacy: 'గోప్యత',
      privacyText: 'మీరు స్వయంగా ఎంచుకున్నప్పుడే స్థానం షేర్ అవుతుంది. కొంతసేపటి తర్వాత ఆగిపోతుంది; మీ వ్యక్తిగత వివరాలకు జత చేయబడదు.',
      disclaimer: 'గమనిక',
      disclaimerText: 'ఈ సేవ ప్రయాణికుల సహకారంపై ఆధారపడి ఉంటుంది. స్థానం ఎప్పుడూ అందుబాటులో లేదా ఖచ్చితంగా ఉండకపోవచ్చు.',
      contact: 'సంప్రదించండి',
      siteInformation: 'సైట్ సమాచారం',
      contactText: 'సమస్యను తెలియజేయడానికి లేదా అభిప్రాయం పంపడానికి:',
      footerCredits: 'షేర్ షీట్ VengeanceUI స్ఫూర్తితో రూపొందించబడింది. QR: qrcode-generator (MIT).',
      installApp: 'యాప్ ఇన్‌స్టాల్',
      iosInstallHint: 'షేర్ నొక్కి, హోమ్ స్క్రీన్‌కు జోడించండి',
      dismiss: 'దాచండి',
      dismissInstallHint: 'ఇన్‌స్టాల్ సూచనను దాచండి',
      noLiveTracking: '⚪ లైవ్ ట్రాకింగ్ లేదు',
      liveNow: 'లైవ్‌లో ఉంది',
      liveStatusUnavailable: 'లైవ్ స్థితి అందుబాటులో లేదు',
      noBusesAvailable: 'ప్రస్తుతం బస్సులు అందుబాటులో లేవు.',
      routeLabel: 'రూట్: {route}',
      activeBusesRoute: '{number} రూట్‌లో లైవ్ బస్సులు',
      chooseSpecificBus: 'ట్రాక్ చేయడానికి ఒక బస్సును ఎంచుకోండి.',
      sessionLookupUnavailable: 'ప్రస్తుతం లైవ్ సెషన్ వివరాలు అందుబాటులో లేవు.',
      routeSessionLoadFailed: 'ఈ రూట్‌లోని లైవ్ బస్సుల వివరాలు లోడ్ కాలేదు.',
      distanceKmAway: '{distance} కి.మీ దూరంలో',
      updated: 'అప్‌డేట్: {time}',
      updatedJustNow: 'ఇప్పుడే అప్‌డేట్ అయింది',
      liveLocationUpdated: 'లైవ్ బస్సు స్థానం దొరికింది. అప్‌డేట్: {time}',
      liveUpdatedJustNow: 'లైవ్ బస్సు స్థానం ఇప్పుడే అప్‌డేట్ అయింది',
      nearbyActiveBuses: 'దగ్గరలోని లైవ్ బస్సులు',
      noNearbyBuses: 'దగ్గరలో బస్సులు కనిపించలేదు. బస్సు నంబర్‌తో వెతకండి లేదా తర్వాత మళ్లీ చూడండి.',
      noActiveBuses: 'ప్రస్తుతం లైవ్ బస్సులు లేవు.',
      nearbyTitle: 'దగ్గరలోని లైవ్ బస్సులు',
      busNotFound: 'బస్సు దొరకలేదు.',
      noStops: 'స్టాప్‌ల వివరాలు లేవు.',
      enterBusNumber: 'కొనసాగించడానికి బస్సు నంబర్ నమోదు చేయండి.',
      searchChoice: '“{query}”కు సరిపోయే బస్సును ఎంచుకోండి.',
      busesFound: '{count} బస్సులు దొరికాయి. వివరాల కోసం ఒకదాన్ని ఎంచుకోండి.',
      showBusDetails: '{number} బస్సు వివరాలు చూపిస్తోంది.',
      selectedBusDetails: '{number} బస్సు వివరాలు చూపిస్తోంది.',
      busNotFoundForDetails: 'షేర్ చేసిన బస్సు రూట్ దొరకలేదు.',
      liveLocationUnavailable: 'ప్రస్తుతం లైవ్ స్థానం చూడలేకపోతున్నాం.',
      noLiveLocation: 'ఈ బస్సుకు లైవ్ స్థానం అందుబాటులో లేదు.',
      liveLocationLoadFailed: 'ప్రస్తుతం లైవ్ స్థానం లోడ్ కాలేదు.',
      liveLocationUpdatedPrefix: 'లైవ్ బస్సు స్థానం దొరికింది. అప్‌డేట్: ',
      staleLocationWarning: '⚠️ ఈ బస్సు స్థానం ఇటీవల అప్‌డేట్ కాలేదు. ఇది ఖచ్చితంగా ఉండకపోవచ్చు. ప్రయాణికుడు యాప్ మూసి ఉండవచ్చు లేదా కనెక్షన్ కోల్పోయి ఉండవచ్చు.',
      sharingStopped: 'షేరింగ్ ఆగిపోయింది',
      locationSharingStopped: 'స్థాన షేరింగ్ ఆగిపోయింది.',
      unableToGetLocation: 'మీ స్థానం పొందలేకపోయాం.',
      locationPermissionDenied: 'స్థాన అనుమతి నిరాకరించబడింది.',
      locationUnavailable: 'స్థానం అందుబాటులో లేదు.',
      locationRequestTimedOut: 'స్థాన అభ్యర్థనకు సమయం ముగిసింది.',
      sharingActive: 'స్థాన షేరింగ్ కొనసాగుతోంది',
      requestingLocation: 'మీ స్థానం పొందుతోంది...',
      openAppSettings: 'యాప్ సెట్టింగ్స్ తెరవండి',
      busTypeRequired: 'షేర్ చేయడానికి ముందు బస్సు రకాన్ని ఎంచుకోండి.',
      chooseRidingTypeHint: 'మీరు ప్రయాణిస్తున్న బస్సు రకాన్ని ఎంచుకోండి.',
      thankYouShare: 'ఇతర ప్రయాణికులకు సహాయం చేసినందుకు ధన్యవాదాలు!',
      keepAppOpen: 'షేర్ చేస్తున్నప్పుడు ఈ యాప్‌ను ఇటీవల తెరిచిన యాప్‌లలో ఉంచండి. యాప్‌ను తొలగిస్తే షేరింగ్ ఆగుతుంది.',
      invalidDuration: '1 నుంచి {maximum} నిమిషాల మధ్య పూర్తి నిమిషాల సంఖ్య నమోదు చేయండి.',
      customDurationOption: '{minutes} నిమిషాలు (ఇతర సమయం)',
      selectBusFirst: 'ముందుగా ఒక బస్సును ఎంచుకోండి.',
      selectActiveSessionCapacity: 'రద్దీ తెలియజేయడానికి ముందుగా లైవ్ సెషన్ ఉన్న బస్సును ఎంచుకోండి.',
      selectedRoute: 'ఎంచుకున్న రూట్',
      shareConfirmationThanks: '🙌 ఇతర ప్రయాణికులకు సహాయం చేస్తున్నందుకు ధన్యవాదాలు! మీ లైవ్ స్థానంతో బస్సు {number}ను కనుగొనడం సులభమవుతుంది.',
      shareConfirmationAppreciation: 'మీ సహాయం, నమ్మకానికి కృతజ్ఞతలు. 💙',
      shareConfirmationType: 'బస్సు రకం: {type}',
      shareConfirmationSession: 'షేరింగ్ సెషన్: {code} - {route}',
      shareConfirmationAsk: 'షేరింగ్ ప్రారంభించాలా?',
      capacitySaving: 'రద్దీ వివరాలు సేవ్ అవుతున్నాయి...',
      capacityUpdated: 'రద్దీ వివరాలు అప్‌డేట్ అయ్యాయి.',
      capacityUpdateFailed: 'రద్దీ వివరాలను అప్‌డేట్ చేయలేకపోయాం. మళ్లీ ప్రయత్నించండి.',
      locationNotAvailable: 'ఈ బ్రౌజర్‌లో స్థానం అందుబాటులో లేదు.',
      locationUnsupported: 'ఈ బ్రౌజర్‌లో స్థాన షేరింగ్‌కు మద్దతు లేదు.',
      lookingNearby: 'దగ్గరలోని బస్సుల కోసం చూస్తోంది...',
      nearbyLoaded: 'దగ్గరలోని బస్సులు లోడ్ అయ్యాయి.',
      nearbyFailed: 'ప్రస్తుతం దగ్గరలోని బస్సులను కనుగొనలేకపోయాం.',
      viewerLocationFailed: 'దగ్గరలోని బస్సుల కోసం మీ స్థానం పొందలేకపోయాం.',
      addBusInstructions: 'బస్సు వివరాలు నింపి సమర్పించండి.',
      supabaseUnavailable: 'ప్రస్తుతం Supabase‌కు కనెక్ట్ కాలేకపోయాం.',
      requiredBusFields: 'బస్సు నంబర్, రూట్, ప్రారంభ స్థలం, గమ్యస్థానం తప్పనిసరి.',
      addingBus: 'బస్సు జోడిస్తోంది...',
      busAdded: '{number} బస్సు విజయవంతంగా జోడించబడింది.',
      couldNotAddBus: 'బస్సును జోడించలేకపోయాం. మళ్లీ ప్రయత్నించండి.',
      savedSessionTitle: 'షేరింగ్ కొనసాగించాలా?',
      savedSessionPrompt: 'మీరు బస్సు {number} స్థానాన్ని షేర్ చేస్తున్నారు. కొనసాగించాలా?',
      resumeSharing: 'షేరింగ్ కొనసాగించండి',
      remainingSessionTime: 'సెషన్‌లో మిగిలిన సమయం',
      sharingExpired: 'ఈ షేరింగ్ సెషన్ గడువు ముగిసింది.',
      couldNotReconnect: 'బస్సుతో మళ్లీ కనెక్ట్ కాలేదు. మళ్లీ ప్రయత్నించండి.',
      couldNotResume: 'షేరింగ్ కొనసాగించలేకపోయాం. మళ్లీ ప్రయత్నించండి.',
      linkCopied: 'లింక్ కాపీ అయింది!',
      copyFailed: 'లింక్ కాపీ కాలేదు. అడ్రస్ బార్ నుంచి కాపీ చేయండి.',
      qrUnavailable: 'ప్రస్తుతం QR షేరింగ్ అందుబాటులో లేదు.',
      sharingUnavailable: 'ప్రస్తుతం షేర్ చేయలేకపోతున్నాం.',
      invalidShareLink: 'ఈ బస్సు లింక్ అందుబాటులో లేదు.',
      couldNotLoadSharedLink: 'షేర్ చేసిన బస్సు లింక్ లోడ్ కాలేదు.',
      sharedSessionNotFound: 'షేర్ చేసిన బస్సు సెషన్ దొరకలేదు.',
      sharedSessionShown: 'షేర్ చేసిన బస్సు సెషన్ {code} చూపిస్తోంది.',
      connectionProblem: 'ప్రస్తుతం ఆ బస్సు వివరాలు లోడ్ కాలేదు.',
      notAvailable: 'అందుబాటులో లేదు',
      justNow: 'ఇప్పుడే',
      secondsAgo: '{count} సెకన్ల క్రితం',
      secondAgo: '{count} సెకను క్రితం',
      minutesAgo: '{count} నిమిషాల క్రితం',
      minuteAgo: '{count} నిమిషం క్రితం',
      hoursAgo: '{count} గంటల క్రితం',
      hourAgo: '{count} గంట క్రితం',
      daysAgo: '{count} రోజుల క్రితం',
      dayAgo: '{count} రోజు క్రితం',
      myLocation: 'నా స్థానం',
      liveBusLocation: '🚌 లైవ్ బస్సు స్థానం',
      shareSaveFailed: 'స్థాన షేరింగ్ కొనసాగుతోంది, కానీ తాజా స్థానాన్ని సేవ్ చేయలేకపోయాం.',
      nativeTrackingError: 'బ్యాక్‌గ్రౌండ్ స్థాన ట్రాకింగ్‌లో సమస్య వచ్చింది.',
      nativeLocationPermission: 'స్క్రీన్ లాక్‌లో ఉన్నప్పటికీ షేర్ కావాలంటే యాప్ సెట్టింగ్స్‌లో “ఎల్లప్పుడూ” స్థాన అనుమతి ఇవ్వండి.',
      catalogCardAria: 'బస్సు {number}ను వెతకండి. {status}.',
      recentBusAria: 'బస్సు {number}ను వెతకండి.',
      active: 'సేవలో ఉంది',
      inactive: 'సేవలో లేదు',
      changeLanguage: 'భాష మార్చండి: తెలుగు',
      privacyLink: 'గోప్యత మరియు వివరాలు',
      privacyTitle: 'గోప్యత మరియు విధానం | APSRTC Live',
      privacyHeading: 'గోప్యత మరియు విధానం',
      privacyIntro: 'APSRTC Live ప్రయాణికులు అందించే సమాచారంతో పనిచేసే ఉచిత బస్సు ట్రాకర్. ఇది APSRTC అధికారిక సమాచారం కాదు.',
      privacyHowTitle: 'ఇది ఎలా పనిచేస్తుంది',
      privacyHowText: 'బస్సులో ప్రయాణిస్తున్న వ్యక్తి తన బస్సు స్థానాన్ని పంచుకోవచ్చు. ఇతరులు ఆ స్థానాన్ని మ్యాప్‌లో చూడగలరు.',
      privacyCollectedTitle: 'షేరింగ్ సమయంలో ఉపయోగించే సమాచారం',
      privacyCollectedText: 'ఎవరైనా షేర్ చేసినప్పుడు మాత్రమే బస్సు నంబర్, సెషన్ కోడ్, బస్సు రకం, అక్షాంశం, రేఖాంశం, చివరి స్థానం అప్‌డేట్ సమయం ఉపయోగిస్తాం. రద్దీని ఖాళీ, సగం నిండింది లేదా నిండింది అని కూడా తెలియజేయవచ్చు.',
      privacySessionText: 'ప్రయాణికుడు షేరింగ్ ప్రారంభించిన తర్వాతే స్థానం పంచబడుతుంది; షేరింగ్ ఉన్నంతసేపే కొనసాగుతుంది. ప్రతి అప్‌డేట్‌తో సెషన్‌లోని తాజా స్థానం మారుతుంది. ముగిసిన సెషన్ చివరి స్థానం పాత రికార్డులు తొలగించే వరకు ఉండవచ్చు.',
      privacyNotCollectedTitle: 'మేము సేకరించనివి',
      privacyNotCollectedText: 'మీ పేరు, ఈమెయిల్, ఫోన్ నంబర్ లేదా ఖాతా వివరాలు సేకరించము. ప్రకటనలు లేవు.',
      privacyStorageTitle: 'నిల్వ మరియు వినియోగం',
      privacyStorageText: 'షేర్ చేసిన సమాచారం Supabase‌లో నిల్వ అవుతుంది. ప్రకటనల కోసం దాన్ని అమ్మము లేదా పంచుకోము.',
      privacyDeviceText: 'మీ పరికరంలో థీమ్, భాష, ఇటీవల వెతికినవి, చివరిగా ఎంచుకున్న బస్సు రకం, ప్రస్తుతం ఉన్న షేరింగ్ సెషన్ localStorage‌లో నిల్వ అవుతాయి.',
      privacyAccuracyTitle: 'ఖచ్చితత్వం మరియు జాగ్రత్త',
      privacyAccuracyText: 'స్థానం ఖచ్చితంగా ఉంటుందని హామీ లేదు. అత్యవసర ప్రయాణం లేదా భద్రత కోసం APSRTC Live‌పై ఆధారపడవద్దు.',
      privacyTeluguSummaryTitle: 'సంక్షిప్తంగా',
      privacyTeluguSummaryText: 'APSRTC Live ప్రయాణికులు పంచుకునే సమాచారంతో పనిచేసే ఉచిత బస్సు ట్రాకర్. ప్రయాణికుడు షేరింగ్ ప్రారంభించినప్పుడే బస్సు వివరాలు, స్థానం నిల్వ అవుతాయి. పేరు, ఫోన్, ఈమెయిల్ లేదా ఖాతా వివరాలు సేకరించము. స్థానం ఖచ్చితంగా ఉంటుందని హామీ లేదు; అత్యవసర ప్రయాణానికి దీనిపై ఆధారపడవద్దు.',
      privacyContactTitle: 'సంప్రదించండి',
      privacyContactText: 'ప్రశ్నలు లేదా అభిప్రాయాలు?',
      privacyLastUpdated: 'చివరిగా నవీకరించిన తేదీ:',
      privacyBack: 'APSRTC Live‌కు తిరిగి వెళ్లండి',
      busPageTitle: 'బస్సు {number} - APSRTC Live',
      issueSubject: 'APSRTC Live సమస్య',
      issueWithBus: 'బస్సు {number} సమస్య',
      siteDescription: 'APSRTC Live విశాఖపట్నంలో ప్రయాణికులు అందించే లైవ్ బస్సు స్థానాలతో పనిచేసే ఉచిత బస్సు ట్రాకర్.',
      gpsStatusWaiting: 'వేచి ఉంది',
      gpsStopped: 'ఆగింది',
      gpsCallbackReceived: 'స్థాన అప్‌డేట్ అందింది',
      gpsWatcherStarted: 'GPS పరిశీలన ప్రారంభమైంది',
      gpsLocationError: 'స్థానంలో లోపం',
      unknownStatus: 'తెలియదు',
      none: 'ఏదీ లేదు',
      waiting: 'వేచి ఉంది',
      waitingForCallback: 'అప్‌డేట్ కోసం వేచి ఉంది',
      debugTimestamp: '{value}',
      gpsWatcherLabel: 'GPS పరిశీలన: {status}',
      lastCallbackLabel: 'చివరి అప్‌డేట్: {time}',
      latestCoordinates: 'తాజా అక్షాంశం/రేఖాంశం: {latitude}, {longitude}',
      errorLabel: 'లోపం: {error}',
      gpsWaitingMessage: 'GPS వివరాలు: ప్రారంభం కోసం వేచి ఉంది.',
      nativeSourceRegisterPlugin: 'స్థాన షేరింగ్: registerPlugin ఉపయోగిస్తోంది',
      nativeSourceCapacitorPlugins: 'స్థాన షేరింగ్: Capacitor.Plugins ఉపయోగిస్తోంది',
      nativePluginMissing: 'స్థాన షేరింగ్ ప్లగిన్ లేదు; బ్రౌజర్ GPS ఉపయోగిస్తోంది',
    }
  };

  let currentLanguage = 'en';
  const storageKey = 'apsrtc-language';

  function interpolate(value, replacements) {
    return String(value).replace(/\{(\w+)\}/g, (match, name) => (
      Object.prototype.hasOwnProperty.call(replacements || {}, name)
        ? String(replacements[name])
        : match
    ));
  }

  function t(key, replacements = {}) {
    const translation = dictionary[currentLanguage]?.[key] ??
      dictionary.en[key] ??
      key;
    return interpolate(translation, replacements);
  }

  function applyLanguage(language) {
    currentLanguage = language === 'te' ? 'te' : 'en';
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (key && Object.prototype.hasOwnProperty.call(dictionary[currentLanguage], key)) {
        let replacements = {};
        if (element.dataset.i18nValues) {
          try {
            replacements = JSON.parse(element.dataset.i18nValues);
          } catch (error) {
            console.warn('Could not read translated text values.', error);
          }
        }
        element.textContent = t(key, replacements);
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      const key = element.dataset.i18nPlaceholder;
      if (key && Object.prototype.hasOwnProperty.call(dictionary[currentLanguage], key)) {
        element.placeholder = t(key);
      }
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      const key = element.dataset.i18nAriaLabel;
      if (key && Object.prototype.hasOwnProperty.call(dictionary[currentLanguage], key)) {
        element.setAttribute('aria-label', t(key));
      }
    });
    document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
      const key = element.dataset.i18nAlt;
      if (key && Object.prototype.hasOwnProperty.call(dictionary[currentLanguage], key)) {
        element.alt = t(key);
      }
    });
    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      const key = element.dataset.i18nTitle;
      if (key && Object.prototype.hasOwnProperty.call(dictionary[currentLanguage], key)) {
        element.textContent = t(key);
      }
    });
    document.querySelectorAll('[data-i18n-content]').forEach((element) => {
      const key = element.dataset.i18nContent;
      if (key && Object.prototype.hasOwnProperty.call(dictionary[currentLanguage], key)) {
        element.setAttribute('content', t(key));
      }
    });
    document.querySelectorAll('[data-i18n-date]').forEach((element) => {
      const date = new Date(`${element.dataset.i18nDate}T12:00:00`);
      if (!Number.isNaN(date.getTime())) {
        element.textContent = date.toLocaleDateString(
          currentLanguage === 'te' ? 'te-IN' : 'en-US',
          { day: 'numeric', month: 'long', year: 'numeric' }
        );
      }
    });
    translateNativeTrackingMessages();

    const toggle = document.getElementById('languageToggle');
    if (toggle) {
      toggle.textContent = currentLanguage === 'te' ? 'తెలుగు | EN' : 'EN | తెలుగు';
      toggle.setAttribute(
        'aria-label',
        t('changeLanguage')
      );
      toggle.setAttribute('aria-pressed', String(currentLanguage === 'te'));
    }
  }

  function translateNativeTrackingMessages() {
    document.querySelectorAll('[role="status"]').forEach((element) => {
      const rawText = element.textContent.trim();
      const key = element.dataset.nativeTrackingMessageKey ||
        (rawText.startsWith('Native tracking: using registerPlugin')
          ? 'nativeSourceRegisterPlugin'
          : rawText.startsWith('Native tracking: using Capacitor.Plugins')
            ? 'nativeSourceCapacitorPlugins'
            : rawText.startsWith('Native tracking: plugin not found')
              ? 'nativePluginMissing'
              : rawText.startsWith('Native tracking error:')
                ? 'nativeTrackingError'
                : null);
      if (key) {
        element.dataset.nativeTrackingMessageKey = key;
        const translatedText = t(key);
        if (element.textContent !== translatedText) {
          element.textContent = translatedText;
        }
      }
    });
  }

  function initializeLanguage() {
    let language;
    try {
      language = localStorage.getItem(storageKey);
    } catch (error) {
      console.warn('Language preference could not be read.', error);
    }
    if (language !== 'en' && language !== 'te') {
      language = navigator.language?.toLowerCase().startsWith('te') ? 'te' : 'en';
    }

    applyLanguage(language);
    const toggle = document.getElementById('languageToggle');
    toggle?.addEventListener('click', () => {
      const nextLanguage = currentLanguage === 'te' ? 'en' : 'te';
      applyLanguage(nextLanguage);
      try {
        localStorage.setItem(storageKey, nextLanguage);
      } catch (error) {
        console.warn('Language preference could not be saved.', error);
      }
      window.dispatchEvent(new CustomEvent('languagechange', {
        detail: { language: nextLanguage }
      }));
    });
    if (document.body && typeof MutationObserver === 'function') {
      const observer = new MutationObserver(translateNativeTrackingMessages);
      observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  window.t = t;
  window.applyLanguage = applyLanguage;
  window.getLanguage = () => currentLanguage;

  initializeLanguage();
})();
