import React, { useState, useEffect } from 'react';
import { CheckpointQuestion } from '../types/game';
import { soundEffects } from '../utils/audio';
import { MoonPhaseIcon, MoonOrbitDiagram } from './MoonPhaseIllustrations';
import { ConstellationVisualizer, ConstellationType } from './ConstellationIllustrations';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface QuestionModalProps {
  question: CheckpointQuestion;
  checkpointNumber: number;
  totalCheckpoints: number;
  onAnswerCorrect: (pointsAwarded: number) => void;
  onClose?: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  checkpointNumber,
  totalCheckpoints,
  onAnswerCorrect
}) => {
  // State for multiple choice
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // State for ordering sequence
  const [sequence, setSequence] = useState<{ id: string; name: string; visualType?: string }[]>([]);

  // State for matching pairs
  const [matchedPairs, setMatchedPairs] = useState<{ [leftId: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // State for fill in blank
  const [blankAnswer, setBlankAnswer] = useState<string>('');

  // Result & feedback state
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Initialize interactive question modes
  useEffect(() => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setIsCorrect(false);
    setFeedbackMessage('');
    setSelectedLeft(null);
    setMatchedPairs({});
    setBlankAnswer('');

    if (question.type === 'order_sequence' && question.sequenceItems) {
      // Shuffle sequence items for student to re-order
      const shuffled = [...question.sequenceItems].sort(() => Math.random() - 0.5);
      setSequence(shuffled);
    }
  }, [question]);

  // Handlers for sequence re-ordering
  const moveSequenceItem = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= sequence.length) return;
    soundEffects.playClick();
    const updated = [...sequence];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setSequence(updated);
  };

  // Handlers for pair matching
  const handleSelectLeft = (leftId: string) => {
    soundEffects.playClick();
    setSelectedLeft(leftId);
  };

  const handleSelectRight = (rightId: string) => {
    if (!selectedLeft) return;
    soundEffects.playClick();
    setMatchedPairs(prev => ({
      ...prev,
      [selectedLeft]: rightId
    }));
    setSelectedLeft(null);
  };

  const resetMatches = () => {
    soundEffects.playClick();
    setMatchedPairs({});
    setSelectedLeft(null);
    setHasSubmitted(false);
  };

  // Evaluation Handler
  const handleCheckAnswer = () => {
    let correct = false;

    if (question.type === 'multiple_choice') {
      if (!selectedOption) return;
      correct = selectedOption === question.correctOptionId;
    } else if (question.type === 'order_sequence') {
      const currentIds = sequence.map(item => item.id);
      correct = JSON.stringify(currentIds) === JSON.stringify(question.correctSequenceIds);
    } else if (question.type === 'match_pairs') {
      if (question.matchPairs) {
        const allMatched = question.matchPairs.every(
          p => matchedPairs[p.leftId] === p.rightId
        );
        correct = allMatched && Object.keys(matchedPairs).length === question.matchPairs.length;
      }
    } else if (question.type === 'fill_blank') {
      if (!blankAnswer) return;
      correct = blankAnswer === question.blankSentence?.correctAnswer;
    }

    setHasSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      soundEffects.playCorrect();
      setFeedbackMessage('Jawapan Tepat dan Cemerlang! Anda berjaya memahami konsep sains ini.');
    } else {
      soundEffects.playWrong();
      setFeedbackMessage('Kurang tepat. Jangan putus asa! Sila baca penjelasan di bawah dan cuba lagi.');
    }
  };

  const handleRetry = () => {
    soundEffects.playClick();
    setHasSubmitted(false);
    setIsCorrect(false);
    setFeedbackMessage('');
    setSelectedOption(null);
    if (question.type === 'order_sequence' && question.sequenceItems) {
      setSequence([...question.sequenceItems].sort(() => Math.random() - 0.5));
    }
    if (question.type === 'match_pairs') {
      setMatchedPairs({});
      setSelectedLeft(null);
    }
    if (question.type === 'fill_blank') {
      setBlankAnswer('');
    }
  };

  const handleProceed = () => {
    soundEffects.playLevelUp();
    onAnswerCorrect(question.points);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-sky-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 px-5 py-3.5 border-b border-sky-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/20 text-sky-300 font-bold text-sm border border-sky-400/40">
              {checkpointNumber}
            </span>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">{question.title}</h3>
              <p className="text-xs text-sky-300/80 font-medium">{question.standardLearning} · {question.factSource}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              +{question.points} Markah
            </span>
            <div className="text-[11px] text-slate-400 mt-1">
              Checkpoint {checkpointNumber} / {totalCheckpoints}
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 md:p-6 space-y-4 overflow-y-auto text-slate-200">
          {/* Question Text */}
          <div className="text-base md:text-lg font-medium text-white leading-relaxed">
            {question.questionText}
          </div>

          {/* Optional Visual Context Diagram */}
          {question.id === 2 && question.topic === 'fasa_bulan' && (
            <div className="my-2">
              <MoonOrbitDiagram activeStep={1} />
            </div>
          )}

          {question.id === 5 && question.topic === 'fasa_bulan' && (
            <div className="grid grid-cols-4 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              <div>
                <MoonPhaseIcon phase="anak_bulan" size={44} className="mx-auto" />
                <span className="text-[11px] text-slate-300 block mt-1">Anak Bulan</span>
              </div>
              <div>
                <MoonPhaseIcon phase="bulan_sabit" size={44} className="mx-auto" />
                <span className="text-[11px] text-slate-300 block mt-1">Bulan Sabit</span>
              </div>
              <div>
                <MoonPhaseIcon phase="bulan_separa" size={44} className="mx-auto" />
                <span className="text-[11px] text-slate-300 block mt-1">Bulan Separa</span>
              </div>
              <div>
                <MoonPhaseIcon phase="bulan_purnama" size={44} className="mx-auto" />
                <span className="text-[11px] text-slate-300 block mt-1">Bulan Purnama</span>
              </div>
            </div>
          )}

          {/* If buruj question has visual preview */}
          {question.topic === 'buruj' && question.id === 2 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <ConstellationVisualizer type="biduk" size="sm" interactive={false} />
              <ConstellationVisualizer type="belantik" size="sm" interactive={false} />
              <ConstellationVisualizer type="pari" size="sm" interactive={false} />
              <ConstellationVisualizer type="skorpio" size="sm" interactive={false} />
            </div>
          )}

          {/* TYPE 1: Multiple Choice */}
          {question.type === 'multiple_choice' && question.options && (
            <div className="space-y-2.5 pt-1">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOption === opt.id;
                const letter = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={hasSubmitted && isCorrect}
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedOption(opt.id);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-sky-950/80 border-sky-400 text-sky-100 shadow-md ring-1 ring-sky-400'
                        : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected ? 'bg-sky-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm md:text-base leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* TYPE 2: Order Sequence */}
          {question.type === 'order_sequence' && (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-sky-300 font-medium">
                Gunakan butang ⬆️ dan ⬇️ untuk menyusun fasa mengikut urutan yang betul:
              </p>
              <div className="space-y-2">
                {sequence.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/90 text-sm font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-slate-700 text-sky-300 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      {item.visualType && (
                        <MoonPhaseIcon phase={item.visualType} size={32} showGlow={false} />
                      )}
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                    {!hasSubmitted && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveSequenceItem(idx, idx - 1)}
                          className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-sky-300 font-bold"
                          title="Gerak Ke Atas"
                        >
                          ▲ Naik
                        </button>
                        <button
                          type="button"
                          disabled={idx === sequence.length - 1}
                          onClick={() => moveSequenceItem(idx, idx + 1)}
                          className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-sky-300 font-bold"
                          title="Gerak Ke Bawah"
                        >
                          ▼ Turun
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TYPE 3: Matching Pairs */}
          {question.type === 'match_pairs' && question.matchPairs && (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-sky-300 font-medium">
                Klik item di sebelah kiri, kemudian klik pasangannya yang sepadan di sebelah kanan:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Left Side */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Item / Buruj:</span>
                  {question.matchPairs.map(p => {
                    const isLinked = !!matchedPairs[p.leftId];
                    const isSelected = selectedLeft === p.leftId;
                    return (
                      <button
                        key={p.leftId}
                        type="button"
                        disabled={hasSubmitted && isCorrect}
                        onClick={() => handleSelectLeft(p.leftId)}
                        className={`w-full text-left p-2.5 rounded-xl border text-sm font-semibold transition-all ${
                          isSelected
                            ? 'bg-amber-950/80 border-amber-400 text-amber-200 ring-2 ring-amber-400'
                            : isLinked
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                            : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {p.left} {isLinked ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>

                {/* Right Side */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Penerangan / Corak:</span>
                  {question.matchPairs.map(p => {
                    const isTargetOfCurrent = selectedLeft && matchedPairs[selectedLeft] === p.rightId;
                    return (
                      <button
                        key={p.rightId}
                        type="button"
                        disabled={hasSubmitted && isCorrect}
                        onClick={() => handleSelectRight(p.rightId)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs md:text-sm transition-all ${
                          isTargetOfCurrent
                            ? 'bg-sky-950/80 border-sky-400 text-sky-200 ring-1 ring-sky-400'
                            : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {p.right}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status of matching */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>
                  {Object.keys(matchedPairs).length} daripada {question.matchPairs.length} dipadankan
                </span>
                {!hasSubmitted && Object.keys(matchedPairs).length > 0 && (
                  <button
                    type="button"
                    onClick={resetMatches}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Set Semula Padanan
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TYPE 4: Fill In Blank */}
          {question.type === 'fill_blank' && question.blankSentence && (
            <div className="space-y-4 pt-1">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-base md:text-lg leading-relaxed text-slate-200">
                {question.blankSentence.before}
                <span className="inline-block px-3 py-1 mx-1.5 rounded-lg border-2 border-dashed border-sky-400 bg-sky-950/60 font-bold text-sky-200 text-base">
                  {blankAnswer || '__________'}
                </span>
                {question.blankSentence.after}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400 block">Pilih jawapan yang tepat:</span>
                <div className="grid grid-cols-2 gap-2">
                  {question.blankSentence.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      disabled={hasSubmitted && isCorrect}
                      onClick={() => {
                        soundEffects.playClick();
                        setBlankAnswer(opt);
                      }}
                      className={`p-3 rounded-xl border text-sm font-semibold transition-all text-center ${
                        blankAnswer === opt
                          ? 'bg-sky-600 text-white border-sky-400 ring-2 ring-sky-300'
                          : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feedback & Explanation Box */}
          {hasSubmitted && (
            <div
              className={`p-4 rounded-xl border transition-all ${
                isCorrect
                  ? 'bg-emerald-950/50 border-emerald-500/70 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/70 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h4 className="font-bold text-base">
                    {isCorrect ? 'Tahniah! Jawapan Tepat' : 'Cuba Lagi!'}
                  </h4>
                  <p className="text-sm leading-normal">{feedbackMessage}</p>
                  <p className="text-xs text-slate-300 mt-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <strong className="text-sky-300">Fakta Buku Teks: </strong>
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="bg-slate-950/90 px-5 py-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            {!hasSubmitted && (
              <span className="text-xs text-slate-400">
                Pilih jawapan anda dan tekan &quot;Semak Jawapan&quot;.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!hasSubmitted ? (
              <button
                type="button"
                onClick={handleCheckAnswer}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20 active:scale-95 cursor-pointer"
              >
                Semak Jawapan
              </button>
            ) : isCorrect ? (
              <button
                type="button"
                onClick={handleProceed}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                <span>Teruskan Pengembaraan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRetry}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Cuba Semula</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
