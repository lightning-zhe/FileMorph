/* ── Glass file card ── */
function FileChip({ label, accent, delay = '0s' }: { label: string; accent: string; delay?: string }) {
  return (
    <div
      className="file-chip inline-flex items-center px-3 py-1.5 rounded-xl border border-white/50 bg-white/55 backdrop-blur-md shadow-md text-[11px] font-semibold tracking-wide"
      style={{ animationDelay: delay, color: accent }}
    >
      {label}
    </div>
  );
}

/* ── Light trail dots ── */
function Trail({ count = 9 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-1 h-1 rounded-full trail-dot"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════ Bunny Avatar Badge ═══════════════════ */
function BunnyBadge() {
  return (
    <div className="badge-float relative" style={{ width: 110, height: 110 }}>
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer glow ring */}
        <circle cx="55" cy="55" r="52" fill="url(#bunnyGlow)" opacity="0.3" />
        {/* Badge circle */}
        <circle cx="55" cy="55" r="44" fill="url(#bunnyBg)" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
        {/* Ears — poke above */}
        <ellipse cx="38" cy="20" rx="10" ry="18" fill="url(#bunnyBg)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" transform="rotate(-8 38 20)" />
        <ellipse cx="72" cy="20" rx="10" ry="18" fill="url(#bunnyBg)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" transform="rotate(8 72 20)" />
        <ellipse cx="38" cy="22" rx="5" ry="12" fill="#FBCFE8" opacity="0.45" transform="rotate(-8 38 22)" />
        <ellipse cx="72" cy="22" rx="5" ry="12" fill="#FBCFE8" opacity="0.45" transform="rotate(8 72 22)" />
        {/* Ears wiggle */}
        <g className="bunny-ear-L" style={{ transformOrigin: '38px 20px' }} />
        <g className="bunny-ear-R" style={{ transformOrigin: '72px 20px' }} />
        {/* Face base */}
        <ellipse cx="55" cy="58" rx="34" ry="32" fill="url(#bunnyFace)" />
        {/* Eyes */}
        <g className="badge-blink" style={{ transformOrigin: '55px 54px' }}>
          <ellipse cx="42" cy="52" rx="5.5" ry="6" fill="#1E293B" />
          <ellipse cx="68" cy="52" rx="5.5" ry="6" fill="#1E293B" />
          <circle cx="44.5" cy="48.5" r="2" fill="white" />
          <circle cx="70.5" cy="48.5" r="2" fill="white" />
        </g>
        {/* Blush */}
        <ellipse cx="32" cy="62" rx="7" ry="4.5" fill="#F9A8D4" opacity="0.3" />
        <ellipse cx="78" cy="62" rx="7" ry="4.5" fill="#F9A8D4" opacity="0.3" />
        {/* Nose */}
        <ellipse cx="55" cy="60" rx="3.2" ry="2.4" fill="#F472B6" opacity="0.5" />
        {/* Mouth */}
        <path d="M50 65.5Q55 68 60 65.5" stroke="#94A3B8" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        <defs>
          <radialGradient id="bunnyGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#F9A8D4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F9A8D4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bunnyBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDF2F8" />
            <stop offset="100%" stopColor="#F9D8E6" />
          </linearGradient>
          <linearGradient id="bunnyFace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFBFD" />
            <stop offset="100%" stopColor="#FDF2F8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ═══════════════════ Teddy Avatar Badge ═══════════════════ */
function TeddyBadge() {
  return (
    <div className="badge-float-slow relative" style={{ width: 110, height: 110 }}>
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="55" cy="55" r="52" fill="url(#teddyGlow)" opacity="0.3" />
        <circle cx="55" cy="55" r="44" fill="url(#teddyBg)" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
        {/* Ears */}
        <ellipse cx="24" cy="38" rx="12" ry="15" fill="url(#teddyBg)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" transform="rotate(-15 24 38)" />
        <ellipse cx="86" cy="38" rx="12" ry="15" fill="url(#teddyBg)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" transform="rotate(15 86 38)" />
        <ellipse cx="24" cy="40" rx="6" ry="10" fill="#D6D3D1" opacity="0.18" transform="rotate(-15 24 40)" />
        <ellipse cx="86" cy="40" rx="6" ry="10" fill="#D6D3D1" opacity="0.18" transform="rotate(15 86 40)" />
        {/* Face — fluffy overlapping circles */}
        <circle cx="46" cy="60" r="25" fill="url(#teddyFace)" />
        <circle cx="64" cy="60" r="25" fill="url(#teddyFace)" />
        <circle cx="55" cy="54" r="28" fill="url(#teddyFace)" />
        {/* Curl texture */}
        <circle cx="35" cy="52" r="6" fill="url(#teddyBg)" opacity="0.4" />
        <circle cx="75" cy="52" r="6" fill="url(#teddyBg)" opacity="0.4" />
        <circle cx="30" cy="64" r="5" fill="url(#teddyBg)" opacity="0.35" />
        <circle cx="80" cy="64" r="5" fill="url(#teddyBg)" opacity="0.35" />
        {/* Eyes */}
        <g className="badge-blink" style={{ transformOrigin: '55px 56px' }}>
          <ellipse cx="43" cy="56" rx="4.5" ry="5" fill="#1E293B" />
          <ellipse cx="67" cy="56" rx="4.5" ry="5" fill="#1E293B" />
          <circle cx="44.8" cy="53.2" r="1.6" fill="white" />
          <circle cx="68.8" cy="53.2" r="1.6" fill="white" />
        </g>
        {/* Blush */}
        <ellipse cx="34" cy="65" rx="6" ry="3.5" fill="#F9A8D4" opacity="0.2" />
        <ellipse cx="76" cy="65" rx="6" ry="3.5" fill="#F9A8D4" opacity="0.2" />
        {/* Nose */}
        <ellipse cx="55" cy="64" rx="4" ry="3.2" fill="#57534E" opacity="0.45" />
        <ellipse cx="55" cy="62.5" rx="2.5" ry="1.5" fill="white" opacity="0.3" />
        {/* Mouth */}
        <path d="M49 69Q55 72.5 61 69" stroke="#94A3B8" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        <defs>
          <radialGradient id="teddyGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="teddyBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF7ED" />
            <stop offset="100%" stopColor="#FDE6C8" />
          </linearGradient>
          <linearGradient id="teddyFace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="100%" stopColor="#FEF3E4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ═══════════════════ Left Workshop ═══════════════════ */
export function BunnyWorkshop() {
  return (
    <div className="relative select-none pointer-events-none flex flex-col items-center gap-4 pt-6">
      {/* Ambient glow */}
      <div className="absolute top-8 w-52 h-52 rounded-full bg-gradient-to-br from-pink-200/20 via-fuchsia-100/12 to-transparent blur-3xl" />

      {/* Bunny avatar */}
      <BunnyBadge />

      {/* Input file chips */}
      <div className="flex flex-col items-center gap-1.5">
        <FileChip label="DOCX" accent="#6366F1" delay="0s" />
        <FileChip label="PPTX" accent="#818CF8" delay="0.3s" />
        <FileChip label="IMG" accent="#A78BFA" delay="0.6s" />
      </div>

      {/* Trail toward center */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
        <Trail count={6} />
      </div>
    </div>
  );
}

/* ═══════════════════ Right Workshop ═══════════════════ */
export function TeddyWorkshop() {
  return (
    <div className="relative select-none pointer-events-none flex flex-col items-center gap-4 pt-6">
      <div className="absolute top-8 w-52 h-52 rounded-full bg-gradient-to-br from-amber-200/20 via-yellow-100/12 to-transparent blur-3xl" />

      {/* Teddy avatar */}
      <TeddyBadge />

      {/* Output file chips */}
      <div className="flex flex-col items-center gap-1.5">
        <FileChip label="PDF" accent="#059669" delay="0s" />
        <FileChip label="PNG" accent="#10B981" delay="0.35s" />
        <FileChip label="HTML" accent="#34D399" delay="0.7s" />
      </div>

      {/* Trail from center */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
        <Trail count={6} />
      </div>
    </div>
  );
}
