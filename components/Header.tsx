"use client";

import { useEffect, useRef } from "react";
import { LogoIcon, SearchIcon, PlusIcon, ChevronDownIcon } from "./icons";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  onAddVideo: () => void;
};

export default function Header({ search, onSearchChange, onAddVideo }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const kbdStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#9a9ab0",
    background: "#201f2c",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6,
    padding: "3px 7px",
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        height: 88,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}
    >
      <div style={{ width: 290, flexShrink: 0, display: "flex", alignItems: "center", gap: 13, padding: "0 22px" }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 13,
            background: "linear-gradient(150deg,#8b5cf6,#6d3ce6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 18px rgba(124,60,230,0.45)",
          }}
        >
          <LogoIcon />
        </div>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: 0.2 }}>PhraseBook</div>
          <div style={{ fontSize: 11.5, color: "#8a8a9e", marginTop: 2 }}>YouTubeで学ぶ、伝わる英語</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "0 24px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 600,
            display: "flex",
            alignItems: "center",
            gap: 12,
            height: 48,
            padding: "0 16px",
            background: "#14131d",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 13,
          }}
        >
          <SearchIcon />
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="動画やフレーズを検索..."
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "#e9e9f0",
              fontSize: 14.5,
              boxShadow: "none",
            }}
          />
          <div style={{ display: "flex", gap: 5 }}>
            <span style={kbdStyle}>⌘</span>
            <span style={{ ...kbdStyle, padding: "3px 8px" }}>K</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 22px" }}>
        <button
          className="btn-primary"
          onClick={onAddVideo}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            height: 48,
            padding: "0 22px",
            border: "none",
            borderRadius: 13,
            background: "linear-gradient(135deg,#8257ff,#6d3ce6)",
            color: "#fff",
            fontSize: 14.5,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(124,60,230,0.4)",
          }}
        >
          <PlusIcon />
          動画を追加
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              overflow: "hidden",
              background: "linear-gradient(135deg,#4b5563,#1f2937)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />
          <ChevronDownIcon size={18} />
        </div>
      </div>
    </header>
  );
}
