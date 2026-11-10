import React, { useState, useEffect } from 'react';
import { soundEffects } from '../../utils/audio';
import { Sparkles, CheckCircle2, ArrowRight, RotateCcw, HelpCircle, Layers } from 'lucide-react';

interface MemoryCard {
  uniqueId: string;
  pairId: string;
  type: 'image' | 'label';
  title: string;
  sub: string;
  iconSvg?: string;
  imageType: 'biduk' | 'pari' | 'belantik' | 'skorpio' | 'kompas' | 'anak_bulan' | 'bulan_sabit' | 'bulan_separa' | 'bulan_purnama';
}

interface ImageMatchMemoryGameProps {
  stepIndex: number; // 4 (Checkpoint 5), 5 (Checkpoint 6), 6 (Checkpoint 7)
  onComplete: () => void;
  onCancel: () => void;
}

export const ImageMatchMemoryGame: React.FC<ImageMatchMemoryGameProps> = ({
  stepIndex,
  onComplete,
  onCancel
}) => {
  // Build cards based on step topic
  const getDeck = (): MemoryCard[] => {
    if (stepIndex === 4) {
      // Checkpoint 5: Navigasi Arah (Biduk -> Utara, Pari -> Selatan, Kompas -> Pelayaran)
      return [
        {
          uniqueId: 'biduk-img',
          pairId: 'biduk',
          type: 'image',
          title: 'Buruj Biduk',
          sub: 'Gugusan 7 Bintang',
          imageType: 'biduk'
        },
        {
          uniqueId: 'biduk-lbl',
          pairId: 'biduk',
          type: 'label',
          title: 'Petunjuk Arah Utara',
          sub: 'Dua bintang depan menunjuk ke arah utara',
          imageType: 'biduk'
        },
        {
          uniqueId: 'pari-img',
          pairId: 'pari',
          type: 'image',
          title: 'Buruj Pari',
          sub: 'Gugusan 4 Bintang',
          imageType: 'pari'
        },
        {
          uniqueId: 'pari-lbl',
          pairId: 'pari',
          type: 'label',
          title: 'Petunjuk Arah Selatan',
          sub: 'Buruj paling kecil menunjuk ke arah selatan',
          imageType: 'pari'
        },
        {
          uniqueId: 'kompas-img',
          pairId: 'kompas',
          type: 'image',
          title: 'Kompas Angkasa Purba',
          sub: 'Panduan Pelayar',
          imageType: 'kompas'
        },
        {
          uniqueId: 'kompas-lbl',
          pairId: 'kompas',
          type: 'label',
          title: 'Navigasi Pengembara',
          sub: 'Digunakan pelayar purba di laut waktu malam',
          imageType: 'kompas'
        }
      ];
    } else if (stepIndex === 5) {
      // Checkpoint 6: Petunjuk Musim (Biduk -> Menanam, Belantik -> Sejuk, Skorpio -> Menuai)
      return [
        {
          uniqueId: 'biduk-musim-img',
          pairId: 'biduk-musim',
          type: 'image',
          title: 'Buruj Biduk',
          sub: 'Bentuk Gayung',
          imageType: 'biduk'
        },
        {
          uniqueId: 'biduk-musim-lbl',
          pairId: 'biduk-musim',
          type: 'label',
          title: 'Petunjuk Musim Menanam',
          sub: 'Petani bersedia menanam gandum bila muncul',
          imageType: 'biduk'
        },
        {
          uniqueId: 'belantik-img',
          pairId: 'belantik',
          type: 'image',
          title: 'Buruj Belantik',
          sub: 'Bentuk Pemburu',
          imageType: 'belantik'
        },
        {
          uniqueId: 'belantik-lbl',
          pairId: 'belantik',
          type: 'label',
          title: 'Petunjuk Musim Sejuk',
          sub: 'Muncul menandakan musim sejuk bermula',
          imageType: 'belantik'
        },
        {
          uniqueId: 'skorpio-img',
          pairId: 'skorpio',
          type: 'image',
          title: 'Buruj Skorpio',
          sub: 'Bentuk Kala Jengking',
          imageType: 'skorpio'
        },
        {
          uniqueId: 'skorpio-lbl',
          pairId: 'skorpio',
          type: 'label',
          title: 'Petunjuk Musim Menuai',
          sub: 'Petani mula menuai hasil tanaman gandum',
          imageType: 'skorpio'
        }
      ];
    } else {
      // Checkpoint 7: Fasa Bulan & Takwim Qamari (Anak Bulan, Bulan Sabit, Bulan Separa, Bulan Purnama)
      return [
        {
          uniqueId: 'anak-img',
          pairId: 'anak',
          type: 'image',
          title: 'Anak Bulan',
          sub: 'Gelap Menghadap Bumi',
          imageType: 'anak_bulan'
        },
        {
          uniqueId: 'anak-lbl',
          pairId: 'anak',
          type: 'label',
          title: 'Hari 1 Takwim Qamari',
          sub: 'Bermulanya bulan baharu Hijrah',
          imageType: 'anak_bulan'
        },
        {
          uniqueId: 'sabit-img',
          pairId: 'sabit',
          type: 'image',
          title: 'Bulan Sabit',
          sub: 'Sebahagian Kecil Disinari',
          imageType: 'bulan_sabit'
        },
        {
          uniqueId: 'sabit-lbl',
          pairId: 'sabit',
          type: 'label',
          title: 'Hari 3, 4, 5 & 6 Qamari',
          sub: 'Bulan sabit melengkung nipis di langit',
          imageType: 'bulan_sabit'
        },
        {
          uniqueId: 'separa-img',
          pairId: 'separa',
          type: 'image',
          title: 'Bulan Separa',
          sub: 'Separuh Permukaan Disinari',
          imageType: 'bulan_separa'
        },
        {
          uniqueId: 'separa-lbl',
          pairId: 'separa',
          type: 'label',
          title: 'Hari 7 & 8 Takwim Qamari',
          sub: 'Separuh bahagian cerah kelihatan',
          imageType: 'bulan_separa'
        },
        {
          uniqueId: 'purnama-img',
          pairId: 'purnama',
          type: 'image',
          title: 'Bulan Purnama',
          sub: 'Bulat Terang Sepenuhnya',
          imageType: 'bulan_purnama'
        },
        {
          uniqueId: 'purnama-lbl',
          pairId: 'purnama',
          type: 'label',
          title: 'Hari Ke-15 Takwim Qamari',
          sub: 'Pertengahan setiap bulan Hijrah',
          imageType: 'bulan_purnama'
        }
      ];
    }
  };

  const [cards, setCards] = useState<MemoryCard[]>(() => {
    const raw = getDeck();
    return [...raw].sort(() => Math.random() - 0.5);
  });

  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const totalPairs = cards.length / 2;

  const handleCardClick = (card: MemoryCard) => {
    if (isProcessing) return;
    if (flippedIds.includes(card.uniqueId)) return;
    if (matchedPairIds.includes(card.pairId)) return;

    soundEffects.playClick();
    const nextFlipped = [...flippedIds, card.uniqueId];
    setFlippedIds(nextFlipped);

    // If two cards are flipped, check for match
    if (nextFlipped.length === 2) {
      setIsProcessing(true);
      const firstCard = cards.find(c => c.uniqueId === nextFlipped[0]);
      const secondCard = card;

      if (firstCard && firstCard.pairId === secondCard.pairId) {
        // Matched!
        soundEffects.playCollect();
        const nextMatched = [...matchedPairIds, firstCard.pairId];
        setMatchedPairIds(nextMatched);
        setFlippedIds([]);
        setIsProcessing(false);

        if (nextMatched.length >= totalPairs) {
          soundEffects.playLevelUp();
          setIsComplete(true);
        }
      } else {
        // No match: flip back after short delay
        setTimeout(() => {
          soundEffects.playWrong();
          setFlippedIds([]);
          setIsProcessing(false);
        }, 850);
      }
    }
  };

  const handleReset = () => {
    soundEffects.playClick();
    setCards([...getDeck()].sort(() => Math.random() - 0.5));
    setFlippedIds([]);
    setMatchedPairIds([]);
    setIsProcessing(false);
    setIsComplete(false);
  };

  // Card Graphic Rendering
  const renderCardGraphic = (imageType: MemoryCard['imageType']) => {
    switch (imageType) {
      case 'biduk':
        return (
          <svg viewBox="0 0 50 35" className="w-12 h-9 mx-auto drop-shadow-[0_0_8px_#38bdf8]">
            <path d="M 6,10 L 15,12 L 24,18 L 32,24 L 30,32 L 44,33 L 45,23 Z" stroke="#38BDF8" strokeWidth="2" fill="none" />
            <circle cx="6" cy="10" r="2.5" fill="#FACC15" />
            <circle cx="15" cy="12" r="2.5" fill="#FACC15" />
            <circle cx="24" cy="18" r="2.5" fill="#FACC15" />
            <circle cx="32" cy="24" r="2.5" fill="#FACC15" />
            <circle cx="30" cy="32" r="2.5" fill="#FACC15" />
            <circle cx="44" cy="33" r="2.5" fill="#FACC15" />
            <circle cx="45" cy="23" r="2.5" fill="#FACC15" />
          </svg>
        );
      case 'pari':
        return (
          <svg viewBox="0 0 40 40" className="w-10 h-10 mx-auto drop-shadow-[0_0_8px_#f43f5e]">
            <path d="M 20,4 L 34,20 L 20,36 L 6,20 Z" stroke="#FB7185" strokeWidth="2" fill="none" />
            <line x1="20" y1="4" x2="20" y2="36" stroke="#FB7185" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="6" y1="20" x2="34" y2="20" stroke="#FB7185" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="20" cy="4" r="2.5" fill="#FACC15" />
            <circle cx="34" cy="20" r="2.5" fill="#FACC15" />
            <circle cx="20" cy="36" r="3" fill="#F43F5E" />
            <circle cx="6" cy="20" r="2.5" fill="#FACC15" />
          </svg>
        );
      case 'belantik':
        return (
          <svg viewBox="0 0 40 40" className="w-10 h-10 mx-auto drop-shadow-[0_0_8px_#a855f7]">
            <path d="M 10,8 L 30,8 L 26,20 L 14,20 Z" stroke="#C084FC" strokeWidth="1.5" fill="none" />
            <path d="M 14,20 L 8,34 L 32,34 L 26,20" stroke="#C084FC" strokeWidth="1.5" fill="none" />
            <line x1="16" y1="20" x2="24" y2="20" stroke="#FACC15" strokeWidth="2" />
            <circle cx="10" cy="8" r="2.5" fill="#FACC15" />
            <circle cx="30" cy="8" r="2.5" fill="#FACC15" />
            <circle cx="8" cy="34" r="2.5" fill="#FACC15" />
            <circle cx="32" cy="34" r="2.5" fill="#FACC15" />
          </svg>
        );
      case 'skorpio':
        return (
          <svg viewBox="0 0 50 35" className="w-12 h-9 mx-auto drop-shadow-[0_0_8px_#f97316]">
            <path d="M 8,10 Q 20,8 30,16 T 42,28" stroke="#FB923C" strokeWidth="2" fill="none" />
            <path d="M 42,28 L 46,24 L 40,22" stroke="#FB923C" strokeWidth="2" fill="none" />
            <circle cx="8" cy="10" r="2.5" fill="#FACC15" />
            <circle cx="20" cy="10" r="2.5" fill="#FACC15" />
            <circle cx="30" cy="16" r="2.5" fill="#FACC15" />
            <circle cx="42" cy="28" r="3" fill="#EA580C" />
          </svg>
        );
      case 'kompas':
        return (
          <svg viewBox="0 0 40 40" className="w-10 h-10 mx-auto drop-shadow-[0_0_8px_#38bdf8]">
            <circle cx="20" cy="20" r="16" stroke="#38BDF8" strokeWidth="2" fill="#0F172A" />
            <polygon points="20,8 24,20 20,18" fill="#F43F5E" />
            <polygon points="20,32 24,20 20,22" fill="#CBD5E1" />
            <circle cx="20" cy="20" r="2.5" fill="#FACC15" />
          </svg>
        );
      case 'anak_bulan':
        return (
          <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-700 mx-auto shadow-[inset_0_0_8px_#000]" />
        );
      case 'bulan_sabit':
        return (
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 relative overflow-hidden mx-auto">
            <div className="absolute right-0 w-4 h-10 bg-yellow-300 rounded-r-full shadow-[0_0_8px_#fde047]" />
          </div>
        );
      case 'bulan_separa':
        return (
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 relative overflow-hidden mx-auto">
            <div className="absolute right-0 w-5 h-10 bg-yellow-300 shadow-[0_0_8px_#fde047]" />
          </div>
        );
      case 'bulan_purnama':
        return (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-300 to-amber-200 border-2 border-yellow-100 mx-auto shadow-[0_0_15px_#facc15]" />
        );
      default:
        return null;
    }
  };

  const getTopicTitle = () => {
    if (stepIndex === 4) return 'Pulsar Navigasi – Penunjuk Arah';
    if (stepIndex === 5) return 'Planet Pertanian – Penunjuk Musim';
    return 'Teras Galaksi – Fasa Bulan & Takwim Qamari';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                Suai Padan Memori: {getTopicTitle()}
              </h3>
              <p className="text-xs text-teal-300">
                Balikkan kad bergambar dan padankan dengan pasangannya yang betul!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300">
              Padanan: {matchedPairIds.length} / {totalPairs}
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Semula
            </button>
            <button
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>

        {/* Card Grid Area */}
        <div className="relative flex-1 p-4 sm:p-6 bg-gradient-to-b from-[#060b17] via-[#091224] to-[#040812] overflow-y-auto select-none">
          <div
            className={`grid gap-3 sm:gap-4 max-w-3xl mx-auto ${
              cards.length === 6 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
            }`}
          >
            {cards.map(card => {
              const isFlipped = flippedIds.includes(card.uniqueId);
              const isMatched = matchedPairIds.includes(card.pairId);
              const isOpen = isFlipped || isMatched;

              return (
                <button
                  key={card.uniqueId}
                  onClick={() => handleCardClick(card)}
                  disabled={isOpen || isProcessing}
                  type="button"
                  className={`h-36 sm:h-44 rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer border ${
                    isMatched
                      ? 'bg-emerald-950/80 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : isFlipped
                      ? 'bg-sky-950/90 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-102'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 hover:border-sky-400/50 hover:scale-102'
                  }`}
                >
                  {isOpen ? (
                    <div className="flex flex-col items-center justify-center w-full h-full animate-fadeIn">
                      {/* Card Content (Image or Label) */}
                      {card.type === 'image' ? (
                        <>
                          <div className="mb-2">{renderCardGraphic(card.imageType)}</div>
                          <span className="text-xs font-black text-amber-300 leading-tight">
                            {card.title}
                          </span>
                          <span className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                            {card.sub}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center mb-1.5 border border-sky-400/30">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-black text-sky-200 leading-tight">
                            {card.title}
                          </span>
                          <span className="text-[10px] text-slate-300 mt-1 leading-snug">
                            {card.sub}
                          </span>
                        </>
                      )}

                      {isMatched && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Padan!
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-slate-500">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-1 text-slate-400 shadow-inner">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Galaksi Sains
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Victory Modal Overlay once all pairs matched */}
          {isComplete && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn z-30">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-400 to-emerald-400 flex items-center justify-center text-slate-950 shadow-[0_0_35px_#2DD4BF] mb-3">
                <Sparkles className="w-9 h-9" />
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white mb-1">
                Semua Pasangan Berjaya Dipadankan!
              </h4>
              <p className="text-sm font-semibold text-teal-300 mb-2">
                Hebat! Anda telah menguasai konsep fakta sains bagi stesen ini.
              </p>
              <p className="text-xs text-slate-300 max-w-md mb-6">
                Semua padanan imej dan huraian telah diselaraskan. Buka soalan untuk melengkapkan stesen ini.
              </p>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onComplete();
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-teal-400/30 cursor-pointer active:scale-95 transition-all"
              >
                <span>Buka Cabaran Soalan Eksplorasi</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Kemajuan: <strong className="text-emerald-400">{matchedPairIds.length}</strong> / {totalPairs} Pasangan Padan
          </div>
          <div className="text-slate-400 hidden sm:block">
            Petunjuk: Cari gambar yang sepadan dengan penerangan fungsinya!
          </div>
        </div>
      </div>
    </div>
  );
};
