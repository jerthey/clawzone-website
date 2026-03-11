'use client';

import { useState, useEffect } from 'react';
import { Users, Gift, Flame, X, Globe } from 'lucide-react';

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

const logoUrl = "https://i.imgur.com/SC834dZ.jpg";

const translations = {
  zh: {
    title: "CLAWZONE",
    hero1: "Unlimited Birthday Party",
    hero2: "Private Party Room",
    hero3: "Candle Making 手工課",
    bookNow: "立即預約",
    selectMode: "選擇你的活動模式",
    unlimited: "Unlimited Birthday Party",
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
    hero1: "Unlimited Birthday Party",
    hero2: "Private Party Room",
    hero3: "Candle Making Workshop",
    bookNow: "Book Now",
    selectMode: "Choose Your Activity Mode",
    unlimited: "Unlimited Birthday Party",
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

export default function Clawzone() {
  const [language, setLanguage] = useState<'zh' | 'en'>('en');
  const t = translations[language];

  const [heroIndex, setHeroIndex] = useState(0);
  const heroTexts = [t.hero1, t.hero2, t.hero3];

  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [people, setPeople] = useState(1);
  const [hostName, setHostName] = useState('');
  const [rawPhone, setRawPhone] = useState('');
  const [email, setEmail] = useState('');
  const [time, setTime] = useState('10:00 - 12:00');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailMode, setDetailMode] = useState<any>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>(['10:00 - 12:00']);
  const [bigPhoto, setBigPhoto] = useState<string | null>(null);

  const modes = [
    { id: 'unlimited', name: t.unlimited, max: 25, min: 1, desc: t.unlimitedDesc, detail: t.unlimitedDetail, icon: Gift, color: 'bg-pink-500', photos: storePhotos },
    { id: 'private', name: t.private, max: 15, min: 1, desc: t.privateDesc, detail: t.privateDetail, icon: Users, color: 'bg-purple-500', photos: storePhotos },
    { id: 'candle', name: t.candle, max: 10, min: 2, desc: t.candleDesc, detail: t.candleDetail, icon: Flame, color: 'bg-orange-500', photos: candlePhotos }
  ];

  const bcHolidays2026 = ['2026-01-01','2026-02-16','2026-04-03','2026-05-18','2026-07-01','2026-08-03','2026-09-07','2026-09-30','2026-10-12','2026-11-11','2026-12-25'];

  const googleRating = 4.8;
  const googleReviewCount = 186;
  const contactPhone = '+1-604-812-2529';
  const instagramLink = 'https://instagram.com/clawzonearcade';
  const tiktokLink = 'https://www.tiktok.com/@clawzonearcade';

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

  useEffect(() => {
    const heroTimer = setInterval(() => setHeroIndex(i => (i + 1) % 3), 3000);
    const photoTimer = setInterval(() => setCurrentPhoto(p => (p + 1) % storePhotos.length), 3500);
    return () => { clearInterval(heroTimer); clearInterval(photoTimer); };
  }, []);

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
    setSelectedDate(dateStr);
    setAvailableTimes(times);
    setTime(times[0]);
    setPeople(1);
    setRawPhone('');
    setEmail('');
    setIsModalOpen(true);
    setError('');
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
    if (people < mode.min) { setError(`最少需要 ${mode.min} 人`); return false; }
    if (people > mode.max) { setError(`最多只能 ${mode.max} 人`); return false; }
    setError('');
    return true;
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPeople() || !selectedMode) {
      setError('請選擇活動模式');
      return;
    }

    const modeName = modes.find(m => m.id === selectedMode)?.name || '';
    const alertText = t.successAlert
      .replace('{date}', selectedDate)
      .replace('{time}', time)
      .replace('{mode}', modeName)
      .replace('{people}', people.toString())
      .replace('{email}', email);

    alert(alertText);
    setIsModalOpen(false);
  };

  const renderCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarCells = [];

    for (let i = 0; i < firstWeekday; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="p-4" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDateLocal(date);
      const weekday = date.getDay();
      const isHoliday = bcHolidays2026.includes(dateStr);
      const isMondayClosed = weekday === 1 && !isHoliday;
      const isPastDate = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
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
    <div className="bg-pink-50 min-h-screen font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logoUrl} className="w-14 h-14 rounded-2xl shadow-lg" alt="Logo" />
            <h1 className="text-4xl font-bold text-pink-600 tracking-wider" style={{ textShadow: '0 0 12px #ff69b4, 0 0 25px #ff69b4' }}>{t.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold shadow-lg transition-all"
            >
              <Globe className="w-5 h-5" />
              {language === 'zh' ? 'English' : '中文'}
            </button>
            <a href="#booking" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg">{t.bookNow}</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 text-white py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-6xl font-bold mb-4 transition-all" style={{ textShadow: '0 0 12px #ff69b4, 0 0 25px #ff69b4' }}>
            {heroTexts[heroIndex]}
          </h2>
          <a href="#booking" className="inline-block bg-white text-pink-600 px-10 py-4 rounded-full text-xl font-bold hover:scale-105 shadow-xl">{t.bookNow}</a>
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
      <div className="max-w-5xl mx-auto px-6 py-12 bg-white">
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

      {/* 模式選擇 */}
      <div className="max-w-5xl mx-auto px-6 py-12 bg-white">
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
      <div id="booking" className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-10 text-pink-600">{t.selectDate}</h2>
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
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]" onClick={() => setIsDetailModalOpen(false)}>
          <div className="relative max-w-6xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsDetailModalOpen(false)} className="absolute -top-12 right-4 text-white text-5xl hover:text-pink-400">×</button>
            <h3 className="text-white text-3xl font-bold text-center mb-8">{detailMode.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[70]" onClick={() => setBigPhoto(null)}>
          <img src={bigPhoto} className="max-h-[90vh] max-w-[95vw] rounded-3xl shadow-2xl object-contain" alt="Big Photo" />
        </div>
      )}

      {/* 預約 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900">預約 {selectedDate}</h3>
            <form onSubmit={handleBooking} className="space-y-5">
              <select value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-gray-900" required>
                <option value="">選擇活動模式</option>
                {modes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <input type="text" placeholder={t.hostName} value={hostName} onChange={(e) => setHostName(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-gray-900" />
              <input type="tel" placeholder={t.phone} value={formatPhoneDisplay(rawPhone)} onChange={(e) => setRawPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full border rounded-xl px-4 py-3 text-gray-900" required />
              <input type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-gray-900" required />
              <div className="relative">
                <input type="number" value={people} onChange={(e) => setPeople(Number(e.target.value))} min="1" max={modes.find(m => m.id === selectedMode)?.max || 25} className="w-full border rounded-xl px-4 py-3 text-gray-900 pr-16" required />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">{t.people}</span>
              </div>
              <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-gray-900">
                {availableTimes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {error && <p className="text-red-500 text-center font-medium">{error}</p>}
              <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-bold text-xl">
                {t.confirm}
              </button>
            </form>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 text-gray-500 w-full">{t.cancel}</button>
          </div>
        </div>
      )}

      {/* Trust Elements */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-4xl font-bold text-center mb-10 text-pink-600">{t.trustTitle}</h2>

        <div className="grid md:grid-cols-3 gap-6">
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

          <div className="bg-white rounded-3xl p-6 shadow-lg border border-pink-100">
            <p className="text-gray-500 mb-3">{t.policyTitle}</p>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              <li>{t.policy1}</li>
              <li>{t.policy2}</li>
              <li>{t.policy3}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-[80] flex flex-col gap-3">
        <a href="#booking" className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-full shadow-xl font-semibold text-center">
          {t.bookNow}
        </a>
        <a href={`tel:${contactPhone}`} className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-full shadow-xl font-semibold text-center">
          {t.callNow}
        </a>
        <a href={instagramLink} target="_blank" rel="noreferrer" className="bg-gradient-to-r from-fuchsia-500 to-orange-500 hover:opacity-90 text-white px-5 py-3 rounded-full shadow-xl font-semibold text-center">
          {t.instagramNow}
        </a>
        <a href={tiktokLink} target="_blank" rel="noreferrer" className="bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-full shadow-xl font-semibold text-center">
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