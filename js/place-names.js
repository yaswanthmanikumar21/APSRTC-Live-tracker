(() => {
  const placeNames = new Map();
  const addNames = (teluguName, englishNames) => {
    englishNames.forEach((name) => {
      placeNames.set(name.toLocaleLowerCase(), teluguName);
    });
  };

  addNames('అచ్యుతాపురం', ['Achutapuram']);
  addNames('ఆదర్శ నగర్', ['Adarsha Nagar']);
  addNames('అడవివరం', ['Adavivaram']);
  addNames('అడ్డరోడ్', ['Addaroad']);
  addNames('అగనంపూడి', ['Aganampudi']);
  addNames('అక్కయ్యపాలెం', ['Akkayapalem', 'Akkayyapalem']);
  addNames('అనకాపల్లి', ['Anakapalle', 'Anakapalli']);
  addNames('ఆనందపురం', ['Anandapuram']);
  addNames('ఆనందపురం బైపాస్', ['Anandapuram Bypass']);
  addNames('అరిలోవ', ['Arilova']);
  addNames('అరిలోవ కాలనీ', ['Arilova Colony']);
  addNames('అసిల్మెట్ట', ['Asilmetta']);
  addNames('ఏయూ అవుట్ గేట్', ['AU Out gate', 'AU Outgate']);
  addNames('అయినాడ', ['Ayinada']);
  addNames('బక్కన్నపాలెం', ['Bakkannapalem']);
  addNames('భానోజీతోట', ['Bhanojithota']);
  addNames('భీమిలి ఎక్స్ రోడ్', ['Bheemili X Road']);
  addNames('భీమిలి', ['Bhimili']);
  addNames('బీహెచ్‌పీవీ', ['BHPV']);
  addNames('బొరవానిపాలెం', ['Boravanipalem']);
  addNames('బోయపాలెం', ['Boyapalem']);
  addNames('కార్ షెడ్ జంక్షన్', ['Car Shed Junction', 'Carshed']);
  addNames('చింతగట్ల', ['Chintagatla']);
  addNames('చింతల అగ్రహారం', ['Chintalagraharam']);
  addNames('చోడవరం', ['Chodavaram']);
  addNames('కలెక్టర్ ఆఫీస్', ['Collector office', 'Collector Office']);
  addNames('కన్వెంట్', ['Convent', 'Convent Jn', 'Convent junction']);
  addNames('దబ్బంద', ['Dabbanda']);
  addNames('దెండేరు', ['Denderu']);
  addNames('దేవరాపల్లి', ['Devarapalle']);
  addNames('దిబ్బపాలెం', ['Dibbapalem']);
  addNames('దోసూరు', ['Dosuru']);
  addNames('దువ్వాడ రైల్వే స్టేషన్', ['Duvvada Railway Station']);
  addNames('ద్వారక ఆర్టీసీ కాంప్లెక్స్', ['Dwaraka RTC Complex']);
  addNames('ఎలమంచిలి', ['Elamanchili', 'Yelamanchili']);
  addNames('ఎండాడ', ['Endada', 'Yendada']);
  addNames('ఫిషింగ్ హార్బర్', ['Fishing Harbour']);
  addNames('గాజువాక', ['Gajuwaka']);
  addNames('గణేష్ నగర్', ['Ganesh Nagar']);
  addNames('గంగవరం', ['Gangavaram']);
  addNames('గంట్యాడ హెచ్‌బీ కాలనీ', ['Gantyada HB Colony']);
  addNames('గీతం', ['Gitam']);
  addNames('గోపాలపట్నం', ['Gopalapatnam', 'Gopalpatnam']);
  addNames('జీపీటీ', ['GPT']);
  addNames('గురజాడనగర్', ['Gurajadanagar']);
  addNames('గురుద్వార్', ['Gurudwar', 'Gurudwara']);
  addNames('హనుమంతువాక', ['Hanumanthuwaka']);
  addNames('హెచ్‌బీ కాలనీ', ['HB Colony']);
  addNames('ఐఎన్‌ఎస్ కళింగ', ['INS Kalinga']);
  addNames('ఐటీ పార్క్', ['IT Park']);
  addNames('జగదాంబ', ['Jagadamba']);
  addNames('జనతా కాలనీ', ['Janata Colony']);
  addNames('జొన్నాడ', ['Jonnada']);
  addNames('కె.కోటపాడు', ['K.Kotapad']);
  addNames('కైలాసపురం', ['Kailasapuram']);
  addNames('కైలాసగిరి', ['Kailashagiri']);
  addNames('కంచరపాలెం', ['Kancharapalem']);
  addNames('కాపులతుంగ్లం', ['Kapulatunglam']);
  addNames('కొల్లివానిపాలెం', ['Kollivanipalem']);
  addNames('కొమ్మాది', ['Kommadi']);
  addNames('కొత్త రోడ్', ['Kotha road']);
  addNames('కోటవలస', ['Kothavalasa', 'Kottavalasa']);
  addNames('కూర్మన్నపాలెం', ['Kurmanapalem', 'Kurmannapalem', 'Kurmannaplem']);
  addNames('మద్దిలపాలెం', ['Maddilapalem']);
  addNames('మాధవధార', ['Madhavadhara']);
  addNames('మధురవాడ', ['Madhurawada', 'Madhurwada', 'Madurwada']);
  addNames('మాడుగుల', ['Madugula']);
  addNames('మల్కాపురం', ['Malkapuram']);
  addNames('మంగమారిపేట', ['Mangamaripeta']);
  addNames('మరిచెట్లపాలెం', ['Marikavalasa']);
  addNames('మిధిలాపురి కాలనీ', ['Midhilapuri Colony']);
  addNames('మింది', ['Mindi']);
  addNames('ఎంఎన్ క్లబ్', ['MN Club']);
  addNames('మురళీనగర్', ['Muralinagar']);
  addNames('ఎంవీపీ కాలనీ', ['MVP colony', 'MVP Colony']);
  addNames('ఎంవీపీ కాంప్లెక్స్', ['MVP Complex']);
  addNames('ఎన్‌ఏడీ', ['NAD']);
  addNames('ఎన్‌ఏడీ జంక్షన్', ['NAD Junction']);
  addNames('నడుపూరు డైరీ కాలనీ', ['Nadupur Dairy Colony']);
  addNames('నడుపూరు', ['Nadupuru']);
  addNames('నగరపాలెం', ['Nagarapalem']);
  addNames('నరవ', ['Narava']);
  addNames('నేవల్ బేస్', ['Naval base']);
  addNames('నేవల్ డాక్‌యార్డ్', ['Naval Dockyard']);
  addNames('న్యూ గాజువాక', ['New Gajuwaka']);
  addNames('ఎన్‌టీపీసీ', ['NTPC']);
  addNames('ఓహెచ్‌పీఓ', ['OHPO']);
  addNames('ఓల్డ్ గాజువాక', ['Old Gajuwaka']);
  addNames('పద్మనాభం', ['Padmanabham']);
  addNames('పరదేశిపాలెం', ['Paradesipalem']);
  addNames('పరవాడ', ['Parawada']);
  addNames('పెదగంట్యాడ', ['Pedagantyada']);
  addNames('పెద్దిపాలెం', ['Peddipalem']);
  addNames('పెందుర్తి', ['Pendurthi', 'Pendurthy']);
  addNames('పీఎం పాలెం', ['PM Palem']);
  addNames('పూర్ణా మార్కెట్', ['Purna Market']);
  addNames('ఆర్‌కే బీచ్', ['R K Beach', 'Rk beach', 'RK beach', 'RK Beach']);
  addNames('రైల్వే స్టేషన్', ['Railway Station']);
  addNames('రాంబిల్లి', ['Rambilli']);
  addNames('రత్నగిరి హెచ్‌బీ కాలనీ', ['Ratnagiri HB Colony']);
  addNames('రవళమ్మపాలెం', ['Ravalammapalem']);
  addNames('రవీంద్ర నగర్', ['Ravindra Nagar']);
  addNames('ఆర్టీసీ కాంప్లెక్స్', ['RTC', 'RTC complex', 'RTC Complex']);
  addNames('రుషికొండ', ['Rushikonda']);
  addNames('సబ్బవరం', ['Sabbavaram']);
  addNames('సాగర్ నగర్', ['Sagar nagar', 'Sagar Nagar']);
  addNames('సత్యం జంక్షన్', ['Satyam Junction']);
  addNames('స్కిందియా', ['Scidia', 'Scindia']);
  addNames('సెక్టార్ 11', ['Sector 11']);
  addNames('సేవానగర్', ['Sevanagar']);
  addNames('షీలానగర్', ['Sheelanagar']);
  addNames('సిరిపురం', ['Siripuram']);
  addNames('శొంట్యం', ['Shontyam', 'Sontyam']);
  addNames('సింహాచలం', ['Simhachalam']);
  addNames('సింహాచలం బస్ స్టేషన్', ['Simhachalam Bus Station']);
  addNames('సింహాచలం కొండలు', ['Simhachalam hills']);
  addNames('సీతమ్మధార', ['Sitammadhara']);
  addNames('స్టీల్‌ప్లాంట్ సెక్టార్ 11', ['Steelplant Sector 11']);
  addNames('స్టీల్‌ప్లాంట్ సెక్టార్ 5', ['Steelplant Sector 5']);
  addNames('సుజాతనగర్', ['Sujatanagar']);
  addNames('సుందరయ్య కాలనీ', ['Sundarayya Colony']);
  addNames('స్వయంభువరం', ['Swayambuvaram']);
  addNames('తగరపువలస', ['Tagarapuvalasa']);
  addNames('తగరపువలస బైపాస్', ['Tagarapuvalasa Bypass']);
  addNames('తగరపువలస టౌన్', ['Tagarapuvalasa Town']);
  addNames('తల్లవలస', ['Tallavalasa']);
  addNames('తెన్నేటి పార్క్', ['Tenneti park']);
  addNames('తాడి', ['Thadi']);
  addNames('తానం', ['Thanam']);
  addNames('టౌన్ కొత్త రోడ్', ['Town Kotha Road', 'Town Kotharoad']);
  addNames('వడచీపురుపల్లి', ['Vadacheepurupalli']);
  addNames('వాంబే కాలనీ', ['Vambey Colony']);
  addNames('వెంకోజీపాలెం', ['Venkojipalem']);
  addNames('వేపాడ', ['Vepada']);
  addNames('వేపగుంట', ['Vepagunta']);
  addNames('విశాఖపట్నం విమానాశ్రయం', ['Visakhapatnam Airport']);
  addNames('విశాలాక్షి నగర్', ['Visalakshi Nagar']);
  addNames('విజయనగరం', ['Vizianagaram']);
  addNames('విజయనగరం ఆర్టీసీ బస్ స్టేషన్', ['Vizianagaram RTC Bus Station']);
  addNames('విజయనగరం ఆర్టీసీ కాంప్లెక్స్', ['Vizianagaram RTC Complex']);
  addNames('వుడా పార్క్', ['Vuda park', 'Vuda Park']);
  addNames('వాల్తేరు', ['Waltair']);
  addNames('వై జంక్షన్', ['Y Junction']);
  addNames('యారాడ', ['Yarada']);
  addNames('యెండాడ', ['Yendada Village']);
  addNames('జిల్లా పరిషత్', ['Zilla Parishad']);
  addNames('జూ పార్క్', ['Zoo Park']);

  const bracketNotes = new Map([
    [
      'longest route from mdp to rs',
      'ఎండీపీ నుంచి ఆర్‌ఎస్ వరకు ఉన్న పొడవైన రూట్'
    ]
  ]);

  function translatePlace(name) {
    const original = String(name ?? '');
    if (window.getLanguage?.() !== 'te') {
      return original;
    }

    const trimmed = original.trim();
    if (!trimmed) {
      return original;
    }

    const slashParts = trimmed.split('/');
    if (slashParts.length > 1) {
      return slashParts.map(translatePlace).join('/');
    }

    const noteMatch = trimmed.match(/^(.*?)\s*\(([^()]*)\)$/);
    if (noteMatch) {
      const place = translatePlace(noteMatch[1]);
      const note = bracketNotes.get(noteMatch[2].trim().toLocaleLowerCase()) ||
        noteMatch[2].trim();
      return `${place} (${note})`;
    }

    return placeNames.get(trimmed.toLocaleLowerCase()) || original;
  }

  function translateRoute(routeString) {
    return String(routeString ?? '')
      .split(' - ')
      .map(translatePlace)
      .join(' - ');
  }

  function translateStops(stopsString) {
    return String(stopsString ?? '')
      .split(',')
      .map((stop) => translatePlace(stop.trim()))
      .join(', ');
  }

  window.translatePlace = translatePlace;
  window.translateRoute = translateRoute;
  window.translateStops = translateStops;
})();
