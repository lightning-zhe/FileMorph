import { motion } from 'framer-motion';

export default function MorphCat({ hint }: { hint?: boolean }) {
  const cat = (
    <div className="relative shrink-0" style={{ width: 110, height: 108 }}>
      {/* Shadow */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-2 rounded-full bg-slate-300/30 cat-shadow" />
      {/* Main cat group with float + walk */}
      <div className="cat-float cat-walk relative">
        <svg
          width="100" height="100" viewBox="0 0 120 120"
          fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tail — colorpoint tip */}
          <g className="cat-tail" style={{ transformOrigin: '88px 90px' }}>
            <path d="M88 90 Q108 78 110 55 Q111 42 104 38" stroke="url(#catBodyGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M104 38 Q100 36 102 41" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
          {/* Body */}
          <ellipse cx="60" cy="82" rx="28" ry="22" fill="url(#catBodyGrad)" />
          <ellipse cx="60" cy="86" rx="18" ry="13" fill="white" opacity="0.35" />
          {/* Fluffy chest */}
          <ellipse cx="60" cy="80" rx="16" ry="10" fill="white" opacity="0.3" />
          {/* Paws — colorpoint */}
          <rect x="33" y="68" width="12" height="8" rx="4" fill="#CBD5E1" opacity="0.4" />
          <rect x="75" y="68" width="12" height="8" rx="4" fill="#CBD5E1" opacity="0.4" />
          {/* File */}
          <g className="cat-file-glow">
            <rect x="45" y="42" width="30" height="38" rx="6" fill="url(#fileGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
            <path d="M64 42L75 42V53L64 53Z" fill="url(#fileFoldGrad)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6" />
            <path d="M64 42L75 53" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" strokeLinecap="round" />
            <rect x="51" y="56" width="14" height="2" rx="1" fill="#CBD5E1" opacity="0.5" />
            <rect x="51" y="61" width="10" height="2" rx="1" fill="#CBD5E1" opacity="0.35" />
            <rect x="51" y="66" width="12" height="2" rx="1" fill="#CBD5E1" opacity="0.35" />
            <rect x="53" y="72" width="14" height="5" rx="2.5" fill="#818CF8" opacity="0.25" />
          </g>
          {/* Head — wider, softer (Ragdoll face) */}
          <ellipse cx="60" cy="28" rx="24" ry="21" fill="url(#catBodyGrad)" />
          {/* Fluffy cheeks */}
          <ellipse cx="42" cy="32" rx="10" ry="8" fill="url(#catBodyGrad)" opacity="0.7" />
          <ellipse cx="78" cy="32" rx="10" ry="8" fill="url(#catBodyGrad)" opacity="0.7" />
          {/* Ears — colorpoint */}
          <path d="M40 14L34 0L50 11Z" fill="#CBD5E1" opacity="0.5" />
          <path d="M80 14L86 0L70 11Z" fill="#CBD5E1" opacity="0.5" />
          <path d="M42 12L37 4L48 10Z" fill="#F9A8D4" opacity="0.2" />
          <path d="M78 12L83 4L72 10Z" fill="#F9A8D4" opacity="0.2" />
          {/* Forehead colorpoint */}
          <ellipse cx="60" cy="18" rx="12" ry="8" fill="#CBD5E1" opacity="0.18" />
          {/* Eyes — bigger, more expressive */}
          <g className="cat-blink" style={{ transformOrigin: '60px 28px' }}>
            <ellipse cx="49" cy="27" rx="5" ry="5.5" fill="#1E293B" />
            <ellipse cx="71" cy="27" rx="5" ry="5.5" fill="#1E293B" />
            <circle cx="51" cy="24" r="2.2" fill="white" />
            <circle cx="73" cy="24" r="2.2" fill="white" />
            <circle cx="47.5" cy="29" r="0.8" fill="white" opacity="0.5" />
            <circle cx="69.5" cy="29" r="0.8" fill="white" opacity="0.5" />
          </g>
          {/* Blush */}
          <ellipse cx="40" cy="34" rx="6" ry="3.5" fill="#F9A8D4" opacity="0.2" />
          <ellipse cx="80" cy="34" rx="6" ry="3.5" fill="#F9A8D4" opacity="0.2" />
          {/* Nose — Ragdoll pink */}
          <path d="M57.5 32.5L60 35L62.5 32.5Z" fill="#F472B6" opacity="0.45" />
          {/* Mouth */}
          <path d="M56 36.5Q58 39 60 36.5" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" fill="none" />
          <path d="M60 36.5Q62 39 64 36.5" stroke="#94A3B8" strokeWidth="0.8" strokeLinecap="round" fill="none" />
          {/* Whiskers — longer */}
          <line x1="32" y1="31" x2="48" y2="33" stroke="#CBD5E1" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
          <line x1="31" y1="35" x2="48" y2="35" stroke="#CBD5E1" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
          <line x1="88" y1="31" x2="72" y2="33" stroke="#CBD5E1" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
          <line x1="89" y1="35" x2="72" y2="35" stroke="#CBD5E1" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
          <defs>
            <linearGradient id="catBodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEFEFE" />
              <stop offset="70%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="fileGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EEF2FF" />
              <stop offset="100%" stopColor="#E0E7FF" />
            </linearGradient>
            <linearGradient id="fileFoldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C7D2FE" />
              <stop offset="100%" stopColor="#DDD6FE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Sparkles */}
      <Sparkle className="top-2 -right-2" delay="0s" size="sm" />
      <Sparkle className="-top-1 left-2" delay="0.6s" size="sm" />
      <Sparkle className="top-8 -right-3" delay="1.2s" size="md" />
      <Sparkle className="top-10 left-0" delay="1.8s" size="sm" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center select-none"
    >
      {hint ? (
        <div className="flex items-center gap-3">
          {cat}
          <p className="text-[14px] font-medium text-slate-400 text-left leading-relaxed">
            选好了？<br />告诉小猫要转成<br />什么格式吧&nbsp;👆
          </p>
        </div>
      ) : (
        <>
          {cat}
          <p className="mt-4 text-[15px] font-medium text-slate-500">
            把文件交给小猫，我来帮你变个格式&nbsp;✨
          </p>
          <p className="mt-2 text-[13px] text-slate-400">
            支持 Word、PPT、PDF、图片转换
          </p>
        </>
      )}
    </motion.div>
  );
}

function Sparkle({ className, delay = '0s', size = 'sm' }: { className?: string; delay?: string; size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';
  return (
    <div
      className={`absolute ${dims} rounded-full bg-indigo-300/50 sparkle-float ${className || ''}`}
      style={{ animationDelay: delay }}
    />
  );
}
