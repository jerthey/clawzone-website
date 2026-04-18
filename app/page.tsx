'use client';

import { useState, useEffect } from 'react';
import { Users, Gift, Flame, X, Globe, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXtfYELyQUd2AbcXWPHYmZUu0jEWKPpSVn2sv60qPACYH-FfW_L9CwyiqL7qNxHXK1/exec';

// === 最新店內照片（已置中、清晰） ===
const storePhotos = [
  "https://i.imgur.com/L99NReM.jpg",
  "https://i.imgur.com/XaNBQhG.jpg",
  "https://i.imgur.com/LN0mZ2Z.jpg",
  "https://i.imgur.com/cGYkTcB.jpg",
  "https://i.imgur.com/0Lw8x9q.jpg"
];

// Workshop 照片（保留你之前的）
const candlePhotos = [
  "https://i.imgur.com/k5PQd1H.jpg",
  "https://i.imgur.com/iwDJIvw.jpg",
  "https://i.imgur.com/s1CBy0l.jpg",
  "https://i.imgur.com/GX71y0h.jpg",
  "https://i.imgur.com/JFhMPkn.jpg",
  "https://i.imgur.com/DS9zVYn.jpg",
  "https://i.imgur.com/djYMmZs.jpg",
  "https://i.imgur.com/vOHeVTy.jpg",
  "https://i.imgur.com/ywhIbup.jpg"
];

const brandBannerUrl = 'https://i.imgur.com/OLkYf0k.png';

const translations = {
  zh: {
    title: "CLAWZONE",
    hero1: "Unlimited Token Play Party",
    hero2: "Private Party Room",
    hero3: "Candle Making 手工課",
    bookNow: "立即預約",
    selectMode: "選擇你的活動模式",
    unlimited: "Unlimited Token Play Party",
    private: "Private Party Room",
    candle: "Candle Making 手工課",
    unlimitedDesc: "全店包場 • 無限爪機",
    privateDesc: "獨立房間 • 最多15人",
    candleDesc: "2-3人即可開課 • 最多10人",
    unlimitedDetail: "整間店都給你！無限爪機 + Sanrio 玩具區，適合 10~25 人大型派對。",
    privateDetail: "專屬私人房間超棒！最多15人，可用贈送 token 或優惠價買更多。",
    candleDetail: "浪漫手工蠟燭體驗～ 2-3人就能開課，最多10人。",
    selectDate: "選擇派對日期",
    green: "綠色可點擊 • 灰色為公休日",
    book: "現在預約",
    later: "稍後再選",
    people: "人數",
    peopleRange: "人數範圍",
    confirm: "確認預約並支付 $200 定金",
    cancel: "取消",
    hostName: "Host 名字",
    phone: "電話號碼",
    email: "Email（會寄發票）",
    photos: "Photos",
    videos: "Videos",
    successAlert: "🎉 預約成功！\n日期：{date} {time}\n模式：{mode}\n人數：{people} 人\n我們將寄 $200 CAD 定金發票到 {email}",
    buyTokens: "Buy Tokens",
    tokensTitle: "普通買幣價格",
    trustTitle: "為什麼家長放心選擇我們",
    reviewLabel: "Google Reviews",
    basedOn: "依據",
    parentVoices: "家長評價",
    policyTitle: "退款 / 改期政策",
    policy1: "活動前 72 小時以上：可免費改期一次",
    policy2: "活動前 24-72 小時：可改期，酌收手續費",
    policy3: "活動前 24 小時內：定金不退，可轉一次檔期",
    callNow: "立即來電",
    instagramNow: "Instagram",
    tiktokNow: "TikTok"
  },
  en: {
    title: "CLAWZONE",
    hero1: "Unlimited Token Play Party",
    hero2: "Private Party Room",
    hero3: "Candle Making Workshop",
    bookNow: "Book Now",
    selectMode: "Choose Your Activity Mode",
    unlimited: "Unlimited Token Play Party",
    private: "Private Party Room",
    candle: "Candle Making Workshop",
    unlimitedDesc: "Whole store rental • Unlimited claw machines",
    privateDesc: "Private room • Up to 15 people",
    candleDesc: "Open with 2-3 people • Max 10 people",
    unlimitedDetail: "The whole store is yours! Unlimited claw machines + Sanrio toy zone.",
    privateDetail: "Exclusive private room! Up to 15 people, can buy more tokens.",
    candleDetail: "Romantic candle making experience~ Open with 2-3 people, max 10 people.",
    selectDate: "Select Party Date",
    green: "Green = Clickable • Gray = Closed",
    book: "Book Now",
    later: "Choose Later",
    people: "People",
    peopleRange: "People Range",
    confirm: "Confirm Booking & Pay $200 Deposit",
    cancel: "Cancel",
    hostName: "Host Name",
    phone: "Phone Number",
    email: "Email (Invoice will be sent)",
    photos: "Photos",
    videos: "Videos",
    successAlert: "🎉 Booking Successful!\nDate: {date} {time}\nMode: {mode}\nPeople: {people}\nWe will send $200 CAD deposit invoice to {email}",
    buyTokens: "Buy Tokens",
    tokensTitle: "Regular Token Prices",
    trustTitle: "Why Parents Trust Us",
    reviewLabel: "Google Reviews",
    basedOn: "Based on",
    parentVoices: "What Parents Say",
    policyTitle: "Refund / Reschedule Policy",
    policy1: "72+ hours before event: one free reschedule",
    policy2: "24-72 hours before event: reschedule with admin fee",
    policy3: "Within 24 hours: deposit non-refundable, one date transfer",
    callNow: "Call Now",
    instagramNow: "Instagram",
    tiktokNow: "TikTok"
  }
};

// ── FAQ Data & Components ──────────────────────────────────
const faqData = [
  { id: 1, icon: '👶',
    q_en: 'What is the minimum age to enter?', q_zh: '幾歲以上才能入場？',
    a_en: 'All ages are welcome! Children under 12 must be accompanied by an adult at all times.',
    a_zh: '所有年齡都歡迎！12 歲以下的小朋友需由成人全程陪同。' },
  { id: 2, icon: '🪙',
    q_en: 'Can I get a refund on unused tokens?', q_zh: '代幣用不完可以退款嗎？',
    a_en: 'Tokens are non-refundable once purchased. Leftover tokens can be saved onto your card for next visit.',
    a_zh: '代幣一旦購買後不提供現金退款。剩餘代幣可存回卡片，下次來店繼續使用。' },
  { id: 3, icon: '🔄',
    q_en: 'How does the Trade-in for Points system work?', q_zh: 'Trade-in for Points 積分怎麼換？',
    a_en: 'Win a prize and trade it in before you leave:\n• Pink/Blue machines — 1 Point per plush or keychain\n• Red machines or Jumbo plush — 2 Points\n\nRedeem Points for big prizes: plushies, IP ceramic cups, blind boxes, umbrellas (2–40 Points).\n\n⚠️ Must trade in before leaving the store.\n❌ Not eligible: lucky machine / blocks machine prizes.',
    a_zh: '抓到娃娃後，離開前可以 Trade-in 換 Points：\n• 粉色機/藍色機 — 1 Point\n• 紅色機或巨無霸娃娃 — 2 Points\n\n積 Points 換大娃娃、IP 陶瓷杯、盲盒、雨傘等（2～40 Points）。\n\n⚠️ 必須在離開前完成。\n❌ 不參與：Lucky Machine 及 Blocks 機台獎品。' },
  { id: 4, icon: '🧸',
    q_en: 'Can I swap a prize for a different one in the same machine?', q_zh: '可以把抓到的娃娃換成同台機的其他娃娃嗎？',
    a_en: "Yes! Let our staff know right away. Swaps only within the same machine, before leaving.",
    a_zh: '可以！馬上告訴店員，僅限同台機器內互換，且必須在離開前提出。' },
  { id: 5, icon: '🥤',
    q_en: 'Can I bring my own food and drinks?', q_zh: '可以帶自己的食物和飲料進來嗎？',
    a_en: "Please avoid bringing food/drinks into the arcade area. Party bookings have dedicated tables for food. 🙏",
    a_zh: '請盡量不要在機台區域飲食。Party 包場有專屬桌子可放食物飲料。🙏' },
  { id: 6, icon: '🐾',
    q_en: 'Are pets allowed inside?', q_zh: '可以帶寵物進來嗎？',
    a_en: "Leashed, well-trained pets are welcome! Please keep your pet on a leash at all times. 🐾",
    a_zh: '歡迎攜帶訓練好的寵物！請全程鏈好寵物，感謝配合！🐾' },
  { id: 7, icon: '🎉',
    q_en: 'How far in advance should I book a Party?', q_zh: 'Party 包場需要提前多久預約？',
    a_en: "Book as early as possible — slots fill up a month in advance. Secure your spot with a $200 CAD deposit.",
    a_zh: '請盡早預約！時段通常提前一個月全滿，支付 $200 CAD 定金即可確認。' },
  { id: 8, icon: '🅿️',
    q_en: 'Is there parking available?', q_zh: '附近有停車場嗎？',
    a_en: 'Yes! Parking is available near 4680 Hastings St, Burnaby.',
    a_zh: '有！我們位於 4680 Hastings St, Burnaby，附近有停車位。' },
];

function FAQItem({ item, isOpen, onToggle, language }: {
  item: (typeof faqData)[0]; isOpen: boolean; onToggle: () => void; language: 'zh' | 'en';
}) {
  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? 'border-pink-300 bg-pink-50/60 shadow-md' : 'border-gray-200 bg-white hover:border-pink-200 hover:shadow-sm'}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={isOpen}>
        <div className="flex items-center gap-3">
          <span className="text-2xl select-none">{item.icon}</span>
          <span className="font-bold text-gray-900 text-base leading-snug">{language === 'zh' ? item.q_zh : item.q_en}</span>
        </div>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? 'bg-pink-500 text-white rotate-45' : 'bg-gray-100 text-gray-500'}`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </span>
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-5 pl-[4.25rem]">
          <p className="text-gray-600 text-sm leading-7 whitespace-pre-line">{language === 'zh' ? item.a_zh : item.a_en}</p>
        </div>
      </div>
    </div>
  );
}

function FAQSection({ language }: { language: 'zh' | 'en' }) {
  const [openId, setOpenId] = useState<number | null>(null);
  return (
    <div className="max-w-3xl mx-auto px-6 pb-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-pink-600 mb-3">{language === 'zh' ? '常見問題' : 'FAQ'}</h2>
        <p className="text-gray-500 text-base">{language === 'zh' ? '還有問題？歡迎來電或 Instagram 私訊！' : 'Still have questions? Call or DM us on Instagram!'}</p>
      </div>
      <div className="flex flex-col gap-3">
        {faqData.map((item) => (
          <FAQItem key={item.id} item={item} isOpen={openId === item.id} onToggle={() => setOpenId((p) => (p === item.id ? null : item.id))} language={language} />
        ))}
      </div>
      <div className="mt-10 text-center bg-gradient-to-r from-pink-50 to-violet-50 rounded-3xl p-8 border border-pink-100">
        <p className="text-gray-700 font-semibold text-lg mb-2">{language === 'zh' ? '🎪 找不到你的答案？' : "🎪 Didn't find your answer?"}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <a href="tel:+16048122529" className="kawaii-btn inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:opacity-90 transition-all">
            📞 {language === 'zh' ? '立即來電' : 'Call Us'}
          </a>
          <a href="https://instagram.com/clawzone.arcade" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:opacity-90 transition-all">
            📸 Instagram DM
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Clawzone() {
  const [language, setLanguage] = useState<'zh' | 'en'>('en');
  const [showBeta, setShowBeta] = useState(true);
  const t = translations[language];

  const [heroIndex, setHeroIndex] = useState(0);
  const [infoSlide, setInfoSlide] = useState(0);
  const heroTexts = [t.hero1, t.hero2, t.hero3];

  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [people, setPeople] = useState(10);
  const [extraPlayers, setExtraPlayers] = useState(0);
  const [isBirthdayCelebration, setIsBirthdayCelebration] = useState(false);
  const [birthdayGender, setBirthdayGender] = useState('');
  const [birthdayName, setBirthdayName] = useState('');
  const [hostName, setHostName] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [email, setEmail] = useState('');
  const [time, setTime] = useState('10:00 - 12:00');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingId, setBookingId] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedTermsAt, setAgreedTermsAt] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [detailMode, setDetailMode] = useState<any>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>(['10:00 - 12:00']);
  const [bigPhoto, setBigPhoto] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [showWeekHoursMobile, setShowWeekHoursMobile] = useState(false);
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const modes = [
    { id: 'unlimited', name: t.unlimited, max: 24, min: 10, desc: t.unlimitedDesc, detail: t.unlimitedDetail, icon: Gift, color: 'bg-pink-500', photos: storePhotos },
    { id: 'private', name: t.private, max: 15, min: 1, desc: t.privateDesc, detail: t.privateDetail, icon: Users, color: 'bg-purple-500', photos: storePhotos },
    { id: 'candle', name: t.candle, max: 10, min: 2, desc: t.candleDesc, detail: t.candleDetail, icon: Flame, color: 'bg-orange-500', photos: candlePhotos }
  ];

  const bcHolidays2026 = ['2026-01-01','2026-02-16','2026-04-03','2026-05-18','2026-07-01','2026-08-03','2026-09-07','2026-09-30','2026-10-12','2026-11-11','2026-12-25'];

  const weekdayNames = language === 'zh'
    ? ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getHoursForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const day = date.getDay();
    const isHoliday = bcHolidays2026.includes(dateStr);

    if (isHoliday) return { label: '12:00 PM - 6:00 PM', closed: false, open: 12 * 60, close: 18 * 60 };
    if (day === 1) return { label: language === 'zh' ? '休息（普通週一）' : 'Closed (Regular Monday)', closed: true, open: null, close: null };
    if (day >= 2 && day <= 4) return { label: '3:00 PM - 8:00 PM', closed: false, open: 15 * 60, close: 20 * 60 };
    if (day === 5) return { label: '3:00 PM - 9:00 PM', closed: false, open: 15 * 60, close: 21 * 60 };
    if (day === 6) return { label: '12:00 PM - 9:00 PM', closed: false, open: 12 * 60, close: 21 * 60 };
    return { label: '12:00 PM - 6:00 PM', closed: false, open: 12 * 60, close: 18 * 60 };
  };

  const today = now;
  const todayHours = today
    ? getHoursForDate(today)
    : { label: '--', closed: true, open: null as number | null, close: null as number | null };

  const weekHours = Array.from({ length: 7 }).map((_, dayIndex) => {
    if (!today) {
      return { name: weekdayNames[dayIndex], label: '--', closed: true, isToday: false };
    }

    const referenceDate = new Date(today);
    const diff = dayIndex - today.getDay();
    referenceDate.setDate(today.getDate() + diff);
    return {
      name: weekdayNames[dayIndex],
      ...getHoursForDate(referenceDate),
      isToday: dayIndex === today.getDay()
    };
  });

  const nowMinutes = today ? today.getHours() * 60 + today.getMinutes() : 0;
  const isOpenNow = !todayHours.closed && todayHours.open !== null && todayHours.close !== null
    ? nowMinutes >= todayHours.open && nowMinutes < todayHours.close
    : false;

  const googleRating = 4.8;
  const googleReviewCount = 186;
  const instagramLink = 'https://instagram.com/clawzone.arcade';
  const tiktokLink = 'https://www.tiktok.com/@clawzone.arcade';

  const testimonials = [
    language === 'zh'
      ? '「孩子們玩到不想回家，店員超有耐心！」— Burnaby 家長'
      : '“Kids had a blast and staff were super patient!” — Burnaby Parent',
    language === 'zh'
      ? '「包場流程很順，生日會完全不用操心。」— Vancouver 家長'
      : '“Private party booking was smooth and stress-free.” — Vancouver Parent',
    language === 'zh'
      ? '「環境乾淨、拍照好看，會再回訪。」— Coquitlam 家長'
      : '“Clean, photo-friendly, and we’ll come back again.” — Coquitlam Parent'
  ];

  const tradeInTitle = language === 'zh' ? 'Trade-in for Points 規則' : 'Trade-in for Points Rules';
  const tradeInRules = language === 'zh'
    ? [
        '粉色機（簡單）與藍色機（普通）：娃娃 / Keychain 可兌換 1 Point',
        '紅色機（困難）：IP 娃娃可兌換 2 Points',
        '巨無霸娃娃：可兌換 2 Points'
      ]
    : [
        'Pink (Easy) & Blue (Normal): Plush / Keychain = 1 Point',
        'Red (Hard): IP Plush = 2 Points',
        'Jumbo Plush: 2 Points'
      ];

  const notEligibleRules = language === 'zh'
    ? [
        '紙巾、濕紙巾 Lucky Machine 獎勵不可換點',
        'Blocks 機台夾出的獎品不可換點'
      ]
    : [
        'Tissue / wet-wipe lucky machine rewards are not eligible',
        'Prizes from blocks machines are not eligible'
      ];

  const redeemExamples = language === 'zh'
    ? '可兌換品項範圍：2～40 Points（大娃娃、IP 陶瓷杯、餐具、雨傘、盲盒等）'
    : 'Redeem range: 2–40 Points (large plush, IP ceramic cups, tableware, umbrellas, blind boxes, etc.)';

  const pokemonEventImage = 'https://i.imgur.com/4J74Nfnh.jpg';
  const monthlyEventTitle = language === 'zh' ? '本月活動' : 'Monthly Event';
  const popularRedeemTitle = language === 'zh' ? '熱門可兌換商品' : 'Popular Redeem Items';
  const newIpTitle = language === 'zh' ? '新上架 IP' : 'New IP Arrivals';

  const partyTermsTitle = language === 'zh' ? 'Private Party 條款（下單前請詳閱）' : 'Private Party Terms (Please read before booking)';
  const viewTermsText = language === 'zh' ? '查看派對條款與細節' : 'View Party Terms & Details';

  useEffect(() => {
    const heroTimer = setInterval(() => setHeroIndex(i => (i + 1) % 3), 3000);
    const photoTimer = setInterval(() => setCurrentPhoto(p => (p + 1) % storePhotos.length), 3500);
    return () => { clearInterval(heroTimer); clearInterval(photoTimer); };
  }, []);

  useEffect(() => {
    const sliderTimer = setInterval(() => setInfoSlide((s) => (s + 1) % 2), 35000);
    return () => clearInterval(sliderTimer);
  }, []);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selectedMode) return;
    if (selectedMode === 'unlimited') {
      const allowed = [10, 15, 20, 21, 22, 23, 24];
      if (!allowed.includes(people)) {
        setPeople(10);
        setExtraPlayers(0);
      }
      return;
    }

    const mode = modes.find((m) => m.id === selectedMode);
    if (mode && people < mode.min) setPeople(mode.min);
    setExtraPlayers(0);
  }, [selectedMode]);

  const formatPhoneDisplay = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 10);
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0,3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0,3)}) ${numbers.slice(3,6)}-${numbers.slice(6)}`;
  };

  const formatDateLocal = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getAvailableTimes = (dateStr: string): string[] => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const weekday = date.getDay();
    const isHoliday = bcHolidays2026.includes(dateStr);

    if (isHoliday) return ['10:00 - 12:00'];
    if (weekday === 1) return [];
    if (weekday === 6) return ['10:00 - 12:00'];
    if (weekday === 0) return ['10:00 - 12:00', '13:00 - 15:00', '18:00 - 20:00'];
    return ['10:00 - 12:00', '13:00 - 15:00'];
  };

  const openBookingModal = (dateStr: string) => {
    const times = getAvailableTimes(dateStr);
    if (times.length === 0) {
      alert(language === 'zh' ? '😔 這天是普通週一，店內公休，無法預約哦～' : '😔 This is a regular Monday, store is closed.');
      return;
    }

    const isSameDate = selectedDate === dateStr;
    setSelectedDate(dateStr);
    setAvailableTimes(times);

    if (!isSameDate) {
      setTime(times[0]);
      setPeople(10);
      setExtraPlayers(0);
      setIsBirthdayCelebration(false);
      setBirthdayGender('');
      setBirthdayName('');
      setRawPhone('');
      setEmail('');
      setAgreedTerms(false);
      setAgreedTermsAt(null);
      setError('');
    }

    setIsModalOpen(true);
  };

  const openDetailModal = (mode: any) => {
    setDetailMode(mode);
    setIsDetailModalOpen(true);
    setSelectedMode(mode.id);
  };

  const scrollToCalendar = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNowBook = () => {
    setIsDetailModalOpen(false);
    setTimeout(scrollToCalendar, 300);
  };

  const checkPeople = () => {
    if (!selectedMode) return false;
    const mode = modes.find(m => m.id === selectedMode)!;

    if (selectedMode === 'unlimited') {
      const allowed = [10, 15, 20, 21, 22, 23, 24];
      if (!allowed.includes(people)) {
        setError(language === 'zh' ? 'Unlimited Token Play Party 人數只能選 10 / 15 / 20（可加 1-4 位）' : 'Unlimited Token Play Party allows 10 / 15 / 20 (+1 to +4 extra players).');
        return false;
      }
    }

    if (people < mode.min) { setError(`最少需要 ${mode.min} 人`); return false; }
    if (people > mode.max) { setError(`最多只能 ${mode.max} 人`); return false; }
    setError('');
    return true;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPeople() || !selectedMode) {
      setError('請選擇活動模式');
      return;
    }
    if (!agreedTerms) {
      setError(language === 'zh' ? '請先勾選同意派對條款' : 'Please agree to party terms before booking');
      return;
    }
    if (isBirthdayCelebration && (!birthdayGender || !birthdayName.trim())) {
      setError(language === 'zh' ? '若為慶生請填寫生日主角性別與名字' : 'Please provide birthday celebrant gender and name.');
      return;
    }

    const modeName = modes.find(m => m.id === selectedMode)?.name || '';
    const bookingData = {
      selectedDate, time, selectedMode, modeName, people, extraPlayers,
      hostName,
      birthdayCelebration: isBirthdayCelebration,
      birthdayGender: isBirthdayCelebration ? birthdayGender : null,
      birthdayName: isBirthdayCelebration ? birthdayName : null,
      phone: rawPhone, email, language,
      agreedTerms, agreedTermsAt, createdAt: new Date().toISOString()
    };

    setSubmitStatus('loading');
    setError('');

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(bookingData)
      });
      const result = await response.json();
      if (result.success) {
        setBookingId(result.bookingId || '');
        setSubmitStatus('success');
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setSubmitStatus('error');
    }
  };

  const renderCalendar = () => {
    const baseline = now ?? new Date();
    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarCells = [];

    for (let i = 0; i < firstWeekday; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="p-4" />);
    }

    const todayStart = new Date(baseline.getFullYear(), baseline.getMonth(), baseline.getDate());

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDateLocal(date);
      const weekday = date.getDay();
      const isHoliday = bcHolidays2026.includes(dateStr);
      const isMondayClosed = weekday === 1 && !isHoliday;
      const isPastDate = date < todayStart;
      const isDisabled = isMondayClosed || isPastDate;

      calendarCells.push(
        <div
          key={day}
          onClick={() => !isDisabled && openBookingModal(dateStr)}
          className={`p-4 rounded-2xl text-xl font-semibold text-center transition-all
            ${isDisabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none' : 'bg-emerald-400 hover:bg-emerald-500 text-white cursor-pointer'}`}
        >
          {day}
        </div>
      );
    }

    return calendarCells;
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans bg-gradient-to-b from-[#fff7fb] via-[#fffaff] to-[#f4f7ff] text-[#171a2b]">
      <style jsx global>{`
        @keyframes kawaiiFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes kawaiiSparkle {
          0% { box-shadow: 0 8px 20px rgba(255,79,163,.22); }
          50% { box-shadow: 0 12px 28px rgba(124,77,255,.34); }
          100% { box-shadow: 0 8px 20px rgba(255,79,163,.22); }
        }
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .kawaii-pop {
          animation: kawaiiFloat 3.2s ease-in-out infinite;
        }
        .kawaii-btn {
          position: relative;
          overflow: hidden;
          animation: kawaiiSparkle 2.8s ease-in-out infinite;
        }
        .kawaii-btn::after {
          content: '✦';
          position: absolute;
          right: 12px;
          top: 7px;
          font-size: 11px;
          color: rgba(255,255,255,.9);
        }
      `}</style>
      <div className="pointer-events-none absolute -top-16 -left-20 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-[32rem] -right-20 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-40 left-1/3 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/30 bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(124,77,255,0.12)]">
        <div className="w-full bg-white border-b border-pink-100/70">
          <img src={brandBannerUrl} className="w-full h-24 md:h-44 object-contain bg-white" alt="Clawzone Banner" />
        </div>


        <div className="w-full bg-white px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-6xl mx-auto flex justify-end mb-3">
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="kawaii-btn flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#ff5fa2] to-[#7c4dff] hover:opacity-95 text-white text-base font-semibold shadow-md transition-all"
              >
                <Globe className="w-5 h-5" />
                {language === 'zh' ? 'English' : '中文'}
              </button>
              <a
                href="#booking"
                className="kawaii-btn px-7 py-3 rounded-full font-semibold text-base text-white bg-gradient-to-r from-[#ff4fa3] to-[#5b6ee1] shadow-md transition-all"
              >
                {t.bookNow}
              </a>
            </div>
          </div>

          <div className="max-w-6xl mx-auto rounded-3xl border border-white/35 bg-white/85 backdrop-blur py-4 md:py-5 pr-4 md:pr-5 pl-2 md:pl-3 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="md:flex-1 md:pr-6 md:mr-auto">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs tracking-[0.14em] font-bold text-pink-500 uppercase">
                    {language === 'zh' ? '今日營業時間' : "Today's Hours"}
                  </p>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-pink-600 text-white">
                    {language === 'zh' ? '今天' : 'TODAY'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <p className={`text-2xl md:text-4xl font-black ${todayHours.closed ? 'text-gray-500' : 'text-[#2f3f8f]'}`}>
                    {todayHours.label}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${isOpenNow ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}
                  >
                    {isOpenNow ? 'OPEN NOW' : 'CLOSED NOW'}
                  </span>

                </div>

                <p className="text-xs mt-1 text-gray-600">
                  {language === 'zh' ? 'Mon: Closed（普通週一）｜Tue-Thu: 3-8 PM｜Fri: 3-9 PM｜Sat: 12-9 PM｜Sun/Holiday: 12-6 PM' : 'Mon: Closed (regular Monday) | Tue-Thu: 3-8 PM | Fri: 3-9 PM | Sat: 12-9 PM | Sun/Holiday: 12-6 PM'}
                </p>

                <div className="md:hidden mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                    className="kawaii-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ff5fa2] to-[#7c4dff] text-white text-xs font-semibold shadow-sm"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {language === 'zh' ? 'English' : '中文'}
                  </button>
                  <a
                    href="#booking"
                    className="kawaii-btn px-4 py-1.5 rounded-full font-semibold text-xs text-white bg-gradient-to-r from-[#ff4fa3] to-[#5b6ee1] shadow-sm"
                  >
                    {t.bookNow}
                  </a>
                  <button
                    className="px-3 py-1.5 rounded-full border border-pink-200 bg-white text-pink-600 text-xs font-semibold"
                    onClick={() => setShowWeekHoursMobile((v) => !v)}
                  >
                    {showWeekHoursMobile
                      ? (language === 'zh' ? '收合整週時間' : 'Hide weekly hours')
                      : (language === 'zh' ? '展開整週時間' : 'Show weekly hours')}
                  </button>
                </div>
              </div>

              <div className="w-full md:w-auto md:min-w-[400px]">
                <div className={`${showWeekHoursMobile ? 'grid' : 'hidden'} md:grid grid-cols-2 md:grid-cols-4 gap-2.5 text-sm`}>
                  {weekHours.map((d) => (
                    <div
                      key={d.name}
                      className={`rounded-xl px-3 py-2 border ${d.isToday ? 'border-pink-400 bg-white shadow-md ring-2 ring-pink-200/70' : 'border-pink-100 bg-white/75'}`}
                    >
                      <div className="flex items-center gap-1.5">
                        <p className={`font-bold ${d.isToday ? 'text-pink-600' : 'text-gray-700'}`}>{d.name}</p>
                        {d.isToday && <span className="text-[10px] font-bold text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded">TODAY</span>}
                      </div>
                      <p className={`text-xs mt-1 leading-4 ${d.closed ? 'text-gray-500' : 'text-gray-700'}`}>{d.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-[radial-gradient(circle_at_10%_20%,#ff9ccd_0%,#ff5fa2_32%,#7c4dff_68%,#4f72d9_100%)] text-white py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-5 transition-all" style={{ textShadow: '0 10px 28px rgba(35,17,79,.45)' }}>
            {heroTexts[heroIndex]}
          </h2>
          <a
            href="#booking"
            className="kawaii-btn inline-block bg-white text-[#ff4fa3] px-10 py-4 rounded-full text-xl font-extrabold border-2 border-white/90 hover:scale-105 shadow-2xl transition-all"
          >
            {t.bookNow}
          </a>
        </div>
      </div>

      {/* Photos & Videos */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-bold mb-6 text-pink-600">{t.photos}</h3>
            <div className="overflow-hidden rounded-3xl shadow-2xl h-[420px]">
              <img 
                src={storePhotos[currentPhoto]} 
                className="w-full h-full object-cover object-center" 
                alt="Store" 
              />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-6 text-pink-600">{t.videos}</h3>
            <div className="overflow-hidden rounded-3xl shadow-2xl h-[420px]">
              <video 
                className="w-full h-full object-cover" 
                controls 
                autoPlay 
                loop 
                muted
              >
                <source src="https://i.imgur.com/uwVsnKR.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Tokens */}
      <div className="max-w-5xl mx-auto px-6 py-12 bg-gradient-to-br from-white to-pink-50/60 rounded-3xl shadow-sm">
        <h2 className="text-4xl font-bold text-center mb-10 text-pink-600">{t.buyTokens}</h2>
        <div className="grid md:grid-cols-5 gap-4 text-center">
          <div className="bg-pink-50 p-6 rounded-3xl">
            <div className="text-2xl font-bold text-gray-900">5 Tokens</div>
            <div className="text-5xl font-bold text-pink-600">$5</div>
          </div>
          <div className="bg-pink-50 p-6 rounded-3xl">
            <div className="text-2xl font-bold text-gray-900">10 Tokens</div>
            <div className="text-5xl font-bold text-pink-600">$10</div>
          </div>
          <div className="bg-pink-50 p-6 rounded-3xl">
            <div className="text-2xl font-bold text-gray-900">22 Tokens</div>
            <div className="text-5xl font-bold text-pink-600">$20</div>
          </div>
          <div className="bg-pink-50 p-6 rounded-3xl">
            <div className="text-2xl font-bold text-gray-900">60 Tokens</div>
            <div className="text-5xl font-bold text-pink-600">$50</div>
          </div>
          <div className="bg-pink-50 p-6 rounded-3xl">
            <div className="text-2xl font-bold text-gray-900">130 Tokens</div>
            <div className="text-5xl font-bold text-pink-600">$100</div>
          </div>
        </div>
      </div>

      {/* Info Slider: New Here + Trade-in */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="rounded-[2rem] border border-white/60 bg-gradient-to-br from-white via-pink-50/55 to-violet-50/65 p-8 md:p-10 shadow-[0_24px_80px_rgba(124,77,255,0.16)]">
          <div className="flex items-center justify-between mb-7">
            <button
              onClick={() => setInfoSlide((s) => (s - 1 + 2) % 2)}
              className="w-11 h-11 rounded-full bg-white text-pink-600 font-bold shadow-md border border-pink-100 hover:scale-105 hover:bg-pink-50 transition-all"
            >
              ‹
            </button>
            <div className="flex items-center gap-2.5">
              {[0, 1].map((dot) => (
                <button
                  key={dot}
                  onClick={() => setInfoSlide(dot)}
                  className={`h-2.5 rounded-full transition-all ${infoSlide === dot ? 'w-10 bg-gradient-to-r from-pink-500 to-violet-500' : 'w-2.5 bg-pink-200'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setInfoSlide((s) => (s + 1) % 2)}
              className="w-11 h-11 rounded-full bg-white text-pink-600 font-bold shadow-md border border-pink-100 hover:scale-105 hover:bg-pink-50 transition-all"
            >
              ›
            </button>
          </div>

          <div className="h-1.5 w-full rounded-full bg-white/70 border border-pink-100 mb-8 overflow-hidden">
            <div
              key={infoSlide}
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500"
              style={{ animation: 'slideProgress 35s linear forwards' }}
            />
          </div>

          {infoSlide === 0 ? (
            <div>
              <h2 className="text-4xl font-bold text-center mb-2 text-pink-600">
                {language === 'zh' ? '第一次來？3 步驟開始玩！' : 'New Here? Start in 3 Easy Steps!'}
              </h2>
              <p className="text-center text-gray-600 mb-8">
                {language === 'zh' ? '清楚又簡單，來到店裡就能馬上開始享受抓娃娃！' : 'Simple and fun — start playing as soon as you arrive!'}
              </p>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="rounded-3xl p-6 bg-gradient-to-br from-pink-50 to-white border border-pink-100 shadow-sm">
                  <p className="text-xs font-bold text-pink-500 mb-2">STEP 1</p>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{language === 'zh' ? '買代幣或儲值會員卡' : 'Buy Tokens or Recharge Card'}</h3>
                  <p className="text-gray-600 text-sm leading-6">{language === 'zh' ? '先在櫃檯買 token，或直接儲值你的會員卡，馬上開玩。' : 'Grab tokens at the counter or recharge your member card and jump right in.'}</p>
                </div>
                <div className="rounded-3xl p-6 bg-gradient-to-br from-violet-50 to-white border border-violet-100 shadow-sm">
                  <p className="text-xs font-bold text-violet-500 mb-2">STEP 2</p>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{language === 'zh' ? '開始抓娃娃，玩得開心' : 'Play Claw Machines & Have Fun'}</h3>
                  <p className="text-gray-600 text-sm leading-6">{language === 'zh' ? '挑你喜歡的機台，抓娃娃、拍照、享受遊戲時間。' : 'Pick your favorite machine, win plushies, take photos, and enjoy the vibe.'}</p>
                </div>
                <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm">
                  <p className="text-xs font-bold text-blue-500 mb-2">STEP 3</p>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{language === 'zh' ? '保留獎品或 Trade-in 換 Points' : 'Keep Prize or Trade-in for Points'}</h3>
                  <p className="text-gray-600 text-sm leading-6">{language === 'zh' ? '可以直接帶走娃娃，或 trade-in 換 points，兌換大娃娃、IP 陶瓷杯、碗、盲盒等。' : 'Keep your prize, or trade in for points to redeem big plushies, IP ceramic cups, bowls, blind boxes, and more.'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-4xl font-bold text-center mb-6 text-pink-600">{tradeInTitle}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-3xl p-6 bg-pink-50 border border-pink-100 shadow-sm">
                  <p className="font-semibold text-gray-900 mb-3">Eligible</p>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside">
                    {tradeInRules.map((rule, idx) => <li key={idx}>{rule}</li>)}
                  </ul>
                </div>
                <div className="rounded-3xl p-6 bg-blue-50 border border-blue-100 shadow-sm">
                  <p className="font-semibold text-gray-900 mb-3">Not Eligible</p>
                  <ul className="space-y-2 text-gray-700 list-disc list-inside">
                    {notEligibleRules.map((rule, idx) => <li key={idx}>{rule}</li>)}
                  </ul>
                </div>
              </div>
              <p className="mt-6 text-gray-800 font-medium text-center">{redeemExamples}</p>
            </div>
          )}
        </div>
      </div>

      {/* 模式選擇 */}
      <div className="max-w-5xl mx-auto px-6 py-12 mt-8 bg-gradient-to-br from-white to-violet-50/60 rounded-3xl shadow-sm">
        <h2 className="text-4xl font-bold text-center mb-10 text-pink-600">{t.selectMode}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                onClick={() => openDetailModal(mode)}
                className={`p-8 rounded-3xl border-4 cursor-pointer transition-all hover:shadow-2xl ${selectedMode === mode.id ? 'border-pink-500 bg-pink-50 shadow-xl' : 'border-gray-200 hover:border-pink-300'}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 ${mode.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{mode.name}</h3>
                </div>
                <p className="text-gray-600 mb-6">{mode.desc}</p>
                <p className="text-pink-600 font-medium">{t.peopleRange}：{mode.min}～{mode.max} 人</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 日曆 */}
      <div id="booking" className="py-16 bg-gradient-to-b from-white to-pink-50/40">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-6 text-pink-600">{t.selectDate}</h2>

          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <button
              type="button"
              onClick={() => setDisplayedMonth(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1))}
              className="w-10 h-10 rounded-full bg-white border border-pink-200 text-pink-600 font-bold hover:bg-pink-50"
            >
              ‹
            </button>
            <div className="px-5 py-2 rounded-full bg-white border border-pink-200 text-pink-600 font-bold min-w-[210px] text-center">
              {displayedMonth.toLocaleDateString(language === 'zh' ? 'zh-CA' : 'en-CA', { month: 'long', year: 'numeric' })}
            </div>
            <button
              type="button"
              onClick={() => setDisplayedMonth(new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1))}
              className="w-10 h-10 rounded-full bg-white border border-pink-200 text-pink-600 font-bold hover:bg-pink-50"
            >
              ›
            </button>

            <button
              type="button"
              onClick={() => {
                const d = now ?? new Date();
                setDisplayedMonth(new Date(d.getFullYear(), d.getMonth(), 1));
              }}
              className="px-4 h-10 rounded-full bg-pink-500 text-white font-semibold text-sm hover:bg-pink-600"
            >
              Today
            </button>
          </div>

          <div className="bg-pink-50 p-8 rounded-3xl">
            <div className="grid grid-cols-7 gap-3 text-center text-pink-600 font-bold mb-4">
              <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {renderCalendar()}
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">{t.green}</p>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && detailMode && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] px-3 py-6" onClick={() => setIsDetailModalOpen(false)}>
          <div className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-2 right-2 md:-top-12 md:right-4 text-white text-4xl md:text-5xl hover:text-pink-400 z-10">×</button>
            <h3 className="text-white text-2xl md:text-3xl font-bold text-center mb-5 md:mb-8">{detailMode.name}</h3>
            <p className="text-center text-white/70 text-xs mb-4 md:hidden">{language === 'zh' ? '點圖片可放大，點黑色空白處可關閉' : 'Tap image to enlarge, tap outside to close'}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {detailMode.photos.map((photo: string, index: number) => (
                <div 
                  key={index} 
                  className="cursor-pointer overflow-hidden rounded-3xl shadow-2xl hover:scale-105 transition-transform"
                  onClick={() => setBigPhoto(photo)}
                >
                  <img src={photo} className="w-full aspect-square object-cover object-center" alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 高清大圖 Modal */}
      {bigPhoto && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[70] px-3" onClick={() => setBigPhoto(null)}>
          <button className="absolute top-4 right-4 text-white text-4xl" onClick={() => setBigPhoto(null)}>×</button>
          <img src={bigPhoto} className="max-h-[88vh] max-w-[95vw] rounded-3xl shadow-2xl object-contain" alt="Big Photo" />
        </div>
      )}

      {/* Party Terms Modal */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[80] px-4" onClick={() => setIsTermsModalOpen(false)}>
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-2xl font-bold text-pink-600">{partyTermsTitle}</h3>
              <button onClick={() => setIsTermsModalOpen(false)} className="text-2xl text-gray-400 hover:text-gray-700">×</button>
            </div>

            <div className="space-y-5 text-sm text-gray-700 leading-6">
              <div>
                <p className="font-semibold text-gray-900">{language === 'zh' ? '時間與流程' : 'Time & Flow'}</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>{language === 'zh' ? '總時長 2 小時（含前 15 分鐘佈置 + 後 15 分鐘清場）' : 'Total 2 hours (includes 15-min setup + 15-min cleanup)'}</li>
                  <li>{language === 'zh' ? 'Unlimited Play 最多 1 小時 15 分鐘（可由主辦提前結束）' : 'Unlimited play up to 1h 15m (host may end earlier)'}</li>
                  <li>{language === 'zh' ? 'Unlimited 結束後才可享用餐點（除了水）' : 'Food/drinks (except water) only after unlimited play ends'}</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-900">{language === 'zh' ? '價錢（GST 另計）' : 'Pricing (GST applies)'}</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>{language === 'zh' ? '1–10 人：週二到週五 $349；週六 $399；週日與假日 $399' : '1–10 players: Tue–Fri $349; Sat $399; Sun & Holiday $399'}</li>
                  <li>{language === 'zh' ? '11–15 人：週二到週五 $449；週六 $549；週日與假日 $549' : '11–15 players: Tue–Fri $449; Sat $549; Sun & Holiday $549'}</li>
                  <li>{language === 'zh' ? '16–20 人：週二到週五 $549；週六 $699；週日與假日 $699' : '16–20 players: Tue–Fri $549; Sat $699; Sun & Holiday $699'}</li>
                  <li>{language === 'zh' ? '超過 20 人：平日每位 $18.99；週末/假日每位 $24.99' : '20+ players: Weekday $18.99 each; Weekend/Holiday $24.99 each'}</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-900">{language === 'zh' ? '定金與取消' : 'Deposit & Cancellation'}</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>{language === 'zh' ? '預約需先付 $200（含 $100 不可退定金 + $100 可退取消金）' : '$200 required to confirm ($100 non-refundable deposit + $100 conditional refund portion)'}</li>
                  <li>{language === 'zh' ? '活動前 48 小時以上取消：退回 $100' : 'Cancel 48+ hours before event: $100 refunded'}</li>
                  <li>{language === 'zh' ? '少於 48 小時取消：$200 全數不退' : 'Cancel within 48 hours: full $200 non-refundable'}</li>
                  <li>{language === 'zh' ? '如照常舉辦，$200 可折抵最終帳單' : 'If event proceeds, full $200 applies to final bill'}</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-900">{t.policyTitle}</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>{t.policy1}</li>
                  <li>{t.policy2}</li>
                  <li>{t.policy3}</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-900">{language === 'zh' ? '獎品與限制' : 'Prizes & Restrictions'}</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>{language === 'zh' ? '每位玩家可保留藍/粉機台的 1 個獎品（娃娃或 keychain）' : 'Each player keeps 1 prize from regular blue/pink machines (plush or keychain)'}</li>
                  <li>{language === 'zh' ? '巨無霸、盲盒、Lucky、紅機台獎品不含在 unlimited 內' : 'Giant/Blind Box/Lucky/Red machine prizes are excluded from unlimited play'}</li>
                  <li>{language === 'zh' ? '扭蛋機在 unlimited 時段會暫停' : 'Capsule machines are turned off during unlimited play'}</li>
                  <li>{language === 'zh' ? '禁止酒精、明火、拉炮/泡泡/史萊姆/水槍、吸菸與電子煙' : 'No alcohol, open flames, piñatas/bubbles/slime/water guns, smoking or vaping'}</li>
                </ul>
              </div>

              <p className="text-xs text-gray-500">
                {language === 'zh'
                  ? '逾時每 15 分鐘加收 $40；損壞或污染獎品將另行收費。店家保留最終解釋權。'
                  : 'Overtime fee: $40 per 15 minutes. Damaged/soiled prizes incur extra charges. Final decision reserved by Clawzone Arcade Ltd.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 預約 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => { if (submitStatus !== 'loading') setIsModalOpen(false); }}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

            {/* Loading */}
            {submitStatus === 'loading' && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
                <p className="text-gray-600 font-semibold">{language === 'zh' ? '送出中...' : 'Submitting...'}</p>
              </div>
            )}

            {/* Success */}
            {submitStatus === 'success' && (
              <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                <h3 className="text-2xl font-bold text-gray-900">{language === 'zh' ? '🎉 預約成功！' : '🎉 Booking Received!'}</h3>
                <p className="text-gray-600 text-sm leading-6">
                  {language === 'zh'
                    ? '確認信已寄至你的 Email，請在 24 小時內完成 $200 CAD E-transfer 定金。'
                    : 'A confirmation email has been sent. Please complete the $200 CAD E-transfer deposit within 24 hours.'}
                </p>
                {bookingId && (
                  <div className="bg-pink-50 rounded-2xl px-6 py-3 border border-pink-200">
                    <p className="text-xs text-gray-500 mb-1">{language === 'zh' ? '預約編號（E-transfer 備註填此）' : 'Booking ID (use as E-transfer note)'}</p>
                    <p className="text-2xl font-black text-pink-600 tracking-widest">{bookingId}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-2xl px-5 py-3 text-sm text-gray-700 text-left w-full">
                  <p className="font-semibold mb-1">💸 E-transfer to: <span className="text-pink-600">info@clawzonearcade.com</span></p>
                  <p>{language === 'zh' ? '備註填寫：' : 'Note: '}<span className="font-bold">{bookingId}</span></p>
                </div>
                <button onClick={() => { setIsModalOpen(false); setSubmitStatus('idle'); setBookingId(''); }} className="mt-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold hover:opacity-90 transition-all">
                  OK 🎉
                </button>
              </div>
            )}

            {/* Error */}
            {submitStatus === 'error' && (
              <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                <AlertCircle className="w-16 h-16 text-red-400" />
                <h3 className="text-2xl font-bold text-gray-900">{language === 'zh' ? '送出失敗' : 'Submission Failed'}</h3>
                <p className="text-gray-600 text-sm">{language === 'zh' ? '請稍後再試，或直接致電 +1 (604) 812-2529' : 'Please try again or call +1 (604) 812-2529'}</p>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setSubmitStatus('idle')} className="px-6 py-3 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600 transition-all">{language === 'zh' ? '重試' : 'Try Again'}</button>
                  <button onClick={() => { setIsModalOpen(false); setSubmitStatus('idle'); }} className="px-6 py-3 border border-gray-300 text-gray-600 rounded-full font-bold hover:bg-gray-50 transition-all">{t.cancel}</button>
                </div>
              </div>
            )}

            {/* Form */}
            {submitStatus === 'idle' && (
              <>
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
                  {language === 'zh' ? `預約 ${selectedDate}` : `Book for ${selectedDate}`}
                </h3>
            <form onSubmit={handleBooking} className="space-y-5">
              <select
                value={selectedMode}
                onChange={(e) => {
                  const modeId = e.target.value;
                  setSelectedMode(modeId);
                  if (modeId === 'unlimited') {
                    setPeople(10);
                    setExtraPlayers(0);
                  } else {
                    setExtraPlayers(0);
                  }
                }}
                className="w-full border rounded-xl px-4 py-3 text-gray-900"
                required
              >
                <option value="">選擇活動模式</option>
                {modes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="w-full border border-pink-300 text-pink-600 hover:bg-pink-50 rounded-xl px-4 py-3 font-semibold"
              >
                {viewTermsText}
              </button>
              <input type="text" placeholder={`${t.hostName} *`} value={hostName} onChange={(e) => setHostName(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-gray-900" required />

              <div className="rounded-xl border p-3 space-y-3">
                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={isBirthdayCelebration}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setIsBirthdayCelebration(checked);
                      if (!checked) {
                        setBirthdayGender('');
                        setBirthdayName('');
                      }
                    }}
                    className="mt-0.5"
                  />
                  <span>
                    {language === 'zh' ? '如果是慶生請勾選' : 'Check if this is for a birthday celebration'}
                  </span>
                </label>

                {isBirthdayCelebration && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <select
                      value={birthdayGender}
                      onChange={(e) => setBirthdayGender(e.target.value)}
                      className="w-full border rounded-xl px-4 py-3 text-gray-900"
                      required
                    >
                      <option value="">{language === 'zh' ? '選擇性別' : 'Select Gender'}</option>
                      <option value="boy">{language === 'zh' ? '男生' : 'Boy'}</option>
                      <option value="girl">{language === 'zh' ? '女生' : 'Girl'}</option>
                    </select>
                    <input
                      type="text"
                      placeholder={language === 'zh' ? '需要慶祝的人名' : 'Celebrant Name'}
                      value={birthdayName}
                      onChange={(e) => setBirthdayName(e.target.value)}
                      className="w-full border rounded-xl px-4 py-3 text-gray-900"
                      required
                    />
                  </div>
                )}
              </div>

              <input type="tel" placeholder={`${t.phone} *`} value={formatPhoneDisplay(rawPhone)} onChange={(e) => setRawPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full border rounded-xl px-4 py-3 text-gray-900" required />
              <input type="email" placeholder={`${t.email} *`} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-gray-900" required />
              {selectedMode === 'unlimited' ? (
                <div className="space-y-3">
                  <div className="rounded-xl border p-3">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                      {language === 'zh' ? '人數（固定選項）' : 'People (fixed options)'}
                    </label>
                    <select
                      value={people >= 20 ? 20 : people}
                      onChange={(e) => {
                        const base = Number(e.target.value);
                        setPeople(base);
                        setExtraPlayers(0);
                      }}
                      className="w-full border rounded-xl px-4 py-3 text-gray-900"
                    >
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                    </select>
                  </div>

                  <div className="min-h-[80px]">
                    {(people >= 20) ? (
                      <div className="rounded-xl border p-3">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          {language === 'zh' ? 'Extra Player（只有選 20 人才可加）' : 'Extra Players (only when 20 is selected)'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[0, 1, 2, 3, 4].map((v) => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => {
                                setExtraPlayers(v);
                                setPeople(20 + v);
                              }}
                              className={`px-3 py-1.5 rounded-full border text-sm ${extraPlayers === v ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              {v === 0 ? 'No Extra' : `+${v}`}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : <div />}
                  </div>

                  <p className="text-sm text-gray-600">
                    {language === 'zh' ? `總人數：${people} 人` : `Total People: ${people}`}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <input type="number" value={people} onChange={(e) => setPeople(Number(e.target.value))} min={modes.find(m => m.id === selectedMode)?.min || 1} max={modes.find(m => m.id === selectedMode)?.max || 25} className="w-full border rounded-xl px-4 py-3 text-gray-900 pr-16" required />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{t.people}</span>
                </div>
              )}
              <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-gray-900">
                {availableTimes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAgreedTerms(checked);
                    setAgreedTermsAt(checked ? new Date().toISOString() : null);
                  }}
                  className="mt-1 h-4 w-4"
                />
                <span>
                  {language === 'zh' ? '我已閱讀並同意 Private Party 條款與細節' : 'I have read and agree to the Private Party terms and details'}
                  {agreedTermsAt && (
                    <span className="block text-xs text-gray-500 mt-1">
                      {language === 'zh' ? `勾選時間：${agreedTermsAt}` : `Accepted at: ${agreedTermsAt}`}
                    </span>
                  )}
                </span>
              </label>

              {error && <p className="text-red-500 text-center font-medium">{error}</p>}
              <button
                type="submit"
                disabled={!agreedTerms}
                className={`w-full py-4 rounded-2xl font-bold text-xl text-white ${agreedTerms ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                {t.confirm}
              </button>
            </form>
            <button onClick={() => { setIsModalOpen(false); setSubmitStatus('idle'); }} className="mt-4 text-gray-500 w-full">{t.cancel}</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Trust Elements */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-4xl font-bold text-center mb-10 text-pink-600">{t.trustTitle}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
            <p className="text-gray-500 mb-2">{t.reviewLabel}</p>
            <p className="text-4xl font-bold text-pink-600">⭐ {googleRating}</p>
            <p className="text-gray-600">{t.basedOn} {googleReviewCount}+ reviews</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
            <p className="text-gray-500 mb-3">{t.parentVoices}</p>
            <div className="space-y-3 text-gray-700 text-sm">
              {testimonials.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Monthly Highlights */}
      <div className="max-w-6xl mx-auto px-6 pb-14">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
            <p className="text-sm text-pink-500 font-semibold mb-2">{monthlyEventTitle}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Pokémon Card Event</h3>
            <img src={pokemonEventImage} alt="Pokemon Card Event" className="w-full h-44 object-cover rounded-2xl mb-4" />
            <p className="text-gray-700 text-sm leading-6">
              {language === 'zh'
                ? '3/5 - 3/29 限時活動：單筆儲值 $50 可獲得抽獎資格（多筆小額累加不算）。店內限定，送完為止。'
                : 'Limited event (Mar 5 - Mar 29): single $50 recharge gets 1 raffle entry. In-store only, while supplies last.'}
            </p>
            <div className="mt-4 rounded-2xl bg-pink-50 text-pink-600 text-sm p-3 font-medium">
              {language === 'zh' ? '獎項包含 Pokémon TCG Premium Collection' : 'Featuring Pokémon TCG Premium Collection'}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
            <p className="text-sm text-purple-500 font-semibold mb-2">{popularRedeemTitle}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Top Picks</h3>
            <ul className="space-y-2 text-gray-700 list-disc list-inside">
              <li>{language === 'zh' ? '盲盒（Blind Box）' : 'Blind Box'}</li>
              <li>{language === 'zh' ? '回力車（Pull-back Car）' : 'Pull-back Car'}</li>
            </ul>
            <p className="mt-4 text-xs text-gray-500">{language === 'zh' ? '圖片稍後補上' : 'Images coming soon'}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
            <p className="text-sm text-blue-500 font-semibold mb-2">{newIpTitle}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Pokémon UNOVA Series</h3>
            <p className="text-gray-700 text-sm leading-6">
              {language === 'zh'
                ? '新品已上架，可透過遊玩獲得、或使用 Points 兌換。現場會持續更新 IP 與限定款。'
                : 'Now available in store. Collect by playing or redeem with points. New IP and limited items update regularly.'}
            </p>
            <div className="mt-4 text-xs text-gray-500">{language === 'zh' ? '更多新款請看店內公告與 IG/TikTok' : 'Follow in-store board and IG/TikTok for latest drops'}</div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <FAQSection language={language} />

      {/* Beta Notice Popup */}
      {showBeta && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              {language === 'zh' ? '網站測試中' : 'Website Under Testing'}
            </h2>
            <p className="text-gray-600 text-sm leading-6 mb-6">
              {language === 'zh'
                ? '我們的網站目前仍在測試階段，部分功能可能尚未完整。如需預約或查詢，歡迎直接致電或 Instagram 私訊我們！'
                : 'Our website is currently in testing. Some features may not be fully ready. For bookings or enquiries, please call or DM us on Instagram!'}
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowBeta(false)} className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 transition-all">
                {language === 'zh' ? '我知道了，繼續瀏覽' : 'Got it, continue browsing'}
              </button>
              <a href="https://instagram.com/clawzone.arcade" target="_blank" rel="noreferrer" className="w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-orange-500 text-white font-bold hover:opacity-90 transition-all">
                📸 Instagram
              </a>
              <a href="tel:+16048122529" className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all">
                📞 +1 (604) 812-2529
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating CTA */}
      <div suppressHydrationWarning className="fixed bottom-3 right-3 md:bottom-6 md:right-6 z-[80] flex flex-col gap-2 md:gap-3">
        <a suppressHydrationWarning href="#booking" className="kawaii-btn bg-gradient-to-r from-[#ff4fa3] to-[#7c4dff] hover:opacity-95 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-full shadow-xl font-semibold text-sm md:text-base text-center">
          {t.bookNow}
        </a>
        <a suppressHydrationWarning href={instagramLink} target="_blank" rel="noreferrer" className="bg-gradient-to-r from-fuchsia-500 to-orange-500 hover:opacity-90 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-full shadow-xl font-semibold text-sm md:text-base text-center">
          {t.instagramNow}
        </a>
        <a suppressHydrationWarning href={tiktokLink} target="_blank" rel="noreferrer" className="bg-black hover:bg-gray-800 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-full shadow-xl font-semibold text-sm md:text-base text-center">
          {t.tiktokNow}
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-2xl font-bold mb-2">Clawzone Claw Machine Paradise</p>
          <p className="text-lg">4680 Hastings St, Burnaby, BC • +1 (604) 812-2529 • info@clawzonearcade.com</p>
        </div>
      </footer>
    </div>
  );
}

