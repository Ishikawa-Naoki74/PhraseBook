"use client";

import {
  VideoNavIcon,
  BookmarkNavIcon,
  WordNavIcon,
  AiNavIcon,
  ChartNavIcon,
  SettingsNavIcon,
  IdiomNavIcon,
  GridIcon,
} from "./icons";
import ChannelAvatar from "./ChannelAvatar";
import UsageWidget from "./UsageWidget";

export type View = "videos" | "phrases" | "words" | "idioms" | "ai" | "stats" | "settings";

export type ChannelInfo = { name: string; count: number; icon?: string };

type Props = {
  view: View;
  onChangeView: (view: View) => void;
  channels: ChannelInfo[];
  totalVideos: number;
  selectedChannel: string | null;
  onSelectChannel: (channel: string | null) => void;
};

const NAV_ITEMS: {
  key: View;
  title: string;
  subtitle: string;
  icon: (active: boolean) => React.ReactNode;
  badge?: string;
}[] = [
  { key: "videos", title: "動画一覧", subtitle: "保存したYouTube動画", icon: (a) => <VideoNavIcon active={a} /> },
  { key: "phrases", title: "フレーズ一覧", subtitle: "保存した英文フレーズ", icon: (a) => <BookmarkNavIcon active={a} /> },
  { key: "words", title: "単語一覧", subtitle: "保存した単語", icon: (a) => <WordNavIcon active={a} /> },
  { key: "idioms", title: "イディオム集", subtitle: "使い回せる構文・定型表現", icon: (a) => <IdiomNavIcon active={a} />, badge: "NEW" },
  { key: "ai", title: "AI活用", subtitle: "例文作成・言い換え・学習支援", icon: (a) => <AiNavIcon active={a} /> },
  { key: "stats", title: "学習記録", subtitle: "復習・クイズ・学習履歴", icon: (a) => <ChartNavIcon active={a} /> },
  { key: "settings", title: "設定", subtitle: "各種設定・データ管理", icon: (a) => <SettingsNavIcon active={a} /> },
];

function ChannelRow({
  label,
  count,
  avatar,
  selected,
  onClick,
}: {
  label: string;
  count: number;
  avatar: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={selected ? undefined : "nav-item"}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 9px",
        borderRadius: 10,
        cursor: "pointer",
        background: selected ? "rgba(124,92,255,0.14)" : undefined,
      }}
    >
      {avatar}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: 13,
          fontWeight: selected ? 600 : 500,
          color: selected ? "#c3b0ff" : "#c4c4d2",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <span
        style={{
          flexShrink: 0,
          fontSize: 11,
          fontWeight: 600,
          color: selected ? "#c3b0ff" : "#8a8a9e",
          background: selected ? "rgba(124,92,255,0.20)" : "rgba(255,255,255,0.05)",
          borderRadius: 6,
          padding: "1px 7px",
        }}
      >
        {count}
      </span>
    </div>
  );
}

export default function Sidebar({
  view,
  onChangeView,
  channels,
  totalVideos,
  selectedChannel,
  onSelectChannel,
}: Props) {
  return (
    <aside
      style={{
        width: 290,
        flexShrink: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        padding: "20px 16px 18px",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {NAV_ITEMS.map((item) => {
          const active = view === item.key;
          return (
            <div key={item.key}>
              <div
                className={active ? undefined : "nav-item"}
                onClick={() => onChangeView(item.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  padding: "12px 13px",
                  borderRadius: 14,
                  cursor: "pointer",
                  background: active
                    ? "linear-gradient(180deg,rgba(124,92,255,0.20),rgba(124,92,255,0.10))"
                    : undefined,
                  border: active ? "1px solid rgba(124,92,255,0.40)" : "1px solid transparent",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    borderRadius: 11,
                    background: active ? "linear-gradient(150deg,#8257ff,#6d3ce6)" : undefined,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8f8fa4",
                  }}
                >
                  {item.icon(active)}
                </div>
                <div style={{ lineHeight: 1.2, display: "flex", alignItems: "center", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: active ? "#fff" : "#d7d7e2" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: active ? "#b6a8e6" : "#7f7f93", marginTop: 2 }}>
                      {item.subtitle}
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      style={{
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        color: "#fff",
                        background: "linear-gradient(135deg,#8257ff,#6d3ce6)",
                        borderRadius: 6,
                        padding: "2px 6px",
                        alignSelf: "flex-start",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* 動画一覧の直下にチャンネル一覧を表示 */}
              {item.key === "videos" && view === "videos" && (
                <div style={{ margin: "6px 0 4px", paddingLeft: 10, display: "flex", flexDirection: "column", gap: 2 }}>
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: 0.6,
                      color: "#6f6f83",
                      padding: "2px 9px 4px",
                    }}
                  >
                    チャンネル
                  </div>
                  <ChannelRow
                    label="すべての動画"
                    count={totalVideos}
                    avatar={
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          flexShrink: 0,
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: selectedChannel === null ? "#fff" : "#b6a8e6",
                          background:
                            selectedChannel === null
                              ? "linear-gradient(150deg,#8257ff,#6d3ce6)"
                              : "rgba(124,92,255,0.14)",
                        }}
                      >
                        <GridIcon />
                      </div>
                    }
                    selected={selectedChannel === null}
                    onClick={() => onSelectChannel(null)}
                  />
                  {channels.map((ch) => (
                    <ChannelRow
                      key={ch.name}
                      label={ch.name}
                      count={ch.count}
                      avatar={
                        <ChannelAvatar
                          name={ch.name}
                          iconUrl={ch.icon}
                          selected={selectedChannel === ch.name}
                        />
                      }
                      selected={selectedChannel === ch.name}
                      onClick={() => onSelectChannel(ch.name)}
                    />
                  ))}
                  {channels.length === 0 && (
                    <div style={{ fontSize: 11.5, color: "#6f6f83", padding: "6px 9px" }}>
                      保存した動画のチャンネルがここに表示されます
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1, minHeight: 18 }} />

      <UsageWidget />
    </aside>
  );
}
