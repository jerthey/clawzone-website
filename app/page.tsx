'use client';

import { useState, useEffect } from 'react';
import { Users, Gift, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXtfYELyQUd2AbcXWPHYmZUu0jEWKPpSVn2sv60qPACYH-FfW_L9CwyiqL7qNxHXK1/exec';

// === Latest in-store photos (centered, sharp) ===
const storePhotos = [
  "https://i.imgur.com/L99NReM.jpg",
  "https://i.imgur.com/XaNBQhG.jpg",
  "https://i.imgur.com/LN0mZ2Z.jpg",
  "https://i.imgur.com/cGYkTcB.jpg",
  "https://i.imgur.com/0Lw8x9q.jpg"
];

// Private Party Room photos (stored in /public)
const privateRoomPhotos = [
  "/2.jpg",
  "/3.jpg"
];

const brandBannerUrl = 'https://i.imgur.com/OLkYf0k.png';

// === Current Events (banner config / auto-displays based on date) ===
// To add a new event: copy an entry below and change id / start / end / text
// Rules:
//   Within event dates -> shows "NOW ON" banner
//   Within 30 days after end -> shows "ENDED - see winners on IG / TikTok"
//   Older than 30 days -> automatically hidden
const currentEvents = [
  {
    id: 'pokemon-mar-2026',
    start: '2026-03-05',
    end: '2026-03-29',
    emoji: '🎴',
    title_en: 'Pokemon Card Event',
    desc_en: 'Play to win limited Pokémon cards • In-store draw',
  },
];

const translations = {
  en: {
    title: "CLAWZONE",
    hero1: "Unlimited Token Play Party",
    hero2: "Private Party Room",
    bookNow: "Book Now",
    selectMode: "Choose Your Activity Mode",
    unlimited: "Unlimited Token Play Party",
    private: "Private Party Room",
    unlimitedDesc: "Entire store access • Unlimited token play for 1hr+",
    privateDesc: "Private room • Up to 10 people",
    unlimitedDetail: "Entire arcade access for your party. Unlimited token play for 1 hour and 15 minutes, plus prizes for every player.",
    privateDetail: "Private room for up to 10 people. Includes free tokens, table & chairs, and Nintendo Switch 2 console.",
    selectDate: "Select Party Date",
    green: "Green = Available • Red = Fully Booked • Gray = Unavailable. Dates with \"Unlimited Play-Full\" or \"Private Room-Full\" label still have the other mode available.",
    book: "Book Now",
    later: "Choose Later",
    people: "People",
    peopleRange: "Group Size",
    confirm: "Confirm Booking & Pay Deposit",
    cancel: "Cancel",
    hostName: "Host Name",
    phone: "Phone Number",
    email: "Email (Invoice will be sent)",
    photos: "Photos",
    videos: "Videos",
    successAlert: "🎉 Booking Successful!\nDate: {date} {time}\nMode: {mode}\nPeople: {people}\nWe will send the $200 CAD deposit invoice to {email}",
    buyTokens: "Buy Tokens",
    tokensTitle: "Regular Token Prices",
    trustTitle: "Why Parents Trust Us",
    reviewLabel: "Google Reviews",
    basedOn: "Based on",
    parentVoices: "What Parents Say",
    policyTitle: "Refund / Reschedule Policy",
    policy1: "72+ hours before event: one free reschedule",
    policy2: "24-72 hours before event: reschedule with admin fee",
    policy3: "Within 24 hours: deposit non-refundable, one date transfer allowed",
    callNow: "Call Now",
    instagramNow: "Instagram",
    tiktokNow: "TikTok"
  }
};

// ── FAQ Data & Components ──────────────────────────────────
const faqData = [
  { id: 1, icon: '👶',
    q_en: 'What is the minimum age to enter?',
    a_en: 'All ages are welcome!' },
  { id: 2, icon: '🪙',
    q_en: 'Can I get a refund on unused tokens?',
    a_en: 'Tokens are non-refundable once purchased. Leftover tokens can be saved onto your membership card for your next visit.' },
  { id: 3, icon: '🔄',
    q_en: 'How does the Trade-in for Points system work?',
    a_en: 'Win a prize and trade it in before you leave the store to redeem something else from our prize wall.\n\n⚠️ Trade-in must be completed on the same day before leaving.\n\nNote: Some machines (such as capsule, blind box, lucky, blocks, and select special machines) are not eligible for trade-in. These will be marked “Not Tradeable” on the machine.' },
  { id: 5, icon: '🥤',
    q_en: 'Can I bring my own food and drinks?',
    a_en: "Please don't bring food or drinks into the arcade area. Party bookings have dedicated tables for food. 🙏" },
  { id: 6, icon: '🐾',
    q_en: 'Are pets allowed inside?',
    a_en: "Yes! We're happy to welcome dogs into our store, provided they're well-behaved (no aggressive or violent tendencies) and remain under your close supervision at all times. This helps ensure a safe and enjoyable experience for everyone. We look forward to seeing you and your pup soon! 🐾" },
  { id: 7, icon: '🎉',
    q_en: 'How far in advance should I book a Party?',
    a_en: "Book as early as possible — slots fill up a month in advance. Secure your spot with a party deposit." },
  { id: 8, icon: '🅿️',
    q_en: 'Is there parking available?',
    a_en: 'Yes! Parking is available near 4680 Hastings St, Burnaby.' },
];

function FAQItem({ item, isOpen, onToggle }: {
  item: (typeof faqData)[0]; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? 'border-pink-300 bg-pink-50/60 shadow-md' : 'border-gray-200 bg-white hover:border-pink-200 hover:shadow-sm'}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left" aria-expanded={isOpen}>
        <div className="flex items-center gap-3">
          <span className="text-2xl select-none">{item.icon}</span>
          <span className="font-bold text-gray-900 text-base leading-snug">{item.q_en}</span>
        </div>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${isOpen ? 'bg-pink-500 text-white rotate-45' : 'bg-gray-100 text-gray-500'}`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </span>
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-5 pl-[4.25rem]">
          <p className="text-gray-600 text-sm leading-7 whitespace-pre-line">{item.a_en}</p>
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);
  return (
    <div className="max-w-3xl mx-auto px-6 pb-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-pink-600 mb-3">{'FAQ'}</h2>
        <p className="text-gray-500 text-base">{'Still have questions? Call or DM us on Instagram!'}</p>
      </div>
      <div className="flex flex-col gap-3">
        {faqData.map((item) => (
          <FAQItem key={item.id} item={item} isOpen={openId === item.id} onToggle={() => setOpenId((p) => (p === item.id ? null : item.id))} />
        ))}
      </div>
      <div className="mt-10 text-center bg-gradient-to-r from-pink-50 to-violet-50 rounded-3xl p-8 border border-pink-100">
        <p className="text-gray-700 font-semibold text-lg mb-2">{"🎪 Didn't find your answer?"}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <a href="sms:+16048122529" className="kawaii-btn inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:opacity-90 transition-all">
            📞 Call / Text Us
          </a>
          <a href="https://instagram.com/clawzone.arcade" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg hover:opacity-90 transition-all">
            📸 Instagram DM
          </a>
          <a href="https://www.tiktok.com/@clawzone.arcade" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg transition-all">
            🎵 TikTok DM
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Clawzone() {
  const [showBeta, setShowBeta] = useState(false);
  const [isEventBannerClosed, setIsEventBannerClosed] = useState(false);
  const t = translations.en;

  const [heroIndex, setHeroIndex] = useState(0);
  const [infoSlide, setInfoSlide] = useState(0);
  const heroTexts = [t.hero1, t.hero2];

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
  const [bookedSlots, setBookedSlots] = useState<{date: string; time: string; mode: string}[]>([]);
  const [showWeekHoursMobile, setShowWeekHoursMobile] = useState(false);
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const modes = [
    { id: 'unlimited', name: t.unlimited, max: 24, min: 2, desc: t.unlimitedDesc, detail: t.unlimitedDetail, icon: Gift, color: 'bg-pink-500', photos: storePhotos },
    { id: 'private', name: t.private, max: 10, min: 1, desc: t.privateDesc, detail: t.privateDetail, icon: Users, color: 'bg-purple-500', photos: privateRoomPhotos }
  ];

  const bcHolidays2026 = ['2026-01-01','2026-02-16','2026-04-03','2026-05-18','2026-07-01','2026-08-03','2026-09-07','2026-09-30','2026-10-12','2026-11-11','2026-12-25'];

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getHoursForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const day = date.getDay();
    const isHoliday = bcHolidays2026.includes(dateStr);

    if (isHoliday) return { label: '12:00 PM - 6:00 PM', closed: false, open: 12 * 60, close: 18 * 60 };
    if (day === 1) return { label: 'Closed (Regular Monday)', closed: true, open: null, close: null };
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

  const instagramLink = 'https://instagram.com/clawzone.arcade';
  const tiktokLink = 'https://www.tiktok.com/@clawzone.arcade';

  // === Decide which event to show: active first > ended within 30 days > otherwise hide ===
  const activeEvent = (() => {
    if (!now) return null;
    const nowTs = now.getTime();
    for (const e of currentEvents) {
      const startTs = new Date(e.start + 'T00:00:00').getTime();
      const endTs = new Date(e.end + 'T23:59:59').getTime();
      if (nowTs >= startTs && nowTs <= endTs) {
        return { ...e, status: 'active' as const };
      }
    }
    for (const e of currentEvents) {
      const endTs = new Date(e.end + 'T23:59:59').getTime();
      const daysSince = (nowTs - endTs) / (1000 * 60 * 60 * 24);
      if (daysSince > 0 && daysSince <= 30) {
        return { ...e, status: 'expired' as const };
      }
    }
    return null;
  })();

  const tradeInTitle = 'Trade-in for Points Rules';
  const tradeInRules = [
        'Most plush and keychain prizes from our regular machines',
        'Trade-in must be done on the same day, before leaving the store'
      ];

  const notEligibleRules = [
        'Capsule machines, Blind Box, Lucky machines, Blocks, etc.',
        'Tissues, wet wipes, Pressed-On Nails, Pokémon cards, and similar items',
        'Any machine marked "Not Tradeable" on the front'
      ];

  const redeemExamples = 'Redeem with 2 Points+ — large plushies, IP ceramic cups, tableware, blind boxes, and more.';


  const partyTermsTitle = 'Private Party Terms (Please read before booking)';
  const viewTermsText = 'View Terms & Details for this Mode';

  useEffect(() => {
    const heroTimer = setInterval(() => setHeroIndex(i => (i + 1) % 2), 3000);
    const photoTimer = setInterval(() => setCurrentPhoto(p => (p + 1) % storePhotos.length), 3500);
    return () => { clearInterval(heroTimer); clearInterval(photoTimer); };
  }, []);

  useEffect(() => {
    const sliderTimer = setInterval(() => setInfoSlide((s) => (s + 1) % 2), 35000);
    return () => clearInterval(sliderTimer);
  }, []);

  useEffect(() => {
    setNow(new Date());
    // Reset displayed month to current month on client mount (fix SSR date caching)
    const today = new Date();
    setDisplayedMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch confirmed bookings so calendar can mark fully-booked dates red
  useEffect(() => {
    fetch(APPS_SCRIPT_URL + '?action=getBooked')
      .then(r => r.json())
      .then(d => { if (d && d.success && Array.isArray(d.bookedSlots)) setBookedSlots(d.bookedSlots); })
      .catch(err => console.warn('Could not load booked slots:', err));
  }, []);

  useEffect(() => {
    if (!selectedMode) return;
    const mode = modes.find((m) => m.id === selectedMode);
    if (mode) {
      if (people < mode.min) setPeople(mode.min);
      if (people > mode.max) setPeople(mode.max);
    }
    setExtraPlayers(0);
  }, [selectedMode]);

  // Refresh available time slots when mode or date changes inside booking modal
  useEffect(() => {
    if (!selectedDate || !selectedMode) return;
    const newTimes = getAvailableTimes(selectedDate, selectedMode);
    setAvailableTimes(newTimes);
    if (newTimes.length > 0 && !newTimes.includes(time)) {
      setTime(newTimes[0]);
    }
  }, [selectedMode, selectedDate]);

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

  // Raw mode-specific slots (no filtering applied — used for fully-booked detection)
  const getRawTimeSlots = (dateStr: string, mode: string): string[] => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const weekday = date.getDay();
    const isHoliday = bcHolidays2026.includes(dateStr);

    if (weekday === 1 && !isHoliday) return [];
    if (mode === 'private') {
      if (weekday === 6) return ['13:00 - 15:00', '15:30 - 17:30', '18:00 - 20:00'];
      if (weekday === 0 || isHoliday) return ['13:00 - 15:00', '15:30 - 17:30'];
      return ['15:30 - 17:30', '18:00 - 20:00']; // Tue-Fri
    }
    if (weekday === 6) return ['10:00 - 12:00'];
    if (weekday === 0 || isHoliday) return ['10:00 - 12:00', '18:15 - 20:15'];
    return ['10:00 - 12:00', '13:00 - 15:00']; // Tue-Fri
  };

  const getAvailableTimes = (dateStr: string, mode: string = 'unlimited'): string[] => {
    let times = getRawTimeSlots(dateStr, mode);

    // Filter out past time slots if it's today
    const today = now ?? new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    if (dateStr === todayStr) {
      const currentMinutes = today.getHours() * 60 + today.getMinutes();
      times = times.filter(t => {
        const [startHour, startMin] = t.split(' - ')[0].split(':').map(Number);
        return currentMinutes < startHour * 60 + startMin;
      });
    }

    // Filter out slots already confirmed in the Google Sheet
    times = times.filter(t => !bookedSlots.some(b => b.date === dateStr && b.time === t));

    return times;
  };

  const openBookingModal = (dateStr: string) => {
    // Find a mode that still has slots — prefer current selection if available
    const currentMode = selectedMode || 'unlimited';
    const currentHasSlots = getAvailableTimes(dateStr, currentMode).length > 0;
    const modeForSlots = currentHasSlots ? currentMode : (modes.find(m => getAvailableTimes(dateStr, m.id).length > 0)?.id || currentMode);
    const times = getAvailableTimes(dateStr, modeForSlots);

    if (times.length === 0) {
      // Truly nothing available across all modes
      const [yy, mm, dd] = dateStr.split('-').map(Number);
      const weekday = new Date(yy, mm - 1, dd).getDay();
      alert(weekday === 1 && !bcHolidays2026.includes(dateStr) ? '😔 Mondays are closed (except holidays).' : '😔 No available time slots left for any party type on this date.');
      return;
    }

    // If we had to switch the mode, update selectedMode so the form reflects it
    if (modeForSlots !== currentMode) {
      setSelectedMode(modeForSlots);
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
      if (people < 2 || people > 24) {
        setError('Unlimited Token Play Party: 2 to 24 players (max 24).');
        return false;
      }
    }

    if (people < mode.min) { setError(`Minimum ${mode.min} people required`); return false; }
    if (people > mode.max) { setError(`Maximum ${mode.max} people allowed`); return false; }
    setError('');
    return true;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPeople() || !selectedMode) {
      setError('Please select an activity mode');
      return;
    }
    if (!agreedTerms) {
      setError('Please agree to party terms before booking');
      return;
    }
    if (isBirthdayCelebration && (!birthdayGender || !birthdayName.trim())) {
      setError('Please provide birthday celebrant gender and name.');
      return;
    }

    const modeName = modes.find(m => m.id === selectedMode)?.name || '';
    const bookingData = {
      selectedDate, time, selectedMode, modeName, people, extraPlayers,
      hostName,
      birthdayCelebration: isBirthdayCelebration,
      birthdayGender: isBirthdayCelebration ? birthdayGender : null,
      birthdayName: isBirthdayCelebration ? birthdayName : null,
      phone: rawPhone, email, language: 'en',
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

  // Check if a specific time slot for a given date is already booked (Confirmed)
  const isSlotBooked = (dateStr: string, time: string): boolean => {
    return bookedSlots.some(b => b.date === dateStr && b.time === time);
  };

  // Check if every slot for a specific MODE is booked (uses raw, unfiltered slots)
  const isModeFullyBooked = (dateStr: string, mode: 'unlimited' | 'private'): boolean => {
    const raw = getRawTimeSlots(dateStr, mode);
    if (raw.length === 0) return false;
    return raw.every(slot => isSlotBooked(dateStr, slot));
  };

  // A date is "fully booked" (red) only if BOTH modes are fully booked
  const isDateFullyBooked = (dateStr: string): boolean => {
    return isModeFullyBooked(dateStr, 'unlimited') && isModeFullyBooked(dateStr, 'private');
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
      // If it's today, check if all time slots have passed
      const isTodayWithNoSlots = dateStr === formatDateLocal(todayStart) && getAvailableTimes(dateStr).length === 0;
      const fullyBooked = isDateFullyBooked(dateStr);
      const unlimitedBooked = isModeFullyBooked(dateStr, 'unlimited');
      const privateBooked = isModeFullyBooked(dateStr, 'private');
      const isDisabled = isMondayClosed || isPastDate || isTodayWithNoSlots || fullyBooked;

      let cellClass: string;
      if (isMondayClosed || isPastDate || isTodayWithNoSlots) {
        cellClass = 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none';
      } else if (fullyBooked) {
        cellClass = 'bg-red-400 text-white cursor-not-allowed pointer-events-none';
      } else {
        cellClass = 'bg-emerald-400 hover:bg-emerald-500 text-white cursor-pointer';
      }

      // Mode-specific label when only ONE mode is fully booked
      let bookedLabel: string | null = null;
      if (!fullyBooked && unlimitedBooked) bookedLabel = 'Unlimited Play-Full';
      else if (!fullyBooked && privateBooked) bookedLabel = 'Private Room-Full';

      calendarCells.push(
        <div
          key={day}
          onClick={() => !isDisabled && openBookingModal(dateStr)}
          className={`p-3 rounded-2xl font-semibold text-center transition-all ${cellClass} flex flex-col items-center justify-center min-h-[60px]`}
        >
          <div className="text-xl">{day}</div>
          {bookedLabel && (
            <div className="text-[10px] mt-0.5 leading-tight font-extrabold text-red-600 bg-white/95 px-1.5 py-0.5 rounded">{bookedLabel}</div>
          )}
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
                    {"Today's Hours"}
                  </p>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-pink-600 text-white">
                    {'TODAY'}
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
                  {'Mon: Closed | Tue-Thu: 3-8 PM | Fri: 3-9 PM | Sat: 12-9 PM | Sun/Holiday: 12-6 PM'}
                </p>

                <div className="md:hidden mt-3 flex flex-wrap items-center gap-2">
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
                      ? ('Hide weekly hours')
                      : ('Show weekly hours')}
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

      {/* Current Event Banner (closable strip, auto-switches state by date) */}
      {activeEvent && !isEventBannerClosed && (
        <div
          className={`relative text-white ${
            activeEvent.status === 'active'
              ? 'bg-gradient-to-r from-[#ff5fa2] via-[#7c4dff] to-[#4f72d9]'
              : 'bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 py-2.5 md:py-3 pr-12 md:pr-14 flex items-center justify-center gap-2 md:gap-3 text-center text-sm md:text-base leading-snug">
            <span className="text-xl md:text-2xl flex-shrink-0">{activeEvent.emoji}</span>
            {activeEvent.status === 'active' ? (
              <div className="font-semibold">
                <span className="inline-block bg-white/25 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold mr-2 align-middle">
                  {'NOW ON'}
                </span>
                <span>{activeEvent.title_en}</span>
                <span className="mx-2 opacity-60 hidden sm:inline">•</span>
                <span className="font-normal opacity-95 block sm:inline mt-1 sm:mt-0">
                  {activeEvent.desc_en}
                </span>
              </div>
            ) : (
              <div className="font-semibold">
                <span className="inline-block bg-white/25 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold mr-2 align-middle">
                  {'ENDED'}
                </span>
                <span>{activeEvent.title_en}</span>
                <span className="mx-2 opacity-60 hidden sm:inline">•</span>
                <span className="font-normal opacity-95 block sm:inline mt-1 sm:mt-0">
                  {'Check '}
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold hover:text-pink-200"
                  >
                    Instagram
                  </a>
                  <span className="mx-1 opacity-60">/</span>
                  <a
                    href={tiktokLink}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold hover:text-pink-200"
                  >
                    TikTok
                  </a>
                  {' to see the winners 🏆'}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsEventBannerClosed(true)}
            className="absolute top-1/2 right-3 -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all"
            aria-label={'Close banner'}
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      )}

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
                {'New Here? Start in 3 Easy Steps!'}
              </h2>
              <p className="text-center text-gray-600 mb-8">
                {'Simple and fun — start playing as soon as you arrive!'}
              </p>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="rounded-3xl p-6 bg-gradient-to-br from-pink-50 to-white border border-pink-100 shadow-sm">
                  <p className="text-xs font-bold text-pink-500 mb-2">STEP 1</p>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{'Buy Tokens or Recharge Card'}</h3>
                  <p className="text-gray-600 text-sm leading-6">{'Grab tokens at the counter or recharge your membership card and jump right in.'}</p>
                </div>
                <div className="rounded-3xl p-6 bg-gradient-to-br from-violet-50 to-white border border-violet-100 shadow-sm">
                  <p className="text-xs font-bold text-violet-500 mb-2">STEP 2</p>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{'Play Claw Machines & Have Fun'}</h3>
                  <p className="text-gray-600 text-sm leading-6">{'Pick your favorite machine, win plushies, take photos, and enjoy the vibe.'}</p>
                </div>
                <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm">
                  <p className="text-xs font-bold text-blue-500 mb-2">STEP 3</p>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{'Keep Prize or Trade In for Points'}</h3>
                  <p className="text-gray-600 text-sm leading-6">{'Keep your prize, or trade it in for Points to redeem something else from our prize wall.'}</p>
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

      {/* Mode Selection */}
      <div className="max-w-5xl mx-auto px-6 py-12 mt-8 bg-gradient-to-br from-white to-violet-50/60 rounded-3xl shadow-sm">
        <h2 className="text-4xl font-bold text-center mb-10 text-pink-600">{t.selectMode}</h2>
        <div
          className={`grid gap-6 mx-auto ${
            modes.length === 1
              ? 'grid-cols-1 max-w-md'
              : modes.length === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-3xl'
              : 'grid-cols-1 md:grid-cols-3 max-w-5xl'
          }`}
        >
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
                <p className="text-pink-600 font-medium">{t.peopleRange}: {mode.min}–{mode.max} People</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar */}
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
              {displayedMonth.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}
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
            <p className="text-center text-white/70 text-xs mb-4 md:hidden">{'Tap an image to enlarge, tap outside to close'}</p>
            <div
              className={`grid gap-4 mx-auto ${
                detailMode.photos.length === 1
                  ? 'grid-cols-1 max-w-md'
                  : detailMode.photos.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl'
                  : detailMode.photos.length === 3
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl'
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
              }`}
            >
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

      {/* Full-size Image Modal */}
      {bigPhoto && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[70] px-3" onClick={() => setBigPhoto(null)}>
          <button className="absolute top-4 right-4 text-white text-4xl" onClick={() => setBigPhoto(null)}>×</button>
          <img src={bigPhoto} className="max-h-[88vh] max-w-[95vw] rounded-3xl shadow-2xl object-contain" alt="Big Photo" />
        </div>
      )}

      {/* Party Terms Modal — mode-specific content (Unlimited / Private) */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[80] px-4" onClick={() => setIsTermsModalOpen(false)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#3a3aa0]">
                {selectedMode === 'private' ? 'Private Party Room — Terms & Details' : 'Unlimited Token Play Party — Terms & Details'}
              </h3>
              <button onClick={() => setIsTermsModalOpen(false)} className="text-3xl text-gray-400 hover:text-gray-700 leading-none">×</button>
            </div>

            {selectedMode === 'private' ? (
              /* ============ PRIVATE PARTY ROOM (PDF p3 + p4 General Info) ============ */
              <div className="space-y-6 text-gray-800 leading-7">
                <p className="text-xl md:text-2xl font-bold text-[#3a3aa0]">📍 Private Room for Two Hours</p>

                <div>
                  <p className="text-lg font-bold text-[#3a3aa0] mb-2">Available Time Slots</p>
                  <ul className="list-disc list-inside space-y-1 text-base">
                    <li><span className="font-bold">Saturday:</span> 1 PM, 3:30 PM, 6 PM</li>
                    <li><span className="font-bold">Sunday & Holiday:</span> 1 PM, 3:30 PM</li>
                    <li><span className="font-bold">Tue – Fri:</span> 3:30 PM, 6 PM</li>
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border-2 border-pink-200 bg-pink-50/50 p-5">
                    <p className="text-sm font-bold text-pink-500 uppercase tracking-wide">Package A</p>
                    <p className="text-2xl font-extrabold text-[#3a3aa0] mt-1">Starter Claw</p>
                    <p className="text-3xl font-black text-pink-600 mt-2">$139 <span className="text-base font-bold text-gray-600">+ GST</span></p>
                    <p className="text-sm text-gray-600 italic mt-1">For parties of up to 5 people</p>
                    <ul className="list-disc list-inside text-sm space-y-1 mt-3 text-gray-700">
                      <li>40 free tokens</li>
                      <li>Keep all your catches</li>
                      <li>Private Party Room with table & chairs</li>
                      <li>Better day-of token rates</li>
                      <li>Nintendo Switch 2 console with games</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/50 p-5">
                    <p className="text-sm font-bold text-violet-500 uppercase tracking-wide">Package B</p>
                    <p className="text-2xl font-extrabold text-[#3a3aa0] mt-1">Ultimate Claw</p>
                    <p className="text-3xl font-black text-violet-600 mt-2">$229 <span className="text-base font-bold text-gray-600">+ GST</span></p>
                    <p className="text-sm text-gray-600 italic mt-1">For parties of up to 10 people</p>
                    <ul className="list-disc list-inside text-sm space-y-1 mt-3 text-gray-700">
                      <li>80 free tokens</li>
                      <li>Keep all your catches</li>
                      <li>1 custom goodie bag</li>
                      <li>Private Party Room with table & chairs</li>
                      <li>Better day-of token rates</li>
                      <li>Nintendo Switch 2 console with games</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="text-lg font-bold text-[#3a3aa0] mb-2">Deposit & Cancellation Policy</p>
                  <p className="text-sm">To confirm your booking, a <span className="font-bold">$100 payment</span> is required: includes a <span className="font-bold">$50 non-refundable deposit</span> and an additional <span className="font-bold">$50 refundable cancellation portion</span>.</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>More than 48 hours' notice: $50 is refunded</li>
                    <li>Less than 48 hours' notice: the full $100 is non-refundable</li>
                  </ul>
                  <p className="text-sm italic mt-2">If the party moves forward as scheduled, the full $100 is applied to the final bill.</p>
                </div>

                <div>
                  <p className="text-lg font-bold text-[#3a3aa0] mb-2">General Information</p>
                  <ul className="list-disc list-inside space-y-1.5 text-sm">
                    <li>Table & chairs are provided.</li>
                    <li>All attendees receive a better token rate after the event by showing the hand stamp at the front desk.</li>
                    <li>Each booking includes <span className="font-bold">2 hours of total event time</span> (15 minutes before scheduled start for setup and 15 minutes after for cleanup).</li>
                    <li>An additional <span className="font-bold">$40 fee</span> applies for every 15 minutes the event runs over the scheduled time.</li>
                    <li>At the end of the event, please return the party area to its original condition (remove balloons, ribbons, tape, signs, etc.).</li>
                  </ul>
                </div>

                <div>
                  <p className="text-lg font-bold text-[#3a3aa0] mb-2">Strictly Prohibited</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>NO alcoholic beverages</li>
                    <li>NO candles or any open flame</li>
                    <li>NO piñatas, bubbles, slime, or water guns</li>
                    <li>NO smoking or vaping of any kind</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">If you are unsure about a specific item, please contact us at 604.812.2529 or info@clawzonearcade.com.</p>
                </div>

                <p className="text-xs text-gray-500 italic border-t border-gray-200 pt-4">
                  Prices are subject to change without prior notice. Clawzone Arcade Ltd. reserves the right to make the final decision on all matters.
                </p>
              </div>
            ) : (
              /* ============ UNLIMITED TOKEN PLAY PARTY (PDF p2 + p4) ============ */
              <div className="space-y-6 text-gray-800 leading-7">
                <p className="text-xl md:text-2xl font-bold text-[#3a3aa0]">📍 Exclusive Use of the Entire Arcade for Two Hours!</p>

                <div>
                  <p className="text-lg font-bold text-[#3a3aa0] mb-2">What's Included</p>
                  <ul className="list-disc list-inside space-y-1.5 text-sm">
                    <li>Get <span className="font-bold">unlimited tokens</span> for your entire party for <span className="font-bold">1 hour and 15 minutes</span> of unlimited play.</li>
                    <li>Each player keeps <span className="font-bold">one prize</span> (one plush or one keychain) from the regular blue/pink claw machines.</li>
                    <li>The Birthday Star or Event Host receives <span className="font-bold">one custom goodie bag</span>.</li>
                    <li>Same-day token purchase for all attendees at a discount.</li>
                    <li>Unlimited Players 3 years or older are counted into party size.</li>
                    <li>From birthday parties and graduations to company events and bridal outings — everyone is welcome. No special occasion? Just want to play? We won't judge!</li>
                  </ul>
                </div>

                {/* Pricing Table — matches PDF layout (header + side notes) */}
                <div>
                  <p className="text-lg font-bold text-[#3a3aa0] mb-3">Pricing</p>
                  <div className="grid md:grid-cols-[2fr_1fr] gap-4 items-start">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-center text-sm">
                        <thead>
                          <tr className="bg-pink-50">
                            <th rowSpan={2} className="border-2 border-[#3a3aa0]/30 px-3 py-3 align-middle font-bold text-[#3a3aa0] leading-tight">
                              Number of<br/>Unlimited<br/>Players
                            </th>
                            <th className="border-2 border-[#3a3aa0]/30 px-3 pt-3 pb-1 font-extrabold text-base text-[#3a3aa0]">Sat.</th>
                            <th className="border-2 border-[#3a3aa0]/30 px-3 pt-3 pb-1 font-extrabold text-base text-[#3a3aa0]">Sun. &amp; Holiday</th>
                            <th className="border-2 border-[#3a3aa0]/30 px-3 pt-3 pb-1 font-extrabold text-base text-[#3a3aa0]">Tue. – Fri.</th>
                          </tr>
                          <tr className="bg-pink-50">
                            <th className="border-2 border-[#3a3aa0]/30 px-2 pb-2 text-xs font-medium text-[#3a3aa0]">10 a–12 p</th>
                            <th className="border-2 border-[#3a3aa0]/30 px-2 pb-2 text-xs font-medium text-[#3a3aa0]">10 a–12 p <span className="font-bold">OR</span><br/>6:15–8:15 p</th>
                            <th className="border-2 border-[#3a3aa0]/30 px-2 pb-2 text-xs font-medium text-[#3a3aa0]">10 a–12 p<br/><span className="font-bold">OR</span> 1–3 p</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border-2 border-[#3a3aa0]/30 px-3 py-3 font-bold bg-white">1—10</td>
                            <td className="border-2 border-[#3a3aa0]/30 px-3 py-3 font-bold bg-white">$399</td>
                            <td className="border-2 border-[#3a3aa0]/30 px-3 py-3 font-bold bg-white">$399</td>
                            <td className="border-2 border-[#3a3aa0]/30 px-3 py-3 font-bold bg-white">$349</td>
                          </tr>
                          <tr>
                            <td className="border-2 border-[#3a3aa0]/30 px-3 py-3 font-bold bg-white">11—15</td>
                            <td className="border-2 border-[#3a3aa0]/30 px-3 py-3 font-bold bg-white">$549</td>
                            <td className="border-2 border-[#3a3aa0]/30 px-3 py-3 font-bold bg-white">$549</td>
                            <td className="border-2 border-[#3a3aa0]/30 px-3 py-3 font-bold bg-white">$449</td>
                          </tr>
                          <tr>
                            <td className="border-2 border-[#3a3aa0]/30 px-3 py-3 font-bold bg-white">16—20</td>
                            <td className="border-2 border-[#3a3aa0]/30 px-3 py-3 font-bold bg-white">$699</td>
                            <td className="border-2 border-[#3a3aa0]/30 px-3 py-3 font-bold bg-white">$699</td>
                            <td className="border-2 border-[#3a3aa0]/30 px-3 py-3 font-bold bg-white">$549</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-sm space-y-2 md:pt-2 md:pl-2">
                      <p className="font-bold text-[#3a3aa0]">Additional price per person for parties OVER 20 players:</p>
                      <p className="ml-3">• Weekend <span className="font-bold">$24.99</span> each</p>
                      <p className="ml-3">• Weekday <span className="font-bold">$18.99</span> each</p>
                      <p className="font-bold italic text-[#3a3aa0] mt-3">Maximum 24 players</p>
                      <p className="italic text-gray-600">GST applies to all pricing.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-lg font-bold text-[#3a3aa0] mb-2">Deposit & Cancellation Policy</p>
                  <p className="text-sm">To confirm your booking, a <span className="font-bold">$200 payment</span> is required: includes a <span className="font-bold">$100 non-refundable deposit</span> and an additional <span className="font-bold">$100 refundable cancellation portion</span>.</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>More than 48 hours' notice: $100 is refunded</li>
                    <li>Less than 48 hours' notice: the full $200 is non-refundable</li>
                  </ul>
                  <p className="text-sm italic mt-2">If the party moves forward as scheduled, the full $200 is applied to the final bill.</p>
                </div>

                <div>
                  <p className="text-lg font-bold text-[#3a3aa0] mb-2">Terms & Conditions</p>
                  <ul className="list-disc list-inside space-y-1.5 text-sm">
                    <li>Unlimited play may end earlier than 1 hour and 15 minutes at the host's request. At the end of the unlimited play period, all remaining tokens and any extra prizes will be collected.</li>
                    <li><span className="font-bold">No food or drinks other than water</span> are allowed during the unlimited play period. Food, cake, snacks, and beverages (except water) are permitted only after the unlimited play period has ended.</li>
                    <li>Unlimited Players 3 years or older are counted into party size.</li>
                    <li>Capsule machines and Blind Box machines will not be available during unlimited-play events.</li>
                    <li>Each player keeps one prize (one plush or one keychain) from the regular blue/pink claw machines. Prizes from <span className="font-bold">Giant, Lucky, and Red machines</span> are not included.</li>
                    <li>Extra charges apply: excluded machine prizes if opened, soiled, or damaged — <span className="font-bold">$20 per prize</span>; other machines damaged/soiled prizes — <span className="font-bold">$10 per prize</span>.</li>
                    <li>Parents and guardians are responsible for all minors during the event. Machines with small items are stocked and counted before and after; any discrepancies may be charged accordingly.</li>
                  </ul>
                </div>

                <div>
                  <p className="text-lg font-bold text-[#3a3aa0] mb-2">General Information</p>
                  <ul className="list-disc list-inside space-y-1.5 text-sm">
                    <li>Table space and chairs are provided; however, seating is only guaranteed for the number of unlimited players included in the party package.</li>
                    <li>All attendees receive a better token rate after the event by showing the hand stamp at the front desk.</li>
                    <li>Each booking includes <span className="font-bold">2 hours of total event time</span> (15 minutes before scheduled start for setup and 15 minutes after for cleanup).</li>
                    <li>An additional <span className="font-bold">$40 fee</span> applies for every 15 minutes the event runs over the scheduled time.</li>
                    <li>At the end of the event, please return the party area to its original condition (remove balloons, ribbons, tape, signs, etc.).</li>
                  </ul>
                </div>

                <div>
                  <p className="text-lg font-bold text-[#3a3aa0] mb-2">Strictly Prohibited</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>NO alcoholic beverages</li>
                    <li>NO candles or any open flame</li>
                    <li>NO piñatas, bubbles, slime, or water guns</li>
                    <li>NO smoking or vaping of any kind</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-2">If you are unsure about a specific item, please contact us at 604.812.2529 or info@clawzonearcade.com.</p>
                </div>

                <p className="text-xs text-gray-500 italic border-t border-gray-200 pt-4">
                  Prices are subject to change without prior notice. Clawzone Arcade Ltd. reserves the right to make the final decision on all matters.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4" onClick={() => { if (submitStatus !== 'loading') setIsModalOpen(false); }}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

            {/* Loading */}
            {submitStatus === 'loading' && (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
                <p className="text-gray-600 font-semibold">{'Submitting...'}</p>
              </div>
            )}

            {/* Success */}
            {submitStatus === 'success' && (
              <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                <h3 className="text-2xl font-bold text-gray-900">{'🎉 Booking Received!'}</h3>
                <p className="text-gray-600 text-sm leading-6">
                  {`A confirmation email has been sent. Please complete the ${selectedMode === 'private' ? '$100' : '$200'} CAD E-transfer deposit within 24 hours.`}
                </p>
                {bookingId && (
                  <div className="bg-pink-50 rounded-2xl px-6 py-3 border border-pink-200">
                    <p className="text-xs text-gray-500 mb-1">{'Booking ID (use as E-transfer note)'}</p>
                    <p className="text-2xl font-black text-pink-600 tracking-widest">{bookingId}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-2xl px-5 py-3 text-sm text-gray-700 text-left w-full">
                  <p className="font-semibold mb-1">💸 E-transfer to: <span className="text-pink-600">info@clawzonearcade.com</span></p>
                  <p>{'Note: '}<span className="font-bold">{bookingId}</span></p>
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
                <h3 className="text-2xl font-bold text-gray-900">{'Submission Failed'}</h3>
                <p className="text-gray-600 text-sm">{'Please try again or call +1 (604) 812-2529'}</p>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setSubmitStatus('idle')} className="px-6 py-3 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600 transition-all">{'Try Again'}</button>
                  <button onClick={() => { setIsModalOpen(false); setSubmitStatus('idle'); }} className="px-6 py-3 border border-gray-300 text-gray-600 rounded-full font-bold hover:bg-gray-50 transition-all">{t.cancel}</button>
                </div>
              </div>
            )}

            {/* Form */}
            {submitStatus === 'idle' && (
              <>
                <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">
                  {`Book for ${selectedDate}`}
                </h3>
            <form onSubmit={handleBooking} className="space-y-5">
              <select
                value={selectedMode}
                onChange={(e) => {
                  const modeId = e.target.value;
                  setSelectedMode(modeId);
                  setExtraPlayers(0);
                }}
                className="w-full border rounded-xl px-4 py-3 text-gray-900"
                required
              >
                <option value="">Select activity mode</option>
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
                    {"Check this box if it's a birthday celebration"}
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
                      <option value="">{'Select Gender'}</option>
                      <option value="boy">{'Boy'}</option>
                      <option value="girl">{'Girl'}</option>
                    </select>
                    <input
                      type="text"
                      placeholder={'Celebrant Name'}
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
                      {'Group Size'}
                    </label>
                    <select
                      value={
                        people >= 20 ? 20 :
                        people === 15 ? 15 :
                        people === 10 ? 10 :
                        9 /* 1-9 bucket */
                      }
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v === 9) {
                          setPeople(2); // default within 1-9 range
                        } else {
                          setPeople(v);
                        }
                        setExtraPlayers(0);
                      }}
                      className="w-full border rounded-xl px-4 py-3 text-gray-900"
                    >
                      <option value={9}>1–9 (small group)</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                    </select>
                    </div>

                  {/* 1–9 bucket: ask exact count */}
                  {people < 10 && (
                    <div className="rounded-xl border p-3">
                      <label className="text-sm font-semibold text-gray-700 block mb-2">
                        {'Exact number of players (1–9)'}
                      </label>
                      <input
                        type="number"
                        value={people}
                        onChange={(e) => setPeople(Math.max(1, Math.min(9, Number(e.target.value) || 1)))}
                        min={1}
                        max={9}
                        className="w-full border rounded-xl px-4 py-3 text-gray-900"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">1–9 players use the same 10 player package price.</p>
                    </div>
                  )}

                  {/* 20+ bucket: extra players */}
                  {people >= 20 && (
                    <div className="rounded-xl border p-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        {'Extra Players (only available when 20 is selected, max 24)'}
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
                  )}

                  <p className="text-sm text-gray-600">
                    {`Total players: ${people}`}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="number"
                    value={people}
                    onChange={(e) => setPeople(Number(e.target.value))}
                    min={modes.find(m => m.id === selectedMode)?.min || 1}
                    max={modes.find(m => m.id === selectedMode)?.max || 24}
                    className="w-full border rounded-xl px-4 py-3 text-gray-900 pr-16"
                    required
                  />
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
                  {'I have read and agree to the Party Terms & Details'}
                  {agreedTermsAt && (
                    <span className="block text-xs text-gray-500 mt-1">
                      {`Accepted at: ${agreedTermsAt}`}
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

      {/* FAQ */}
      <FAQSection />

      {/* Beta Notice Popup */}
      {showBeta && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              {'Website Under Testing'}
            </h2>
            <p className="text-gray-600 text-sm leading-6 mb-6">
              {'Our website is currently in testing — some features may not be fully functional. For bookings or enquiries, please call or DM us on Instagram!'}
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowBeta(false)} className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 transition-all">
                {'Got it, continue browsing'}
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
      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-2xl font-bold mb-2">Clawzone Arcade</p>
          <p className="text-lg">4680 Hastings St, Burnaby, BC • +1 (604) 812-2529 • info@clawzonearcade.com</p>
        </div>
      </footer>
    </div>
  );
}
