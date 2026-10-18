(() => {
  const places = Object.create(null);

  function addPlace(teluguName, aliases) {
    aliases.forEach((name) => {
      places[name.toLowerCase()] = teluguName;
    });
  }

  addPlace('అచ్యుతాపురం', ['Achutapuram']);
  addPlace('ఆదర్శ నగర్', ['Adarsha Nagar']);
  addPlace('అడవివరం', ['Adavivaram']);
  addPlace('అడ్డరోడ్', ['Addaroad']);
  addPlace('అగనంపూడి', ['Aganampudi']);
  addPlace('అక్కయ్యపాలెం', ['Akkayapalem', 'Akkayyapalem']);
  addPlace('అనకాపల్లి', ['Anakapalle', 'Anakapalli']);
  addPlace('ఆనందపురం', ['Anandapuram']);
  addPlace('ఆనందపురం బైపాస్', ['Anandapuram Bypass']);
  addPlace('అరిలోవ', ['Arilova']);
  addPlace('అరిలోవ కాలనీ', ['Arilova Colony']);
  addPlace('అసిల్మెట్ట', ['Asilmetta']);
  addPlace('ఏయూ అవుట్ గేట్', ['AU Out gate', 'AU Outgate']);
  addPlace('అయినాడ', ['Ayinada']);
  addPlace('బక్కన్నపాలెం', ['Bakkannapalem']);
  addPlace('భానోజీతోట', ['Bhanojithota']);
  addPlace('భీమిలి ఎక్స్ రోడ్', ['Bheemili X Road']);
  addPlace('భీమిలి', ['Bhimili']);
  addPlace('బీహెచ్‌పీవీ', ['BHPV']);
  addPlace('బోరవానిపాలెం', ['Boravanipalem']);
  addPlace('బోయపాలెం', ['Boyapalem']);
  addPlace('కార్ షెడ్ జంక్షన్', ['Car Shed Junction', 'Carshed']);
  addPlace('చింతగట్ల', ['Chintagatla']);
  addPlace('చింతలగ్రహారం', ['Chintalagraharam']);
  addPlace('చోడవరం', ['Chodavaram']);
  addPlace('కలెక్టర్ కార్యాలయం', ['Collector office', 'Collector Office']);
  addPlace('కన్వెంట్', ['Convent', 'Convent Jn', 'Convent junction']);
  addPlace('దబ్బండ', ['Dabbanda']);
  addPlace('దెండేరు', ['Denderu']);
  addPlace('దేవరపల్లి', ['Devarapalle']);
  addPlace('దిబ్బపాలెం', ['Dibbapalem']);
  addPlace('దోసూరు', ['Dosuru']);
  addPlace('దువ్వాడ రైల్వే స్టేషన్', ['Duvvada Railway Station']);
  addPlace('ద్వారక ఆర్టీసీ కాంప్లెక్స్', ['Dwaraka RTC Complex']);
  addPlace('ఎలమంచిలి', ['Elamanchili', 'Yelamanchili']);
  addPlace('ఎండాడ', ['Endada', 'Yendada']);
  addPlace('ఫిషింగ్ హార్బర్', ['Fishing Harbour']);
  addPlace('గాజువాక', ['Gajuwaka']);
  addPlace('గణేష్ నగర్', ['Ganesh Nagar']);
  addPlace('గంగవరం', ['Gangavaram']);
  addPlace('గంట్యాడ హెచ్‌బీ కాలనీ', ['Gantyada HB Colony']);
  addPlace('గీతం', ['Gitam']);
  addPlace('గోపాలపట్నం', ['Gopalapatnam', 'Gopalpatnam']);
  addPlace('జీపీటీ', ['GPT']);
  addPlace('గురజాడనగర్', ['Gurajadanagar']);
  addPlace('గురుద్వారా', ['Gurudwar', 'Gurudwara']);
  addPlace('హనుమంతువాక', ['Hanumanthuwaka']);
  addPlace('హెచ్‌బీ కాలనీ', ['HB Colony']);
  addPlace('ఐఎన్‌ఎస్ కళింగ', ['INS Kalinga']);
  addPlace('ఐటీ పార్క్', ['IT Park']);
  addPlace('జగదాంబ', ['Jagadamba']);
  addPlace('జనతా కాలనీ', ['Janata Colony']);
  addPlace('జొన్నాడ', ['Jonnada']);
  addPlace('కె. కోటపాడు', ['K.Kotapad']);
  addPlace('కైలాసపురం', ['Kailasapuram']);
  addPlace('కైలాసగిరి', ['Kailashagiri']);
  addPlace('కంచరపాలెం', ['Kancharapalem']);
  addPlace('కాపులతుంగ్లం', ['Kapulatunglam']);
  addPlace('కొల్లివానిపాలెం', ['Kollivanipalem']);
  addPlace('కొమ్మాది', ['Kommadi']);
  addPlace('కొత్త రోడ్', ['Kotha road']);
  addPlace('కొత్తవలస', ['Kothavalasa', 'Kottavalasa']);
  addPlace('కూర్మన్నపాలెం', ['Kurmanapalem', 'Kurmannapalem', 'Kurmannaplem']);
  addPlace('మద్దిలపాలెం', ['Maddilapalem']);
  addPlace('మాధవధార', ['Madhavadhara']);
  addPlace('మధురవాడ', ['Madhurawada', 'Madhurwada', 'Madurwada']);
  addPlace('మాడుగుల', ['Madugula']);
  addPlace('మల్కాపురం', ['Malkapuram']);
  addPlace('మంగమారిపేట', ['Mangamaripeta']);
  addPlace('మరికవలస', ['Marikavalasa']);
  addPlace('మిధిలాపురి కాలనీ', ['Midhilapuri Colony']);
  addPlace('మింది', ['Mindi']);
  addPlace('ఎంఎన్ క్లబ్', ['MN Club']);
  addPlace('మురళీనగర్', ['Muralinagar']);
  addPlace('ఎంవీపీ కాలనీ', ['MVP colony', 'MVP Colony']);
  addPlace('ఎంవీపీ కాంప్లెక్స్', ['MVP Complex']);
  addPlace('ఎన్‌ఏడీ', ['NAD']);
  addPlace('ఎన్‌ఏడీ జంక్షన్', ['NAD Junction']);
  addPlace('నడుపూరు డెయిరీ కాలనీ', ['Nadupur Dairy Colony']);
  addPlace('నడుపూరు', ['Nadupuru']);
  addPlace('నగరపాలెం', ['Nagarapalem']);
  addPlace('నరవ', ['Narava']);
  addPlace('నేవల్ బేస్', ['Naval base']);
  addPlace('నేవల్ డాక్‌యార్డ్', ['Naval Dockyard']);
  addPlace('న్యూ గాజువాక', ['New Gajuwaka']);
  addPlace('ఎన్‌టీపీసీ', ['NTPC']);
  addPlace('ఓహెచ్‌పీఓ', ['OHPO']);
  addPlace('ఓల్డ్ గాజువాక', ['Old Gajuwaka']);
  addPlace('పద్మనాభం', ['Padmanabham']);
  addPlace('పరదేశిపాలెం', ['Paradesipalem']);
  addPlace('పరవాడ', ['Parawada']);
  addPlace('పెదగంట్యాడ', ['Pedagantyada']);
  addPlace('పెద్దిపాలెం', ['Peddipalem']);
  addPlace('పెందుర్తి', ['Pendurthi', 'Pendurthy']);
  addPlace('పీఎం పాలెం', ['PM Palem']);
  addPlace('పూర్ణా మార్కెట్', ['Purna Market']);
  addPlace('ఆర్‌కే బీచ్', ['R K Beach', 'Rk beach', 'RK beach', 'RK Beach']);
  addPlace('రైల్వే స్టేషన్', ['Railway Station']);
  addPlace('రాంబిల్లి', ['Rambilli']);
  addPlace('రత్నగిరి హెచ్‌బీ కాలనీ', ['Ratnagiri HB Colony']);
  addPlace('రవళమ్మపాలెం', ['Ravalammapalem']);
  addPlace('రవీంద్ర నగర్', ['Ravindra Nagar']);
  addPlace('ఆర్టీసీ', ['RTC']);
  addPlace('ఆర్టీసీ కాంప్లెక్స్', ['RTC complex', 'RTC Complex']);
  addPlace('రుషికొండ', ['Rushikonda']);
  addPlace('సబ్బవరం', ['Sabbavaram']);
  addPlace('సాగర్ నగర్', ['Sagar nagar', 'Sagar Nagar']);
  addPlace('సత్యం జంక్షన్', ['Satyam Junction']);
  addPlace('సింధియా', ['Scidia', 'Scindia']);
  addPlace('సెక్టార్ 11', ['Sector 11']);
  addPlace('సేవానగర్', ['Sevanagar']);
  addPlace('షీలానగర్', ['Sheelanagar']);
  addPlace('సొంట్యం', ['Shontyam', 'Sontyam']);
  addPlace('సింహాచలం', ['Simhachalam']);
  addPlace('సింహాచలం బస్ స్టేషన్', ['Simhachalam Bus Station']);
  addPlace('సింహాచలం కొండలు', ['Simhachalam hills']);
  addPlace('సీతమ్మధార', ['Sitammadhara']);
  addPlace('స్టీల్‌ప్లాంట్ సెక్టార్ 11', ['Steelplant Sector 11']);
  addPlace('స్టీల్‌ప్లాంట్ సెక్టార్ 5', ['Steelplant Sector 5']);
  addPlace('సుజాతనగర్', ['Sujatanagar']);
  addPlace('సుందరయ్య కాలనీ', ['Sundarayya Colony']);
  addPlace('స్వయంభువారం', ['Swayambuvaram']);
  addPlace('తగరపువలస', ['Tagarapuvalasa']);
  addPlace('తగరపువలస బైపాస్', ['Tagarapuvalasa Bypass']);
  addPlace('తగరపువలస టౌన్', ['Tagarapuvalasa Town']);
  addPlace('తల్లవలస', ['Tallavalasa']);
  addPlace('తెనేటి పార్క్', ['Tenneti park']);
  addPlace('తాడి', ['Thadi']);
  addPlace('తానం', ['Thanam']);
  addPlace('టౌన్ కొత్త రోడ్', ['Town Kotha Road', 'Town Kotharoad']);
  addPlace('వడచీపురుపల్లి', ['Vadacheepurupalli']);
  addPlace('వాంబే కాలనీ', ['Vambey Colony']);
  addPlace('వెంకోజీపాలెం', ['Venkojipalem']);
  addPlace('వేపాడ', ['Vepada']);
  addPlace('వేపగుంట', ['Vepagunta']);
  addPlace('విశాఖపట్నం విమానాశ్రయం', ['Visakhapatnam Airport']);
  addPlace('విశాలాక్షి నగర్', ['Visalakshi Nagar']);
  addPlace('విజయనగరం', ['Vizianagaram']);
  addPlace('విజయనగరం ఆర్టీసీ బస్ స్టేషన్', ['Vizianagaram RTC Bus Station']);
  addPlace('విజయనగరం ఆర్టీసీ కాంప్లెక్స్', ['Vizianagaram RTC Complex']);
  addPlace('వుడా పార్క్', ['Vuda park', 'Vuda Park']);
  addPlace('వాల్తేరు', ['Waltair']);
  addPlace('వై జంక్షన్', ['Y Junction']);
  addPlace('యారాడ', ['Yarada']);
  addPlace('యెండాడ', ['Yendada', 'Yendada Village']);
  addPlace('జిల్లా పరిషత్', ['Zilla Parishad']);
  addPlace('జూ పార్క్', ['Zoo Park']);

  function translatePlace(name) {
    const original = String(name ?? '');
    if (window.getLanguage?.() !== 'te') {
      return original;
    }

    const trimmed = original.trim();
    const bracketed = trimmed.match(/^(.+?)\s*\(([^()]*)\)$/);
    if (bracketed) {
      const place = translatePlace(bracketed[1]);
      const note = bracketed[2].trim();
      if (note.toLowerCase() === 'longest route from mdp to rs') {
        return `${place} (ఎండీపీ నుంచి ఆర్‌ఎస్ వరకు పొడవైన రూట్)`;
      }
      return `${place} (${note})`;
    }

    if (trimmed.includes('/')) {
      return trimmed.split('/').map((part) => translatePlace(part)).join('/');
    }

    return places[trimmed.toLowerCase()] || original;
  }

  function translateRoute(routeString) {
    return String(routeString ?? '')
      .split(' - ')
      .map((place) => translatePlace(place))
      .join(' - ');
  }

  function translateStops(stopsString) {
    return String(stopsString ?? '')
      .split(',')
      .map((stop) => translatePlace(stop))
      .join(', ');
  }

  window.translatePlace = translatePlace;
  window.translateRoute = translateRoute;
  window.translateStops = translateStops;
})();
