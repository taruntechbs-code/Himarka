const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'src', 'lib', 'i18n', 'locales');
const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'));

const translations = {
  hi: {
    nav: {
      dashboard: 'डैशबोर्ड',
      telemetry: 'पर्यावरण',
      storage: 'भंडारण',
      produce: 'एआई व उपज',
      energy: 'ऊर्जा',
      devices: 'उपकरण',
      alerts: 'अलर्ट',
      settings: 'सेटिंग्स'
    },
    mode: {
      demo: 'डेमो मोड',
      real: 'लाइव बैकएंड',
      demoShort: 'डेमो',
      realShort: 'लाइव',
      simulatedNotice: 'सत्यापन और प्रदर्शन हेतु अनुकरणीय टेलीमेट्री डेटा'
    },
    dashboard: {
      overallStatus: 'उत्कृष्ट',
      overallMessage: 'आपका शीत भंडारण सुरक्षित है और सभी सब्जियां सुरक्षित हैं।',
      produceSafe: 'उपज सुरक्षित एवं ताज़ा है',
      coldIdeal: 'तापमान बिल्कुल सही है',
      humidityGood: 'नमी सब्जियों के लिए अनुकूल है',
      powerGood: 'सौर ऊर्जा सामान्य रूप से काम कर रही है',
      coolingGood: 'शीतलन प्रणाली सामान्य है',
      noAction: 'किसी कार्रवाई की आवश्यकता नहीं — सब सुरक्षित है',
      heroTitle: 'भंडारण वातावरण',
      targetRange: 'वर्तमान भंडारण तापमान',
      lastUpdated: 'अंतिम अपडेट',
      checklistTitle: 'मुख्य स्थिति सारांश',
      checklist: {
        produce: 'उपज',
        coldAir: 'ठंडी हवा',
        humidity: 'नमी',
        power: 'ऊर्जा',
        action: 'कार्रवाई'
      },
      statusTitle: 'वर्तमान भंडारण स्थिति',
      statusSubtitle: 'शीत भंडारण की स्पष्ट एवं उपयोगी स्थिति',
      produceTitle: 'वर्तमान में भंडारित उपज',
      produceSubtitle: 'कक्ष में सुरक्षित रखी गई आपकी ताज़ा सब्जियां',
      historyTitle: '24 घंटे का तापमान रिकॉर्ड',
      historySubtitle: 'प्रदर्शित करता है कि आपका भंडारण दिन-रात सुरक्षित ठंडा रहा है',
      chartTitle: 'पिछले 24 घंटों का तापमान (°C)',
      chartSubtitle: 'तापमान सुरक्षित सीमा (1.0°C – 4.0°C) में स्थिर रहा',
      techTitle: 'तकनीकी विवरण देखना चाहते हैं?',
      techDesc: 'विस्तृत वोल्टेज, बैटरी मेट्रिक्स, सेंसर हार्डवेयर और रॉ टेलीमेट्री समर्पित पेजों पर उपलब्ध हैं।',
      solarDetails: 'सौर व ऊर्जा विवरण',
      sensorHardware: 'सेंसर हार्डवेयर',
      metrics: {
        temperature: 'वर्तमान तापमान',
        humidity: 'सापेक्ष आर्द्रता',
        produceStatus: 'उपज की ताज़गी',
        power: 'सौर ऊर्जा स्थिति',
        cooling: 'शीतलन प्रणाली',
        alerts: 'अलर्ट व सूचनाएं'
      },
      status: {
        good: 'उत्कृष्ट',
        optimal: 'उत्कृष्ट',
        fresh: 'ताज़ा व सुरक्षित',
        active: 'सक्रिय',
        coolingWorking: 'सामान्य रूप से कार्यरत',
        noIssues: 'कोई समस्या नहीं',
        coolingActive: 'शीतलन सक्रिय',
        coolingIdle: 'स्टैंडबाय',
        healthySafe: 'भंडारण सुरक्षित एवं स्वस्थ',
        tempGood: 'तापमान बिल्कुल सही है',
        tempDesc: 'तापमान मानक सीमा के भीतर है',
        humidityStable: 'नमी स्थिर है',
        humidityDesc: 'सब्जियों की ताज़गी के लिए नमी उपयुक्त है',
        conditionGood: 'स्थिति: अच्छी',
        produceGood: 'उपज स्थिति: उत्कृष्ट',
        produceDesc: 'भंडारित सब्जियां सुरक्षित व ताज़ी हैं',
        powerPlenty: 'पर्याप्त सौर ऊर्जा',
        solarActive: 'सौर ऊर्जा सक्रिय',
        powerDesc: 'पूर्ण बैटरी बैकअप के साथ सामान्य रूप से कार्यरत',
        safe: 'सुरक्षित',
        coolingDesc: 'सब्जियों की सुरक्षा के लिए ठंडी हवा प्रवाहित हो रही है',
        alertsDesc: 'सभी प्रणालियां सुरक्षित हैं • किसी कार्रवाई की आवश्यकता नहीं',
        storedSafely: 'सुरक्षित भंडारित'
      }
    }
  },
  as: {
    nav: {
      dashboard: 'ডেশ্বব’ৰ্ড',
      telemetry: 'পৰিৱেশ',
      storage: 'ভঁৰাল',
      produce: 'এআই আৰু শস্য',
      energy: 'সৌৰ শক্তি',
      devices: 'যন্ত্ৰপাতি',
      alerts: 'সতৰ্কবাৰ্তা',
      settings: 'ছেটিংছ'
    },
    mode: {
      demo: 'ডেমো ম’ড',
      real: 'প্ৰত্যক্ষ চাৰ্ভাৰ',
      demoShort: 'ডেমো',
      realShort: 'লাইভ',
      simulatedNotice: 'প্ৰদৰ্শন আৰু পৰীক্ষণৰ বাবে অনুৰূপ টেলিমিত্ৰি তথ্য'
    },
    dashboard: {
      overallStatus: 'উত্তম',
      overallMessage: 'আপোনাৰ শীতল ভঁৰাল সুৰক্ষিত আৰু শস্যসমূহ ভালে আছে।',
      produceSafe: 'শস্য সুৰক্ষিত আৰু সতেজ',
      coldIdeal: 'উষ্ণতা উপযুক্ত অৱস্থাত আছে',
      humidityGood: 'আৰ্দ্ৰতা শাক-পাচলিৰ বাবে অনুকূল',
      powerGood: 'সৌৰ শক্তি স্বাভাৱিকভাৱে চলি আছে',
      coolingGood: 'শীতলীকৰণ স্বাভাৱিকভাৱে কাৰ্যৰত',
      noAction: 'কোনো পদক্ষেপৰ প্ৰয়োজন নাই — সকলো সুৰক্ষিত',
      heroTitle: 'ভঁৰালৰ পৰিৱেশ',
      targetRange: 'বৰ্তমান সংৰক্ষণ উষ্ণতা',
      lastUpdated: 'শেহতীয়া আপডেট',
      checklistTitle: 'জনা প্ৰয়োজনীয় সকলো তথ্য',
      checklist: {
        produce: 'শস্য',
        coldAir: 'শীতল বতাহ',
        humidity: 'আৰ্দ্ৰতা',
        power: 'সৌৰ শক্তি',
        action: 'পদক্ষেপ'
      },
      statusTitle: 'বৰ্তমানৰ ভঁৰাল স্থিতি',
      statusSubtitle: 'শীতল ভঁৰালৰ স্পষ্ট আৰু ব্যৱহাৰোপযোগী তথ্য',
      produceTitle: 'বৰ্তমান মজুত থকা শস্য',
      produceSubtitle: 'শীতল কক্ষত সুৰক্ষিতভাৱে সংৰক্ষিত আপোনাৰ সতেজ শাক-পাচলি',
      historyTitle: '২৪ ঘণ্টাৰ উষ্ণতাৰ লেখচিত্র',
      historySubtitle: 'দিন আৰু ৰাতি ভঁৰালটো নিৰন্তৰ শীতল আৰু সুৰক্ষিত থকা দেখুৱায়',
      chartTitle: 'বিগত ২৪ ঘণ্টাৰ কক্ষৰ উষ্ণতা (°C)',
      chartSubtitle: 'উষ্ণতা সুৰক্ষিত পৰিসৰত (১.০°চে – ৪.০°চে) সুস্থিৰ আছিল',
      techTitle: 'প্ৰযুক্তিগত বিৱৰণ চাব বিচাৰে নেকি?',
      techDesc: 'ভল্টেজ, বেটাৰী স্থিতি, চেন্সৰ হাৰ্ডৱেৰ আৰু বিশদ তথ্য নিৰ্দিষ্ট পৃষ্ঠাত উপলব্ধ।',
      solarDetails: 'সৌৰ আৰু শক্তি তথ্য',
      sensorHardware: 'চেন্সৰ যন্ত্ৰাংশ',
      metrics: {
        temperature: 'কক্ষৰ উষ্ণতা',
        humidity: 'আপেক্ষিক আৰ্দ্ৰতা',
        produceStatus: 'শস্যৰ সতেজতা',
        power: 'সৌৰ শক্তি স্থিতি',
        cooling: 'শীতলীকৰণ ব্যৱস্থা',
        alerts: 'সতৰ্কবাৰ্তা আৰু কাম'
      },
      status: {
        good: 'উত্তম',
        optimal: 'উৎকৃষ্ট',
        fresh: 'সতেজ আৰু নিৰোগী',
        active: 'সক্ৰিয়',
        coolingWorking: 'স্বাভাৱিকভাৱে কাৰ্যৰত',
        noIssues: 'কোনো সমস্যা নাই',
        coolingActive: 'শীতলীকৰণ সক্ৰিয়',
        coolingIdle: 'ষ্টেণ্ডবাই',
        healthySafe: 'ভঁৰাল সুস্থ আৰু সুৰক্ষিত',
        tempGood: 'উষ্ণতা অনুকূল',
        tempDesc: 'উষ্ণতা মানক সংৰক্ষণ পৰিসৰৰ ভিতৰত আছে',
        humidityStable: 'আৰ্দ্ৰতা সুস্থিৰ',
        humidityDesc: 'শাক-পাচলি সতেজ ৰাখিবলৈ আৰ্দ্ৰতা সঠিক আছে',
        conditionGood: 'অৱস্থা: ভাল',
        produceGood: 'শস্যৰ অৱস্থা: উত্তম',
        produceDesc: 'মজুত শস্য উৎকৃষ্ট অৱস্থাত আছে',
        powerPlenty: 'পৰ্যাপ্ত শক্তি',
        solarActive: 'সৌৰ শক্তি সক্ৰিয়',
        powerDesc: 'সম্পূৰ্ণ বেটাৰী সংৰক্ষণৰ সৈতে স্বাভাৱিকভাৱে চলি আছে',
        safe: 'সুৰক্ষিত',
        coolingDesc: 'শস্য ৰক্ষাৰ বাবে শীতল বতাহ মৃদুভাৱে প্ৰৱাহিত হৈছে',
        alertsDesc: 'সকলো ব্যৱস্থা সুৰক্ষিত • কোনো ব্যৱস্থাৰ প্ৰয়োজন নাই',
        storedSafely: 'সুৰক্ষিত সংৰক্ষণ'
      }
    }
  },
  bn: {
    nav: {
      dashboard: 'ড্যাশবোর্ড',
      telemetry: 'পরিবেশ',
      storage: 'সংরক্ষণাগার',
      produce: 'এআই ও ফসল',
      energy: 'শক্তি',
      devices: 'যন্ত্রপাতি',
      alerts: 'সতর্কবার্তা',
      settings: 'সেটিংস'
    },
    mode: {
      demo: 'ডেমো মোড',
      real: 'লাইভ ব্যাকএন্ড',
      demoShort: 'ডেমো',
      realShort: 'লাইভ',
      simulatedNotice: 'যাচাই ও প্রদর্শনের জন্য সিমুলেটেড টেলিমেট্রি ডেটা'
    },
    dashboard: {
      overallStatus: 'ভালো',
      overallMessage: 'আপনার হিমাগার ভালো অবস্থায় রয়েছে এবং শাকসবজি নিরাপদ আছে।',
      produceSafe: 'ফসল নিরাপদ ও সতেজ রয়েছে',
      coldIdeal: 'তাপমাত্রা একদম সঠিক রয়েছে',
      humidityGood: 'আর্দ্রতা ফসলের জন্য অনুকূল',
      powerGood: 'সৌর শক্তি স্বাভাবিকভাবে চলছে',
      coolingGood: 'শীতলীকরণ স্বাভাবিকভাবে কাজ করছে',
      noAction: 'কোনো ব্যবস্থা নেওয়ার প্রয়োজন নেই — সবকিছু নিরাপদ',
      heroTitle: 'সংরক্ষণ পরিবেশ',
      targetRange: 'বর্তমান সংরক্ষণ তাপমাত্রা',
      lastUpdated: 'সর্বশেষ আপডেট',
      checklistTitle: 'আপনার প্রয়োজনীয় মূল তথ্য',
      checklist: {
        produce: 'ফসল',
        coldAir: 'ঠান্ডা বাতাস',
        humidity: 'আর্দ্রতা',
        power: 'শক্তি',
        action: 'করণীয়'
      },
      statusTitle: 'বর্তমান হিমাগারের অবস্থা',
      statusSubtitle: 'হিমাগারের স্পষ্ট ও কার্যকর পরিস্থিতি',
      produceTitle: 'বর্তমানে সংরক্ষিত ফসল',
      produceSubtitle: 'শীতল কক্ষে নিরাপদে সংরক্ষিত আপনার তাজা শাকসবজি',
      historyTitle: '২৪ ঘণ্টার তাপমাত্রা রেকর্ড',
      historySubtitle: 'দিন ও রাত হিমাগারটি নিরবচ্ছিন্নভাবে ঠান্ডা রয়েছে',
      chartTitle: 'গত ২৪ ঘণ্টার কক্ষের তাপমাত্রা (°C)',
      chartSubtitle: 'তাপমাত্রা নিরাপদ সীমায় (১.০°সে – ৪.০°সে) স্থিতিশীল ছিল',
      techTitle: 'প্রকৌশলগত বিবরণ দেখতে চান?',
      techDesc: 'বিস্তারিত ভোল্টেজ, ব্যাটারি মেট্রিক্স এবং সেন্সর ডেটা নির্দিষ্ট পাতায় উপলব্ধ।',
      solarDetails: 'সৌর ও শক্তি বিবরণ',
      sensorHardware: 'সেন্সর হার্ডওয়্যার',
      metrics: {
        temperature: 'কক্ষের তাপমাত্রা',
        humidity: 'আপেক্ষিক আর্দ্রতা',
        produceStatus: 'ফসলের সতেজতা',
        power: 'সৌর শক্তি স্থিতি',
        cooling: 'শীতলীকরণ ব্যবস্থা',
        alerts: 'সতর্কবার্তা ও কাজ'
      },
      status: {
        good: 'ভালো',
        optimal: 'উৎকৃষ্ট',
        fresh: 'তাজা ও সতেজ',
        active: 'সক্রিয়',
        coolingWorking: 'স্বাভাবিকভাবে চলছে',
        noIssues: 'কোনো সমস্যা নেই',
        coolingActive: 'শীতলীকরণ সক্রিয়',
        coolingIdle: 'স্ট্যান্ডবাই',
        healthySafe: 'হিমাগার সুস্থ ও নিরাপদ',
        tempGood: 'তাপমাত্রা ভালো আছে',
        tempDesc: 'তাপমাত্রা স্বাভাবিক সংরক্ষণ সীমার মধ্যে রয়েছে',
        humidityStable: 'আর্দ্রতা স্থিতিশীল',
        humidityDesc: 'শাকসবজি সতেজ রাখতে আর্দ্রতা সঠিক রয়েছে',
        conditionGood: 'অবস্থা: ভালো',
        produceGood: 'ফসলের অবস্থা: চমৎকার',
        produceDesc: 'সংরক্ষিত ফসল স্বাস্থ্যকর ও তাজা অবস্থায় আছে',
        powerPlenty: 'পর্যাপ্ত শক্তি',
        solarActive: 'সৌরশক্তি সক্রিয়',
        powerDesc: 'সম্পূর্ণ ব্যাটারি ব্যাকআপ নিয়ে স্বাভাবিকভাবে চলছে',
        safe: 'নিরাপদ',
        coolingDesc: 'ফসল সুরক্ষায় মৃদু ঠান্ডা বাতাস প্রবাহিত হচ্ছে',
        alertsDesc: 'সকল ব্যবস্থা নিরাপদ • কোনো ব্যবস্থা নেওয়ার প্রয়োজন নেই',
        storedSafely: 'নিরাপদে সংরক্ষিত'
      }
    }
  },
  ne: {
    nav: {
      dashboard: 'ड्यासबोर्ड',
      telemetry: 'वातावरण',
      storage: 'भण्डारण',
      produce: 'एआई र बाली',
      energy: 'ऊर्जा',
      devices: 'उपकरण',
      alerts: 'सूचना',
      settings: 'सेटिङ्हरू'
    },
    mode: {
      demo: 'डेमो मोड',
      real: 'लाइभ ब्याकएन्ड',
      demoShort: 'डेमो',
      realShort: 'लाइभ',
      simulatedNotice: 'प्रमाणीकरण र प्रदर्शनका लागि सिमुलेटेड टेलिमेट्री'
    },
    dashboard: {
      overallStatus: 'राम्रो',
      overallMessage: 'तपाईंको शीत भण्डार राम्रो अवस्थामा छ र तरकारीहरू सुरक्षित छन्।',
      produceSafe: 'उत्पादन सुरक्षित र ताजा छ',
      coldIdeal: 'तापक्रम उपयुक्त छ',
      humidityGood: 'आर्द्रता तरकारीका लागि राम्रो छ',
      powerGood: 'सौर्य ऊर्जा सामान्य रूपमा चलिरहेको छ',
      coolingGood: 'शीतलन प्रणाली सामान्य छ',
      noAction: 'कुनै कदम चाल्न आवश्यक छैन — सबै सुरक्षित छ',
      heroTitle: 'भण्डारण वातावरण',
      targetRange: 'हालको भण्डारण तापक्रम',
      lastUpdated: 'अन्तिम अपडेट',
      checklistTitle: 'तपाईंले जान्नै पर्ने जानकारी',
      checklist: {
        produce: 'उत्पादन',
        coldAir: 'चिसो हावा',
        humidity: 'आर्द्रता',
        power: 'ऊर्जा',
        action: 'कारबाही'
      },
      statusTitle: 'हालको भण्डारण स्थिति',
      statusSubtitle: 'शीत भण्डार भित्रको स्पष्ट र उपयोगी स्थिति',
      produceTitle: 'हाल भण्डारण गरिएका तरकारी',
      produceSubtitle: 'शीत कक्षमा सुरक्षित राखिएका तपाईंका ताजा उत्पादनहरू',
      historyTitle: '२४ घण्टाको तापक्रम अभिलेख',
      historySubtitle: 'तपाईंको भण्डार दिनरात निरन्तर सुरक्षित चिसो रहेको देखाउँछ',
      chartTitle: 'पछिल्लो २४ घण्टाको तापक्रम (°C)',
      chartSubtitle: 'तापक्रम सुरक्षित दायरा (१.०°C – ४.०°C) मा स्थिर रह्यो',
      techTitle: 'प्राविधिक विवरण हेर्न चाहनुहुन्छ?',
      techDesc: 'विस्तृत भोल्टेज, ब्याट्री स्थिति र सेन्सर हार्डवेयर छुट्टै पृष्ठहरूमा उपलब्ध छन्।',
      solarDetails: 'सौर्य तथा ऊर्जा विवरण',
      sensorHardware: 'सेन्सर हार्डवेयर',
      metrics: {
        temperature: 'कक्षको तापक्रम',
        humidity: 'सापेक्ष आर्द्रता',
        produceStatus: 'बालीको ताजगी',
        power: 'सौर्य ऊर्जा स्थिति',
        cooling: 'शीतलन प्रणाली',
        alerts: 'सूचना तथा कार्यहरू'
      },
      status: {
        good: 'राम्रो',
        optimal: 'उत्कृष्ट',
        fresh: 'ताजा र स्वस्थ',
        active: 'सक्रिय',
        coolingWorking: 'सामान्य रूपमा कार्यरत',
        noIssues: 'कुनै समस्या छैन',
        coolingActive: 'शीतलन सक्रिय',
        coolingIdle: 'स्ट्यान्डबाइ',
        healthySafe: 'भण्डारण स्वस्थ र सुरक्षित',
        tempGood: 'तापक्रम राम्रो देखिन्छ',
        tempDesc: 'तापक्रम मानक भण्डारण दायरा भित्र छ',
        humidityStable: 'आर्द्रता स्थिर छ',
        humidityDesc: 'तरकारी जोगाउन हावाको आर्द्रता स्थिर छ',
        conditionGood: 'अवस्था: राम्रो',
        produceGood: 'उत्पादन अवस्था: राम्रो',
        produceDesc: 'भण्डारित उत्पादन राम्रो र स्वस्थ अवस्थामा छ',
        powerPlenty: 'पर्याप्त ऊर्जा',
        solarActive: 'सौर्य ऊर्जा सक्रिय',
        powerDesc: 'पूर्ण ब्याट्री जगेडाका साथ सामान्य रूपमा चल्दै',
        safe: 'सुरक्षित',
        coolingDesc: 'बाली जोगाउन चिसो हावा बिस्तारै घुमिरहेको छ',
        alertsDesc: 'सबै प्रणाली सुरक्षित छन् • तपाईंले केही गर्नु पर्दैन',
        storedSafely: 'सुरक्षित राखिएको'
      }
    }
  },
  mni: {
    nav: {
      dashboard: 'দেশবোর্দ',
      telemetry: 'অকোইবগী ফিবম',
      storage: 'থমফম',
      produce: 'এআই অমসুং পোত্থোক',
      energy: 'শক্তি',
      devices: 'যন্ত্রপাতি',
      alerts: 'চেকশিনৱা',
      settings: 'সেটিংস'
    },
    mode: {
      demo: 'ডেমো মোদ',
      real: 'লাইভ বেকএন্দ',
      demoShort: 'ডেমো',
      realShort: 'লাইভ',
      simulatedNotice: 'পরিক্ষাগীদমক সিমুলেতেদ তেলিমেত্রি দেতা'
    },
    dashboard: {
      overallStatus: 'অফবা',
      overallMessage: 'নহাক্কী কোল্ড ষ্টোরেজ অফবা ফিবমদা লৈ অমসুং হৱাই-চেংৱাইশিং শেংনা লৈ।',
      produceSafe: 'পোত্থোকশিং সুৰক্ষিত অমসুং অনৌবা ওইনা লৈ',
      coldIdeal: 'অইংবা ফিবম চুম্না লৈ',
      humidityGood: 'ঈশিংগী মমিংশিং পোত্থোক্কীদমক চুনৈ',
      powerGood: 'সোলর পৱার স্বাভাৱিক ওইনা চত্থরি',
      coolingGood: 'অইংবা পীবগী থবক অফবা ফিবমদা লৈ',
      noAction: 'করিগুম্বা তৌবগী দরকাৰ লৈতে — পুম্নমক শেংনা লৈ',
      heroTitle: 'থমফমগী অকোইবা ফিবম',
      targetRange: 'হৌজিক্কী অইংবা লেভেল',
      lastUpdated: 'অরোইবা অপদেত',
      checklistTitle: 'নহাক্না খঙদবা য়াদবা ৱাফমশিং',
      checklist: {
        produce: 'পোত্থোক',
        coldAir: 'অইংবা নুংশিৎ',
        humidity: 'আৰ্দ্ৰতা',
        power: 'শক্তি',
        action: 'তৌগদবা'
      },
      statusTitle: 'হৌজিক্কী থমফমগী ফিবম',
      statusSubtitle: 'কোল্ড ষ্টোরেজগী ময়েক শেংবা অমসুং দরকাৰ ওইবা ফিবম',
      produceTitle: 'হৌজিক থম্লিবা পোত্থোকশিং',
      produceSubtitle: 'অইংবা কা মনুংদা সুৰক্ষিত ওইনা থম্লিবা নহাক্কী অনৌবা পোত্থোকশিং',
      historyTitle: 'পুং ২৪ গী অইং-অশাগী ৱাফম',
      historySubtitle: 'নুমিৎ অমসুং অহিংশিংদা অইংবা অফবা ফিবমদা লেংদনা লৈবদু উৎলি',
      chartTitle: 'হৌখিবা পুং ২৪ গী কা মনুংগী অইংবা (°C)',
      chartSubtitle: 'অইংবা অসি সুৰক্ষিত মফমদা (১.০°C – ৪.০°C) লেংদনা লৈখি',
      techTitle: 'তেকনিকেল ৱাফমশিং য়েংবা পাম্বিব্রা?',
      techDesc: 'ভোল্টেজ, বেত্তরি ফিবম অমসুং সেন্সরগী অকুপ্পা ৱাফম তোঙানবা পেজশিংদা ফংগনি।',
      solarDetails: 'সোলর অমসুং শক্তিগী ৱাফম',
      sensorHardware: 'সেন্সরগী পোত্থোকশিং',
      metrics: {
        temperature: 'কাগী অইংবা',
        humidity: 'ঈশিং মমিং',
        produceStatus: 'পোত্থোক্কী ফিবম',
        power: 'সোলর পৱার ফিবম',
        cooling: 'অইংবা পীবগী সিস্তেম',
        alerts: 'চেকশিনৱা অমসুং থবক'
      },
      status: {
        good: 'অফবা',
        optimal: 'উৎকৃষ্ট',
        fresh: 'অনৌবা অমসুং হকচাং ফবা',
        active: 'সক্ৰিয়',
        coolingWorking: 'স্বাভাৱিক ওইনা থবক তৌরি',
        noIssues: 'ৱাফম অমতা লৈতে',
        coolingActive: 'অইংবা পীবা চত্থরি',
        coolingIdle: 'লেপ্তুনা লৈরি',
        healthySafe: 'থমফম অসি হকচাং ফনা অমসুং সুৰক্ষিত ওইনা লৈ',
        tempGood: 'অইংবা অফবা ফিবমদা লৈ',
        tempDesc: 'অইংবা অসি ষ্টেন্দাৰ্ড লেভেলদা লৈ',
        humidityStable: 'ঈশিং মমিং লেংদনা লৈ',
        humidityDesc: 'হৱাই-চেংৱাই ঙাক্নবা আৰ্দ্ৰতা অফবা ফিবমদা লৈ',
        conditionGood: 'ফিবম: অফবা',
        produceGood: 'পোত্থোক্কী ফিবম: অফবা',
        produceDesc: 'থম্লিবা পোত্থোকশিং হকচাং ফনা লৈরি',
        powerPlenty: 'পৱার মরাং কায়না লৈ',
        solarActive: 'সোলর এক্তিব ওইরি',
        powerDesc: 'ফুল বেত্তরিগা লোয়ননা স্বাভাৱিক ওইনা চত্থরি',
        safe: 'সুৰক্ষিত',
        coolingDesc: 'পোত্থোক ঙাক্নবা অইংবা নুংশিৎ নীংথিনা হুম্লি',
        alertsDesc: 'সিস্তেম পুম্নমক সুৰক্ষিত ওইরি • নহাক্না তৌগদবা লৈতে',
        storedSafely: 'সুৰক্ষিত ওইনা থম্লে'
      }
    }
  },
  brx: {
    nav: {
      dashboard: 'डेसबर्ड',
      telemetry: 'आबहावा',
      storage: 'दनथुमग्रा',
      produce: 'एआइ आरो आबाद',
      energy: 'गोहो',
      devices: 'यन्त्रफोर',
      alerts: 'सांग्रांथि',
      settings: 'सेटिङफोर'
    },
    mode: {
      demo: 'डेमो मद',
      real: 'लाइभ बेकएन्द',
      demoShort: 'डेमो',
      realShort: 'लाइभ',
      simulatedNotice: 'जांच आरो दिन्थिनायनि थाखाय सिमुलिटेद देथा'
    },
    dashboard: {
      overallStatus: 'मोजां',
      overallMessage: 'नोंथांनि दनथुमग्रा जायगाया मोजां आरो फिथाइ-सामथाइफोरा रैखाथि दं।',
      produceSafe: 'फिथाइ-सामथाइया रैखाथि आरो गोदान दं',
      coldIdeal: 'गुसु बिदुंआ थि बिबांआव दं',
      humidityGood: 'सिदोब आबहावाया आबादनि थाखाय मोजां',
      powerGood: 'सान गोहोआ रोखोमसे सोलिगासिनो दं',
      coolingGood: 'गुसु खालामग्राया मोजां मावगासिनो दं',
      noAction: 'जेबो खालामनांला — गासैबो रैखाथि दं',
      heroTitle: 'दनथुमनायनि आबहावा',
      targetRange: 'दानि बिदुंनि बिबां',
      lastUpdated: 'जोबथा आपदेत',
      checklistTitle: 'नोंथांनि मिथिनांगौ गासै खोथा',
      checklist: {
        produce: 'फिथाइ',
        coldAir: 'गुसु बार',
        humidity: 'सिदोबथि',
        power: 'गोहो',
        action: 'मावनांगौ'
      },
      statusTitle: 'दानि दनथुमनायनि थासारि',
      statusSubtitle: 'गुसु खोथा सिंनि रोखा आरो गोनांथार थासारि',
      produceTitle: 'दानि दनथुमनाय फिथाइफोर',
      produceSubtitle: 'गुसु खथायाव रैखाथि दंनाय नोंथांनि गोदान फिथाइ-सामथाइफोर',
      historyTitle: '२४ घन्टा बिदुंनि फोरमान',
      historySubtitle: 'नोंथांनि दनथुमग्राया हर-सान थि गुसु जानानै थानायखौ दिन्थियो',
      chartTitle: 'थांनाय २४ घन्टायाव खथानि गुसुथि (°C)',
      chartSubtitle: 'बिदुंआ रैखाथि सिमा (१.०°C – ४.०°C) आव थि थादोंमोन',
      techTitle: 'तेकनिकेल खोथा नायनो सानो नामा?',
      techDesc: 'गुवारै भल्टेज, बेटारि आरो सेनसरनि खोथा आलादा बिखंआव मोनगोन।',
      solarDetails: 'सान आरो गोहोनि खोथा',
      sensorHardware: 'सेनसर मुवाफोर',
      metrics: {
        temperature: 'खथानि बिदुं',
        humidity: 'सिदोबथि',
        produceStatus: 'फिथाइनि गोदानथि',
        power: 'सान गोहो थासारि',
        cooling: 'गुसु खालामग्रा सिस्तेम',
        alerts: 'सांग्रांथि आरो खामानि'
      },
      status: {
        good: 'मोजां',
        optimal: 'गोबां मोजां',
        fresh: 'गोदान आरो साबसिन',
        active: 'मावगासिनो',
        coolingWorking: 'रोखोमसे मावगासिनो',
        noIssues: 'जेबो जेंना गैया',
        coolingActive: 'गुसु खालामगासिनो',
        coolingIdle: 'थाथना दं',
        healthySafe: 'दनथुमग्राया मोजां आरो रैखाथि',
        tempGood: 'बिदुंआ मोजां दिन्थियो',
        tempDesc: 'बिदुंआ थि सिमानि सिङाव दं',
        humidityStable: 'सिदोबथिया थि दं',
        humidityDesc: 'फिथाइ-सामथाइ रैखा खालामनो बारनि सिदोबथिया मोजां',
        conditionGood: 'थासारि: मोजां',
        produceGood: 'फिथाइनि थासारि: मोजां',
        produceDesc: 'दनथुमनाय फिथाइफोरा मोजां आरो गोदान दं',
        powerPlenty: 'गोहो आबुं दं',
        solarActive: 'सान गोहोआ मावगासिनो',
        powerDesc: 'आबुं बेटारि जों रोखोमसे सोलिदों',
        safe: 'रैखाथि',
        coolingDesc: 'फिथाइ रैखा खालामनो गुसु बार लासै बारदों',
        alertsDesc: 'गासैबो सिस्तेमा मोजां • नोंथांनि मावनांगौ गैया',
        storedSafely: 'मोजाङै दनथुमबाय'
      }
    }
  },
  lus: {
    nav: {
      dashboard: 'Dashboard',
      telemetry: 'Boruk',
      storage: 'Vawnṭhatna',
      produce: 'AI & Thlai',
      energy: 'Eng & Power',
      devices: 'Khawl dinhmun',
      alerts: 'Hriattirna',
      settings: 'Siamṭhatna'
    },
    mode: {
      demo: 'Demo Mode',
      real: 'Live Backend',
      demoShort: 'DEMO',
      realShort: 'LIVE',
      simulatedNotice: 'Enchhinna leh fiahna atan telemetry lem hman a ni'
    },
    dashboard: {
      overallStatus: 'ṬHA',
      overallMessage: 'I thlai vawnṭhatna hmun a ṭha a, i thlaite an him e.',
      produceSafe: 'Thlai a him a, a tharlam bawk',
      coldIdeal: 'Vawh lam a tawk chiah e',
      humidityGood: 'Tuihnang a ṭha tawk e',
      powerGood: 'Ni zung chakna a kal pangngai e',
      coolingGood: 'Tihvawhna khawl a thawk ṭha e',
      noAction: 'Tih ngai a awm lo — Engkim a him e',
      heroTitle: 'Vawnṭhatna Boruk',
      targetRange: 'Tun a vawh lam dinhmun',
      lastUpdated: 'Update hnuhnung ber',
      checklistTitle: 'I hriat tur pawimawh te',
      checklist: {
        produce: 'Thlai',
        coldAir: 'Boruk vawt',
        humidity: 'Hnawng lam',
        power: 'Chakna',
        action: 'Tih tur'
      },
      statusTitle: 'Vawnṭhatna dinhmun',
      statusSubtitle: 'Vawnṭhatna hmun chhung dinhmun chiangkuang tak',
      produceTitle: 'Tun a thlai dah te',
      produceSubtitle: 'Chhung a i thlai tharlam tak dah mek te',
      historyTitle: 'Darkar 24 chhung vawh lam dinhmun',
      historySubtitle: 'Chhun leh zan a vawt ṭha tawk reng tih a tarlang',
      chartTitle: 'Darkar 24 chhung vawh lam (°C)',
      chartSubtitle: 'Vawh lam chu dinhmun him (1.0°C – 4.0°C) ah a awm reng',
      techTitle: 'Khawl lam chanchin kimchang i duh em?',
      techDesc: 'Voltage, battery leh sensor chanchin te chu page dangah a en theih.',
      solarDetails: 'Solar & Power Kimchang',
      sensorHardware: 'Khawl Sensor Te',
      metrics: {
        temperature: 'Pindan vawh lam',
        humidity: 'Boruk hnawn lam',
        produceStatus: 'Thlai tharlam dan',
        power: 'Ni zung chakna dinhmun',
        cooling: 'Tihvawhna khawl',
        alerts: 'Hriattirna leh tih turte'
      },
      status: {
        good: 'ṬHA',
        optimal: 'ṬHA BER',
        fresh: 'THARLAM LEH HIM',
        active: 'A THAWK MEK',
        coolingWorking: 'A THAWK ṬHA E',
        noIssues: 'BUAINA A AWM LO',
        coolingActive: 'Tihvawh a kal mek',
        coolingIdle: 'Chawl mek',
        healthySafe: 'VAWNṬHATNA A HIM E',
        tempGood: 'VAWH LAM A TAWK CHIAH',
        tempDesc: 'Vawh lam chu a tawk chiah e',
        humidityStable: 'BORUK HNAWNG A TAWK CHIAH',
        humidityDesc: 'Thlai venhim nan boruk hnawng a tawk',
        conditionGood: 'DINHMUN: ṬHA',
        produceGood: 'THLAI DINHMUN: ṬHA',
        produceDesc: 'Dah mek te an ṭha a, an him e',
        powerPlenty: 'CHAKNA A TAWK E',
        solarActive: 'SOLAR A KAL',
        powerDesc: 'Battery full in pangngai takin a kal e',
        safe: 'HIM',
        coolingDesc: 'Thlai ven nan boruk vawt a kal reng e',
        alertsDesc: 'Engkim a him e • Tih ngai a awm lo',
        storedSafely: 'Dah him a ni'
      }
    }
  },
  kha: {
    nav: {
      dashboard: 'Dashboard',
      telemetry: 'Ka Mariang',
      storage: 'Ka Kynshew',
      produce: 'AI & Jingthung',
      energy: 'Borbasion',
      devices: 'Ki Tiir',
      alerts: 'Ki Maham',
      settings: 'Ki Jingpynbeit'
    },
    mode: {
      demo: 'Demo Mode',
      real: 'Live Backend',
      demoShort: 'DEMO',
      realShort: 'LIVE',
      simulatedNotice: 'Ka jingbatai lem na ka bynta ban peit bad pynshisha'
    },
    dashboard: {
      overallStatus: 'BHA',
      overallMessage: 'Ka jaka kynshew jong phi ka bha bad ki jhur ki shngain.',
      produceSafe: 'Ki jhur ki shngain bad ki dang thymmai',
      coldIdeal: 'Ka jingkhriat ka biang bha',
      humidityGood: 'Ka jingjngem ka biang na ka bynta ki jhur',
      powerGood: 'Ka bor sngi ka trei kam bha',
      coolingGood: 'Ka kor pynkhriat ka trei kam bha',
      noAction: 'Ym donkam ban leh eiei — Baroh ki shngain',
      heroTitle: 'Ka Mariang Kynshew',
      targetRange: 'Ka jingkhriat kynshew mynta',
      lastUpdated: 'La pynthymmai khatduh',
      checklistTitle: 'Kiei kiei kiba phi dei ban tip',
      checklist: {
        produce: 'Jhur',
        coldAir: 'Lyer khriat',
        humidity: 'Jingjngem',
        power: 'Bor sngi',
        action: 'Jingleh'
      },
      statusTitle: 'Ka kyrdan kynshew mynta',
      statusSubtitle: 'Ka jinglong jong ka jaka kynshew khriat',
      produceTitle: 'Ki jhur kiba la kynshew mynta',
      produceSubtitle: 'Ki jhur kiba la kynshew shngain ha ka kamra khriat',
      historyTitle: 'Ka jingkhriat ha ki 24 kynta',
      historySubtitle: 'Ka pyni ba ka jaka kynshew ka sah khriat beit mynsngi bad mynmiet',
      chartTitle: 'Ka jingkhriat ha ki 24 kynta (°C)',
      chartSubtitle: 'Ka jingkhriat ka sah ha ka kyrdan kaba biang (1.0°C – 4.0°C)',
      techTitle: 'Phi kwah ban tip shaphang ki kor ki bor?',
      techDesc: 'Ka voltage, battery bad ki sensor ki don ha kiwei pat ki sla.',
      solarDetails: 'Ka Bor Sngi & Power',
      sensorHardware: 'Ki Tiir Sensor',
      metrics: {
        temperature: 'Ka jingkhriat kamra',
        humidity: 'Ka jingjngem ka lyer',
        produceStatus: 'Ka jingbha ki jhur',
        power: 'Ka bor sngi',
        cooling: 'Ka kor pynkhriat',
        alerts: 'Ki maham bad ki kam'
      },
      status: {
        good: 'BHA',
        optimal: 'BHA TAM',
        fresh: 'THYMMAI BAD KOIT BHA',
        active: 'TREI KAM',
        coolingWorking: 'TREI KAM BHA',
        noIssues: 'YM DON JINGEH',
        coolingActive: 'Ka kor ka trei kam',
        coolingIdle: 'Ka shongthait',
        healthySafe: 'JAKA KYNSHEW KA SHNGAIN',
        tempGood: 'JINGKHRIAT KA BIANG BHA',
        tempDesc: 'Ka jingkhriat ka biang bha',
        humidityStable: 'JINGJNGEM KA THIKNA',
        humidityDesc: 'Ka jingjngem ka biang ban ri ia ki jhur',
        conditionGood: 'KYRDAN: BHA',
        produceGood: 'KYRDAN JHUR: BHA',
        produceDesc: 'Ki jhur kiba kynshew ki bha bad shngain',
        powerPlenty: 'BOR KA BIANG BHA',
        solarActive: 'BOR SNGI KA TREI',
        powerDesc: 'Ka battery ka dap bha bad ka trei kam thikna',
        safe: 'SHNGAIN',
        coolingDesc: 'Ka lyer khriat ka pyntrei kam ban ri ia ki jhur',
        alertsDesc: 'Baroh ki kor ki shngain • Ym donkam leh eiei',
        storedSafely: 'La kynshew shngain'
      }
    }
  }
};

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

// Function to ensure all keys from en exist in target
function fillMissingKeys(target, template) {
  for (const k in template) {
    if (typeof template[k] === 'object' && template[k] !== null && !Array.isArray(template[k])) {
      if (!target[k] || typeof target[k] !== 'object') {
        target[k] = {};
      }
      fillMissingKeys(target[k], template[k]);
    } else {
      if (target[k] === undefined) {
        target[k] = template[k]; // fallback to en value
      }
    }
  }
}

for (const [lang, data] of Object.entries(translations)) {
  const filePath = path.join(localesDir, `${lang}.json`);
  let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Merge provided localized updates
  deepMerge(content, data);

  // Fill any remaining keys from en as fallback
  fillMissingKeys(content, en);

  // Clean any SIH mentions
  let jsonStr = JSON.stringify(content, null, 2);
  jsonStr = jsonStr.replace(/SIH evaluation/g, 'evaluation');
  jsonStr = jsonStr.replace(/SIH/g, '');

  fs.writeFileSync(filePath, jsonStr + '\n', 'utf8');
  console.log(`Updated locale ${lang}.json successfully!`);
}
