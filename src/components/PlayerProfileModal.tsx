import React, { useState } from 'react';
import { ASTRONAUT_AVATARS } from '../data/learningContent';
import { CharacterAvatar } from './CharacterAvatars';
import { soundEffects } from '../utils/audio';
import { User, Sparkles, Check, ArrowRight } from 'lucide-react';

interface PlayerProfileModalProps {
  initialName: string;
  initialAvatarId: string;
  isFirstTime?: boolean;
  onSave: (name: string, avatarId: string) => void;
  onClose?: () => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  initialName,
  initialAvatarId,
  isFirstTime = false,
  onSave,
  onClose
}) => {
  const [name, setName] = useState<string>(initialName || '');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(initialAvatarId || 'avatar_biru');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const currentAvatar =
    ASTRONAUT_AVATARS.find(a => a.id === selectedAvatarId) || ASTRONAUT_AVATARS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg('Sila masukkan nama anda sebelum meneruskan!');
      soundEffects.playWrong();
      return;
    }
    if (trimmed.length > 20) {
      setErrorMsg('Nama terlalu panjang (maksimum 20 aksara).');
      soundEffects.playWrong();
      return;
    }

    soundEffects.playLevelUp();
    onSave(trimmed, selectedAvatarId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-sky-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-wide">
                {isFirstTime ? 'PENDAFTARAN ANGKASAWAN' : 'PROFIL ANGKASAWAN'}
              </h2>
              <p className="text-xs text-sky-200">
                Pilih avatar kegemaran dan masukkan nama pengembara anda
              </p>
            </div>
          </div>
          {!isFirstTime && onClose && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onClose();
              }}
              className="text-white/80 hover:text-white font-bold text-lg"
            >
              ✕
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* 1. Name Input Section */}
          <div className="space-y-2">
            <label htmlFor="playerName" className="text-sm font-extrabold text-sky-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Masukkan Nama Anda:</span>
            </label>
            <div className="relative">
              <input
                id="playerName"
                type="text"
                maxLength={20}
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Contoh: Haqiem / Safiya"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/90 border-2 border-slate-700 focus:border-sky-400 text-white font-bold text-base outline-none transition-colors shadow-inner placeholder:text-slate-500"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                {name.length}/20
              </span>
            </div>
            {errorMsg && (
              <p className="text-xs font-semibold text-rose-400 mt-1 animate-pulse">
                {errorMsg}
              </p>
            )}
          </div>

          {/* 2. Avatar Selection Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-sky-300">
                Pilih Watak Angkasawan:
              </label>
              <span className="text-xs text-slate-400 font-medium">
                {currentAvatar.name} · {currentAvatar.accessoryName}
              </span>
            </div>

            {/* Avatar Active Preview Display */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
              <CharacterAvatar avatarId={selectedAvatarId} size={70} isAnimated={true} action="celebrate" />
              <div className="space-y-0.5">
                <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>{currentAvatar.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {currentAvatar.title}
                  </span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentAvatar.description}
                </p>
                <div className="text-[11px] text-amber-300 font-medium mt-1">
                  ⭐ Aksesori Khas: {currentAvatar.accessoryName}
                </div>
              </div>
            </div>

            {/* Avatar Selector Grid */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 pt-1">
              {ASTRONAUT_AVATARS.map(avatar => {
                const isSelected = selectedAvatarId === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedAvatarId(avatar.id);
                    }}
                    className={`relative p-2 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-950/80 border-sky-400 ring-2 ring-sky-400/50 shadow-lg scale-105'
                        : 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                    <CharacterAvatar avatarId={avatar.id} size={44} />
                    <span className="text-[10px] sm:text-xs font-bold text-slate-200 line-clamp-1 text-center">
                      {avatar.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 hover:from-sky-400 hover:to-purple-400 text-slate-950 font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-sky-500/25 active:scale-98 transition-all cursor-pointer"
            >
              <span>Teruskan</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
