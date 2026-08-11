// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCYfPRe977nsYkbGJTTp7rHdk_nlwc4OVA",
  authDomain: "ecoearn-dde57.firebaseapp.com",
  projectId: "ecoearn-dde57",
  storageBucket: "ecoearn-dde57.firebasestorage.app",
  messagingSenderId: "121464563434",
  appId: "1:121464563434:web:9edbcb1a4d74fcf4a01993"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUserData = null;
let targetScanUid = null;
let userCart = [];
let currentLang = 'en';
let selectedRatingScore = 0;

// Scanner & Map State Variables
let html5QrScannerInstance = null;
let scannedProductReward = 0;
let ecoMapInstance = null;
let mapInitialized = false;

// ==========================================
// 2. TRANSLATIONS DICTIONARY (UNIFIED & MULTILINGUAL)
// ==========================================
const translations = {
    'en': { 
        'intro-desc': 'Recycle plastic and shop 100+ sustainable products.', 
        'get-started': 'Get Started', 
        'login-title': 'Login / Register', 
        'login-btn': 'Enter Dashboard', 
        'choose-lang': 'Choose Your Language', 
        'continue-btn': 'Continue', 
        'nav-dash': 'Calculator', 
        'reward-text': 'Appropriate Reward', 
        'add-exp-wallet-btn': 'Add to Expected Wallet', 
        'nav-about': 'About', 
        'about-content': 'Welcome to ECOEARN, your partner in sustainability based in Visakhapatnam. Turn your plastic waste into value.', 
        'how-it-works-title': 'How It Works',
        'how-step-1': 'Collect: Gather your plastic recyclables at home.',
        'how-step-2': 'Calculate: Input the weight in KGs to view your reward rate (₹20/KG).',
        'how-step-3': 'Earn: Instantly add the digital currency rewards straight to your wallet balance.',
        'how-step-4': 'Shop: Spend your credits directly in our sustainable catalog of over 100+ plastic-free items.',
        'nav-shop': 'Eco Catalog', 
        'nav-cart': 'Cart', 
        'total-text': 'Total', 
        'purchase-btn': 'Purchase', 
        'pickup-title': 'Schedule Pickup', 
        'confirm-order': 'Confirm Order', 
        'nav-orders': 'Your Orders', 
        'nav-growth': 'My Impact', 
        'plastic-recycled': 'Plastic Recycled', 
        'nav-wallet': 'Real Wallet', 
        'nav-exp-wallet': 'Expected Wallet',
        'nav-qr': 'My Collector QR',
        'nav-barcode': 'Barcode Deposit',
        'nav-map': 'Recycling Centers',
        'shop-now': 'Shop Now', 
        'add-to-cart': 'Add to Cart', 
        'nav-rank': 'Leaderboard', 
        'nav-logout': 'Logout',
        'alert-wallet': 'Expected Wallet Updated!', 
        'alert-order': 'Order Confirmed!', 
        'alert-empty': 'Cart is empty!', 
        'alert-credits': 'Insufficient Real Wallet Credits!',
        'nav-feedback': 'Feedback', 
        'feedback-title': 'Rate Your Experience', 
        'feedback-subtitle': 'Your feedback helps us make ECOEARN better.', 
        'submit-feedback-btn': 'Submit Review', 
        'skip-btn': 'Skip for Now', 
        'alert-feedback-success': 'Thank you for your feedback!'
    },
    'te': { 
        'intro-desc': 'ప్లాస్టిక్‌ను రీసైకిల్ చేయండి మరియు 100+ వస్తువులను షాపింగ్ చేయండి.', 
        'get-started': 'ప్రారంభించండి', 
        'login-title': 'లాగిన్ / నమోదు', 
        'login-btn': 'డాష్‌బోర్డ్‌లోకి ప్రవేశించండి', 
        'choose-lang': 'మీ భాషను ఎంచుకోండి', 
        'continue-btn': 'కొనసాగించండి', 
        'nav-dash': 'కాలిక్యులేటర్', 
        'reward-text': 'తగిన రివార్డ్', 
        'add-exp-wallet-btn': 'అంచనా వాలెట్‌కు జోడించు', 
        'nav-about': 'గురించి', 
        'about-content': 'విశాఖపట్నం కేంద్రంగా పనిచేస్తున్న మీ సుస్థిరత భాగస్వామి ECOEARN కి స్వాగతం. మీ ప్లాస్టిక్ వ్యర్థాలను విలువగా మార్చండి.', 
        'how-it-works-title': 'ఇది ఎలా పనిచేస్తుంది',
        'how-step-1': 'సేకరించండి: మీ ఇంట్లో ఉన్న ప్లాస్టిక్ వ్యర్థాలను ఒకచోట చేర్చండి.',
        'how-step-2': 'లెక్కించండి: బహుమతి విలువను (₹20/KG) చూడటానికి బరువును కేజీలలో నమోదు చేయండి.',
        'how-step-3': 'సంపాదించండి: మీ డిజిటల్ క్రెడిట్ రివార్డులను నేరుగా మీ వాలెట్ బ్యాలెన్స్‌కు జోడించండి.',
        'how-step-4': 'కొనుగోలు చేయండి: మా యాప్‌లో ఉన్న 100+ ప్లాస్టిక్ రహిత వస్తువులను కొనుగోలు చేయడానికి మీ బ్యాలెన్స్‌ను ఉపయోగించండి.',
        'nav-shop': 'ఎకో కేటలాగ్', 
        'nav-cart': 'కార్ట్', 
        'total-text': 'మొత్తం', 
        'purchase-btn': 'కొనుగోలు', 
        'pickup-title': 'పికప్ షెడ్యూల్ చేయండి', 
        'confirm-order': 'ఆర్డర్ ధృవీకరించండి', 
        'nav-orders': 'మీ ఆర్డర్లు', 
        'nav-growth': 'నా ప్రభావం', 
        'plastic-recycled': 'రీసైకిల్ చేసిన ప్లాస్టిక్', 
        'nav-wallet': 'అసలు వాలెట్', 
        'nav-exp-wallet': 'అంచనా వాలెట్',
        'nav-qr': 'నా కలెక్టర్ QR',
        'nav-barcode': 'బార్‌కోడ్ డిపాజిట్',
        'nav-map': 'రీసైక్లింగ్ కేంద్రాలు',
        'shop-now': 'ఇప్పుడే షాపింగ్ చేయండి', 
        'add-to-cart': 'కార్ట్‌కి జోడించు', 
        'nav-rank': 'లీడర్ బోర్డ్', 
        'nav-logout': 'లాగ్ అవుట్',
        'alert-wallet': 'అంచనా వాలెట్ అప్‌డేట్ చేయబడింది!', 
        'alert-order': 'ఆర్డర్ ధృవీకరించబడింది!', 
        'alert-empty': 'కార్ట్ ఖాళీగా ఉంది!', 
        'alert-credits': 'అసలు వాలెట్‌లో తగినంత క్రెడిట్స్ లేవు!',
        'nav-feedback': 'అభిప్రాయం', 
        'feedback-title': 'మీ అనుభవాన్ని రేట్ చేయండి', 
        'feedback-subtitle': 'మీ అభిప్రాయం ECOEARNని మరింత మెరుగుపరచడంలో సహాయపడుతుంది.', 
        'submit-feedback-btn': 'సమీక్షను సమర్పించండి', 
        'skip-btn': 'ఇప్పుడే దాటవేయి', 
        'alert-feedback-success': 'మీ అభిప్రాయానికి ధన్యవాదాలు!'
    },
    'hi': { 
        'intro-desc': 'प्लास्टिक रीसायकल करें और 100+ उत्पादों की खरीदारी करें।', 
        'get-started': 'शुरू करें', 
        'login-title': 'लॉगिन / रजिस्टर', 
        'login-btn': 'डैशबोर्ड में प्रवेश करें', 
        'choose-lang': 'अपनी भाषा चुनें', 
        'continue-btn': 'जारी रखें', 
        'nav-dash': 'कैलकुलेटर', 
        'reward-text': 'उपयुक्त इनाम', 
        'add-exp-wallet-btn': 'अपेक्षित वॉलेट में जोड़ें', 
        'nav-about': 'हमारे बारे में', 
        'about-content': 'विशाखापत्तनम स्थित स्थिरता में आपके भागीदार ECOEARN में आपका स्वागत है।', 
        'how-it-works-title': 'यह कैसे काम करता है',
        'how-step-1': 'इकट्ठा करें: अपने घर पर रीसायकल करने योग्य प्लास्टिक कचरा जमा करें।',
        'how-step-2': 'हिसाब लगाएं: अपना इनाम मूल्य (₹20/KG) देखने के लिए वजन किलोग्राम में दर्ज करें।',
        'how-step-3': 'कमाएं: डिजिटल रिवॉर्ड राशि को सीधे अपने वॉलेट बैलेंस में जोड़ें।',
        'how-step-4': 'खरीदारी करें: हमारे 100+ प्लास्टिक-मुक्त पर्यावरण अनुकूल कैटलॉग से सीधे खरीदारी करें।',
        'nav-shop': 'इको कैटलॉग', 
        'nav-cart': 'कार्ट', 
        'total-text': 'कुल', 
        'purchase-btn': 'खरीदें', 
        'pickup-title': 'पिकअप शेड्यूल करें', 
        'confirm-order': 'ऑर्डर की पुष्टि करें', 
        'nav-orders': 'आपके आदेश', 
        'nav-growth': 'मेरा प्रभाव', 
        'plastic-recycled': 'पुनर्चक्रित प्लास्टिक', 
        'nav-wallet': 'असली वॉलेट', 
        'nav-exp-wallet': 'अपेक्षित वॉलेट',
        'nav-qr': 'मेरा कलेक्टर QR',
        'nav-barcode': 'बारकोड जमा',
        'nav-map': 'रीसाइक्लिंग केंद्र',
        'shop-now': 'अभी खरीदें', 
        'add-to-cart': 'कार्ट में जोड़ें', 
        'nav-rank': 'लीडरबोर्ड', 
        'nav-logout': 'लॉगआउट',
        'alert-wallet': 'अपेक्षित वॉलेट अपडेट हो गया!', 
        'alert-order': 'ऑर्डर की पुष्टि हो गई!', 
        'alert-empty': 'कार्ट खाली है!', 
        'alert-credits': 'असली वॉलेट में अपर्याप्त क्रेडिट!',
        'nav-feedback': 'फीडबैक', 
        'feedback-title': 'अपने अनुभव को रेट करें', 
        'feedback-subtitle': 'आपकी प्रतिक्रिया हमें ECOEARN को बेहतर बनाने में मदद करती है।', 
        'submit-feedback-btn': 'समीक्षा भेजें', 
        'skip-btn': 'अभी छोड़ें', 
        'alert-feedback-success': 'आपकी प्रतिक्रिया के लिए धन्यवाद!'
    }
};

// ==========================================
// 3. PRODUCT LIST (100 ITEMS - TRANSLATED)
// ==========================================
const productList = [
    { id: 1, name: { en: "Bamboo Toothbrushes", te: "వెదురు టూత్ బ్రష్‌లు", hi: "बांस के टूथब्रश" }, price: 60, img: "brush.png" },
    { id: 2, name: { en: "Glass Jars", te: "గాజు సీసాలు", hi: "कांच के जार" }, price: 120, img: "jar.jpeg" },
    { id: 3, name: { en: "Stainless Steel Straws", te: "స్టీల్ స్ట్రాలు", hi: "స్టెయిన్‌లెస్ స్టీల్ స్ట్రా" }, price: 80, img: "straw.png" },
    { id: 4, name: { en: "Beeswax Wraps", te: "తేనెటీగ మైనపు రేపర్లు", hi: "मोम के रैप्स" }, price: 250, img: "wax.jpeg" },
    { id: 5, name: { en: "Cotton Bags", te: "పత్తి సంచులు", hi: "सूती थैले" }, price: 100, img: "cloth.png" },
    { id: 6, name: { en: "Jute Shopping Bags", te: "జనపనార సంచులు", hi: "जूट के थैले" }, price: 150, img: "jute.png" },
    { id: 7, name: { en: "Bamboo Cutlery", te: "వెదురు స్పూన్లు", hi: "बांस के चम्मच और कांटे" }, price: 200, img: "spoon.png" },
    { id: 8, name: { en: "Stainless Steel Lunch Boxes", te: "స్టీల్ లంచ్ బాక్సులు", hi: "स्टेनलेस स्टील टिफिन" }, price: 450, img: "box..jpeg" },
    { id: 9, name: { en: "Copper Water Bottles", te: "రాగి వాటర్ బాటిల్స్", hi: "तांबे की पानी की बोतलें" }, price: 850, img: "copper.png" },
    { id: 10, name: { en: "Wooden Combs", te: "చెక్క దువ్వెనలు", hi: "लकड़ी की कंघी" }, price: 90, img: "comb.png" },
    { id: 11, name: { en: "Shampoo Bars", te: "షాంపూ బార్ సబ్బులు", hi: "शैम्पू बार्स" }, price: 280, img: "shampoo.png" },
    { id: 12, name: { en: "Conditioner Bars", te: "కండీషనర్ బార్లు", hi: "कंडीशनर बार्स" }, price: 280, img: "condi.png" },
    { id: 13, name: { en: "Metal Safety Razors", te: "మెటల్ సేఫ్టీ రేజర్లు", hi: "मेटल सेफ्टी रेज़र" }, price: 650, img: "razor.png" },
    { id: 14, name: { en: "Natural Loofah Sponges", te: "సహజ పీచు స్పాంజ్లు", hi: "प्राकृतिक लूफैह स्पंज" }, price: 70, img: "sponge.png" },
    { id: 15, name: { en: "Coconut Husk Scrubbers", te: "కొబ్బరి పీచు స్క్రబ్బర్లు", hi: "नारियल जटा स्क्रबर" }, price: 85, img: "coco.png" },
    { id: 16, name: { en: "Wool Dryer Balls", te: "ఉన్ని డ్రైయర్ బంతులు", hi: "ऊन ड्रायर बॉल्स" }, price: 400, img: "balls.png" },
    { id: 17, name: { en: "Silicone Stretch Lids", te: "సిలికాన్ స్ట్రెచ్ మూతలు", hi: "सिलिकॉन खिंचाव ढक्कन" }, price: 320, img: "small.png" },
    { id: 18, name: { en: "Mesh Produce Bags", te: "నెట్ కూరగాయల సంచులు", hi: "जालीदार सब्जी थैले" }, price: 140, img: "bag.png" },
    { id: 19, name: { en: "Wooden Clothes Pegs", te: "చెక్క బట్టల క్లిప్పులు", hi: "लकड़ी की कपड़े की चिमटी" }, price: 110, img: "pegs.jpeg" },
    { id: 20, name: { en: "Bamboo Cotton Buds", te: "వెదురు కాటన్ బడ్స్", hi: "बांस के कॉटन बड्स" }, price: 60, img: "buds.jpeg" },
    { id: 21, name: { en: "Reusable Cotton Rounds", te: "మళ్ళీ వాడదగిన కాటన్ ప్యాడ్స్", hi: "पुन: प्रयोज्य कॉटन पैड्स" }, price: 180, img: "cotton pads.jpeg" },
    { id: 22, name: { en: "Glass Spray Bottles", te: "గాజు స్ప్రే సీసాలు", hi: "कांच की स्प्रे बोतलें" }, price: 220, img: "spray.jpeg" },
    { id: 23, name: { en: "Soap Nuts", te: "కుంకుడుకాయలు", hi: "रीठा (सोप नट्स)" }, price: 150, img: "sballs.jpeg" },
    { id: 24, name: { en: "Cast Iron Cookware", te: "ఇనుప వంట పాత్రలు", hi: "कास्ट आयरन कड़ाही-तवा" }, price: 1800, img: "cookware.jpeg" },
    { id: 25, name: { en: "Ceramic Mugs", te: "సిరామిక్ కప్పులు", hi: "సిరేమిక్ మగ్స్" }, price: 240, img: "mugs.jpeg" },
    { id: 26, name: { en: "Bamboo Cutting Boards", te: "వెదురు చాపింగ్ బోర్డులు", hi: "बांस के चॉपिंग बोर्ड" }, price: 400, img: "cutveg.jpeg" },
    { id: 27, name: { en: "Cornstarch Trash Bags", te: "మొక్కజొన్న పిండి చెత్త సంచులు", hi: "कॉर्नस्टार्च कचरा बैग" }, price: 130, img: "corn.jpeg" },
    { id: 28, name: { en: "Paper Packing Tape", te: "కాగితం ప్యాకింగ్ టేప్", hi: "कागज पैकिंग टेप" }, price: 90, img: "tape.jpeg" },
    { id: 29, name: { en: "Hemp Twine", te: "జనపనార దారం", hi: "भांग की सुतली" }, price: 75, img: "thread.jpeg" },
    { id: 30, name: { en: "Terracotta Pots", te: "మట్టి కుండలు", hi: "मिट्टी के गमले" }, price: 200, img: "pots.jpeg" },
    { id: 31, name: { en: "Recycled Paper Notebooks", te: "రీసైకిల్ చేసిన కాగితం నోట్‌బుక్‌లు", hi: "रीसाइकल पेपर नोटबुक" }, price: 120, img: "book.jpeg" },
    { id: 32, name: { en: "Wooden Pencils", te: "చెక్క పెన్సిళ్లు", hi: "लकड़ी की पेंसिल" }, price: 40, img: "pencil.jpeg" },
    { id: 33, name: { en: "Refillable Fountain Pens", te: "రీఫిల్ చేయగల ఫౌంటెన్ పెన్నులు", hi: "रीफिलेबल फाउंटेन पेन" }, price: 500, img: "repen.jpeg" },
    { id: 34, name: { en: "Stainless Steel Tea Infusers", te: "స్టీల్ టీ వడపోత", hi: "स्टेनलेस स्टील चाय इन्फ्यूज़र" }, price: 180, img: "tea.jpeg" },
    { id: 35, name: { en: "Cloth Diapers", te: "బట్ట డైపర్లు", hi: "कपड़े के डायपर" }, price: 350, img: "diaper.jpeg" },
    { id: 36, name: { en: "Menstrual Cups", te: "మెన్‌స్ట్రువల్ కప్పులు", hi: "मासिक धर्म कप" }, price: 600, img: "menstrual.jpeg" },
    { id: 37, name: { en: "Bamboo Flooring", te: "వెదురు ఫ్లోరింగ్", hi: "बांस का फर्श" }, price: 2500, img: "floor.jpeg" },
    { id: 38, name: { en: "Cork Coasters", te: "కార్క్ కోస్టర్లు", hi: "कॉर्क कोस्टर" }, price: 100, img: "coasters.jpeg" },
    { id: 39, name: { en: "Glass Food Containers", te: "గాజు ఆహార డబ్బాలు", hi: "कांच के भोजन कंटेनर" }, price: 380, img: "container.jpeg" },
    { id: 40, name: { en: "Sisal Dish Brushes", te: "సిసల్ గిన్నెల బ్రష్లు", hi: "सिसल डिश ब्रश" }, price: 130, img: "dish.jpeg" },
    { id: 41, name: { en: "Natural Rubber Toys", te: "సహజ రబ్బరు బొమ్మలు", hi: "प्राकृतिक रबर के खिलौने" }, price: 450, img: "toys.jpeg" },
    { id: 42, name: { en: "Wooden Building Blocks", te: "చెక్క బిల్డింగ్ బ్లాక్స్", hi: "लकड़ी के ब्लॉक" }, price: 800, img: "block.jpeg" },
    { id: 43, name: { en: "Cotton Bread Bags", te: "కాటన్ రొట్టె సంచులు", hi: "సూती ब्रेड बैग" }, price: 110, img: "bread.jpeg" },
    { id: 44, name: { en: "Canvas Backpacks", te: "క్యాన్వాస్ బ్యాక్‌ప్యాక్‌లు", hi: "క్యాన్వాస్ బ్యాగ్" }, price: 1200, img: "canva.png" },
    { id: 45, name: { en: "Metal Paperclips", te: "మెటల్ పేపర్‌క్లిప్‌లు", hi: "धातु की पेपर क्लिप" }, price: 50, img: "clips.jpeg" },
    { id: 46, name: { en: "Compostable Parchment Paper", te: "కంపోస్టబుల్ పార్చ్మెంట్ పేపర్", hi: "कम्पोस्टेबल चर्मपत्र कागज" }, price: 160, img: "wrap.jpeg" },
    { id: 47, name: { en: "Soy Wax Candles", te: "సోయా మైనపు కొవ్వొత్తులు", hi: "सोया मोम की मोमबत्तियां" }, price: 320, img: "candel.jpeg" },
    { id: 48, name: { en: "Bamboo Hairbrushes", te: "వెదురు జుట్టు దువ్వెనలు", hi: "बांस के हेयर ब्रश" }, price: 250, img: "hbrush.jpeg" },
    { id: 49, name: { en: "Silk Dental Floss", te: "సిల్క్ డెంటల్ ఫ్లాస్", hi: "रेशम दंत फ़्लॉस" }, price: 140, img: "dental.jpeg" },
    { id: 50, name: { en: "Toothpaste Tablets", te: "టూత్‌పేస్ట్ టాబ్లెట్లు", hi: "टूथपेस्ट गोलियां" }, price: 220, img: "tablet.jpeg" },
    { id: 51, name: { en: "Bamboo Tongue Scrapers", te: "వెదురు నాలుక బద్దలు", hi: "बांस के टंग क्लीनर" }, price: 80, img: "tounge.jpeg" },
    { id: 52, name: { en: "Neem Wood Spatulas", te: "వేప చెక్క వంట గరిటెలు", hi: "नीम की लकड़ी के चम्मच" }, price: 110, img: "cutt.jpeg" },
    { id: 53, name: { en: "Stainless Steel Tiffin Carriers", te: "స్టీల్ క్యారేజీలు", hi: "स्टेनलेस स्टील टिफिन कैरियर" }, price: 550, img: "box..jpeg" },
    { id: 54, name: { en: "Konjac Sponges", te: "కొంజాక్ స్పాంజ్లు", hi: "कोंजैक स्पंज" }, price: 130, img: "konjac.jpeg" },
    { id: 55, name: { en: "Recycled Cardboard Boxes", te: "రీసైకిల్ చేసిన కార్డ్‌బోర్డ్ పెట్టెలు", hi: "రీసాఇకల్ కార్డ్‌బోర్డ్ బక్సే" }, price: 60, img: "cardboard.png" },
    { id: 56, name: { en: "Mushroom Packaging", te: "మష్రూమ్ ప్యాకేజింగ్", hi: "मशरूम पैकेजिंग" }, price: 90, img: "mush.jpeg" },
    { id: 57, name: { en: "Plant-based Phone Cases", te: "మొక్కల ఆధారిత ఫోన్ కేసులు", hi: "प्लांट-आधारित फोन केस" }, price: 450, img: "phone.jpeg" },
    { id: 58, name: { en: "Wooden Furniture", te: "చెక్క ఫర్నిచర్", hi: "लकड़ी के फर्नीचर" }, price: 3500, img: "furniture.jpeg" },
    { id: 59, name: { en: "Linen Napkins", te: "లినెన్ నాప్‌కిన్లు", hi: "लिनन नैपकिन" }, price: 240, img: "napkin.jpeg" },
    { id: 60, name: { en: "Wool Rugs", te: "ఉన్ని తివాచీలు", hi: "ऊन के कालीन" }, price: 2800, img: "rugs.jpeg" },
    { id: 61, name: { en: "Copper Tongue Cleaners", te: "రాగి నాలుక గీతలు", hi: "तांबे के टंग क्लीनर" }, price: 150, img: "coppert.jpeg" },
    { id: 62, name: { en: "Stainless Steel Laundry Racks", te: "స్టీల్ బట్టల స్టాండ్లు", hi: "स्टेनलेस स्टील कपड़े सुखाने का रैक" }, price: 1200, img: "steela.jpeg" },
    { id: 63, name: { en: "Bamboo Makeup Brushes", te: "వెదురు మేకప్ బ్రష్‌లు", hi: "बांस के मेकअप ब्रश" }, price: 500, img: "makeup.jpeg" },
    { id: 64, name: { en: "Glass Soap Dispensers", te: "గాజు సబ్బు డిస్పెన్సర్లు", hi: "कांच के साबुन डिस्पेंसर" }, price: 220, img: "soapd.jpeg" },
    { id: 65, name: { en: "Reusable Snack Bags", te: "మళ్ళీ వాడదగిన స్నాక్స్ సంచులు", hi: "पुन: प्रयोज्य स्नैक बैग" }, price: 180, img: "foods.jpeg" },
    { id: 66, name: { en: "Natural Fiber Mops", te: "సహజ పీచు తుడిచే కర్రలు", hi: "प्राकृतिक फाइबर मॉप" }, price: 600, img: "mop.jpeg" },
    { id: 67, name: { en: "Wooden Toilet Brushes", te: "చెక్క టాయిలెట్ బ్రష్లు", hi: "लकड़ी के शौचालय ब्रश" }, price: 300, img: "bathbrush.jpeg" },
    { id: 68, name: { en: "Cotton Shower Curtains", te: "కాటన్ షవర్ కర్టెన్లు", hi: "सूती शावर पर्दे" }, price: 750, img: "shower.jpeg" },
    { id: 69, name: { en: "Beeswax Polish", te: "బీస్వాక్స్ పాలిష్", hi: "मधुमक्खी मोम की पॉलिश" }, price: 280, img: "beewax.jpeg" },
    { id: 70, name: { en: "Reed Diffusers", te: "రీడ్ డిఫ్యూజర్లు", hi: "రీడ్ డిఫ్యూజర్" }, price: 450, img: "reedd.jpeg" },
    { id: 71, name: { en: "Bamboo Baskets", te: "వెదురు బుట్టలు", hi: "बांस की टोकरियाँ" }, price: 900, img: "bin.jpeg" },
    { id: 72, name: { en: "Ice Cube Trays", te: "ఐస్ క్యూబ్ ట్రేలు", hi: "बर्फ जमाने की ट्रे" }, price: 320, img: "ice.jpeg" },
    { id: 73, name: { en: "Ceramic Dinnerware", te: "సిరామిక్ డిన్నర్ సెట్లు", hi: "సిరేమిక్ డిన్నర్ సెట్" }, price: 1500, img: "set.jpeg" },
    { id: 74, name: { en: "Spice Racks", te: "మసాలా పెట్టెల స్టాండ్లు", hi: "मसाला रखने का रैक" }, price: 400, img: "stack.jpeg" },
    { id: 75, name: { en: "Measuring Cups", te: "కొలత కప్పులు", hi: "मापने वाले कप" }, price: 280, img: "glass2.jpeg" },
    { id: 76, name: { en: "Bamboo Straws", te: "వెదురు స్ట్రాలు", hi: "बांस के स्ट्रॉ" }, price: 60, img: "bamboos.jpeg" },
    { id: 77, name: { en: "Coconut Shell Bowls", te: "కొబ్బరి చిప్ప గిన్నెలు", hi: "नारियल के कटोरे" }, price: 220, img: "bowll.jpeg" },
    { id: 78, name: { en: "Woven Baskets", te: "అల్లిన బుట్టలు", hi: "बुनी हुई टोकरियाँ" }, price: 500, img: "bin2.jpeg" },
    { id: 79, name: { en: "Metal Buckets", te: "మెటల్ బకెట్లు", hi: "धातु की बाल्टी" }, price: 400, img: "bucket.jpeg" },
    { id: 80, name: { en: "Clay Water Pots", te: "మట్టి నీటి కుండలు", hi: "मिट्टी के घड़े" }, price: 350, img: "pot2.jpeg" },
    { id: 81, name: { en: "Bag", te: "పర్సు సంచులు", hi: "झोला" }, price: 1200, img: "bag7.jpeg" },
    { id: 82, name: { en: "Cotton Towels", te: "కాటన్ తువ్వాళ్లు", hi: "సూతీ తౌలియా" }, price: 600, img: "towel.jpeg" },
    { id: 83, name: { en: "Wooden Hangers", te: "చెక్క బట్టల హ్యాంగర్లు", hi: "लकड़ी के हैंगर" }, price: 300, img: "hanger.jpeg" },
    { id: 84, name: { en: "Window Blinds", te: "కిటికీ బ్లైండ్స్", hi: "खिड़की के पर्दे" }, price: 1800, img: "table.jpeg" },
    { id: 85, name: { en: "Glass Vases", te: "గాజు పూలకుండీలు", hi: "कांच के गुलदस्ते" }, price: 450, img: "glass4.jpeg" },
    { id: 86, name: { en: "Tongue Scrapers", te: "మెటల్ టంగ్ క్లీనర్లు", hi: "స్టీల के टंग क्लीनर" }, price: 120, img: "steelt.jpeg" },
    { id: 87, name: { en: "Paper Straws", te: "కాగితపు స్ట్రాలు", hi: "कागज के स्ट्रॉ" }, price: 30, img: "straww.jpeg" },
    { id: 88, name: { en: "Bamboo Wipes", te: "వెదురు వైప్స్", hi: "बांस के वाइप्स" }, price: 150, img: "wrap4.jpeg" },
    { id: 89, name: { en: "Incense Sticks", te: "అగరుబత్తీలు", hi: "अगरबत्तियां" }, price: 100, img: "strap4.jpeg" },
    { id: 90, name: { en: "Picture Frames", te: "ఫొటో ఫ్రేమ్‌లు", hi: "फोटो फ्रेम" }, price: 320, img: "frame4.jpeg" },
    { id: 91, name: { en: "Agave Scrubbers", te: "అగవే పీచు స్క్రబ్బర్లు", hi: "अगैव स्क्रबर" }, price: 80, img: "clean4.jpeg" },
    { id: 92, name: { en: "Step Stools", te: "చిన్న చెక్క స్టూల్స్", hi: "लकड़ी के छोटे स्टूल" }, price: 600, img: "stool.jpeg" },
    { id: 93, name: { en: "Mixing Bowls", te: "కలిపే గిన్నెలు", hi: "मिक्सिंग कटोरे" }, price: 450, img: "box4.jpeg" },
    { id: 94, name: { en: "Laundry Bags", te: "లాండ్రీ సంచులు", hi: "कपड़े धोने का बैग" }, price: 350, img: "bin3.jpeg" },
    { id: 95, name: { en: "Garden Markers", te: "తోట గుర్తులు", hi: "गार्डन मार्कर" }, price: 120, img: "garden.jpeg" },
    { id: 96, name: { en: "Baby Bottles", te: "గాజు పాల సీసాలు", hi: "कांच की बच्चों की बोतलें" }, price: 380, img: "baby.jpeg" },
    { id: 97, name: { en: "Tire Mats", te: "రీసైకిల్ చేసిన టైర్ల మాట్స్", hi: "टायर के पायदान" }, price: 550, img: "car.jpeg" },
    { id: 98, name: { en: "Bath Mats", te: "బాత్‌రూమ్ మాట్స్", hi: "बाथ मैट" }, price: 700, img: "bathb.jpeg" },
    { id: 99, name: { en: "Laptop Sleeves", te: "ల్యాప్‌టాప్ కవర్లు", hi: "लैपटॉप स्लीव्स" }, price: 450, img: "laptop.jpeg" },
    { id: 100, name: { en: "Mailers", te: "పర్యావరణ అనుకూల కవర్లు", hi: "इको-फ्रेंडली डाक लिफाफे" }, price: 100, img: "mail.jpeg" }
];

// ==========================================
// 4. AUTH & INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('log-email').value;
            const pass = document.getElementById('log-pass').value;
            try {
                let userCredential;
                try {
                    userCredential = await auth.signInWithEmailAndPassword(email, pass);
                } catch (err) {
                    userCredential = await auth.createUserWithEmailAndPassword(email, pass);
                    await db.collection('users').doc(userCredential.user.uid).set({ email, wallet: 0, expectedWallet: 0, totalKg: 0, orders: [] });
                }
                loadUserData(userCredential.user.uid, true);
            } catch (err) { alert(err.message); }
        };
    }
    renderProducts();
    checkUrlForScan();
});

function checkUrlForScan() {
    const urlParams = new URLSearchParams(window.location.search);
    const scanUid = urlParams.get('approve_uid');
    if (scanUid) {
        targetScanUid = scanUid;
        loadOperatorView(scanUid);
    }
}

async function loadOperatorView(uid) {
    showSection('operator-approval-screen');
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            const d = doc.data();
            document.getElementById('op-user-email').innerText = d.email || "Unknown User";
            document.getElementById('op-user-balance').innerText = d.wallet || 0;
            document.getElementById('op-user-exp-balance').innerText = d.expectedWallet || 0;
        } else {
            alert("Scanned User Not Found!");
        }
    } catch (err) {
        console.error("Error loading user for verification:", err);
    }
}

function changeLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) el.innerText = translations[lang][key];
    });
    renderProducts();
}

function setInitialLanguage() {
    const selected = document.getElementById('main-lang-select').value;
    changeLanguage(selected);
    showSection('dashboard');
}

// ==========================================
// 5. CORE DATA & WALLET LOGIC
// ==========================================
async function loadUserData(uid, isLogin = false) {
    const doc = await db.collection('users').doc(uid).get();
    currentUserData = { id: uid, ...doc.data() };
    document.getElementById('total-kg').innerText = currentUserData.totalKg || 0;
    document.getElementById('wallet-balance').innerText = currentUserData.wallet || 0;
    
    const expWalletElem = document.getElementById('expected-wallet-balance');
    if (expWalletElem) {
        expWalletElem.innerText = currentUserData.expectedWallet || 0;
    }
    
    renderOrders(); 
    loadLeaderboard(); 
    updateInterface();
    if(isLogin) showSection('lang-select-screen');
}

function updateReward() {
    const kg = document.getElementById('plastic-weight').value || 0;
    document.getElementById('reward-val').innerText = kg * 20;
}

async function addToExpectedWallet() {
    const kg = parseFloat(document.getElementById('plastic-weight').value) || 0;
    if (kg > 0 && currentUserData) {
        const newExpWallet = (currentUserData.expectedWallet || 0) + (kg * 20);
        await db.collection('users').doc(currentUserData.id).update({ expectedWallet: newExpWallet });
        await loadUserData(currentUserData.id);
        alert(translations[currentLang]['alert-wallet']);
    } else {
        alert("Please enter a valid weight in KGs.");
    }
}

// ==========================================
// 6. OPERATOR QR CODE & APPROVAL SYSTEM
// ==========================================
function showQrModal() {
    if (!currentUserData) return alert("Please log in first!");
    const container = document.getElementById('qrcode-container');
    if (!container) return;
    
    container.innerHTML = ""; // Clear existing QR
    
    const appBaseUrl = window.location.href.split('?')[0];
    const qrUrl = `${appBaseUrl}?approve_uid=${currentUserData.id}`;
    
    if (typeof QRCode !== 'undefined') {
        new QRCode(container, {
            text: qrUrl,
            width: 180,
            height: 180
        });
    } else {
        container.innerHTML = `<p style="color:black;">${qrUrl}</p>`;
    }
    
    document.getElementById('qr-user-email').innerText = currentUserData.email;
    showSection('qr-modal-screen');
}

function updateOpCreditPreview() {
    const w = parseFloat(document.getElementById('op-verified-weight').value) || 0;
    document.getElementById('op-credit-preview').innerText = w * 20;
}

async function approveAndCreditUser() {
    if (!targetScanUid) return alert("No user target selected!");
    const w = parseFloat(document.getElementById('op-verified-weight').value) || 0;
    if (w <= 0) return alert("Please enter a valid measured weight!");

    try {
        const userRef = db.collection('users').doc(targetScanUid);
        const doc = await userRef.get();
        if (!doc.exists) return alert("User document not found!");
        
        const d = doc.data();
        const addedCredit = w * 20;
        const newRealWallet = (d.wallet || 0) + addedCredit;
        const newTotalKg = (d.totalKg || 0) + w;
        const newExpWallet = Math.max(0, (d.expectedWallet || 0) - addedCredit);

        await userRef.update({
            wallet: newRealWallet,
            expectedWallet: newExpWallet,
            totalKg: newTotalKg
        });

        alert(`Successfully approved! Added ₹${addedCredit} to Real Wallet.`);
        location.href = window.location.href.split('?')[0]; // Reset page back to clean view
    } catch (err) {
        console.error(err);
        alert("Approval failed: " + err.message);
    }
}

// ==========================================
// 7. BARCODE DEPOSIT SCANNER & 25% CALCULATION
// ==========================================
function switchBarcodeTab(mode) {
    const camView = document.getElementById('barcode-cam-view');
    const fileView = document.getElementById('barcode-file-view');
    const btnCam = document.getElementById('btn-cam-tab');
    const btnFile = document.getElementById('btn-file-tab');

    if (mode === 'cam') {
        camView.classList.remove('hidden');
        fileView.classList.add('hidden');
        btnCam.style.background = '#27ae60';
        btnFile.style.background = '#333';
        initBarcodeCamScanner();
    } else {
        camView.classList.add('hidden');
        fileView.classList.remove('hidden');
        btnCam.style.background = '#333';
        btnFile.style.background = '#27ae60';
        stopBarcodeScanner();
    }
}

function initBarcodeCamScanner() {
    if (typeof Html5Qrcode === 'undefined') return;
    stopBarcodeScanner(); // Clear previous instance

    html5QrScannerInstance = new Html5Qrcode("reader");
    html5QrScannerInstance.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
            handleScannedBarcode(decodedText);
            stopBarcodeScanner();
        },
        (error) => { /* ignore minor camera errors */ }
    ).catch(err => {
        console.log("Camera access error, falling back to file input: ", err);
    });
}

function stopBarcodeScanner() {
    if (html5QrScannerInstance && html5QrScannerInstance.isScanning) {
        html5QrScannerInstance.stop().then(() => {
            html5QrScannerInstance.clear();
        }).catch(err => console.error(err));
    }
}

function processBarcodeFromFile(input) {
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    
    if (typeof Html5Qrcode !== 'undefined') {
        const html5QrCode = new Html5Qrcode("reader");
        html5QrCode.scanFile(file, true)
            .then(decodedText => {
                handleScannedBarcode(decodedText);
            })
            .catch(err => {
                alert("Could not detect barcode from image file. Please try entering the 13-digit number manually below.");
            });
    }
}

// MANUAL INPUT SUBMIT HANDLER
function processManualBarcode() {
    const inputEl = document.getElementById('manual-barcode-input');
    if (!inputEl) return alert("Input box not found!");

    const inputVal = inputEl.value.trim();
    if (!inputVal || inputVal.length < 8) {
        return alert("Please enter a valid 8 to 13-digit barcode number!");
    }

    // Instant UI Loading Feedback
    const resultCard = document.getElementById('barcode-result-card');
    if (resultCard) {
        resultCard.innerHTML = `<h4 style="color: #27ae60; margin-bottom: 8px;">🔍 Identifying product...</h4>`;
        resultCard.classList.remove('hidden');
    }

    handleScannedBarcode(inputVal);
    inputEl.value = "";
}

async function handleScannedBarcode(barcodeText) {
    console.log("Processing Barcode: ", barcodeText);
    
    let prodName = "PET Plastic Beverage Container";

    try {
        // Query Open Food Facts Global API for Brand/Product Name
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcodeText}.json`);
        const data = await response.json();
        
        if (data.status === 1 && data.product) {
            prodName = data.product.product_name || data.product.brands || "PET Plastic Beverage Container";
        }
    } catch (err) {
        console.log("Barcode lookup fallback triggered.");
    }

    scannedProductReward = 0; // Reset reward state until user inputs MRP

    // Display Result Card with MRP Prompt
    const resultCard = document.getElementById('barcode-result-card');
    resultCard.innerHTML = `
        <h4 style="color: #27ae60; margin-bottom: 8px;">✅ Product Identified!</h4>
        <p style="margin: 6px 0; font-size: 0.95rem;"><strong>Product / Brand:</strong> <span id="res-prod-name">${prodName}</span></p>
        
        <div style="margin: 12px 0;">
            <label style="font-size: 0.85rem; color: #ccc;">Enter Item Price/MRP (₹):</label><br>
            <input type="number" id="input-mrp-val" placeholder="e.g. 135" oninput="calculateCustomDeposit()" style="padding: 8px 12px; border-radius: 6px; border: 1.5px solid #27ae60; width: 140px; margin-top: 5px; font-weight: bold; font-size: 1rem; color: #333; outline: none;">
        </div>

        <p style="margin: 8px 0; font-size: 1.1rem; color: #27ae60;">
            <strong>25% Eco Deposit Reward:</strong> ₹<span id="res-prod-reward">0</span>
        </p>
        
        <button type="button" class="btn-primary" onclick="claimBarcodeReward()" style="margin-top: 12px; width: 100%;">Claim Deposit to Expected Wallet</button>
    `;

    resultCard.classList.remove('hidden');
}

function calculateCustomDeposit() {
    const mrpInput = document.getElementById('input-mrp-val');
    if (!mrpInput) return;
    
    let userMrp = parseFloat(mrpInput.value) || 0;
    
    // Safety cap at ₹2,000 per single item
    if (userMrp > 2000) {
        userMrp = 2000;
        mrpInput.value = 2000;
    }
    
    scannedProductReward = Math.round(userMrp * 0.25);
    
    const rewardSpan = document.getElementById('res-prod-reward');
    if (rewardSpan) {
        rewardSpan.innerText = scannedProductReward;
    }
}

async function claimBarcodeReward() {
    if (!currentUserData) return alert("Please log in first!");
    if (scannedProductReward <= 0) return alert("Please enter a valid price/MRP to calculate reward before claiming.");

    try {
        const newExpWallet = (currentUserData.expectedWallet || 0) + scannedProductReward;
        await db.collection('users').doc(currentUserData.id).update({ expectedWallet: newExpWallet });
        await loadUserData(currentUserData.id);
        
        alert(`🎉 ₹${scannedProductReward} (25% Deposit) added to your Expected Wallet!`);
        document.getElementById('barcode-result-card').classList.add('hidden');
        scannedProductReward = 0;
        showSection('expected-wallet-screen');
    } catch (err) {
        alert("Error claiming deposit: " + err.message);
    }
}

// ==========================================
// 8. LIVE GPS RECYCLING CENTER MAP (LEAFLET.JS)
// ==========================================
function initEcoMap() {
    if (mapInitialized || typeof L === 'undefined') return;

    // Default coordinates: Visakhapatnam, Andhra Pradesh
    let userLat = 17.6868;
    let userLng = 83.2185;

    const centers = [
        { name: "GVMC Smart Eco-Hub - Sector 1", lat: 17.6868, lng: 83.2185, hours: "8 AM - 6 PM" },
        { name: "Visakha Plastic Scrap Aggregator", lat: 17.7231, lng: 83.3012, hours: "9 AM - 8 PM" },
        { name: "Samvruddi Green Resource Yard", lat: 17.7000, lng: 83.2500, hours: "10 AM - 5 PM" },
        { name: "Kurmannapalem Waste Drop-off Point", lat: 17.6500, lng: 83.1800, hours: "7 AM - 7 PM" }
    ];

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
            userLat = pos.coords.latitude;
            userLng = pos.coords.longitude;
            renderMap(userLat, userLng, centers);
        }, () => {
            renderMap(userLat, userLng, centers); // Fallback to default
        });
    } else {
        renderMap(userLat, userLng, centers);
    }
}

function renderMap(lat, lng, centers) {
    if (ecoMapInstance) return;

    ecoMapInstance = L.map('eco-map').setView([lat, lng], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(ecoMapInstance);

    // User Blue Marker
    L.marker([lat, lng]).addTo(ecoMapInstance)
        .bindPopup("<b>📍 Your Current Location</b>")
        .openPopup();

    // Drop Center Markers
    centers.forEach(c => {
        const popupText = `
            <div style="font-size:13px; color:#fff;">
                <b style="color:#27ae60;">${c.name}</b><br>
                🕒 Hours: ${c.hours}<br>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}" target="_blank" style="color:#3498db; font-weight:bold;">🚗 Get Directions</a>
            </div>
        `;
        L.marker([c.lat, c.lng]).addTo(ecoMapInstance).bindPopup(popupText);
    });

    mapInitialized = true;
}

// ==========================================
// 9. CART & PURCHASE (USES REAL WALLET)
// ==========================================
function processToPickup() {
    let total = userCart.reduce((a, b) => a + (b.price * b.qty), 0);
    if(total === 0) return alert(translations[currentLang]['alert-empty']);
    if(currentUserData.wallet < total) return alert(translations[currentLang]['alert-credits']);
    showSection('pickup');
}

async function confirmPurchaseAndPickup() {
    const date = document.getElementById('pickup-date').value;
    const addr = document.getElementById('pickup-address').value;
    if(!date || !addr) return alert("Fill all details!");

    const total = userCart.reduce((a,b) => a + (b.price * b.qty), 0);
    if(currentUserData.wallet < total) return alert(translations[currentLang]['alert-credits']);
    
    const orderImages = userCart.map(i => i.img);
    const newOrder = { 
        orderId: "ORD-" + Date.now(), 
        date: date, 
        total: total, 
        images: orderImages 
    };
    
    const existingOrders = currentUserData.orders || [];
    existingOrders.push(newOrder);

    try {
        await db.collection('users').doc(currentUserData.id).update({ 
            wallet: currentUserData.wallet - total,
            orders: existingOrders 
        });

        userCart = []; 
        updateInterface(); 
        await loadUserData(currentUserData.id);
        
        alert(translations[currentLang]['alert-order']);
        document.getElementById('feedback-comments').value = ""; 
        setRating(0); 
        showSection('feedback-screen'); 
        
    } catch (error) {
        console.error("Order processing failed:", error);
        alert("Something went wrong. Please try again.");
    }
}

// ==========================================
// 10. RATING & FEEDBACK ENGINE
// ==========================================
function setRating(score) {
    selectedRatingScore = score;
    const stars = document.querySelectorAll('.feedback-star');
    stars.forEach(star => {
        const starValue = parseInt(star.getAttribute('data-value'));
        if (starValue <= score) star.classList.add('active');
        else star.classList.remove('active');
    });
}

async function submitFeedback() {
    if (selectedRatingScore === 0) return alert("Please select a star rating!");
    const textualComments = document.getElementById('feedback-comments').value.trim();

    try {
        await db.collection('feedback').add({
            userId: currentUserData.id,
            userEmail: currentUserData.email,
            rating: selectedRatingScore,
            comment: textualComments,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert(translations[currentLang]['alert-feedback-success']);
        showSection('orders'); 
    } catch (error) {
        showSection('dashboard');
    }
}

// ==========================================
// 11. RENDERING & UI FUNCTIONS
// ==========================================
function renderOrders() {
    const list = currentUserData.orders || [];
    document.getElementById('orders-list').innerHTML = list.length ? list.map(o => `
        <div class="order-box">
            <strong>Date:</strong> ${o.date} | <strong>Total:</strong> ₹${o.total}
            <div class="order-img-strip">${o.images.map(img => `<img src="${img}">`).join('')}</div>
        </div>`).join('') : "<p>No orders yet.</p>";
}

function renderProducts(list = productList) {
    const el = document.getElementById('product-list');
    if(el) {
        el.innerHTML = list.map(p => {
            const productName = p.name[currentLang] || p.name['en'] || p.name;
            return `
            <div class="product-item">
                <img src="${p.img}">
                <h3>${productName}</h3>
                <p>₹${p.price}</p>
                <button class="btn-primary" onclick="addToCart(${p.id})">${(translations[currentLang] && translations[currentLang]['add-to-cart']) || 'Add to Cart'}</button>
            </div>`;
        }).join('');
    }
}

function filterProducts() {
    const term = document.getElementById('product-search').value.toLowerCase();
    renderProducts(productList.filter(p => {
        const nameEn = (p.name['en'] || "").toLowerCase();
        const nameTe = (p.name['te'] || "").toLowerCase();
        const nameHi = (p.name['hi'] || "").toLowerCase();
        return nameEn.includes(term) || nameTe.includes(term) || nameHi.includes(term);
    }));
}

function addToCart(id) {
    const p = productList.find(x => x.id === id);
    const item = userCart.find(i => i.id === id);
    if (item) item.qty++; else userCart.push({ ...p, qty: 1 });
    updateInterface();
}

function changeQty(id, delta) {
    const item = userCart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) userCart = userCart.filter(i => i.id !== id);
    }
    updateInterface();
}

function updateInterface() {
    const badge = document.getElementById('cart-badge');
    if (badge) badge.innerText = userCart.reduce((a, b) => a + b.qty, 0);
    let total = 0;
    const cartEl = document.getElementById('cart-items');
    if(cartEl) {
        cartEl.innerHTML = userCart.map(i => {
            total += (i.price * i.qty);
            const itemName = i.name[currentLang] || i.name['en'] || i.name;
            return `<div class="cart-row">
                <span>${itemName}</span>
                <div><button class="qty-btn" onclick="changeQty(${i.id}, -1)">-</button> ${i.qty} <button class="qty-btn" onclick="changeQty(${i.id}, 1)">+</button></div>
                <span>₹${i.price * i.qty}</span>
            </div>`;
        }).join('');
        const totalPr = document.getElementById('cart-total-price');
        if (totalPr) totalPr.innerText = total;
    }
}

async function loadLeaderboard() {
    const snap = await db.collection('users').orderBy('totalKg', 'desc').limit(5).get();
    let html = ""; let rank = 1;
    snap.forEach(doc => {
        const d = doc.data();
        html += `<div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #444;">
            <span>#${rank} ${d.email.split('@')[0]}</span><span>${d.totalKg || 0} KG</span>
        </div>`; rank++;
    });
    document.getElementById('leaderboard-list').innerHTML = html;
}

function showSection(id) {
    // Stop barcode camera scanner if navigating away
    if (id !== 'barcode-screen') {
        stopBarcodeScanner();
    }

    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    const targetedSec = document.getElementById(id);
    if (targetedSec) targetedSec.classList.remove('hidden');
    
    // Auto-trigger Scanner or Map when entering their respective tabs
    if (id === 'barcode-screen') {
        switchBarcodeTab('cam');
    } else if (id === 'map-screen') {
        setTimeout(initEcoMap, 300);
    }

    const sb = document.getElementById('sidebar');
    if(sb && sb.classList.contains('active')) toggleSidebar();
}

function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    if (sb) {
        sb.classList.toggle('active');
        const overlay = document.getElementById('overlay');
        if (overlay) overlay.style.display = sb.classList.contains('active') ? 'block' : 'none';
    }
}

function logout() { location.reload(); }