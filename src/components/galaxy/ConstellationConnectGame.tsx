import React, { useState } from 'react';
import { soundEffects } from '../../utils/audio';
import { Star, Sparkles, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';

interface ConstellationPoint {
  id: number;
  label: string;
  x: number; // percentage 10-90
  y: number; // percentage 15-85
}

interface ConstellationConfig {
  name: string;
  shapeName: string;
  pointsCount: number;
  hemisphere: string;
  uses: string;
  points: ConstellationPoint[];
  connections: [number, number][]; // pairs of point IDs
}

interface ConstellationConnectGameProps {
  stepIndex: number; // 2 (Checkpoint 3) or 3 (Checkpoint 4)
  onComplete: () => void;
  onCancel: () => void;
}

export const ConstellationConnectGame: React.FC<ConstellationConnectGameProps> = ({
  stepIndex,
  onComplete,
  onCancel
}) => {
  // Checkpoint 3 = Buruj Biduk (7 stars, gayung/senduk), Checkpoint 4 = Buruj Pari (4 stars, layang-layang)
  const isBiduk = stepIndex === 2;

  const config: ConstellationConfig = isBiduk
    ? {
        name: 'Buruj Biduk',
        shapeName: 'Gayung atau Senduk',
        pointsCount: 7,
        hemisphere: 'Hemisfera Utara',
        uses: 'Petunjuk Arah Utara & Musim Menanam',
        points: [
          { id: 1, label: '1', x: 20, y: 32 },
          { id: 2, label: '2', x: 32, y: 36 },
          { id: 3, label: '3', x: 44, y: 45 },
          { id: 4, label: '4', x: 55, y: 55 },
          { id: 5, label: '5', x: 52, y: 76 },
          { id: 6, label: '6', x: 74, y: 78 },
          { id: 7, label: '7', x: 76, y: 54 }
        ],
        connections: [
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 4]
        ]
      }
    : {
        name: 'Buruj Pari',
        shapeName: 'Layang-layang',
        pointsCount: 4,
        hemisphere: 'Hemisfera Selatan',
        uses: 'Petunjuk Arah Selatan',
        points: [
          { id: 1, label: '1', x: 50, y: 22 },
          { id: 2, label: '2', x: 72, y: 48 },
          { id: 3, label: '3', x: 50, y: 80 },
          { id: 4, label: '4', x: 28, y: 48 }
        ],
        connections: [
          [1, 2],
          [2, 3],
          [3, 4],
          [4, 1],
          [1, 3],
          [4, 2]
        ]
      };

  const [connectedOrder, setConnectedOrder] = useState<number[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);

  const nextRequiredId = connectedOrder.length + 1;

  const handleStarClick = (pointId: number) => {
    if (completed) return;

    if (pointId === nextRequiredId) {
      soundEffects.playCollect();
      const nextOrder = [...connectedOrder, pointId];
      setConnectedOrder(nextOrder);

      if (nextOrder.length === config.pointsCount) {
        soundEffects.playLevelUp();
        setCompleted(true);
      }
    } else if (pointId <= connectedOrder.length) {
      // already tapped
    } else {
      // tapped wrong star out of order
      soundEffects.playWrong();
    }
  };

  const handleReset = () => {
    soundEffects.playClick();
    setConnectedOrder([]);
    setCompleted(false);
  };

  // Find point coordinates by ID
  const getPoint = (id: number) => config.points.find(p => p.id === id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                Sambung Titik Bintang: {config.name}
              </h3>
              <p className="text-xs text-indigo-300">
                Sambungkan titik bintang bernombor 1 hingga {config.pointsCount} untuk membentuk corak buruj!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
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

        {/* Constellation Star Sky Canvas Area */}
        <div className="relative flex-1 min-h-[350px] sm:min-h-[420px] bg-gradient-to-b from-[#060814] via-[#0b1029] to-[#04060f] overflow-hidden select-none">
          {/* Deep Space Background Atmosphere */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-12 left-1/4 w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="absolute bottom-12 right-1/4 w-60 h-60 rounded-full bg-purple-600/20 blur-3xl" />
            {/* Ambient small stars */}
            <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-60" />
            <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full opacity-70" />
            <div className="absolute bottom-16 left-1/3 w-1.5 h-1.5 bg-sky-200 rounded-full opacity-50" />
            <div className="absolute top-1/2 right-12 w-1 h-1 bg-amber-100 rounded-full opacity-60" />
          </div>

          {/* SVG Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Guide ghost outline when not complete */}
            {config.connections.map(([p1Id, p2Id], idx) => {
              const p1 = getPoint(p1Id);
              const p2 = getPoint(p2Id);
              if (!p1 || !p2) return null;
              return (
                <line
                  key={`ghost-${idx}`}
                  x1={`${p1.x}%`}
                  y1={`${p1.y}%`}
                  x2={`${p2.x}%`}
                  y2={`${p2.y}%`}
                  stroke="rgba(99, 102, 241, 0.18)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* User Connected Lines in Sequence */}
            {connectedOrder.map((pointId, idx) => {
              if (idx === 0) return null;
              const prevPoint = getPoint(connectedOrder[idx - 1]);
              const curPoint = getPoint(pointId);
              if (!prevPoint || !curPoint) return null;
              return (
                <line
                  key={`user-line-${idx}`}
                  x1={`${prevPoint.x}%`}
                  y1={`${prevPoint.y}%`}
                  x2={`${curPoint.x}%`}
                  y2={`${curPoint.y}%`}
                  stroke="#38BDF8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_#38bdf8]"
                />
              );
            })}

            {/* Loop-closing line when all connected (e.g. Biduk 7->4 or Pari 4->1) */}
            {completed && (
              <>
                {config.connections.map(([p1Id, p2Id], idx) => {
                  const p1 = getPoint(p1Id);
                  const p2 = getPoint(p2Id);
                  if (!p1 || !p2) return null;
                  return (
                    <line
                      key={`complete-line-${idx}`}
                      x1={`${p1.x}%`}
                      y1={`${p1.y}%`}
                      x2={`${p2.x}%`}
                      y2={`${p2.y}%`}
                      stroke="#FACC15"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="drop-shadow-[0_0_12px_#facc15]"
                    />
                  );
                })}
              </>
            )}
          </svg>

          {/* Interactive Numbered Star Dots */}
          {config.points.map(pt => {
            const isConnected = connectedOrder.includes(pt.id);
            const isNext = pt.id === nextRequiredId;

            return (
              <button
                key={pt.id}
                onClick={() => handleStarClick(pt.id)}
                type="button"
                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                  isConnected
                    ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_20px_#facc15] scale-110 ring-4 ring-yellow-200'
                    : isNext
                    ? 'bg-sky-500 text-white font-extrabold shadow-[0_0_20px_#38bdf8] scale-115 animate-pulse ring-4 ring-sky-300'
                    : 'bg-slate-800/90 text-slate-300 border border-slate-700 hover:scale-105'
                }`}
              >
                <span className="text-sm sm:text-base font-black leading-none">{pt.label}</span>
                <Star
                  className={`w-3.5 h-3.5 mt-0.5 ${
                    isConnected ? 'fill-slate-950 text-slate-950' : isNext ? 'fill-white text-white' : 'text-slate-500'
                  }`}
                />
              </button>
            );
          })}

          {/* Prompt Indicator */}
          {!completed && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/90 border border-sky-500/40 rounded-2xl shadow-lg text-xs font-semibold text-sky-200">
              Sila sentuh bintang nombor <span className="font-black text-amber-300 text-sm">{nextRequiredId}</span>
            </div>
          )}

          {/* Victory Modal Overlay once constellation completed */}
          {completed && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn z-30">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-[0_0_35px_#FACC15] mb-3">
                <Sparkles className="w-9 h-9" />
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white mb-1">
                {config.name} Berjaya Terbentuk!
              </h4>
              <p className="text-sm font-semibold text-amber-300 mb-2">
                Bentuk: {config.shapeName} ({config.pointsCount} bintang)
              </p>
              <div className="max-w-md p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1 mb-6">
                <p>• Dilihat di: <strong className="text-white">{config.hemisphere}</strong></p>
                <p>• Kegunaan Sains: <strong className="text-sky-300">{config.uses}</strong></p>
              </div>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  onComplete();
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-sky-400 hover:from-amber-300 hover:to-sky-300 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-amber-400/30 cursor-pointer active:scale-95 transition-all"
              >
                <span>Buka Cabaran Soalan Buruj</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Kemajuan Titik: <strong className="text-amber-300">{connectedOrder.length}</strong> / {config.pointsCount}
          </div>
          <div className="text-slate-400 hidden sm:block">
            Petunjuk: Sentuh bintang mengikut turutan nombor 1, 2, 3...
          </div>
        </div>
      </div>
    </div>
  );
};
