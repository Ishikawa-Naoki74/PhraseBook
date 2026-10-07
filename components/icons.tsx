// デザインカンプ(ダークテーマ版)の SVG をそのままコンポーネント化したもの

export function LogoIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6c-1.6-1-4.2-1.5-6.4-1.1a.7.7 0 0 0-.6.7v11.3c0 .45.4.78.85.7C7.9 17.3 10.3 17.8 12 19c1.7-1.2 4.1-1.7 6.15-1.4.45.08.85-.25.85-.7V5.6a.7.7 0 0 0-.6-.7C16.2 4.5 13.6 5 12 6z" />
      <path d="M12 6v13" />
    </svg>
  );
}

export function SearchIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#7f7f93" strokeWidth="1.9" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 15, color = "#8a8a9e", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function SortIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />
    </svg>
  );
}

export function VideoNavIcon({ active }: { active: boolean }) {
  return (
    <svg width={active ? 20 : 21} height={active ? 20 : 21} viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M10.5 9.2l4.2 2.8-4.2 2.8z" fill={active ? "#fff" : "currentColor"} stroke="none" />
    </svg>
  );
}

export function BookmarkNavIcon({ active }: { active: boolean }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3.5h12a1 1 0 0 1 1 1V20l-7-4.2L5 20V4.5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function WordNavIcon({ active }: { active: boolean }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "currentColor"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5V7" />
      <path d="M12 4v16M9 20h6" />
    </svg>
  );
}

export function AiNavIcon({ active }: { active: boolean }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "currentColor"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7z" />
      <path d="M18.5 3.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" />
    </svg>
  );
}

export function IdiomNavIcon({ active }: { active: boolean }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "currentColor"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2 2 2 0 0 1 2-2h4.5A1.5 1.5 0 0 1 20 5.5V17a1 1 0 0 1-1 1h-5a2 2 0 0 0-2 2 2 2 0 0 0-2-2H5a1 1 0 0 1-1-1V5.5Z" />
      <path d="M12 6v14" />
    </svg>
  );
}

export function ExtractIcon({ color = "#a78bff", size = 17 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h9M4 12h6M4 17h9" />
      <path d="M17 8l3 3-3 3" />
      <path d="M20 11h-5" />
    </svg>
  );
}

export function ChartNavIcon({ active }: { active: boolean }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16" />
      <rect x="5" y="12" width="3.4" height="6" rx="1" />
      <rect x="10.3" y="7" width="3.4" height="11" rx="1" />
      <rect x="15.6" y="10" width="3.4" height="8" rx="1" />
    </svg>
  );
}

export function SettingsNavIcon({ active }: { active: boolean }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "currentColor"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" />
    </svg>
  );
}

export function StarIcon({ filled, size = 20 }: { filled: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#f5b81a" : "none"}
      stroke={filled ? "none" : "#7f7f93"}
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.2L12 18.9 6.4 20.2l1.2-6.2L3 9.6l6.3-.8z" />
    </svg>
  );
}

export function DotsIcon({ size = 18, color = "#7f7f93", style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg style={style} width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <circle cx="5" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="19" cy="12" r="1.7" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5ec98a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4 4 10-10.5" />
    </svg>
  );
}

export function CheckWhiteIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4 4 10-10.5" />
    </svg>
  );
}

export function SparkleIcon({ color = "#a78bff", size = 17 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7z" />
      <path d="M18.5 3.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z" />
    </svg>
  );
}

export function RepeatIcon({ color = "#a78bff", size = 17 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 20L15 11" />
      <path d="M14.5 5.5l4 4" />
      <path d="M17.5 3.2l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z" />
    </svg>
  );
}

export function SwapWordIcon({ color = "#a78bff", size = 17 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h11M15 7l-3-3M15 7l-3 3" />
      <path d="M20 17H9M9 17l3-3M9 17l3 3" />
    </svg>
  );
}

export function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h6v6" />
      <path d="M20 4l-8.5 8.5" />
      <path d="M18 13.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H11" />
    </svg>
  );
}

export function YoutubeBadgeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5.5" width="20" height="13" rx="4" fill="#ff0000" />
      <path d="M10 9.5l5.5 2.5-5.5 2.5z" fill="#fff" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
      <path d="M8 5.5l11 6.5-11 6.5z" />
    </svg>
  );
}

export function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="8" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
      <rect x="13" y="13" width="8" height="8" rx="2" />
    </svg>
  );
}

export function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="4" width="18" height="4.5" rx="1.6" />
      <rect x="3" y="10" width="18" height="4.5" rx="1.6" />
      <rect x="3" y="16" width="18" height="4.5" rx="1.6" />
    </svg>
  );
}

export function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function BigStarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#f5b81a">
      <path d="M3 8l4.2 3.4L12 5l4.8 6.4L21 8l-1.4 10.5H4.4z" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a8a9e" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
