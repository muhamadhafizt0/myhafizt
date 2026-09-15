import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Lock, Coins } from 'lucide-react';
import { Celengan } from '../types';
import { formatRupiah } from '../utils/formatters';
import { playCoinSound } from '../utils/audio';

interface PiggyBankVisualProps {
  celengan: Celengan;
  balance: number;
  isMuted: boolean;
  onDepositClick: () => void;
  triggerCoinDrop?: number; // counter that increments on deposit to trigger animation
}

export const PiggyBankVisual: React.FC<PiggyBankVisualProps> = ({
  celengan,
  balance,
  isMuted,
  onDepositClick,
  triggerCoinDrop = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);

  const percentage = celengan.targetAmount > 0 
    ? Math.min(Math.round((balance / celengan.targetAmount) * 100), 100) 
    : 0;
  const isTargetAchieved = celengan.targetAmount > 0 && balance >= celengan.targetAmount;

  const handleJiggle = () => {
    setIsJiggling(true);
    playCoinSound(isMuted);
    setTimeout(() => setIsJiggling(false), 500);
  };

  // Color themes
  const colorMap = {
    emerald: {
      bodyFill: '#ecfdf5',
      bodyStroke: '#059669',
      accent: '#10b981',
      liquidFill: '#34d399',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    amber: {
      bodyFill: '#fffbeb',
      bodyStroke: '#d97706',
      accent: '#f59e0b',
      liquidFill: '#fbbf24',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    rose: {
      bodyFill: '#fff1f2',
      bodyStroke: '#e11d48',
      accent: '#f43f5e',
      liquidFill: '#fb7185',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    sky: {
      bodyFill: '#f0f9ff',
      bodyStroke: '#0284c7',
      accent: '#0ea5e9',
      liquidFill: '#38bdf8',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-300',
    },
    indigo: {
      bodyFill: '#eef2ff',
      bodyStroke: '#4f46e5',
      accent: '#6366f1',
      liquidFill: '#818cf8',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    },
  };

  const theme = colorMap[celengan.color] || colorMap.emerald;

  // Liquid height inside piggy (0% to 100%)
  const fillHeight = Math.max(8, Math.min(percentage * 0.9, 90));

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
      {/* Background soft ambient radial glow */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${theme.liquidFill}33, transparent 70%)`
        }}
      />

      {/* Top Header Badge */}
      <div className="w-full flex items-center justify-between z-10 mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${theme.badgeBg}`}>
            {isTargetAchieved ? (
              <>
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                Target Tercapai 100%!
              </>
            ) : (
              <>
                <Coins className="w-3.5 h-3.5" />
                Terisi {percentage}%
              </>
            )}
          </span>
          {celengan.isLocked && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300 flex items-center gap-1">
              <Lock className="w-3 h-3 text-stone-500" />
              Terkunci
            </span>
          )}
        </div>

        <button
          id="btn-kocok-celengan"
          onClick={handleJiggle}
          title="Klik untuk menggoyang celengan"
          className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-stone-100"
        >
          <span>Goyang Celengan</span>
          <span className="text-sm">🔔</span>
        </button>
      </div>

      {/* Main Piggy Bank Stage */}
      <div 
        className="relative w-72 h-64 flex items-center justify-center cursor-pointer select-none group"
        onClick={handleJiggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Dropping Coin Effect */}
        <AnimatePresence>
          {triggerCoinDrop > 0 && (
            <motion.div
              key={`coin-${triggerCoinDrop}`}
              initial={{ y: -60, opacity: 0, scale: 0.8, rotate: -25 }}
              animate={{ 
                y: [ -60, -10, 20 ],
                opacity: [ 0, 1, 0 ],
                scale: [ 0.9, 1.1, 0.7 ],
                rotate: [ -25, 0, 15 ]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              className="absolute top-4 z-30 pointer-events-none flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-amber-600 shadow-md flex items-center justify-center font-black text-amber-900 text-xs">
                Rp
              </div>
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin -mt-1" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Piggy Bank Vector Illustration */}
        <motion.div
          animate={
            isJiggling
              ? {
                  rotate: [0, -7, 6, -5, 4, -2, 0],
                  scale: [1, 1.05, 0.97, 1.03, 1],
                  y: [0, -8, 2, -4, 0],
                }
              : isHovered
              ? { y: -4, scale: 1.02 }
              : { y: 0, scale: 1 }
          }
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-64 h-56 flex items-center justify-center"
        >
          <svg
            viewBox="0 0 240 200"
            className="w-full h-full filter drop-shadow-md overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Defs for gradients & clipping mask */}
            <defs>
              <linearGradient id={`piggyGrad-${celengan.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor={theme.bodyFill} />
                <stop offset="100%" stopColor={theme.bodyStroke} stopOpacity="0.15" />
              </linearGradient>

              <linearGradient id={`liquidGrad-${celengan.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={theme.accent} />
                <stop offset="100%" stopColor={theme.liquidFill} />
              </linearGradient>

              {/* Clip path of the piggy body */}
              <clipPath id={`piggyBodyClip-${celengan.id}`}>
                <ellipse cx="115" cy="115" rx="75" ry="62" />
              </clipPath>
            </defs>

            {/* Piggy Feet (Back & Front) */}
            {/* Front Left Foot */}
            <rect x="75" y="160" width="22" height="26" rx="10" fill={theme.bodyStroke} opacity="0.85" />
            {/* Front Right Foot */}
            <rect x="135" y="160" width="22" height="26" rx="10" fill={theme.bodyStroke} opacity="0.85" />

            {/* Curled Tail */}
            <path
              d="M38 120 C20 120, 15 105, 25 98 C35 90, 42 108, 30 110"
              stroke={theme.bodyStroke}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Piggy Ear (Back) */}
            <path
              d="M135 62 C145 35, 170 45, 158 72 Z"
              fill={theme.accent}
              stroke={theme.bodyStroke}
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Piggy Main Body */}
            <ellipse
              cx="115"
              cy="115"
              rx="75"
              ry="62"
              fill={`url(#piggyGrad-${celengan.id})`}
              stroke={theme.bodyStroke}
              strokeWidth="5"
            />

            {/* Visual Savings Liquid / Gold inside the tummy (Clipped to body) */}
            <g clipPath={`url(#piggyBodyClip-${celengan.id})`}>
              {/* Dynamic Fill level */}
              <rect
                x="30"
                y={177 - (fillHeight * 1.25)}
                width="170"
                height="150"
                fill={`url(#liquidGrad-${celengan.id})`}
                opacity="0.38"
                className="transition-all duration-700 ease-out"
              />
              {/* Floating gold coin icons inside if filled */}
              {balance > 0 && (
                <>
                  <circle cx="85" cy="140" r="10" fill="#f59e0b" stroke="#b45309" strokeWidth="2" opacity="0.75" />
                  <circle cx="120" cy="148" r="12" fill="#fbbf24" stroke="#d97706" strokeWidth="2" opacity="0.85" />
                  <circle cx="145" cy="138" r="9" fill="#f59e0b" stroke="#b45309" strokeWidth="2" opacity="0.75" />
                  {percentage >= 50 && (
                    <>
                      <circle cx="102" cy="125" r="11" fill="#fcd34d" stroke="#d97706" strokeWidth="2" opacity="0.8" />
                      <circle cx="132" cy="120" r="9" fill="#f59e0b" stroke="#b45309" strokeWidth="2" opacity="0.7" />
                    </>
                  )}
                  {percentage >= 80 && (
                    <>
                      <circle cx="90" cy="108" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="2" opacity="0.8" />
                      <circle cx="125" cy="100" r="10" fill="#fcd34d" stroke="#b45309" strokeWidth="2" opacity="0.85" />
                    </>
                  )}
                </>
              )}
              {/* Surface wave */}
              <path
                d={`M 30 ${177 - (fillHeight * 1.25)} Q 70 ${172 - (fillHeight * 1.25)}, 115 ${177 - (fillHeight * 1.25)} T 200 ${177 - (fillHeight * 1.25)} L 200 200 L 30 200 Z`}
                fill={theme.accent}
                opacity="0.25"
                className="transition-all duration-700 ease-out"
              />
            </g>

            {/* Coin Slot on top */}
            <ellipse
              cx="115"
              cy="55"
              rx="18"
              ry="4"
              fill="#1c1917"
              stroke={theme.bodyStroke}
              strokeWidth="2"
            />

            {/* Piggy Ear (Front) */}
            <path
              d="M152 68 C168 42, 192 56, 172 82 Z"
              fill="#ffffff"
              stroke={theme.bodyStroke}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Ear inner detail */}
            <path
              d="M158 68 C168 52, 182 62, 169 76 Z"
              fill={theme.liquidFill}
              opacity="0.6"
            />

            {/* Happy Eye */}
            <ellipse cx="152" cy="96" rx="4.5" ry="6" fill="#1c1917" />
            <circle cx="154" cy="94" r="1.8" fill="#ffffff" />

            {/* Cute Cheek Blush */}
            <ellipse cx="148" cy="112" rx="7" ry="4" fill="#f43f5e" opacity="0.35" />

            {/* Piggy Snout */}
            <ellipse
              cx="184"
              cy="114"
              rx="16"
              ry="21"
              fill="#ffffff"
              stroke={theme.bodyStroke}
              strokeWidth="4"
            />
            {/* Nostrils */}
            <ellipse cx="180" cy="112" rx="2.5" ry="4.5" fill={theme.bodyStroke} />
            <ellipse cx="188" cy="112" rx="2.5" ry="4.5" fill={theme.bodyStroke} />

            {/* Glass Shine Highlight */}
            <path
              d="M60 95 C68 78, 86 68, 108 65"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>

          {/* Centered Balance Indicator on Piggy Belly */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
            <span className="text-[10px] font-bold tracking-wider uppercase text-stone-500 bg-white/80 px-2 py-0.5 rounded-full border border-stone-200/60 shadow-2xs backdrop-blur-xs">
              {celengan.name}
            </span>
            <span className="text-xl font-extrabold text-stone-900 drop-shadow-2xs mt-0.5">
              {formatRupiah(balance)}
            </span>
            <span className="text-[11px] font-medium text-stone-600">
              dari target {formatRupiah(celengan.targetAmount, true)}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Progress Bar & Quick Info */}
      <div className="w-full mt-4 space-y-2 z-10">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-stone-600">Progres Pengisian</span>
          <span className="text-stone-900 font-bold">{percentage}%</span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/80">
          <motion.div
            className="h-full rounded-full transition-all duration-700"
            style={{
              backgroundColor: theme.accent,
              width: `${percentage}%`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-stone-500 pt-0.5">
          <span>
            Kurang:{' '}
            <strong className="text-stone-800 font-semibold">
              {balance >= celengan.targetAmount
                ? 'Target Tercapai! 🎉'
                : formatRupiah(Math.max(0, celengan.targetAmount - balance))}
            </strong>
          </span>
          <button
            id="btn-nabung-cepat-visual"
            onClick={onDepositClick}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
          >
            <span>+ Nabung Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
