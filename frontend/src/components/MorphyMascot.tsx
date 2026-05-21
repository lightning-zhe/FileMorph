import { motion } from 'framer-motion';

function Sparkle({ className, delay = '0s', size = 'sm' }: { className?: string; delay?: string; size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';
  return (
    <div
      className={`absolute ${dims} rounded-full bg-indigo-300/50 sparkle-float ${className || ''}`}
      style={{ animationDelay: delay }}
    />
  );
}

export default function MorphyMascot() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8 flex flex-col items-center justify-center text-center select-none"
    >
      {/* Mascot */}
      <div className="relative mb-5" style={{ width: 72, height: 90 }}>
        {/* Animated shadow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full bg-slate-300/35 morphy-shadow" />

        {/* Floating body */}
        <div className="morphy-float relative">
          <svg
            width="72"
            height="82"
            viewBox="0 0 72 82"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Body — rounded document */}
            <rect
              x="9"
              y="2"
              width="54"
              height="70"
              rx="12"
              fill="url(#morphyBody)"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="1.5"
            />

            {/* Fold corner */}
            <path
              d="M47 2L63 2V18L47 18Z"
              fill="url(#morphyFold)"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="0.8"
            />
            <path
              d="M47 2L63 18"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Content lines */}
            <rect x="20" y="24" width="28" height="3" rx="1.5" fill="#CBD5E1" opacity="0.5" />
            <rect x="20" y="32" width="19" height="3" rx="1.5" fill="#CBD5E1" opacity="0.35" />
            <rect x="20" y="40" width="24" height="3" rx="1.5" fill="#CBD5E1" opacity="0.35" />

            {/* Eyes */}
            <g className="morphy-blink" style={{ transformOrigin: '36px 55px' }}>
              <ellipse cx="28" cy="55" rx="3.5" ry="4" fill="#475569" />
              <ellipse cx="44" cy="55" rx="3.5" ry="4" fill="#475569" />
              <circle cx="29" cy="53.5" r="1.2" fill="white" />
              <circle cx="45" cy="53.5" r="1.2" fill="white" />
            </g>

            {/* Blush */}
            <ellipse cx="22" cy="58" rx="4" ry="2.2" fill="#F9A8D4" opacity="0.15" />
            <ellipse cx="50" cy="58" rx="4" ry="2.2" fill="#F9A8D4" opacity="0.15" />

            {/* Smile */}
            <path
              d="M32 61.5Q36 64.5 40 61.5"
              stroke="#94A3B8"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
            />

            <defs>
              <linearGradient id="morphyBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EEF2FF" />
                <stop offset="100%" stopColor="#E0E7FF" />
              </linearGradient>
              <linearGradient id="morphyFold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C7D2FE" />
                <stop offset="100%" stopColor="#DDD6FE" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Sparkles */}
        <Sparkle className="top-0 -right-1" delay="0s" size="sm" />
        <Sparkle className="top-6 -right-5" delay="0.9s" size="md" />
        <Sparkle className="-bottom-1 -left-3" delay="1.7s" size="sm" />
        <Sparkle className="top-10 -left-5" delay="0.4s" size="sm" />
        <Sparkle className="top-3 left-0" delay="1.3s" size="sm" />
      </div>

      {/* Copy */}
      <p className="text-[15px] font-medium text-slate-500">
        把文件丢给我，我来帮你变个格式&nbsp;✨
      </p>
      <p className="mt-1 text-[13px] text-slate-400">
        支持 Word、PPT、PDF、图片转换
      </p>
    </motion.div>
  );
}
