'use client';

import { useState, useEffect } from 'react';
import { Users, Gift, Flame, X, Globe } from 'lucide-react';

const photos = [
  "https://i.imgur.com/VST9B73.jpg",
  "https://i.imgur.com/RXSP1Rm.jpg",
  "https://i.imgur.com/yJXCMg3.jpg",
  "https://i.imgur.com/nyl0Pcc.jpg",
  "https://i.imgur.com/nYhHJjG.jpg"
];

const logoUrl = "https://i.imgur.com/SC834dZ.jpg";  // 卡通貓 Logo

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
    tokensTitle: "普通買幣價格"
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
    tokensTitle: "Regular Token Prices"
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

  const modes = [
    { id: 'unlimited', name: t.unlimited, max: 25, min: 1, desc: t.unlimitedDesc, detail: t.unlimitedDetail, icon: Gift, color: 'bg-pink-500' },
    { id: 'private', name: t.private, max: 15, min: 1, desc: t.privateDesc, detail: t.privateDetail, icon: Users, color: 'bg-purple-500' },
    { id: 'candle', name: t.candle, max: 10, min: 2, desc: t.candleDesc, detail: t.candleDetail, icon: Flame, color: 'bg-orange-500' }
  ];

  const bcHolidays2026 = ['2026-01-01','2026-02-16','2026-04-03','2026-05-18','2026-07-01','2026-08-03','2026-09-07','2026-09-30','2026-10-12','2026-11-11','2026-12-25'];

  useEffect(() => {
    const heroTimer = setInterval(() => setHeroIndex(i => (i + 1) % 3), 3000);
    const photoTimer = setInterval(() => setCurrentPhoto(p => (p + 1) % photos.length), 3500);
    return () => { clearInterval(heroTimer); clearInterval(photoTimer); };
  }, []);

  const formatPhoneDisplay = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 10);
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0,3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0,3)}) ${numbers.slice(3,6)}-${numbers.slice(6)}`;
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
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i);
      const dateStr = date.toISOString().split('T')[0];
      const weekday = date.getDay();
      const isHoliday = bcHolidays2026.includes(dateStr);
      const isMondayClosed = weekday === 1 && !isHoliday;

      days.push(
        <div
          key={i}
          onClick={() => !isMondayClosed && openBookingModal(dateStr)}
          className={`p-4 rounded-2xl text-xl font-semibold text-center transition-all
            ${isMondayClosed ? 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none' : 'bg-emerald-400 hover:bg-emerald-500 text-white cursor-pointer'}`}
        >
          {i}
        </div>
      );
    }
    return days;
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

      {/* Buy Tokens 價格表 */}
      <div className="max-w-5xl mx-auto px-6 py-12 bg-white">
        <h2 className="text-4xl font-bold text-center mb-10 text-pink-600">{t.buyTokens}</h2>
        <div className="grid md:grid-cols-5 gap-4 text-center">
          <div className="bg-pink-50 p-6 rounded-3xl">
            <div className="text-2xl font-bold">5 Tokens</div>
            <div className="text-5xl font-bold text-pink-600">$5</div>
          </div>
          <div className="bg-pink-50 p-6 rounded-3xl">
            <div className="text-2xl font-bold">10 Tokens</div>
            <div className="text-5xl font-bold text-pink-600">$10</div>
          </div>
          <div className="bg-pink-50 p-6 rounded-3xl">
            <div className="text-2xl font-bold">22 Tokens</div>
            <div className="text-5xl font-bold text-pink-600">$20</div>
          </div>
          <div className="bg-pink-50 p-6 rounded-3xl">
            <div className="text-2xl font-bold">60 Tokens</div>
            <div className="text-5xl font-bold text-pink-600">$50</div>
          </div>
          <div className="bg-pink-50 p-6 rounded-3xl">
            <div className="text-2xl font-bold">130 Tokens</div>
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

      {/* Workshop 背景 */}
      <div className="max-w-6xl mx-auto px-6 py-16 bg-cover bg-center h-[600px] relative" style={{ backgroundImage: 'url("https://i.imgur.com/474480019_628607779692888_4824997931681205573_n.jpg")' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-white text-center pt-40">
          <h2 className="text-6xl font-bold mb-6">{t.candle}</h2>
          <p className="text-2xl">2-3人即可開課 • 最多10人</p>
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

              <input 
                type="tel" 
                placeholder={t.phone}
                value={formatPhoneDisplay(rawPhone)}
                onChange={(e) => setRawPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full border rounded-xl px-4 py-3 text-gray-900"
                required 
              />

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

      {/* 模式詳細 Modal */}
      {isDetailModalOpen && detailMode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-3xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="relative">
              <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow">
                <X className="w-6 h-6" />
              </button>
              <div className="h-80 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                <detailMode.icon className="w-24 h-24 text-white" />
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold mb-4 text-gray-900">{detailMode.name}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{detailMode.detail}</p>
              <div className="mt-8 flex gap-4">
                <button onClick={handleNowBook} className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-bold">
                  {t.book}
                </button>
                <button onClick={() => setIsDetailModalOpen(false)} className="flex-1 border border-gray-300 hover:bg-gray-50 py-4 rounded-2xl font-medium text-gray-700">
                  {t.later}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-2xl font-bold mb-2">Clawzone Claw Machine Paradise</p>
          <p className="text-lg">4680 Hastings St, Burnaby, BC • info@clawzonearcade.com</p>
        </div>
      </footer>
    </div>
  );
}