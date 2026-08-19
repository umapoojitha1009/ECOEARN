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
let appliedDiscountPercent = 0;
let unlockedCouponCode = null;

// Scanner & Map State Variables
let html5QrScannerInstance = null;
let operatorQrScannerInstance = null;
let ecoMapInstance = null;
let opRouteMapInstance = null;
let mapInitialized = false;
let isOperatorAuthenticated = false;

// ==========================================
// 2. TRANSLATIONS DICTIONARY
// ==========================================
const translations = {
    'en': { 
        'intro-desc': 'Recycle plastic and shop 100+ sustainable products.', 
        'get-started': 'Get Started', 
        'login-title': 'Login / Register', 
        'login-btn': 'Enter Dashboard', 
        'choose-lang': 'Choose Your Language', 
        'continue-btn': 'Continue', 
        'nav-dash': 'Scrap Calculator', 
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
        'nav-growth': 'My Impact & Certificate', 
        'plastic-recycled': 'Plastic Recycled', 
        'nav-wallet': 'Real Wallet', 
        'nav-exp-wallet': 'Expected Wallet',
        'nav-qr': 'My Collector QR',
        'nav-barcode': 'Barcode (10% Discount)', 
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
        'nav-dash': 'స్క్రాప్ కాలిక్యులేటర్', 
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
        'nav-growth': 'నా ప్రభావం & సర్టిఫికేట్', 
        'plastic-recycled': 'రీసైకిల్ చేసిన ప్లాస్టిక్', 
        'nav-wallet': 'అసలు వాలెట్', 
        'nav-exp-wallet': 'అంచనా వాలెట్',
        'nav-qr': 'నా కలెక్టర్ QR',
        'nav-barcode': 'బార్‌కోడ్ (10% తగ్గింపు)',
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
        'nav-dash': 'स्क्रैप कैलकुलेटर', 
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
        'nav-growth': 'मेरा प्रभाव और प्रमाण पत्र', 
        'plastic-recycled': 'पुनर्चक्रित प्लास्टिक', 
        'nav-wallet': 'असली वॉलेट', 
        'nav-exp-wallet': 'अपेक्षित वॉलेट',
        'nav-qr': 'मेरा कलेक्टर QR',
        'nav-barcode': 'बारकोड (10% छूट)',
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
// 3. PRODUCT LIST (100 ITEMS)
// ==========================================
const productList = [
    { id: 1, name: { en: "Bamboo Toothbrushes", te: "వెదురు టూత్ బ్రష్‌లు", hi: "बांस के टूथब्रश" }, price: 60, img: "brush.png" },
    { id: 2, name: { en: "Glass Jars", te: "గాజు సీసాలు", hi: "कांच के जार" }, price: 120, img: "jar.jpeg" },
    { id: 3, name: { en: "Stainless Steel Straws", te: "స్టీల్ స్ట్రాలు", hi: "స్టెయిన్‌లెస్ స్టీల్ స్ట్రా" }, price: 80, img: "straw.png" },
    { id: 4, name: { en: "Beeswax Wraps", te: "తేనెటీగ మైనపు రేపర్లు", hi: "मोम के रैप्स" }, price: 250, img: "wax.jpeg" },
    { id: 5, name: { en: "Cotton Bags", te: "పత్తి సంచులు", hi: "सूती थैले" }, price: 100, img: "cloth.png" },
    { id: 6, name: { en: "Jute Shopping Bags", te: "జనపనార సంచులు", hi: "जूట్ के थैले" }, price: 150, img: "jute.png" },
    { id: 7, name: { en: "Bamboo Cutlery", te: "వెదురు స్పూన్లు", hi: "बांस के चम्मच और कांटे" }, price: 200, img: "spoon.png" },
    { id: 8, name: { en: "Stainless Steel Lunch Boxes", te: "స్టీల్ లంచ్ బాక్సులు", hi: "స్టెయిన్‌లెస్ స్టీల్ టిఫిన్" }, price: 450, img: "box..jpeg" },
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
    { id: 24, name: { en: "Cast Iron Cookware", te: "ఇనుప వంట పాత్రలు", hi: "కాస్ట్ ఐరన్ కడాహీ-తవా" }, price: 1800, img: "cookware.jpeg" },
    { id: 25, name: { en: "Ceramic Mugs", te: "సిరామిక్ కప్పులు", hi: "సిరేమిక్ మగ్స్" }, price: 240, img: "mugs.jpeg" },
    { id: 26, name: { en: "Bamboo Cutting Boards", te: "వెదురు చాపింగ్ బోర్డులు", hi: "बांस के चॉपिंग बोर्ड" }, price: 400, img: "cutveg.jpeg" },
    { id: 27, name: { en: "Cornstarch Trash Bags", te: "మొక్కజొన్న పిండి చెత్త సంచులు", hi: "कॉर्नस्टार्च कचरा बैग" }, price: 130, img: "corn.jpeg" },
    { id: 28, name: { en: "Paper Packing Tape", te: "కాగితం ప్యాకింగ్ టేప్", hi: "कागज पैकिंग टेप" }, price: 90, img: "tape.jpeg" },
    { id: 29, name: { en: "Hemp Twine", te: "జనపనార దారం", hi: "భాంగ్ కీ సుతలీ" }, price: 75, img: "thread.jpeg" },
    { id: 30, name: { en: "Terracotta Pots", te: "మట్టి కుండలు", hi: "मिट्टी के गमले" }, price: 200, img: "pots.jpeg" },
    { id: 31, name: { en: "Recycled Paper Notebooks", te: "రీసైకిల్ చేసిన కాగితం నోట్‌బుక్‌లు", hi: "रीसाइकल पेपर नोटबुक" }, price: 120, img: "book.jpeg" },
    { id: 32, name: { en: "Wooden Pencils", te: "చెక్క పెన్సిళ్లు", hi: "लकड़ी की पेंसिल" }, price: 40, img: "pencil.jpeg" },
    { id: 33, name: { en: "Refillable Fountain Pens", te: "రీఫిల్ చేయగల ఫౌంటెన్ పెన్నులు", hi: "రీఫిలేబల్ ఫౌంటెన్ పెన్" }, price: 500, img: "repen.jpeg" },
    { id: 34, name: { en: "Stainless Steel Tea Infusers", te: "స్టీల్ టీ వడపోత", hi: "స్టెయిన్‌లెస్ స్టీల్ చాయ్ ఇన్ఫ్యూజర్" }, price: 180, img: "tea.jpeg" },
    { id: 35, name: { en: "Cloth Diapers", te: "బట్ట డైపర్లు", hi: "कपड़े के डायपर" }, price: 350, img: "diaper.jpeg" },
    { id: 36, name: { en: "Menstrual Cups", te: "మెన్‌స్ట్రువల్ కప్పులు", hi: "మాసిక్ ధర్మ కప్" }, price: 600, img: "menstrual.jpeg" },
    { id: 37, name: { en: "Bamboo Flooring", te: "వెదురు ఫ్లోరింగ్", hi: "బాన్స్ కా ఫర్ష్" }, price: 2500, img: "floor.jpeg" },
    { id: 38, name: { en: "Cork Coasters", te: "కార్క్ కోస్టర్లు", hi: "కార్క్ కోస్టర్" }, price: 100, img: "coasters.jpeg" },
    { id: 39, name: { en: "Glass Food Containers", te: "గాజు ఆహార డబ్బాలు", hi: "కాంచ్ కే భోజన్ కంటైనర్" }, price: 380, img: "container.jpeg" },
    { id: 40, name: { en: "Sisal Dish Brushes", te: "సిసల్ గిన్నెల బ్రష్లు", hi: "సిసల్ డిష్ బ్రష్" }, price: 130, img: "dish.jpeg" },
    { id: 41, name: { en: "Natural Rubber Toys", te: "సహజ రబ్బరు బొమ్మలు", hi: "ప్రాకృతిక్ రబర్ కే ఖిలౌనే" }, price: 450, img: "toys.jpeg" },
    { id: 42, name: { en: "Wooden Building Blocks", te: "చెక్క బిల్డింగ్ బ్లాక్స్", hi: "లకడీ కే బ్లాక్స్" }, price: 800, img: "block.jpeg" },
    { id: 43, name: { en: "Cotton Bread Bags", te: "కాటన్ రొట్టె సంచులు", hi: "సూతీ బ్రెడ్ బ్యాగ్" }, price: 110, img: "bread.jpeg" },
    { id: 44, name: { en: "Canvas Backpacks", te: "క్యాన్వాస్ బ్యాక్‌ప్యాక్‌లు", hi: "క్యాన్వాస్ బ్యాగ్" }, price: 1200, img: "canva.png" },
    { id: 45, name: { en: "Metal Paperclips", te: "మెటల్ పేపర్‌క్లిప్‌లు", hi: "ధాతు కీ పేపర్ క్లిప్" }, price: 50, img: "clips.jpeg" },
    { id: 46, name: { en: "Compostable Parchment Paper", te: "కంపోస్టబుల్ పార్చ్మెంట్ పేపర్", hi: "కంపొస్టేబల్ చర్మపత్ర కాగజ్" }, price: 160, img: "wrap.jpeg" },
    { id: 47, name: { en: "Soy Wax Candles", te: "సోయా మైనపు కొవ్వొత్తులు", hi: "సోయా మోమ్ కీ మోంబత్తియాం" }, price: 320, img: "candel.jpeg" },
    { id: 48, name: { en: "Bamboo Hairbrushes", te: "వెదురు జుట్టు దువ్వెనలు", hi: "బాన్స్ కే హెయిర్ బ్రష్" }, price: 250, img: "hbrush.jpeg" },
    { id: 49, name: { en: "Silk Dental Floss", te: "సిల్క్ డెంటల్ ఫ్లాస్", hi: "రేషమ్ దంత్ ఫ్లాస్" }, price: 140, img: "dental.jpeg" },
    { id: 50, name: { en: "Toothpaste Tablets", te: "టూత్‌పేస్ట్ టాబ్లెట్లు", hi: "టూత్‌పేస్ట్ గోలియాం" }, price: 220, img: "tablet.jpeg" },
    { id: 51, name: { en: "Bamboo Tongue Scrapers", te: "వెదురు నాలుక బద్దలు", hi: "బాన్స్ కే టంగ్ క్లీనర్" }, price: 80, img: "tounge.jpeg" },
    { id: 52, name: { en: "Neem Wood Spatulas", te: "వేప చెక్క వంట గరిటెలు", hi: "నీమ్ కీ లకడీ కే చమ్మచ్" }, price: 110, img: "cutt.jpeg" },
    { id: 53, name: { en: "Stainless Steel Tiffin Carriers", te: "స్టీల్ క్యారేజీలు", hi: "స్టెయిన్‌లెస్ స్టీల్ టిఫిన్ కేరియర్" }, price: 550, img: "box..jpeg" },
    { id: 54, name: { en: "Konjac Sponges", te: "కొంజాక్ స్పాంజ్లు", hi: "కోంజక్ స్పంజ్" }, price: 130, img: "konjac.jpeg" },
    { id: 55, name: { en: "Recycled Cardboard Boxes", te: "రీసైకిల్ చేసిన కార్డ్‌బోర్డ్ పెట్టెలు", hi: "రీసైకిల్ కార్డ్‌బోర్డ్ బక్సే" }, price: 60, img: "cardboard.png" },
    { id: 56, name: { en: "Mushroom Packaging", te: "మష్రూమ్ ప్యాకేజింగ్", hi: "మష్రూమ్ ప్యాకేజింగ్" }, price: 90, img: "mush.jpeg" },
    { id: 57, name: { en: "Plant-based Phone Cases", te: "మొక్కల ఆధారిత ఫోన్ కేసులు", hi: "ప్లాంట్-ఆధారిత ఫోన్ కేస్" }, price: 450, img: "phone.jpeg" },
    { id: 58, name: { en: "Wooden Furniture", te: "చెక్క ఫర్నిచర్", hi: "లకడీ కే ఫర్నీచర్" }, price: 3500, img: "furniture.jpeg" },
    { id: 59, name: { en: "Linen Napkins", te: "లినెన్ నాప్‌కిన్లు", hi: "లినెన్ నేప్‌కిన్" }, price: 240, img: "napkin.jpeg" },
    { id: 60, name: { en: "Wool Rugs", te: "ఉన్ని తివాచీలు", hi: "ఊన్ కే కాలీన్" }, price: 2800, img: "rugs.jpeg" },
    { id: 61, name: { en: "Copper Tongue Cleaners", te: "రాగి నాలుక గీతలు", hi: "తాంబే కే టంగ్ క్లీనర్" }, price: 150, img: "coppert.jpeg" },
    { id: 62, name: { en: "Stainless Steel Laundry Racks", te: "స్టీల్ బట్టల స్టాండ్లు", hi: "స్టెయిన్‌లెస్ స్టీల్ కపడే సుఖానే కా రేక్" }, price: 1200, img: "steela.jpeg" },
    { id: 63, name: { en: "Bamboo Makeup Brushes", te: "వెదురు మేకప్ బ్రష్‌లు", hi: "బాన్స్ కే మేకప్ బ్రష్" }, price: 500, img: "makeup.jpeg" },
    { id: 64, name: { en: "Glass Soap Dispensers", te: "గాజు సబ్బు డిస్పెన్సర్లు", hi: "కాంచ్ కే సాబున్ డిస్పెన్సర్" }, price: 220, img: "soapd.jpeg" },
    { id: 65, name: { en: "Reusable Snack Bags", te: "మళ్ళీ వాడదగిన స్నాక్స్ సంచులు", hi: "పునర్-ప్రయోజనీయ స్నాక్ బ్యాగ్" }, price: 180, img: "foods.jpeg" },
    { id: 66, name: { en: "Natural Fiber Mops", te: "సహజ పీచు తుడిచే కర్రలు", hi: "ప్రాకృతిక్ ఫైబర్ మాప్" }, price: 600, img: "mop.jpeg" },
    { id: 67, name: { en: "Wooden Toilet Brushes", te: "చెక్క టాయిలెట్ బ్రష్లు", hi: "లకడీ కే శౌచాలయ బ్రష్" }, price: 300, img: "bathbrush.jpeg" },
    { id: 68, name: { en: "Cotton Shower Curtains", te: "కాటన్ షవర్ కర్టెన్లు", hi: "సూతీ షవర్ పర్దే" }, price: 750, img: "shower.jpeg" },
    { id: 69, name: { en: "Beeswax Polish", te: "బీస్వాక్స్ పాలిష్", hi: "మధుమక్ఖీ మోమ్ కీ పాలిష్" }, price: 280, img: "beewax.jpeg" },
    { id: 70, name: { en: "Reed Diffusers", te: "రీడ్ డిఫ్యూజర్లు", hi: "రీడ్ డిఫ్యూజర్" }, price: 450, img: "reedd.jpeg" },
    { id: 71, name: { en: "Bamboo Baskets", te: "వెదురు బుట్టలు", hi: "బాన్స్ కీ టోకరియాం" }, price: 900, img: "bin.jpeg" },
    { id: 72, name: { en: "Ice Cube Trays", te: "ఐస్ క్యూబ్ ట్రేలు", hi: "బర్ఫ్ జమానే కీ ట్రే" }, price: 320, img: "ice.jpeg" },
    { id: 73, name: { en: "Ceramic Dinnerware", te: "సిరామిక్ డిన్నర్ సెట్లు", hi: "సిరేమిక్ డిన్నర్ సెట్" }, price: 1500, img: "set.jpeg" },
    { id: 74, name: { en: "Spice Racks", te: "మసాలా పెట్టెల స్టాండ్లు", hi: "మసాలా రఖ్నే కా రేక్" }, price: 400, img: "stack.jpeg" },
    { id: 75, name: { en: "Measuring Cups", te: "కొలత కప్పులు", hi: "మాప్నే వాలే కప్" }, price: 280, img: "glass2.jpeg" },
    { id: 76, name: { en: "Bamboo Straws", te: "వెదురు స్ట్రాలు", hi: "బాన్స్ కే స్ట్రా" }, price: 60, img: "bamboos.jpeg" },
    { id: 77, name: { en: "Coconut Shell Bowls", te: "కొబ్బరి చిప్ప గిన్నెలు", hi: "నారియల్ కే కటోరే" }, price: 220, img: "bowll.jpeg" },
    { id: 78, name: { en: "Woven Baskets", te: "అల్లిన బుట్టలు", hi: "బునీ హుయీ టోకరియాం" }, price: 500, img: "bin2.jpeg" },
    { id: 79, name: { en: "Metal Buckets", te: "మెటల్ బకెట్లు", hi: "ధాతు కీ బాల్టీ" }, price: 400, img: "bucket.jpeg" },
    { id: 80, name: { en: "Clay Water Pots", te: "మట్టి నీటి కుండలు", hi: "మిట్టీ కే ఘడే" }, price: 350, img: "pot2.jpeg" },
    { id: 81, name: { en: "Bag", te: "పర్సు సంచులు", hi: "झोला" }, price: 1200, img: "bag7.jpeg" },
    { id: 82, name: { en: "Cotton Towels", te: "కాటన్ తువ్వాళ్లు", hi: "సూతీ తౌలియా" }, price: 600, img: "towel.jpeg" },
    { id: 83, name: { en: "Wooden Hangers", te: "చెక్క బట్టల హ్యాంగర్లు", hi: "లకడీ కే హ్యాంగర్" }, price: 300, img: "hanger.jpeg" },
    { id: 84, name: { en: "Window Blinds", te: "కిటికీ బ్లైండ్స్", hi: "ఖిడకీ కే పర్దే" }, price: 1800, img: "table.jpeg" },
    { id: 85, name: { en: "Glass Vases", te: "గాజు పూలకుండీలు", hi: "కాంచ్ కే గుల్దస్తే" }, price: 450, img: "glass4.jpeg" },
    { id: 86, name: { en: "Tongue Scrapers", te: "మెటల్ టంగ్ క్లీనర్లు", hi: "స్టీల్ కే టంగ్ క్లీనర్" }, price: 120, img: "steelt.jpeg" },
    { id: 87, name: { en: "Paper Straws", te: "కాగితపు స్ట్రాలు", hi: "కాగజ్ కే స్ట్రా" }, price: 30, img: "straww.jpeg" },
    { id: 88, name: { en: "Bamboo Wipes", te: "వెదురు వైప్స్", hi: "బాన్స్ కే వైప్స్" }, price: 150, img: "wrap4.jpeg" },
    { id: 89, name: { en: "Incense Sticks", te: "అగరుబత్తీలు", hi: "అగర్‌బత్తియాం" }, price: 100, img: "strap4.jpeg" },
    { id: 90, name: { en: "Picture Frames", te: "ఫొటో ఫ్రేమ్‌లు", hi: "ఫోటో ఫ్రేమ్" }, price: 320, img: "frame4.jpeg" },
    { id: 91, name: { en: "Agave Scrubbers", te: "అగవే పీచు స్క్రబ్బర్లు", hi: "అగైవ్ స్క్రబర్" }, price: 80, img: "clean4.jpeg" },
    { id: 92, name: { en: "Step Stools", te: "చిన్న చెక్క స్టూల్స్", hi: "లకడీ కే ఛోటే స్టూల్" }, price: 600, img: "stool.jpeg" },
    { id: 93, name: { en: "Mixing Bowls", te: "కలిపే గిన్నెలు", hi: "మిక్సింగ్ కటోరే" }, price: 450, img: "box4.jpeg" },
    { id: 94, name: { en: "Laundry Bags", te: "లాండ్రీ సంచులు", hi: "కపడే ధోనే కా బ్యాగ్" }, price: 350, img: "bin3.jpeg" },
    { id: 95, name: { en: "Garden Markers", te: "తోట గుర్తులు", hi: "గార్డెన్ మార్కర్" }, price: 120, img: "garden.jpeg" },
    { id: 96, name: { en: "Baby Bottles", te: "గాజు పాల సీసాలు", hi: "కాంచ్ కీ బచ్చోం కీ బోతలేం" }, price: 380, img: "baby.jpeg" },
    { id: 97, name: { en: "Tire Mats", te: "రీసైకిల్ చేసిన టైర్ల మాట్స్", hi: "టైర్ కే పాయదాన్" }, price: 550, img: "car.jpeg" },
    { id: 98, name: { en: "Bath Mats", te: "బాత్‌రూమ్ మాట్స్", hi: "బాత్ మ్యాట్" }, price: 700, img: "bathb.jpeg" },
    { id: 99, name: { en: "Laptop Sleeves", te: "ల్యాప్‌టాప్ కవర్లు", hi: "ల్యాప్‌టాప్ స్లీవ్స్" }, price: 450, img: "laptop.jpeg" },
    { id: 100, name: { en: "Mailers", te: "పర్యావరణ అనుకూల కవర్లు", hi: "ఎకో-ఫ్రెండ్లీ డాక్ లిఫాఫే" }, price: 100, img: "mail.jpeg" }
];

// ==========================================
// 4. AUTH, SESSION & INITIALIZATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(async (user) => {
        if (isOperatorAuthenticated) return;

        if (user) {
            await loadUserData(user.uid, false);
            const savedSection = localStorage.getItem('ecoearn_active_section') || 'dashboard';
            showSection(savedSection);
        } else {
            currentUserData = null;
            showSection('intro-screen');
        }
    });

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
                    await db.collection('users').doc(userCredential.user.uid).set({ 
                        email, 
                        wallet: 0, 
                        expectedWallet: 0, 
                        totalKg: 0, 
                        isPremium: false,
                        orders: [] 
                    });
                }
                await loadUserData(userCredential.user.uid, true);
            } catch (err) { alert(err.message); }
        };
    }

    renderProducts();
});

// ==========================================
// 5. OPERATOR PORTAL & PASSWORD GATE (EcoEarn@2026)
// ==========================================
function promptOperatorLogin() {
    if (isOperatorAuthenticated) {
        openOperatorDashboard();
    } else {
        showSection('operator-login-screen');
    }
}

function verifyOperatorAccess() {
    const input = document.getElementById('operator-pass-input');
    if (!input) return;

    const enteredKey = input.value.trim();
    if (enteredKey === "EcoEarn@2026") {
        isOperatorAuthenticated = true;
        input.value = "";
        openOperatorDashboard();
    } else {
        alert("❌ Invalid Operator Credentials. Access Denied.");
    }
}

function exitOperatorMode() {
    isOperatorAuthenticated = false;
    stopOperatorQrScanner();
    showSection('intro-screen');
}

async function openOperatorDashboard() {
    showSection('operator-dashboard-screen');
    switchOperatorTab('schedule');
    await loadOperatorPickupSchedule();
}

function switchOperatorTab(tab) {
    const tabSched = document.getElementById('op-tab-schedule');
    const tabMap = document.getElementById('op-tab-map');
    const tabScan = document.getElementById('op-tab-scan');
    const btnSched = document.getElementById('btn-op-schedule-tab');
    const btnMap = document.getElementById('btn-op-map-tab');
    const btnScan = document.getElementById('btn-op-scan-tab');

    tabSched.classList.add('hidden');
    tabMap.classList.add('hidden');
    tabScan.classList.add('hidden');
    btnSched.style.background = '#334155';
    btnMap.style.background = '#334155';
    btnScan.style.background = '#334155';

    if (tab === 'schedule') {
        tabSched.classList.remove('hidden');
        btnSched.style.background = '#27ae60';
        stopOperatorQrScanner();
    } else if (tab === 'map') {
        tabMap.classList.remove('hidden');
        btnMap.style.background = '#38bdf8';
        stopOperatorQrScanner();
        setTimeout(initOperatorRouteMap, 300);
    } else if (tab === 'scan') {
        tabScan.classList.remove('hidden');
        btnScan.style.background = '#27ae60';
        initOperatorQrCameraScanner();
    }
}

async function loadOperatorPickupSchedule() {
    const container = document.getElementById('op-pickups-list');
    if (!container) return;

    try {
        const snap = await db.collection('users').get();
        let pickupStops = [];

        snap.forEach(doc => {
            const d = doc.data();
            if (d.orders && d.orders.length > 0) {
                d.orders.forEach(o => {
                    pickupStops.push({
                        uid: doc.id,
                        email: d.email,
                        date: o.date,
                        expWallet: d.expectedWallet || 0,
                        orderId: o.orderId
                    });
                });
            }
        });

        if (pickupStops.length === 0) {
            // Default active routes for display demo
            pickupStops = [
                { email: "user.mvp@ecoearn.org", date: "Today", locality: "MVP Colony Sector 3", expKg: 12 },
                { email: "resident.gajuwaka@ecoearn.org", date: "Today", locality: "Gajuwaka Main Road", expKg: 25 },
                { email: "green.kurmannapalem@ecoearn.org", date: "Tomorrow", locality: "Kurmannapalem Junction", expKg: 18 }
            ];
        }

        container.innerHTML = pickupStops.map((s, idx) => `
            <div class="op-stop-card">
                <div>
                    <strong style="color:#f1c40f;">Stop #${idx + 1}: ${s.locality || s.email}</strong><br>
                    <small style="color:#cbd5e1;">Scheduled: ${s.date} | Est. Weight: ~${s.expKg || 15} KG</small>
                </div>
                <button class="btn-primary" onclick="switchOperatorTab('scan')" style="padding:6px 14px; font-size:0.8rem;">
                    <i class="fas fa-qrcode"></i> Audit
                </button>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}

function initOperatorRouteMap() {
    if (opRouteMapInstance) return;

    // Center on local district hub
    const centerLat = 17.6868;
    const centerLng = 83.2185;

    opRouteMapInstance = L.map('op-route-map').setView([centerLat, centerLng], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(opRouteMapInstance);

    const stops = [
        { name: "Stop 1: MVP Colony Hub", lat: 17.7400, lng: 83.3300 },
        { name: "Stop 2: Siripuram Circle", lat: 17.7220, lng: 83.3150 },
        { name: "Stop 3: Gajuwaka Cluster", lat: 17.6900, lng: 83.2100 },
        { name: "Unload: Kapuluppada MRF Yard", lat: 17.8200, lng: 83.3700 }
    ];

    const latlngs = stops.map(s => [s.lat, s.lng]);
    L.polyline(latlngs, { color: '#38bdf8', weight: 4, dashArray: '6, 8' }).addTo(opRouteMapInstance);

    stops.forEach((s, i) => {
        L.marker([s.lat, s.lng]).addTo(opRouteMapInstance)
            .bindPopup(`<b>${s.name}</b><br><a href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}" target="_blank" style="color:#38bdf8;">🚗 Turn-by-Turn GPS</a>`);
    });
}

function initOperatorQrCameraScanner() {
    if (typeof Html5Qrcode === 'undefined') return;
    stopOperatorQrScanner();

    operatorQrScannerInstance = new Html5Qrcode("op-qr-camera-view");
    operatorQrScannerInstance.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
            handleOperatorDecodedQR(decodedText);
            stopOperatorQrScanner();
        },
        (error) => { /* frame noise */ }
    ).catch(err => {
        console.warn("Operator camera scanner fallback:", err);
    });
}

function stopOperatorQrScanner() {
    if (operatorQrScannerInstance && operatorQrScannerInstance.isScanning) {
        operatorQrScannerInstance.stop().then(() => {
            operatorQrScannerInstance.clear();
        }).catch(err => console.error(err));
    }
}

async function handleOperatorDecodedQR(decodedText) {
    try {
        let scannedUid = decodedText;
        if (decodedText.includes("approve_uid=")) {
            scannedUid = decodedText.split("approve_uid=")[1];
        }

        targetScanUid = scannedUid;
        const doc = await db.collection('users').doc(scannedUid).get();
        if (doc.exists) {
            const d = doc.data();
            document.getElementById('op-verified-user-email').innerText = d.email || "Citizen";
            document.getElementById('op-verified-exp-balance').innerText = d.expectedWallet || 0;
            document.getElementById('op-active-verification-box').classList.remove('hidden');
        } else {
            alert("Scanned citizen ID not found!");
        }
    } catch (err) {
        alert("Error processing QR: " + err.message);
    }
}

function calculateOpCredit() {
    const kg = parseFloat(document.getElementById('op-scale-kg-input').value) || 0;
    document.getElementById('op-scale-credit-val').innerText = kg * 20;
}

async function submitOperatorApproval() {
    if (!targetScanUid) return alert("No citizen selected!");
    const kg = parseFloat(document.getElementById('op-scale-kg-input').value) || 0;
    if (kg <= 0) return alert("Please enter measured scale weight in KGs!");

    try {
        const userRef = db.collection('users').doc(targetScanUid);
        const doc = await userRef.get();
        if (!doc.exists) return alert("User not found!");

        const d = doc.data();
        const credit = kg * 20;
        const newRealWallet = (d.wallet || 0) + credit;
        const newTotalKg = (d.totalKg || 0) + kg;
        const newExpWallet = Math.max(0, (d.expectedWallet || 0) - credit);

        await userRef.update({
            wallet: newRealWallet,
            expectedWallet: newExpWallet,
            totalKg: newTotalKg
        });

        alert(`✅ Verified successfully! ₹${credit} transferred to citizen's Real Wallet.`);
        document.getElementById('op-active-verification-box').classList.add('hidden');
        document.getElementById('op-scale-kg-input').value = "";
        targetScanUid = null;
        switchOperatorTab('schedule');
    } catch (err) {
        alert("Approval failed: " + err.message);
    }
}

// ==========================================
// 6. CORE USER DATA (CO2 ONLY)
// ==========================================
async function loadUserData(uid, isLogin = false) {
    const doc = await db.collection('users').doc(uid).get();
    currentUserData = { id: uid, ...doc.data() };
    
    const totalKgVal = currentUserData.totalKg || 0;
    document.getElementById('total-kg').innerText = totalKgVal;
    document.getElementById('wallet-balance').innerText = currentUserData.wallet || 0;
    
    const co2Saved = Math.round(totalKgVal * 2.5);
    const co2Elem = document.getElementById('co2-saved');
    if (co2Elem) co2Elem.innerText = co2Saved;

    const expWalletElem = document.getElementById('expected-wallet-balance');
    if (expWalletElem) {
        expWalletElem.innerText = currentUserData.expectedWallet || 0;
    }
    
    renderOrders(); 
    loadLeaderboard(); 
    updateInterface();
    updatePremiumUI();
    if (isLogin) showSection('lang-select-screen');
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

function showQrModal() {
    if (!currentUserData) return alert("Please log in first!");
    const container = document.getElementById('qrcode-container');
    if (!container) return;
    
    container.innerHTML = "";
    
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

// ==========================================
// 7. PREMIUM BARCODE 10% DISCOUNT SCANNER
// ==========================================
function updatePremiumUI() {
    const gate = document.getElementById('barcode-premium-gate');
    const scannerUI = document.getElementById('barcode-scanner-unlocked');
    if (!gate || !scannerUI) return;

    if (currentUserData && currentUserData.isPremium) {
        gate.classList.add('hidden');
        scannerUI.classList.remove('hidden');
    } else {
        gate.classList.remove('hidden');
        scannerUI.classList.add('hidden');
    }
}

async function activatePremiumMembership(planType) {
    if (!currentUserData) {
        alert("Please log in first to activate Premium!");
        return showSection('login-screen');
    }

    try {
        await db.collection('users').doc(currentUserData.id).update({ 
            isPremium: true,
            premiumPlan: planType || 'monthly',
            premiumSince: new Date().toISOString()
        });
        currentUserData.isPremium = true;
        updatePremiumUI();
        alert("🎉 ECOEARN Premium Active! 10% discount scanner unlocked.");
    } catch (err) {
        alert("Error activating membership: " + err.message);
    }
}

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
    stopBarcodeScanner();

    html5QrScannerInstance = new Html5Qrcode("reader");
    html5QrScannerInstance.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
            handleScannedBarcode(decodedText);
            stopBarcodeScanner();
        },
        (error) => { /* frame noise */ }
    ).catch(err => {
        console.warn("Camera fallback:", err);
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
            .then(decodedText => handleScannedBarcode(decodedText))
            .catch(err => alert("Could not detect barcode. Enter manually."));
    }
}

function processManualBarcode() {
    const inputEl = document.getElementById('manual-barcode-input');
    if (!inputEl) return;
    const inputVal = inputEl.value.trim();
    if (!inputVal || inputVal.length < 8) return alert("Enter valid 8-13 digit barcode!");

    handleScannedBarcode(inputVal);
    inputEl.value = "";
}

async function handleScannedBarcode(barcodeText) {
    let prodName = "PET Beverage Container";

    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcodeText}.json`);
        const data = await response.json();
        if (data.status === 1 && data.product) {
            prodName = data.product.product_name || data.product.brands || "PET Beverage Container";
        }
    } catch (err) {}

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    unlockedCouponCode = `ECO-SAVE-10-${randomSuffix}`;

    const resultCard = document.getElementById('barcode-result-card');
    resultCard.innerHTML = `
        <h4 style="color: #2ecc71; margin-bottom: 8px;">✅ Verified: ${prodName}</h4>
        <div style="background: rgba(46, 204, 113, 0.15); border: 1.5px dashed #2ecc71; padding: 12px; border-radius: 8px; margin: 10px 0; text-align: center;">
            <span style="font-size: 0.85rem; color: #cbd5e1;">Your 10% Discount Code:</span><br>
            <strong style="font-size: 1.3rem; color: #f1c40f;">${unlockedCouponCode}</strong>
        </div>
        <button type="button" class="btn-primary" onclick="copyAndApplyCoupon('${unlockedCouponCode}')" style="width: 100%;">
            <i class="fas fa-tag"></i> Apply & Shop Now
        </button>
    `;
    resultCard.classList.remove('hidden');
}

function copyAndApplyCoupon(code) {
    appliedDiscountPercent = 10;
    const couponInput = document.getElementById('cart-coupon-input');
    if (couponInput) couponInput.value = code;
    alert(`🎉 Coupon "${code}" copied! 10% discount applied to your cart.`);
    showSection('products');
}

function applyCouponCode() {
    const input = document.getElementById('cart-coupon-input');
    const msg = document.getElementById('coupon-applied-msg');
    if (!input) return;

    const val = input.value.trim().toUpperCase();
    if (val.includes("ECO-SAVE-10") || val === "ECO10") {
        appliedDiscountPercent = 10;
        if (msg) {
            msg.innerText = "✅ 10% Barcode Discount Applied!";
            msg.classList.remove('hidden');
        }
        updateInterface();
    } else {
        alert("Invalid coupon code.");
    }
}

// ==========================================
// 8. WORLDWIDE GPS RECYCLING LOCATOR
// ==========================================
function initEcoMap() {
    if (mapInitialized || typeof L === 'undefined') return;

    let userLat = 17.6868;
    let userLng = 83.2185;

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                userLat = pos.coords.latitude;
                userLng = pos.coords.longitude;
                renderDynamicMap(userLat, userLng);
            },
            () => renderDynamicMap(userLat, userLng),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    } else {
        renderDynamicMap(userLat, userLng);
    }
}

async function renderDynamicMap(lat, lng) {
    if (ecoMapInstance) return;

    ecoMapInstance = L.map('eco-map').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(ecoMapInstance);

    const userIcon = L.divIcon({
        className: 'user-map-pin',
        html: '<div style="background:#007bff; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 0 10px rgba(0,123,255,0.8);"></div>',
        iconSize: [16, 16]
    });

    L.marker([lat, lng], { icon: userIcon }).addTo(ecoMapInstance)
        .bindPopup("<b style='color:#007bff;'>📍 Your Location</b>")
        .openPopup();

    mapInitialized = true;
    await fetchWorldwideRecyclingCenters(lat, lng);
}

async function fetchWorldwideRecyclingCenters(lat, lng) {
    const radius = 8000;
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="recycling"](around:${radius},${lat},${lng});node["amenity"="waste_transfer_station"](around:${radius},${lat},${lng});way["amenity"="recycling"](around:${radius},${lat},${lng}););out center;`;

    try {
        const response = await fetch(overpassUrl);
        const data = await response.json();

        if (data.elements && data.elements.length > 0) {
            data.elements.forEach(elem => {
                const cLat = elem.lat || (elem.center && elem.center.lat);
                const cLng = elem.lon || (elem.center && elem.center.lon);
                const name = (elem.tags && (elem.tags.name || elem.tags["operator"])) || "Authorized Recycling Drop Hub";

                if (cLat && cLng) {
                    L.marker([cLat, cLng]).addTo(ecoMapInstance).bindPopup(`
                        <div style="font-size:13px; color:#fff;">
                            <b style="color:#2ecc71;">♻️ ${name}</b><br>
                            <a href="https://www.google.com/maps/dir/?api=1&destination=${cLat},${cLng}" target="_blank" style="color:#38bdf8; font-weight:bold;">🚗 Get Directions</a>
                        </div>
                    `);
                }
            });
        }
    } catch (err) {}
}

// ==========================================
// 9. CLEAN NAME & DIRECT PDF DOWNLOAD
// ==========================================
function getCleanUserName() {
    if (!currentUserData || !currentUserData.email) return "VALUED STEWARD";
    
    // Strip all numbers and symbols from email, leaving only words
    let rawUsername = currentUserData.email.split('@')[0];
    let lettersOnly = rawUsername.replace(/[0-9]/g, '').replace(/[._-]/g, ' ').trim();
    
    if (!lettersOnly) return "VALUED STEWARD";
    return lettersOnly.toUpperCase();
}

function openCertificatePreview() {
    if (!currentUserData) {
        alert("Please log in to view your certificate!");
        return showSection('login-screen');
    }

    const totalKg = currentUserData.totalKg || 0;
    const co2Avoided = Math.round(totalKg * 2.5);
    const certDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const certId = `ECO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const cleanName = getCleanUserName();

    document.getElementById('cert-id').innerText = certId;
    document.getElementById('cert-date').innerText = certDate;
    document.getElementById('cert-user-name').innerText = cleanName;
    document.getElementById('cert-weight').innerText = `${totalKg} KG`;
    document.getElementById('cert-co2').innerText = `${co2Avoided} KG`;

    const modal = document.getElementById('certificate-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    if (modal) modal.classList.add('hidden');
}

function downloadCertificatePDF() {
    const certElement = document.getElementById('certificate-print-area');
    if (!certElement) return;

    const cleanName = getCleanUserName().replace(/\s+/g, '_');
    const filename = `EcoEarn_Certificate_${cleanName}.pdf`;

    const options = {
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    // Direct download trigger
    html2pdf().set(options).from(certElement).save();
}

// ==========================================
// 10. CART & PICKUP
// ==========================================
function processToPickup() {
    if (!currentUserData) {
        alert("Please log in to checkout!");
        return showSection('login-screen');
    }
    let subtotal = userCart.reduce((a, b) => a + (b.price * b.qty), 0);
    if (subtotal === 0) return alert(translations[currentLang]['alert-empty']);

    let finalPrice = subtotal;
    if (appliedDiscountPercent > 0) {
        finalPrice = Math.round(subtotal * (1 - (appliedDiscountPercent / 100)));
    }

    if (currentUserData.wallet < finalPrice) return alert(translations[currentLang]['alert-credits']);
    showSection('pickup');
}

async function confirmPurchaseAndPickup() {
    const date = document.getElementById('pickup-date').value;
    const addr = document.getElementById('pickup-address').value;
    const landmark = document.getElementById('pickup-landmark').value;
    if (!date || !addr) return alert("Fill all details!");

    let subtotal = userCart.reduce((a, b) => a + (b.price * b.qty), 0);
    let finalTotal = subtotal;
    if (appliedDiscountPercent > 0) {
        finalTotal = Math.round(subtotal * (1 - (appliedDiscountPercent / 100)));
    }

    if (currentUserData.wallet < finalTotal) return alert(translations[currentLang]['alert-credits']);
    
    const newOrder = { 
        orderId: "ORD-" + Date.now(), 
        date: date, 
        address: addr,
        locality: landmark || "General Ward",
        total: finalTotal, 
        discountApplied: appliedDiscountPercent,
        images: userCart.map(i => i.img) 
    };
    
    const existingOrders = currentUserData.orders || [];
    existingOrders.push(newOrder);

    try {
        await db.collection('users').doc(currentUserData.id).update({ 
            wallet: currentUserData.wallet - finalTotal,
            orders: existingOrders 
        });

        userCart = []; 
        appliedDiscountPercent = 0;
        updateInterface(); 
        await loadUserData(currentUserData.id);
        
        alert(translations[currentLang]['alert-order']);
        showSection('feedback-screen'); 
    } catch (error) {
        alert("Order failed. Try again.");
    }
}

// ==========================================
// 11. FEEDBACK & RATINGS
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
    if (!currentUserData) return showSection('login-screen');
    if (selectedRatingScore === 0) return alert("Please select star rating!");
    const comment = document.getElementById('feedback-comments').value.trim();

    try {
        await db.collection('feedback').add({
            userId: currentUserData.id,
            userEmail: currentUserData.email,
            rating: selectedRatingScore,
            comment: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert(translations[currentLang]['alert-feedback-success']);
        showSection('orders'); 
    } catch (error) {
        showSection('dashboard');
    }
}

// ==========================================
// 12. RENDERING & UI HELPERS
// ==========================================
function renderOrders() {
    const list = (currentUserData && currentUserData.orders) || [];
    document.getElementById('orders-list').innerHTML = list.length ? list.map(o => `
        <div class="order-box">
            <strong>Date:</strong> ${o.date} | <strong>Total:</strong> ₹${o.total} ${o.discountApplied ? `(10% Off)` : ''}
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
    if (!currentUserData) {
        alert("Please login to shop!");
        return showSection('login-screen');
    }
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
    
    let subtotal = 0;
    const cartEl = document.getElementById('cart-items');
    if (cartEl) {
        cartEl.innerHTML = userCart.map(i => {
            subtotal += (i.price * i.qty);
            const itemName = i.name[currentLang] || i.name['en'] || i.name;
            return `<div class="cart-row">
                <span>${itemName}</span>
                <div><button class="qty-btn" onclick="changeQty(${i.id}, -1)">-</button> ${i.qty} <button class="qty-btn" onclick="changeQty(${i.id}, 1)">+</button></div>
                <span>₹${i.price * i.qty}</span>
            </div>`;
        }).join('');

        let finalTotal = subtotal;
        if (appliedDiscountPercent > 0) {
            finalTotal = Math.round(subtotal * (1 - (appliedDiscountPercent / 100)));
        }

        const totalPr = document.getElementById('cart-total-price');
        if (totalPr) {
            totalPr.innerHTML = appliedDiscountPercent > 0 
                ? `<span style="text-decoration: line-through; color: #888; font-size: 1.1rem;">₹${subtotal}</span> ₹${finalTotal} <span style="color:#2ecc71; font-size:0.9rem;">(10% Off)</span>` 
                : finalTotal;
        }
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
    if (id !== 'barcode-screen') stopBarcodeScanner();
    if (id !== 'operator-dashboard-screen') stopOperatorQrScanner();

    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    const targetedSec = document.getElementById(id);
    if (targetedSec) targetedSec.classList.remove('hidden');
    
    if (currentUserData && !isOperatorAuthenticated) {
        localStorage.setItem('ecoearn_active_section', id);
    }

    if (id === 'barcode-screen') {
        updatePremiumUI();
        if (currentUserData && currentUserData.isPremium) switchBarcodeTab('cam');
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

function logout() {
    localStorage.removeItem('ecoearn_active_section');
    auth.signOut().then(() => location.reload()).catch(() => location.reload());
}